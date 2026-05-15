import clsx from "clsx";
import { type RefObject } from "react";

type Props = {
  className?: string;
  previewRef: RefObject<HTMLIFrameElement | null>;
  url: string;
};

export function Frame({ className, previewRef, url }: Props) {
  return (
    <iframe
      className={clsx("h-full w-full", className)}
      ref={previewRef}
      src={url}
      title="Example preview"
    />
  );
}
