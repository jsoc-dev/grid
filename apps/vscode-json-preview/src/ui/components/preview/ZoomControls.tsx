import "#ui/components/preview/zoom-controls.css";

import type { Zoom } from "#ui/hooks/useZoom.ts";

type ZoomControlsProps = {
  zoom: Zoom;
};

export function ZoomControls({ zoom }: ZoomControlsProps) {
  return (
    <div className="zoom-controls">
      <button onClick={zoom.actions.out} aria-label="Zoom Out">
        −
      </button>
      <button onClick={zoom.actions.reset} aria-label="Reset Zoom">
        {Math.round(zoom.level * 100)}%
      </button>
      <button onClick={zoom.actions.in} aria-label="Zoom In">
        +
      </button>
    </div>
  );
}
