import type { CustomColumnGenerator } from "@jsoc/grid-core";
import { ChildGridToggle } from "@jsoc/react-grid";
import type { PluginConfigTanstack } from "@jsoc/react-grid-tanstack";
import objectIconSvg from "@vscode/codicons/src/icons/json.svg";
import arrayIconSvg from "@vscode/codicons/src/icons/symbol-array.svg";

export const customColumnGenerator: CustomColumnGenerator<
  PluginConfigTanstack,
  "ujsonObject" | "ujsonObjectArray"
> = (params) => {
  const isArray = params.columnDataType === "ujsonObjectArray";
  const iconSvg = isArray ? arrayIconSvg : objectIconSvg;
  const title = isArray ? "Expand Array" : "Expand Object";
  const color = isArray ? "#75beff" : "#dbb06c";

  return {
    cell: ({ row }) => (
      <ChildGridToggle row={row.original} columnParams={params}>
        {(toggle) => (
          <button
            type="button"
            title={title}
            onClick={toggle}
            className="child-grid-toggle-btn"
            style={{ color }}
            dangerouslySetInnerHTML={{ __html: iconSvg }}
          />
        )}
      </ChildGridToggle>
    ),
  };
};
