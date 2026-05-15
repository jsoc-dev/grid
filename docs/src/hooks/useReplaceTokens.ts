import { useRootContext } from "@/contexts/RootContext";
import { isValidElement, cloneElement, ReactElement } from "react";
import type { ReactNode } from "react";
import type { RootContextValue } from "@/contexts/RootContext";
import { isString } from "@jsoc/utils";
import {
  type PluginMetadataProperty,
  type PluginId,
  getPluginMetadata,
} from "@jsoc/grid-docs";
import { formatValue } from "@/components/docs/format-value";

const FRAMEWORK_ID = "react-grid" as const;

export function useReplaceTokens(children: ReactNode) {
  const rootContextValue = useRootContext();

  return replaceTokens(children, rootContextValue);
}

function replaceTokens(
  children: ReactNode,
  rootContextValue: RootContextValue,
): ReactNode {
  if (isString(children)) {
    return children.replace(
      // match ${abcd} globally
      /\${[a-zA-Z.]+}/g,
      // for each matched value, get replacement value
      (match) => {
        const token = cleanToken(match);
        return getReplacementValue(token, rootContextValue);
      },
    );
  }

  if (Array.isArray(children)) {
    return children.map((child, index) => {
      const transformed = replaceTokens(child, rootContextValue);

      // Preserve existing key if element
      if (isValidElement(transformed)) {
        return transformed.key != null
          ? transformed
          : cloneElement(transformed, { key: index });
      }

      return transformed;
    });
  }

  if (isValidElement(children) && "props" in children) {
    const element = children as ReactElement<{ children?: ReactNode }>;

    return cloneElement(element, {
      ...element.props,
      children: replaceTokens(element.props.children, rootContextValue),
    });
  }

  return children;
}

function getReplacementValue(
  token: string,
  rootContextValue: RootContextValue,
): string {
  const { selectedPluginId } = rootContextValue;

  if (!(token.includes(".") && token.startsWith("plugin."))) {
    return revertCleanToken(token);
  }

  const parts = token.split(".");

  if (parts.length != 2) {
    throw new Error(
      `Invalid token "${token}": Too many "${parts}" after "${parts[0]}"`,
    );
  }

  const [main, sub] = parts;

  if (main !== "plugin") {
    return revertCleanToken(token);
  }

  return (
    getValueForPluginMetaKey(selectedPluginId, sub as PluginMetadataProperty) ||
    ""
  );
}

function getValueForPluginMetaKey(
  pluginId: PluginId<"react-grid">,
  property: PluginMetadataProperty,
): string {
  const metadata = getPluginMetadata(FRAMEWORK_ID, pluginId);
  return formatValue(metadata[property]);
}

const OPENING_CURLY_BRACE = "{";
const CLOSING_CURLY_BRACE = "}";
const DOLLAR_SYMBOL = "$";

// removes braces from the token
function cleanToken(token: string) {
  let result = token;

  if (result.startsWith(DOLLAR_SYMBOL)) {
    result = result.slice(1);
  }

  if (result.startsWith(OPENING_CURLY_BRACE)) {
    result = result.slice(1);
  }

  if (result.endsWith(CLOSING_CURLY_BRACE)) {
    result = result.slice(0, -1);
  }

  return result;
}

// adds back the brackes to the token
function revertCleanToken(token: string) {
  let result = token;

  if (!result.startsWith(DOLLAR_SYMBOL)) {
    result = DOLLAR_SYMBOL + result;
  }

  if (!result.startsWith(OPENING_CURLY_BRACE)) {
    result = OPENING_CURLY_BRACE + result;
  }

  if (!result.endsWith(CLOSING_CURLY_BRACE)) {
    result = result + CLOSING_CURLY_BRACE;
  }

  return result;
}
