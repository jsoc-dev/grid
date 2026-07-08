"use client";

import {
  Root,
  Viewport,
  Scrollbar,
  Thumb,
  Corner,
} from "@radix-ui/react-scroll-area";
import { useCodeHighlighter } from "@/hooks/useCodeHighlighter";
import type { CodeLanguage } from "@jsoc/grid-docs";
import type { ReactNode } from "react";

type Props = {
  code: string;
  lang: CodeLanguage;
};

export function CE_CodeBlock({ code = "", lang }: Props) {
  const highlightResult = useCodeHighlighter({ code, lang });

  return (
    <div className="bg-mono h-full w-full flex-1 min-h-0">
      <ScrollArea>
        <div className={"flex-1 flex flex-col p-4"}>
          <pre className="m-0 flex-1 min-h-full font-mono text-[13px] leading-snug subpixel-antialiased">
            <code
              dir="ltr"
              style={{ color: highlightResult.color }}
              dangerouslySetInnerHTML={{ __html: highlightResult.html }}
            />
          </pre>
        </div>
      </ScrollArea>
    </div>
  );
}

function ScrollArea({ children }: { children: ReactNode }) {
  return (
    <Root className="group/scroll bg-transparent flex h-full w-full flex-col overflow-hidden">
      <Viewport className="h-full w-full [&>div]:min-h-full! [&>div]:flex! [&>div]:flex-col!">
        {children}
      </Viewport>
      <Scrollbar
        orientation="vertical"
        className="flex touch-none select-none bg-transparent p-0 transition-colors duration-150 ease-out data-[orientation=vertical]:w-[8px]"
      >
        <Thumb className="relative flex-1 rounded-none bg-transparent transition-colors group-hover/scroll:bg-black/20 dark:group-hover/scroll:bg-white/20" />
      </Scrollbar>
      <Scrollbar
        orientation="horizontal"
        className="flex touch-none select-none bg-transparent p-0 transition-colors duration-150 ease-out data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-[8px]"
      >
        <Thumb className="relative flex-1 rounded-none bg-transparent transition-colors group-hover/scroll:bg-black/20 dark:group-hover/scroll:bg-white/20" />
      </Scrollbar>
      <Corner />
    </Root>
  );
}
