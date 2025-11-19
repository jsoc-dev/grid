import { Fragment, useContext } from 'react';
import { JsocGridContext } from '../JsocGridContext';
import {
	GridKey,
	remove,
	setActive,
} from '@jsoc/core/grid';

type JsocGridNavigatorNodeProps = {
	index: number;
};

export function JsocGridNavigator() {
	const { gridSchemaStack, setGridSchemaStack } = useContext(JsocGridContext);

	return gridSchemaStack.map((_, index, __) => (
		<Fragment key={index}>
			<JsocGridNavigatorItem index={index} />
		</Fragment>
	));
}

export function JsocGridNavigatorItem({ index }: JsocGridNavigatorNodeProps) {
	const { gridSchemaStack, setGridSchemaStack } = useContext(JsocGridContext);

	const { gridKey, isActiveGrid } = gridSchemaStack[index];
	const isFirstGrid = index === 0;
	const isLastGrid = index === gridSchemaStack.length - 1;

	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 6,
			}}
		>
			<Chip
				label={gridKey}
				active={isActiveGrid}
				onClick={!isActiveGrid ? onItemClick : undefined}
				onClose={onItemClose}
				showClose={!isFirstGrid}
			/>

			{!isLastGrid && (
				<span
					style={{
						color: '#9ca3af',
					}}
				>
					&gt;
				</span>
			)}
		</div>
	);
	function onItemClick() {
		setGridSchemaStack(setActive(gridSchemaStack, gridKey));
	}

	function onItemClose() {
		setGridSchemaStack(remove(gridSchemaStack, gridKey));
	}
}


function Chip({
	label,
	active,
	onClick,
	onClose,
	showClose,
}: {
	label: string;
	active?: boolean;
	onClick?: () => void;
	onClose?: () => void;
	showClose?: boolean;
}) {
	return (
		<span
			style={{
				padding: '4px 8px',
				borderRadius: '6px',
				display: 'inline-flex',
				alignItems: 'center',
				gap: 6,
				transition: 'all 0.2s',
				background: active ? '#e0e7ff' : '#f4f4f5',
				color: active ? '#1e3a8a' : '#333',
				cursor: onClick ? 'pointer' : 'default',
			}}
			onClick={onClick}
		>
			{label}

			{showClose && (
				<span
					style={{ fontSize: 12, cursor: 'pointer', paddingLeft: 4 }}
					onClick={(e) => {
						e.stopPropagation();
						onClose?.();
					}}
				>
					×
				</span>
			)}
		</span>
	);
}
