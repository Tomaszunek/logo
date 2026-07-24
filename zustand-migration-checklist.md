# Logo Redux-to-Zustand Migration Checklist

## Scope and baseline

- Project/workspace: `logo`, a single-package Vite browser application at `C:\Users\Tomasz\Desktop\pimp-my-codebase\logo`.
- TypeScript and framework: React 19.2.8, TypeScript 5.9.3, Vite 8.1.5, `strictNullChecks: true`, and otherwise non-strict TypeScript.
- Current state systems: hybrid migration state. `App` reads commands from Zustand 5.0.14, while Redux 5.0.1, React Redux 9.3.0, Redux Actions 2.6.5, the old store, actions, reducers, middleware, dependencies, and configuration remain.
- Zustand version: 5.0.14 is installed in `package.json`, `package-lock.json`, and the direct dependency tree.
- Validation commands: `npm.cmd run tsc`, `npm.cmd run build`, `npm.cmd ls react react-dom react-redux redux redux-actions zustand --depth=0`, and focused `rg` searches. The configured `npm.cmd test` intentionally exits with an error and is not a usable test suite.
- Original baseline: before migration edits, `npm.cmd run tsc` and `npm.cmd run build` passed with 113 modules transformed.
- Inspection result on 2026-07-24: `npm.cmd run tsc` fails in `src/reducers/commandDescription.ts:8`; `npm.cmd run build` passes with 63 modules transformed; the direct dependency tree contains Zustand and all three runtime Redux packages.
- Worktree protection: `.claude/settings.local.json` is pre-existing and untracked; leave it untouched.
- Assumptions and exclusions: preserve application behavior rather than fixing unrelated command-ID or mutation bugs; do not add persistence, SSR handling, a test framework, Immer, or server-state tooling.
- Immediate runtime risk: `src/index.tsx` removed `BrowserRouter` even though `src/router/index.tsx` still renders `Switch` and `Route`; restore the router boundary before runtime verification.

## State inventory and decisions

| Domain                             | Current owner                                            | Main consumers                                                           | Persistence/side effects                                       | Decision                                 | Reason                                                                                            |
| ---------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Command tree                       | `commandReducer` plus `CommandActions`                   | `Canvas`, `CommandEditor`, `CommandInput`, `CommandList`, example picker | Redraws the canvas; development action logging; no persistence | Move                                     | This is the only mutable state shared across unrelated components.                                |
| Command descriptions               | `commandDescriptionReducer` with a static initial object | Error handling, command list, helper panel                               | None                                                           | Keep outside Zustand                     | Immutable reference data does not need subscriptions or actions.                                  |
| Pathway examples                   | `pathwayExampleReducer` with a static initial array      | Example helper panel                                                     | Selecting an example replaces the command tree                 | Keep catalog outside Zustand             | The catalog is immutable; only its selection action belongs to the command store.                 |
| Tutorial pages                     | `tutorialPageReducer` with a static initial array        | `TutorialPopup`                                                          | None                                                           | Keep outside Zustand                     | The page list is immutable and popup navigation is already local React state.                     |
| Helper visibility and active panel | `App` local React state                                  | `App`, `HelperLayer`                                                     | None                                                           | Keep local                               | The state has one component owner and no unrelated consumer.                                      |
| Tutorial index and visibility      | `TutorialPopup` local React state                        | `TutorialPopup`                                                          | None                                                           | Keep local                               | The state is isolated to the popup lifecycle.                                                     |
| URL hash filter                    | React Router location in `mapStateToProps`               | `App` prop type only; no rendered consumer found                         | Browser URL                                                    | Keep in router or remove if still unused | URL state should not move to Zustand, and the current `filter` prop is not read by the component. |
| Optional `router` field            | `IRootState` type only                                   | No reducer or consumer                                                   | None                                                           | Remove                                   | It has no runtime owner.                                                                          |

## Target Zustand design

- Store boundary: one `useCommandStore` for the command tree and its four mutations. Keep all immutable catalogs as typed modules under `src/data`.
- Store type: `CommandStore = CommandState & CommandActions`, where state contains `commands: ICommandModel[]` and actions accept typed command values or IDs without Redux action envelopes.
- Action API: `addCommand(command)`, `editCommand(command)`, `replaceCommands(commands)`, and `deleteCommand(id)`. `replaceCommands` accepts the selected example's command array directly instead of a synthetic wrapper command.
- Selector policy: each component selects only the command data and actions it reads. `Canvas` selects commands; editor/list components select their required mutations; the example tile selects only `replaceCommands`.
- Update policy: port the current recursive add/edit/delete/set outcomes without mutating caller-owned payloads or existing state. Capture the current nested-ID behavior before refactoring and treat any behavior correction as separate work.
- Middleware: use Zustand `devtools` in development with named actions. Preserve development observability without retaining Redux middleware or Redux store composition. Do not add persistence or Immer.
- Runtime model: a module-level bound store is acceptable because this is a client-only Vite SPA with one browser application root and no SSR.
- Coexistence sequence: extract static catalogs first, switch the mutable command domain and all consumers atomically second, remove unreachable Redux artifacts third, and run integrated proof last. No bridge, dual write, or Provider remains after the command-domain task.

## Task ownership map

| Ownership key               | Unique outcome                                                                         | Owned artifacts and checks                                                                                                          | Depends on                  |
| --------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `static-catalog-extraction` | Immutable catalogs are plain typed data and Redux owns only commands.                  | `src/data/*`, static reducer contents, `App` catalog imports, static state aliases, catalog rendering checks                        | Baseline                    |
| `command-store-migration`   | All mutable command reads and writes use one typed Zustand store.                      | Zustand dependency addition, command store, command selectors/actions, connected `App`, Provider removal, command runtime scenarios | `static-catalog-extraction` |
| `redux-retirement`          | No obsolete Redux implementation, dependency, configuration, or documentation remains. | Legacy directories/files, package and lockfile removals, Vite optimization entry, stale-reference search, dependency tree           | `command-store-migration`   |
| `integrated-proof`          | The final dependency state typechecks, builds, and preserves all critical UI flows.    | Final typecheck, production build, integrated browser regression, diff review, final status                                         | `redux-retirement`          |

## Migration tasks

- [x] 1. Extract immutable catalogs from Redux

  - Ownership key: `static-catalog-extraction`
  - Goal: represent descriptions, examples, and tutorials as typed data modules while leaving Redux responsible only for the mutable command tree.
  - Scope: `src/reducers/commandDescription.ts`, `src/reducers/pathwayExample.ts`, `src/reducers/tutorialPageReducer.ts`, `src/reducers/index.ts`, `src/reducers/state.ts`, `src/App.tsx`, the helper/tutorial catalog prop types, and new modules under `src/data`.
  - Current behavior: all three reducers return large static initial values and have no action handlers. `App` receives their values through `connect` and passes them to helper, tutorial, input, and list components.
  - Typed design: export `Readonly<Record<string, ICommandDescription>>`, `readonly IPathwayExample[]`, and `readonly ITutorialPage[]` constants. Keep existing model types and data-building helpers, and copy only at an API boundary if a consumer truly requires a mutable array.
  - Progress evidence: `commandDescriptions`, `pathwayExamples`, and `tutorialPages` exist as typed data modules; `App` imports them directly; `IRootState` and `rootReducer` contain only `commands`.
  - Remaining work: catalog consumer props are not consistently readonly; the three obsolete static reducer files and unused aliases remain; catalog parity has not been verified in the browser.
  - Steps:
    1. Compare the three data modules with their legacy reducer values and correct only proven omissions or ordering changes.
    2. Change helper, example, tutorial, input, and list catalog props to readonly model types without `any`.
    3. Remove `commandDescription.ts`, `pathwayExample.ts`, and `tutorialPageReducer.ts` from `src/reducers` together with their now-unused state aliases.
    4. Exercise the helper panel, tutorial popup, error popup, command descriptions, and example grouping for unchanged content.
  - Legacy removal: this group exclusively owns the three static reducer files and static state aliases. Keep the command reducer, Redux store, Provider remnants, middleware, and packages for later owners.
  - Expected result: static content renders from typed modules, and Redux state contains only `commands`.
  - Verification: compare representative description entries, simple/color/crazy example groups, and all five tutorial pages before and after the edit; confirm `rootReducer` has one key.
  - Completion evidence: catalog values and UI order match the baseline, no static reducer or alias remains, catalog props are readonly and typed, and the malformed legacy reducer no longer blocks TypeScript.
  - Rollback boundary: `src/data`, the three former static reducer modules, `src/reducers/index.ts`, `src/reducers/state.ts`, and static-data changes in `src/App.tsx`.

- [ ] 2. Replace the command Redux domain with a typed Zustand store

  - Ownership key: `command-store-migration`
  - Goal: make Zustand the sole runtime owner of the command tree and route every command mutation through typed store actions.
  - Scope: `package.json`, `package-lock.json`, `src/store/commandStore.ts`, `src/App.tsx`, `src/index.tsx`, `Canvas`, `CommandEditor`, `CommandInput`, `CommandList`, `HelperLayer`, `HelperWindow`, and `templates/pathwayExample`.
  - Current partial state: Zustand 5.0.14 is installed; `App` is no longer connected; Provider and Redux store creation are inactive; a bound store handles command mutations. However, `App` owns all selectors and passes an `any` action bag, leaf components still prop-drill state/actions, the store mutates inputs and nested state, `setAll` is declared but missing, `setCommand` retains the Redux-shaped wrapper, and no devtools middleware or behavioral evidence exists.
  - Typed design: use `create<CommandStore>()(devtools(...))`, named action records, immutable recursive helpers, and atomic leaf selectors. Do not expose raw `set`, action envelopes, `Dispatch`, `any`, or non-null assertions in the store API.
  - Remaining work: restore `BrowserRouter`; remove commented Redux imports; finish the store API and immutable implementation; move subscriptions to consumers; replace the synthetic example payload; capture and run behavioral comparisons.
  - Steps:
    1. Capture add, nested repeat, edit, delete, and example-replacement outputs from the old reducer before deleting it.
    2. Make `CommandStore` internally consistent, remove the undeclared implementation gap, and expose `replaceCommands(readonlyCommands)` instead of `setCommand` and `setAll`.
    3. Rewrite recursive helpers to return new command trees without mutating action inputs or existing Zustand state.
    4. Add development-only `devtools` with named actions that preserve useful migration observability.
    5. Subscribe command-aware leaf components to only the fields and actions they consume, removing the `actions: any` bag and unused props.
    6. Call `replaceCommands([example.command])` directly from the example tile.
    7. Keep `App` unconnected, delete stale Redux comments, and restore `BrowserRouter` around `Application` while leaving only the Redux Provider removed.
    8. Compare command entry, nested rendering, numeric and color edits, multi-depth deletion, example selection, and canvas redraw with the captured reducer outcomes.
  - Legacy removal: remove live Redux imports and runtime setup here. Leave unreachable command actions/reducer/store/middleware files and package uninstall work to `redux-retirement`.
  - Expected result: the application has one active command owner, typed narrow subscriptions, a valid router boundary, no dual writes, and unchanged command/drawing behavior.
  - Verification: run `npm.cmd run tsc` after Task 1 removes its malformed reducer, inspect selector boundaries, and execute every command behavior scenario including development action names.
  - Completion evidence: TypeScript passes at this checkpoint, no runtime consumer imports Redux, leaf consumers use typed selectors/actions, `BrowserRouter` remains active, and recorded behavior matches.
  - Rollback boundary: Zustand dependency addition, `src/store/commandStore.ts`, component subscription changes, `src/App.tsx`, and `src/index.tsx`.

- [ ] 3. Retire the unreachable Redux system and configuration

  - Ownership key: `redux-retirement`
  - Goal: remove every leftover artifact whose only responsibility was the replaced Redux implementation.
  - Scope: command-only files under `src/actions` and `src/reducers`, `src/store/index.ts`, `src/middleware/logger.ts`, `src/utils/index.ts`, `package.json`, `package-lock.json`, `vite.config.js`, `README.md`, and the package description.
  - Current state: no cleanup step is complete. Redux packages remain installed, every legacy command/store/middleware file remains, Vite still prebundles Redux, README/package metadata still name Redux, and `omit` remains after its only caller was removed.
  - Typed design: retain model types in `src/models` and the Zustand store type in its own module. Do not keep compatibility aliases, Redux action names, reducer-shaped adapters, or `any` casts for deleted APIs.
  - Steps:
    1. Remove the obsolete command action namespace, command reducer, root reducer, Redux state types, Redux store factory, and logger middleware after Task 2 captures parity evidence.
    2. Delete the `omit` utility only after confirming no non-Redux caller remains.
    3. Uninstall `react-redux`, `redux`, `redux-actions`, and `@types/redux-actions` with npm while retaining Zustand.
    4. Drop the Redux-only `optimizeDeps.include` entry from `vite.config.js`.
    5. Update the repository and package descriptions to name Zustand instead of Redux without rewriting unrelated documentation.
    6. Search project-owned source, configuration, manifests, and documentation for legacy package names, APIs, symbols, and paths; classify any remaining match with a concrete reason.
    7. Inspect the direct dependency tree to prove Zustand is present and all four retired packages are absent.
  - Legacy removal: this task owns command/store/middleware Redux leftovers only; Task 1 owns static reducer deletion and Task 2 owns live consumer/runtime migration.
  - Expected result: Zustand is the only global-state dependency and no dead Redux code or configuration remains.
  - Verification: `rg` returns no unexplained `redux`, `react-redux`, `redux-actions`, `connect`, `Provider`, `createStore`, `rootReducer`, `CommandActions`, or Redux store-factory match; the direct dependency tree contains only the intended state library.
  - Completion evidence: every removal-ledger row owned by `redux-retirement` is removed, the lockfile has no direct or transitive Redux package from this app's dependency graph, and documentation describes the final architecture.
  - Rollback boundary: deleted legacy files, dependency removals, Vite configuration, lockfile, README, and package metadata.

- [ ] 4. Prove the integrated migration
  - Ownership key: `integrated-proof`
  - Goal: validate the final source and dependency state once, after all migration edits are complete.
  - Scope: final repository state, compiler, production bundle, critical browser behavior, cleanup evidence, and migration checklist status.
  - Current inspection: the intermediate production build passes with 63 modules, but this is not completion evidence because TypeScript fails, Redux cleanup is pending, no runtime walkthrough is recorded, and the missing `BrowserRouter` can break routing at startup.
  - Typed design: final checks must not introduce suppressions, compatibility shims, broad selectors, duplicate stores, or a second owner for any value.
  - Steps:
    1. Run `npm.cmd run tsc` from the final dependency state and record the zero-error result.
    2. Execute `npm.cmd run build` and capture the Vite completion summary.
    3. Start the normal Vite application and perform one integrated pass through command input, nested command editing, removals, example loading, tutorial navigation, helper closing, route hashes, and canvas redraw.
    4. Review selector boundaries, Strict Mode behavior, development subscriptions, and console output for duplicate updates or leaked listeners.
    5. Compare the final diff with all four ownership keys and move any misplaced edit to its sole owner group.
    6. Reconcile the removal ledger and mark the final status `COMPLETE` only when every checkbox has its evidence.
  - Legacy removal: none; unresolved legacy work reopens `redux-retirement` instead of being duplicated here.
  - Expected result: the migration passes compiler, bundle, runtime, ownership, and cleanup checks with no unrelated changes.
  - Verification: rerun the final typecheck and build only after cleanup, then complete the browser scenario, ownership review, and removal-ledger reconciliation.
  - Completion evidence: commands and outputs are recorded, all runtime scenarios pass, every task is checked, and the final status is `COMPLETE`.
  - Rollback boundary: verification should not edit source; only evidence and status lines in this checklist may change.

## Removal ledger

| Legacy element                                                  | Replacement or reason to remove                   | Removal task                | Final result |
| --------------------------------------------------------------- | ------------------------------------------------- | --------------------------- | ------------ |
| Static description reducer                                      | Typed `commandDescriptions` data module           | `static-catalog-extraction` | Data exists; reducer remains and is malformed |
| Static pathway reducer                                          | Typed `pathwayExamples` data module               | `static-catalog-extraction` | Data exists; reducer remains |
| Static tutorial reducer                                         | Typed `tutorialPages` data module                 | `static-catalog-extraction` | Data exists; reducer remains |
| React Redux `connect` and Provider                              | Direct Zustand selectors and bound store          | `command-store-migration`   | Runtime wrappers inactive; stale comments and prop-drilling remain |
| Redux action namespace and command reducer                      | Typed Zustand actions and immutable helpers       | `redux-retirement`          | Pending      |
| Redux store, root reducer, state aliases, and logger            | Zustand bound store with development action names | `redux-retirement`          | Pending      |
| `react-redux`, `redux`, `redux-actions`, `@types/redux-actions` | Superseded dependencies                           | `redux-retirement`          | Pending      |
| Redux Vite prebundle entry and documentation references         | Final Zustand configuration and descriptions      | `redux-retirement`          | Pending      |
| Redux-only `omit` helper                                        | No longer needed after dispatch binding removal   | `redux-retirement`          | Unused but still present |

## Risks and blockers

- The command reducer mutates payloads and nested state in several helpers; an immutable port can expose previously hidden identity or ID-allocation behavior. Capture outcomes before replacement.
- `findMostInsideRepeat` uses post-increment in a way that may preserve the previous value. Treat any duplicate-ID correction as a separate, explicitly approved behavior fix.
- The pathway-example module is very large. Move its data without formatting or content churn so the migration diff remains reviewable.
- There is no automated test suite. Runtime evidence is mandatory, and `npm.cmd test` must not be presented as a passing gate.
- Do not touch the unrelated untracked `.claude/settings.local.json`.
- Preserve `BrowserRouter`; only the Redux Provider is obsolete.

## Final status

`IN PROGRESS`: 0 of 4 major jobs complete. Tasks 1 and 2 contain partial implementation, but neither meets its completion evidence. First incomplete job: `static-catalog-extraction`.
