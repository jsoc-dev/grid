import {
  INITIAL_EXTENSION_SETTINGS_GLOBAL,
  INITIAL_JSON_FILE_GLOBAL,
} from "#shared/constants.ts";
import type { ExtensionSettings } from "#shared/extension-settings.ts";
import type { JSONFile } from "#shared/host-message.ts";

declare global {
  interface Window {
    [INITIAL_JSON_FILE_GLOBAL]: JSONFile;
    [INITIAL_EXTENSION_SETTINGS_GLOBAL]: ExtensionSettings;
  }
}

export const initialJsonFile = window[INITIAL_JSON_FILE_GLOBAL];
export const initialExtensionSettings =
  window[INITIAL_EXTENSION_SETTINGS_GLOBAL];
