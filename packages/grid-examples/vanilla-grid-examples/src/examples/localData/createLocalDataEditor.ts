import {
  LOCAL_DATA_EXAMPLE_CHANNEL,
  PersistentBroadcastChannel,
} from "@jsoc/grid-examples-core";

/**
 * Mounts a local data editor that broadcasts JSON to the local data channel.
 * @returns A function that removes the editor from the DOM and closes the broadcast channel.
 */
export function createLocalDataEditor(): () => void {
  const channel = new PersistentBroadcastChannel(LOCAL_DATA_EXAMPLE_CHANNEL);

  const persistedData = PersistentBroadcastChannel.getLastMessage(
    LOCAL_DATA_EXAMPLE_CHANNEL,
  );

  let isOpen = false;

  const root = document.createElement("div");
  root.className = "local-data-editor";

  const textarea = document.createElement("textarea");
  textarea.className = "local-data-editor__textarea";
  textarea.placeholder = "Enter JSON";
  textarea.spellcheck = false;
  textarea.hidden = true;
  textarea.setAttribute("aria-label", "Local JSON data");
  if (persistedData !== undefined) {
    textarea.value = persistedData;
  }

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className =
    "local-data-editor__toggle local-data-editor__toggle--edit";
  toggle.setAttribute("aria-label", "Edit local JSON data");

  const setOpen = (open: boolean) => {
    isOpen = open;
    textarea.hidden = !open;
    toggle.className = open
      ? "local-data-editor__toggle local-data-editor__toggle--close"
      : "local-data-editor__toggle local-data-editor__toggle--edit";
    toggle.setAttribute(
      "aria-label",
      open ? "Close JSON editor" : "Edit local JSON data",
    );
  };

  toggle.addEventListener("click", () => {
    setOpen(!isOpen);
  });
  textarea.addEventListener("input", () => {
    channel.postMessage(textarea.value);
  });

  root.append(textarea, toggle);
  document.body.append(root);

  return () => {
    root.remove();
    channel.close();
  };
}
