export enum ExtensionSettingId {
  DoubleClickToSwitchToEditor = "doubleClickToSwitchToEditor",
}

export type ExtensionSettingValue<T> = T | undefined;
export type ExtensionSettings = {
  [ExtensionSettingId.DoubleClickToSwitchToEditor]: ExtensionSettingValue<boolean>;
};
