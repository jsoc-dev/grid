import "@jsoc/grid-examples-shared/css/error-message.css";

import { ensureError } from "@jsoc/utils";

export function ErrorMessage({ error }: { error: unknown }) {
  const err = ensureError(error);

  return (
    <div className="error-message">
      <p>{err.name}</p>
      <div>
        <pre>{err.message}</pre>
      </div>
    </div>
  );
}
