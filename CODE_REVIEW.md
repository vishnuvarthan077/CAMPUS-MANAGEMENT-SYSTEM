# Peer Code Review Process

**Cadence:** Daily, ongoing.
**Scope:** Every pull request opened by Dev 2 must be reviewed against the matrix below before it is merged to `main`.

## Process

1. Dev 2 opens a PR against `main` using the [PR template](.github/PULL_REQUEST_TEMPLATE.md).
2. The reviewer checks the PR at least once per working day until it is either merged or closed — PRs should not sit unreviewed overnight.
3. The reviewer works through the [Review Matrix](#review-matrix) below, checking off every applicable row. Rows that don't apply to the PR (e.g. "Frontend UX" on a backend-only change) are marked N/A, not skipped silently.
4. Findings are left as inline PR comments, one per issue, referencing the file and line.
5. A PR may only be merged once:
   - Every applicable matrix row passes, **and**
   - `npm run lint` and `npm run build` succeed in `Frontend/`, **and**
   - The backend boots cleanly (`node server.js`) and the changed endpoints have been manually exercised (e.g. with `curl`) against a local MongoDB instance.
6. If a row fails, the reviewer requests changes with specific, actionable feedback rather than merging with known issues.

## Review Matrix

| # | Category | What to check | Pass criteria |
|---|----------|----------------|----------------|
| 1 | Correctness | Does the code do what the PR description claims? Are edge cases (empty input, missing optional fields, not-found IDs) handled? | No logic errors; edge cases produce the expected status code / UI state, not a crash. |
| 2 | Data validation | Do new Mongoose schema fields have `required`/`min`/`max`/`enum`/`match` constraints matching the business rule? Does the frontend form validate the same fields before submit? | Invalid input is rejected with a 400 and a clear message, both from the API directly and from the form. |
| 3 | Error handling | Are all async route handlers wrapped in `asyncHandler`? Do thrown errors carry the right `res.status(...)` before `throw new Error(...)`? Does the global `errorHandler` produce the right status for `CastError` / `ValidationError` / duplicate-key (11000)? | No unhandled promise rejections; every failure path returns a JSON error body with a sensible status code (400/404/409), never a raw 500 for a client mistake. |
| 4 | Referential integrity | If the change adds a ref field (e.g. a new `ObjectId` relationship), is the referenced document's existence checked before create/update? Is deletion blocked while dependents exist, where that matters? | Creating/updating with a bad foreign key returns 400; deleting a document that other records depend on returns 409, not an orphaned reference. |
| 5 | API contract | Does the route follow the existing REST conventions in this repo (`POST /` + `GET /`, `GET/PUT/DELETE /:id`, `{ success, data }` / `{ success, message }` response shape)? Are query-param filters documented in the controller's JSDoc comment block? | New endpoints are indistinguishable in shape/style from existing ones in `Backend/routes/` and `Backend/controllers/`. |
| 6 | Security | Any user-supplied string interpolated into a Mongo query, shell command, or HTML without sanitization? Any secret, API key, or `.env` value committed? | No injection vectors; `git diff` contains no credentials; `.env` stays out of the commit. |
| 7 | Frontend UX (if applicable) | Does the new page/component follow an existing pattern in `Frontend/src/pages` or `components/` (loading state, error banner, modal form, confirm-before-delete)? Is it reachable from `App.jsx`'s tab list? | Visually and behaviorally consistent with the rest of the app; no dead-end UI (unreachable page, button with no handler). |
| 8 | Regression check | Does the change touch a shared file (`app.js`, `client.js`, `Modal.jsx`, `App.css`) in a way that could affect other modules? | Other modules' pages/endpoints still build, lint, and respond correctly after the change. |
| 9 | Tests / manual verification | Has the reviewer (or the PR author, documented in the PR description) actually run the new/changed endpoints and UI flows, not just read the diff? | PR description includes the manual verification steps taken (e.g. curl commands run, screenshots, or a short "tested: create/list/delete all return expected status" note). |
| 10 | Code hygiene | No leftover `console.log`/`debugger`, no commented-out dead code, no unused imports, `npm run lint` clean (warnings triaged, not silently ignored). | Diff is free of debug artifacts; lint passes or any warning is explicitly justified in the PR description. |

## Notes

- This matrix mirrors the conventions already established across the Department, Course, Notice, Placement, and Alumni modules in this codebase — new modules should look and behave like the existing ones, not introduce a parallel style.
- For a deeper automated pass (multi-file consistency, security-specific scan), pair this manual matrix with the `/code-review` or `/security-review` Claude Code skills before merge.
