import { useToggleSubGrid } from '../../../../hooks';
import {
	type GridCellLocation,
	type GridData,
	type GridId,
} from '@jsoc/core/grid';

export type ToggleSubGridButtonProps = {
	/**
	 * data of the sub grid, is actually the `ColumnValue` of the `GridRow[rowId][ColumnKey]`
	 * using which the rows and columns will be generated.
	 */
	subGridData: GridData;
	/**
	 * `GridId` of the grid that will render this button
	 */
	parentGridId: GridId;
	/**
	 * Location of the `GridCell` that will render this button
	 */
	parentGridCellLocation: GridCellLocation;
};
export function ToggleSubGridButtonAg({
	subGridData,
	parentGridId,
	parentGridCellLocation,
}: ToggleSubGridButtonProps) {
	const { toggleText, isPresentInStore, toggleSubGrid } =
		useToggleSubGrid(
			subGridData,
			parentGridId,
			parentGridCellLocation
		);

	return (
		<button
			style={{ color: isPresentInStore ? 'red' : 'green' }}
			onClick={toggleSubGrid}
		>
			{toggleText}
		</button>
	);
}
