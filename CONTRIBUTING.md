# Guidelines for JSOC Packages

## @jsoc/core

- COMMIT NAMING CONVENTIONS
  - Include prefix `[core]`. With optional secondary identifier followed by `/`. Example: `[core/grid]`

- Must stay framework-agnostic

---

## @jsoc/react

- COMMIT NAMING CONVENTIONS
  - Include prefix `[react]`. With optional secondary identifier followed by `/`. Example: `[react/grid]`

- FILE NAMING CONVENTIONS
  - Public components:
    - Always prefixed with Jsoc\*
    - Example: JsocGrid

  - Internal adapters:
    - Wrapper Component Name + Adapter Component Short Name
    - Examples: JsocGridMui, JsocGridAg

---
