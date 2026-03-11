# Unused Files Audit Plan (Collaborator Workflow)

Objective: identify files that are no longer used after the latest refactor, decide whether to keep/archive/delete each one safely, and prepare clean PR-ready changes.

## Scope

- Frontend: `client/src/**`, `client/public/**`
- Backend: `server/**`
- Project-level docs/config: `documents/**`, root config files
- Exclusions by default: `node_modules/**`, build outputs (`dist/**`), lockfiles unless specifically targeted

## Principles

- Do not delete based on a single signal.
- Classify each candidate with confidence (`high`, `medium`, `low`).
- Prefer archive/deprecate for uncertain items.
- Keep behavior unchanged unless explicitly approved.

## Phase 1: Build an Inventory

1. Generate full file inventory for source and assets.
2. Tag files by type: route/page/component/hook/context/style/asset/server/doc/test/config.
3. Mark expected entrypoints:
   - Frontend: `client/src/main.jsx`, `client/src/App.jsx`, `client/src/AppRoutes.jsx`
   - Backend: `server/server.js`

Deliverable: `inventory` table with path, type, and likely ownership.

## Phase 2: Static Reachability Check

1. Start from entrypoints and trace imports/exports transitively.
2. Identify files with zero inbound references.
3. Search string-based usage for false negatives:
   - dynamic imports
   - router path mappings
   - asset URL strings
   - config references

Signals for likely unused:

- Not imported anywhere in code graph.
- Not referenced by route config.
- Not loaded from public/index.html or runtime fetch.
- Not referenced in docs as an intentional placeholder.

Deliverable: `candidate-unused` list with reason per file.

## Phase 3: Runtime and Build Validation

1. Run frontend build and lint (`client`).
2. Run backend start/lint checks if available (`server`).
3. For each high-confidence candidate, simulate removal in a branch and re-run checks.
4. Confirm no route, API, or UI regression from the removal set.

Deliverable: validated subset that can be safely removed.

## Phase 4: Decision Matrix (What To Do With Each File)

Use this policy per candidate:

- Delete now:
  - High confidence unused
  - No planned near-term reuse
  - No docs requiring it

- Archive/deprecate:
  - Potential future reference
  - Historical implementation worth retaining
  - Place under `documents/archive/` or `references/archive/` with note

- Keep and annotate:
  - Used indirectly (dynamic/string/runtime)
  - Add comment or documentation stating why it exists

- Refactor/merge:
  - Duplicate responsibility with active file
  - Consolidate and keep only one source of truth

## Phase 5: Output Artifacts

1. `unused-files-report.md`
   - File path
   - Confidence
   - Evidence
   - Recommended action
   - Risk notes
2. `cleanup-changeset.md`
   - Exact delete/archive/keep decisions
   - Validation commands and results
3. PR summary
   - What was removed
   - What was archived
   - Why safe

## Recommended Confidence Rubric

- High:
  - No imports/references
  - No dynamic/string usage
  - No runtime need
- Medium:
  - No imports, but possible string/runtime reference
- Low:
  - Referenced by docs, scripts, or uncertain dynamic loading

## Suggested Command Workflow

- File inventory: `rg --files client/src client/public server documents`
- Reference checks: `rg "<filename-or-symbol>" client/src server documents`
- Import graph spot checks: `rg "import .* from|export .* from" client/src server`
- Build/lint validation:
  - `cd client && npm run lint && npm run build`
  - `cd server && npm run dev` (or project-specific validation)

## Risk Controls

- Work in a dedicated cleanup branch.
- Batch removals by confidence (high first).
- Commit in small groups with clear messages.
- Do not remove medium/low confidence files in same commit as high-confidence deletions.

## Proposed Execution Order

1. Produce inventory.
2. Produce candidate list with evidence.
3. Validate high-confidence candidates.
4. Apply delete/archive/keep decisions.
5. Re-run checks and prepare PR artifacts.

## Done Criteria

- Every candidate has a documented decision.
- Build/lint checks pass after cleanup.
- No route/API breakage observed.
- PR includes evidence and rationale for each removed or archived file.
