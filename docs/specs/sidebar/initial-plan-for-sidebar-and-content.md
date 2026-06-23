## Sidebar

There will be 3 menu groups in the sidebar:

1. At the top, there will be [DropdownArea](./src/components/docs/DropdownArea.tsx), which will contain two dropdowns: AdapterSelector and the PluginSelector. Based on the value of these two dropdowns, the adapter/plugin related menus (menu group 3) needs to be displayed. These dropdowns can work in either of below approaches:

- Current Approach: Maintains a [RootContext](./src/contexts/RootContext.ts) and the dropdowns reads and updates these 2 states (selectedAdapterId and selectedPluginId) from this context

- Recommended: These dropdowns will read or update URL. For example: If current URL is ./docs/react-grid/ag, then dropdowns will infer that selected adapter is `react-grid` and selected plugin is `ag`. This approach is also used in @docs/src/app/examples/[[...path]]/page.tsx:26-62

2. Static menus for framework agnostic content: Some shared (framework/plugin agnostic) menu items and their content will be always visible irrespective of current seleted adapter or plugin. For example: grid-core package guides just like tanstack has for table-core https://tanstack.com/table/latest/docs/guide/data

3. Dynamic menus based on current selected adapter/plugin: These menus will be based on the selected adapter/plugin. Even in this category, some menus can be common. For example: Getting Started menu will be always there for all adapter/plugin. But there can be some menus which are only available for particular adapter/plugin. These menus will be based on the files present in the @docs/src/content/react-grid / @docs/src/content/vanilla-grid / @docs/src/content/vue-grid.

Whether group 3 should come before group 2 is debatable and not final yet.

## Rendering content

Below two approaches we can use for rendering dynamic content based on selected adapter/plugin:

1. Merging Shared content + Particular content: Nextra and MDX support importing one MDX file into another MDX file. So suppose we are writing Getting Started page for all the adapter/plugins, then there will be some common content which we can keep in \_shared/getting-started.mdx and then on particular page like react-grid/getting-started.mdx, we will import shared file in it and append particular content for react-grid.

2. Using compoents like [SelectedPlugin](./src/components/docs/SelectedPlugin.tsx) for render dynamic content and toggling content dynamically using [If component](./src/components/docs/If.tsx). This is similar to AG Grid docs pattern https://github.com/ag-grid/ag-grid/blob/latest/documentation/ag-grid-docs/src/content/docs/getting-started/index.mdoc

3. Or any other approach which I am missing.

## Current concerns:

1. Currently, the sidebar (attached SS) has multiple menus which should not be there. Instead of 3 nested menus (React Grid, Vanilla Grid, Vue Grid), there should be only menus of only either 1 adapter. If react-grid is selected in AdapterDropdown, then menus for react-grid should show only.

2. How will we achieve Sidebar 3 menugroups?

- If we make react-grid/vue-grid/vanilla-grid folders as "type": "page" in [meta file](./src/app/_meta.global.tsx) then they do get hidden from sidebar but then act as different pages, and will require duplicating shared files for making static menus to appear.
- If we don't make make them "type": "page", then they all appear irrespective of what adapter selected.
