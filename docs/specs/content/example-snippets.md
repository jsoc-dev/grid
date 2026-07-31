# Single source for snippets

## The Examples folder

- [examples](../../../examples/) has nested folder structure to contain examples for all combinations of adapters and plugins.

- Instead of rewriting snippets in docs pages, we can just use source code of example apps.

## Exracting snippets from example apps

- The approach is to wrap the part of source code with region blocks (#region ... #endregion) with region id and optional description and then parse source code to exract the region blocks.

- Approaches:

1. To display the snippets, we can use the existing the token replacement architecture. The exracted snippets can be saved into the `DynamicContentScope` and the mdx page can use the token like `snippets.exampleId.regionId`. The `createDynamicContentScope` must resolve snippets as per current `DocsParams`.
   This approach might increase start up time due to excessive file reading.

2. A <Snippet> component declaratively show snippets: <Snippet exampleId="basic" regionId="import" />
   This approach is lazy loaded.

## Open to discuss

1. When to store snippets?

- During building examples? In the source-manifest.json ? This eliminates runtime overhead of extracting snippets in docsite but might make the manfiest too heavy
- During build time of mdxpage? One time extraction but can slow down the initial page load.
- On demand focused extraction in Server Component <Snippets /> ?

2. Read example app files again or use source manfiest?

- **Resolved:** server-side snippet extraction uses the bundled `example-manifests.json` artifact (see [build-artifacts.md](../build-artifacts.md)). Per-plugin `source-manifest.json` files under `docs/public/examples/` are still used by the client Code Explorer via `fetch`.

3. region id format

- I want to make it simple without specifying exampleId in region id. Examples #region import .... #endregion. We can use code explorer utils, to filter out relevant files per exampleId from source files. In case there are multiple relevant files, we can group all the regions per exampleId. For example: examples/basic/file1.ts and examples/basic/file2.ts, all the regions are grouped for "basic" example id. If there are common region ids, the latter overrides the former. (Though we will make sure there are no common region ids).

4.  Region block vs Custom markers

- Region blocks give us IDE code folding.
- But there is drawback: Some time we would want some part of region only to be included in snippet. For example: in Basic.tsx file currently we have below:

```ts
// #region import
import { AgGridReact } from "#components/AgGridReact.tsx";
import { basicJSON } from "@jsoc/grid-examples-core";
import { useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-ag";
// #endregion
```

this has some unneeded imports, actual snippet should show only 2 main imports. To do so, we will need to change the region boundary as below:

```ts
import { AgGridReact } from "#components/AgGridReact.tsx";
import { basicJSON } from "@jsoc/grid-examples-core";
// #region import
import { useGridStoreSelector } from "@jsoc/react-grid";
import { useGridStore } from "@jsoc/react-grid-ag";
// #endregion
```

but now it looks weird and semantic meaning of region is lost. We can't win both worlds here (semantic meaning + relevant snippet extraction)
