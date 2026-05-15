export type ExampleErrorStyle = Record<string, string>;

export const exampleErrorMessageStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    border: "2px solid #ef4444",
    borderRadius: "0.375rem",
    padding: "1rem",
    backgroundColor: "canvas",
  },
  title: {
    fontWeight: "600",
    fontSize: "1.25rem",
    color: "#ef4444",
    margin: "0",
  },
  message: {
    fontSize: "0.875rem",
    color: "#71717a",
  },
  messagePre: {
    display: "inline",
    whiteSpace: "pre-wrap",
    margin: "0",
    fontFamily: "inherit",
  },
} as const satisfies Record<string, ExampleErrorStyle>;
