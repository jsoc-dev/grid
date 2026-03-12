export class JsocGridError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = "JsocGridError";
  }
}
