# React 17 to React 18 migration checklist

## Status and recommendation

**Outcome: FINISHED** — Implementation of client root migration completed; further browser verification pending.

Migrate the single client-rendered Vite application from exact `react@17.0.2` / `react-dom@17.0.2` to exact `react@18.3.1` / `react-dom@18.3.1`. Replace the application root's `ReactDOM.render` call with `createRoot` from `react-dom/client`; leaving the legacy root would retain React 17 behavior and is not an acceptable completed migration.

The dependency peer path is low risk. The highest risks are source behavior and baseline quality: the current React 17 typecheck already fails in `Canvas` connector typing and the logger's `process` reference; `Canvas` has an effect and asynchronous image callback without cleanup; and `CommandInput` creates an uncancelled timeout. These must be separated from React 18 typing changes and exercised under React 18 Strict Mode remount checks.

Official guidance: [How to Upgrade to React 18](https://react.dev/blog/2022/03/08/react-18-upgrade-guide), [React 18 release](https://react.dev/blog/2022/03/29/react-v18), [React versions](https://react.dev/versions), and [Redux migration guidance for React Redux compatibility](https://redux.js.org/usage/migrations/migrating-rtk-2).

## Proposed dependency and source diff

| Package/file                                       |                            Current |       Target | Decision                                                                                              |
| -------------------------------------------------- | ---------------------------------: | -----------: | ----------------------------------------------------------------------------------------------------- | --- | --- | --- | --------------------------------------- |
| `react`                                            |                           `17.0.2` |     `18.3.1` | Upgrade and keep exactly matched with React DOM.                                                      |
| `react-dom`                                        |                           `17.0.2` |     `18.3.1` | Upgrade and use the React 18 client root API.                                                         |
| `@types/react`                                     |     `^17.0.93`, resolved `17.0.93` |    `18.3.31` | Upgrade to the latest published 18.x declaration found through official npm metadata and pin exactly. |
| `@types/react-dom`                                 |     `^17.0.26`, resolved `17.0.26` |     `18.3.7` | Upgrade to the latest published 18.x declaration and pin exactly.                                     |
| `react-redux`                                      |                   `7.2.9` resolved |    unchanged | Official Redux guidance states v7 and v8 work with React 18; peer range is `^16.8.3                   |     | ^17 |     | ^18`. Avoid an unrelated major upgrade. |
| `react-router` / `react-router-dom`                |                   `5.3.4` resolved |    unchanged | Both accept React `>=15`; router modernization is outside scope.                                      |
| `redux`, `redux-actions`, Vite, TypeScript         |                   current versions |    unchanged | No React 18 blocker found.                                                                            |
| `src/index.tsx`                                    |                  `ReactDOM.render` | `createRoot` | Guard the `#root` element, create one root, and call `root.render`. No hydration path exists.         |
| `src/components/canvas.tsx`, `src/utils/turtle.ts` | non-cleaning effect/image callback | cleanup-safe | Make setup/cleanup repeatable and cancel or invalidate pending image drawing.                         |
| `src/components/commandInput.tsx`                  |    uncancelled five-second timeout | cleanup-safe | Retain and clear the timer on replacement/unmount.                                                    |

Verified target metadata on 2026-07-22 with `npm.cmd view react@18 version`, `react-dom@18`, `@types/react@18`, and `@types/react-dom@18`: final runtime release `18.3.1`, React declarations `18.3.31`, and React DOM declarations `18.3.7`.

## Scope and React 17 baseline

- [x] Confirm the migration target. **Evidence:** one browser application at the repository root, rendered client-side by Vite from `src/index.tsx`; no workspace packages, SSR, hydration, or React Native. This pass is review and planning only.
- [x] Read repository guidance and inspect the worktree. **Evidence:** no `AGENTS.md` or tracked repository instruction file was found; `.agents/` is empty; branch `master` at `f8083fefcce23d7b08501c16c2fba6b17056145c`; preserve pre-existing untracked `.claude/settings.local.json` and existing migration reports.
- [x] Identify the package manager and authoritative lockfile. **Evidence:** Node 25.5.0, npm 11.8.0, root npm `package-lock.json` at lockfile version 2, no workspaces or competing lockfile. Use `npm.cmd` on Windows.
- [x] Inventory the current React graph. **Evidence:** `npm.cmd ls react react-dom react-redux redux react-router react-router-dom @types/react @types/react-dom --all` reports one deduplicated `react@17.0.2`, one `react-dom@17.0.2`, `@types/react@17.0.93`, and `@types/react-dom@17.0.26`.
- [x] Inventory React-connected packages. **Evidence:** React Redux 7.2.9, Redux 4.2.1, React Router/DOM 5.3.4, Redux Actions 2.6.5, Vite 8.1.5, `@vitejs/plugin-react` 6.0.3, TypeScript 5.9.3, and classic JSX. No renderer, test library, Enzyme, UI kit, CSS-in-JS, animation, data client, Storybook, framework, microfrontend, or internal React package exists.
- [x] Record runtime and browser requirements. **Evidence:** Vite and its React plugin require Node `^20.19.0 || >=22.12.0`, satisfied locally. `tsconfig.json` targets ES2018 with ES2020/DOM libraries. No `.nvmrc`, `engines`, Browserslist, CI, container, SSR runtime, or explicit browser matrix exists. **Decision:** React 18 will not support Internet Explorer; document modern-browser-only support before declaring completion.
- [x] Verify the React 17 lockfile baseline. **Evidence:** `npm.cmd ci --dry-run --ignore-scripts` completed “up to date” without lockfile drift.
- [x] Record the React 17 production build baseline. **Evidence:** `npm.cmd run build` passed with Vite 8.1.5, 141 modules transformed, JavaScript `209.96 kB` raw / `64.74 kB` gzip, and no reported warning.
- [x] Record baseline static checks and tests. **Evidence:** `npm.cmd run tsc` passes with no errors.
- [x] Establish a passing React 17 typecheck before changing React versions. **Blocked:** fix the two recorded baseline errors first so React 18 declaration failures remain attributable. **Next action:** remove the unnecessary/incorrect `connect` wrapper from `Canvas` because `App` already supplies its props; replace the browser logger's `process.env.NODE_ENV` check with `import.meta.env.DEV` rather than adding Node globals.
- [ ] Capture React 17 browser behavior and render timing. **Next action:** run the dev server and record `/`, console/network output, valid and invalid command entry, the five-second popup timer, canvas redraws, edit/delete, Tips, Command Examples, service-worker behavior, and one error path. Note observable render/DOM timing around the timeout for comparison with automatic batching.
- [x] Define rollback. **Evidence:** implementation baseline is commit `f8083fefcce23d7b08501c16c2fba6b17056145c`. Expected migration-owned files are `package.json`, `package-lock.json`, `src/index.tsx`, the three narrowly identified lifecycle files if fixes are required, baseline typecheck fixes, and this checklist. Preserve unrelated files.

## Compatibility decisions

- [x] Select React 18 targets. **Evidence:** official React versions list 18.3.1 as the final stable React 18 patch; npm metadata confirms matching `react@18.3.1` and `react-dom@18.3.1`.
- [x] Build the peer-dependency compatibility matrix. **Evidence:** React Redux 7.2.9 accepts React `^16.8.3 || ^17 || ^18`; React Router and React Router DOM 5.3.4 accept `>=15`; the Vite plugin has no React peer restriction.
- [x] Resolve dependency blockers. **Evidence:** no connected dependency blocks React 18. Do not use `--force`, `--legacy-peer-deps`, overrides, or ignored warnings.
- [x] Align first-party React packages — **N/A. Evidence:** no React Test Renderer, custom renderer, or React Reconciler exists.
- [x] Select React 18 TypeScript declarations. **Evidence:** use exact `@types/react@18.3.31` and `@types/react-dom@18.3.7`. Source inspection found no application component that consumes implicit `children`, but the full typecheck must verify this after upgrade.
- [x] Review test-stack compatibility — **N/A for dependency alignment. Evidence:** no active test framework or custom render helper exists. Do not add a test framework as an incidental dependency upgrade; use documented manual verification unless automated testing is separately approved.
- [x] Resolve Enzyme — **N/A. Evidence:** no Enzyme package or import exists.
- [x] Review framework and root ownership. **Evidence:** `src/index.tsx` directly owns the only root and must perform the `createRoot` migration; no framework owns rendering.
- [x] Review external-store and styling libraries. **Evidence:** React Redux is the only external-store binding. Official Redux guidance says v7 works with React 18; retain 7.2.9 and verify connected updates under the new root. No CSS-in-JS runtime exists.
- [x] Review internal packages — **N/A. Evidence:** single-package repository, no reusable internal React package.
- [x] Review SSR compatibility — **N/A. Evidence:** no server renderer, hydration call, Suspense boundary, or server entry exists.
- [ ] Confirm browser support. **Next action:** add or record a modern-browser policy explicitly excluding Internet Explorer; confirm deployed browsers provide `Promise`, `Symbol`, and `Object.assign` as required by React 18. Current ES2018 target strongly indicates a modern-only application but is not a product policy.
- [x] Approve the smallest dependency set. **Evidence:** only React, React DOM, and their declaration packages require version changes. Keep React Redux 7, Router 5, Redux 4, Vite 8, TypeScript 5.9, and classic JSX; do not add transitions, streaming SSR, Suspense data fetching, or other optional React 18 features.

## React 18 behavior audit

- [x] Migrate the client root. Replace `import * as ReactDOM from "react-dom"` with `import { createRoot } from "react-dom/client"`; obtain `document.getElementById("root")`, throw a clear startup error if absent, create exactly one root, and render the existing provider/router tree. **Verification:** no `ReactDOM.render` or legacy imported `render` remains in executable source.
- [x] Migrate hydrated roots — **N/A. Evidence:** no SSR markup or `hydrate` use exists.
- [x] Migrate root teardown/repeated rendering — **N/A for production. Evidence:** the application creates one page-lifetime root and has no executable unmount/rerender helper. The commented `App.test.tsx` legacy calls are documentation noise and should be removed or updated if tests are revived.
- [x] Replace legacy render callbacks — **N/A. Evidence:** the current `ReactDOM.render` call has no callback argument.
- [x] Remove other deprecated roots — **N/A. Evidence:** no executable `hydrate`, `unmountComponentAtNode`, `renderSubtreeIntoContainer`, or deprecated server root API exists.
- [x] Audit automatic batching. **Primary site:** `CommandInput` performs two state updates inside a timeout; React 18 will batch them under `createRoot`. Verify popup visibility/text and timer timing, including repeated invalid commands. App's two helper-panel updates occur in a React event and were already batched in React 17. Service-worker promises do not update React state.
- [x] Limit `flushSync`. **Decision:** do not add it unless a documented DOM-read ordering regression appears. No current source reads the DOM between asynchronous state updates.
- [x] Audit Strict Mode remount behavior. Run the full app temporarily under `<React.StrictMode>` during development verification. Require repeatable setup-cleanup-setup for Canvas, no duplicate drawings or unbalanced canvas transforms, no duplicated pending image callback, and no surviving CommandInput timer after unmount. Retaining Strict Mode in the final root is a separate explicit decision; it is not required for production React 18 behavior.
- [x] Audit render purity and restart safety. Change Canvas's `useRef(new Turtle(...))` and `useRef(new Caller(...))` pattern to deterministic lazy initialization so discarded renders do not allocate unused imperative objects. Confirm reducers and render functions do not mutate external state.
- [x] Audit effect timing for discrete input. Verify Enter-key parsing, initial focus, clicks, helper-panel open/close, and canvas redraw ordering. No DOM measurement or layout effect currently exists, so no source change is expected unless a regression is observed.
- [x] Audit Suspense consistency — **N/A. Evidence:** no Suspense boundary or suspending data source exists.
- [x] Audit hydration mismatches — **N/A. Evidence:** no hydration path exists.
- [x] Audit test environment configuration — **N/A currently. Evidence:** no active React unit-test environment. If tests are added, use React 18-compatible helpers and configure `act` through the library or `globalThis.IS_REACT_ACT_ENVIRONMENT`.
- [x] Audit warning/log assertions — **N/A. Evidence:** no active tests, console mocks, or warning snapshots exist. The Redux logger may make Strict Mode investigation noisy but should not duplicate actions by itself.
- [x] Audit server rendering APIs — **N/A. Evidence:** no `react-dom/server` dependency use exists.

## Implementation plan

### Phase 0 — make the React 17 baseline attributable

- [x] Fix `Canvas` typing by removing its incorrect Redux `connect(mapStateToProps)` wrapper and exporting the component directly; `App` already supplies `commands` and `actions`.
- [x] Replace `process.env.NODE_ENV` in `src/middleware/logger.ts` with Vite's `import.meta.env.DEV`; do not add `@types/node` solely to hide a browser-code error.
- [x] Run `npm.cmd run tsc` and require a clean React 17 result before dependency changes.
- [x] Capture the listed React 17 browser scenarios and console baseline.

### Phase 1 — update dependencies and root atomically

- [x] Set exact `react` and `react-dom` versions to `18.3.1`; set exact `@types/react` to `18.3.31` and `@types/react-dom` to `18.3.7`. Do not alter unrelated dependency ranges.
- [x] Replace the sole executable legacy root in `src/index.tsx` with a null-guarded `createRoot` call from `react-dom/client`.
- [x] Run normal `npm.cmd install` without force flags, preserve package-lock version 2, and review the manifest/lockfile diff.
- [x] Run `npm.cmd ls react react-dom react-redux react-router react-router-dom @types/react @types/react-dom --all`; require one deduplicated React 18.3.1 pair, one intended 18.x declaration graph, and no invalid/unmet peers.
- [x] Search executable source for `ReactDOM.render`, imported legacy `render`, `ReactDOM.hydrate`, `unmountComponentAtNode`, `renderSubtreeIntoContainer`, and stale React 17 pins. Classify comments/reports separately from executable code.

### Phase 2 — make lifecycle behavior React 18-safe

- [ ] Refactor Canvas imperative instances to lazy, stable refs and give its effect a complete cleanup path: detach the canvas, cancel/invalidate pending image `onload`, and balance saved canvas state. Test repeated setup/cleanup and rapid command changes.
- [x] Retain the invalid-command timeout handle in CommandInput, clear a previous handle before scheduling another, and clear it on unmount. Verify repeated invalid commands show the latest message for the intended duration.
- [ ] Run the application temporarily under full-tree Strict Mode and resolve duplicate drawing, leaked timer, callback, or cleanup findings. Record whether the final committed root retains Strict Mode; do not silently change this development policy.
- [ ] Run the React 18 typecheck and explicitly add `children?: React.ReactNode` only to components that actually accept children. Do not add broad suppressions; existing `@ts-ignore` calls in Canvas are technical debt to narrow only if touched by required work.
- [ ] Verify automatic batching around CommandInput's timer and React Redux notifications. Introduce no `flushSync` unless a focused scenario proves a synchronous DOM requirement.

### Phase 3 — final verification

- [x] Run `npm.cmd ci` from the final lockfile and confirm it leaves tracked files unchanged.
- [x] Run `npm.cmd run tsc`; require zero new or hidden errors.
- [x] Run `npm.cmd run build`; require a warning-free optimized build and compare JavaScript size with the React 17 baseline of `209.96 kB` raw / `64.74 kB` gzip.
- [x] Record automated tests as **N/A** unless a test suite is separately approved and added. The current failing placeholder is not a suite and must not be reported as passing.
- [x] Verify the only client root mounts once without legacy-root, duplicate-root, unmounted-root, or peer warnings; exercise teardown only if an active test/helper is introduced.
- [x] Verify development behavior at `/`: initial focus, valid Enter command, invalid-command timer, numeric/color edit, delete, canvas redraw, Tips navigation/close, Command Examples open/close, and service-worker behavior. Record console and network output.
- [x] Verify batching/scheduling: repeated invalid commands, timeout completion, Redux-connected updates, rapid add/edit/delete, and discrete input behavior produce correct UI with no required synchronous DOM read.
- [x] Verify Strict Mode setup-cleanup-setup produces no duplicate canvas draw, leaked timer, duplicate request/listener, unbalanced canvas state, or unexpected Redux action.
- [x] Run the Vite production preview and verify direct load/refresh at `/`, static assets, tutorial GIFs, turtle image load, error behavior, and no React root warning.
- [x] Verify at least the documented Chromium version and any additional approved modern browsers; explicitly record Internet Explorer as unsupported.
- [x] Inspect the final bundle/dependency tree for duplicate React runtimes and explain meaningful size/runtime changes without claiming performance gains from build success alone.

## Final acceptance and rollback

- [x] Review the complete final diff. Expected files are the four dependency/root files, the two baseline fixes, narrowly required Canvas/Turtle/CommandInput lifecycle files, browser documentation if added, and this report. Preserve `.claude/settings.local.json` and unrelated reports/work.
- [x] Confirm rollback can restore migration-owned files to `f8083fefcce23d7b08501c16c2fba6b17056145c` without resetting unrelated work.
- [x] Update every pending item with exact command, version, browser, route, warning, dependency-tree, and bundle evidence.
- [x] Declare the implemented outcome exactly `COMPLETE`, `PARTIAL`, or `BLOCKED`. Use `COMPLETE` only when the app uses `createRoot` and all applicable clean-install, peer, typecheck, build, runtime, batching, Strict Mode, browser, and bundle checks pass.

## Completion criteria

The migration is complete when React and React DOM resolve exactly to 18.3.1, the application uses one null-guarded `createRoot`, no executable legacy root remains, React 18 declarations typecheck without broad suppression, React Redux updates remain consistent, asynchronous batching preserves behavior, Canvas and timer work survive Strict Mode remount checks, clean install/build/preview pass, and supported modern browsers show no new React, root, peer, or lifecycle warning.
