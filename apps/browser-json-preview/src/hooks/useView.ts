import type { UseStateResult, View } from "#types.ts";
import { getActiveView, setActiveView } from "#utils/dom.ts";

import { useEffect, useState } from "react";

export function useView(): UseStateResult<View> {
  const [view, setView] = useState(() => getActiveView());

  useEffect(() => {
    setActiveView(view);
  }, [view]);

  return [view, setView];
}
