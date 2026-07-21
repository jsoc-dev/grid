import { getApiExports } from "@/utils/api/get-api-exports";
import {
  API_PACKAGES,
  type ApiPackageName,
  getPackageDisplayName
} from "@/utils/api/api-package-name";
import type {
  Folder,
  MdxFile,
  MetaJsonFile,
  MetaRecord,
  PageMapItem,
  SeparatorItem,
} from "nextra";
import { Node } from "ts-morph";

type MdxFileExtended = MdxFile & { title?: string };
type SeparatorMeta = SeparatorItem & { name: string; title: string };
type ApiPageMapItem = SeparatorMeta | MdxFileExtended;

export function generateApiPageMap(): PageMapItem[] {
  // faking _meta.json file (which tells Nextra what order to put things in the sidebar and what their display titles are).
  const metaJsonFile: MetaJsonFile = {
    // This acts exactly like a _meta.json file. Nextra uses this object strictly for sorting and labeling. By putting index: "Overview" first, we guarantee that the "Overview" link will always be pinned to the absolute top of the sidebar, above all the API packages.
    data: {
      index: "Overview",
      // ...Object.fromEntries(API_PACKAGES.map((pkg) => [pkg, pkg])),
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

  // dynamically generate folder for each package. This acts exactly like a folder containing mdx files and _meta.json.
  const folders: Folder[] = API_PACKAGES.map((p) =>
    generateFolderForPackage(p),
  );

  return [metaJsonFile, indexMdxFile, ...folders];
}

function generateFolderForPackage(packageName: ApiPackageName): Folder {
  const apiExports = getApiExports(packageName);
  const classExports = apiExports.filter((e) =>
    Node.isClassDeclaration(e.declaration),
  );
  const functionExports = apiExports.filter((e) =>
    Node.isFunctionDeclaration(e.declaration),
  );
  const typeExports = apiExports.filter(
    (e) =>
      Node.isTypeAliasDeclaration(e.declaration) ||
      Node.isInterfaceDeclaration(e.declaration),
  );

  const pageMapItem: ApiPageMapItem[] = [];

  if (classExports.length > 0) {
    pageMapItem.push({ type: "separator", title: "Classes", name: "_classes" });
    classExports.forEach((e) => {
      pageMapItem.push({
        name: e.name,
        route: `/api/${packageName}/${e.name}`,
        title: e.name,
      });
    });
  }

  if (functionExports.length > 0) {
    pageMapItem.push({ type: "separator", title: "Functions", name: "_funcs" });
    functionExports.forEach((e) => {
      pageMapItem.push({
        name: e.name,
        route: `/api/${packageName}/${e.name}`,
        title: e.name,
      });
    });
  }

  if (typeExports.length > 0) {
    pageMapItem.push({ type: "separator", title: "Types", name: "_types" });
    typeExports.forEach((e) => {
      pageMapItem.push({
        name: e.name,
        route: `/api/${packageName}/${e.name}`,
        title: e.name,
      });
    });
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
