import type { WebviewMessage } from "#shared/webview-message.ts";
import type { WebviewApi as _WebviewApi } from "vscode-webview";

export interface WebviewApi extends _WebviewApi<unknown> {
  postMessage(message: WebviewMessage): void;
}

let api: WebviewApi | undefined;

export function getWebviewApi(): WebviewApi {
  api ??= acquireVsCodeApi();
  return api;
}
