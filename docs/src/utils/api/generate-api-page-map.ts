import { groupApiExportsByDeclarationKind } from "@/utils/api/api-exports";
import { DeclarationKind } from "@/utils/api/api-declaration";
import {
  type ApiPackageName,
  getPackageDisplayName,
  GROUPED_API_PACKAGE_NAMES,
  isValidPluginPackageForAdapter,
} from "@/utils/api/api-packages";
import { getExportSectionTitle } from "@/utils/api/api-package-index-page";
import type { ApiExport } from "@/utils/api/api-reference-types";
import type {
  Folder,
  MdxFile,
  MetaJsonFile,
  MetaRecord,
  PageMapItem,
  SeparatorItem,
} from "nextra";

type MdxFileExtended = MdxFile & { title?: string };
type SeparatorMeta = SeparatorItem & {
  name: string;
  title: string;
};
type ApiPageMapItem = SeparatorMeta | MdxFileExtended;

export function generateApiPageMap(): PageMapItem[] {
  const { corePackage, adapterPackages, pluginPackages } =
    GROUPED_API_PACKAGE_NAMES;

  const coreSeparator = createSeparatorItem("Core");
  const adapterSeparator = createSeparatorItem("Adapters");

  const pluginPackageGroups = adapterPackages.map((adapterPackage) => ({
    adapterPackage,
    separator: createSeparatorItem(
      `${getPackageDisplayName(adapterPackage)} Plugins`,
    ),
    plugins: pluginPackages.filter((pluginPackage) =>
      isValidPluginPackageForAdapter(pluginPackage, adapterPackage),
    ),
  }));

  // faking _meta.json file (which tells Nextra what order to put things in the sidebar and what their display titles are).
  const metaJsonFile: MetaJsonFile = {
    // This acts exactly like a _meta.json file. Nextra uses this object strictly for sorting and labeling. By putting index: "Overview" first, we guarantee that the "Overview" link will always be pinned to the absolute top of the sidebar, above all the API packages.
    data: {
      index: "Overview",

      [coreSeparator.name]: coreSeparator,
      [corePackage]: "Core",

      [adapterSeparator.name]: adapterSeparator,
      ...Object.fromEntries(adapterPackages.map((pkg) => [pkg, pkg])),

      ...Object.fromEntries(
        pluginPackageGroups.flatMap(({ separator, plugins }) => [
          [separator.name, separator],
          ...plugins.map((pkg) => [pkg, pkg]),
        ]),
      ),
    },
  };

  // faking index.mdx file
  const indexMdxFile: MdxFile = {
    // This acts exactly like an index.mdx or page.tsx file. Nextra uses this to know that there is actually a valid, clickable route at /api, and it contains the metadata for that page.
    name: "index",
    route: "/api",
    // @ts-expect-error - Nextra uses title dynamically at runtime even though it is not part of `MdxFile` type
    // As we generate this page map dynamically at runtime, we bypass Nextra's build-time `normalizePages`
    // algorithm (which normally hoists the title to the root). Therefore, we must manually attach
    // `title` to the root to prevent the React <Sidebar> from rendering a blank text node.
    title: "Overview",
  };

  return [
    metaJsonFile,
    indexMdxFile,

    coreSeparator,
    generateFolderForPackage(corePackage),

    adapterSeparator,
    ...adapterPackages.map(generateFolderForPackage),

    ...pluginPackageGroups.flatMap(({ separator, plugins }) => [
      separator,
      ...plugins.map(generateFolderForPackage),
    ]),
  ];
}

/** generates folder for index page of an api package and its api export pages */
function generateFolderForPackage(packageName: ApiPackageName): Folder {
  const exportsByKind = groupApiExportsByDeclarationKind(packageName);

  const pageMapItem: ApiPageMapItem[] = [];

  const exportGroups = Object.values(DeclarationKind).map((kind) => {
    const title = getExportSectionTitle(kind);
    return { title, exports: exportsByKind[kind] };
  });

  for (const { title, exports } of exportGroups) {
    if (exports.length > 0) {
      pageMapItem.push(createSeparatorItem(title));
      exports.forEach((e) => {
        pageMapItem.push(createApiPageMapItem(e));
      });
    }
  }

  const pageMapItemMetaTuples: Array<[string, MetaRecord | string]> =
    pageMapItem.map((item) => {
      const key = item.name;
      const value =
        "type" in item && item.type === "separator"
          ? { type: item.type, title: item.title }
          : item.title || "";

      return [key, value];
    });

  const metaJsonFile: MetaJsonFile = {
    data: Object.fromEntries(pageMapItemMetaTuples),
  };

  return {
    name: packageName,
    route: `/api/${packageName}`,
    children: [metaJsonFile, ...(pageMapItem as PageMapItem[])],
    // @ts-expect-error - Nextra uses title/frontMatter dynamically at runtime even though they aren't strictly on the base Folder interface
    title: getPackageDisplayName(packageName),
    frontMatter: { asIndexPage: true },
  };
}

function createSeparatorItem(title: string) {
  return {
    type: "separator" as const,
    title,
    name: `_${title.toLowerCase()}`,
    route: "", // dummy value to satisfy the `PageMapItem` type
  };
}

function createApiPageMapItem(e: ApiExport): ApiPageMapItem {
  return {
    name: e.name,
    route: `/api/${e.packageName}/${e.name}`,
    title: e.name,
  };
}
