export class GridError extends Error {
  constructor(
    public message: string,
    public cause?: unknown,
  ) {
    super(message, { cause });
    this.name = "GridError";
  }
}
