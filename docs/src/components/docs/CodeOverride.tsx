"use client";

import type { ComponentProps } from "react";
import { useReplaceTokens } from "@/hooks/useReplaceTokens";
import {
  defaultThemeComponents,
  type DefaultThemeComponents,
} from "@/mdx-components";

export function CodeOverride(
  props: ComponentProps<DefaultThemeComponents["code"]>,
) {
  const children = useReplaceTokens(props.children);

  return (
    <defaultThemeComponents.code {...props}>
      {children}
    </defaultThemeComponents.code>
  );
}
