# Visual Design Improvement Plan

## Review context

- Last reviewed: 2026-07-20
- Surfaces: empty Logo Playground workspace, header and footer, drawing canvas, command editor/input, empty command details rail, Tips tutorial (first page), and Command Examples panel
- Viewports/themes: 1440 × 1000 desktop and 390 × 844 mobile; light theme only
- Evidence: live Vite build inspected in headless Chromium, supported by `src/App.tsx`, component source, `src/App.css`, `src/index.css`, and the currently unreferenced styles in `src/styles/`
- Standards/references: [WCAG 2.2](https://www.w3.org/TR/WCAG22/)—especially 1.4.3 Contrast (Minimum), 1.4.10 Reflow, 1.4.11 Non-text Contrast, 2.4.7 Focus Visible, and 2.5.8 Target Size (Minimum)
- Not reviewed: populated and deeply nested command sequences, edited numeric/color controls, error and success feedback, browser zoom/text scaling, high-contrast or forced-colors modes, dark theme, touch hardware, screen-reader output, and browsers other than Chromium

## Guardrails

- Preserve: the turtle identity, playful educational character, canvas-centered task, recognizable command-category distinctions, and existing React/Redux drawing behavior
- Reuse: the existing spacing and color variables where suitable; extend them into a coherent token set rather than introducing isolated values
- Exclude: features, workflows, information architecture, backend behavior, copy strategy, and unrelated refactors
- Treat source-only findings as predictions until the named rendered state is visually verified

## Checklist

- [ ] VIS-001 [P0] Make the complete workspace reflow within narrow viewports
  - Location: header navigation, `.appMain`, `.editorContainer`, `.editorLine`, canvas, and `.commandListLine` at 320–767 px widths
  - Evidence: the 390 × 844 render clips the “Command Examples” control, places the command details rail beyond the right edge, and allows horizontal page overflow; `.editorContainer` is explicitly `flex-wrap: nowrap` while the main container keeps desktop horizontal padding
  - Change: introduce a mobile-first stack for the header actions and workspace regions, apply `min-width: 0` to flexible children, reduce narrow-screen gutters, keep the square canvas fluid, and confine any necessary scrolling to the component that owns it
  - Basis: the existing flex layout and spacing tokens; WCAG 2.2 SC 1.4.10 Reflow
  - Done when: all header controls, command entry, canvas, command details, and footer fit at 320 px and 390 px without two-dimensional page scrolling, clipping, overlap, or loss of content
  - Verify: compare full-page captures at 320 × 568, 390 × 844, 768 × 1024, and 1280 px at 400% zoom; inspect both empty and populated command states
  - Depends on: none

- [ ] VIS-002 [P1] Establish one active visual system for every rendered component
  - Location: `src/index.css`, `src/App.css`, and the styles currently isolated in `src/styles/commandTags.css`, `src/styles/helpers.css`, and `src/styles/popup.css`
  - Evidence: the live build shows browser-default buttons, inputs, tutorial controls, and example content; the three component stylesheets contain intended styling but are not imported by the application, and the production CSS bundle is only about 1.3 kB
  - Change: consolidate or deliberately import audited component styles through the live cascade; extend the root variables for type, surfaces, borders, focus, control sizes, and semantic command colors; discard fixed dimensions and conflicting legacy rules instead of enabling them unchanged
  - Basis: the current turtle/command color language, existing root variables, and the smallest shared change that can correct repeated unstyled surfaces
  - Done when: all visible components use the same typography, surface, border, radius, spacing, and control language, with no accidental browser-default or conflicting legacy presentation
  - Verify: inspect the built CSS and compare the main, Tips, Command Examples, populated-command, and error states at desktop and mobile widths
  - Depends on: none

- [ ] VIS-003 [P1] Clarify the desktop workspace hierarchy and alignment
  - Location: `.appMain`, `.editorContainer`, `.editorLine`, `.commandListLine`, command composer, and canvas at 1024 px and wider
  - Evidence: the 1440 × 1000 render presents three large, weakly related vertical regions; the command input floats midway down a tall empty list border, the canvas and secondary rail compete for space, and the rail is an unlabeled gray block
  - Change: use a stable workspace grid that makes command entry the starting point, the drawing canvas the primary stage, and command details the secondary rail; give each region a clear surface boundary, alignment, and compact visual label using existing terminology
  - Basis: the current command-to-canvas task order and existing `editorLine`/`commandListLine` grouping
  - Done when: the eye moves predictably from command entry to canvas to command details, region edges align, empty regions do not look broken, and the canvas remains the dominant surface
  - Verify: compare empty and populated captures at 1024, 1280, and 1440 px; check sparse and long command content
  - Depends on: VIS-002

- [ ] VIS-004 [P1] Give the command composer clear empty and populated presentation
  - Location: `CommandEditor`, `.editorCont`, `CommandInput`, command tags, and remove controls
  - Evidence: the empty state renders as a tall black-bordered list with no explanation while the input is visually detached and constrained; source predicts nested command tags and remove buttons will inherit little or no live styling
  - Change: combine the editor and input into one intentional composer surface, keep the empty state compact and self-explanatory, give the input a clear full-width entry row, and style command tags and remove controls with consistent wrapping, hierarchy, and spacing
  - Basis: existing command names, category classes, placeholder text, and the product’s playful color coding
  - Done when: the empty composer reads as ready for input, populated commands wrap or scroll within the composer without stretching the page, nested repeats remain legible, and remove controls are visually distinct without dominating each tag
  - Verify: capture empty, single-command, long-command, nested-repeat, hover, focus, and removal states at 390, 768, and 1440 px
  - Depends on: VIS-002, VIS-003

- [ ] VIS-005 [P1] Present Tips and Command Examples in a shared, viewport-safe helper shell
  - Location: `HelperLayer`, `TutorialPopup`, `HelperWindow`, open and close states
  - Evidence: opening Tips inserts raw content above the workspace and creates a long page; opening Command Examples creates a viewport-long unstyled list; neither state visually separates itself from the workspace, and close controls sit at inconsistent edges
  - Change: create a common modal or side-panel shell with a backdrop, constrained width and height, internal scrolling, a persistent header and close action, and responsive edge gutters; keep the underlying workspace visually stable
  - Basis: the existing helper-layer concept and shared open/close behavior; WCAG 2.2 SC 1.4.10 Reflow and 2.4.11 Focus Not Obscured (Minimum)
  - Done when: opening either helper causes no page-layout shift, the surface fits the viewport, overflow stays inside it, the background is clearly de-emphasized, and the close action remains visible at all scroll positions
  - Verify: open and close both helpers at 320 × 568, 390 × 844, 768 × 1024, and 1440 × 1000; inspect short and long content positions
  - Depends on: VIS-001, VIS-002

- [ ] VIS-006 [P2] Turn the Tips content into a readable tutorial composition
  - Location: `.tutorialPopup` title, image, instructional text, progress/title line, and Back/Next controls
  - Evidence: the first Tips page renders as raw blocks with a small “X,” an image fixed to the left, instructional text below it, and a default “NEXT >” button; the large unused area makes the learning sequence hard to scan
  - Change: structure the content as a balanced image-and-instruction layout on wide screens and a single column on narrow screens; use `object-fit: contain`, a readable text measure, a compact progress/title header, and an anchored navigation footer
  - Basis: the existing tutorial page sequence and image assets; current application typography and spacing tokens from VIS-002
  - Done when: the title, illustration, instruction, and navigation are visible as one coherent lesson, images are neither distorted nor cropped, and Back/Next positions remain stable across pages
  - Verify: inspect every tutorial page at 390, 768, and 1440 px, including first/last-page button states and content with the longest title or instruction
  - Depends on: VIS-005

- [ ] VIS-007 [P2] Turn Command Examples into a scannable, consistent gallery
  - Location: `HelperWindow`, `.commandType`, `PathwayExample`, thumbnails, command strings, hover/focus/selected states
  - Evidence: the open panel renders examples as a single raw vertical stream with inconsistent image widths and command strings directly beneath them; multiple examples extend far below the viewport with little grouping or selection affordance
  - Change: group examples by their existing types, present them in a responsive card or strip system, normalize thumbnail frames and text spacing, format command strings as compact code content, and use restrained hover/focus/selected styling
  - Basis: existing `simple`, `crazy`, and `color` group data and supplied example imagery; preserve category character while replacing the legacy oversized glow effects
  - Done when: groups are visually distinct, at least two cards can be scanned side by side where space allows, long commands wrap without overlap, thumbnails share a consistent frame, and selection remains obvious without color alone
  - Verify: inspect every group at 390, 768, and 1440 px; test the longest command, keyboard focus, hover, and selected examples
  - Depends on: VIS-002, VIS-005

- [ ] VIS-008 [P2] Unify the header identity and action controls
  - Location: `.appHeader`, `.leftSide`, turtle logo, `h1`, `.rightSide`, Tips button, and Command Examples button
  - Evidence: the logo sits above the title instead of forming a single identity lockup; the helper controls use tiny browser-default buttons, touch the right edge, and are clipped on the 390 px render
  - Change: align logo and title in one compact row, style the helper actions as a coherent button group with clear hierarchy, add consistent gaps and focus rings, and allow controlled wrapping or a narrow-screen stack
  - Basis: existing turtle asset and title; WCAG 2.2 SC 2.5.8 Target Size (Minimum) and 2.4.7 Focus Visible
  - Done when: identity and actions align cleanly, every control is fully visible, each target is at least 24 × 24 CSS px or has equivalent spacing, and the group remains balanced from 320 to 1440 px
  - Verify: compare mouse, keyboard focus, pressed, and narrow/wide layouts at 320, 390, 768, and 1440 px
  - Depends on: VIS-001, VIS-002

- [ ] VIS-009 [P2] Frame the drawing canvas as the primary creative stage
  - Location: `Canvas`, canvas container, drawing surface border/background, and responsive square sizing
  - Evidence: the light canvas border nearly disappears into the page, there is no surrounding stage treatment, and at mobile width the square is visually squeezed between off-screen siblings; the small turtle becomes the only strong cue in a large empty field
  - Change: place the canvas in a clearly bounded stage with a purposeful neutral surface, consistent padding, a subtle border or elevation, and a fluid square aspect that uses available space without exceeding a readable desktop maximum
  - Basis: the canvas-centered product purpose, existing 800 × 800 drawing coordinate system, and shared surface tokens from VIS-002
  - Done when: the canvas is unmistakably the primary output region, remains square and crisp, is fully visible without page overflow, and preserves drawing proportions at every supported width
  - Verify: compare empty and complex drawings at 320, 390, 768, 1024, and 1440 px, including browser zoom
  - Depends on: VIS-001, VIS-002, VIS-003

- [ ] VIS-010 [P2] Make the command details rail readable in empty, nested, and editable states
  - Location: `CommandList`, `.commandListLine`, `.commendList`, command headings, descriptions, numeric/color inputs, nested repeats, and remove buttons
  - Evidence: the empty rail is a large unlabeled gray rectangle; source-only legacy rules predict highly saturated full-card backgrounds, tiny descriptions, fixed heights, and yellow command cards with white text that may fail contrast when those styles become active
  - Change: add a restrained empty presentation, use semantic category colors as accents rather than full saturated fields, set readable description sizing and line height, align editable controls, and show nested repeat depth through spacing and borders as well as color
  - Basis: existing category classes and edit controls; WCAG 2.2 SC 1.4.3 Contrast (Minimum), 1.4.11 Non-text Contrast, and 1.4.1 Use of Color
  - Done when: empty and populated states look intentional, every label and description meets contrast targets, nested levels remain distinguishable without color alone, and inputs/buttons align without clipping or fixed-height truncation
  - Verify: test every command category, numeric and color controls, three nested repeat levels, long descriptions, hover/focus, and empty state in both rail and stacked layouts
  - Depends on: VIS-002, VIS-003

- [ ] VIS-011 [P2] Define consistent visible interaction and feedback states
  - Location: header actions, command input, command tags, remove buttons, helper controls, example cards, tutorial navigation, skip link, and error popup
  - Evidence: the live UI mostly relies on browser-default hover/focus feedback; only the skip link has an explicit focus rule, and `popup.css` is not in the active style cascade, so the error presentation has no verified product styling
  - Change: provide token-driven `:hover`, `:focus-visible`, active, selected, disabled, loading, empty, error, and success treatments where those states exist; keep focus indicators persistent and use shape, iconography, or text in addition to color
  - Basis: existing interactive states in the components; WCAG 2.2 SC 2.4.7 Focus Visible, 1.4.11 Non-text Contrast, and 1.4.1 Use of Color
  - Done when: keyboard focus is always obvious, pointer and pressed feedback is consistent, disabled controls remain legible, selection is not color-only, and feedback surfaces match the rest of the visual system
  - Verify: keyboard-walk the full UI and capture each named state at desktop and mobile widths; trigger valid input, invalid input, helper navigation, selection, editing, and removal
  - Depends on: VIS-002, VIS-004, VIS-005, VIS-008, VIS-010

- [ ] VIS-012 [P3] Finish the page-level typography, rhythm, and footer polish
  - Location: body typography, page gutters, vertical spacing between header/workspace/footer, and `.appFooter`
  - Evidence: typography is a generic unscaled sans-serif, spacing jumps between compact native controls and very large blank regions, and the footer appears detached at the bottom of an otherwise unfinished empty canvas
  - Change: define a small responsive type scale and line-height set, normalize page gutters and section rhythm, constrain the workspace to a deliberate maximum width where appropriate, and reduce the footer to a quiet but intentional closing element
  - Basis: existing title and footer content, root spacing variables, and the visual system established in VIS-002
  - Done when: headings, labels, body text, and code content have consistent roles, vertical rhythm is balanced in sparse and dense states, and the footer aligns with the page grid without competing with the workspace
  - Verify: compare empty, populated, Tips, and Examples pages at 390, 768, 1024, and 1440 px with default and enlarged text
  - Depends on: VIS-002, VIS-003, VIS-005

## Completed evidence

- None. This review created the source-of-truth checklist only; no UI task has been implemented or marked complete.

## Blocked or deferred

- None. The states listed under “Not reviewed” require visual capture during their corresponding checklist tasks and do not currently block the ordered work.
