import {
  resolveDeclarationKindText,
  DeclarationKind,
} from "@/utils/api/api-declaration";

export function getExportSectionTitle(kind: DeclarationKind) {
  return resolveDeclarationKindText(kind, {
    [DeclarationKind.Class]: "Classes",
    [DeclarationKind.Function]: "Functions",
    [DeclarationKind.Composable]: "Composables",
    [DeclarationKind.Hook]: "Hooks",
    [DeclarationKind.Type]: "Types",
    [DeclarationKind.Other]: "Others",
    [DeclarationKind.Unresolved]: "In Progress",
  });
}
