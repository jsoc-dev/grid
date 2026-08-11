import { ViewType } from "#ext/constants.ts";
import { getWebviewHtml } from "#ext/utils/webview.ts";
import { toJsonFile, type JSONDocument } from "#ext/utils/document.ts";
import { uriToFileName, isEqualUri } from "#ext/utils/uri.ts";
import type { HostMessage } from "#shared/types.ts";
import * as vscode from "vscode";

const DEBOUNCE_MS = 200;

export class PreviewPanel {
  public static create(
    document: JSONDocument,
    extensionUri: vscode.Uri,
    viewColumn: vscode.ViewColumn,
    sourceViewColumn?: vscode.ViewColumn,
  ) {
    const panel = vscode.window.createWebviewPanel(
      ViewType.PreviewPanel,
      getPanelTitle(document),
      viewColumn,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [extensionUri],
      },
    );
    panel.iconPath = getPanelIconPath(extensionUri);

    return new PreviewPanel(panel, document, extensionUri, sourceViewColumn);
  }

  public readonly panel: vscode.WebviewPanel;
  public readonly document: JSONDocument;
  public readonly sourceViewColumn?: vscode.ViewColumn;

  readonly #extensionUri: vscode.Uri;
  #workspaceSubscription: vscode.Disposable;
  #pendingUpdate: NodeJS.Timeout | undefined;

  constructor(
    panel: vscode.WebviewPanel,
    document: JSONDocument,
    extensionUri: vscode.Uri,
    sourceViewColumn?: vscode.ViewColumn,
  ) {
    this.panel = panel;
    this.document = document;
    this.sourceViewColumn = sourceViewColumn;
    this.#extensionUri = extensionUri;

    this.panel.webview.html = getWebviewHtml(
      this.panel.webview,
      this.#extensionUri,
      toJsonFile(document),
    );

    // subsribe to workspace document changes
    this.#workspaceSubscription = vscode.workspace.onDidChangeTextDocument(
      (e) => this.#onWorkspaceDocumentChanged(e),
    );

    this.panel.onDidDispose(() => this.#cleanup());
  }

  sendMessage(message: HostMessage) {
    this.panel.webview.postMessage(message);
  }

  sendUpdateMessage() {
    this.sendMessage({
      type: "update",
      file: toJsonFile(this.document),
    });
  }

  #onWorkspaceDocumentChanged(e: vscode.TextDocumentChangeEvent) {
    if (isEqualUri(e.document.uri, this.document.uri)) {
      this.#onDocumentChanged();
    }
  }

  #onDocumentChanged() {
    // discard previous pending update
    this.#pendingUpdate?.close();

    // schedule a new update
    this.#pendingUpdate = setTimeout(
      () => this.sendUpdateMessage(),
      DEBOUNCE_MS,
    );
  }

  #cleanup() {
    // stop listening to workspace changes
    this.#workspaceSubscription.dispose();

    // discard pending update
    this.#pendingUpdate?.close();
  }
}

function getPanelTitle(document: vscode.TextDocument) {
  return `Preview ${uriToFileName(document.uri)}`;
}

function getPanelIconPath(extensionUri: vscode.Uri) {
  return {
    light: vscode.Uri.joinPath(extensionUri, "media", "preview-light.svg"),
    dark: vscode.Uri.joinPath(extensionUri, "media", "preview-dark.svg"),
  };
}
