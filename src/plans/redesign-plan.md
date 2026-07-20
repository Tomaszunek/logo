# Logo App Redesign Plan
## 1. Overview
The current UI of the **logo** app exhibits several usability, accessibility, and visual design shortcomings that hinder user onboarding and efficient use. This document outlines a phased redesign strategy to address these issues while maintaining functional parity.

## 2. Goals
- Improve discoverability of core features (drawing canvas, command editor/input).
- Ensure keyboard & screen‑reader friendliness.
- Make layout responsive across all supported viewports.
- Remove debugging artefacts and enforce WCAG AA compliance.
- Preserve the existing turtle drawing logic; no new features unless requested.

## 3. Key Findings
| Priority | Area | Issue | Impact |
|----------|------|-------|--------|
| **Critical** | Interaction | `div.removeButton` is not focusable or announced by screen readers. | Keyboard users cannot delete commands. |
| | | Canvas element unlabeled, no role. | Screen reader users miss the drawing area. |
| **High** | Layout | Fixed canvas size (800 × 800) overflows on small screens. | Content clipped; poor mobile experience. |
| | | Debug colors (`red/green`) in media queries remain in production. | Violates contrast standards, appears unfinished. |
| **Medium** | Code Quality | Deprecated `componentWillReceiveProps` lifecycle method. | Future React updates may break component. |
| | | No ARIA labels on input and buttons. | Screen reader users lack context. |
| **Low** | Content | Missing introductory banner & skip‑to‑content link. | Users need to scroll or navigate manually. |

## 4. Action Plan
### Immediate (≤ 2 days)
- Replace `div.removeButton` with `<button>` and add `aria-label="Remove command"`.
- Add `role="img"` and `aria-label` to the canvas element.
- Add `placeholder="Enter a command"` and `aria-label="Command input"` to the input field.
- Wrap the error popup in an element with `role="alert"` or `aria-live="assertive"`.
- Remove debug background colors from CSS.

### Short‑term (≈ 1 week)
- Refactor Canvas component:
  - Replace `componentWillReceiveProps` with `componentDidUpdate` or migrate to a functional component using `useEffect`.
  - Make canvas width/height responsive (`max-width: 100%; height: auto;`).
- Implement keyboard navigation for the command list (focusable `<li>` elements, arrow key handling).
- Add skip‑to‑content link and wrap major sections in semantic landmarks.
- Ensure focus returns to input after popup dismissal.

### Medium‑term (≈ 2 weeks)
- Conduct accessibility audit with screen readers and keyboard users; fix remaining issues.
- Replace all hard‑coded sizes with CSS variables or a design system (spacing, colors, typography).
- Add responsive breakpoints for padding, font size, and component widths.
- Implement a visual theme that meets WCAG AA contrast ratios.

### Long‑term (ongoing)
- Conduct user‑testing sessions to validate new UI flows.
- Refactor codebase into reusable components following the new design system.

## 5. Implementation Notes
- Keep existing turtle logic untouched; only adjust rendering and layout layers.
- Use `React.memo` or `useCallback` for performance where necessary.
- Leverage CSS Grid/Flexbox for a fluid layout rather than fixed columns.
- Document all ARIA attributes in the code comments to aid future maintenance.

## 6. Open Questions
1. Do we need a dark mode toggle? 
2. Should we provide an onboarding tutorial or tooltip system? 
3. Is there a target user base (e.g., children, professionals) that would influence visual style choices?