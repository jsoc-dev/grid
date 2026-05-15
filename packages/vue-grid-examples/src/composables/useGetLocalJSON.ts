import {
  useBroadcast,
  useGetBroadcastMessage,
} from "#composables/useBroadcast.ts";

import { LOCAL_DATA_EXAMPLE_CHANNEL } from "@jsoc/grid-examples-shared";

export function useGetLocalJSON() {
  return useGetBroadcastMessage(LOCAL_DATA_EXAMPLE_CHANNEL);
}

/**
 * Broadcasts JSON to the local channel (e.g. docs playground input panel).
 */
export function useSetLocalJSON(json: string | undefined) {
  useBroadcast(LOCAL_DATA_EXAMPLE_CHANNEL, json);
}
