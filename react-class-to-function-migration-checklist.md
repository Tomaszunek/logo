# React Class-to-Function Migration Checklist

## Scope and baseline

- Project/workspaces: single `logo` package at the repository root; npm is established by `package-lock.json` (lockfile v2). The shipped UI is the `/` route from `src/router/index.tsx`.
- React and tooling: React/React DOM 17.0.2, React Redux 7.2.9, React Router 5.x, TypeScript 5.9.3 with JSX mode `react`, and Vite 8.1.5. Source is TypeScript/TSX. No ESLint, formatter, component-test runner, or active test suite is configured.
- Validation commands discovered in `package.json`: `npm run tsc`, `npm run build`, and `npm run dev`. `npm test` is a placeholder that always exits with an error, so it is not a usable validation check. `src/App.test.tsx` is entirely commented out.
- Baseline result on 2026-07-22 with Node 25.5.0 and npm 11.8.0: `npm run tsc` passed; `npm run build` passed with Vite transforming 141 modules and producing the production bundle. No automated behavioral baseline exists, and no browser runtime walkthrough was performed while preparing this plan.
- Worktree: pre-existing untracked `.claude/` content was left untouched. The migration must preserve unrelated/user-authored changes.
- Assumptions and exclusions: 11 project-owned class components were found. Dependencies, generated `dist`/`build` output, utility classes (`Parser`, `ErrorHandler`, `Caller`, and `Turtle`), reducers, and models are not React class components and are excluded. No `PureComponent`, error boundary, legacy context, decorator, inheritance, string-ref, static metadata, `defaultProps`, or `propTypes` blocker was found.
- Shared testing prerequisite: before converting the first high-risk component, select and configure a React 17-compatible component-test harness, replace the placeholder `test` script, and record its exact focused and full-suite commands here. Until that exists, the manual scenarios below plus `npm run tsc` and `npm run build` are required, but the high-risk tasks should not be considered fully evidenced.
- Effect guidance: React documents `componentDidMount`/`componentDidUpdate` synchronization as an Effect use case, with setup and cleanup resilient to development remounts; use `useLayoutEffect` only if a verified pre-paint requirement exists. See [React Component lifecycle guidance](https://react.dev/reference/react/Component), [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects), and [useEffect](https://react.dev/reference/react/useEffect).
- Styling and snapshots: `App.tsx` imports `src/App.css` and `src/vis-001.css`. Component selectors also exist in `src/styles/commandTags.css`, `src/styles/helpers.css`, and `src/styles/popup.css`, but those files are not imported by the current entry graph. Preserve all existing class names; do not combine CSS cleanup/import changes with these conversions. There are no snapshots.

## Class component inventory and priority

Scores use product impact (0-4), architectural reach (0-4), maintenance leverage (0-3), and migration readiness (0-2). Ties are ordered by product impact, reach, then path.

| Rank | Component | Path | Impact | Reach | Leverage | Readiness | Total | Risk | Decision |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | `CommandInput` | `src/components/commandInput.tsx` | 4 | 4 | 3 | 1 | 12 | High | Selected |
| 2 | `App` | `src/App.tsx` | 4 | 4 | 2 | 1 | 11 | High | Selected |
| 3 | `Canvas` | `src/components/canvas.tsx` | 4 | 3 | 3 | 1 | 11 | High | Selected |
| 4 | `CommandList` | `src/components/commandList.tsx` | 4 | 3 | 2 | 1 | 10 | High | Selected |
| 5 | `PathwayExample` | `src/components/templates/pathwayExample.tsx` | 3 | 3 | 1 | 2 | 9 | Medium | Selected |
| 6 | `CommandEditor` | `src/components/commandEditor.tsx` | 3 | 2 | 2 | 2 | 9 | Medium | Selected |
| 7 | `HelperWindow` | `src/components/helperWindow.tsx` | 2 | 3 | 1 | 2 | 8 | Medium | Selected |
| 8 | `TutorialPopup` | `src/components/tutorialPopup.tsx` | 2 | 2 | 2 | 2 | 8 | Medium | Selected |
| 9 | `HelperLayer` | `src/components/helperLayer.tsx` | 2 | 2 | 1 | 2 | 7 | Low | Selected |
| 10 | `Popup` | `src/components/popup.tsx` | 2 | 1 | 1 | 2 | 6 | Low | Later |
| 11 | `CommandDescription` | `src/components/templates/CommandDescription.tsx` | 1 | 2 | 1 | 2 | 6 | Low | Later |

## Migration tasks

- [ ] 1. Convert `CommandInput` in `src/components/commandInput.tsx`
  - **Target:** default export `CommandInput`; direct caller `App`; child `Popup`; Redux action contract from `CommandActions`.
  - **Priority:** rank 1, score 12 = impact 4 + reach 4 + leverage 3 + readiness 1. This is the only command-entry control. Successful parsing dispatches commands consumed by `CommandEditor`, `CommandList`, and `Canvas`; invalid input owns the only timed error flow. It also has no active tests, a DOM ref, and a timeout with no unmount cleanup.
  - **Current behavior:** renders an autofocus input with the existing placeholder, label, class name, and `onKeyPress`. Enter trims and parses the uncontrolled DOM value. Each parsed item dispatches `actions.addCommand`, then clears the DOM value. Parser errors create an `ErrorHandler` message, show an assertive `Popup`, and hide it after five seconds. `togglePopup` flips visibility and is passed as `closePopup`, even though `Popup` currently does not call it. Multiple errors currently create overlapping timeouts.
  - **Conversion map:** map `input` to `useRef<HTMLInputElement | null>`; map `showPopup` and `popupText` to a reducer (or one object state with complete replacement) so show/hide/error transitions remain atomic; map the timeout handle to a non-rendering `useRef`; keep parsing and dispatch in the keyboard event handler; add one cleanup Effect solely to clear a pending timer on unmount. Convert `onError`, `togglePopup`, and `onInputChange` to local functions. Keep the uncontrolled input and React 17 ref conventions; no `forwardRef` or imperative API is required.
  - **Steps:**
    1. Add characterization coverage for initial focus, valid single and nested commands, one dispatch per parsed item, input clearing, invalid-command alert text, five-second dismissal with fake timers, repeated errors, and unmount-before-timeout. Record the new focused test command in this report.
    2. Replace the class with a named function while preserving the default export, `IProps`, JSX order, attributes, `Popup` props, and `CommandActions` calls.
    3. Introduce the input ref and popup-state transition API. Do not convert the input to controlled state or move Enter-driven parsing into an Effect.
    4. Store the active timeout handle, cancel/restart it when a new error supersedes the previous error, and clear it during unmount. Verify that this deliberate leak fix does not change the visible five-second behavior.
    5. Confirm `App.tsx`, `Parser`, `ErrorHandler`, and `Popup` require no API changes; keep the misspelled public prop `massage` until the later `Popup` task or a separately reviewed API cleanup.
  - **Expected result:** command entry, parsing, Redux dispatch order, focus, alert semantics, message text, and dismissal timing remain observable as before, with no state update after unmount and no stale timeout hiding a newer error.
  - **Focused verification:** run the recorded focused component test, `npm run tsc`, and `npm run build`; under `npm run dev`, enter a simple command, a nested `repeat`, multiple commands, an unknown command, and two rapid invalid commands; unmount/navigate during the timer in the harness and check the console.
  - **Completion evidence:** focused tests pass with fake-timer and cleanup assertions; TypeScript/build pass; runtime observations show exact dispatch count/order, input clearing, accessible alert, and latest-error timeout behavior; the file contains no class declaration, lifecycle, or `this.` usage.
  - **Rollback:** `src/components/commandInput.tsx`, its new/updated focused test, and only the shared test-harness files added as the explicit prerequisite.

- [ ] 2. Convert `App` in `src/App.tsx`
  - **Target:** named export `App`, its namespace-owned `App.IProps`, and the connected default export used by `src/router/index.tsx`.
  - **Priority:** rank 2, score 11 = impact 4 + reach 4 + leverage 2 + readiness 1. It is the only routed screen and composes every selected component, so an export, prop, or conditional-rendering regression can blank or destabilize the whole application.
  - **Current behavior:** Redux/router props select commands, descriptions, 34 pathway examples, five tutorial pages, and the URL-hash filter. Local state starts with helpers hidden and panel `tips`. Header actions open either tips or examples. Examples render `HelperLayer` with an `onClose`; tips render `TutorialPopup`, which hides itself internally. The editor, input, canvas, list, skip link, footer, DOM order, and connected HOC are always rendered.
  - **Conversion map:** preserve `mapStateToProps`, `mapDispatchToProps`, `FILTER_VALUES`, `App.IProps`, named export, and connected default export. Replace `showHelper` plus `activePanel` with a small reducer or a single discriminated `openPanel: 'tips' | 'examples' | null`; map `handleShowHelper` to an event callback and the examples close lambda to a close action. No Effect, ref, context, lifecycle, static property, or memoization is needed.
  - **Steps:**
    1. Add characterization coverage for the unconnected named export and the connected route: initial shell, Tips opening, Command Examples opening, examples closing, Redux props, and hash-derived filter values.
    2. Replace the class with a named function and map both class state fields explicitly to the chosen state model. Preserve the function/namespace merge that keeps `App.IProps` usable, or move the type only after updating every reference in the same task.
    3. Preserve child prop identities and public exports. Do not replace `connect` with hooks in this class-to-function task; that is a separate architectural change.
    4. Compare the rendered tree, accessibility landmarks, IDs/classes, and conditional mount/unmount behavior before and after.
  - **Expected result:** `/` renders the same connected application; Header switches panels; examples close; all main command workflows continue to receive identical Redux data and actions.
  - **Focused verification:** run the focused `App`/route tests, `npm run tsc`, and `npm run build`; under `npm run dev`, load `/`, exercise both Header buttons and examples close, and confirm the editor/list/canvas remain mounted and the browser console is clean.
  - **Completion evidence:** tests show the same initial and panel states, connected props, and exports; runtime DOM/accessibility behavior matches; search shows no `class App`, `this.state`, or `this.setState` in `src/App.tsx`.
  - **Rollback:** `src/App.tsx` and its focused test only; keep `src/router/index.tsx` unchanged unless an export-only adjustment is proven necessary.

- [ ] 3. Convert `Canvas` in `src/components/canvas.tsx`
  - **Target:** internal `Canvas` component and the existing connected default export; collaborators `Turtle` and `Caller`; caller `App`.
  - **Priority:** rank 3, score 11 = impact 4 + reach 3 + leverage 3 + readiness 1. It is the sole visible execution result for commands and the only component with mount/update lifecycles and an imperative browser API. Its current command-dispatch branches differ subtly between mount and update, raising regression risk.
  - **Current behavior:** creates one 800×800 `Turtle` and `Caller` per component instance, stores a callback DOM ref, attaches it on mount, replays all commands, and draws the turtle. On a new `commands` array identity it clears/home-resets the canvas, replays recursively through `Caller`, and redraws. It preserves `role="img"` and the canvas label. There is no React state, cleanup lifecycle, context, public component ref, or error boundary. `connect(mapStateToProps)` is part of the default-export contract even though `mapStateToProps` returns its argument.
  - **Conversion map:** move fixed dimensions to module constants; map the canvas element, `Turtle`, and `Caller` instance fields to stable refs (or lazy, once-per-mount initialization); extract one typed `replayCommands(commands, caller)` helper so mount/update use the same correctly parenthesized dispatch rules; use one Effect keyed by `commands` to attach the DOM canvas, clear/replay deterministically, and draw. Use ordinary `useEffect` unless a test proves drawing must finish before paint; add cleanup that detaches the canvas and makes repeated setup safe. Remove the unused `IState`. Preserve the connected default export and do not add `memo`.
  - **Steps:**
    1. Add a canvas test double and characterize empty commands plus `fd`, `repeat`, `setpos`, `setsc`, `setbc`, visibility/pen commands, initial mount, changed array identity, unchanged identity, image load, and unmount. Explicitly capture the mount/update branch inconsistency before choosing the intended common behavior.
    2. Extract the command replay helper without changing its action order, nested-repeat behavior, or the current `Caller`/`Turtle` public APIs. Parenthesize color command checks to avoid precedence ambiguity, but treat any behavior correction as separately asserted evidence.
    3. Convert the class, constants, callback ref, and imperative instance fields to the function design. Ensure `Turtle`/`Caller` are not recreated on ordinary renders.
    4. Replace both lifecycle methods with command-to-canvas synchronization. Make setup → cleanup → setup idempotent and prevent a detached or stale image callback from mutating an unmounted canvas; update `src/utils/turtle.ts` only if the test proves that collaborator support is required.
    5. Preserve canvas dimensions, DOM/ARIA attributes, class names, default export wrapping, and command-array identity semantics.
  - **Expected result:** every supported command sequence produces the same drawing and turtle state on first render and subsequent edits, with stable imperative objects and no duplicate/leaked drawing during cleanup or development remounts.
  - **Focused verification:** run focused Canvas/Caller/Turtle tests, `npm run tsc`, and `npm run build`; under `npm run dev`, add/edit/delete simple, nested, color, position, pen, and visibility commands; temporarily exercise the component in a Strict Mode test harness and inspect canvas calls and the console.
  - **Completion evidence:** assertions cover mount/update parity, stable instance creation, each dispatch branch, clear-before-replay, image load, and cleanup; a manual before/after drawing comparison passes; selected file has no class/lifecycle/`this.` syntax; no production Strict Mode setting is silently introduced.
  - **Rollback:** `src/components/canvas.tsx`, its focused test, and `src/utils/turtle.ts` only if cleanup support was demonstrably required.

- [ ] 4. Convert `CommandList` in `src/components/commandList.tsx`
  - **Target:** default export `CommandList`; caller `App`; `CommandActions.editCommand` and `deleteCommand` contracts.
  - **Priority:** rank 4, score 10 = impact 4 + reach 3 + leverage 2 + readiness 1. This is the only parameter editor and a delete surface for every command, including recursive command trees. Changes immediately affect Redux state and Canvas output. No coverage exists, and the current handler mutates the incoming command object before dispatch.
  - **Current behavior:** recursively renders command descriptions and nested commands. It conditionally shows numeric inputs only for truthy `value`/`arg2`, a color input for truthy `color`, and a remove button. Numeric/color changes dispatch a full edited command; deletes dispatch the ID. It preserves the misspelled CSS hook `commendList`. `IState.html` and the constructor are unused.
  - **Conversion map:** remove the unused state/constructor; convert recursive `displayCommands`, `onChangeInput`, and `removeCommand` to typed local functions. Derive an edited payload without mutating props, while preserving all fields, numeric coercion, `setpos` field selection, color handling, recursion, keys, classes, and action payloads. No Hook is necessary unless a demonstrated performance issue justifies one; do not add `memo`, `useMemo`, or `useCallback` by default.
  - **Steps:**
    1. Characterize flat and nested rendering, zero/undefined conditional-input behavior, number conversion, `setpos` x/y edits, color edits, recursive deletion, descriptions, and exact dispatched payloads.
    2. Replace the class with a default-exported named function and remove `IState`.
    3. Convert handlers and recursive rendering, creating a new edited command payload instead of writing to `item`; verify Redux results and Canvas updates remain identical.
    4. Preserve DOM nesting, keys, input types/values/names, button classes/text, `commendList`, and description argument order.
  - **Expected result:** users can edit and delete every supported top-level or nested command, Redux receives compatible payloads, Canvas redraws, and props are not mutated during the event.
  - **Focused verification:** run focused recursive-list tests, `npm run tsc`, and `npm run build`; under `npm run dev`, edit all input variants and remove top-level/nested commands while watching both editor tags and canvas output.
  - **Completion evidence:** action-spy and reducer-integrated tests pass, including an assertion that the original prop object is unchanged; DOM/runtime behavior and CSS hooks match; no class/`this.` syntax remains.
  - **Rollback:** `src/components/commandList.tsx` and its focused test; reducer changes are outside this task.

- [ ] 5. Convert `PathwayExample` in `src/components/templates/pathwayExample.tsx`
  - **Target:** default export `PathwayExample`; rendered by `HelperWindow` for all 34 examples.
  - **Priority:** rank 5, score 9 = impact 3 + reach 3 + leverage 1 + readiness 2. One small template is reused across the full examples catalog, and clicking any instance replaces the global command list that drives three primary UI regions.
  - **Current behavior:** renders the example name, image/alt text, and source path. Clicking the containing `div` dispatches `setCommand({ id: 10000, name: 'fd', commands: [command] })`. The event parameter, constructor, and `IState.html` are unused. There are no refs, lifecycle methods, context, statics, or imperative contracts.
  - **Conversion map:** remove unused state/constructor/event; convert `setCommands` to a local click handler; preserve the exact wrapper payload, nested command object, markup, image path, class names, and default export. No Hooks or memoization are needed.
  - **Steps:**
    1. Characterize one example rendering and exact `setCommand` payload, then add an integration assertion that the selected example replaces commands and reaches the editor/list/canvas props.
    2. Replace the class with a typed named function exported as default; destructure props without changing the public interface.
    3. Preserve all visible strings, image URL/alt behavior, click target, action timing, and the 34-item rendering behavior in `HelperWindow`.
  - **Expected result:** every example card renders and selecting it replaces the active program exactly once with the same payload.
  - **Focused verification:** run the focused template/helper integration test, `npm run tsc`, and `npm run build`; under `npm run dev`, open Command Examples, select examples from each type, and confirm command UI and canvas replacement.
  - **Completion evidence:** all 34 examples render in the integration fixture; click payload equality and downstream update pass; no class/`this.` syntax remains.
  - **Rollback:** `src/components/templates/pathwayExample.tsx` and its focused test only.

- [ ] 6. Convert `CommandEditor` in `src/components/commandEditor.tsx`
  - **Target:** default export `CommandEditor`; caller `App`; `deleteCommand` action.
  - **Priority:** rank 6, score 9 = impact 3 + reach 2 + leverage 2 + readiness 2. It is the always-visible recursive command summary and a second delete surface. The conversion is straightforward, but recursive markup, IDs, keyboard focusability, and removal behavior are important.
  - **Current behavior:** recursively maps commands to focusable list items keyed and tagged by ID, displays `name` and `value`, nests child `<ul>` elements, and dispatches `deleteCommand(id)` from the accessible remove button. Constructor and `IState.html` are unused.
  - **Conversion map:** remove state/constructor; convert recursive `displayCommands` to a local typed renderer and `removeCommand` to a typed local handler (or dispatch inline without changing semantics). No Hook, Effect, ref, context, static, or memoization is needed.
  - **Steps:**
    1. Characterize empty, flat, and deeply nested command arrays, list keys/data IDs/classes/tab index, button label, and exact delete IDs.
    2. Replace the class with a typed named function exported as default and retain the recursive output structure.
    3. Preserve events, text, order, CSS hooks, accessibility attributes, and `CommandActions` contract.
  - **Expected result:** the command tree looks and behaves identically, including nested deletion and keyboard-focusable items.
  - **Focused verification:** run focused editor tests, `npm run tsc`, and `npm run build`; under `npm run dev`, add nested repeats, tab through items/buttons, and delete inner and outer commands.
  - **Completion evidence:** DOM-structure/accessibility/action assertions pass; runtime recursion and deletions pass; no class/`this.` syntax remains.
  - **Rollback:** `src/components/commandEditor.tsx` and its focused test only.

- [ ] 7. Convert `HelperWindow` in `src/components/helperWindow.tsx`
  - **Target:** default export `HelperWindow`; caller `HelperLayer`; children `PathwayExample` and deferred `CommandDescription`.
  - **Priority:** rank 7, score 8 = impact 2 + reach 3 + leverage 1 + readiness 2. It owns both helper catalog layouts and fans out to every example and command description. Object iteration/grouping order and left/right column assignment are visible contracts.
  - **Current behavior:** renders `helperWindow` plus `site`; right site groups examples by `type` in first-seen order and renders cards; every other site divides command descriptions into alternating left/right columns using object enumeration order. It passes action and data props to child templates. Constructor and `IState.html` are unused.
  - **Conversion map:** remove unused state/constructor; convert `displayAll`, `displayExample`, and `displayCommands` to pure typed helpers or local functions. Derive groups during render because there is no external synchronization; do not add an Effect. Avoid memoization unless profiling later proves it necessary. Preserve `itemStyle`, `site`, key selection, enumeration order, grouping, and child props.
  - **Steps:**
    1. Characterize right-side grouping for all 34 examples, stable type/card order, and left-side alternating placement for all 16 command descriptions.
    2. Replace the class with a typed named function exported as default; remove the phantom state type.
    3. Convert helper methods without changing truthy filtering, keys, DOM wrappers, order, or downstream action identity.
    4. Keep the current public `site: string` contract during the conversion; a later type-only change may narrow it after callers are audited.
  - **Expected result:** both helper views contain the same items, order, grouping/columns, styles, and example actions.
  - **Focused verification:** run focused HelperWindow tests, `npm run tsc`, and `npm run build`; under `npm run dev`, inspect both helper panels at supported viewport sizes and select examples from every group.
  - **Completion evidence:** fixture counts/order/keys and child props match the baseline; runtime layout and selection pass; no class/`this.` syntax remains.
  - **Rollback:** `src/components/helperWindow.tsx` and its focused test only; child conversions remain independently revertible.

- [ ] 8. Convert `TutorialPopup` in `src/components/tutorialPopup.tsx`
  - **Target:** default export `TutorialPopup`; caller `App`; five-page tutorial data from Redux.
  - **Priority:** rank 8, score 8 = impact 2 + reach 2 + leverage 2 + readiness 2. It owns a complete guided flow with coupled navigation/visibility state. Boundary button behavior, content selection, and self-closing must remain stable.
  - **Current behavior:** starts visible on page zero; renders the selected page image/title/name/content; hides Back on the first page and Next on the last; Back/Next increment or decrement `siteNumber`; close toggles internal `visibility` to `display: none` without telling `App`, so reopening Tips while the same instance remains mounted does not reset it. Missing page data renders no content. State updates spread the current state.
  - **Conversion map:** use `useReducer` for `siteNumber` and `visibility` transitions, or two independent `useState` values with functional setters; map `changeSite`, `displayContent`, and `closePopup` to local functions/pure rendering. Derive styles directly during render. No Effect is needed because all work is event-driven. Preserve internal hide semantics and do not add an `onClose` prop during this conversion.
  - **Steps:**
    1. Characterize five-page initial content, button visibility at both boundaries, each navigation step, close/toggle behavior, and behavior when page data is absent or props change length.
    2. Replace the class with a typed named function exported as default, explicitly mapping both state fields and using functional transitions so rapid clicks cannot read stale state.
    3. Preserve DOM structure, inline display values, image paths/alt text, button text, title numbering, and current relationship with `App`.
    4. Keep page-boundary policy behaviorally identical; any clamping or reopen/reset UX improvement requires a separate product decision.
  - **Expected result:** tutorial navigation and self-hiding behave exactly as before for the five current pages, without stale state under rapid interactions.
  - **Focused verification:** run focused popup tests, `npm run tsc`, and `npm run build`; under `npm run dev`, navigate first-to-last-to-first, verify boundary controls, close, and use the Header Tips action again to observe the preserved mounted-state behavior.
  - **Completion evidence:** state-transition and DOM assertions pass for every boundary/close case; runtime text/image/button behavior matches; no class/`this.` syntax remains.
  - **Rollback:** `src/components/tutorialPopup.tsx` and its focused test only.

- [ ] 9. Convert `HelperLayer` in `src/components/helperLayer.tsx`
  - **Target:** default export `HelperLayer`; caller `App`; child `HelperWindow`.
  - **Priority:** rank 9, score 7 = impact 2 + reach 2 + leverage 1 + readiness 2. It gates the examples overlay and its close control, but has no internal behavior beyond prop-driven rendering, making it a contained final component conversion before integration verification.
  - **Current behavior:** returns `null` when `visible` is false; otherwise derives `site` (`tips` → `left`, `examples` → `right`), renders `HelperWindow` with a fixed block style and all data/action props, and invokes `onClose` from the absolute-positioned accessible close button.
  - **Conversion map:** replace the class with a typed named function and destructure `HelperLayerProps`; derive `site` during render. No state, Effect, ref, context, static property, imperative API, or memoization is needed. Preserve default export and all child/button props.
  - **Steps:**
    1. Characterize invisible output, both panel-to-site mappings, child prop forwarding, button label/style/text, and one `onClose` call per click.
    2. Replace the class with a function while retaining the early return and exact DOM/props.
    3. Verify it composes with the converted `App` and `HelperWindow` without changing mount/unmount behavior.
  - **Expected result:** visibility, panel mapping, helper data, styling hooks, accessibility label, and close behavior are unchanged.
  - **Focused verification:** run focused HelperLayer/App tests, `npm run tsc`, and `npm run build`; under `npm run dev`, open and close Command Examples and verify no hidden overlay remains in the DOM.
  - **Completion evidence:** conditional-render and prop-forwarding assertions pass; runtime close behavior passes; no class/`this.` syntax remains.
  - **Rollback:** `src/components/helperLayer.tsx` and its focused test only.

- [ ] 10. Verify the complete migration
  - **Expected result:** all nine selected classes are function components without behavioral regressions; `Popup` and `CommandDescription` remain documented as intentional `Later` classes.
  - **Steps:**
    1. Run the recorded formatter/lint/Hook-lint commands if the implementation adds them, the new full automated test command, `npm run tsc`, and `npm run build`. Compare every failure with the baseline above; do not label the pre-existing placeholder `npm test` failure a migration regression.
    2. Run each focused component test and inspect any snapshot change manually; do not accept snapshots automatically.
    3. Run `npm run dev` and exercise initial `/` render, Header panel switching/closing, tutorial navigation, valid/invalid/rapid command entry, nested repeats, every editable argument type, nested deletion, example selection across groups, canvas redraw, focus/ARIA behavior, and browser-console errors.
    4. Exercise CommandInput timer cleanup and Canvas setup/cleanup in a Strict Mode test harness. Confirm timers, image callbacks, refs, and canvas operations neither leak nor duplicate. The production root currently has no `StrictMode`; do not change that configuration merely to complete this migration.
    5. Search selected files for `class`, `extends React.Component`, lifecycle names, and `this.`. Search all project source again for React classes and confirm the only remaining components are `Popup` and `CommandDescription`, both matching the `Later` inventory decisions.
    6. Review the complete diff for exports/HOCs, props and action payloads, React 17 ref behavior, keys, CSS classes, accessibility, DOM order, Redux identity/mutation, images, and accidental unrelated cleanup.
    7. Record exact commands, totals, runtime observations, remaining risks, and the rollback boundary here. Mark `COMPLETE` only after Tasks 1-9 and this task meet all completion evidence.
  - **Completion evidence:** nine component tasks plus integrated verification are checked; the full test/typecheck/build suite passes; the runtime matrix passes without console warnings; a remaining-class scan reports exactly two documented React class components; full diff review is clean.
  - **Rollback:** the nine selected component files, their focused tests, shared test-harness configuration, and `src/utils/turtle.ts` only if Task 3 required its cleanup support. Each component remains an independent revert boundary except the explicitly recorded shared harness setup.

## Risks and deferred components

- `Popup` (`src/components/popup.tsx`) is deferred because it is a leaf used only by `CommandInput`, contains no real state or behavior, and ranks below the nine selected components. Its unused `input` field, unused `closePopup` prop, unused `IState`, and misspelled `massage` prop should be handled as a later isolated conversion/API decision, not folded into Task 1.
- `CommandDescription` (`src/components/templates/CommandDescription.tsx`) is deferred because it is a presentational leaf reached only through `HelperWindow`. A later conversion must preserve object enumeration order, truthy filtering, argument rendering, image path, and existing DOM/classes; adding missing image alt text is a separate accessibility change that needs explicit review.
- Automated readiness is the largest cross-cutting risk. High-impact components currently have no executable characterization coverage. Establish the shared harness before Task 1 and keep each behavioral test adjacent to its component.
- `Canvas` has mount/update branch differences, operator-precedence ambiguity in color commands, async `Image.onload`, and no cleanup. Characterize current output before unifying logic; do not conceal a drawing fix inside syntax-only refactoring.
- `CommandInput` has overlapping timers and no cleanup. The plan intentionally requires cleanup and latest-error characterization so the migration does not introduce stale updates.
- `CommandList` mutates a prop object before dispatch. The function conversion should stop that mutation only with reducer-integrated evidence proving identical user-visible behavior.
- React 17 means function components do not receive refs as ordinary props. No selected consumer currently holds a component ref, so `forwardRef`/`useImperativeHandle` are unnecessary; preserve DOM refs internally.
- None of the classes is an error boundary or uses unsupported class-only APIs, so no component is marked `Keep`.

## Final status

`NOT STARTED`: inventory, ranking, and clean typecheck/build baseline are recorded. 0 of 10 migration tasks are complete; 10 remain unchecked. Implementation and behavioral test infrastructure have not started.
