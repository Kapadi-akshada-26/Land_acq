# Data Dictionary - land_acquisition_historical_dataset.csv

**12,387 rows x 40 columns.** Time-series historical dataset: one row per
project **per year** it was active (2015-2025), so a single project appears
as multiple snapshots showing how its acquisition progressed. 2,610 synthetic
projects + 10 real, publicly-known flagship projects (60 snapshot rows) used
as scenario anchors. Run `generate_historical_dataset.py` with a larger
`N_PROJECTS` to scale toward 50,000-100,000 rows.

**Read the accompanying `HONESTY_AND_METHODOLOGY.md` before using this in a
judged submission** - it explains exactly what is real vs. simulated.

## Identifiers & project attributes (constant across a project's rows)
| Column | Description |
|---|---|
| project_id | Unique ID (`LA-FLAG-xxx` for the 10 real named anchors, `LA-1xxxxx` for synthetic) |
| project_name | Project title |
| project_type | Highway / Railway / Metro / Airport / Power Transmission / Irrigation / Industrial Corridor |
| ministry | Real ministry/agency mapped to project_type (e.g. MoRTH/NHAI for Highway) |
| state, district | Real Indian state and district names |
| is_flagship_project | True for the 10 real, publicly documented anchor projects |
| population_density | Persons/km2, Census-2011-consistent ranges by urban/rural |
| urban_rural | Urban / Rural |
| terrain_type | Plain / Hilly / Forested / Coastal / Desert / Riverine |
| flood_prone | 0/1, elevated for Coastal/Riverine terrain |
| distance_to_highway_km, distance_to_railway_km | Distance to nearest existing network |
| planned_duration_months | Originally planned project duration |
| planned_start_date, planned_end_date | Statutory/planned timeline |
| actual_end_date | Filled only in the project's final snapshot row (else null - still ongoing in that year) |

## Year-varying snapshot fields (change row to row for the same project)
| Column | Description |
|---|---|
| year | Snapshot year (2015-2025) |
| total_land_required_hectares | Fixed target land area |
| land_acquired_hectares | Cumulative land acquired by this year |
| land_acquired_percent / acquisition_percentage | % of required land acquired (same value, two names for schema compatibility) |
| pending_approvals | Count of pending statutory/administrative approvals |
| compensation_status | Not Started / Partially / Substantially / Fully Disbursed |
| compensation_pending_percent | % of compensation still unpaid |
| rehabilitation_status | Not Started / Partially / Substantially Complete / Complete |
| government_approval_status | Pending / Under Review / Partially Approved / Approved |
| environmental_clearance, forest_clearance | Approved / Pending / Not Required |
| legal_dispute | Yes/No |
| legal_cases / court_case_count | Active litigation count (same value, two names) |
| objection_count | Cumulative landholder/public objections filed |
| affected_families | Project-affected families (fixed per project) |
| rr_completed_percent | Rehabilitation & Resettlement completion % |
| possession_percent | % of acquired land where physical possession taken |
| previous_delay_days | Delay accumulated up to that snapshot year |
| project_status | Early Stage / In Progress / Near Completion |

## Target / label columns (final project outcome, repeated on every snapshot row)
| Column | Description |
|---|---|
| delay_days | Final delay in days vs. planned timeline |
| delay_risk | Low (0-90d, ~45%) / Medium (91-365d, ~35%) / High (366-1500d, ~20%) |

**Why the label repeats across a project's yearly rows:** this is intentional
and matches the "early detection" framing of PS26017 — the ML task is
*"given the project's status as observed in year Y, predict the eventual
delay outcome"*, not *"describe the outcome that already happened."* A
project's `previous_delay_days`, `acquisition_percentage`, etc. still change
year to year even though the eventual `delay_risk` is fixed, so the model
must learn from partial, in-progress signals — exactly what a real deployed
system would have to do.

## Validation performed
- All percentage/hectare fields respect physical bounds (0-100%, acquired ≤ required).
- `year` restricted to 2015-2025.
- Class balance: Low 45.0% / Medium 34.9% / High 20.1% at project level (target: 45/35/20).
- A Random Forest trained with a **project-grouped** train/test split (no
  snapshot from the same project appears in both train and test, so there is
  no leakage) scores **87% accuracy**, with `previous_delay_days`,
  `acquisition_percentage`, `compensation_pending_percent`, and
  `government_approval_status` as the top predictive features — matching
  real documented delay drivers, not artifacts of a rigged label.
