import { isJsonDocument, type JSONDocument } from "#ext/utils/document.ts";

import * as vscode from "vscode";

export type JSONEditor = vscode.TextEditor & {
  document: JSONDocument;
};

export function getJsonEditorOrWarn(): JSONEditor | undefined {
  const editor = vscode.window.activeTextEditor;

  if (!editor)
    return void vscode.window.showWarningMessage(`No active editor.`);

  if (!isJsonDocument(editor.document))
    return void vscode.window.showWarningMessage(`Active file is not JSON.`);

  return editor as JSONEditor;
}
