import type { PageMapItem } from "nextra";
import { getPageMap as $getPageMap } from "nextra/page-map";
import { apiPageMap } from "./api/generate-api-page-map";

/**
 * It's consumed on every request — getPageMap is called for every page render
 * (it provides the sidebar structure). The API page map is eagerly computed
 * once in `generate-api-page-map.ts` to avoid redundant object construction.
 */
export const getPageMap: typeof $getPageMap = async (...args) => {
  const rootPageMap = await $getPageMap(...args);

  const modifiedPageMap = visitPageMap(rootPageMap, (item) => {
    if ("route" in item) {
      if (item.route === "/api") {
        return {
          ...item,
          children: apiPageMap,
        };
      }
    }
    return item;
  });

  return modifiedPageMap;
};

type PageMapVisitor = (item: PageMapItem) => PageMapItem;
// source: https://github.com/shuding/nextra/blob/main/docs/components/get-page-map.ts
function visitPageMap(
  pageMap: PageMapItem,
  visitor: PageMapVisitor,
): PageMapItem;
function visitPageMap(
  pageMap: PageMapItem[],
  visitor: PageMapVisitor,
): PageMapItem[];
function visitPageMap(
  pageMap: PageMapItem[] | PageMapItem,
  visitor: PageMapVisitor,
): PageMapItem[] | PageMapItem {
  if (Array.isArray(pageMap)) {
    return pageMap.map((item) => visitPageMap(item, visitor));
  }
  if ("children" in pageMap) {
    return visitor({
      ...pageMap,
      children: visitPageMap(pageMap.children, visitor),
    });
  }
  return visitor(pageMap);
}
