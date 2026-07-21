import type { MetaJsonFile, PageMapItem } from "nextra";
import { getApiExports } from "./get-api-exports";
import { Node } from "ts-morph";

type ApiPageMapItem =
  | { type: "separator"; title: string; name: string }
  | { name: string; route: string; title: string };

function createMetaItem(pageMap: ApiPageMapItem[]): MetaJsonFile {
  return {
    data: {
      index: "Overview",
      ...Object.fromEntries(
        pageMap.map((o) => {
          if ("type" in o && o.type === "separator") {
            return [o.name, { type: "separator", title: o.title }];
          }
          return [o.name, o.title || ""];
        }),
      ),
    },
  };
}

export function generateApiPageMap(): PageMapItem[] {
  const apiExports = getApiExports();

  const classes = apiExports.filter((e) =>
    Node.isClassDeclaration(e.declaration),
  );
  const functions = apiExports.filter((e) =>
    Node.isFunctionDeclaration(e.declaration),
  );
  const types = apiExports.filter(
    (e) =>
      Node.isTypeAliasDeclaration(e.declaration) ||
      Node.isInterfaceDeclaration(e.declaration),
  );

  const apiPageMap: ApiPageMapItem[] = [];

  if (classes.length > 0) {
    apiPageMap.push({ type: "separator", title: "Classes", name: "_classes" });
    classes.forEach((e) => {
      apiPageMap.push({
        name: e.name,
        route: `/api/${e.name}`,
        title: e.name,
      });
    });
  }

  if (functions.length > 0) {
    apiPageMap.push({
      type: "separator",
      title: "Functions",
      name: "_functions",
    });
    functions.forEach((e) => {
      apiPageMap.push({
        name: e.name,
        route: `/api/${e.name}`,
        title: e.name,
      });
    });
  }

  if (types.length > 0) {
    apiPageMap.push({ type: "separator", title: "Types", name: "_types" });
    types.forEach((e) => {
      apiPageMap.push({
        name: e.name,
        route: `/api/${e.name}`,
        title: e.name,
      });
    });
  }

  return [
    createMetaItem(apiPageMap) as unknown as PageMapItem,
    {
      route: "/api",
      name: "index",
      title: "Overview",
    } as unknown as PageMapItem,
    ...(apiPageMap as unknown as PageMapItem[]),
  ];
}
