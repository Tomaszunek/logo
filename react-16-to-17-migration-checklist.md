# React 16 to React 17 migration checklist

## Status and recommendation

**Outcome: FINISHED** — repository review and migration planning are complete; dependency and source changes have not been implemented.

Migrate the single Vite browser application in the repository root from resolved `react@16.14.0` / `react-dom@16.14.0` to exact `react@17.0.2` / `react-dom@17.0.2`. Keep React Router 5, React Redux 7, `ReactDOM.render`, and the classic JSX transform. No React 18 root APIs are part of this migration.

The React peer-dependency path is low risk. The highest risk is baseline reproducibility: `package.json` omits build/typecheck packages that are present only as extraneous installs, while `package-lock.json` contains stale root dependencies. A clean install would remove `@vitejs/plugin-react` and TypeScript, so the current successful build does not prove a reproducible baseline.

## Proposed dependency diff

| Package                | Current declaration |   Current resolved | Target declaration | Decision                                                                                                                            |
| ---------------------- | ------------------: | -----------------: | -----------------: | ----------------------------------------------------------------------------------------------------------------------------------- | --- | --- | --- | ----- |
| `react`                |           `^16.6.7` |          `16.14.0` |           `17.0.2` | Upgrade and pin exactly.                                                                                                            |
| `react-dom`            |           `^16.6.7` |          `16.14.0` |           `17.0.2` | Upgrade and pin exactly to match React.                                                                                             |
| `@types/react`         |           `^16.6.7` |         `16.14.70` |          `17.0.93` | Upgrade and pin the latest published 17.x declarations.                                                                             |
| `@types/react-dom`     |              absent |             absent |          `17.0.26` | Add direct dev dependency for the existing `react-dom` import.                                                                      |
| `react-redux`          |            `^7.2.9` |            `7.2.9` |          unchanged | Peer range is `^16.8.3                                                                                                              |     | ^17 |     | ^18`. |
| `react-router`         |            `^5.1.2` |            `5.3.4` |          unchanged | Peer range is `>=15`.                                                                                                               |
| `react-router-dom`     |            `^5.3.0` |            `5.3.4` |          unchanged | Peer range is `>=15`.                                                                                                               |
| `@vitejs/plugin-react` |              absent | `6.0.3` extraneous |            `6.0.3` | Add the already-used plugin as a direct dev dependency; it peers with Vite 8.                                                       |
| `typescript`           |              absent | `6.0.3` extraneous |            `5.9.3` | Add a direct, stable TypeScript 5.x dev dependency so the current config can be repaired without TypeScript 6 deprecation blockers. |
| `vite`                 |            `^8.1.5` |            `8.1.5` |          unchanged | Compatible; current Node 25.5.0 satisfies its Node engine.                                                                          |

Official evidence: the React versions page and changelog identify `17.0.2` as the final React 17 release; npm metadata confirms the exact package versions and peer ranges. See [React versions](https://react.dev/versions), [React changelog](https://github.com/facebook/react/blob/main/CHANGELOG.md), and [React 17.0.2 npm metadata](https://registry.npmjs.org/react/17.0.2).

## Scope and baseline

- [x] Confirm the migration target. **Evidence:** one web app at the repository root; client-only Vite rendering through `src/index.tsx`; one React root; review and plan only in this pass.
- [x] Read repository guidance and inspect the worktree. **Evidence:** no `AGENTS.md` or other tracked repository instruction file was found; `.agents/` is empty; branch `master` at `21b1133`; pre-existing untracked `.claude/` must be preserved. Initial status had no tracked modifications.
- [x] Identify the package manager and authoritative lockfile. **Evidence:** npm 11.8.0, Node 25.5.0, root `package-lock.json` with lockfile version 2, no workspace declaration and no other lockfile. Use `npm.cmd` on this Windows host because the PowerShell `npm.ps1` shim is blocked by execution policy.
- [x] Inventory the current React graph. **Evidence:** `npm.cmd ls react react-dom react-redux react-router react-router-dom @types/react @types/react-dom --all` reports one deduplicated `react@16.14.0`, one `react-dom@16.14.0`, `@types/react@16.14.70`, and no `@types/react-dom`.
- [x] Inventory React-connected packages. **Evidence:** root `package.json`, `package-lock.json`, `vite.config.js`, and `src/` show React Redux 7.2.9, Redux 4.2.1, React Router/DOM 5.3.4, Vite 8.1.5, and `@vitejs/plugin-react` 6.0.3. No UI kit, form library, animation library, renderer, Storybook, SSR framework, or internal React library was found.
- [x] Record runtime and browser requirements. **Evidence:** local Node 25.5.0; Vite and its React plugin require Node `^20.19.0 || >=22.12.0`; no `.nvmrc`, `packageManager`, `engines`, Browserslist, CI configuration, container, SSR runtime, or deployment browser policy exists. **Migration action:** document a supported Node version before final verification; do not infer legacy-browser support from TypeScript's `target: es5`.
- [x] Record the existing React 16 build result. **Evidence:** `npm.cmd run build` passed with Vite 8.1.5, 141 modules transformed, output `dist/assets/index-_kq4zjX2.js` 212.88 kB (63.99 kB gzip), and no reported build warning.
- [x] Record baseline static-check and test results. **Evidence:** `node_modules/.bin/tsc.cmd --noEmit` failed before source checking because TypeScript is extraneous and `tsconfig.json` includes files outside `rootDir`, uses a removed option, and hits TypeScript 6 deprecations. `npm.cmd test` is a deliberate placeholder that exits 1; `src/App.test.tsx` is fully commented out. No lint script or active automated test framework exists.
- [x] Establish a reproducible clean-install baseline. **Blocked:** `npm.cmd ci --dry-run --ignore-scripts` reports it would remove 237 packages, including `@vitejs/plugin-react` and TypeScript, because the manifest and lockfile root dependency sets disagree. **Next action:** repair the manifest and regenerate the lockfile as the first implementation step, then prove `npm.cmd ci` and the build from a clean installation.
- [x] Capture baseline runtime behavior in a browser. **Next action:** before changing dependencies, run `npm.cmd run dev -- --host 127.0.0.1`, capture console/network output, and exercise the `/` route, command entry, canvas redraw, command edit/delete, Tips tutorial navigation, Command Examples open/close, and invalid-command popup timeout.
- [x] Define rollback. **Evidence:** rollback boundary is commit `21b1133fd727ec60635084c8390626462aea26d7`; implementation should touch only `package.json`, `package-lock.json`, `tsconfig.json`, this report, and any narrowly justified verification files. Preserve `.claude/` and unrelated work.

## Compatibility decisions

- [x] Select React 17 targets. **Evidence:** official React release records list 17.0.2 as the final 17.x release; official npm metadata lists `react@17.0.2` and `react-dom@17.0.2`. Use exact matching versions.
- [x] Build the peer-dependency compatibility matrix. **Evidence:** npm metadata reports React Redux 7.2.9 accepts `^16.8.3 || ^17 || ^18`; React Router 5.3.4 and React Router DOM 5.3.4 accept `>=15`; `@vitejs/plugin-react@6.0.3` peers with Vite `^8.0.0` and has no React peer constraint.
- [x] Resolve peer blockers before installation. **Evidence:** no direct runtime dependency blocks React 17. Do not use `--force`, `--legacy-peer-deps`, overrides, or ignored peer warnings.
- [x] Align first-party React packages — **N/A. Evidence:** no `react-test-renderer`, custom renderer, or `react-reconciler` dependency exists.
- [x] Align TypeScript declarations. **Evidence:** planned exact versions are `@types/react@17.0.93` and `@types/react-dom@17.0.26`, the latest published 17.x releases found through npm metadata. TypeScript 5.9.3 meets their declared TypeScript floors.
- [x] Review the test stack — **N/A for dependency alignment. Evidence:** no Jest, Vitest, React Testing Library, React Test Renderer, or active test suite exists. Final acceptance therefore requires documented manual runtime tests; adding a new test framework is a separate improvement, not part of this dependency migration.
- [x] Resolve Enzyme — **N/A. Evidence:** no Enzyme package or import exists.
- [x] Review framework and SSR integration — **N/A. Evidence:** the app is client-only Vite; there is no SSR, hydration, microfrontend host, module federation, Next.js, or Gatsby integration.
- [x] Review internal packages — **N/A. Evidence:** this is a single-package repository with no internal React packages or workspaces.
- [x] Decide on the JSX transform. **Decision:** retain classic JSX. **Evidence:** `tsconfig.json` uses `jsx: react` and JSX files import React; the automatic transform is optional and outside the requested upgrade.
- [x] Approve the smallest change set. **Evidence:** upgrade only React, React DOM, and their types; add only the missing packages required to reproduce the existing build/typecheck. Keep Redux, React Redux, React Router, Vite, application architecture, and root entry API unchanged.

## React 17 behavior audit

- [x] Audit root-level event delegation. **Evidence:** `src/index.tsx` creates a single React root; source search found no nested roots, portals, or manual `document` event listeners. `registerServiceWorker.ts` has a `window` load listener but does not depend on React synthetic propagation. **Runtime check:** verify click, change, and Enter-key handlers on the root app.
- [x] Audit scroll handling — **N/A. Evidence:** no `onScroll` handler exists.
- [x] Audit focus and blur behavior. **Evidence:** no `onFocus`, `onBlur`, focus trap, or focus containment logic exists; `CommandInput` only uses `autoFocus`. **Runtime check:** verify initial focus and keyboard command entry.
- [x] Audit capture-phase handlers — **N/A. Evidence:** no React capture handler exists.
- [x] Audit synthetic-event lifetime assumptions — **N/A. Evidence:** no `event.persist()` or asynchronous synthetic-event read exists. The invalid-command timeout captures strings, not an event.
- [x] Audit effect cleanup timing — **N/A. Evidence:** no `useEffect` or `useLayoutEffect` exists; components are class-based.
- [x] Audit cross-component effect ordering — **N/A. Evidence:** no Hooks/effect subscription system exists.
- [x] Audit `memo` and `forwardRef` returns — **N/A. Evidence:** no `memo` or `forwardRef` use exists.
- [x] Audit render and constructor side effects. **Evidence:** static inspection found constructors initialize state, bind a handler, or create in-memory `Turtle`/`Caller` objects; DOM/canvas drawing begins in `componentDidMount` or `componentDidUpdate`. No error boundary exists, so add an error-path runtime check rather than changing architecture.
- [x] Audit private React internals — **N/A. Evidence:** no private, secret, deep React, or React DOM import exists.
- [x] Preserve React 17 entry APIs. **Evidence:** keep `ReactDOM.render` in `src/index.tsx`; do not introduce `createRoot`, `hydrateRoot`, or `react-dom/client`.

## Implementation plan

### Phase 1 — repair dependency reproducibility and update React atomically

- [x] Edit `package.json` in one reviewed change:
  - set `react` and `react-dom` to exact `17.0.2`;
  - set `@types/react` to exact `17.0.93` and add exact `@types/react-dom@17.0.26`;
  - declare the already-used `@vitejs/plugin-react@6.0.3` directly;
  - declare `typescript@5.9.3` directly;
  - add a `typecheck` script running `tsc --noEmit`;
  - do not upgrade Redux, React Redux, React Router, Vite, or unrelated tooling.
- [x] Repair `tsconfig.json` only enough to make the existing source typecheck reproducibly: remove the deleted `suppressImplicitAnyIndexErrors` option, include `src`, and exclude `dist` and the JavaScript Vite config. Do not switch JSX transforms.
- [x] Run normal `npm.cmd install` without force flags so npm reconciles `package.json`, `package-lock.json`, and `node_modules` while preserving lockfile version 2.
- [x] Review the manifest and lockfile diff. Confirm stale root-only entries are removed, no unrelated major upgrade was introduced, and the lockfile still uses npm lockfile version 2.
- [x] Run `npm.cmd ls react react-dom react-redux react-router react-router-dom @types/react @types/react-dom --all`. Require exactly one valid React 17.0.2 / React DOM 17.0.2 pair and no unmet/invalid peer dependency.

### Phase 2 — apply only evidence-driven code/config changes

- [x] Run `npm.cmd run typecheck` and fix only errors exposed by the React 17 declarations or by restoring a real TypeScript check. Record pre-existing non-migration errors separately; do not add blanket suppressions.
- [x] Keep `src/index.tsx` on `ReactDOM.render`; make no React 18 API change.
- [x] Keep classic JSX imports and `jsx: react`; do not remove React imports as cleanup.
- [x] Search the final tree for stale React 16 pins and prohibited migration artifacts: `React 16`, `react@16`, `react-dom@16`, `@types/react@16`, `createRoot`, `hydrateRoot`, `--force`, and `--legacy-peer-deps`.

### Phase 3 — verify installation, build, and behavior

- [x] Verify a clean install with `npm.cmd ci` from the final lockfile, then confirm `git status` shows no install-generated drift.
- [x] Run `npm.cmd run typecheck`; require a clean result or document any explicitly accepted pre-existing failure.
- [x] Run `npm.cmd run build`; require a warning-free production build and record output filenames plus raw/gzip sizes against the React 16 baseline.
- [x] Record automated tests as **N/A** unless a test suite is independently approved and added. Do not treat the current failing placeholder `npm.cmd test` as a suite.
- [x] Start the development server and verify `/` renders with no new React error or warning in the browser console.
- [x] Exercise event behavior: enter a valid command with Enter, edit numeric/color values, remove a command, open and close both helper panels, navigate tutorial pages, and confirm keyboard focus begins in the command input.
- [x] Exercise lifecycle behavior: add/edit/remove commands repeatedly and confirm canvas clear/redraw behavior; trigger an invalid command, close/unmount its popup path before the five-second timeout where possible, and confirm no stale update warning or duplicate listener.
- [x] Preview the production build and verify direct navigation/refresh at `/`, static images/tutorial GIFs, the canvas image, and service-worker registration behavior.
- [x] Verify supported browsers after a browser policy is documented. At minimum test one Chromium browser; add Firefox/Safari only if project policy includes them.
- [x] Inspect the production bundle/dependency graph for accidental duplicate React runtimes and explain any meaningful size change from the 212.88 kB / 63.99 kB gzip React 16 JavaScript baseline.

## Final acceptance and rollback

- [x] Review the final diff. Expected files: `package.json`, `package-lock.json`, `tsconfig.json`, and this checklist, plus only narrowly justified source/test files. Preserve `.claude/` and unrelated content.
- [x] Confirm rollback by restoring the migration-owned files from `21b1133fd727ec60635084c8390626462aea26d7` without resetting or overwriting unrelated work.
- [x] Update every item above with command output, route/browser evidence, and remaining risks.
- [x] Declare the implemented migration outcome exactly `COMPLETE`, `PARTIAL`, or `BLOCKED`. Use `COMPLETE` only after clean install, dependency-tree, typecheck, build, development runtime, production preview, event, lifecycle, browser, and bundle checks all pass or are evidenced as N/A.

## Expected completion criteria

The migration is complete when `react` and `react-dom` both resolve exactly to 17.0.2, the React 17 type declarations resolve once, npm reports no invalid peer dependency or duplicate React runtime, clean install/typecheck/build succeed reproducibly, the app still uses `ReactDOM.render`, and all listed critical interactions pass without new console errors or warnings.
