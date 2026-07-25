# ESLint setup plan

## Goal

Introduce the smallest current ESLint flat-config setup for this npm, Vite,
React, and TypeScript project. Existing violations will be recorded in ESLint's
committed bulk-suppression baseline so linting can protect new code immediately
without mixing application refactors into the setup.

## Current project baseline

- Package manager: npm with `package-lock.json`.
- Runtime observed during planning: Node.js `v25.5.0`, which satisfies current
  ESLint runtime requirements.
- TypeScript: `5.9.3`, which is supported by current typescript-eslint.
- Lintable project files: 16 `.ts` files, 16 `.tsx` files, and
  `vite.config.js`.
- Existing lint setup: none; there is no lint script, ESLint config, ignore
  file, suppression file, or source-level ESLint disable comment.
- Existing generated/dependency paths: `node_modules/`, `build/`, `dist/`, and
  `coverage/`.
- Existing checks: `npm run tsc` passes; `npm run build` is the build check;
  `npm test` is an intentional failing placeholder rather than a working test
  suite.
- Worktree note: preserve the unrelated untracked
  `.claude/settings.local.json`.

## Scope decisions

- Use flat config in `eslint.config.mjs` because `package.json` does not set
  `"type": "module"`.
- Add only `eslint`, `@eslint/js`, and `typescript-eslint`; retain the existing
  compatible `typescript` dependency.
- Enable `@eslint/js` recommended rules and the non-type-checked
  `typescript-eslint` recommended rules for `**/*.{js,jsx,ts,tsx}`.
- Globally ignore only confirmed generated, dependency, and coverage paths:
  `node_modules/**`, `build/**`, `dist/**`, and `coverage/**`.
- Use `"lint": "eslint ."` as the single lint script and use that same target
  for baseline creation, pruning, and verification.
- Do not add React-specific plugins, typed linting, stylistic presets, Prettier,
  import sorting, hooks, or CI changes in this task.
- Do not disable recommended rules or ignore source files to make the initial
  lint run pass.

## Implementation checklist

### 1. Protect the starting state

- [ ] Recheck `git status --short` and keep unrelated files out of the change.
- [ ] Record `node --version`, `npm --version`, `npm run tsc`, and
  `npm run build` results before changing lint configuration.
- [ ] Confirm the source extension counts and repeat the search for any newly
  added ESLint artifacts or inline disable comments.

### 2. Install the minimum supported packages

- [ ] Run
  `npm install --save-dev eslint @eslint/js typescript-eslint`.
- [ ] Confirm the resolved ESLint, typescript-eslint, TypeScript, and Node.js
  versions satisfy the official compatibility ranges.
- [ ] Review `package.json` and `package-lock.json`; reject unrelated dependency
  changes.

### 3. Add the flat configuration and command

- [ ] Create `eslint.config.mjs` with:
  - global ignores for `node_modules/**`, `build/**`, `dist/**`, and
    `coverage/**`;
  - explicit JS/JSX/TS/TSX file matching;
  - `js.configs.recommended`;
  - `tseslint.configs.recommended`;
  - no project-specific rule exceptions unless a real parser or configuration
    failure makes one necessary.
- [ ] Add `"lint": "eslint ."` to `package.json` without changing the existing
  scripts.
- [ ] Run `npm run lint` once and record a concise pre-baseline summary by file,
  rule, and count.
- [ ] Treat parsing errors, invalid configuration, missing modules, or
  unsupported syntax as setup defects to fix, not violations to suppress.

### 4. Create the existing-code baseline

- [ ] Run `npx eslint . --fix`, inspect every automatic source edit, and keep
  only safe rule fixes that do not alter application behavior.
- [ ] Run `npx eslint . --fix --suppress-all` to create the default
  `eslint-suppressions.json` for remaining error-level violations.
- [ ] Ensure `eslint-suppressions.json` is tracked project data and is not added
  to `.gitignore`.
- [ ] Run `npm run lint` and require a zero exit code with the baseline applied.
- [ ] Verify a synthetic unsuppressed violation still fails, using stdin and a
  nonexistent filename such as:
  `'const unused = 1;' | npx eslint --stdin --stdin-filename src/__eslint_probe__.ts`.
  This check must not create or modify a source file.

### 5. Create the cleanup queue

- [ ] Create `eslint-refactor-tasks.md` using the local skill's prescribed
  Setup, Refactor queue, and Verification sections.
- [ ] Add exactly one unchecked task for every file-and-rule entry in
  `eslint-suppressions.json`, including its current violation count.
- [ ] Sort tasks by file path and then rule name.
- [ ] In every task, name the expected fix, suppression pruning, and lint
  verification; do not add unrelated cleanup ideas.
- [ ] Mark setup items complete only after their artifacts and checks are
  verified.

### 6. Final verification

- [ ] Run `npm run lint`.
- [ ] Run `npm run tsc`.
- [ ] Run `npm run build`.
- [ ] Confirm every suppression entry has one matching refactor task and every
  refactor task has one matching suppression entry.
- [ ] Inspect the final diff for broad ignores, disabled recommended rules,
  unrelated packages, application behavior changes, and accidental edits to
  `.claude/settings.local.json`.
- [ ] Report the installed versions, config and script changes, number of
  suppressed file-and-rule tasks, passing commands, and
  `eslint-refactor-tasks.md`.

## Follow-up cleanup workflow

For later refactor runs, verify checked tasks first and then take the first
unchecked file-and-rule pair. Fix only that pair, run a focused lint check, run
`npx eslint . --prune-suppressions`, run `npm run lint`, and mark the task
complete only when its suppression is gone. When the queue is empty, prune
again, remove the empty suppression file if ESLint no longer needs it, and
verify lint without a baseline.

## Acceptance criteria

- `npm run lint` passes with existing violations suppressed.
- A new unsuppressed recommended-rule violation fails lint.
- `npm run tsc` and `npm run build` still pass.
- The suppression file and cleanup checklist have a one-to-one mapping by file
  and rule.
- No recommended rule is weakened and no source file is ignored because of its
  violations.
- No out-of-scope tooling or application refactor is included.

## Official references

- [ESLint getting started](https://eslint.org/docs/latest/use/getting-started)
- [ESLint flat configuration files](https://eslint.org/docs/latest/use/configure/configuration-files)
- [ESLint bulk suppressions](https://eslint.org/docs/latest/use/suppressions)
- [typescript-eslint getting started](https://typescript-eslint.io/getting-started/)
- [typescript-eslint dependency versions](https://typescript-eslint.io/users/dependency-versions/)
