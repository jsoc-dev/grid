import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";

type SetLevel = Dispatch<SetStateAction<ZoomLevel>>;
export type ZoomLevel = number;
export type ZoomActions = {
  in: () => ReturnType<SetLevel>;
  out: () => ReturnType<SetLevel>;
  reset: () => ReturnType<SetLevel>;
};

export type Zoom = { level: ZoomLevel; actions: ZoomActions };

const MIN_ZOOM: ZoomLevel = 0.5;
const MAX_ZOOM: ZoomLevel = 2.0;
const ZOOM_STEP: ZoomLevel = 0.1;
const DEFAULT_ZOOM: ZoomLevel = 1;

const clampZoom = (value: ZoomLevel): ZoomLevel =>
  Number(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value)).toFixed(1));

const applyZoomIn = (set: SetLevel) => set((z) => clampZoom(z + ZOOM_STEP));

const applyZoomOut = (set: SetLevel) => set((z) => clampZoom(z - ZOOM_STEP));

const applyZoomReset = (set: SetLevel) => set(DEFAULT_ZOOM);

export function useZoom(): Zoom {
  const [level, setLevel] = useState(DEFAULT_ZOOM);

  const actions: ZoomActions = useMemo(
    () => ({
      in: () => applyZoomIn(setLevel),
      out: () => applyZoomOut(setLevel),
      reset: () => applyZoomReset(setLevel),
    }),
    [],
  );

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          applyZoomIn(setLevel);
        } else {
          applyZoomOut(setLevel);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return { level, actions };
}
