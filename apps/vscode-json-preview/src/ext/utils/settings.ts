import { EXTENSION_NAME } from "#ext/constants.ts";
import {
  ExtensionSettingId,
  type ExtensionSettings,
} from "#shared/extension-settings.ts";

import * as vscode from "vscode";

export function getExtensionSettings(): ExtensionSettings {
  const extensionCfg = vscode.workspace.getConfiguration(EXTENSION_NAME);
  return {
    [ExtensionSettingId.DoubleClickToSwitchToEditor]: extensionCfg.get(
      ExtensionSettingId.DoubleClickToSwitchToEditor,
    ),
  };
}
