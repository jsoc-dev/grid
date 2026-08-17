import { CommandId, EXTENSION_NAME, ViewType } from "#ext/constants.ts";
import { ExtensionSettingId } from "#shared/extension-settings.ts";
import { HostMessageType, type HostMessage } from "#shared/host-message.ts";
import {
  WebviewMessageType,
  WebviewEvent,
  type WebviewMessage,
} from "#shared/webview-message.ts";
import { getExtensionSettings } from "#ext/utils/settings.ts";
import { getWebviewHtml, getWebviewIconPath } from "#ext/utils/webview.ts";
import { toJsonFile, type JSONDocument } from "#ext/utils/document.ts";
import { uriToFileName, isEqualUri } from "#ext/utils/uri.ts";
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
    panel.iconPath = getWebviewIconPath(extensionUri);

    return new PreviewPanel(panel, document, extensionUri, sourceViewColumn);
  }

  public readonly panel: vscode.WebviewPanel;
  public readonly document: JSONDocument;
  public readonly sourceViewColumn?: vscode.ViewColumn;

  /**
   * The URI of the directory containing the extension.
   * Used to resolve paths to webview resources (scripts, styles, media).
   */
  readonly #extensionUri: vscode.Uri;

  /**
   * A collection of disposables (e.g., event listeners for workspace and configuration changes).
   * These are cleaned up automatically when the panel is disposed.
   */
  #disposables: vscode.Disposable[] = [];

  /**
   * Stores the active timeout reference used to debounce "document-update" messages
   * sent to the webview. Prevents flooding the webview with messages during rapid typing.
   */
  #debouncedUpdateMessageTimeout: NodeJS.Timeout | undefined;

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

    // react when the webview sends a message
    this.panel.webview.onDidReceiveMessage((e) => this.#onMessage(e));

    this.#disposables.push(
      // react when any document changes in the workspace
      vscode.workspace.onDidChangeTextDocument((e) =>
        this.#onWorkspaceDocumentChanged(e),
      ),
      // react when any configuration changes in the workspace
      vscode.workspace.onDidChangeConfiguration((e) =>
        this.#onWorkspaceConfigurationChanged(e),
      ),
    );

    // react when the panel is disposed
    this.panel.onDidDispose(() => this.#cleanup());
  }

  sendMessage(message: HostMessage) {
    this.panel.webview.postMessage(message);
  }

  sendUpdateMessage() {
    this.sendMessage({
      type: HostMessageType.DocumentUpdate,
      file: toJsonFile(this.document),
    });
  }

  sendUpdateSettingsMessage() {
    this.sendMessage({
      type: HostMessageType.SettingsUpdate,
      settings: getExtensionSettings(),
    });
  }

  #onWorkspaceConfigurationChanged(e: vscode.ConfigurationChangeEvent) {
    if (e.affectsConfiguration(EXTENSION_NAME)) {
      this.sendUpdateSettingsMessage();
    }
  }

  #onWorkspaceDocumentChanged(e: vscode.TextDocumentChangeEvent) {
    if (isEqualUri(e.document.uri, this.document.uri)) {
      this.#onDocumentChanged();
    }
  }

  #onDocumentChanged() {
    // discard previous debounced message timeout
    this.#debouncedUpdateMessageTimeout?.close();

    // schedule a new message to notify the webview
    this.#debouncedUpdateMessageTimeout = setTimeout(
      () =>
        this.sendMessage({
          type: HostMessageType.DocumentUpdate,
          file: toJsonFile(this.document),
        }),
      DEBOUNCE_MS,
    );
  }

  #onMessage(message: WebviewMessage) {
    if (message.type === WebviewMessageType.Event) {
      if (message.event === WebviewEvent.DoubleClick) {
        if (
          getExtensionSettings()[ExtensionSettingId.DoubleClickToSwitchToEditor]
        ) {
          const command =
            this.panel.viewType === ViewType.PreviewEditor
              ? CommandId.ReopenAsSource
              : CommandId.ShowSource; // safer fallback

          vscode.commands.executeCommand(command);
        }
      }
    }
  }

  #cleanup() {
    for (const d of this.#disposables) {
      d.dispose();
    }

    // discard pending debounced message
    this.#debouncedUpdateMessageTimeout?.close();
  }
}

function getPanelTitle(document: vscode.TextDocument) {
  return `Preview ${uriToFileName(document.uri)}`;
}
