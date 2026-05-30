import { ensureError } from "@jsoc/utils";

export function ErrorMessage({ error }: { error: unknown }) {
  const err = ensureError(error);

  return (
    <div className="error">
      <p>{err.name}</p>
      <div>
        <pre>{err.message}</pre>
      </div>
    </div>
  );
}
