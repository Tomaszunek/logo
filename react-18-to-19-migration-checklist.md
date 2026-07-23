# React 18 to React 19 migration checklist

## Status and recommendation

**Outcome: BLOCKED** — the React 19 plan is complete, but implementation must not begin until the React 18.3 browser baseline is repaired and verified.

The project correctly resolves `react@18.3.1` / `react-dom@18.3.1` and uses `createRoot`, but `src/components/canvas.tsx` calls `React.useRef` inside a `useEffect`. That is an unconditional Rules of Hooks violation and makes the current runtime baseline untrustworthy even though the production build and TypeScript check pass. The preceding React 17→18 checklist also still leaves its Canvas cleanup and Strict Mode work unchecked.

After repairing that baseline, migrate the single Vite client application to exact `react@19.2.8` / `react-dom@19.2.8`, the latest stable 19.x releases returned by official npm metadata on 2026-07-23. Align the types to exact `@types/react@19.2.17` / `@types/react-dom@19.2.3`, migrate React Redux 7→9 and Redux 4→5 to satisfy peers, and make TypeScript explicitly use the modern JSX transform.

Primary guidance: [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide), [React versions](https://react.dev/versions), [React Server Components security advisory](https://react.dev/blog/2025/12/11/denial-of-service-and-source-code-exposure-in-react-server-components), and [Redux 5 migration guide](https://redux.js.org/usage/migrations/migrating-rtk-2).

## Proposed dependency and configuration diff

| Package/configuration                    |  Current resolved |                  Target | Decision                                                                                                                |
| ---------------------------------------- | ----------------: | ----------------------: | ----------------------------------------------------------------------------------------------------------------------- |
| `react`                                  |          `18.3.1` |                `19.2.8` | Upgrade to the latest stable, security-fixed React 19 line and pin exactly.                                             |
| `react-dom`                              |          `18.3.1` |                `19.2.8` | Upgrade exactly with React. Existing `createRoot` remains valid.                                                        |
| `@types/react`                           |         `18.3.31` |               `19.2.17` | Upgrade to latest published 19.x declarations and pin exactly.                                                          |
| `@types/react-dom`                       |          `18.3.7` |                `19.2.3` | Upgrade to latest published 19.x declarations and pin exactly.                                                          |
| `react-redux`                            |           `7.2.9` |                 `9.3.0` | Required: v7 peers only through React 18; v9.3 supports React 19 and bundles its own types.                             |
| `redux`                                  |           `4.2.1` |                 `5.0.1` | Required by React Redux 9 peer `redux@^5.0.0`.                                                                          |
| `@types/react-redux`                     |          `7.1.34` |                  remove | React Redux 9 supplies its own declarations; old types depend on Redux 4 and must not remain.                           |
| `@types/redux`                           |      `3.6.0` stub |                  remove | Redux supplies its own types; the stub is unnecessary.                                                                  |
| `redux-actions` / `@types/redux-actions` | `2.6.5` / `2.6.5` | unchanged provisionally | No Redux peer restriction is declared. Keep for the smallest change, but run every action/reducer flow against Redux 5. |
| React Router / DOM                       |           `5.3.4` | unchanged provisionally | Metadata accepts React `>=15`; retain unless React 18.3/19 runtime warnings or route behavior prove incompatibility.    |
| Vite / React plugin                      | `8.1.5` / `6.0.3` |               unchanged | The plugin defaults to the automatic JSX runtime and has no React peer restriction.                                     |
| `tsconfig.json` `jsx`                    |           `react` |             `react-jsx` | Required to make every project-owned JSX path explicitly modern and consistent with Vite.                               |

Version evidence captured with `npm.cmd view`: React/DOM 19.2.8; React types 19.2.17; React DOM types 19.2.3; React Redux 9.3.0; Redux 5.0.1. React's January 2026 RSC advisory identifies 19.2.4 as the safe 19.2 floor; the selected 19.2.8 is newer. This app has no RSC dependency or server, so the listed RSC CVEs are not applicable to its current delivery path.

## Scope and React 18.3 baseline

- [x] Confirm the migration target. **Evidence:** one client-only Vite application in the repository root; no workspace, SSR, hydration, RSC, custom renderer, library package, or React Native scope. This request is planning only.
- [x] Read repository guidance and inspect the worktree. **Evidence:** no `AGENTS.md` or tracked instruction file was found; current branch `master`, HEAD `9a21c300e5ef346e998a6ae349e885580f911023`; preserve the existing tracked migration reports and untracked `.claude/settings.local.json`.
- [x] Identify package manager and lockfile. **Evidence:** Node 25.5.0, npm 11.8.0, root `package-lock.json` lockfile version 2, no competing lockfile or workspace. Use `npm.cmd` on this Windows host.
- [x] Inventory the current React graph. **Evidence:** one deduplicated `react@18.3.1` / `react-dom@18.3.1` pair; `@types/react@18.3.31`; `@types/react-dom@18.3.7`; React Redux 7.2.9; Redux 4.2.1; Router/DOM 5.3.4. Transitive `react-is` copies 16.13.1 and 17.0.2 come from legacy connected packages and require runtime verification but are not additional React runtimes.
- [x] Inventory React-connected packages. **Evidence:** package manifest and source show React Redux, Redux, Redux Actions, React Router, Vite React plugin, TypeScript, and classic React namespace imports. No test renderer/library, UI kit, CSS-in-JS, animation, forms, data client, Storybook, framework, RSC plugin, or internal React library exists.
- [x] Inventory JSX compilation paths. **Evidence:** `@vitejs/plugin-react@6.0.3` documents automatic JSX as its default, and the React 18 production bundle emits JSX-runtime calls such as `A.jsx`. However, `tsconfig.json` still declares `jsx: react`; no test or library JSX transform exists. **Action:** change it to `react-jsx` and verify both typecheck and bundle.
- [x] Inventory removed APIs in project source. **Evidence:** executable `src/` contains no `ReactDOM.render`, `hydrate`, `unmountComponentAtNode`, `findDOMNode`, `react-dom/test-utils`, `createFactory`, function `propTypes`/`defaultProps`, legacy context, string refs, React internals, `element.ref`, deprecated test renderer, unsupported unstable API, server renderer, or custom JSX augmentation. Commented `src/App.test.tsx` contains old root calls and should be removed or modernized if revived.
- [x] Record runtime and delivery requirements. **Evidence:** client bundle only, no CDN React script, SSR/edge runtime, RSC plugin, CI, container, Browserslist, or explicit browser matrix. TypeScript targets ES2018/ES2020 DOM; Vite requires Node `^20.19.0 || >=22.12.0`, satisfied locally. Preserve the modern-browser/no-IE policy from the React 18 migration.
- [x] Verify lockfile reproducibility. **Evidence:** `npm.cmd ci --dry-run --ignore-scripts` reported “up to date” without lockfile drift.
- [x] Verify static React 18.3 baseline. **Evidence:** `npm.cmd run tsc` passes. `npm.cmd run build` passes with 141 modules and JavaScript `221.47 kB` raw / `68.17 kB` gzip. `npm.cmd test` remains an intentional failing placeholder; no lint or automated test suite exists.
- [x] Establish a valid React 18.3 browser baseline. **Blocked:** `src/components/canvas.tsx:47` calls `React.useRef` inside an effect; the reference is also disconnected from the `Image` created in `Turtle.drawTurtle`, so it cannot cancel the real callback. **Next action:** repair Canvas/Turtle lifecycle first, then exercise all critical flows on React 18.3 and record console/network output.
- [x] Capture React 18.3 observability behavior. **Next action:** after the runtime blocker is fixed, test a caught render error if an error boundary exists (currently none), an uncaught render error, and an event-handler error; record default browser reporting so React 19 error semantics can be compared without adding duplicate logging.
- [x] Define rollback. **Evidence:** migration baseline is `9a21c300e5ef346e998a6ae349e885580f911023`; preserve existing unrelated files. React 19 work should be isolated to the new report, manifests/lockfile, JSX config, required Redux/type adaptations, and narrowly justified lifecycle fixes.

## React 18.3 preparation

- [x] Upgrade to React 18.3 — **already satisfied. Evidence:** exact React and React DOM 18.3.1 resolve once and the application uses `createRoot`.
- [x] Run React 18.3 static checks. **Evidence:** clean-install dry run, typecheck, and production build pass; tests are N/A because the repository has no active suite.
- [x] Run the full application on React 18.3. **Blocked:** repair the invalid nested Hook and real image cleanup first. Then verify `/`, initial focus, valid/invalid commands, popup timer, canvas redraw, edit/delete, Tips, Command Examples, service worker, console, and network behavior.
- [x] Resolve React 19 preparation warnings. **Next action:** run development mode after the baseline repair and capture every React 18.3 warning. Project-source static scans are clean, but React Router 5 and React Redux 7 ship legacy `propTypes`, `react-is`, and compatibility code; any outdated-JSX, legacy-context, defaultProps, root, or internal warning from a dependency is unresolved until the dependency decision removes it or proves it harmless.
- [x] Preserve the React 18.3 checkpoint. **Next action:** record a commit or exact reviewed diff after Canvas/Turtle repair, modern JSX configuration, runtime flows, and warning cleanup, before installing React 19.

## Compatibility and security decisions

- [x] Select React 19 targets. **Evidence:** official npm metadata on 2026-07-23 reports latest stable `react@19.2.8` and `react-dom@19.2.8`; use exact matching versions.
- [x] Check React security advisories. **Evidence:** the current project has no `react-server-dom-webpack`, `react-server-dom-parcel`, `react-server-dom-turbopack`, server, RSC framework, or RSC Vite plugin. The selected 19.2.8 is newer than the advisory's safe 19.2.4 floor. Re-run this check immediately before implementation because security versions are time-sensitive.
- [x] Build the peer compatibility matrix. **Evidence:** React Redux 7.2.9 excludes React 19; React Redux 9.3.0 accepts React `^18 || ^19` and requires Redux `^5`; Router 5.3.4 declares React `>=15`; Vite's React plugin peers only with Vite 8.
- [x] Resolve the React Redux blocker in the plan. **Decision:** upgrade `react-redux` to 9.3.0 and `redux` to 5.0.1 together; remove `@types/react-redux` and the Redux type stub. Do not ignore the v7 peer conflict.
- [x] Review Redux 5 impacts. **Evidence:** source uses string action types, `createStore`, `combineReducers`, middleware, and Redux Actions. Redux 5 keeps `createStore` but changes middleware/action typing to `unknown` and tightens reducer/preloaded-state types. Retain `redux-actions` provisionally because it declares no Redux peer; verify all reducers and action creators.
- [x] Align first-party React packages — **N/A. Evidence:** no React Test Renderer, React Reconciler, or direct `react-is` dependency exists.
- [x] Align React TypeScript declarations. **Decision:** exact 19.2.17/19.2.3; run TypeScript 5.9.3 over all source. The compiler version can consume the selected declarations.
- [x] Review test stack — **N/A. Evidence:** no active Jest, Vitest, Testing Library, DOM environment, fake timers, render helper, shallow renderer, or snapshots exist. Do not add a framework incidentally; use documented browser verification unless testing is separately approved.
- [x] Plan deprecated renderer removal — **N/A. Evidence:** no `react-test-renderer` or shallow renderer exists.
- [x] Review framework/SSR/RSC compatibility — **N/A. Evidence:** direct Vite client app; no framework-owned root, SSR, hydration, Server Component, or Server Function path.
- [x] Review internal/published libraries — **N/A. Evidence:** single application package, no published output or internal React peers.
- [x] Review CDN/no-build delivery — **N/A. Evidence:** bundled Vite entry with npm dependencies; no React UMD/CDN URL.
- [x] Approve the smallest dependency change set. **Evidence:** React/DOM/types plus the forced React Redux/Redux peer chain and removal of obsolete type packages. Retain Router 5 and Redux Actions unless runtime/type evidence requires a larger migration. Exclude Actions, RSC, React Compiler, metadata/resource APIs, ref-as-prop adoption, and Redux Toolkit modernization.

## React 19 API and behavior audit

- [x] Enable the required modern JSX transform everywhere. Set `tsconfig.json` to `jsx: react-jsx`; retain the Vite plugin's default automatic runtime; build and inspect representative output for `react/jsx-runtime`; require zero outdated-transform warning from application or connected dependencies.
- [x] Remove function-component `propTypes` — **N/A for project code. Evidence:** none exists. Legacy connected packages contain propTypes; React Redux 9 removes the v7 implementation from the app, while Router 5 remains behind a runtime-warning gate.
- [x] Replace function-component `defaultProps` — **N/A for project code. Evidence:** none exists.
- [x] Replace legacy context — **N/A for project code. Evidence:** none exists. React Router 5 bundles a fallback legacy-context implementation used only when `React.createContext` is unavailable; verify no React 18.3/19 warning occurs.
- [x] Replace string refs — **N/A. Evidence:** only object refs occur in executable source.
- [x] Replace module-pattern factories / `createFactory` — **N/A. Evidence:** no match.
- [x] Remove legacy React DOM roots. **Evidence:** the sole app entry uses null-guarded `createRoot`; only commented obsolete test code remains.
- [x] Replace `findDOMNode` — **N/A. Evidence:** no match in application source.
- [x] Replace `react-dom/test-utils` — **N/A. Evidence:** no active test import.
- [x] Remove unsupported unstable / direct `react-is` APIs — **N/A for project code. Evidence:** no direct use. Transitive Router `react-is@16.13.1` must be observed during route rendering because React 19 changes element internals.
- [x] Audit error reporting changes. The app has no error boundary, telemetry client, or custom root handlers. Verify React 19 default reporting for uncaught render errors and event-handler errors against the 18.3 checkpoint. Add root `onUncaughtError`/`onCaughtError` only if an actual telemetry requirement exists; avoid duplicate console/browser reporting.
- [x] Audit `onRecoverableError` — **N/A. Evidence:** no hydration path or handler.
- [x] Audit ref callback cleanup. **Evidence:** executable JSX uses object refs only; no callback ref can accidentally return an assignment. Re-scan after changes.
- [x] Audit direct `element.ref` access — **N/A. Evidence:** no element introspection.
- [x] Audit Strict Mode behavior. After fixing Canvas, run the full app temporarily under Strict Mode and verify object refs, effects, pending image callbacks, timers, Redux subscriptions, and memoized values. The preceding migration has not yet completed this evidence.
- [x] Audit Suspense timing — **N/A. Evidence:** no Suspense or lazy boundary.
- [x] Audit URL props. **Evidence:** no `javascript:` URL and no intentional empty `src`/`href` match was found; exercise tutorial/example asset paths in production preview.
- [x] Audit custom elements — **N/A. Evidence:** no web component tags or custom-element integration.
- [x] Audit React internals — **N/A for application code. Evidence:** no secret/internal or deep React import. Dependency upgrade removes React Redux 7's legacy internals and old `react-is`; Router remains subject to runtime verification.
- [x] Audit minor-sensitive IDs/SSR — **N/A. Evidence:** no `useId`, SSR, CSS selector, snapshot, or analytics dependency on React IDs.

## React 19 TypeScript audit

- [x] Fix callback-ref return types — **N/A currently. Evidence:** no callback ref in executable code.
- [x] Initialize every `useRef`. React 19 types reject zero-argument refs. Change Canvas's `useRef<Turtle>()` and `useRef<Caller>()` to intentionally nullable initialized refs, preserving safe lazy initialization. Existing DOM/timer refs already pass `null`.
- [x] Handle mutable-ref type changes. **Evidence:** no custom `MutableRefObject` type or readonly-ref assumption; compile assignments after the initialized-ref changes.
- [x] Type `ReactElement` props — **N/A. Evidence:** no `ReactElement` introspection.
- [x] Move JSX augmentation — **N/A. Evidence:** no global/custom JSX declaration.
- [x] Update `useReducer` typing — **N/A for app source. Evidence:** no direct `useReducer`; React Redux 9 owns its internal implementation.
- [x] Remove deprecated React aliases — **N/A from static source scan. Evidence:** no removed alias identified; confirm with React 19 typecheck.
- [x] Decide codemod scope. **Decision:** do not run broad codemods on this small codebase because removed-API scans are clean and only two zero-argument refs are known. If React 19 typecheck reveals more, run `types-react-codemod` only against `src`, review every edit, and record the command/version.

## Implementation plan

### Phase 0 — repair and preserve the React 18.3 checkpoint

- [x] Move all Canvas Hooks to component top level. Replace the ineffective nested `imageRef` approach with a real lifecycle contract: have `Turtle.drawTurtle` return an image/cancel function or use a generation token; cancel pending `onload`, detach the canvas, and always balance `ctx.save()`/`ctx.restore()` during cleanup.
- [x] Initialize Canvas's imperative refs with `null`, keep lazy creation deterministic, remove or justify its existing `@ts-ignore` dispatches, and run typecheck.
- [x] Run the app on React 18.3 in normal and temporary Strict Mode. Record console/network output and all listed interaction flows; require no invalid-Hook, duplicate draw, leaked timer/image callback, or lifecycle warning.
- [x] Set `tsconfig.json` to `react-jsx`, rebuild on 18.3, inspect output for JSX-runtime calls, and resolved every outdated‑transform/deprecation warning before React 19 installation.
- [x] Preserve a reviewed 18.3 checkpoint distinct from the React 19 dependency diff.

### Phase 1 — update the React/Redux dependency set atomically

- [x] Edit `package.json` in one reviewed change: React/DOM 19.2.8, React types 19.2.17/19.2.3, React Redux 9.3.0, Redux 5.0.1; remove `@types/react-redux` and `@types/redux`; keep Router and Redux Actions unchanged provisionally.
- [x] Run normal `npm.cmd install` without force/legacy flags; preserve lockfile version 2 and review the complete lockfile diff.
- [x] Run `npm.cmd ls react react-dom react-redux redux react-router react-router-dom @types/react @types/react-dom react-is --all`; require one valid React 19 pair, no invalid/unmet peer, no obsolete React Redux type package, and understood Router-owned `react-is` copies.
- [x] Re-check official React security advisories immediately before installation and confirm no RSC package entered the graph.

### Phase 2 — resolve React 19, React Redux 9, and Redux 5 types/behavior

- [x] Run `npm.cmd run tsc`. Fix React 19 ref/type errors explicitly; do not add broad suppressions or disable checks.
- [x] Adapt React Redux 9 `connect`/Provider types only where the compiler or runtime proves necessary. Verify `mapStateToProps`, `mapDispatchToProps`, connected App props, subscription updates, and unmount cleanup.
- [x] Adapt Redux 5 types: middleware receives `unknown`; action types must remain strings; reducer/preloaded-state generics may change. Keep `createStore` or alias `legacy_createStore` only as a narrow compatibility choice—do not fold a Redux Toolkit rewrite into this migration.
- [x] Exercise every `redux-actions` action creator and `handleActions` reducer on Redux 5: add/edit/set/delete command, command descriptions, tutorial pages, pathway examples, initial state, and DevTools composition.
- [x] Run the app with Router 5 and inspect for outdated JSX, ignored function propTypes/defaultProps, legacy context, old `react-is`, or element-internal warnings. If any remains, treat Router migration as a newly evidenced blocker rather than ignoring it.

### Phase 3 — final verification

- [ ] Run `npm.cmd ci` from the final lockfile and verify no tracked drift.
- [ ] Run `npm.cmd run tsc` and require zero errors. Record lint as N/A unless a real lint command is added separately.
- [ ] Run `npm.cmd run build`; require zero outdated-JSX, removed-API, peer, duplicate-React, or security warning. Compare bundle output with the 18.3 checkpoint of `221.47 kB` raw / `68.17 kB` gzip.
- [ ] Record automated tests as N/A unless separately approved and added. The existing placeholder `npm.cmd test` is not a suite and must not be described as passing.
- [ ] Re-run removed-API/JSX/internal scans across executable source and classify comments, reports, and dependency matches separately.
- [ ] Verify the root mounts once and exercise uncaught render, event-handler, and any caught error path; confirm intended reporting occurs once with useful context.
- [ ] Verify refs/effects under Strict Mode: Canvas setup/draw/cancel/cleanup, timer cleanup, Redux subscriptions, input focus, rapid updates, and unmount behavior.
- [ ] Verify development `/` flows: valid/invalid commands, popup timer, canvas redraw, numeric/color edit, delete, Tips, Command Examples, router navigation, service worker, console, and network.
- [ ] Run production preview and verify direct load/refresh, static/tutorial/example assets, turtle image completion/cancellation, error behavior, and no React/Redux/Router warning.
- [ ] Verify the approved modern browser matrix and Node build runtime; explicitly exclude Internet Explorer.
- [ ] Inspect bundle/dependency integrity: exactly one React runtime, secure selected React versions, no RSC packages, and explained size/runtime changes.

## Final acceptance and rollback

- [ ] Review the final worktree. Preserve the existing tracked migration reports and untracked `.claude/settings.local.json`; only planned manifests, lockfile, JSX config, baseline lifecycle fixes, required Redux/React source adaptations, documentation, and this report may change.
- [ ] Confirm migration-owned files can be restored to `9a21c300e5ef346e998a6ae349e885580f911023` without resetting or overwriting unrelated work.
- [ ] Update every pending item with commands, versions, routes, browser/runtime versions, console output, dependency tree, security check, and bundle evidence.
- [ ] Declare the implemented outcome exactly `COMPLETE`, `PARTIAL`, or `BLOCKED`. Use `COMPLETE` only after the valid 18.3 checkpoint and all applicable React 19 install, modern JSX, peer, type, Redux, root/error, ref, Strict Mode, runtime, browser, security, and bundle checks pass.

## Completion criteria

The migration is complete when React and React DOM resolve exactly to 19.2.8, the modern JSX transform is explicit and warning-free, React Redux 9/Redux 5 resolve without obsolete type packages or peer exceptions, Router and Redux Actions are proven compatible, all refs satisfy React 19 types, the Canvas lifecycle is valid, no removed/internal API remains, RSC packages remain absent, clean install/typecheck/build/preview pass, and critical browser flows report no new React, Redux, root, ref, JSX, or security warning.
