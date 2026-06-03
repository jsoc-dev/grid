import { ensureError } from "@jsoc/utils";

/**
 * Creates a div element with an error message.
 * @param error - The error to display.
 * @returns The div element with the error message.
 */
export function ErrorMessage({ error }: { error: unknown }): HTMLDivElement {
  const err = ensureError(error);

  return (
    <div className="error">
      <p>{err.name}</p>
      <div>
        <pre>{err.message}</pre>
      </div>
    </div>
  ) as HTMLDivElement;
}

/**
 * Alias for {@link ErrorMessage}.
 */
export const createErrorMessage = ErrorMessage;
