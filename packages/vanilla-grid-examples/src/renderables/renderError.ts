import { ensureError } from "@jsoc/utils";

export function renderError(container: HTMLElement, error: unknown): void {
  const err = ensureError(error);
  container.replaceChildren();

  const wrapper = document.createElement("div");
  wrapper.className = "error";

  const title = document.createElement("p");
  title.textContent = err.name;

  const messageWrapper = document.createElement("div");

  const message = document.createElement("pre");
  message.textContent = err.message;

  messageWrapper.append(message);
  wrapper.append(title, messageWrapper);
  container.append(wrapper);
}
