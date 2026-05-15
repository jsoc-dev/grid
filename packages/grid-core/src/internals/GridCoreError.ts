export class GridCoreError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = "GridCoreError";
  }
}
