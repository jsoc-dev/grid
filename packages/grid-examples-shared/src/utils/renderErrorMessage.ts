import { exampleErrorMessageStyles } from "#constants/errorMessageStyles.ts";
import { toExampleError } from "#utils/toExampleError.ts";

function applyStyles(element: HTMLElement, styles: Record<string, string>) {
  Object.assign(element.style, styles);
}

/**
 * Renders a shared error message panel into `root` (vanilla examples).
 */
export function renderErrorMessage(root: HTMLElement, error: unknown): void {
  const err = toExampleError(error);
  root.replaceChildren();

  const container = document.createElement("div");
  applyStyles(container, exampleErrorMessageStyles.container);

  const title = document.createElement("p");
  applyStyles(title, exampleErrorMessageStyles.title);
  title.textContent = err.name;

  const messageWrapper = document.createElement("div");
  applyStyles(messageWrapper, exampleErrorMessageStyles.message);

  const message = document.createElement("pre");
  applyStyles(message, exampleErrorMessageStyles.messagePre);
  message.textContent = err.message;

  messageWrapper.append(message);
  container.append(title, messageWrapper);
  root.append(container);
}
