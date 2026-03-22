export class ReactGridError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = "ReactGridError";
  }
}
