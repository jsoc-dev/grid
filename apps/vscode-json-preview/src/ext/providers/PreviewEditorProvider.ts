import { ViewType } from "#ext/constants.ts";
import { PreviewPanel } from "#ext/panels/PreviewPanel.ts";
import type { JSONDocument } from "#ext/utils/document.ts";
import * as vscode from "vscode";

export class PreviewEditorProvider implements vscode.CustomTextEditorProvider {
  public static readonly viewType = ViewType.PreviewEditor;

  readonly #extensionUri: vscode.Uri;

  constructor(extensionUri: vscode.Uri) {
    this.#extensionUri = extensionUri;
  }

  public async resolveCustomTextEditor(
    document: JSONDocument, // customEditors selector guarantees only json/jsonc files reach this provider
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken,
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.#extensionUri],
    };

    webviewPanel.iconPath = {
      light: vscode.Uri.joinPath(
        this.#extensionUri,
        "media",
        "preview-light.svg",
      ),
      dark: vscode.Uri.joinPath(
        this.#extensionUri,
        "media",
        "preview-dark.svg",
      ),
    };

    new PreviewPanel(webviewPanel, document, this.#extensionUri);
  }
}
