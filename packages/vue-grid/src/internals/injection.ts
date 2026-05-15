import type { GridStore, PluginConfig } from "@jsoc/grid-core";
import type { InjectionKey, MaybeRef } from "vue";

export const gridStoreInjectionKey: InjectionKey<
  MaybeRef<GridStore<PluginConfig>>
> = Symbol("GridStore");
