import type { ReactNode } from "react";

export function TableWrapper({ children }: { children: ReactNode }) {
  return (
    <div style={{ backgroundColor: "canvas", overflow: "auto" }}>
      {children}
    </div>
  );
}
