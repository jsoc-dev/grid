export type ReactGridPluginId =
  | "ag"
  | "ant"
  | "mui"
  | "mantine"
  | "tanstack"
  | "prime";

export type VueGridPluginId = "ag" | "tanstack";

export type VanillaGridPluginId = "ag" | "tanstack";

// NOTE:
// `PluginIdsByAdapter` and `AdapterIdList` intentionally duplicate the adapter IDs.
// TypeScript cannot derive an ordered tuple from the keys of an object type (`keyof`
// produces an unordered union), so these types must be kept in sync manually.
export type PluginIdsByAdapter = {
  "react-grid": ReactGridPluginId;
  "vue-grid": VueGridPluginId;
  "vanilla-grid": VanillaGridPluginId;
};

// Keep this in sync with `PluginIdsByAdapter`.
export type AdapterIdList = ["react-grid", "vue-grid", "vanilla-grid"];

export type AdapterId = AdapterIdList[number];
export type UpcomingAdapterId = "angular-grid";

export type PluginId<A extends AdapterId = AdapterId> = PluginIdsByAdapter[A];
