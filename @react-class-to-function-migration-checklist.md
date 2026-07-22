# React Class → Function Component Migration Checklist

This checklist outlines the steps you should follow when converting a class component to a function component.  Keep it handy while working through each component in your codebase.

---
## 1. Identify Components to Migrate
- [ ] Search for files that export a **class** extending `React.Component` or `Component`.  (Use the search tool if needed.)
- [ ] Confirm the file contains a single exported component; if multiple components are present, treat each separately.
- [ ] Create a branch or commit dedicated to the migration of this component so you can easily review changes.

---
## 2. Understand Component Responsibilities
1. **State** – list all `this.state` keys and initial values.
2. **Lifecycle Methods** – note `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`, etc., and what side‑effects they perform.
3. **Refs** – any usage of `React.createRef()` or callback refs.
4. **Event Handlers / Class Methods** – methods that reference `this` (e.g., `handleClick`).
5. **Props Usage** – confirm if props are read-only or mutated.

---
## 3. Convert to Function Component Skeleton
```tsx
import React, { useState, useEffect, useRef } from 'react';

interface Props {
  // TODO: Add prop types
}

const MyComponent: React.FC<Props> = (props) => {
  // state and logic go here
  return (
    <div>
      {/* JSX output */}
    </div>
  );
};

export default MyComponent;
```
- Replace the class name with a descriptive functional component name.
- Add `Props` interface or type if using TypeScript.

---
## 4. Migrate State
For each key in `this.state`:
- Convert to a `useState` hook: `const [value, setValue] = useState(initial);`
- If the state is an object with multiple keys that are updated together, consider using a single `useReducer` or keep separate `useState`s for clarity.

---
## 5. Migrate Lifecycle Methods to `useEffect`
| Class Method | Equivalent in Function Component | Notes |
|--------------|----------------------------------|-------|
| `componentDidMount` | `useEffect(() => { /* code */ }, []);` | Empty dependency array runs once on mount |
| `componentDidUpdate(prevProps, prevState)` | `useEffect(() => { if (prevX !== x) {/* code */} }, [x]);` | Include dependencies explicitly |
| `componentWillUnmount` | `return () => { /* cleanup */ };` inside the same `useEffect` that has a non‑empty dependency array or in a dedicated effect with empty deps. |

- Replace each lifecycle method with an appropriate `useEffect`.  Keep side‑effects isolated.
- If multiple lifecycle methods affect the same resource, combine them into one `useEffect` when possible.

---
## 6. Convert Class Methods & Event Handlers
- Bind class methods (e.g., `this.handleClick = this.handleClick.bind(this)`) are no longer needed; define handlers as arrow functions or inside the component body:
```tsx
const handleClick = () => {
  // logic
};
```
- Ensure that any references to `this` are replaced with local variables (`props`, state values, refs).

---
## 7. Handle Refs
- Replace `React.createRef()` with `useRef`:
```tsx
const myRef = useRef<HTMLDivElement>(null);
```
- Attach ref: `<div ref={myRef}>`.  Use the ref value as `myRef.current`.

---
## 8. Update Prop Types & Defaults
- If using TypeScript, define a `Props` interface or type.
- Convert any default props logic (e.g., `static defaultProps`) into default values in function parameters or within the component body.

---
## 9. Test Functionality
1. **Unit Tests** – run existing tests for this component. If tests fail, debug differences caused by migration.
2. **Manual Testing** – open the page where the component renders; interact with it and verify UI and behavior match the original.
3. **Performance Check** – ensure no memory leaks or unnecessary re‑renders.

---
## 10. Clean Up
- Remove any unused imports, lifecycle methods, or class properties.
- Delete the old class file if replaced; otherwise keep it as a backup until all tests pass.
- Commit changes with a descriptive message: `feat(component): migrate MyComponent to function component`.

---
## 11. Repeat for Next Component
- When this migration is verified, move on to the next component in your list.
- Keep track of progress (e.g., using an issue tracker or a simple spreadsheet).

---
**Tip:** Automate repetitive patterns with code snippets or scripts if you are migrating many components.  Use this checklist as a reference to ensure nothing is missed.
