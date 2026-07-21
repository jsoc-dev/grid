import { ApiDoc } from "@/components/api/api-doc";
import { wrapDynamicContentComponent } from "@/utils/dynamicContent";
import { useMDXComponents as getThemeComponents } from "nextra-theme-docs";
import type { MDXComponents } from "nextra/mdx-components";
import type { ComponentType } from "react";

const themeComponents = getThemeComponents();
const customComponents = { ApiDoc };

/**
 * This function is automatically picked up by Nextra and invoked during MDX rendering
 * for getting the MDX components map.
 *
 * @param components - Optional MDX component overrides supplied by the MDX runtime,
 *                     usually `undefined` in Nextra apps.
 */
export function useMDXComponents(components?: MDXComponents) {
  const mdxComps = { ...themeComponents, ...customComponents, ...components };
  const mdxCompEntries = Object.entries(mdxComps);

  const wrappedCompEntries = mdxCompEntries.map(([key, val]) =>
    key === "wrapper" || typeof val !== "function"
      ? [key, val]
      : [key, wrapDynamicContentComponent(val as ComponentType)],
  );

  const wrappedComps = Object.fromEntries(wrappedCompEntries);

  return wrappedComps as typeof mdxComps;
}

export const getMDXComponents = useMDXComponents;
