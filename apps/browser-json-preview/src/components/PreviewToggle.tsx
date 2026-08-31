import type { Dispatch, SetStateAction } from "react";

export type PreviewToggleProps = {
  showPreview: boolean;
  setShowPreview: Dispatch<SetStateAction<boolean>>;
};

export function PreviewToggle({
  showPreview,
  setShowPreview,
}: PreviewToggleProps) {
  return (
    <button
      className="fixed right-4 bottom-4 z-50 px-4 py-2 rounded-xl bg-canvas text-canvastext border border-canvastext cursor-pointer hover:opacity-80 transition-opacity"
      onClick={() => setShowPreview((prev) => !prev)}
    >
      {showPreview ? "Hide" : "Show"} Preview
    </button>
  );
}
