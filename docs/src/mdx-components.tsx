import { CodeOverride } from "@/components/docs/CodeOverride";
import type { MDXComponents } from "nextra/mdx-components";
import { useMDXComponents as getThemeComponents } from "nextra-theme-docs";

export type DefaultThemeComponents = typeof defaultThemeComponents;

export const defaultThemeComponents = getThemeComponents();

const customOrOverrides = {
  code: CodeOverride,
};

/**
 * Composes the final MDX components map used to render MDX content.
 *
 * This function is automatically picked up by Nextra and invoked during MDX rendering.
 * It merges:
 * - Theme-provided components from `nextra-theme-docs`
 * - Optionally supplied MDX components (if any)
 * - Local custom overrides defined by the application
 *
 * @param components - Optional MDX component overrides supplied by the MDX runtime,
 *                     usually `undefined` in Nextra apps.
 */
export function useMDXComponents(components?: MDXComponents) {
  return {
    ...defaultThemeComponents,
    ...components,
    ...customOrOverrides,
  };
}
