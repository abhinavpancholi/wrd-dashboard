# Antigravity Prompt — WRD (Water Resource Dept.) Dashboard, Phase 1

Paste everything below to Antigravity as one message.

---

You're building a new dashboard, **WRD (Narmada, Water Resources & Kalpsar Dept.)**, as
part of the Viksit Gujarat @2047 / GRIT platform. The **WCD dashboard is already built and
deployed** (`viksit-wcd-dashboard.netlify.app`) — your job is to reuse its proven patterns
(component library, theming, MobX filter-store pattern, chart wrappers, layout shell) to
build WRD fast, NOT to copy WCD's branding or its data model. WRD's underlying data is
structurally very different from WCD's (see "Ground truth" below) — don't assume WCD's
ETL/aggregation approach transfers 1:1.

Treat WRD as its own standalone app/repo (same pattern as WCD and the Home Page: its own
repo, its own Netlify deployment, to be added as a card on the Viksit Gujarat home page in
a later phase — not this one).

## STEP 0 — EXPLORE FIRST. DO NOT WRITE OR MODIFY ANY CODE YET.

Explore the WCD dashboard repo and report back on all of the following before proceeding
to Step 1:

1. Directory/project structure, build tooling, and how the app is deployed to Netlify.
2. Reusable UI primitives: the KPI stat card component (used for sidebar counters), the
   chart-card wrapper (title + chart + optional legend), the dark-navy sidebar shell, the
   top header bar pattern, color/theme tokens (exact hex values for navy, teal, purple,
   orange, and any others), typography.
3. Which charting library is used (recharts / chart.js / other) and what wrapper
   components already exist for line, area, and bar charts — including whether they
   support dual-series (target/actual) rendering, single-series rendering, and inline data
   labels.
4. Whether a Gujarat district-boundary map/choropleth component already exists, and its
   props/interface (we'll need it in a no-data/placeholder state for this phase, not a
   real choropleth — see Step 4).
5. The MobX filter-store pattern used for `selectedFY` (and `selectedRegion` /
   `selectedDistrict`, which WRD will NOT need — this data has no district-level rows at
   all, only state-level).
6. Any existing number-formatting utility for Indian digit grouping (e.g. `6,67,196.84`,
   `87,225.84`) — reuse it rather than writing a new one.
7. Any existing icon set/library in use (for the small milestone/flag icons).
8. Confirm the best place for a new standalone WRD repo/app to live, and whether any
   shared component package already exists that both WCD and WRD could import from, vs.
   whether the pragmatic move for speed is to port/copy the relevant WCD components into
   the new WRD repo.

**Report all of this back to me before writing any code.** Once confirmed, proceed to
Step 1 using the exact confirmed component names/props — don't invent new ones if a
reusable one already exists.

---

## GROUND TRUTH — verified directly against `WRD_Updated_KPI_Matrix_05-_Nov_25.xlsx`

Don't re-derive this from the file yourself — it's already been verified line-by-line.
Source: single sheet `Narmada, Water Resource & Kalps`, 24 rows, header on row 9. If the
filename or sheet name changes, ask before assuming column positions are unchanged.

**Columns:** `S.No, Chapter Name, Intervention Code, Intervention, Department, HODs,
Actionable Step, KPI, UoM, Granularity, Periodicity, 2022, 2023, 2024, 2025, 2026, 2027,
2028, 2029, 2030, KPI source (Excel/Website/Portal), Remarks, Shift in Department as
suggested by Dept., Dept. by GRIT`.

**Structural facts:**
- `Granularity` is `"State Level"` for every single row — there is no district-level data
  anywhere in this file. Don't build a district filter or a real choropleth for WRD.
- `S.No`, `Chapter Name`, `Intervention Code`, `Intervention`, `Department` are only
  populated on the first row of each intervention group and blank on continuation rows
  (Excel merged-cell pattern) — forward-fill these on load.
- The year columns (`2022`...`2030`) hold a **single value per year — there is no
  separate Target and Actual column anywhere in this file.** Treat every year-column value
  as a **target**. Nulls appear as real empty cells or the literal string `'-'` — normalize
  both to null.
- KPI text has stray literal `\n` and non-breaking-space (`\xa0`) characters in several
  cells (e.g. `"Command area coverage...\n"`, `"Nos of Training / awareness
  program\xa0"`, `"Launch Common  platform\n"`) — trim/normalize whitespace including
  these on load, the same way WCD trims district-name whitespace.
- **Fiscal-year label mapping (assumption, flagged):** the bare year columns are assumed
  to follow the same convention as WCD's `fy` field — column `2027` → canonical label
  `"2027-28"` (the year the FY starts). Apply this uniformly: `2022→"2022-23"` through
  `2030→"2030-31"`. If this turns out wrong, every chart's x-axis/y-axis labels need
  correcting, so flag it to Abhinav rather than silently picking a different convention.
- `Intervention Code` is clean and reliable in this sheet (unlike WCD's NSWLD-10_2 /
  NSWLD-17(2) issue) — 9 distinct values: `AIRD-76, AIRD-77, AIRD-78, AIRD-80, AIRD-83,
  AIRD-84, AIRD-137, AIRD - 138 (note stray space), AIRD-139`.
- 12 distinct `Actionable Step` values, 15 distinct non-null `KPI` text values.

**Data-quality issues to handle explicitly, not silently:**
- One KPI cell literally contains the text `"4"` instead of a real KPI name (row for
  `AIRD-139`, Actionable Step "Assessment of existing capacity of reservoirs for
  prioritizing resilience against climate change impacts"). This is a data-entry
  artifact, not a real KPI title. Use a derived placeholder label —
  **"No. of Reservoirs/Dams Assessed"** — and flag it in your report-back as needing
  Abhinav's confirmation of the intended real title.
- Two KPI pairs are literal duplicates carrying identical target values, one member of
  each pair suffixed `"(dup)"`:
  - `"Nos. of ground water recharge structures"` (AIRD-76) and its `"(dup)"` twin
    (AIRD-137).
  - `"Nos. of Checkdams / Ponds/ other hydrolic structures"` (AIRD-78) and its `"(dup)"`
    twin (AIRD - 138).
  Merge each pair into **one chart card** (use the non-dup row as the primary source),
  but keep both Intervention Codes in a tooltip/footnote for traceability. The `Remarks`
  column notes the AIRD-137 actionable step "is not measurable and cannot be kept as
  intervention" — consistent with this being slated for cleanup.
- `UoM` is blank (not `'-'`, just empty) for `"No. of best practices added /
  identified"` — this is a real incrementing numeric KPI (values 5, 5, 10, 10 from
  FY2027-28), not a milestone/binary one. Treat its UoM as `Numeric`, don't confuse it
  with the two true binary milestone KPIs below.
- Two KPIs are true one-time binary milestones — `UoM = "-"`, and their only non-null
  value across all years is a single `1` in one target year (everything else is `'-'`):
  `"Launch data platform"` (AIRD-84, target FY2027-28) and `"Launch Common platform"`
  (AIRD-83, target FY2027-28). **In the real data both land in the same target year** —
  don't force them into different years to match the screenshot (the screenshot shows
  them in 2027-28 and 2026-27 respectively, which doesn't match this file — see
  "Screenshot mismatch" below).

---

## SCREENSHOT MISMATCH — READ BEFORE BUILDING ANY CHART

The attached Power BI screenshot is a **layout, chart-type, and branding reference only.**
Its literal numbers, year ranges, and even its Target-vs-Actual mechanic **do not match
the current source file** and should not be reproduced. Concretely:
- The screenshot shows populated "Actual" values (orange series) for FY2022-23 through
  FY2024-25 on several charts. The real file has **no actual/achieved data at all**, for
  any year, on any KPI.
- Specific figures don't match even where a KPI clearly corresponds (e.g. "Number of
  Training..." is 195→1,875 in the screenshot vs. 100→300 in the real file).
- "Number of Farmers Under MIS" (large bar chart + district map) has **no matching KPI in
  the source file** — the closest real KPI is a different metric (acres of command-area
  coverage, not a farmer headcount). **Do not fabricate this chart or its data.**
- "Number of Checkdams & Ponds" in the screenshot uses a different year range (2020-21 to
  2024-25) and a single-color bar style, unlike the file's actual FY2025-26–2030-31 target
  range for that KPI.

**Do not invent, backfill, or estimate any Actual values, any farmer-headcount data, or
any district-level breakdown to make a chart visually match the screenshot.** Build every
chart from the real target-only data, in the screenshot's visual style (card layout,
colors, chart type where a real equivalent exists), and flag any chart where you had to
deviate.

---

## STEP 1 — Data loading

Given the small size (24 rows, one sheet, updated quarterly/half-yearly/yearly at most —
nothing like WCD's monthly per-anganwadi volume), a full offline ETL pipeline is
overkill. Write a small one-off transform (e.g. `scripts/wrd_etl.py` or an equivalent
loader, following WCD's naming convention for consistency) that:
1. Reads the sheet, forward-fills the merged-cell columns.
2. Normalizes KPI/Actionable Step/Intervention text (trim whitespace, `\n`, `\xa0`).
3. Converts `'-'` and blank cells to null; casts year-column values to numbers.
4. Maps bare years to canonical FY labels per the rule above.
5. Merges the two duplicate KPI pairs into single records (keeping both Intervention
   Codes for traceability).
6. Relabels the `"4"` KPI to the placeholder title above.
7. Outputs a single JSON (e.g. `wrd_kpi_matrix.json`) — one record per (deduplicated) KPI,
   with its full target time series, UoM, Periodicity, Intervention Code(s), Actionable
   Step, and a `hasActual: false` flag on every record (see Step 4 — this flag is what
   lets a future Actual data source be wired in later without a rebuild).

Don't hardcode this file path anywhere without confirming it against what Step 0 found in
the WCD repo's conventions.

## STEP 2 — Sidebar

Reuse WCD's dark-navy sidebar shell and stat-card component. Three stat cards, computed
dynamically from the loaded data (not hardcoded), matching the screenshot's icon/color
per card (lightbulb/teal, notepad/light-blue, bar-chart/teal-green):
- **Interventions** — count of distinct Intervention Codes → should compute to 9.
- **Actionable Steps** — count of distinct Actionable Step text → should compute to 12.
- **KPIs** — count of distinct KPI records **before** deduplication, i.e. counting each
  of the two merged "(dup)" pairs as 2, and excluding the placeholder-relabeled `"4"` row
  from the exclusion (it should still count as 1 real KPI) → should compute to 14. If your
  computed number differs from 14, report the discrepancy rather than forcing it.

Below the stat cards: a simple nav list (`Summary`, `Overview`, mirroring the screenshot;
this phase only needs the `Overview` page to actually work — reuse whatever WCD does for
inactive/placeholder nav items).

At the bottom: an FY selector, 8 buttons in a 2-column grid (`2022-23` through `2029-30`
— note the file's last usable FY is `2030-31`, one more than the screenshot shows; include
all 9 if the WCD selector pattern naturally supports a 9th, otherwise match the
screenshot's 8 and flag the omission).

**FY selector behavior — deviates from WCD, confirm before building:** in WCD, selecting
an FY filters every chart on the page down to that single year. WRD's charts are
roadmap/trajectory visuals — each one always shows the KPI's full multi-year series (this
matches the screenshot, where every chart spans all its years regardless of any single
selection). Proposed default: the FY selector does **not** filter the trend charts at all;
it only drives the header subtitle ("Water Resource Department, `<selected FY>`") and, if
useful, a visual "current year" marker on each chart. Flag this to Abhinav explicitly — if
he wants per-chart filtering instead, that's a real design decision, not a silent default.

## STEP 3 — Header

Reuse WCD's header bar pattern. Left: Gujarat multicolor map icon + GRIT logo (reuse
existing brand assets). Center: "Gujarat Rajya Institution For Transformation" /
"Water Resource Department, `<selected FY>`". Right: a portrait photo slot with a name
caption below it — **leave this as an empty placeholder box for now; don't attempt to
generate or source a photo of a real person.** Abhinav will drop in the actual official
image asset separately.

## STEP 4 — Charts (one card per KPI record)

Every chart is **target-only, single series**, styled in the screenshot's purple/target
color. Architect each chart component to accept an optional `actual` series prop that
currently receives `null`/`undefined` (driven by the `hasActual: false` flag from Step 1)
so a future data source can be wired in later without restructuring the component — same
"build for extensibility" principle already used for the Home Page's config-driven
department cards.

| KPI (real, deduplicated) | Intervention Code(s) | UoM | Chart type (proposed) | Closest screenshot card | Notes |
|---|---|---|---|---|---|
| Command area coverage of dug well/tube wells for MIS | AIRD-76 | Acres | Horizontal bar, target-only | "Command Area Coverage of Dug Tube Well (Acres)" | Use Indian digit-grouping formatter |
| Nos. of ground water recharge structures | AIRD-76 + AIRD-137 (dup, merged) | Numeric | Horizontal bar, target-only | "Number of Ground Water Recharge Structures" | Footnote both codes |
| Area Covered under PINs | AIRD-77 | Acres | Horizontal bar, target-only | *(no screenshot equivalent — new card)* | |
| Nos. of Checkdams/Ponds/other hydraulic structures | AIRD-78 + AIRD-138 (dup, merged) | Numeric | Vertical bar, target-only | "Number of Checkdams & Ponds" | Footnote both codes; screenshot's year range (2020-21–2024-25) doesn't apply — use real FY2025-26–2030-31 |
| Nos of Training / awareness program | AIRD-80 | Numeric | Line/area, target-only | "Number of Training For Adopting Irrigation Schedule" | |
| Launch Common platform | AIRD-83 | `-` (milestone) | Milestone card, not a chart | "Launch Common platform..." action card | Target FY2027-28 |
| No. of best practices added / identified | AIRD-83 | Numeric (UoM blank in source, inferred) | Bar, target-only | *(no screenshot equivalent — new card)* | |
| Launch data platform | AIRD-84 | `-` (milestone) | Milestone card, not a chart | "Development of data platform..." action card | Target FY2027-28 — same FY as the other milestone, don't split |
| Nos. of Competitions | AIRD-84 | Numeric | Bar, target-only | *(no screenshot equivalent — new card)* | |
| No. of solutions identified | AIRD-84 | Numeric | Bar, target-only | *(no screenshot equivalent — new card)* | |
| Nos. of collaborations | AIRD-84 | Numeric | Bar, target-only | *(no screenshot equivalent — new card)* | |
| No. of innovations / new technologies introduced | AIRD-84 | Numeric | Bar, target-only | *(no screenshot equivalent — new card)* | |
| No. of Reservoirs/Dams Assessed (relabeled from `"4"`) | AIRD-139 | Numeric | Line/area, target-only | "Number of Reservoirs/Dams To Be Assessed" | Title is a placeholder — flag for confirmation |

**Milestone cards** (the two `-`-UoM KPIs): render as small teal-bordered text cards with
a flag/target icon and the target FY label, matching the screenshot's two action-item
boxes — not as charts.

**"Farmers Registered Under MIS" map:** no matching data exists. Default: reuse WCD's
Gujarat map component (if Step 0 confirms one exists) in a pure outline/no-data state,
greyed out exactly as the screenshot shows, with a small "no live data source yet" label
— purely for visual parity, not fabricated data. If no such component exists in WCD,
**omit this card entirely for this phase** rather than building a one-off map, and flag it
as a follow-up.

## EDGE CASES TO HANDLE

- Year columns arrive with mixed dtypes in the raw source (some float, some int, some
  string `'-'`) — normalize all to a consistent numeric-or-null type before charting.
- Some KPI text has an intervention code with a stray space (`"AIRD - 138"`) — don't
  treat this as a different code family from `"AIRD-138"` if it appears elsewhere;
  normalize on load.
- Don't apply WCD's region/district filter-store fields to WRD's MobX store — this
  dataset has no region or district dimension at all.

## ASSUMPTIONS FLAGGED FOR ABHINAV'S CONFIRMATION (do not silently resolve differently)

1. Bare year → FY label mapping (`2027` → `"2027-28"`).
2. FY selector does not filter the trend charts, only the header subtitle.
3. The `"4"` KPI's placeholder title ("No. of Reservoirs/Dams Assessed").
4. Merging the two duplicate KPI pairs into single chart cards.
5. Omitting "Farmers Registered Under MIS" (chart + map) entirely, since no matching data
   exists.
6. Six new chart cards with no screenshot precedent (Area under PINs, best practices,
   competitions, solutions identified, collaborations, innovations) — chart type/placement
   is a best guess, not verified against any reference layout.

## REPORT-BACK CHECKLIST

Before considering this phase done, report back:
- [ ] Step 0 findings (repo structure, reusable components, charting library, map
      component status, filter-store pattern, icon library, number formatter).
- [ ] Final computed sidebar counts (Interventions / Actionable Steps / KPIs) — confirm
      they match 9 / 12 / 14, or explain any discrepancy.
- [ ] List of all chart cards actually built, with which KPI/Intervention Code(s) feed
      each one.
- [ ] Confirmation of how each of the 6 flagged assumptions above was resolved.
- [ ] Any column, value, or screenshot element you found with no clear home in the data —
      don't drop or invent, just report it.
