import { useRef } from 'react';
// TODO: Remove this and use a proper solution
export function useHidePopperDom() {
	const popperRef = useRef(null);

	function popperHide() {
		const popperRefCurr = popperRef.current as any;
		if (popperRefCurr?.state?.elements?.popper?.style) {
			popperRefCurr.state.elements.popper.style.display = 'none';
		}
	}

	return {
		popperRef,
		popperHide,
	};
}
