import {
  Children,
  cloneElement,
  isValidElement,
  type ComponentType,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  getDynamicContentScope,
  type DynamicContentScope,
} from "@/utils/dynamicContentScope";
import {
  isNullOrUndefined,
  isPlainObject,
  isString,
  type StringKeyedObject,
} from "@jsoc/utils";

const DYNAMIC_CONTENT_TOKEN_REGEX =
  /(?:%%|%25%25)([a-zA-Z0-9_.]+)(?:%%|%25%25)/g;

export function hasDynamicContentTokens(sourceCode: string): boolean {
  return DYNAMIC_CONTENT_TOKEN_REGEX.test(sourceCode);
}

export function wrapDynamicContentComponent(
  Component: ComponentType<StringKeyedObject>,
) {
  /**
   * Wraps an MDX component so string tokens inside its props can be resolved
   * against the current dynamic content scope before render.
   */
  function DynamicContentComponent(props: StringKeyedObject) {
    const scope = getDynamicContentScope();

    if (!scope?.hasDynamicContent) {
      return <Component {...props} />;
    }

    const nextProps: StringKeyedObject = {};
    let hasChanges = false;

    for (const [key, value] of Object.entries(props)) {
      const replaced =
        key === "children"
          ? replaceDynamicContentChildren(value, scope)
          : replaceDynamicContentValue(value, scope);
      nextProps[key] = replaced.nextValue;
      hasChanges ||= replaced.hasChanges;
    }

    return <Component {...(hasChanges ? nextProps : props)} />;
  }

  DynamicContentComponent.displayName = `DynamicContent(${Component.displayName ?? Component.name ?? "Component"})`;

  return DynamicContentComponent;
}

/**
 * Recursively walks a prop value and replaces any dynamic-content tokens found
 * in strings, arrays, plain objects, or nested React elements.
 */
function replaceDynamicContentValue(
  value: unknown,
  scope: DynamicContentScope,
): { nextValue: unknown; hasChanges: boolean } {
  if (isString(value)) {
    const nextValue = replaceDynamicContentTokens(value, scope);
    return { nextValue, hasChanges: nextValue !== value };
  }

  if (
    isNullOrUndefined(value) ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "function"
  ) {
    return { nextValue: value, hasChanges: false };
  }

  if (Array.isArray(value)) {
    let hasChanges = false;
    const nextValue: unknown[] = [];

    for (let i = 0; i < value.length; i++) {
      const replaced = replaceDynamicContentValue(value[i], scope);
      hasChanges ||= replaced.hasChanges;
      nextValue.push(replaced.nextValue);
    }

    return { nextValue: hasChanges ? nextValue : value, hasChanges };
  }

  if (isValidElement(value)) {
    const { nextElement, hasChanges } = replaceDynamicContentElement(
      value,
      scope,
    );
    return { nextValue: nextElement, hasChanges };
  }

  if (typeof value === "object") {
    let hasChanges = false;
    const nextValue: StringKeyedObject = {};

    for (const [key, entry] of Object.entries(value)) {
      const replaced = replaceDynamicContentValue(entry, scope);
      nextValue[key] = replaced.nextValue;
      hasChanges ||= replaced.hasChanges;
    }

    return { nextValue, hasChanges };
  }

  return { nextValue: value, hasChanges: false };
}

/**
 * Rebuilds a React element only when one of its props or children changes
 * after dynamic-content token replacement.
 */
function replaceDynamicContentElement(
  element: ReactElement,
  scope: DynamicContentScope,
): { nextElement: ReactElement; hasChanges: boolean } {
  const props = element.props as StringKeyedObject;
  const nextProps: StringKeyedObject = {};
  let hasChanges = false;

  for (const [key, value] of Object.entries(props)) {
    const replaced =
      key === "children"
        ? replaceDynamicContentChildren(value, scope)
        : replaceDynamicContentValue(value, scope);
    nextProps[key] = replaced.nextValue;
    hasChanges ||= replaced.hasChanges;
  }

  if (!hasChanges) {
    return { nextElement: element, hasChanges: false };
  }

  return {
    nextElement: cloneElement(element, nextProps),
    hasChanges: true,
  };
}

/**
 * Preserves React child keys when token replacement needs to rebuild an array
 * of MDX children.
 */
function replaceDynamicContentChildren(
  children: unknown,
  scope: DynamicContentScope,
): { nextValue: unknown; hasChanges: boolean } {
  if (!Array.isArray(children)) {
    return replaceDynamicContentValue(children, scope);
  }

  // MDX/Shiki can emit adjacent spans for highlighted code. Once token
  // replacement rebuilds that child array, React treats it as a dynamic list,
  // so use Children.map to preserve/generated child keys.
  let hasChanges = false;
  const nextChildren = Children.map(children as ReactNode, (child) => {
    const replaced = replaceDynamicContentValue(child, scope);
    hasChanges ||= replaced.hasChanges;
    return replaced.nextValue as ReactNode;
  });

  return { nextValue: hasChanges ? nextChildren : children, hasChanges };
}

/**
 * Resolves %%token.paths%% inside text using the current dynamic-content scope,
 * including partially URL-encoded token markers.
 */
function replaceDynamicContentTokens(
  text: string,
  scope: DynamicContentScope,
): string {
  // Normalize URL-encoded tokens to handle partially encoded hrefs
  // Replace both %25%25 (fully encoded %%) and %25% (partially encoded %%)
  const normalizedText = text
    .replace(/%25%25/g, "%%") // Handle %25%25 (encoded %%)
    .replace(/%25%/g, "%%"); // Handle remaining %25% (partial encoding)

  const replacedText = normalizedText.replace(
    DYNAMIC_CONTENT_TOKEN_REGEX,
    (_match, tokenPath) => {
      const tokenParts = tokenPath.split(".");
      const resolvedValue = tokenParts.reduce(
        (currentValue: unknown, key: string): unknown => {
          if (!isPlainObject(currentValue) || !(key in currentValue)) {
            throw new Error(`Invalid token path: ${tokenPath}`);
          }

          return currentValue[key];
        },
        scope,
      );

      if (typeof resolvedValue !== "string") {
        throw new Error(
          `Resolved value for token '${tokenPath}' is not a string. It must be a string to be rendered at runtime.`,
        );
      }

      return resolvedValue;
    },
  );

  return replacedText;
}
