import {
  registerGridStore,
  unregisterGridStore,
} from "#internals/store/store-registry.ts";

import {
  BaseGridStore,
  type GridStoreOptions,
  type PluginConfig,
} from "@jsoc/grid-core";

export class VanillaGridStore<C extends PluginConfig> extends BaseGridStore<C> {
  constructor(options: GridStoreOptions<C>) {
    super(options);
  }

  protected override beforeInit(): void {
    // store must be registered before init, so that any listener executing
    // during the first state change can retrieve the store from the registry
    registerGridStore(this);
  }

  public override destroy() {
    super.destroy();
    unregisterGridStore(this);
  }
}
