import { Navigator } from "#grid/polygrid/navigator/index.ts";
import type { ReactNode } from "react";

export function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ height: "48px" }}>
        <Navigator />
      </div>
      <div style={{ flex: 1, maxHeight: "calc(100% - 48px)" }}>{children}</div>
    </div>
  );
}
