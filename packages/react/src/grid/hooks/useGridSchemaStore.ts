import { JsocGridContext } from '../wrapper/JsocGrid';
import { useContext } from 'react';

export function useGridSchemaStore() {
	const { gridSchemaStore, setGridSchemaStore } = useContext(JsocGridContext);

	return {
		gridSchemaStore,
		setGridSchemaStore,
	};
}
