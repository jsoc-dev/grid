// Imported with ?inline to scope styles directly inside the Shadow DOM and prevent leaks into the host page
import css from "#app.css?inline";
import { PreviewContent } from "#components/PreviewContent.tsx";
import { PreviewToggle } from "#components/PreviewToggle.tsx";

import { Activity, useEffect, useState } from "react";

type AppProps = {
  host: HTMLElement;
};

export function App({ host }: AppProps) {
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const browserPreviewElements = Array.from(document.body.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el !== host,
    );

    browserPreviewElements.forEach((el) => {
      el.style.display = showPreview ? "none" : "";
    });
  }, [showPreview]);

  return (
    <>
      <style>{css}</style>

      <PreviewToggle
        showPreview={showPreview}
        setShowPreview={setShowPreview}
      />

      <Activity mode={showPreview ? "visible" : "hidden"}>
        <div className="absolute top-0 h-dvh w-full z-40 bg-canvas text-canvastext">
          <PreviewContent />
        </div>
      </Activity>
    </>
  );
}
