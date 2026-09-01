import type { UseStateResult, View } from "#types.ts";
import {
  getDefaultViewSetting,
  setDefaultViewSetting,
} from "#utils/settings.ts";

import { useEffect, useState } from "react";

export function useDefaultViewSetting(): UseStateResult<View> {
  const [defaultView, setDefaultView] = useState(() => getDefaultViewSetting());

  useEffect(() => {
    setDefaultViewSetting(defaultView);
  }, [defaultView]);

  return [defaultView, setDefaultView];
}
