import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";

export type TypeWriterProps = {
  className?: string;
  cursorClassName?: string;
  content?: string;
  speed?: number;
  isPaused?: boolean;
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
};

export function TypeWriter({
  className,
  cursorClassName,
  content = "",
  speed = 1000,
  isPaused = false,
  onComplete,
  onProgress,
}: TypeWriterProps) {
  const [prevContent, setPrevContent] = useState(content);
  const [length, setLength] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const onProgressRef = useRef(onProgress);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onProgressRef.current = onProgress;
  });

  if (content !== prevContent) {
    setPrevContent(content);
    setLength(0);
  }

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setLength((prev) => {
        if (prev >= content.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [content, speed, isPaused]);

  useEffect(() => {
    if (length === content.length && content.length > 0) {
      onCompleteRef.current?.();
    }
    onProgressRef.current?.(content.length === 0 ? 0 : length / content.length);
  }, [length, content]);

  const isTyping = !isPaused && length < content.length;

  return (
    <pre className={clsx("flex items-center", className)}>
      <span className="min-h-lh inline-flex items-center">
        {content.slice(0, length)}
      </span>
      <span
        aria-hidden="true"
        className={clsx(
          "inline-block w-px h-lh ml-0.5 bg-current rounded-[1px]",
          !isTyping && "animate-blink",
          cursorClassName,
        )}
      />
    </pre>
  );
}
