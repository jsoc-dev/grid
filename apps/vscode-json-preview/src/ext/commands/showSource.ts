import { previewPanelStore } from "#ext/panels/PreviewPanelStore.ts";
import * as vscode from "vscode";

export function handleShowSource() {
  const activePreview = previewPanelStore.findActive();

  // defensive check; "when" condition ensures that this command is executed only when there is an active json preview
  if (!activePreview)
    return void vscode.window.showWarningMessage("No active preview found.");

  vscode.window.showTextDocument(activePreview.document, {
    viewColumn: activePreview.sourceViewColumn,
    preserveFocus: false,
  });
}
