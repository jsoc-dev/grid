import { handleOpenPreviewToSide } from "#ext/commands/openPreviewToSide.ts";
import { handleShowSource } from "#ext/commands/showSource.ts";
import { CommandId } from "#ext/constants.ts";
import { previewPanelStore } from "#ext/panels/PreviewPanelStore.ts";
import * as vscode from "vscode";

export function activate(ctx: vscode.ExtensionContext) {
  ctx.subscriptions.push(
    vscode.commands.registerCommand(CommandId.OpenPreviewToSide, () =>
      handleOpenPreviewToSide(ctx),
    ),
    vscode.commands.registerCommand(CommandId.ShowSource, () =>
      handleShowSource(),
    ),
  );
}

export function deactivate() {
  previewPanelStore.closeAll();
}
