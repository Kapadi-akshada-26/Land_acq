# Validation Report - land_acquisition_historical_dataset.csv

## 1. Shape & coverage
- **12,387 rows x 40 columns**, representing **2,610 projects** (2,600
  synthetic + 10 real named flagship projects) across **23 states/UTs**,
  **7 project types**, and **all years 2015–2025**.
- Average of **4.7 snapshot years per project** (min 2, max 10) — true
  time-series structure, not one independent row per project.

## 2. Class balance (project-level, i.e. one label per project)
| Risk band | Target | Achieved |
|---|---|---|
| Low | 45% | 45.0% |
| Medium | 35% | 34.9% |
| High | 20% | 20.1% |

## 3. Delay_Days range check
| Risk band | Requested range | Achieved min–max | Mean |
|---|---|---|---|
| Low | 0–90 | 1–90 | 42.2 |
| Medium | 91–365 | 91–365 | 146.8 |
| High | 366–1500 | 366–1500 | 612.5 |

`delay_risk` and `delay_days` are always consistent (no High-risk row with a
Low-range delay or vice versa) — enforced by construction, not just checked.

## 4. Impossible-value checks (all PASS)
- All percentage fields (`land_acquired_percent`, `compensation_pending_percent`,
  `possession_percent`, `rr_completed_percent`) bounded to [0, 100].
- `land_acquired_hectares` never exceeds `total_land_required_hectares`.
- `year` always within 2015–2025.
- `delay_days`, `legal_cases`, `objection_count` never negative.

## 5. Missing values
Only `actual_end_date` has nulls (9,777 of 12,387 rows) — **by design**: it's
only populated on a project's final/completion snapshot row, since the
project hasn't reached actual_end_date in its earlier in-progress years.
No mandatory field (state, district, project_type, year, delay_days,
delay_risk, etc.) has any missing values.

## 6. Realistic-correlation checks
Encoded and verified present in the data (see source_mapping_table.md for
the reasoning behind each):
- Higher `compensation_pending_percent` associates with higher `delay_risk`.
- `legal_dispute = Yes` / higher `legal_cases` associates with higher delay.
- `forest_clearance_needed` (via forest-heavy states) correlates with
  Pending forest_clearance status more often in Jharkhand, Chhattisgarh,
  Odisha, MP, HP, Uttarakhand, Assam.
- Urban districts show higher `objection_count` on average than rural ones.
- Larger `total_land_required_hectares` / `affected_families` associate
  with higher risk (more parcels, more stakeholders to settle with).

## 7. Model-based validation (not leakage-inflated)
A Random Forest classifier was trained on `delay_risk` using a
**project-grouped train/test split** — meaning no two snapshot rows from
the same project can appear on both sides of the split, which is the
correct way to test this dataset (a naive random row split would leak
information across a project's own years and inflate the score).

- **Accuracy: 87.2%**
- **Macro F1: 0.86**
- Top predictive features: `previous_delay_days`, `year`,
  `acquisition_percentage`, `compensation_pending_percent`,
  `land_acquired_percent`, `government_approval_status` —
  i.e., the model is learning from the same drivers the problem statement
  names (compensation, approvals, documentation/acquisition progress), not
  from an artifact of the generation process.

## 8. Known limitations (disclose these to judges)
- This is a **synthetic dataset calibrated to real-world patterns**, not a
  scrape of actual government project records — no such row-level public
  dataset exists yet in India (see HONESTY_AND_METHODOLOGY.md).
- The 10 flagship-project rows use publicly known, general characteristics
  (multi-state span, documented delay reputation) but their exact
  year-by-year numbers are illustrative, not official figures.
- Geospatial fields are limited to district-level categorical/derived
  attributes (terrain, distance-to-network, flood-proneness) rather than
  true lat/long polygons, since no public parcel-level GIS layer exists to
  ground those coordinates realistically.
