export class VanillaGridError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = "VanillaGridError";
  }
}
