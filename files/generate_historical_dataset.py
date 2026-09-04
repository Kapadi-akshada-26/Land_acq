"""
PS26017 - Historical Land Acquisition Delay Dataset Generator
================================================================
Builds a research-grade, TIME-SERIES (multi-year snapshot per project)
dataset for training an early-delay-detection ML model, in the schema of
the user's reference CSV (land_acquisition_delay_prediction_10000.csv),
extended with the additional historical/geospatial/administrative columns
requested for PS26017.

IMPORTANT - HONESTY NOTE (read before using in a submission):
No unified, row-level, machine-learning-ready historical dataset of Indian
land acquisition projects is publicly downloadable today. data.gov.in, NHAI
dashboards, MoRTH reports, Railway project reports, NIP, Bhuvan and Census
2011 exist as PUBLIC REFERENCE SOURCES for real-world PATTERNS, RANGES, and
CATEGORIES (state names, districts, project types, rough delay behavior,
compensation/RR bottlenecks, terrain/forest patterns) -- not as a
downloadable table of individual project outcomes. This script therefore:
  1. Uses REAL categorical universes (actual state/UT names, real districts,
     real project types/ministries, Census-consistent urban/rural &
     population-density ranges, real terrain patterns).
  2. Encodes REAL, documented behavioral relationships (e.g. legal disputes
     and pending compensation are the most consistently cited delay drivers
     in CAG/parliamentary reports; forest clearance issues cluster in
     forested/tribal districts; urban projects draw more objections).
  3. SIMULATES the actual numeric values and per-project outcomes, because
     no real per-project numbers are publicly scrapeable in bulk.
  4. Includes a small set of REAL, NAMED flagship projects (Mumbai-Ahmedabad
     High Speed Rail, Delhi-Amritsar-Katra Expressway, Dwarka Expressway,
     Bengaluru-Chennai Expressway) as scenario anchors, built from their
     PUBLICLY REPORTED, well-known characteristics (multi-state land
     acquisition, well-documented delay history). Their YEAR-BY-YEAR NUMBERS
     ARE ILLUSTRATIVE RECREATIONS, not official figures scraped from any
     restricted or unpublished government system (per instruction, no claim
     of direct PM Gati Shakti data access is made anywhere in this dataset).

Every column is tagged in the accompanying source_mapping_table.md as
"Real Government-inspired", "Derived", or "Statistically Simulated" so
this is fully transparent to SIH judges rather than presented as verified
government data.
"""

import numpy as np
import pandas as pd
from datetime import date, timedelta

rng = np.random.default_rng(7)

# ---------------------------------------------------------------------
# CONFIG - increase N_PROJECTS to scale the dataset toward 50k-100k rows
# (avg ~5 snapshot years/project => N_PROJECTS=12000 gives ~55-60k rows)
# ---------------------------------------------------------------------
N_PROJECTS = 2600          # synthetic projects
N_FLAGSHIP = 10            # real named anchor projects
YEAR_MIN, YEAR_MAX = 2015, 2025

# ---------------------------------------------------------------------
# 1. REAL categorical universes
# ---------------------------------------------------------------------
STATE_DISTRICTS = {
    "Uttar Pradesh": ["Lucknow","Noida","Ghaziabad","Varanasi","Agra","Meerut","Prayagraj"],
    "Maharashtra": ["Pune","Nagpur","Nashik","Aurangabad","Thane","Raigad","Palghar"],
    "Madhya Pradesh": ["Bhopal","Indore","Jabalpur","Gwalior","Ujjain"],
    "Rajasthan": ["Jaipur","Jodhpur","Udaipur","Kota","Alwar"],
    "Gujarat": ["Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Vapi"],
    "Odisha": ["Bhubaneswar","Cuttack","Rourkela","Sambalpur","Keonjhar"],
    "West Bengal": ["Kolkata","Howrah","Durgapur","Siliguri"],
    "Tamil Nadu": ["Chennai","Coimbatore","Madurai","Tiruchirappalli","Vellore"],
    "Karnataka": ["Bengaluru","Mysuru","Hubballi","Belagavi"],
    "Bihar": ["Patna","Gaya","Bhagalpur","Muzaffarpur"],
    "Andhra Pradesh": ["Vijayawada","Visakhapatnam","Guntur","Tirupati"],
    "Telangana": ["Hyderabad","Warangal","Nizamabad"],
    "Haryana": ["Gurugram","Faridabad","Panipat","Karnal"],
    "Punjab": ["Ludhiana","Amritsar","Jalandhar","Patiala"],
    "Assam": ["Guwahati","Dibrugarh","Silchar"],
    "Kerala": ["Thiruvananthapuram","Kochi","Kozhikode"],
    "Jharkhand": ["Ranchi","Jamshedpur","Dhanbad","Chaibasa"],
    "Chhattisgarh": ["Raipur","Bilaspur","Durg","Bastar"],
    "Himachal Pradesh": ["Shimla","Kangra","Mandi"],
    "Uttarakhand": ["Dehradun","Haridwar","Nainital"],
    "Jammu and Kashmir": ["Jammu","Srinagar","Udhampur","Reasi"],
    "Delhi": ["New Delhi","Dwarka","Shahdara"],
    "Goa": ["North Goa","South Goa"],
}
STATES = list(STATE_DISTRICTS.keys())

PROJECT_TYPE_MINISTRY = {
    "Highway": "Ministry of Road Transport & Highways (MoRTH/NHAI)",
    "Railway": "Ministry of Railways",
    "Metro": "Ministry of Housing & Urban Affairs",
    "Airport": "Ministry of Civil Aviation (AAI)",
    "Power Transmission": "Ministry of Power",
    "Irrigation": "Ministry of Jal Shakti",
    "Industrial Corridor": "Dept. for Promotion of Industry & Internal Trade (DPIIT)",
}
PROJECT_TYPES = list(PROJECT_TYPE_MINISTRY.keys())
PROJECT_TYPE_WEIGHTS = [0.24, 0.16, 0.10, 0.06, 0.12, 0.14, 0.18]

TERRAIN_TYPES = ["Plain", "Hilly", "Forested", "Coastal", "Desert", "Riverine"]
FOREST_HEAVY_STATES = {"Jharkhand","Chhattisgarh","Odisha","Madhya Pradesh","Himachal Pradesh","Uttarakhand","Assam"}

# ---------------------------------------------------------------------
# 2. Real, named flagship projects (public, well-documented) - anchors only
# ---------------------------------------------------------------------
FLAGSHIP_PROJECTS = [
    # name, type, states(list), start_year, planned_months, known_delay_profile(High/Medium)
    ("Mumbai-Ahmedabad High Speed Rail (Bullet Train)", "Railway", ["Maharashtra","Gujarat"], 2017, 66, "High"),
    ("Delhi-Amritsar-Katra Expressway", "Highway", ["Haryana","Punjab","Jammu and Kashmir"], 2020, 42, "Medium"),
    ("Dwarka Expressway", "Highway", ["Delhi","Haryana"], 2016, 60, "High"),
    ("Bengaluru-Chennai Expressway", "Highway", ["Karnataka","Andhra Pradesh","Tamil Nadu"], 2021, 40, "Medium"),
    ("Delhi-Mumbai Expressway (select land parcels)", "Highway", ["Haryana","Rajasthan","Madhya Pradesh"], 2018, 48, "Medium"),
    ("Eastern Dedicated Freight Corridor (segment)", "Railway", ["Uttar Pradesh","Bihar"], 2016, 60, "Medium"),
    ("Western Dedicated Freight Corridor (segment)", "Railway", ["Gujarat","Rajasthan"], 2015, 66, "Medium"),
    ("Noida International Airport (Jewar)", "Airport", ["Uttar Pradesh"], 2019, 48, "Medium"),
    ("Bengaluru Metro Phase 2 (select corridor)", "Metro", ["Karnataka"], 2017, 54, "High"),
    ("Purvanchal-linked Industrial Corridor node", "Industrial Corridor", ["Uttar Pradesh"], 2019, 36, "Low"),
]

def clip(v, lo=0, hi=100):
    return max(lo, min(hi, v))

# ---------------------------------------------------------------------
# 3. Build project master registry (one row per project, before expansion)
# ---------------------------------------------------------------------
projects = []

def make_project(pid, name, ptype, state, district, start_year, planned_months, is_flagship, delay_bias):
    ministry = PROJECT_TYPE_MINISTRY[ptype]
    land_required_ha = round(float(np.clip(rng.lognormal(2.7, 1.0), 15, 1900)), 1)
    affected_families = int(np.clip(rng.negative_binomial(6, 0.06), 5, 5200))
    urban_rural = "Urban" if district in ["Mumbai","Pune","Bengaluru","Chennai","Hyderabad","Ahmedabad",
                                           "Gurugram","Noida","Kolkata","New Delhi","Dwarka","Vijayawada",
                                           "Ludhiana","Jaipur"] or rng.random() < 0.3 else "Rural"
    population_density = int(np.clip(rng.normal(4200 if urban_rural=="Urban" else 550, 1600 if urban_rural=="Urban" else 350), 40, 32000))
    forest_prob = 0.45 if state in FOREST_HEAVY_STATES else 0.12
    terrain_weights = np.array([0.40, 0.15, forest_prob, 0.12, 0.06, 0.10])
    terrain_weights = terrain_weights / terrain_weights.sum()
    terrain = rng.choice(TERRAIN_TYPES, p=terrain_weights)
    flood_prone = 1 if (terrain in ["Coastal","Riverine"] and rng.random() < 0.55) else (1 if rng.random()<0.08 else 0)
    dist_highway = round(float(np.clip(rng.exponential(8), 0.2, 80)), 1)
    dist_railway = round(float(np.clip(rng.exponential(12), 0.2, 100)), 1)

    # ---- underlying (latent) drivers that shape the WHOLE project's trajectory ----
    legal_prone = rng.random() < (0.30 if urban_rural=="Urban" else 0.18)
    forest_clear_needed = rng.random() < forest_prob
    env_clear_needed = ptype in ["Highway","Railway","Power Transmission","Industrial Corridor","Airport"] or rng.random()<0.3
    compensation_friction = np.clip(rng.normal(45, 20), 5, 95)  # higher = slower payout
    admin_efficiency = np.clip(rng.normal(60, 20), 5, 100)      # higher = faster approvals
    objection_intensity = np.clip((0.5 if urban_rural=="Urban" else 0.2) * 100 + rng.normal(0, 15), 0, 100)

    projects.append(dict(
        project_id=pid, project_name=name, project_type=ptype, ministry=ministry,
        state=state, district=district, is_flagship=is_flagship,
        start_year=start_year, planned_duration_months=planned_months,
        total_land_required_hectares=land_required_ha, affected_families=affected_families,
        urban_rural=urban_rural, population_density=population_density, terrain_type=terrain,
        flood_prone=flood_prone, distance_to_highway_km=dist_highway, distance_to_railway_km=dist_railway,
        legal_prone=legal_prone, forest_clearance_needed=forest_clear_needed,
        env_clearance_needed=env_clear_needed, compensation_friction=compensation_friction,
        admin_efficiency=admin_efficiency, objection_intensity=objection_intensity,
        delay_bias=delay_bias,
    ))

pid_counter = 1
# flagship projects first
for name, ptype, states_list, sy, months, bias in FLAGSHIP_PROJECTS:
    state = states_list[0]
    district = rng.choice(STATE_DISTRICTS[state])
    make_project(f"LA-FLAG-{pid_counter:03d}", name, ptype, state, district, sy, months, True, bias)
    pid_counter += 1

# synthetic projects
for i in range(N_PROJECTS):
    ptype = rng.choice(PROJECT_TYPES, p=PROJECT_TYPE_WEIGHTS)
    state = rng.choice(STATES)
    district = rng.choice(STATE_DISTRICTS[state])
    start_year = int(rng.integers(YEAR_MIN, YEAR_MAX - 1))  # leave room for >=1 snapshot yr
    planned_months = int(np.clip(rng.normal(48, 20), 12, 96))
    bias = rng.choice(["Low","Medium","High"], p=[0.35,0.40,0.25])
    make_project(f"LA-{100000+pid_counter}", f"{ptype} Project {pid_counter}", ptype, state, district,
                 start_year, planned_months, False, bias)
    pid_counter += 1

proj_df = pd.DataFrame(projects)
print("Projects created:", len(proj_df))

# ---------------------------------------------------------------------
# 4. Compute FINAL project-level outcome (delay_days, delay_risk)
#    This is the ML target -- computed once per project from latent
#    drivers, then the SAME outcome is attached to every yearly snapshot
#    row of that project (early-detection framing: predict the eventual
#    outcome from features observed at any given year).
# ---------------------------------------------------------------------
bias_shift = {"Low": -18, "Medium": 0, "High": 22}

def compute_outcome(row):
    risk = 0.0
    risk += 0.22 * row["compensation_friction"]
    risk += 0.16 * (row["legal_prone"] * rng.integers(40, 90))
    risk += 0.12 * (1 - row["admin_efficiency"] / 100) * 100
    risk += 0.10 * row["objection_intensity"]
    risk += 0.09 * (row["forest_clearance_needed"] * rng.integers(30, 80))
    risk += 0.08 * (row["env_clearance_needed"] * rng.integers(15, 55))
    risk += 0.06 * clip(row["affected_families"] / 40)
    risk += 0.05 * clip(row["total_land_required_hectares"] / 15)
    risk += 0.04 * (row["flood_prone"] * 60)
    risk += 0.04 * (10 if row["terrain_type"] in ["Hilly","Forested"] else 0)
    risk += bias_shift[row["delay_bias"]]
    risk += rng.normal(0, 10)
    return clip(risk)

proj_df["risk_score"] = proj_df.apply(compute_outcome, axis=1)

# Map risk_score -> delay_days using the requested class distribution & ranges
# Low: 0-90d (45%), Medium: 91-365d (35%), High: 366-1500d (20%)
q_low, q_med = np.quantile(proj_df["risk_score"], [0.45, 0.80])

def score_to_delay(score):
    if score <= q_low:
        risk_cat = "Low"
        days = int(np.clip(rng.gamma(2.0, 22), 0, 90))
    elif score <= q_med:
        risk_cat = "Medium"
        days = int(np.clip(rng.gamma(2.2, 60), 91, 365))
    else:
        risk_cat = "High"
        days = int(np.clip(rng.gamma(2.5, 220), 366, 1500))
    return pd.Series({"delay_risk": risk_cat, "delay_days": days})

proj_df = pd.concat([proj_df, proj_df["risk_score"].apply(score_to_delay)], axis=1)

# nudge flagship projects toward their known public delay reputation
flag_bias_map = {p[0]: p[5] for p in FLAGSHIP_PROJECTS}
for idx, r in proj_df[proj_df["is_flagship"]].iterrows():
    known = flag_bias_map.get(r["project_name"])
    if known == "High" and r["delay_risk"] != "High":
        proj_df.loc[idx, "delay_risk"] = "High"
        proj_df.loc[idx, "delay_days"] = int(np.clip(rng.gamma(2.5, 220), 366, 1500))

print(proj_df["delay_risk"].value_counts(normalize=True))

# ---------------------------------------------------------------------
# 5. Expand into yearly historical snapshots per project (2015-2025)
# ---------------------------------------------------------------------
COMP_STATUS_ORDER = ["Not Started", "Partially Disbursed", "Substantially Disbursed", "Fully Disbursed"]
REHAB_STATUS_ORDER = ["Not Started", "Partially Complete", "Substantially Complete", "Complete"]
APPROVAL_STATUS_ORDER = ["Pending", "Under Review", "Partially Approved", "Approved"]
CLEARANCE_STATES = ["Pending", "Approved", "Not Required"]

rows = []
for _, p in proj_df.iterrows():
    start_year = int(p["start_year"])
    planned_years = max(1, round(p["planned_duration_months"] / 12))
    planned_end_year = min(YEAR_MAX, start_year + planned_years)
    delay_years_extra = round(p["delay_days"] / 365)
    actual_end_year = min(YEAR_MAX, planned_end_year + delay_years_extra) if p["delay_risk"] != "Low" else min(YEAR_MAX, planned_end_year)
    last_snapshot_year = min(YEAR_MAX, max(actual_end_year, start_year))

    n_years = last_snapshot_year - start_year + 1
    progress_speed = {"Low": 1.15, "Medium": 0.85, "High": 0.5}[p["delay_risk"]]

    planned_start_date = date(start_year, int(rng.integers(1, 13)), int(rng.integers(1, 28)))
    planned_end_date = date(min(planned_end_year, 2035), planned_start_date.month, planned_start_date.day)
    actual_end_date = (date(min(actual_end_year, 2035), planned_start_date.month, planned_start_date.day)
                        if p["delay_risk"] != "Low" else planned_end_date)

    legal_cases_final = int(rng.poisson(3.5)) if p["legal_prone"] else int(rng.poisson(0.4))
    objections_final = int(np.clip(rng.poisson(p["objection_intensity"] / 8), 0, 400))

    for k, yr in enumerate(range(start_year, start_year + n_years)):
        t = (k + 1) / n_years  # progress fraction of elapsed timeline
        # S-curve-ish acquisition progress, slowed by risk
        acquisition_pct = clip(100 * (1 - np.exp(-3 * t * progress_speed)) + rng.normal(0, 4))
        possession_pct = clip(acquisition_pct * rng.uniform(0.75, 0.95))
        land_acquired_ha = round(p["total_land_required_hectares"] * acquisition_pct / 100, 1)

        comp_pending_pct = clip(100 - 100 * (1 - np.exp(-2.2 * t * progress_speed)) + rng.normal(0, 5))
        comp_idx = int(np.clip((100 - comp_pending_pct) / 100 * 3, 0, 3))
        compensation_status = COMP_STATUS_ORDER[comp_idx]

        rehab_pct = clip(acquisition_pct * rng.uniform(0.6, 0.9))
        rehab_idx = int(np.clip(rehab_pct / 100 * 3, 0, 3))
        rehabilitation_status = REHAB_STATUS_ORDER[rehab_idx]

        approval_idx = int(np.clip(t * progress_speed * 3, 0, 3))
        government_approval_status = APPROVAL_STATUS_ORDER[approval_idx]
        pending_approvals = max(0, 4 - approval_idx - int(rng.integers(0, 2)))

        env_clearance = ("Approved" if (not p["env_clearance_needed"] or t*progress_speed > 0.4) else "Pending") \
                          if p["env_clearance_needed"] else "Not Required"
        forest_clearance = ("Approved" if (not p["forest_clearance_needed"] or t*progress_speed > 0.55) else "Pending") \
                             if p["forest_clearance_needed"] else "Not Required"

        legal_cases = int(round(legal_cases_final * min(1.0, t + 0.15))) if p["legal_prone"] else int(rng.integers(0, 1))
        legal_dispute = "Yes" if legal_cases > 0 else "No"
        objection_count = int(round(objections_final * min(1.0, t + 0.2)))

        previous_delay_days = int(max(0, (p["delay_days"] * (1 - t)) + rng.normal(0, 15))) if p["delay_risk"] != "Low" else int(max(0, rng.normal(5, 8)))

        if k == n_years - 1:
            project_status = "Near Completion" if acquisition_pct > 85 else "In Progress"
        elif k == 0:
            project_status = "Early Stage"
        else:
            project_status = "In Progress"

        rows.append({
            "project_id": p["project_id"],
            "project_name": p["project_name"],
            "project_type": p["project_type"],
            "ministry": p["ministry"],
            "state": p["state"],
            "district": p["district"],
            "year": yr,
            "total_land_required_hectares": p["total_land_required_hectares"],
            "land_acquired_hectares": land_acquired_ha,
            "land_acquired_percent": round(acquisition_pct, 1),
            "acquisition_percentage": round(acquisition_pct, 1),  # alias, requested column name
            "pending_approvals": pending_approvals,
            "compensation_status": compensation_status,
            "compensation_pending_percent": round(comp_pending_pct, 1),
            "rehabilitation_status": rehabilitation_status,
            "government_approval_status": government_approval_status,
            "environmental_clearance": env_clearance,
            "forest_clearance": forest_clearance,
            "legal_dispute": legal_dispute,
            "legal_cases": legal_cases,
            "court_case_count": legal_cases,
            "objection_count": objection_count,
            "affected_families": p["affected_families"],
            "rr_completed_percent": round(rehab_pct, 1),
            "possession_percent": round(possession_pct, 1),
            "planned_duration_months": p["planned_duration_months"],
            "population_density": p["population_density"],
            "urban_rural": p["urban_rural"],
            "terrain_type": p["terrain_type"],
            "flood_prone": int(p["flood_prone"]),
            "distance_to_highway_km": p["distance_to_highway_km"],
            "distance_to_railway_km": p["distance_to_railway_km"],
            "planned_start_date": planned_start_date,
            "planned_end_date": planned_end_date,
            "actual_end_date": actual_end_date if yr == (start_year + n_years - 1) else None,
            "previous_delay_days": previous_delay_days,
            "delay_days": int(p["delay_days"]),
            "delay_risk": p["delay_risk"],
            "project_status": project_status,
            "is_flagship_project": bool(p["is_flagship"]),
        })

hist_df = pd.DataFrame(rows)
print("Total snapshot rows:", len(hist_df))

out_path = "/mnt/user-data/outputs/land_acquisition_historical_dataset.csv"
hist_df.to_csv(out_path, index=False)
print("Saved:", out_path)
print(hist_df["delay_risk"].value_counts(normalize=True))
print(hist_df.groupby("delay_risk")["delay_days"].agg(["min","max","mean"]))
