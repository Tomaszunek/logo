# ESLint refactor tasks

## Setup

- [x] Added ESLint's flat config with the recommended JavaScript and TypeScript rules.
- [x] Added generated-path ignores and the `lint` npm script; removed the baseline after resolving every existing violation.

## Refactor queue

- [x] `src/models/Command.ts` — `@typescript-eslint/no-namespace` (1 violation): removed the unused legacy `CommandModel` namespace, pruned its suppression, and verified lint.
- [x] `src/utils/caller.ts` — `@typescript-eslint/no-unused-vars` (2 violations): removed the unused `filename` parameters and arguments from the placeholder `load` and `save` methods, pruned their suppression, and verified lint.
- [x] `src/utils/turtle.ts` — `prefer-const` (2 violations): initialized `newX` and `newY` as constants at their declarations, pruned their suppression, and verified lint.
- [x] `vite.config.js` — `no-undef` (2 violations): replaced CommonJS `__dirname` access with an ES-module URL-derived path, pruned its suppression, and verified lint.

## Verification

- [x] Every suppression was pruned and the empty baseline file was removed.
- [x] The setup keeps recommended rules enabled and leaves source files in lint scope.
