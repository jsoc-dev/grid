import { PreviewEditorProvider } from "#ext/providers/PreviewEditorProvider.ts";
import * as vscode from "vscode";

export async function handleReopenAsPreview() {
  await vscode.commands.executeCommand(
    "reopenActiveEditorWith",
    PreviewEditorProvider.viewType,
  );
}

export async function handleReopenAsSource() {
  await vscode.commands.executeCommand("reopenActiveEditorWith", "default");
}
