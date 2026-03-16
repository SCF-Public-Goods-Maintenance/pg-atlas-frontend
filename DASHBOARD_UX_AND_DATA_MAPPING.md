# PG Atlas Dashboard — UX & Data Mapping

This document summarizes user stories for the **PG Atlas frontend dashboard**, derived from the [PG Atlas architecture docs](https://github.com/SCF-Public-Goods-Maintenance/scf-public-goods-maintenance.github.io) (dashboard, overview, API) and the [pg-atlas-backend](https://github.com/SCF-Public-Goods-Maintenance/pg-atlas-backend) API. The dashboard is public, read-only, and would consumes the FastAPI backend via REST (and eventually the OpenAPI-generated TypeScript SDK).

---

## Personas & User Stories

### 1. As a PG maintainer

| ID | Story | Backend support |
|----|--------|------------------|
| M1 | As a **PG maintainer**, I want to see my tool's **criticality score**, **pony factor**, and **adoption trends** so that I can understand its ecosystem impact and prioritize maintenance. | `GET /projects/{canonical_id}`, `GET /scores/{canonical_id}` — metadata, aggregated metrics, score breakdown. |
| M2 | As a **PG maintainer**, I want to view **direct and transitive dependents** (with active filters) so that I can identify who relies on me and reach out for feedback or contributions. | `GET /projects/{canonical_id}/dependents`, `GET /repos/{canonical_id}/dependents`, `GET /repos/{canonical_id}/blast-radius` (for pg_root repos). |

### 2. As an SCF voter / Pilot (Tansu round participant)

| ID | Story | Backend support |
|----|--------|------------------|
| V1 | As an **SCF voter / Pilot**, I want a **searchable leaderboard** of PGs ranked by metrics (criticality, risk flags) so that I can quickly evaluate proposals with objective context. | `GET /scores` (sort by criticality, min_criticality, level=project/repo), `GET /projects` (filters: type, activity_status, search). |
| V2 | As an **SCF voter / Pilot**, I want to **drill into a specific PG's dependency graph and score breakdown** so that I can inform my NQG-weighted vote. | `GET /projects/{canonical_id}`, `GET /scores/{canonical_id}`, `GET /projects/{canonical_id}/dependents`, `GET /projects/{canonical_id}/dependencies`; sub-graph data for viz. |

### 3. As a dependent project team (SCF Build applicant)

| ID | Story | Backend support |
|----|--------|------------------|
| D1 | As a **dependent project team**, I want to **explore the PG landscape** and see **reliability scores** for reusable tools so that I can decide what to integrate. | `GET /projects`, `GET /scores`, leaderboard + filters; project/repo detail for scores. |
| D2 | As a **dependent project team**, I want to **visualize my own project's dependencies** so that I can ensure I'm building on healthy infrastructure. | `GET /projects/{canonical_id}/dependencies`, `GET /repos/{canonical_id}/dependencies`; graph export or sub-graph for visualization. |

### 4. As a general community member or observer

| ID | Story | Backend support |
|----|--------|------------------|
| C1 | As a **general community member**, I want an **intuitive overview of ecosystem health** (active PG coverage, pony factor distribution, top critical tools) so that I can gauge Stellar/Soroban resilience. | `GET /metadata` (ecosystem summary), `GET /scores` (top by criticality), `GET /projects` with activity_status filter. |
| C2 | As a **general community member**, I want to **search and browse the full graph** so that I can understand interconnections and spot risks or gaps. | `GET /projects`, `GET /repos`, search/filters; `GET /export/graph` for full graph (v1); v0 focuses on leaderboard + PG detail + sub-graph. |

---

## Desired UX (from docs)

- **Landing page**: Ecosystem summary (total active nodes, dependency coverage %, risk heatmap, top 10 critical PGs). → `GET /metadata`, `GET /scores`, `GET /projects`.
- **Searchable leaderboard**: Table with filters/sort (criticality, pony factor, adoption, activity status), risk flags (e.g. pony_factor == 1). → `GET /scores`, `GET /projects`.
- **PG detail pages**: Score breakdown, direct dependents list, **interactive dependency subgraph** (v0 in scope). → `GET /projects/{id}`, `GET /scores/{id}`, dependents/dependencies endpoints.
- **Graph explorer**: Full/zoomed interactive view (v1; deferred). → `GET /export/graph` when needed.

**UX principles**: Public, zero-auth, mobile-responsive; fast loading (cached metrics, lazy graph); tooltips for metrics; export (CSV tables, PNG/SVG graphs); accessibility (dark/light, keyboard, screen readers); progressive disclosure (summary → detail → graph).

---

## v0 scope (dashboard technology decision)

- **In scope**: Leaderboard + basic PG detail pages + **sub-graph explorer on PG detail pages** (so voters/maintainers see dependency graph and score breakdown). Use **Vite + TypeScript (React)**, consume backend via REST and dogfood OpenAPI-generated TypeScript SDK.
- **Deferred to v1**: Full-graph explorer (not required for Q2 PG Award).

---

## Backend API endpoints (reference)

| Area | Endpoints |
|------|-----------|
| Health & metadata | `GET /health`, `GET /metadata` |
| Projects | `GET /projects`, `GET /projects/{canonical_id}`, `GET /projects/{canonical_id}/repos`, `GET /projects/{canonical_id}/dependents`, `GET /projects/{canonical_id}/dependencies` |
| Repos | `GET /repos`, `GET /repos/{canonical_id}`, `GET /repos/{canonical_id}/dependents`, `GET /repos/{canonical_id}/dependencies`, `GET /repos/{canonical_id}/blast-radius` |
| Scores | `GET /scores`, `GET /scores/{canonical_id}` |
| Export | `GET /export/projects`, `GET /export/repos`, `GET /export/graph` |

*Note: Backend may implement these incrementally; health and ingestion (SBOM) exist first. Dashboard UI should handle missing or placeholder endpoints gracefully.*

---

## DB field <> UI element mapping proposal

This section sketches how core backend fields map onto the dashboard UI. It is intentionally opinionated but v0-friendly; refine it once the OpenAPI schema is finalized.

### Projects / Repos (entities shown in leaderboard and detail)

| Entity | Example fields (backend) | UI element(s) | Screen(s) |
|--------|--------------------------|---------------|-----------|
| `Project` | `canonical_id`, `name`, `slug`, `project_type`, `activity_status`, `homepage_url`, `repo_count` | Leaderboard row label (name), secondary badge (type), activity pill, link-out icon (homepage), small text for repo count | Landing (top PGs), Leaderboard, PG detail header |
| `Project` | `description`, `tags` | Tooltip / expandable "About" panel; chips for tags | PG detail (overview tab) |
| `Project` | `ecosystem` / `language` fields (if present) | Filter chips and column pills | Leaderboard filters, PG detail metadata |
| `Repo` | `canonical_id`, `name`, `host`, `owner`, `stars`, `forks`, `is_pg_root` | Nested table rows / list under "Repos" section; badges for `is_pg_root`, star count display | PG detail (repos section) |

### Scores (metrics / risk signals)

| Entity | Example fields (backend) | UI element(s) | Screen(s) |
|--------|--------------------------|---------------|-----------|
| `Score` | `criticality`, `min_criticality`, `p95_criticality` | Numeric column + colored bar; sort handles on leaderboard | Landing (top PGs), Leaderboard, PG detail (score summary) |
| `Score` | `pony_factor` | Numeric column; red risk flag icon when `pony_factor == 1`; tooltip explaining pony factor | Leaderboard, PG detail (risk panel) |
| `Score` | `adoption_count`, `adoption_trend` | Sparkline in row + numeric count; trend arrow (↑/→/↓) | Leaderboard, PG detail (adoption section) |
| `Score` | `bus_factor`, `maintainer_count`, `commit_frequency` (or similar) | Small "maintenance health" composite widget (stacked bars or pill list) | PG detail (maintenance tab/section) |

### Metadata / Ecosystem summary

| Entity | Example fields (backend) | UI element(s) | Screen(s) |
|--------|--------------------------|---------------|-----------|
| `Metadata` | `total_projects`, `active_projects`, `inactive_projects` | KPI cards (big numbers) and donut chart of active vs inactive | Landing |
| `Metadata` | `dependency_coverage_pct` | Progress bar with label; tooltip with definition | Landing hero |
| `Metadata` | distribution buckets (e.g. `pony_factor_histogram`, `criticality_histogram`) | Small multiples / histogram charts; click to filter leaderboard | Landing, Leaderboard (filter side panel) |

### Graph / Dependencies

| Entity | Example fields (backend) | UI element(s) | Screen(s) |
|--------|--------------------------|---------------|-----------|
| `Dependency` edge | `from_canonical_id`, `to_canonical_id`, `edge_type` (`direct`, `transitive`, `blast_radius`) | Edges in interactive sub-graph; edge color/style by `edge_type`; hover tooltip with IDs | PG detail (sub-graph explorer) |
| `Project`/`Repo` node | `canonical_id`, `name`, `is_pg_root`, `role` (if present) | Graph nodes with shape/color encoding (PG root, dependent, focal PG); label on hover | PG detail (sub-graph explorer) |
| Export | any graph node/edge attributes | "Download CSV" / "Download PNG/SVG" actions on table/graph; reuse same field names in exported files | Leaderboard tables, PG detail graph/table exports |

**Notes for implementation**:

- **Naming alignment**: Prefer keeping UI prop names close to backend field names (e.g. `criticality`, `pony_factor`) and adapt only where needed for display (e.g. `criticalityDisplay`, `ponyFactorFlag`).
- **Resilience to missing data**: Where fields may be `null` or not yet implemented, show graceful placeholders (`—`, "N/A") and retain tooltips explaining when data will appear.

---

## Suggested implementation order

1. **Landing + metadata**: Call `GET /health`, `GET /metadata`; show ecosystem summary and top PGs (from `GET /scores` or `GET /projects` when available).
2. **Leaderboard**: `GET /scores` (or `GET /projects` with sort/filter); table with criticality, pony factor, adoption, activity status; risk flags for pony_factor == 1.
3. **PG detail**: `GET /projects/{id}`, `GET /scores/{id}`; score breakdown, list of dependents/dependencies via project and repo endpoints.
4. **Sub-graph explorer (PG detail)**: Use dependents/dependencies (and optionally blast-radius) to build an interactive sub-graph (e.g. Cytoscape.js or Sigma.js) on the PG detail page.
5. **Export**: CSV for tables (from existing list responses), PNG/SVG for graph (client-side export from viz).
6. **Accessibility & polish**: Dark/light mode, tooltips for metrics, keyboard nav, screen-reader labels.

---

*Sources: [docs/pg-atlas/dashboard.md](https://github.com/SCF-Public-Goods-Maintenance/scf-public-goods-maintenance.github.io/blob/main/docs/pg-atlas/dashboard.md), [docs/pg-atlas/api.md](https://github.com/SCF-Public-Goods-Maintenance/scf-public-goods-maintenance.github.io/blob/main/docs/pg-atlas/api.md), [docs/pg-atlas/overview.md](https://github.com/SCF-Public-Goods-Maintenance/scf-public-goods-maintenance.github.io/blob/main/docs/pg-atlas/overview.md), pg-atlas-backend (FastAPI routers, health, ingestion).*
