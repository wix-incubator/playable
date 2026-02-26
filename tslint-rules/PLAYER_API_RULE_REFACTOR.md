# Analysis: playerApiRule.ts and RuleWalker deprecation

## Current implementation summary

- **File**: `tslint-rules/playerApiRule.ts`
- **Role**: Custom TSLint rule `"player-api"` that:
  1. Finds class methods decorated with `@playerAPI` (or `@playerAPI('name')`).
  2. Ensures the decorator’s first argument (if present) is a string literal.
  3. Optionally (with `"require-jsdoc"`) requires a JSDoc comment on the method.

- **Mechanics**: Extends `Rules.AbstractRule` and uses `applyWithWalker()` with a custom **RuleWalker** (`PlayerApiMethodWalker`) that overrides `visitMethodDeclaration()` and uses `addFailureAtNode()`.

## Why refactor?

1. **TSLint is deprecated** (since 2019). The project still uses TSLint (`tslint.json`, `lint` script); the ecosystem has moved to **ESLint + typescript-eslint**.
2. **RuleWalker is deprecated** in TSLint in favor of a function-based API. Even if you stayed on TSLint, RuleWalker is not the recommended way to write rules.
3. **No real “fix in place”**: The only future-proof approach is to **migrate this rule to ESLint** and, when ready, migrate the rest of the lint setup from TSLint to ESLint.

## Refactor direction: ESLint + typescript-eslint

Use **ESLint** with **@typescript-eslint** and implement the same checks as a custom rule built with **`ESLintUtils.RuleCreator`** from `@typescript-eslint/utils`. No walker class; the rule is a single `create(context)` that returns a visitor object.

### Mapping from TSLint to ESLint

| TSLint | ESLint + typescript-eslint |
|--------|----------------------------|
| `Rules.AbstractRule` + `apply(sourceFile)` | `createRule({ create(context) { return { ... }; }, meta, ... })` |
| `applyWithWalker(new Walker(...))` | Return visitor from `create()` (e.g. `MethodDefinition(node) { ... }`) |
| `RuleWalker` + `visitMethodDeclaration(method)` | Visitor key `MethodDefinition`; in TS AST, class methods are `MethodDefinition` with `decorators` |
| `this.addFailureAtNode(node, message)` | `context.report({ node, messageId })` |
| `this.getOptions()` / `this.hasOption('require-jsdoc')` | Second parameter of `create`: `create(context, options)`; options from schema + `defaultOptions` |
| `RuleFailure[]` | ESLint reports via `context.report()` |

### AST details

- **Decorator**: In TSESTree, a decorator is a `Decorator` node with `expression`. For `@playerAPI('name')`, `expression` is a `CallExpression` and `expression.arguments` are the arguments.
- **Class methods**: Visited as **`MethodDefinition`**; they have a `decorators` array (when using decorators).
- **JSDoc**: Available on the method node; typescript-eslint exposes JSDoc on the node (e.g. leading comments or via `ts.getJSDocCommentsAndTags()` if you use parser services). For a simple “has JSDoc” check, inspecting the node’s leading comments for `/** ... */` is usually enough.

### Suggested file layout after migration

- Add an ESLint plugin (e.g. under `eslint-rules/` or `eslint-plugin-local/`) that exports the new rule.
- Rule module: one file, e.g. `player-api.ts`, using `ESLintUtils.RuleCreator`.
- Options: same semantics as today — e.g. `[true, "require-jsdoc"]` → ESLint options object `{ requireJsdoc: true }` and schema.
- Config: when you switch from TSLint to ESLint, enable the rule in `eslint.config.js` (or `.eslintrc`) under the plugin.

## Option A: Stay on TSLint temporarily (not recommended)

If you must keep TSLint for a short time, you could:

- Replace **RuleWalker** with a **single function** that takes `sourceFile` and `options`, uses `ts.forEachChild` (or a small visitor) to find `ts.SyntaxKind.MethodDeclaration` nodes, and for each collects “failures” (e.g. `{ node, message }`).
- Then use the **program-based** rule API if your TSLint version supports it (`applyWithFunction(program)` etc.), and in that function run your visitor and convert results to `RuleFailure[]`.

This is more work and still depends on a deprecated linter. Prefer migrating to ESLint.

## Option B: Migrate to ESLint (recommended)

1. **Add ESLint + typescript-eslint** (and, for the custom rule, `@typescript-eslint/utils`).
2. **Implement the rule** with `ESLintUtils.RuleCreator`: visitor for `MethodDefinition`, find `playerAPI` decorator, check first argument and optional JSDoc, call `context.report()` with `messageId`.
3. **Expose the rule** via a small plugin (e.g. `eslint-plugin-playable` or `local`) and enable it in ESLint config.
4. **Migrate config**: Use `tslint-to-eslint-config` and/or manually move rules from `tslint.json` to ESLint; replace `npm run tslint` with `eslint`.
5. **Remove TSLint** and the old `playerApiRule.ts` (and its RuleWalker) once the new rule is in use and green.

A concrete ESLint rule implementation is in **`tslint-rules/player-api.eslint-rule.ts`** in this directory. Use it once you add ESLint and `@typescript-eslint/utils`.

## How to use the new rule (after adding ESLint)

1. Install: `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/utils`.
2. Create a small plugin (e.g. `eslint-plugin-playable`) that imports `playerApiRule` from `tslint-rules/player-api.eslint-rule.ts` and exports it as the rule `player-api`.
3. In `eslint.config.js` (or `.eslintrc`): set `parser: '@typescript-eslint/parser'`, add the plugin, and enable `'playable/player-api': 'error'` (or `['error', { requireJsdoc: true }]` to mirror `[true, 'require-jsdoc']`).
4. Replace `npm run tslint` with `eslint` and remove TSLint + `playerApiRule.ts` when done.

## Summary

- **playerApiRule.ts** is a TSLint custom rule that uses the deprecated **RuleWalker** and lives in a deprecated linter.
- **Refactor in context of RuleWalker deprecation** = move the logic into an **ESLint custom rule** using **`@typescript-eslint/utils`’s `RuleCreator`** and a `MethodDefinition` visitor; no walker class.
- **Long-term**: Migrate the whole project from TSLint to ESLint and retire `playerApiRule.ts` in favor of the new ESLint rule.
