# ABOUT THIS DOCUMENT
- This document contains the complete context for the JSOC library project.  


## PURPOSE
- JSOC is a library that converts any JSON configuration into a fully functional UI component.

## GOALS
- UI component driven entirely by JSON
- configurations generation on the fly
- UI automatically adapts to JSON changes
- Cross framework
- Supports React now, later Vue, Angular, Svelte
- Adapter-based architecture for UI libraries (eg: for react, grid adapters includes MUI, AG Grid)



##  CORE CONCEPT

JSOC treats JSON as the single source of truth.

Pipeline:
1. Parsing = normalize JSON
2. Resolution = map to framework-independent schema
3. Adapter integration = generate configurations based on component library like MUI, shadCn, AG Grid, etc.
4. Rendering = React/Vue/Angular component output


##  HIGH LEVEL ARCHITECTURE

A. Core Layer (packages/@jsoc/core)
- Framework-agnostic logic
- No React/Vue/DOM code
- Parser, resolver, schema types, utilities

B. Framework Layer (packages/@jsoc/react)
- Converts schema nodes into React components  
- Handles props mapping
- Provides JsocGrid, JsocChart, JsocForm

C. Adapter Layer
Example: grid adapters
- mui
- ag-grid
- tanstack

Example: chart adapters
- recharts
- nivo



##  MONOREPO STRUCTURE

jsoc/
packages/
  @jsoc/core/
  @jsoc/react/
examples/
  react-basic/
  grid-showcase/
  chart-showcase/
docs/
  FOLDER_STRUCTURE.md
  ARCHITECTURE.md
  CONTRIBUTING.md
  ROADMAP.md

- For DETAILED FOLDER STRUCTURE, refer FOLDER-STRUCTURE.md



## NAMING CONVENTIONS
Public components:
- Always prefixed with Jsoc*
- Examples: JsocGrid, JsocChart, JsocForm

Internal adapters:
- No prefix
- Examples: MUIGridAdapter, AGGridAdapter, RechartsAdapter

Core logic:
- Must stay framework-agnostic


## EXAMPLES

examples/ folder will contain real working apps.

Used for:
- Development testing
- Demo showcase on website later
- Framework verification
- Adapter behavior testing

Examples are PNPM workspace packages:
- react-examples
- grid-showcase
- chart-showcase


==================================================
8. DOCUMENTATION STRATEGY
==================================================

Documentation is stored in /docs.

docs/
  FOLDER_STRUCTURE.md
  ARCHITECTURE.md
  CONTRIBUTING.md
  ROADMAP.md

Later, a website/ folder will host a docs site (Next.js, VitePress, or Docusaurus).


## DEVELOPMENT WORKFLOW

Current phase:
- Use PNPM workspace only
- No build step required yet
- Use raw TypeScript imports
- Focus on core and react packages

Later:
- Add jsoc-vue and jsoc-angular
- Add turborepo for builds
- Add website for documentation


==================================================
10. KEY DESIGN DECISIONS
==================================================

- Monorepo enabled using PNPM
- Core remains pure TypeScript (no UI)
- Adapter-based UI layer
- Public components prefixed with Jsoc
- Examples reused for docs site
- Clean modular architecture
- Late integration of turborepo


==================================================
11. ROADMAP
==================================================

Phase 1 (Now)
- Build core parser and resolver
- Build JsocGrid
- Build MUIGridAdapter, AGGridAdapter, TanStack adapter
- Build JsocChart with Recharts and Nivo adapters
- Build JsocForm with MUI and Headless adapters
- Setup examples: react-basic, grid-showcase, chart-showcase

Phase 2
- Stabilize API
- Write documentation
- Build website

Phase 3
- Create jsoc-vue and jsoc-angular packages
- Implement cross-framework adapters

Phase 4
- Layout engine
- Dynamic schema injection
- Server-driven UI integration
- Visual schema editor


==================================================
12. TO-DO LIST (ACTIONABLE)
==================================================

Core:
- Implement parseSchema
- Implement normalize
- Implement resolveNode
- Implement schema types

React:
- Create JsocGrid
- Implement adapter selection logic
- Build MUI, AG Grid, TanStack adapters
- Build JsocChart and JsocForm
- Create hooks: useJsoc, useAdapter

Examples:
- Create react-basic
- Create grid-showcase
- Create chart-showcase

Docs:
- Fill FOLDER_STRUCTURE.md
- Fill ARCHITECTURE.md
- Fill CONTRIBUTING.md
- Fill ROADMAP.md


==================================================
13. INSTRUCTIONS FOR COPILOT CHAT
==================================================

When generating code, Copilot should:
- Follow the architecture described
- Keep core UI-agnostic
- Place adapters inside correct folders
- Prefix public components with Jsoc
- Use strict TypeScript
- Keep parsing and resolving modular
- Avoid mixing UI logic into core
- Import core using workspace alias
- Produce framework-specific code only inside @jsoc/react
- Use examples folder for demos and testing
- Maintain consistency with JSOC_CONTEXT.md


==================================================
14. DOCUMENTATION WEBSITE STRATEGY
==================================================

JSOC will include a full documentation + examples + demos website inside the SAME monorepo.

Folder name for documentation website:
website/

Reasoning:
- Documentation must version together with the code.
- The website will import real examples from the examples folder.
- Allows instant updates to examples and pages in one PR.
- Easier monorepo deployment (Vercel, Netlify).
- Avoids maintaining a second repository.
- Industry standard (MUI, Chakra, TanStack, Next.js, Vite).

Final structure:

jsoc/
packages/
  @jsoc/core/
  @jsoc/react/
examples/
  react-basic/
  grid-showcase/
  chart-showcase/
docs/
  FOLDER_STRUCTURE.md
  ARCHITECTURE.md
  CONTRIBUTING.md
  ROADMAP.md
website/
  (Next.js, Docusaurus, VitePress, or Astro app)

The website should also be a PNPM workspace package so it can directly import:
- @jsoc/core
- @jsoc/react
- example apps from /examples

Add this to pnpm-workspace.yaml:
- "website"

Purpose of website:
- Host documentation
- Provide interactive examples
- Provide UI component demos
- Provide JSON-to-UI playground
- Serve as JSOC’s official reference site

The website will reuse example applications instead of duplicating code.
Examples are written once and used both during development and on the documentation site.
