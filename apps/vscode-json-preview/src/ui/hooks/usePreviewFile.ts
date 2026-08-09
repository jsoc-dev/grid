import type { HostMessage } from "#shared/types.ts";
import { getInitialJsonFile } from "#ui/utils/json.ts";
import { useEffect, useState } from "react";

/**
 * Manages the state of the JSON file being previewed by listening
 * to "update" messages from the extension host.
 */
export function usePreviewFile() {
  const [file, setFile] = useState(getInitialJsonFile);

  useEffect(() => {
    const onMessage = (event: MessageEvent<HostMessage>) => {
      const message = event.data;
      if (message.type === "update") {
        setFile(message.file);
      }
    };

    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return file;
}
