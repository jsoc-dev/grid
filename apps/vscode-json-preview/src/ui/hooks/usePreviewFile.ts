import type { HostMessage } from "#shared/host-message.ts";
import { HostMessageType } from "#shared/host-message.ts";
import { useHostMessage } from "#ui/hooks/useHostMessage.ts";
import { initialJsonFile } from "#ui/utils/globals.ts";

import { useCallback, useState } from "react";

/**
 * Manages the state of the JSON file being previewed by listening
 * to "document-update" messages from the extension host.
 */
export function usePreviewFile() {
  const [file, setFile] = useState(initialJsonFile);

  useHostMessage(
    useCallback((message: HostMessage) => {
      if (message.type === HostMessageType.DocumentUpdate) {
        setFile(message.file);
      }
    }, []),
  );

  return file;
}
