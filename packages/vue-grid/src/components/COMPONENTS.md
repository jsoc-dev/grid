# Vue components layout

`SimpleNavigator` and `ChildGridToggle` are split across a `.vue` SFC and a paired `.ts` types file.

## Why `.vue` exists

These components are **generic over `PluginConfig`** and must receive props at **runtime** (e.g. `GridStore<PluginConfigAg>` in example apps).

Plain `.ts` `defineComponent` could not satisfy both constraints in this repo:

| Approach                                          | Runtime                     | TypeScript (Volar / `vue-tsc`)                  |
| ------------------------------------------------- | --------------------------- | ----------------------------------------------- |
| Object form + `PropType<GridStore<PluginConfig>>` | Works                       | Fails — `GridStore` is invariant in `C`         |
| Functional generic `defineComponent`              | Fails — props land on attrs | Works                                           |
| Export cast on `DefineComponent`                  | Works                       | Volar still reads runtime `props`, not the cast |

**Generic SFCs** are Vue’s supported fix: `<script setup generic="C extends PluginConfig">` with `defineProps`. That registers runtime props and preserves generic inference in templates.

## Why the paired `.ts` exists

The `.ts` sibling (e.g. `ChildGridToggle.ts`) is the **single source of truth** for exported prop and slot types (`ChildGridToggleProps`, `SimpleNavigatorSlotProps`, …). The `.vue` file imports those types; it does not redefine them.

Keep types in `.ts` because:

1. **Cross-`.ts` imports** — helpers such as `renderChildGridToggle.ts` call `h(ChildGridToggle, props)` from plain TypeScript. They need prop types without duplicating shapes or importing from an SFC.
2. **ESLint type-aware linting** — `typescript-eslint` uses the TypeScript program, not `vue-tsc`, when checking `.ts` files. Named type exports imported from `.vue` resolve to error types in `.ts` consumers, which triggers rules like `@typescript-eslint/no-unsafe-member-access`. Types in `.ts` lint cleanly.
3. **Public API** — consumers import prop/slot types from `@jsoc/vue-grid` (re-exported from `index.ts`) as ordinary TypeScript types, independent of how the SFC is authored.

`vue-tsc` (used in `@jsoc/vue-grid` and the plugin packages) resolves `.vue` files natively, so **`env.d.ts` `declare module "*.vue"` shims are not required** in those packages.

## File roles

| File                                          | Role                                                              |
| --------------------------------------------- | ----------------------------------------------------------------- |
| `ChildGridToggle.ts` / `SimpleNavigator.ts`   | Exported prop and slot types                                      |
| `ChildGridToggle.vue` / `SimpleNavigator.vue` | Generic SFC implementation (template + setup)                     |
| `renderChildGridToggle.ts`                    | Programmatic `h()` renderer for AG Grid / TanStack cell renderers |

`index.ts` re-exports types from `.ts` and default components from `.vue`.
