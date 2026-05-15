export class VueGridError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = "VueGridError";
  }
}
