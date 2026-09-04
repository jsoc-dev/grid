import {
  useBroadcast,
  useGetBroadcastMessage,
} from "#examples/localData/useBroadcast.ts";

import {
  getLocalDataChannelName,
  type PersistentBroadcastMessage,
} from "@jsoc/grid-examples-core";
import type { MaybeRefOrGetter } from "vue";

export function useGetLocalData() {
  return useGetBroadcastMessage(getLocalDataChannelName());
}

export function useSetLocalData(
  data: MaybeRefOrGetter<PersistentBroadcastMessage>,
) {
  useBroadcast(getLocalDataChannelName(), data);
}
