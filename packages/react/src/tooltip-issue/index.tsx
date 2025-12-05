import { Tooltip } from '@mui/material';
import {
	Activity,
	useEffect,
	useEffectEvent,
	useRef,
	useState,
	type ActivityProps,
} from 'react';
import { useHidePopperDom } from '../grid/adapters/mui/hooks/useHidePopperDom';

export function ToolTipIssue() {
	const modes: ActivityProps['mode'][] = ['hidden', 'visible'];
	const [mode, setMode] = useState<ActivityProps['mode']>(modes[0]);
	const show = () => setMode('visible');
	const hide = () => setMode('hidden');

	const [open, setOpen] = useState(false);
	const {popperRef, popperHide} = useHidePopperDom();

	return (
		<>
			{mode == 'hidden' && <button onClick={show}>Set mode as visible</button>}
			<Activity mode={mode}>
				<div>
					<Tooltip
						title='Hide'
						slotProps={{
							popper: { popperRef },
						}}
					>
						<button
							onClick={(e) => {
								popperHide();
								hide();
							}}
						>
							Set mode as hidden
						</button>
					</Tooltip>
				</div>
			</Activity>
		</>
	);
}

// const observedRef = useResizeObserver(function (entries) {
// 	entries[0]
// 	debugger;
// });

// export function useResizeObserver(onResize: (entries: any) => void) {
// 	const ref = useRef(null);

// 	const onResizeEvent = useEffectEvent(onResize);

// 	useEffect(() => {
// 		if (!ref.current) return;

// 		const observer = new ResizeObserver(
// 			onResizeEvent);

// 		observer.observe(ref.current);

// 		return () => {
// 			debugger
// 			// observer.disconnect();
// 		};
// 	}, []);

// 	return ref;
// }
