import { EXTENSION_DISPLAY_NAME } from "#ext/constants.ts";
import { getNonce } from "#ext/utils/nonce.ts";
import { getWebviewUri, getMediaUri } from "#ext/utils/uri.ts";
import { getExtensionSettings } from "#ext/utils/settings.ts";
import {
  INITIAL_JSON_FILE_GLOBAL,
  INITIAL_EXTENSION_SETTINGS_GLOBAL,
} from "#shared/constants.ts";
import type { JSONFile } from "#shared/host-message.ts";
import webviewHtml from "#ui/webview.html";
import * as vscode from "vscode";

const getUri = getWebviewUri;

export function getWebviewHtml(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  file: JSONFile,
) {
  let html = webviewHtml;

  const templateVars = getTemplateVars(webview, extensionUri, file);
  for (const [key, value] of Object.entries(templateVars)) {
    html = html.replaceAll(`{{${key}}}`, value);
  }

  return html;
}

function getTemplateVars(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  file: JSONFile,
) {
  const nonce = getNonce();
  const settings = getExtensionSettings();

  return {
    cspSource: webview.cspSource,
    initialScripts: `window.${INITIAL_JSON_FILE_GLOBAL}=${serializeJsonFileForScript(file)};window.${INITIAL_EXTENSION_SETTINGS_GLOBAL}=${JSON.stringify(settings)};`,
    nonce,
    styleUri: getUri(webview, extensionUri, ["dist", "webview.css"]).toString(),
    scriptUri: getUri(webview, extensionUri, ["dist", "webview.js"]).toString(),
    title: EXTENSION_DISPLAY_NAME,
  };
}

function serializeJsonFileForScript(file: JSONFile) {
  return JSON.stringify(file).replaceAll("<", "\\u003c");
}

export function getWebviewIconPath(extensionUri: vscode.Uri) {
  return {
    light: getMediaUri(extensionUri, "preview-light.svg"),
    dark: getMediaUri(extensionUri, "preview-dark.svg"),
  };
}
