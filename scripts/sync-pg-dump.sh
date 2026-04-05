#!/bin/bash
set -e

# Config
CONTAINER_NAME="pg-atlas-db-test"
PORT=5444
# For use INSIDE the container
DB_NAME="pg_atlas"
DB_USER="atlas"
DUMP_FILE="data/pg-atlas-v0.2-dev.dump"
OUTPUT_MOCK="src/mocks/liveApiMock.json"

echo "🐘 [PG Atlas] Starting DB Dump Sync..."

# 1. Start Docker if not running
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "🗑 Removing existing container to reset port/version..."
    docker rm -f $CONTAINER_NAME
fi

echo "🆕 Creating new PG17 container on port $PORT..."
DB_PASSWORD="${PG_ATLAS_PASSWORD:-changeme}"

echo "🆕 Creating new PG17 container on port $PORT..."
docker run --name $CONTAINER_NAME \
    -e POSTGRES_USER=$DB_USER \
    -e POSTGRES_PASSWORD="$DB_PASSWORD" \
    -e POSTGRES_DB=$DB_NAME \
    -p $PORT:5432 \
    -d postgres:17

echo "⏳ Waiting for DB to wake up..."
# Simple retry loop
for i in {1..15}; do
    if docker exec $CONTAINER_NAME pg_isready -U $DB_USER > /dev/null 2>&1; then
        echo "✅ Database port is open..."
        break
    fi
    if [ $i -eq 15 ]; then
        echo "❌ Database failed to start in time."
        exit 1
    fi
    echo "..."
    sleep 2
done

echo "😴 Giving the engine 5 extra seconds to fully initialize..."
sleep 5


# 2. Reset Schema & Restore Dump
echo "🌱 Pre-seeding missing Enums (Fix for all missing type errors)..."
docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "
  DO \$\$ BEGIN
    CREATE TYPE public.vertex_type AS ENUM ('repo', 'external-repo');
  EXCEPTION WHEN duplicate_object THEN null; END \$\$;
  DO \$\$ BEGIN
    CREATE TYPE public.project_type AS ENUM ('public-good', 'scf-project');
  EXCEPTION WHEN duplicate_object THEN null; END \$\$;
  DO \$\$ BEGIN
    CREATE TYPE public.activity_status AS ENUM ('live', 'in-dev', 'discontinued', 'non-responsive');
  EXCEPTION WHEN duplicate_object THEN null; END \$\$;
  DO \$\$ BEGIN
    CREATE TYPE public.visibility AS ENUM ('public', 'private');
  EXCEPTION WHEN duplicate_object THEN null; END \$\$;
  DO \$\$ BEGIN
    CREATE TYPE public.edge_confidence AS ENUM ('verified-sbom', 'inferred-shadow');
  EXCEPTION WHEN duplicate_object THEN null; END \$\$;
  DO \$\$ BEGIN
    CREATE TYPE public.submission_status AS ENUM ('pending', 'processed', 'failed');
  EXCEPTION WHEN duplicate_object THEN null; END \$\$;
"
    WHEN duplicate_object THEN null;
  END \$\$;
"


echo "📥 Restoring dump: $DUMP_FILE..."
if [ -f "$DUMP_FILE" ]; then

    # We pipe the file into pg_restore inside the container.
    # Removed --clean and --if-exists since we manually wiped the schema above.
    cat "$DUMP_FILE" | docker exec -i $CONTAINER_NAME pg_restore \
      -v -U $DB_USER -d $DB_NAME \
      --no-owner --no-privileges --exit-on-error
else
    echo "❌ Error: $DUMP_FILE not found."
    exit 1
fi


# 3. Discovery: List tables to verify names
echo "🔍 Discovering Tables..."
# Using -i instead of -it for script-friendly output
docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "\dt"

# 4. Extract key metrics for Frontend Mocks
echo "📊 Extracting live data for mocks..."
docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "
SELECT json_build_object(
  'lastSync', now(),
  'summary', json_build_object(
    'total_projects', (SELECT count(*) FROM projects),
    'total_nodes', (SELECT count(*) FROM repo_vertices),
    'total_edges', (SELECT count(*) FROM depends_on),
    'active_count', (SELECT count(*) FROM projects WHERE activity_status = 'live')
  ),
  'projects', (SELECT json_agg(p) FROM (SELECT * FROM projects) p)
)
" -t | jq . > "$OUTPUT_MOCK"



echo "✅ [PG Atlas] Sync Complete! Data saved to $OUTPUT_MOCK"

