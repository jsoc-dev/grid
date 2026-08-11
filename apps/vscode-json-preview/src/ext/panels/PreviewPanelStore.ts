import { PreviewPanel } from "#ext/panels/PreviewPanel.ts";
import { type JSONEditor } from "#ext/utils/editor.ts";
import { isEqualUri } from "#ext/utils/uri.ts";
import * as vscode from "vscode";

export class PreviewPanelStore {
  readonly #panels = new Set<PreviewPanel>();

  createOrReveal(
    editor: JSONEditor,
    extensionUri: vscode.Uri,
    viewColumn: vscode.ViewColumn,
  ): void {
    const document = editor.document;
    const editorColumn = editor.viewColumn;
    // Resolve symbolic view columns for comparison
    const targetColumn = editorColumn
      ? viewColumn === vscode.ViewColumn.Beside
        ? editorColumn + 1
        : viewColumn === vscode.ViewColumn.Active
          ? editorColumn
          : viewColumn
      : viewColumn;

    const existingPreview = this.find(document.uri, targetColumn);

    if (existingPreview) {
      existingPreview.panel.reveal(viewColumn);
      return;
    }

    const preview = PreviewPanel.create(
      document,
      extensionUri,
      viewColumn,
      editorColumn,
    );
    this.#panels.add(preview);

    preview.panel.onDidDispose(() => {
      this.#panels.delete(preview);
    });
  }

  closeAll() {
    for (const preview of this.#panels) {
      preview.panel.dispose();
    }
  }

  find(documentUri: vscode.Uri, viewColumn?: vscode.ViewColumn) {
    for (const preview of this.#panels) {
      if (
        isEqualUri(preview.document.uri, documentUri) &&
        (!viewColumn || preview.panel.viewColumn === viewColumn)
      ) {
        return preview;
      }
    }
    return undefined;
  }

  findActive() {
    for (const preview of this.#panels) {
      if (preview.panel.active) {
        return preview;
      }
    }
    return undefined;
  }
}

export const previewPanelStore = new PreviewPanelStore();
