import type { ApiPackageName } from "@/utils/api/api-packages";
import { Node, type ExportedDeclarations } from "ts-morph";

export enum DeclarationKind {
  Hook = "hook",
  Composable = "composable",
  Function = "function",
  Class = "class",
  Type = "type",
  Other = "other",
  Unresolved = "unresolved",
}

export function resolveDeclarationKind(
  exportName: string,
  packageName: ApiPackageName,
  declaration: ExportedDeclarations | undefined,
): DeclarationKind {
  if (!declaration) return DeclarationKind.Unresolved;

  if (Node.isClassDeclaration(declaration)) {
    return DeclarationKind.Class;
  }

  if (
    Node.isTypeAliasDeclaration(declaration) ||
    Node.isInterfaceDeclaration(declaration)
  ) {
    return DeclarationKind.Type;
  }

  if (Node.isFunctionDeclaration(declaration)) {
    const isReactHook =
      exportName.startsWith("use") && packageName.includes("react-grid");
    if (isReactHook) return DeclarationKind.Hook;

    const isVueComposable =
      exportName.startsWith("use") && packageName.includes("vue-grid");
    if (isVueComposable) return DeclarationKind.Composable;

    return DeclarationKind.Function;
  }

  return DeclarationKind.Other;
}

export type DeclarationKindTextMap = Record<DeclarationKind, string>;

export function resolveDeclarationKindText(
  kind: DeclarationKind,
  customTexts?: Partial<DeclarationKindTextMap>,
) {
  const defaultTexts = {
    [DeclarationKind.Class]: "Class",
    [DeclarationKind.Function]: "Function",
    [DeclarationKind.Composable]: "Composable",
    [DeclarationKind.Hook]: "Hook",
    [DeclarationKind.Type]: "Type",
    [DeclarationKind.Other]: "Other",
    [DeclarationKind.Unresolved]: "Unresolved",
  } as const satisfies DeclarationKindTextMap;

  return customTexts?.[kind] ?? defaultTexts[kind];
}
