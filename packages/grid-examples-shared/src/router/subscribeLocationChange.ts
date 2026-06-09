let isSetupDone = false;
const listeners = new Set<() => void>();

function setup() {
  if (isSetupDone) return;

  // popstate event is fired when:
  // - User clicks Back or Forward (including keyboard shortcuts)
  // - history.back(), history.forward(), history.go(n) when n actually changes the active entry for this document
  window.addEventListener("popstate", notify);
  isSetupDone = true;
}

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

/**
 * Use this to manually notify subscribers.
 * Useful when using `history.pushState` to update the URL, as it doesn't fire `popstate` events.
 */
export function notifyLocationChange(): void {
  notify();
}

/**
 * Subscribes to URL changes from back/forward ({@link PopStateEvent}) and manual updates ({@link notifyLocationChange}).
 * @returns function that unsubscribes the listener
 */
export function subscribeLocationChange(listener: () => void): () => void {
  setup();

  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
