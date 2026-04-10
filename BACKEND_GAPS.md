# Backend Integration Gaps

> Living document tracking everything the UX / React-component spec asks for
> that the current backend (`@pg-atlas/data-sdk v0.4.1` against
> `https://api.pgatlas.xyz`) does not yet provide, with suggested
> resolutions, current workarounds, and impact per page.
>
> **Audience**: backend team and stakeholders. Use this to prioritize
> backend work against frontend milestones.
>
> **How to read**:
> - **Priority**: P0 (blocks a v0 user story), P1 (workaround is ugly /
>   expensive), P2 (nice-to-have / cosmetic).
> - **Type**: `schema-field` (a field is missing), `endpoint`
>   (new endpoint needed), `query-param` (new param on existing endpoint),
>   `data` (endpoint exists but data is currently empty / all null),
>   `naming` (spec vs API mismatch).
> - **Workaround**: what the frontend does today instead.

---

## Summary table

| ID   | Priority | Type         | Title                                                               | Blocks page(s)                     |
|------|----------|--------------|---------------------------------------------------------------------|------------------------------------|
| G1   | P0       | data         | `criticality_score`, `pony_factor`, `adoption_score` are all `null` | Home · Round · ProjectDetail       |
| G2   | P0       | schema-field | No dedicated `awarded_status` on `ProjectSummary`                   | Round · ProjectDetail              |
| G3   | P1       | query-param  | No `sort` param on `GET /projects`                                  | Home (Top Critical) · Round        |
| G4   | P1       | query-param  | No round-scoped filter on `GET /projects`                           | Round                              |
| G5   | P1       | schema-field | No aggregated repo metrics on `ProjectSummary`                      | Round leaderboard                  |
| G6   | P1       | endpoint     | No risk-distribution / coverage aggregate endpoint                  | Home (Ecosystem Health)            |
| G7   | P2       | endpoint     | No `GET /projects/{id}/contributors` union                          | ProjectDetail                      |
| G8   | P1       | endpoint     | No contributors index / search endpoint                             | Contributors index page            |
| G9   | P2       | data         | No active-contributors 30/90d or recent-commit volume               | Home (landing metrics)             |
| G10  | P2       | schema-field | `RepoDetailResponse.releases[]` typed as `object[]`                 | RepoDetail timeline                |
| G11  | P2       | data         | No field-level provenance tags                                      | Every metric display               |
| G12  | P2       | naming       | Spec says `git_org_url`, API returns `git_owner_url`                | Docs only                          |
| G13  | P2       | schema-field | `category` lives at top level on API, spec expects it in metadata   | Docs only                          |
| G14  | P2       | data         | `git_owner_url` sparsely populated on SCF projects                  | Round · ProjectDetail (GitHub link)|

---

## Detailed findings

### G1 · Project scoring fields are all null — **P0, data**

**What the UX asks for**
- Home · Top Critical card: top-10 projects ranked by `criticality_score`.
- Home · Ecosystem Health: risk distribution (Low / Medium / High / Critical) computed from `criticality_score`.
- Round page leaderboard: sortable criticality, pony factor, adoption.
- ProjectDetail metrics panel: headline scores.

**What the API returns**

```jsonc
GET /projects?limit=5
{
  "items": [
    {
      "canonical_id": "daoip-5:scf:application:aida",
      "display_name": "AIDA: Stellar Trading, Launch & KOLs",
      "project_type": "scf-project",
      "activity_status": "in-dev",
      "category": null,
      "git_owner_url": null,
      "pony_factor": null,          // ← all null across the sample
      "criticality_score": null,    // ← all null across the sample
      "adoption_score": null,       // ← all null across the sample
      "updated_at": "2026-03-12T12:14:46.184219Z"
    }
    // ...
  ],
  "total": 641
}
```

Every one of the 641 projects returns `criticality_score: null`,
`pony_factor: null`, `adoption_score: null` today.

**Impact**
- EcosystemHealthCard: renders an "Risk scoring pending" empty state.
- TopCriticalCard: sorts by score descending with nulls last, so the
  list shows 10 projects but every score column is `—`.
- Round leaderboard: criticality / pony / adoption columns all show `—`.
- ProjectDetail will have the same issue when wired.

**Current workaround**
- All score-dependent panels gracefully degrade: either empty-state copy
  or `—` placeholders.

**Requested resolution**
- Backend: populate `criticality_score`, `pony_factor`, `adoption_score`
  on every project (and repo) row.

---

### G2 · Missing `awarded_status` on `ProjectSummary` — **P0, schema-field**

**What the UX asks for**
- Round leaderboard row: visible "Awarded" / "Not awarded" / "Ineligible" badge.
- ProjectDetail header: awarded status chip + tranche progress.
- Dashboard → AwardHealthCard donut chart.

**What the API returns**
- `ProjectSummary` has no awarded field.
- `ProjectDetailResponse.metadata` has `scf_tranche_completion`,
  `awarded_submissions_count`, `total_awarded_usd` — useful but require a
  per-project detail call (N+1) and don't expose a single boolean.

**Current workaround**
- Frontend reads the static round config in `src/data/rounds/*.json`,
  which has a per-project `awarded: "yes" | "no" | "ineligible"` field +
  `tranche_completion: 0.0–1.0`. The Round page, AwardHealthCard, and
  TrancheAvgCard are all sourced from that file instead of the API.
- Long-term this should move to the API.

**Requested resolution**
- Add a top-level `awarded_status: "awarded" | "ineligible" | "pending" | null`
  on `ProjectSummary` so leaderboards don't need per-project detail calls.

---

### G3 · No `sort` query param on `GET /projects` — **P1, query-param**

**What the UX asks for**
- Home → Top Critical: top-10 by criticality_score DESC.
- Round page leaderboard: sortable columns (criticality, pony, adoption).
- Any ranking view should be able to ask the backend for the server-sorted
  top N without fetching the full 641 rows.
- Table filtering: User must be able to filter by `category` and sort natively via server.

**Current workaround**
- Fetch `/projects?limit=1000` and handle sorting/pagination in memory via `MaterialReactTable` across the entire list.
- For global ranking it's inefficient once the project count grows.

**Requested resolution**
- Accept `sort` (e.g. `criticality_score:desc,display_name:asc`) on
  `GET /projects` and `GET /repos`.
- **CRITICAL:** The database sorting logic *must* implement `NULLS LAST` so that descending sorts on metrics like `criticality_score` do not push unscored/null projects to the top of the list.
- Additionally, expose column-level filters (e.g. `category=<category_name>`) alongside the existing `search`, `project_type`, and `activity_status` parameters so the tables can be completely server-driven.
- Suggestion: if sorting by `activity_status`, use a custom order (`live` > `in-dev` > `discontinued`).

---

### G4 · No round-scoped filter on `GET /projects` — **P1, query-param**

**What the UX asks for**
- Round page: list the projects that belong to a specific SCF round.

**Current workaround**
- Frontend joins the static round config (`src/data/rounds/<id>.json`)
  with the full projects list: fetch `GET /projects?limit=500`, build a
  `Map<canonical_id, ProjectSummary>`, intersect with the round config.
- Works but requires re-fetching the whole projects list on every round
  view (cached for 5 min via TanStack Query, so navigation within a
  session stays cheap).

**Requested resolution**
- Add one of:
  - `?round=2026Q1` query param on `GET /projects`, OR
  - Return `scf_rounds: string[]` on `ProjectSummary`, OR
  - Move the round config into the API as a first-class resource.

---

### G5 · Aggregated repo metrics missing from `ProjectSummary` — **P1, schema-field**

**What the UX asks for**
- Round leaderboard row: aggregated stars, forks, downloads across all
  repos owned by the project.

**What the API provides**
- `ProjectSummary`: no per-repo aggregate.
- `GET /projects/{canonical_id}/repos` → returns `RepoSummary[]` with
  `adoption_downloads`, `adoption_stars`, `adoption_forks` per repo.
- Requires N per-project calls to compute a leaderboard (N+1 pattern).

**Current workaround**
- Round leaderboard shows the `adoption_score` field from `ProjectSummary`
  (also currently null — see G1). Stars/forks/downloads are not yet shown
  in leaderboard rows.

**Requested resolution**
- Inline aggregated repo metrics on `ProjectSummary`:
  ```jsonc
  {
    "total_repo_stars": 1234,
    "total_repo_forks": 89,
    "total_repo_downloads": 50000,
    "repo_count": 4
  }
  ```

---

### G6 · Risk-distribution / dependency-coverage aggregate endpoint — **P1, endpoint**

**What the UX asks for**
- Home landing: risk heatmap + "dependency coverage %" metric.
- A single lightweight call that returns `{ low, medium, high, critical }`
  project counts plus `dependency_coverage_percent`.

**Current workaround**
- Frontend fetches `GET /projects?limit=100` (a bounded sample) and
  buckets `criticality_score` client-side. Sample is visibly labeled —
  not exact because the backend has ~641 projects.
- Dependency coverage % is left at the mock value until a formula ships.

**Requested resolution**
- Add `GET /metadata/aggregates` (or embed into existing `/metadata`):
  ```jsonc
  {
    "risk_distribution": { "low": 98, "medium": 45, "high": 18, "critical": 7 },
    "unscored_projects": 473,
    "dependency_coverage_percent": 87
  }
  ```

---

### G7 · No `GET /projects/{id}/contributors` union — **P2, endpoint**

**What the UX asks for**
- ProjectDetail → contributors panel: deduplicated list of every
  contributor across the project's repos.

**What the API provides**
- `RepoDetailResponse.contributors` is per-repo.
- To build a project-level list the frontend would have to call
  `GET /repos/{canonical_id}` for each of the project's repos and dedupe.

**Current workaround**
- Not wired yet. ProjectDetail will loop repos and dedupe by
  `contributor.id` once the page is integrated (N+1).

**Requested resolution**
- Add `GET /projects/{canonical_id}/contributors` returning the deduped
  union with aggregated `total_commits_in_project` per contributor.

---

### G8 · No contributors index / search endpoint — **P1, endpoint**

**What the UX asks for**
- Contributors index page (currently present in the app as
  `/contributors`) — ability to browse / search the contributor graph.
- Even a minimal listing: "top 100 contributors by commit count".

**What the API provides**
- Only `GET /contributors/{contributor_id}` — detail by id, no list.

**Current workaround**
- Contributors index page is a manual id lookup input.

**Requested resolution**
- Add `GET /contributors?search=<name>&limit=&offset=` returning
  `PaginatedResponse<ContributorSummary>`.

---

### G9 · Active contributors 30/90d, recent commit volume — **P2, data**

**What the UX asks for**
- Home landing page metrics strip: "active contributors 30/90d",
  "recent commit volume".

**What the API provides**
- Nothing aggregate. `/metadata` exposes lifetime counts only.

**Current workaround**
- Not displayed. The six metric cards on Home today show only counts
  that `/metadata` provides (`total_projects`, `active_projects`,
  `total_repos`, `total_external_repos`, `total_dependency_edges`,
  `total_contributor_edges`).

**Requested resolution**
- Add rolling-window fields to `/metadata`:
  ```jsonc
  {
    "active_contributors_30d": 42,
    "active_contributors_90d": 118,
    "commits_30d": 1340
  }
  ```
- Or deprioritize entirely if out of v0 scope.

---

### G10 · `RepoDetailResponse.releases[]` is typed as `object[]` — **P1, schema-field**

**What the UX asks for**
- RepoDetail → releases timeline.

**What the OpenAPI spec provides**
- `releases: object[] | null` — no concrete inner schema published.

**Current workaround**
- RepoDetail page not wired to the releases field yet — blocked on
  schema clarification.

**Requested resolution**
- Publish the concrete release schema (version, tag, published_at,
  url, changelog?).

---

### G11 · Field-level provenance tags — **P2, data**

**What the UX asks for**
- Every displayed field has a visible source marker
  ("GitHub", "deps.dev", "OpenGrants", "PG Atlas") per the spec's
  data-transparency section.

**What the API provides**
- None. The provenance is implicit in which source the backend pulled
  from, not exposed on the wire.

**Current workaround**
- Frontend keeps a static provenance map (in `HomeHeader`'s
  `DATA_SOURCES` constant today). Acceptable for v0.

**Requested resolution**
- Optional future enhancement: add `provenance` metadata per field or
  per endpoint in OpenAPI extensions.

---

### G12 · Spec/API naming mismatch — **P2, naming**

- Spec body text says `git_org_url`; API schema ships `git_owner_url`.
- Frontend uses `git_owner_url` (API is ground truth).
- Requested: update the spec prose so contributors don't search for a
  field that doesn't exist.

---

### G13 · `category` field location — **P2, schema-field**

- Spec says SCF category lives under `projects.metadata.scf_category`.
- API exposes it at top level as `ProjectSummary.category` (currently
  `null` on every SCF project).
- Frontend uses `category`. Requested: confirm final location and
  populate the field.

---

### G14 · `git_owner_url` sparsely populated on SCF projects — **P2, data**

**Observation**
- In the first 5 projects returned by `GET /projects`, only one
  (`Blux React & JS packages and Dashboard`) has a non-null
  `git_owner_url`. The rest are `null`, even for projects that clearly
  have public repositories.

**Impact**
- Round leaderboard: GitHub icon link is missing on most rows.
- ProjectDetail header: "View on GitHub" CTA unavailable.

**Requested resolution**
- Backfill `git_owner_url` for SCF projects that have a canonical repo
  org or primary repo URL.

---

## Cross-reference: impact per page

| Page                          | Blocked by           |
|-------------------------------|----------------------|
| Home · Metric strip           | G9 (nice-to-have only) |
| Home · Ecosystem Health       | G1, G6               |
| Home · Top Critical           | G1, G3               |
| Home · All Rounds             | ✅ Static config only |
| Home · Award Health           | ✅ Static config only |
| Home · Tranche Avg            | ✅ Static config only |
| Round detail                  | G1, G2, G3, G4, G5, G14 |
| ProjectDetail (not yet wired) | G1, G2, G7, G13, G14 |
| RepoDetail (not yet wired)    | G1, G10              |
| Contributor detail            | None — endpoint is complete |
| Contributors index            | G8                   |
| Graph explorer (v1+)          | Deferred             |

---

## How this document is maintained

- Each time a frontend integration discovers a new gap, append an entry
  under "Detailed findings", bump the summary table, and update the
  per-page impact matrix.
- When the backend ships a fix, mark the entry `RESOLVED` with the
  date and remove it from the summary table.
- Git history of this file is the authoritative record of when each
  gap was discovered and closed.
