import { useRef, useState } from 'react';
import {
	ToolbarButton,
	ColumnsPanelTrigger,
	FilterPanelTrigger,
	ExportCsv,
	ExportPrint,
	QuickFilter,
	QuickFilterControl,
	QuickFilterClear,
	QuickFilterTrigger,
} from '@mui/x-data-grid';
import {
	styled,
	Menu,
	Badge,
	Divider,
	Tooltip,
	MenuItem,
	TextField,
	InputAdornment,
} from '@mui/material';
import {
	Cancel,
	Search,
	ViewColumn,
	FilterList,
	FileDownload,
} from '@mui/icons-material';

//#region Code Reference: https://mui.com/x/react-data-grid/components/toolbar/#GridToolbar.tsx

export function InbuiltToolbarButtonsMui() {
	return (
		<>
			<InbuiltToolbarColumnButtonMui />
			<InbuiltToolbarFilterButtonMui />
			<Divider
				orientation='vertical'
				variant='middle'
				flexItem
				sx={{ mx: 0.5 }}
			/>
			<InbuiltToolbarExportButtonMui />
			<InbuiltToolbarPrintButtonMui />
		</>
	);
}

export function InbuiltToolbarColumnButtonMui() {
	return (
		<Tooltip title='Columns'>
			<ColumnsPanelTrigger render={<ToolbarButton />}>
				<ViewColumn fontSize='small' />
			</ColumnsPanelTrigger>
		</Tooltip>
	);
}

export function InbuiltToolbarFilterButtonMui() {
	return (
		<Tooltip title='Filters'>
			<FilterPanelTrigger
				render={(props, state) => (
					<ToolbarButton {...props} color='default'>
						<Badge
							badgeContent={state.filterCount}
							color='primary'
							variant='dot'
						>
							<FilterList fontSize='small' />
						</Badge>
					</ToolbarButton>
				)}
			/>
		</Tooltip>
	);
}

export function InbuiltToolbarExportButtonMui() {
	const [exportMenuOpen, setExportMenuOpen] = useState(false);
	const exportMenuTriggerRef = useRef<HTMLButtonElement>(null);

	return (
		<>
			<Tooltip title='Export'>
				<ToolbarButton
					ref={exportMenuTriggerRef}
					id='export-menu-trigger'
					aria-controls='export-menu'
					aria-haspopup='true'
					aria-expanded={exportMenuOpen ? 'true' : undefined}
					onClick={() => setExportMenuOpen(true)}
				>
					<FileDownload fontSize='small' />
				</ToolbarButton>
			</Tooltip>

			<Menu
				id='export-menu'
				anchorEl={exportMenuTriggerRef.current}
				open={exportMenuOpen}
				onClose={() => setExportMenuOpen(false)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				slotProps={{
					list: {
						'aria-labelledby': 'export-menu-trigger',
					},
				}}
			>
				<ExportPrint
					render={<MenuItem />}
					onClick={() => setExportMenuOpen(false)}
				>
					Print
				</ExportPrint>
				<ExportCsv
					render={<MenuItem />}
					onClick={() => setExportMenuOpen(false)}
				>
					Download as CSV
				</ExportCsv>
			</Menu>
		</>
	);
}

export function InbuiltToolbarPrintButtonMui() {
	return (
		<StyledQuickFilter>
			<QuickFilterTrigger
				render={(triggerProps, state) => (
					<Tooltip title='Search' enterDelay={0}>
						<StyledToolbarButton
							{...triggerProps}
							ownerState={{ expanded: state.expanded }}
							color='default'
							aria-disabled={state.expanded}
						>
							<Search fontSize='small' />
						</StyledToolbarButton>
					</Tooltip>
				)}
			/>
			<QuickFilterControl
				render={({ ref, ...controlProps }, state) => (
					<StyledTextField
						{...controlProps}
						ownerState={{ expanded: state.expanded }}
						inputRef={ref}
						aria-label='Search'
						placeholder='Search...'
						size='small'
						slotProps={{
							input: {
								startAdornment: (
									<InputAdornment position='start'>
										<Search fontSize='small' />
									</InputAdornment>
								),
								endAdornment: state.value ? (
									<InputAdornment position='end'>
										<QuickFilterClear
											edge='end'
											size='small'
											aria-label='Clear search'
											material={{
												sx: { marginRight: -0.75 },
											}}
										>
											<Cancel fontSize='small' />
										</QuickFilterClear>
									</InputAdornment>
								) : null,
								...controlProps.slotProps?.input,
							},
							...controlProps.slotProps,
						}}
					/>
				)}
			/>
		</StyledQuickFilter>
	);
}

type OwnerState = {
	expanded: boolean;
};

const StyledQuickFilter = styled(QuickFilter)({
	display: 'grid',
	alignItems: 'center',
});

const StyledToolbarButton = styled(ToolbarButton)<{ ownerState: OwnerState }>(
	({ theme, ownerState }) => ({
		gridArea: '1 / 1',
		width: 'min-content',
		height: 'min-content',
		zIndex: 1,
		opacity: ownerState.expanded ? 0 : 1,
		pointerEvents: ownerState.expanded ? 'none' : 'auto',
		transition: theme.transitions.create(['opacity']),
	})
);

const StyledTextField = styled(TextField)<{
	ownerState: OwnerState;
}>(({ theme, ownerState }) => ({
	gridArea: '1 / 1',
	overflowX: 'clip',
	width: ownerState.expanded ? 260 : 'var(--trigger-width)',
	opacity: ownerState.expanded ? 1 : 0,
	transition: theme.transitions.create(['width', 'opacity']),
}));

//#endregion
