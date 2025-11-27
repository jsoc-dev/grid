import { useContext } from 'react';
import { prettyStringify } from '@jsoc/core';
import { JsocGridDemoContext } from '../JsocGridDemoContext';

export function GridInput() {
	const {
		gridName,
		setGridName,
		gridData,
		setGridData,
		gridDataError,
		setGridDataError,
	} = useContext(JsocGridDemoContext);
	return (
		<div style={{ marginBottom: 20 }}>
			<h3>JSON Input</h3>
			<div>
				<div>Grid Name</div>
				<input
					type='text'
					value={gridName}
					onChange={(e) => {
						setGridName(e.target.value);
					}}
				/>
			</div>
			<div>
				<div>Grid Date</div>

				<textarea
				  	spellCheck="false"

					defaultValue={prettyStringify(
						gridData
					)}

					onChange={(e) => {
						const raw = e.target.value
						try {
							const parsed = JSON.parse(raw);
							setGridData(parsed);
							setGridDataError('');
						} catch (err: unknown) {
							setGridDataError(String(err));
						}
					}}
					style={{
						width: '100%',
						height: '200px',
						fontFamily: 'monospace',
						fontSize: '14px',
						border: '2px solid ' + (gridDataError ? 'red' : 'black'),
						color: (gridDataError ? 'red' : 'black')
					}}
				/>
				{
					gridDataError && (
						<div>{gridDataError}</div>
					)
				}
			</div>
		</div>
	);
}
