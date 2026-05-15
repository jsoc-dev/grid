import { useBroadcast, useGetBroadcastMessage } from "#hooks/useBroadcast.ts";

import { LOCAL_DATA_EXAMPLE_CHANNEL } from "@jsoc/grid-examples-shared";

/**
 * Returns the JSON string broadcasted in the local broadcast channel named {@link LOCAL_DATA_EXAMPLE_CHANNEL}.
 * Returns undefined if no string has been broadcasted yet or explicitly broadcasted undefined.
 */
export function useGetLocalJSON(): string | undefined {
  return useGetBroadcastMessage(LOCAL_DATA_EXAMPLE_CHANNEL);
}

/**
 * Broadcasts the given JSON string to the local broadcast channel named {@link LOCAL_DATA_EXAMPLE_CHANNEL}.
 */
export function useSetLocalJSON(json: string | undefined) {
  useBroadcast(LOCAL_DATA_EXAMPLE_CHANNEL, json);
}
