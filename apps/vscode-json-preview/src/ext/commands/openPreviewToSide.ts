import { previewPanelStore } from "#ext/panels/PreviewPanelStore.ts";
import { getJsonEditorOrWarn } from "#ext/utils/editor.ts";

import * as vscode from "vscode";

export function handleOpenPreviewToSide(context: vscode.ExtensionContext) {
  const editor = getJsonEditorOrWarn();

  // defensive check; "when" condition ensures that this command is executed only when there is an active json editor
  if (!editor) return;

  previewPanelStore.createOrReveal(
    editor,
    context.extensionUri,
    vscode.ViewColumn.Beside,
  );
}
