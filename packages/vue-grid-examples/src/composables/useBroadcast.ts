import {
  PersistentBroadcastChannel,
  type PersistentBroadcastMessage,
  subscribeBroadcastChannel,
} from "@jsoc/grid-examples-shared";
import { onMounted, onUnmounted, type Ref, ref, watch } from "vue";

export function useBroadcast(
  channelName: string,
  message: PersistentBroadcastMessage,
) {
  const channelRef = ref(new PersistentBroadcastChannel(channelName));

  watch(
    () => message,
    (value) => {
      if (channelRef.value.isClosed()) {
        const newChannel = new PersistentBroadcastChannel(channelName);
        newChannel.postMessage(value);
        channelRef.value = newChannel;
      } else {
        channelRef.value.postMessage(value);
      }
    },
    { flush: "sync", immediate: true },
  );

  onUnmounted(() => {
    channelRef.value.close();
  });
}

export function useGetBroadcastMessage(
  channelName: string,
): Ref<PersistentBroadcastMessage> {
  const message = ref<PersistentBroadcastMessage>();

  if (typeof window !== "undefined") {
    message.value = PersistentBroadcastChannel.getLastMessage(channelName);
  }

  let unsubscribe: (() => void) | undefined;

  onMounted(() => {
    unsubscribe = subscribeBroadcastChannel(channelName, (value) => {
      message.value = value;
    });
  });

  onUnmounted(() => {
    unsubscribe?.();
  });

  return message;
}
