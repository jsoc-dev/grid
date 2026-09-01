import { ExtensionSettingId } from "#shared/extension-settings.ts";
import { WebviewEvent, WebviewMessageType } from "#shared/webview-message.ts";
import { useExtensionSettings } from "#ui/hooks/useExtensionSettings.ts";
import { getWebviewApi } from "#ui/utils/webview-api.ts";

import { useEffect } from "react";

export function useDoubleClickToSwitchToEditor() {
  const settings = useExtensionSettings();

  useEffect(() => {
    const doubleClickToSwitchToEditorEnabled =
      settings[ExtensionSettingId.DoubleClickToSwitchToEditor];

    if (doubleClickToSwitchToEditorEnabled) {
      document.addEventListener("dblclick", onDoubleClick);
    }

    return () => {
      if (doubleClickToSwitchToEditorEnabled) {
        document.removeEventListener("dblclick", onDoubleClick);
      }
    };
  }, [settings]);
}

/**
 * Listens for double clicks on the document and sends a message to the extension host
 * to switch back to the text editor.
 */
function onDoubleClick(event: MouseEvent) {
  const target = event.target;
  const selection = window.getSelection();

  let shouldSendMessage = true;

  if (target instanceof HTMLElement) {
    // ignore if the click originated from an interactive element
    if (target.closest('button, a, input, [role="button"]')) {
      shouldSendMessage = false;
    } else if (selection && selection.toString()) {
      // ignore if the user just selected text from a table cell
      if (target.closest("td, th")) {
        shouldSendMessage = false;
      }
    }
  }

  if (shouldSendMessage) {
    getWebviewApi().postMessage({
      type: WebviewMessageType.Event,
      event: WebviewEvent.DoubleClick,
    });
  }
}
