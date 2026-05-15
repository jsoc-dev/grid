import { shoeJSON } from "@jsoc/grid-examples-shared";

import { createTanstackTableMount } from "./mountTanstackTable.ts";

export const mountBasic = createTanstackTableMount(shoeJSON);
