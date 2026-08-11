import packageJson from "#package.json" with { type: "json" };

export const EXTENSION_NAME = packageJson.name;
export const EXTENSION_DISPLAY_NAME = packageJson.displayName;

// assumes command id is in the format of <extension-name>.<command-name>
// package.json `contributes.commands.command` must be synchronized with below map
// TODO add a testcase to verify the package and below map are in sync before build
const cid = (name: string) => `${EXTENSION_NAME}.${name}`;

export const CommandId = {
  OpenPreviewToSide: cid("openPreviewToSide"),
  ShowSource: cid("showSource"),
} as const;

export type CommandId = (typeof CommandId)[keyof typeof CommandId];

export const DEFAULT_FILE_NAME = "untitled.json";
