import {
  BaseGridSchema,
  type GridSchema,
  type GridStoreId,
} from "@jsoc/grid-core";

/**
 * Resolves the {@link GridStoreId} for a {@link GridSchema} passed from column generators.
 */
export function getGridStoreId(gridSchema: GridSchema): GridStoreId {
  BaseGridSchema.assertInstance(gridSchema);
  return gridSchema.store.id;
}
