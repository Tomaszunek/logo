# TypeScript 7 migration checklist

Status: COMPLETE

## Scope

Migrate the single npm package in this repository from TypeScript 5.9.3 to the
stable native TypeScript 7.0.2 command-line compiler while retaining the
TypeScript 6.0 API required by `typescript-eslint`.

In scope: `package.json`, `package-lock.json`, `tsconfig.json`, the existing
`tsc`/lint/build integrations, and source compatibility fixes only if the new
compiler proves they are required.

Explicitly excluded: unrelated dependency upgrades, JavaScript-to-TypeScript
conversion, general type tightening, lint cleanup, framework/build-tool
migration, and feature work. Plan last updated 2026-07-25.

Authoritative references:

- [TypeScript 7.0 release and 6/7 side-by-side guidance](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)
- [TypeScript 6.0 migration guidance](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/)
- [Current typescript-eslint dependency support](https://typescript-eslint.io/users/dependency-versions/)
- [Current stable TypeScript npm metadata](https://registry.npmjs.org/typescript/latest)

## Baseline

- [x] TS7-001 — Record the current compiler, project shape, integrations, and checks. Done when: requested/resolved versions, runtime, configuration, compiler consumers, commands, outputs, and pre-existing failures are documented. Verify: inspect manifests/configuration and run the existing install, typecheck, build, lint, and test probes.
  - Evidence: On 2026-07-25, npm 11.8.0 on Node 25.5.0 resolves `typescript@5.9.3`, `typescript-eslint@8.65.0`, `vite@8.1.5`, and `@vitejs/plugin-react@6.0.3` from npm lockfile v2. The repository has one `tsconfig.json`, no project references or declaration build, 32 TS/TSX files under `src`, and a Vite-only production build. `npm.cmd ci --dry-run --ignore-scripts`, `npm.cmd run tsc`, `npm.cmd run build`, and `npm.cmd run lint` exit 0; the build transforms 64 modules. `npm.cmd test` is a pre-existing placeholder that intentionally exits 1, and `src/App.test.tsx` contains no active suite. No CI, container, hook, workspace, editor configuration, custom transformer, language-service plugin, embedded-language integration, preview compiler reference, `tsgo` call, or direct source import of `typescript` was found. The unrelated untracked `.claude/settings.local.json` was not modified.

## Compatibility decisions

- [x] TS7-002 — Select the compiler and API-compatibility package route. Done when: the stable TypeScript 7 build command and the owner of the retained TypeScript 6 API are explicit. Verify: compare current official TypeScript/typescript-eslint guidance with the manifest, lockfile peer ranges, and ESLint configuration.
  - Evidence: The selected build compiler is stable native `typescript@7.0.2`, exposed as `tsc` through the official npm-alias pattern `@typescript/native: npm:typescript@7.0.2`. The project imports `typescript-eslint` in `eslint.config.mjs`, enables `parserOptions.projectService`, and its resolved parser/tool packages declare `typescript >=4.8.4 <6.1.0`; TypeScript 7.0 does not provide the legacy programmatic API these tools consume. Retain the API under the package name they peer-import using `typescript: npm:@typescript/typescript6@6.0.2`. The resulting ownership is `npm run tsc` → TypeScript 7, while `typescript-eslint` → the TypeScript 6 compatibility API. Vite and the application have no detected compiler-API dependency. Node 25.5.0 satisfies TypeScript 7.0.2's `>=16.20.0` runtime requirement.

- [x] TS7-003 — Select and prove the minimal `tsconfig.json` compatibility route. Done when: every detected TypeScript 7 configuration error has a behavior-preserving replacement and both bridge and target compilers accept the proposed configuration. Verify: run TypeScript 6.0.2 and 7.0.2 against a temporary adjusted configuration and scan the source for relevant breaking constructs.
  - Evidence: The unchanged config fails under TypeScript 6.0.2 with TS5101/TS5107 deprecations and under 7.0.2 with TS5102/TS5108 removals for `baseUrl` and normalized `moduleResolution: node10`. This Vite-bundled browser application should use `moduleResolution: bundler`. Removing `baseUrl` while adding `"paths": {"src/*": ["./src/*"]}` preserves the 20 detected `src/...` imports and matches the existing Vite alias. A temporary config with only those adjustments passes `--noEmit` under both TypeScript 6.0.2 and 7.0.2. Existing explicit `module: esnext`, `target: es2018`, `rootDir: src`, and `strict: false` preserve behavior across the new defaults. TypeScript 7 also accepts the four CSS/PNG imports via the existing `vite/client` reference. Scans found no legacy `module` namespace declarations, import assertions, `no-default-lib` directives, JavaScript checking, or Unicode-sensitive template-literal type logic requiring a source task.

## Implementation

- [x] TS7-004 — Replace the direct compiler dependency with the approved TypeScript 7/6 side-by-side aliases and regenerate the authoritative npm lockfile. Done when: `package.json` and `package-lock.json` resolve `@typescript/native` to `typescript@7.0.2`, resolve the package named `typescript` to `@typescript/typescript6@6.0.2`, retain the current resolved `typescript-eslint@8.65.0`, and contain no preview compiler package. Verify: run `npm.cmd install --save-dev @typescript/native@npm:typescript@7.0.2 typescript@npm:@typescript/typescript6@6.0.2`, inspect the manifest/lockfile diff, then run `npm.cmd ls @typescript/native typescript typescript-eslint @typescript-eslint/parser --depth=1`.
  - Evidence: On 2026-07-25, npm installed `@typescript/native: npm:typescript@^7.0.2` and `typescript: npm:@typescript/typescript6@^6.0.2`, updating the manifest and authoritative lockfile together without force flags or peer overrides. `npm.cmd ls @typescript/native typescript typescript-eslint @typescript-eslint/parser --depth=1` exits 0 and shows native 7.0.2, the 6.0.2 compatibility wrapper, and `typescript-eslint`/parser 8.65.0 deduped onto that wrapper. The wrapper's documented `@typescript/old: npm:typescript@^6` implementation resolves 6.0.3 and supplies `tsc6`; `tsc` reports 7.0.2 and `tsc6` reports 6.0.3. The dependency diff is limited to this side-by-side route and its TypeScript 7 platform packages, and the focused scan finds no `@typescript/native-preview` or `tsgo` reference.

- [x] TS7-005 — Replace the removed TypeScript configuration options. Done when: `tsconfig.json` has no `baseUrl`, uses `"moduleResolution": "bundler"`, and maps `"src/*"` to `"./src/*"` without changing unrelated compiler behavior. Verify: run `npm.cmd exec -- tsc --version`, `npm.cmd run tsc`, `npm.cmd exec -- tsc6 --noEmit`, and inspect `npm.cmd exec -- tsc --showConfig`.
  - Evidence: On 2026-07-25, `tsconfig.json` removes `baseUrl`, changes only `moduleResolution` from `node` to `bundler`, and adds `"paths": {"src/*": ["./src/*"]}`. `tsc --showConfig` reports the intended effective settings and the same 32 source files, with explicit `module: esnext`, `target: es2018`, `rootDir: ./src`, and `strict: false` retained. Native `tsc` reports 7.0.2 and `npm.cmd run tsc` exits 0; the `tsc6 --noEmit` diagnostic bridge also exits 0. The focused config scan finds no remaining `baseUrl` or Node 10 module-resolution setting.

## Verification

- [x] TS7-006 — Verify the final TypeScript 7 migration and stale-reference cleanup. Done when: a clean lockfile install succeeds; `tsc` reports 7.0.2; the `@typescript/typescript6@6.0.2` wrapper's `tsc6` reports its resolved TypeScript 6 implementation version 6.0.3; TypeScript 7 typecheck, the TypeScript 6 diagnostic bridge, production build, and lint pass; the known test placeholder is documented rather than misreported as a regression; and no retired option, preview package, `tsgo` command, unintended TypeScript 6 owner, or unexpected file change remains. Verify: run `npm.cmd ci`, `npm.cmd exec -- tsc --version`, `npm.cmd exec -- tsc6 --version`, `npm.cmd run tsc`, `npm.cmd exec -- tsc6 --noEmit`, `npm.cmd run build`, `npm.cmd run lint`, `npm.cmd test`, `npm.cmd ls @typescript/native typescript typescript-eslint @typescript-eslint/parser --depth=1`, focused `rg` scans for `baseUrl|moduleResolution.*node|@typescript/native-preview|\btsgo\b`, `git diff --check`, and `git status --short`.
  - Evidence: On 2026-07-25, the first `npm.cmd ci` attempt correctly exposed that the repository's running `npm run serve` process held Vite's native Rolldown binary open on Windows; after stopping only those verified project PIDs, a retry installed all 139 packages from the final lockfile and reported zero audit findings. Node 25.5.0/npm 11.8.0 then report native `tsc` 7.0.2 and bridge `tsc6` 6.0.3. `npm.cmd run tsc`, `npm.cmd exec -- tsc6 --noEmit`, `npm.cmd run build`, and `npm.cmd run lint` all exit 0; Vite 8.1.5 transforms 64 modules and produces the production bundle. `npm.cmd test` remains the unchanged intentional placeholder and exits 1, matching the baseline rather than indicating a migration regression. The dependency tree exits 0 and assigns TypeScript 7 to `@typescript/native` while `typescript-eslint@8.65.0` and its parser use the deduped `@typescript/typescript6@6.0.2` compatibility package. Focused source/config/manifest scans find no `baseUrl`, Node 10 module resolution, native-preview package, or `tsgo` command. `git diff --check` exits 0, and the only migration changes are `package.json`, `package-lock.json`, `tsconfig.json`, and this checklist; the unrelated untracked `.claude/settings.local.json` remains untouched. The project Vite serve process was restarted from the final dependency state after validation.

## Outcome

COMPLETE — all migration tasks are checked. The project now type-checks with
native TypeScript 7.0.2, retains the supported TypeScript 6 API bridge for
`typescript-eslint`, and passes the clean install, bridge typecheck, production
build, lint, stale-reference, and diff validations. No source change was needed.

Rollback: restore the pre-migration `package.json`, `package-lock.json`, and
`tsconfig.json` together. Do not keep the TypeScript 7 dependency with the
removed TypeScript 5 configuration options, and do not remove the TypeScript 6
compatibility API while `typescript-eslint` still requires it.
