# Dynamic MDX Content

## Purpose

The docs app supports MDX pages whose content depends on request-time adapter and plugin parameters.
Instead of recompiling MDX per request, the current implementation keeps MDX static and replaces
tokenized values during the server render.

Supported token shape:

- `%%adapter.frameworkName%%`
- `%%adapter.packageName%%`
- `%%adapter.id%%`
- `%%plugin.name%%`
- `%%plugin.packageName%%`
- `%%plugin.id%%`
- any other property in adapter or plugin metadata type

The active implementation lives in:

- `src/app/docs/[[...mdxPath]]/page.tsx`
- `src/utils/dynamicContentScope.tsx`
- `src/mdx-components.tsx`

## Request Flow

1. `src/app/docs/[[...mdxPath]]/page.tsx` imports the MDX page with `importPage`.
2. The page renders normal wrapped MDX content first.
3. If dynamic content tokens are found in the source code of current page, the route wraps the already-built MDX tree in `DynamicContentScopeBoundary`.
4. Wrapped MDX components read that scope during the same server render and replace tokens.

The scope is currently derived from:

- `getAdapterMetadata(docsParams.adapterId)`
- `getPluginMetadata(docsParams.adapterId, docsParams.pluginId)`

The resulting scope shape is:

```ts
{
  adapter,
  plugin,
}
```

This top-level grouping is intentional because tokens are resolved by dot-path, for example
`adapter.packageName` and `plugin.name`.

## Why AsyncLocalStorage

React context was not a good fit for this feature because the MDX component map is consumed in a
server-rendered path and the earlier context-based approach ran into server/client constraints.

`src/utils/dynamicContentScope.tsx` uses `AsyncLocalStorage` so that:

- the scope stays request-scoped
- no client component boundary is introduced
- wrapped MDX components can access route-derived data without threading props through Nextra

`DynamicContentScopeBoundary` calls `enterWith(scope)` and returns children unchanged.
`getDynamicContentScope()` returns the current request scope or `null`.

## MDX Integration

`src/mdx-components.tsx` is the integration point because Nextra calls `useMDXComponents()` while
rendering MDX.

The implementation:

1. starts from the default Nextra theme component map
2. merges any incoming MDX component overrides
3. wraps every function component except `wrapper`

`wrapper` is intentionally skipped because it is the page shell rather than a leaf MDX render node.

## Replacement Algorithm

`wrapDynamicContentComponent()` reads the request scope via `getDynamicContentScope()`.

If no scope is active:

- the original component is rendered with the original props

If a scope is active:

1. every prop is inspected
2. `children` are handled through a dedicated path
3. all other values are processed recursively
4. the original props object is reused when no values changed

The recursive logic in `replaceDynamicContentValue()` handles:

- strings: token replacement
- primitives and functions: returned unchanged
- arrays: recursively transformed item-by-item
- React elements: cloned only when one of their props changes
- plain objects: recursively transformed by enumerable entries

## Children And Key Stability

MDX and syntax highlighting can emit arrays of adjacent React nodes, especially spans.
When token replacement changes any item in such an array, React may treat the rebuilt result as a
dynamic list.

To avoid key warnings, `children` are not processed through the generic array path.
They go through `replaceDynamicContentChildren()`, which uses `Children.map()`.

That detail matters in two places:

- top-level wrapped component props
- nested props inside cloned React elements

The current implementation also preserves identity aggressively:

- unchanged child arrays fall back to the original `children`
- unchanged elements are returned without cloning
- unchanged wrapped component props fall back to the original props object

These behaviors reduce unnecessary React churn during MDX rendering.

## Token Parsing

Token parsing is implemented in `replaceDynamicContentTokens()`.

The supported formats are:

- `%%token.path%%`
- URL-encoded `%25%25token.path%25%25`
- partially encoded `%25%token.path%25%25`-style text emitted from some href contexts

The code first normalizes encoded forms back to `%%...%%`, then applies:

```ts
/(?:%%|%25%25)([a-zA-Z0-9_.]+)(?:%%|%25%25)/g;
```

For each token:

1. split the token path on `.`
2. walk the request scope object
3. require every segment to exist on a plain object
4. require the resolved value to be a string

Failure cases throw immediately during server render:

- invalid token path
- non-string resolved token value

This is intentional because unresolved tokens indicate invalid content or invalid scope construction.

## URL-Encoding Edge Case

MDX links can encode `%` characters inside href attributes, which means a source link like:

```mdx
[package.json](https://unpkg.com/%%adapter.packageName%%/package.json)
```

may reach the runtime as encoded token text rather than the original literal token.

The implementation normalizes both fully encoded and partially encoded variants before resolving the
token. That is what allows `unpkg` links and similar URLs to resolve correctly at render time.

## Historical Notes

The current runtime approach replaced an earlier compile-time/recompilation direction.

The runtime design was chosen because it:

- avoids recompiling MDX per request
- keeps static pages untouched
- resolves request-specific values during SSR
- avoids hydration flicker because replacement happens before HTML is sent

## Practical Rules For Future Changes

When extending this system:

1. keep new token values string-renderable unless the rendering contract changes deliberately
2. add new top-level scope namespaces intentionally, since tokens resolve by dot-path
3. preserve the dedicated `children` handling unless there is a stronger replacement backed by
   validation against MDX-highlighted output
4. dynamic behavior is detected automatically via `hasDynamicContent(sourceCode)` so static pages
   retain default Nextra rendering behavior without any opt-in flags
