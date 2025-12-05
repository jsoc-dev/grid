import { useSubGridToggle } from '../../../hooks/useSubGridToggle';
import { GridSchema, type SearchGridSchemaResult } from '@jsoc/core/grid';

type SubGridToggleButtonProps = {
	subGridSchema: GridSchema;
		searchResult: SearchGridSchemaResult
	
};
export function SubGridToggleButtonAg({
	subGridSchema,
		searchResult,

}: SubGridToggleButtonProps) {
	const { text, toggle } =
		useSubGridToggle(subGridSchema, searchResult);

	return <button onClick={toggle}>{text}</button>;
}
