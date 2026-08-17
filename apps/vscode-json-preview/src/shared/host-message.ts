import type { ExtensionSettings } from "#shared/extension-settings.ts";

export type JSONFile = {
  fileName: string;
  json: string;
};

export enum HostMessageType {
  DocumentUpdate = "document-update",
  SettingsUpdate = "settings-update",
}

export type HostDocumentUpdateMessage = {
  type: HostMessageType.DocumentUpdate;
  file: JSONFile;
};

export type HostSettingsUpdateMessage = {
  type: HostMessageType.SettingsUpdate;
  settings: ExtensionSettings;
};

/** Message sent from the extension host to the webview. */
export type HostMessage = HostDocumentUpdateMessage | HostSettingsUpdateMessage;
