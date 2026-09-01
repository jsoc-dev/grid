import type { ExtensionSettings } from "#shared/extension-settings.ts";
import { type HostMessage, HostMessageType } from "#shared/host-message.ts";
import { useHostMessage } from "#ui/hooks/useHostMessage.ts";
import { initialExtensionSettings } from "#ui/utils/globals.ts";

import { useCallback, useState } from "react";

export function useExtensionSettings(): ExtensionSettings {
  const [settings, setSettings] = useState(initialExtensionSettings);

  useHostMessage(
    useCallback((message: HostMessage) => {
      if (message.type === HostMessageType.SettingsUpdate) {
        setSettings(message.settings);
      }
    }, []),
  );

  return settings;
}
