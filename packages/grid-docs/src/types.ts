export type ReactGridPluginId =
  | "ag"
  | "ant"
  | "mui"
  | "mantine"
  | "tanstack"
  | "prime";

export type VueGridPluginId = "ag" | "tanstack";

export type VanillaGridPluginId = "ag" | "tanstack";

export type PluginIdsByAdapter = {
  "react-grid": ReactGridPluginId;
  "vue-grid": VueGridPluginId;
  "vanilla-grid": VanillaGridPluginId;
};

export type AdapterId = keyof PluginIdsByAdapter;
export type UpcomingAdapterId = "angular-grid";

export type PluginId<A extends AdapterId = AdapterId> = PluginIdsByAdapter[A];
