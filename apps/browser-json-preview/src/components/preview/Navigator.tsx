import "#components/preview/navigator.css";

import { fileNameWithoutExtension } from "#utils/json.ts";

import type { GridSchemaWithConfig, GridStore } from "@jsoc/grid-core";
import { useGridStoreSelector } from "@jsoc/react-grid";
import type { PluginConfigTanstack } from "@jsoc/react-grid-tanstack";
import { joinNonEmptyStrings, toPascalCase } from "@jsoc/utils";
import clsx from "clsx";
import { Fragment } from "react";

type Props = {
  gridStore: GridStore<PluginConfigTanstack>;
  fileName: string;
};

export function Navigator({ gridStore, fileName }: Props) {
  const schemas = useGridStoreSelector(gridStore, (store) =>
    store.getSchemas(),
  );

  return (
    <nav className="navigator" aria-label="Table location">
      {schemas.map((schema, index) => (
        <Fragment key={schema.id}>
          {index > 0 && <Separator />}
          <NavigatorSegment
            index={index}
            schemas={schemas}
            gridStore={gridStore}
            fileName={fileName}
          />
        </Fragment>
      ))}
    </nav>
  );
}

type SegmentProps = {
  index: number;
  schemas: ReadonlyArray<GridSchemaWithConfig<PluginConfigTanstack>>;
  gridStore: GridStore<PluginConfigTanstack>;
  fileName: string;
};

function NavigatorSegment({
  index,
  schemas,
  gridStore,
  fileName,
}: SegmentProps) {
  const activeIndex = useGridStoreSelector(gridStore, (store) =>
    store.getActiveIndex(),
  );
  const schema = schemas[index];
  const isActive = index === activeIndex;

  const handleSegmentClick = () => {
    const schemasToRemove = schemas.slice(index + 1).reverse();

    for (const schema of schemasToRemove) {
      gridStore.removeChildSchema(schema);
    }
  };

  const getSegmentText = (
    schema: GridSchemaWithConfig<PluginConfigTanstack>,
  ) => {
    if (!schema.origin) return toPascalCase(fileNameWithoutExtension(fileName));

    const hasMultipleRows = schema.origin.parent.rows.length > 1;
    const { columnKey, rowId } = schema.origin.cell;
    return joinNonEmptyStrings(
      [columnKey, hasMultipleRows && `(${rowId})`],
      " ",
    );
  };

  return (
    <button
      type="button"
      className={clsx(
        "navigator_button",
        isActive && "navigator_button--active",
      )}
      disabled={isActive}
      onClick={handleSegmentClick}
    >
      <span>{getSegmentText(schema)}</span>
    </button>
  );
}

function Separator() {
  return (
    <span aria-hidden className="navigator_separator">
      <svg
        width="12"
        height="12"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z"
        />
      </svg>
    </span>
  );
}
