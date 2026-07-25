# ESLint refactor tasks

## Setup

- [x] Added ESLint's flat config with the recommended JavaScript and TypeScript rules.
- [x] Added generated-path ignores, the `lint` npm script, and the existing-code suppression baseline.

## Refactor queue

- [ ] `src/models/Command.ts` — `@typescript-eslint/no-namespace` (1 violation): remove the unused legacy `CommandModel` namespace or replace it with module exports, run `npx eslint . --prune-suppressions`, and verify with `npm run lint`.
- [ ] `src/utils/caller.ts` — `@typescript-eslint/no-unused-vars` (2 violations): implement or explicitly consume the `filename` inputs for `load` and `save`, run `npx eslint . --prune-suppressions`, and verify with `npm run lint`.
- [ ] `src/utils/turtle.ts` — `prefer-const` (2 violations): initialize `newX` and `newY` as constants at their declarations, run `npx eslint . --prune-suppressions`, and verify with `npm run lint`.
- [ ] `vite.config.js` — `no-undef` (2 violations): replace CommonJS `__dirname` access with an ES-module directory URL/path, run `npx eslint . --prune-suppressions`, and verify with `npm run lint`.

## Verification

- [x] Each suppression entry has exactly one matching refactor task.
- [x] The setup keeps recommended rules enabled and leaves source files in lint scope.
