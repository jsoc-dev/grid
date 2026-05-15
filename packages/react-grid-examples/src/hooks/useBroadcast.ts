import {
  type LocalBroadcastChannel,
  type LocalBroadcastMessage,
  newBroadcastChannel,
} from "@jsoc/grid-examples-shared";
import { useEffect, useRef, useState } from "react";

/**
 * Broadcasts the given message to the local broadcast channel named {@link channelName}.
 * @param channelName - The name of the channel to create. This must be stable.
 *                      This hook will keep broadcasting the messages on the initial channelName even if the name changes.
 */
export function useBroadcast(
  channelName: string,
  message: LocalBroadcastMessage,
) {
  const channelRef = useRef<LocalBroadcastChannel | null>(null);

  useEffect(() => {
    if (
      channelRef.current === null ||
      // strict mode quirk:
      // This hook is unmounted (and channel is closed) when its parent unmounts (e.g navigate to other page).
      // But when remounted (coming back to page), `channel` state ideally should reinitialize and new channel
      // should create but somehow it still refers to old closed channel. This causes `InvalidStateError` when
      // calling `postMessage`. To work around this, we recreate the channel if it's closed.
      channelRef.current.closed
    ) {
      channelRef.current = newBroadcastChannel(channelName);
    }

    channelRef.current.storeAndPostMessage(message);

    // eslint-disable-next-line react-hooks/exhaustive-deps -- ignoring channelName in dependencies intentionally
  }, [message]);

  // Cleanup function to close the channel when the hook is unmounted.
  useEffect(() => () => channelRef.current?.close(), []);
}

/**
 * Hook for getting the latest message from a BroadcastChannel.
 * @param channelName - The name of the channel to listen to. This must be stable.
 *                      This hook will keep listening to the initial channelName even if the name changes.
 */
export function useGetBroadcastMessage(
  channelName: string,
): LocalBroadcastMessage {
  const channelRef = useRef<LocalBroadcastChannel | null>(null);

  const [message, setMessage] = useState(() => {
    const channel = newBroadcastChannel(channelName);
    channel.close();
    return channel.getLastStoredMessage();
  });

  useEffect(() => {
    if (
      channelRef.current === null ||
      // strict mode quirk:
      // in strict mode, every hook is called twice, and first call is cleaned up by running the cleanup function.
      // as a result the channel is closed and listener is removed. But in the second call, React should ideally
      // reinitialize the hook's states, but somehow it still refers to old closed channel state. Due to which
      // same closed channel is used again so messages are not being received.
      // To work around this, we are recreating the channel if it's closed.
      channelRef.current.closed
    ) {
      channelRef.current = newBroadcastChannel(channelName);
    }

    const handler = (event: MessageEvent) => setMessage(event.data);

    channelRef.current.addEventListener("message", handler);

    return () => {
      channelRef.current?.removeEventListener("message", handler);
      channelRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ignoring channelName in dependencies intentionally
  }, []);

  return message;
}
