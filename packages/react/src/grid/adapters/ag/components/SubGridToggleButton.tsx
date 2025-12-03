import { useSubGridToggle } from '../../../hooks/useSubGridToggle';
import { GridSchema } from '@jsoc/core/grid';

type SubGridToggleButtonProps = {
	subGridSchema: GridSchema;
};
export function SubGridToggleButtonAg({
	subGridSchema,
}: SubGridToggleButtonProps) {
	const { text, isPresentInStore, presentIndex, toggle } = useSubGridToggle(subGridSchema);
	
	return <button onClick={toggle}>{text}</button>;
}
