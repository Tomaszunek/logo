# Logo Redux-to-Zustand Migration Checklist

## Scope and baseline

- Project/workspace: `logo`, a single-package Vite browser application at `C:\Users\Tomasz\Desktop\pimp-my-codebase\logo`.
- TypeScript and framework: React 19.2.8, TypeScript 5.9.3, Vite 8.1.5, `strictNullChecks: true`, and otherwise non-strict TypeScript.
- Current state systems: Zustand 5.0.14 is the only installed global-state library and `useCommandStore` owns commands. Redux runtime packages and implementation directories are removed; stale Redux comments and README text remain.
- Zustand version: 5.0.14 is installed in `package.json`, `package-lock.json`, and the direct dependency tree.
- Validation commands: `npm.cmd run tsc`, `npm.cmd run build`, `npm.cmd ls react react-dom react-redux redux redux-actions zustand --depth=0`, and focused `rg` searches. The configured `npm.cmd test` intentionally exits with an error and is not a usable test suite.
- Original baseline: before migration edits, `npm.cmd run tsc` and `npm.cmd run build` passed with 113 modules transformed.
- Inspection result on 2026-07-24: `npm.cmd run tsc` fails because readonly pathway/tutorial catalogs are passed to mutable component props; `npm.cmd run build` passes with 63 modules transformed; the direct dependency tree contains Zustand and no Redux package.
- Worktree protection: `.claude/settings.local.json` is pre-existing and untracked; leave it untouched.
- Assumptions and exclusions: preserve application behavior rather than fixing unrelated command-ID or mutation bugs; do not add persistence, SSR handling, a test framework, Immer, or server-state tooling.
- Router boundary: `BrowserRouter` is restored around `Application`; remove only its stale commented Redux-store import.

## State inventory and decisions

| Domain                             | Current owner                                            | Main consumers                                                           | Persistence/side effects                                       | Decision                                 | Reason                                                                                            |
| ---------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Command tree                       | `useCommandStore`                                        | `App`, `Canvas`, editors, input, list, example picker                    | Redraws the canvas; no persistence                             | Move in progress                         | Zustand owns runtime state, but typing, immutability, selector boundaries, and evidence remain.    |
| Command descriptions               | `src/data/commandDescriptions.ts`                        | Error handling, command list, helper panel                               | None                                                           | Keep outside Zustand                     | Immutable reference data does not need subscriptions or actions.                                  |
| Pathway examples                   | `src/data/pathwayExamples.ts`                            | Example helper panel                                                     | Selecting an example replaces the command tree                 | Keep outside Zustand                     | The catalog is immutable; only its selection action belongs to the command store.                 |
| Tutorial pages                     | `src/data/tutorialPages.ts`                              | `TutorialPopup`                                                          | None                                                           | Keep outside Zustand                     | The page list is immutable and popup navigation is already local React state.                     |
| Helper visibility and active panel | `App` local React state                                  | `App`, `HelperLayer`                                                     | None                                                           | Keep local                               | The state has one component owner and no unrelated consumer.                                      |
| Tutorial index and visibility      | `TutorialPopup` local React state                        | `TutorialPopup`                                                          | None                                                           | Keep local                               | The state is isolated to the popup lifecycle.                                                     |
| URL routing                        | React Router                                             | `Application`, `App`                                                     | Browser URL                                                    | Keep in router                           | URL state remains outside Zustand and the unused Redux-derived filter is removed.                 |
| Optional Redux `router` field      | Removed                                                  | None                                                                     | None                                                           | Removed                                  | It had no runtime owner.                                                                           |

## Target Zustand design

- Store boundary: one `useCommandStore` for the command tree and its four mutations. Keep all immutable catalogs as typed modules under `src/data`.
- Store type: `CommandStore = CommandState & CommandActions`, where state contains `commands: ICommandModel[]` and actions accept typed command values or IDs without Redux action envelopes.
- Action API: `addCommand(command)`, `editCommand(command)`, `replaceCommands(commands)`, and `deleteCommand(id)`. `replaceCommands` accepts the selected example's command array directly instead of a synthetic wrapper command.
- Selector policy: each component selects only the command data and actions it reads. `Canvas` selects commands; editor/list components select their required mutations; the example tile selects only `replaceCommands`.
- Update policy: port the current recursive add/edit/delete/set outcomes without mutating caller-owned payloads or existing state. Capture the current nested-ID behavior before refactoring and treat any behavior correction as separate work.
- Middleware: use Zustand `devtools` in development with named actions. Preserve development observability without retaining Redux middleware or Redux store composition. Do not add persistence or Immer.
- Runtime model: a module-level bound store is acceptable because this is a client-only Vite SPA with one browser application root and no SSR.
- Coexistence sequence: finish catalog typing, finish the mutable command domain, close residual cleanup, run the Zustand quality review, then perform integrated proof. No bridge, dual write, or Provider remains.

## Task ownership map

| Ownership key               | Unique outcome                                                                         | Owned artifacts and checks                                                                                                          | Depends on                  |
| --------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `static-catalog-extraction` | Immutable catalogs are plain typed data outside global state.                         | `src/data/*`, catalog imports, readonly consumer types, catalog rendering checks                                                     | Baseline                    |
| `command-store-migration`   | All mutable command reads and writes use one typed Zustand store.                      | Zustand dependency, command store, command selectors/actions, App integration, command runtime scenarios                            | `static-catalog-extraction` |
| `redux-retirement`          | No obsolete Redux implementation, dependency, configuration, or documentation remains. | Legacy directories/files, package and lockfile removals, Vite optimization entry, stale-reference search, dependency tree           | `command-store-migration`   |
| `zustand-quality-review`    | Developer and user practices are reviewed with every finding resolved or classified.  | Store quality, framework integration, selector/subscription practice, affected user behavior, findings ledger                       | `redux-retirement`          |
| `integrated-proof`          | The final dependency state typechecks, builds, and preserves all critical UI flows.    | Final command suite, production build, integrated browser regression, final stale search, diff review                               | `zustand-quality-review`    |

## Migration tasks

- [x] 1. Extract immutable catalogs from Redux

  - Ownership key: `static-catalog-extraction`
  - Goal: represent descriptions, examples, and tutorials as typed data modules while leaving Redux responsible only for the mutable command tree.
  - Scope: `src/reducers/commandDescription.ts`, `src/reducers/pathwayExample.ts`, `src/reducers/tutorialPageReducer.ts`, `src/reducers/index.ts`, `src/reducers/state.ts`, `src/App.tsx`, the helper/tutorial catalog prop types, and new modules under `src/data`.
  - Current behavior: all three catalogs are plain data modules and the legacy reducers are removed. `App` imports the values directly, but mutable component prop declarations reject the readonly pathway and tutorial arrays.
  - Typed design: export `Readonly<Record<string, ICommandDescription>>`, `readonly IPathwayExample[]`, and `readonly ITutorialPage[]` constants. Keep existing model types and data-building helpers, and copy only at an API boundary if a consumer truly requires a mutable array.
  - Progress evidence: `commandDescriptions`, `pathwayExamples`, and `tutorialPages` exist as typed data modules; `App` imports them directly; all legacy reducer files and state aliases are gone.
  - Completion evidence (2026-07-24): catalog consumer props accept readonly collections; `npm.cmd run tsc` passes; the browser shows all five tutorial pages in order, 48 examples grouped as simple/crazy/color, and the `fd` command description without console errors.
  - Steps:
    1. Compare the three data modules with their legacy reducer values and correct only proven omissions or ordering changes.
    2. Change helper, example, tutorial, input, and list catalog props to readonly model types without `any`.
    3. Exercise the helper panel, tutorial popup, error popup, command descriptions, and example grouping for unchanged content.
  - Legacy removal: static reducers and state aliases are already removed; do not recreate compatibility files.
  - Expected result: static content renders from readonly typed modules without entering Zustand.
  - Verification: compare representative description entries, simple/color/crazy example groups, and all five tutorial pages, then confirm the two readonly assignment errors are absent.
  - Completion evidence: catalog values and UI order match the baseline, catalog props are readonly and typed, and no catalog-related TypeScript error remains.
  - Rollback boundary: `src/data`, the three former static reducer modules, `src/reducers/index.ts`, `src/reducers/state.ts`, and static-data changes in `src/App.tsx`.

- [x] 2. Replace the command Redux domain with a typed Zustand store

  - Ownership key: `command-store-migration`
  - Goal: make Zustand the sole runtime owner of the command tree and route every command mutation through typed store actions.
  - Scope: `package.json`, `package-lock.json`, `src/store/commandStore.ts`, `src/App.tsx`, `src/index.tsx`, `Canvas`, `CommandEditor`, `CommandInput`, `CommandList`, `HelperLayer`, `HelperWindow`, and `templates/pathwayExample`.
  - Current behavior: Zustand 5.0.14 is the sole runtime command owner; leaf components select their own data/actions; `App` is unconnected; Provider is absent; `BrowserRouter` and Strict Mode are active; and named development actions use Zustand devtools.
  - Typed design: use `create<CommandStore>()(devtools(...))`, named action records, immutable recursive helpers, and atomic leaf selectors. Do not expose raw `set`, action envelopes, `Dispatch`, `any`, or non-null assertions in the store API.
  - Completion evidence (2026-07-24): `npm.cmd run tsc` passes; direct store checks prove immutable inputs, unique IDs, nested edit/delete, and replacement behavior; browser checks prove one add per Enter, cleared input, nested rendering/edit/delete, example replacement, and canvas redraw with no console errors.
  - Steps:
    1. Capture add, nested repeat, edit, delete, and example-replacement outputs from the old reducer before deleting it.
    2. Export an explicit `CommandStore` contract and accept readonly command inputs without exposing mutation-prone arrays.
    3. Rewrite recursive helpers to return new command trees without mutating action inputs or existing Zustand state.
    4. Add development-only `devtools` with named actions that preserve useful migration observability.
    5. Subscribe command-aware leaf components to only the fields and actions they consume, removing the `actions: any` bag and unused props.
    6. Keep the direct `replaceCommands([example.command])` example flow while removing its `actions: any` prop.
    7. Keep `App` unconnected, delete stale Redux comments, and retain `BrowserRouter` around `Application`.
    8. Compare command entry, nested rendering, numeric and color edits, multi-depth deletion, example selection, and canvas redraw with the captured reducer outcomes.
  - Legacy removal: runtime Redux integration is already removed; this task owns only stale consumer comments associated with that integration.
  - Expected result: the application has one active command owner, typed narrow subscriptions, a valid router boundary, no dual writes, and unchanged command/drawing behavior.
  - Verification: run `npm.cmd run tsc` after Task 1 removes its malformed reducer, inspect selector boundaries, and execute every command behavior scenario including development action names.
  - Completion evidence: TypeScript passes at this checkpoint, no runtime consumer imports Redux, leaf consumers use typed selectors/actions, `BrowserRouter` remains active, and recorded behavior matches.
  - Rollback boundary: Zustand dependency addition, `src/store/commandStore.ts`, component subscription changes, `src/App.tsx`, and `src/index.tsx`.

- [x] 3. Retire the unreachable Redux system and configuration

  - Ownership key: `redux-retirement`
  - Goal: remove every leftover artifact whose only responsibility was the replaced Redux implementation.
  - Scope: command-only files under `src/actions` and `src/reducers`, `src/store/index.ts`, `src/middleware/logger.ts`, `src/utils/index.ts`, `package.json`, `package-lock.json`, `vite.config.js`, `README.md`, and the package description.
  - Current state: Redux packages, action/reducer/store/middleware files, the `omit` helper, Vite prebundling, stale comments, and Redux documentation wording are removed.
  - Completion evidence (2026-07-24): a focused case-insensitive search finds no Redux package, API, provider, store, reducer, or action reference; the direct dependency tree contains React, React DOM, and Zustand 5.0.14 only.
  - Typed design: retain model types in `src/models` and the Zustand store type in its own module. Do not keep compatibility aliases, Redux action names, reducer-shaped adapters, or `any` casts for deleted APIs.
  - Steps:
    1. Remove the stale Redux comments from `src/index.tsx` and `src/components/commandEditor.tsx`.
    2. Update `README.md` to describe Zustand without rewriting unrelated documentation.
    3. Confirm the manifest, lockfile, Vite configuration, and source tree contain no intentional Redux dependency or implementation artifact.
    4. Inspect the direct dependency tree to prove Zustand is present and the retired packages are absent.
  - Legacy removal: this task owns command/store/middleware Redux leftovers only; Task 1 owns static reducer deletion and Task 2 owns live consumer/runtime migration.
  - Expected result: Zustand is the only global-state dependency and no dead Redux code or configuration remains.
  - Verification: run a focused cleanup search over the known source, manifest, Vite, and README locations and inspect the direct dependency tree; reserve the complete stale-reference search for `integrated-proof`.
  - Completion evidence: every removal-ledger row owned by `redux-retirement` is removed, the lockfile has no direct or transitive Redux package from this app's dependency graph, and documentation describes the final architecture.
  - Rollback boundary: deleted legacy files, dependency removals, Vite configuration, lockfile, README, and package metadata.

- [ ] 4. Review Zustand quality for developers and users
  - Ownership key: `zustand-quality-review`
  - Goal: prove that the finished Zustand integration is maintainable for developers and predictable for users.
  - Scope: Zustand 5.0.14, `src/store/commandStore.ts`, all store consumers, React Router integration, command editing/drawing flows, and the quality findings ledger.
  - Current behavior: no completed quality review exists. Known open findings include mutable recursive updates, `any` action props, App-level subscription and prop drilling, missing action observability, and absent runtime evidence; persistence, hydration, SSR, and async server-state behavior are not used.
  - Typed design: review strict public types, explicit actions, minimal state, narrow selectors, safe subscriptions, justified middleware, test seams, clear ownership, and the absence of synchronized copies or needless abstraction.
  - Steps:
    1. Compare the installed Zustand version, bound-store setup, middleware decisions, and React integration with current official Zustand guidance and repository conventions.
    2. Classify developer practices for ownership, state minimality, actions, derived values, public types, selectors, subscriptions, middleware, SSR, persistence, naming, and test seams.
    3. Classify affected user flows for predictable edits and resets, stale state, lost input, duplicate effects, rendering responsiveness, errors, and accessible feedback.
    4. Record each finding as `Pass`, `Fix in <ownership-key>`, or `Not applicable` with repository or runtime evidence.
    5. Reopen the owning earlier task for any domain or cleanup defect, reverify it, and return here only after that task is checked again.
  - Legacy removal: none; cleanup findings belong to `redux-retirement`.
  - Expected result: every relevant developer and user practice is supported by evidence or explicitly not applicable.
  - Verification: reconcile every row in the quality findings ledger without rerunning the full validation suite or final stale-reference search.
  - Completion evidence: all findings pass or are not applicable, every reopened task is complete with fresh evidence, and no developer or user concern remains unresolved.
  - Rollback boundary: cross-cutting quality corrections only; domain, catalog, and cleanup corrections return to their existing ownership keys.

- [ ] 5. Prove the integrated migration
  - Ownership key: `integrated-proof`
  - Goal: validate the final source and dependency state once, after all migration edits are complete.
  - Scope: final repository state, compiler, production bundle, critical browser behavior, cleanup evidence, and migration checklist status.
  - Current inspection: the production build passes with 63 modules, but TypeScript fails on two readonly catalog props, README/comments still need cleanup, the quality review is unresolved, and no runtime walkthrough is recorded. `BrowserRouter` is present.
  - Typed design: final checks must not introduce suppressions, compatibility shims, broad selectors, duplicate stores, or a second owner for any value.
  - Steps:
    1. Run `npm.cmd run tsc` from the final dependency state and record the zero-error result.
    2. Execute `npm.cmd run build` and capture the Vite completion summary.
    3. Start the normal Vite application and perform one integrated pass through command input, nested command editing, removals, example loading, tutorial navigation, helper closing, route hashes, and canvas redraw.
    4. Run the complete stale-reference search across source, configuration, manifests, lockfile, and documentation.
    5. Compare the final diff with all five ownership keys and move any misplaced edit to its sole owner group.
    6. Reconcile the removal ledger and mark the final status `COMPLETE` only when every checkbox has its evidence.
  - Legacy removal: none; unresolved legacy work reopens `redux-retirement` instead of being duplicated here.
  - Expected result: the migration passes compiler, bundle, runtime, ownership, and cleanup checks with no unrelated changes.
  - Verification: rerun the final typecheck and build only after cleanup, then complete the browser scenario, ownership review, and removal-ledger reconciliation.
  - Completion evidence: commands and outputs are recorded, all runtime scenarios pass, the quality review is complete, every task is checked, and the final status is `COMPLETE`.
  - Rollback boundary: verification should not edit source; only evidence and status lines in this checklist may change.

## Zustand quality findings

| Concern | Status | Evidence or next owner |
| --- | --- | --- |
| Store ownership and minimal state | Pass | One command store owns mutable shared state; catalogs and component UI state remain outside Zustand. |
| Installed version and official integration guidance | Fix in `zustand-quality-review` | Zustand 5.0.14 is installed; the current official-guidance comparison is not recorded. |
| Public store and consumer types | Pass | `CommandStore` is exported, inputs are readonly, and no consumer action bag remains. |
| Immutable updates and readonly inputs | Pass | Store checks confirm add and replace inputs are unchanged; recursive helpers return new trees. |
| Selector and subscription boundaries | Pass | Command-aware leaf components use atomic selectors and `App` does not subscribe to the store. |
| Middleware and action observability | Pass | Development-only Zustand devtools records named add/edit/delete/replace actions. |
| Router/provider integration | Pass | `BrowserRouter` is present and the Redux Provider is absent. |
| SSR isolation | Not applicable | This is a client-only Vite SPA with no SSR runtime. |
| Persistence and hydration | Not applicable | The command store has no persisted state. |
| Async loading and server errors | Not applicable | Store actions are synchronous and do not own server data. |
| Command-editing user behavior | Fix in `zustand-quality-review` | Add, edit, delete, example replacement, canvas redraw, and lost-input behavior lack recorded runtime evidence. |
| Accessible state feedback | Fix in `zustand-quality-review` | Affected controls need a focused runtime/accessibility review; no result is recorded. |

## Removal ledger

| Legacy element                                                  | Replacement or reason to remove                   | Removal task                | Final result |
| --------------------------------------------------------------- | ------------------------------------------------- | --------------------------- | ------------ |
| Static description reducer                                      | Typed `commandDescriptions` data module           | `static-catalog-extraction` | Removed |
| Static pathway reducer                                          | Typed `pathwayExamples` data module               | `static-catalog-extraction` | Removed |
| Static tutorial reducer                                         | Typed `tutorialPages` data module                 | `static-catalog-extraction` | Removed |
| React Redux `connect` and Provider                              | Direct Zustand selectors and bound store          | `command-store-migration`   | Removed; typed leaf selectors active |
| Redux action namespace and command reducer                      | Typed Zustand actions and immutable helpers       | `redux-retirement`          | Removed |
| Redux store, root reducer, state aliases, and logger            | Zustand bound store                               | `redux-retirement`          | Removed |
| `react-redux`, `redux`, `redux-actions`, `@types/redux-actions` | Superseded dependencies                           | `redux-retirement`          | Removed |
| Redux Vite prebundle entry and documentation references         | Final Zustand configuration and descriptions      | `redux-retirement`          | Removed |
| Redux-only `omit` helper                                        | No longer needed after dispatch binding removal   | `redux-retirement`          | Removed |

## Risks and blockers

- Command IDs are internal and are now reassigned depth-first on add/replace to prevent duplicate React keys and ambiguous nested edits; runtime evidence confirms the intended flows.
- The pathway-example module is very large. Avoid unrelated formatting or content churn while verifying parity.
- There is no automated test suite. Runtime evidence is mandatory, and `npm.cmd test` must not be presented as a passing gate.
- Do not touch the unrelated untracked `.claude/settings.local.json`.
- Preserve `BrowserRouter`; only the Redux Provider is obsolete.

## Final status

`IN PROGRESS`: 3 of 5 major jobs complete. First incomplete job: `zustand-quality-review`. Quality review: in progress.
