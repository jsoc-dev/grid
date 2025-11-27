
import { useCallback, useContext } from 'react';
import { JsocGridDemoContext } from '../JsocGridDemoContext';
import type { GridUiAdapterName } from '@jsoc/react/grid';

const uiOptions: Record<GridUiAdapterName, string> = {
	mui: 'MUI DataGrid',
	ag: 'AG-Grid',
};

export function GridUiChoice() {
	const {
		gridUi,
		setGridUi,
	} = useContext(JsocGridDemoContext);

	const handleSelectUi = useCallback((uiKey: GridUiAdapterName) => {
		setGridUi(uiKey);
	}, []);

	return (
		<>
			<section className='color' style={{ marginBottom: 16 }}>
				<div style={{ marginBottom: 8, fontWeight: 600 }}>
					Select UI Adapter
				</div>
				<div style={{ display: 'flex', gap: 8 }}>
					{Object.entries(uiOptions).map(([uiKey, uiName]) => (
						<button
							key={uiKey}
							onClick={() => handleSelectUi(uiKey as GridUiAdapterName)}
							style={{
								padding: '6px 12px',
								background:
									gridUi === uiKey ? '#e0e7ff' : '#f4f4f5',
								border: '1px solid #ccc',
								borderRadius: 6,
								cursor: 'pointer',
							}}
						>
							{uiName}
						</button>
					))}
				</div>
			</section>
		</>
	);
}
