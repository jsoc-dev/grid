export type ReactGridPluginId =
  | "ag"
  | "ant"
  | "mui"
  | "mantine"
  | "tanstack"
  | "prime";

export type VueGridPluginId = "ag";

export type VanillaGridPluginId = "ag" | "tanstack";

export type PluginIdsByFramework = {
  "react-grid": ReactGridPluginId;
  "vue-grid": VueGridPluginId;
  "vanilla-grid": VanillaGridPluginId;
};

export type FrameworkId = keyof PluginIdsByFramework;

export type PluginId<F extends FrameworkId> = PluginIdsByFramework[F];
