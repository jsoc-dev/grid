import { ViewType } from "#ext/constants.ts";
import { PreviewPanel } from "#ext/panels/PreviewPanel.ts";
import type { JSONDocument } from "#ext/utils/document.ts";
import { getWebviewIconPath } from "#ext/utils/webview.ts";

import type * as vscode from "vscode";

export class PreviewEditorProvider implements vscode.CustomTextEditorProvider {
  public static readonly viewType = ViewType.PreviewEditor;

  readonly #extensionUri: vscode.Uri;

  constructor(extensionUri: vscode.Uri) {
    this.#extensionUri = extensionUri;
  }

  public resolveCustomTextEditor(
    document: JSONDocument, // customEditors selector guarantees only json/jsonc files reach this provider
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken,
  ): void {
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.#extensionUri],
    };

    webviewPanel.iconPath = getWebviewIconPath(this.#extensionUri);

    new PreviewPanel(webviewPanel, document, this.#extensionUri);
  }
}
