import { isString } from "@jsoc/utils";

export type PersistentBroadcastMessage = string | undefined;

export class PersistentBroadcastChannel extends BroadcastChannel {
  #closed = false;

  static get storage(): Storage | undefined {
    try {
      if (typeof localStorage !== "undefined") {
        return localStorage;
      }
    } catch {
      // Access to localStorage may be restricted (e.g. sandboxed iframe or disabled cookies)
    }
    return undefined;
  }

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
    return (
      PersistentBroadcastChannel.storage?.getItem(channelName) ?? undefined
    );
  }

  public override postMessage(message: PersistentBroadcastMessage): void {
    super.postMessage(message);

    try {
      if (isString(message)) {
        PersistentBroadcastChannel.storage?.setItem(this.name, message);
      } else {
        PersistentBroadcastChannel.storage?.removeItem(this.name);
      }
    } catch {
      // Ignore storage errors (e.g. quota exceeded or storage disabled)
    }
  }
}
