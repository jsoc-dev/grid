import { useMDXComponents as getMDXComponents } from "@/mdx-components";
import { getRouteFromFilePath } from "@/utils/getRouteFromFilePath";
import type { PageMapItem } from "nextra";
import { Cards } from "nextra/components";
import { getIndexPageMap, getPageMap } from "nextra/page-map";
import type { FC } from "react";

export const Overview: FC<{
  filePath: string;
  route?: string;
  icons?: Record<string, FC>;
  pageMap?: PageMapItem[];
}> = async ({ filePath, route, icons, pageMap: $pageMap }) => {
  const { h2: H2 } = getMDXComponents();
  const currentRoute = route ?? getRouteFromFilePath(filePath);
  const pageMap = $pageMap ?? (await getPageMap(currentRoute));

  return getIndexPageMap(pageMap).map((pageItem, index) => {
    if (!Array.isArray(pageItem)) {
      return <H2 key={index}>{pageItem.title}</H2>;
    }

    const filteredPageItem = pageItem.filter((item) => item.name !== "index");

    return (
      <Cards key={index}>
        {filteredPageItem.map((item) => {
          const icon = item.frontMatter?.icon;
          const Icon = icons?.[icon];
          if (icon && !Icon) {
            throw new Error(
              `Icon "${icon}" is defined in front matter but isn't provided`,
            );
          }

          return (
            <Cards.Card
              key={item.name}
              // @ts-expect-error -- fixme
              title={item.title}
              // @ts-expect-error -- fixme
              href={item.route || item.href}
              icon={Icon && <Icon />}
            />
          );
        })}
      </Cards>
    );
  });
};
