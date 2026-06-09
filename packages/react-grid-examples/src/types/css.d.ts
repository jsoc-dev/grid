/**
 * Side-effect CSS imports (e.g.
 * `import "@jsoc/grid-examples-shared/css/error-message.css"`) are handled by
 * the bundler at build time. TypeScript does not understand `.css` modules on
 * its own, and this package typechecks with plain `tsc` (without Vite's
 * `vite/client` types), so this ambient declaration is required for those
 * imports to typecheck.
 */
declare module "@jsoc/grid-examples-shared/css/*.css" {}
