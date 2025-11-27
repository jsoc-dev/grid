import type { GridSchemaStoreIndex } from '@jsoc/core/grid';
import { useGridNavigator, useGridSchemaStore } from '@jsoc/react/grid';
import { Fragment } from 'react/jsx-runtime';


export function JsocGridAgNavigator() {
	const { gridSchemaStore } = useGridSchemaStore();

	return (
		<div className="my-2">
			{gridSchemaStore.map((_, index, __) => (
				<Fragment key={index}>
					<JsocGridMuiNavigatorItem index={index} />
				</Fragment>
			))}
		</div>
	);
}

type JsocGridMuiNavigatorItemProps = {
	index: GridSchemaStoreIndex;
};

export function JsocGridMuiNavigatorItem({ index }: JsocGridMuiNavigatorItemProps) {
	const {
		gridSchema,
		activateGrid,
		removeGrid,
	} = useGridNavigator(index);
	const {gridName, isActiveGrid} = gridSchema;
	const isFirstGrid = index === 0;
	
	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 6,
			}}
		>
			{ // separator
			!isFirstGrid && (
				<span
					style={{
						color: '#9ca3af',
					}}
				>
					&gt;
				</span>
			)}
			<span
				style={{
					padding: '4px 8px',
					borderRadius: '6px',
					display: 'inline-flex',
					alignItems: 'center',
					gap: 6,
					transition: 'all 0.2s',
					background: isActiveGrid ? '#e0e7ff' : '#f4f4f5',
					color: isActiveGrid ? '#1e3a8a' : '#333',
					cursor: isActiveGrid ? 'pointer' : 'default',
				}}
				onClick={!isActiveGrid ? activateGrid : undefined}
			>
				{gridName}

				{!isFirstGrid && (
					<span
						style={{
							fontSize: 12,
							cursor: 'pointer',
							paddingLeft: 4,
						}}
						onClick={removeGrid}
					>
						×
					</span>
				)}
			</span>
		</div>
	);
}
