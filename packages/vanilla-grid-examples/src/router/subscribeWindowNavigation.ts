const listeners = new Set<() => void>();

let isNavigationListenerAttached = false;

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

function setup() {
  if (isNavigationListenerAttached) return;

  window.navigation.addEventListener("navigate", notify);
  isNavigationListenerAttached = true;
}

/**
 * Subscribes to {@link NavigateEvent}
 * @returns function that unsubscribes the listener
 */
export function subscribeWindowNavigation(listener: () => void): () => void {
  setup();

  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
