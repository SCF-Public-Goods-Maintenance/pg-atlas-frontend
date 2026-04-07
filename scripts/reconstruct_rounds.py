import csv
import json
import os
import re

# Configuration
DB_DUMP = 'src/services/apiAdapter.json'
Q4_CSV = "data/Public Goods Award - Q4 '25 [Public].csv"
Q1_CSV = "data/Public Goods Award - Q1 '26 [Public].csv"
OUTPUT_DIR = 'src/data/rounds'

# Dates provided by USER
ROUNDS_CONFIG = {
    '2025Q3': {'name': 'Public Goods Award', 'year': 2025, 'quarter': 3, 'voting_closed': '2025-07-14'},
    '2025Q4': {'name': 'Public Goods Award', 'year': 2025, 'quarter': 4, 'voting_closed': '2025-10-18'},
    '2026Q1': {'name': 'Public Goods Award', 'year': 2026, 'quarter': 1, 'voting_closed': '2026-01-25'},
}

def load_db_mapping():
    try:
        with open(DB_DUMP, 'r') as f:
            data = json.load(f)
            return {p['display_name'].strip().lower(): p['canonical_id'] for p in data.get('projects', [])}
    except Exception as e:
        print(f"Warning: Could not load DB dump {DB_DUMP}: {e}")
        return {}

def extract_tranche(status_str):
    if not status_str:
        return 0
    # Exactly "Awarded" means 100%
    if status_str == "Awarded":
        return 1.0
        
    # Look for patterns like (50%) or 50%
    match = re.search(r'(\d+)%', status_str)
    if match:
        return int(match.group(1)) / 100.0
    return 0

def map_project(row, db_map):
    name = row.get('Submission / Project', '').strip()
    if not name:
        return None
        
    cleaned_name = name.lower()
    canonical_id = db_map.get(cleaned_name, "")
    
    # Logic for Awarded status
    status = row.get('Status', '')
    awarded_col = row.get('Awarded', '') # In Q1 '26 CSV
    
    awarded_status = "no"
    if (awarded_col == 'checked') or (status == 'Awarded') or ('Awarded (' in status):
        awarded_status = "yes"
    elif status == 'Ineligible':
        awarded_status = "ineligible"
    
    tranche = extract_tranche(status)
    
    return {
        'canonical_id': canonical_id,
        'name': name,
        'awarded': awarded_status,
        'tranche_completion': tranche
    }

def write_yaml(data, output_path):
    with open(output_path, 'w') as f:
        f.write(f"name: \"{data['name']}\"\n")
        f.write(f"year: {data['year']}\n")
        f.write(f"quarter: {data['quarter']}\n")
        f.write(f"voting_closed: {data['voting_closed']}\n")
        f.write("projects:\n")
        for p in data['projects']:
            cid = p['canonical_id'] if p['canonical_id'] else ""
            f.write(f"  - canonical_id: {cid}\n")
            f.write(f"    name: \"{p['name']}\"\n")
            f.write(f"    awarded: \"{p['awarded']}\"\n")
            f.write(f"    tranche_completion: {p['tranche_completion']}\n")

def process():
    db_map = load_db_mapping()
    
    # Process Q4 '25 and extract Q3 '25
    q4_projects = []
    q3_projects = []
    
    with open(Q4_CSV, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            project = map_project(row, db_map)
            if not project: continue
            
            q4_projects.append(project)
            
            # Reconstruction logic for Q3
            if row.get('Public Good Award First Time?') == "No, I've submitted before to this award":
                # For Q3, we don't necessarily know their award status from this CSV, 
                # but if they were in Q4 as Awarded, they likely carried that status over.
                q3_projects.append(project)

    # Process Q1 '26
    q1_projects = []
    try:
        with open(Q1_CSV, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                project = map_project(row, db_map)
                if not project: continue
                q1_projects.append(project)
    except FileNotFoundError:
        print(f"Warning: {Q1_CSV} not found, skipping Q1 '26")

    # Save outputs
    for round_id, projects in [('2025Q3', q3_projects), ('2025Q4', q4_projects), ('2026Q1', q1_projects)]:
        if not projects: continue
        
        round_data = ROUNDS_CONFIG[round_id].copy()
        round_data['projects'] = projects
        
        # Write YAML
        write_yaml(round_data, os.path.join(OUTPUT_DIR, f"{round_id}.yaml"))
        
        # Write JSON (for Frontend import)
        with open(os.path.join(OUTPUT_DIR, f"{round_id}.json"), 'w') as f:
            json.dump(round_data, f, indent=2)
            
    print(f"Successfully reconstructed rounds with Award metadata. Generated in {OUTPUT_DIR}")

if __name__ == "__main__":
    process()
