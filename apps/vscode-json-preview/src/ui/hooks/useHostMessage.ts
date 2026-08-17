import type { HostMessage } from "#shared/host-message.ts";
import { useEffect } from "react";

/**
 * Listens for messages sent from the extension host.
 *
 * @param onMessage Callback function that receives the message.
 * Ensure this function is memoized (e.g., with `useCallback`) to avoid
 * constantly re-attaching the event listener.
 */
export function useHostMessage(onMessage: (message: HostMessage) => void) {
  useEffect(() => {
    const handleMessage = (event: MessageEvent<HostMessage>) => {
      onMessage(event.data);
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onMessage]);
}
