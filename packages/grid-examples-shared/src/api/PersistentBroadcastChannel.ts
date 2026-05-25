import { isString } from "@jsoc/utils";

export type PersistentBroadcastMessage = string | undefined;

export class PersistentBroadcastChannel extends BroadcastChannel {
  #closed = false;

  constructor(channelName: string) {
    super(channelName);
  }

  public override close(): void {
    super.close();
    this.#closed = true;
  }

  public isClosed(): boolean {
    return this.#closed;
  }

  public getLastMessage(): PersistentBroadcastMessage {
    return PersistentBroadcastChannel.getLastMessage(this.name);
  }

  public static getLastMessage(
    channelName: string,
  ): PersistentBroadcastMessage {
    return localStorage.getItem(channelName) ?? undefined;
  }

  public override postMessage(message: PersistentBroadcastMessage): void {
    super.postMessage(message);

    if (isString(message)) {
      localStorage.setItem(this.name, message);
    } else {
      localStorage.removeItem(this.name);
    }
  }
}
