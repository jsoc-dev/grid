import { isError } from "@jsoc/utils";

export function ErrorMessage({ error }: { error: unknown }) {
  const err = isError(error)
    ? error
    : new Error("Something went wrong", { cause: error });

  return (
    <div
      className="
				flex flex-col gap-2
				bg-destructive/10
				border border-destructive/50 rounded-md
				p-4	
			"
    >
      <p className="font-semibold text-xl text-destructive">{err.name}</p>
      <div className="text-sm text-muted-foreground">
        <pre className="inline whitespace-pre-wrap">{err.message}</pre>
      </div>
    </div>
  );
}
