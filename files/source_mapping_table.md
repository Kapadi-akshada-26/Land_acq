# Source Mapping Table - land_acquisition_historical_dataset.csv

Every column is classified as one of:
- **Real Government-inspired (RGI)** — the *category/universe* of values is
  real and publicly verifiable (state/district names, ministries, project
  types, Census-consistent density ranges), even though the specific
  per-row number is generated.
- **Derived (D)** — computed from other columns via a documented, realistic
  formula/relationship (e.g. hectares = required × acquisition%).
- **Statistically Simulated (SS)** — the value itself is drawn from a
  distribution calibrated to match publicly reported *patterns* (e.g. CAG
  audit findings that legal disputes and pending compensation are the
  leading delay causes), not read from any specific real record.

| Column | Classification | Basis / Public Reference |
|---|---|---|
| project_id | SS | Synthetic identifier |
| project_name | RGI (10 rows) / SS (rest) | 10 rows are real, publicly known projects (Mumbai-Ahmedabad HSR, Dwarka Expressway, Delhi-Amritsar-Katra Expressway, Bengaluru-Chennai Expressway, etc.); remaining rows are named synthetic projects |
| project_type | RGI | Real infrastructure categories used by MoRTH/NHAI, Railways, AAI, Power Ministry, Jal Shakti, DPIIT |
| ministry | RGI | Actual ministry/agency mapped to each project type |
| state, district | RGI | Real Indian state and district names (Census/administrative boundaries) |
| is_flagship_project | D | Flag set during generation |
| population_density | RGI (range) / SS (value) | Ranges consistent with Census 2011 urban vs rural density bands |
| urban_rural | RGI | Real Census classification categories |
| terrain_type | RGI (categories) / SS (assignment) | Real terrain categories; forest-heavy states (Jharkhand, Chhattisgarh, Odisha, MP, HP, Uttarakhand, Assam) weighted higher for Forested/Hilly, consistent with public forest-cover data (India State of Forest Report patterns) |
| flood_prone | SS | Elevated probability for Coastal/Riverine terrain, consistent with general flood-risk geography |
| distance_to_highway_km, distance_to_railway_km | SS | Exponential distributions approximating real network density/connectivity gaps |
| planned_duration_months | RGI (range) / SS (value) | Calibrated to typical multi-year infra project durations reported by NHAI/MoRTH/NIP |
| planned_start_date, planned_end_date, actual_end_date | D | Computed from start_year + planned_duration_months + simulated delay |
| year | RGI | Real calendar years 2015-2025 (dataset scope) |
| total_land_required_hectares | SS | Log-normal distribution calibrated to typical land-parcel sizes seen in public NHAI/Railway project reports |
| land_acquired_hectares | D | = total_land_required_hectares × acquisition_percentage / 100 |
| land_acquired_percent / acquisition_percentage | SS | S-curve progress model, slowed by simulated risk factors |
| pending_approvals | D | Derived from simulated approval-progress index |
| compensation_status | D | Binned from compensation_pending_percent |
| compensation_pending_percent | SS | Calibrated so that higher friction (simulated) → slower disbursal, consistent with CAG audit findings that compensation delay is a leading LARR bottleneck |
| rehabilitation_status | D | Binned from rr_completed_percent |
| government_approval_status | D | Binned from a simulated administrative-efficiency progress index |
| environmental_clearance, forest_clearance | SS | Required flag set by project type / forest-probability; status progresses with project timeline, consistent with publicly documented multi-year EC/FC processes |
| legal_dispute, legal_cases, court_case_count | SS | Higher litigation probability for urban districts, consistent with parliamentary standing committee findings on land-dispute litigation patterns |
| objection_count | SS | Higher for urban districts (more affected stakeholders per hectare) |
| affected_families | SS | Negative-binomial distribution approximating real project-scale variation |
| rr_completed_percent, possession_percent | D | Derived from acquisition progress with realistic lag/ratio |
| previous_delay_days | D | Time-weighted portion of the project's final delay_days |
| project_status | D | Rule-based from snapshot position (first/last/middle year) and acquisition% |
| delay_days | SS | Sampled from gamma distributions per risk band, matching the requested ranges (Low 0-90d, Medium 91-365d, High 366-1500d) |
| delay_risk | SS | Derived from a weighted latent risk score built from compensation friction, litigation, admin efficiency, objections, clearances, land/family scale, terrain — weights informed by drivers most cited in CAG audit reports and parliamentary standing committee reports on RFCTLARR implementation |

## What is genuinely "Real Government-inspired" vs. simulated, in plain terms
- **Real:** which states/districts/ministries/project-types exist, roughly
  how long infrastructure land acquisition takes under the RFCTLARR
  statutory clock, which factors are documented as the leading delay
  causes, and the broad behavior of 10 named, publicly reported flagship
  projects.
- **Simulated:** every specific per-project number (exact hectares, exact
  delay days, exact compensation %, etc.), because no bulk, row-level,
  ML-ready historical dataset of Indian land acquisition projects is
  publicly downloadable today.

No data in this file was scraped from, or is claimed to originate from, any
restricted or non-public government system (including PM Gati Shakti).
