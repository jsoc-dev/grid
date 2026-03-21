import { customArrayOfObjectsColumnGeneratorAg } from "#customizations/custom-column-generators/customColumnGeneratorsAg.tsx";
import { customArrayOfObjectsColumnGeneratorMui } from "#customizations/custom-column-generators/customColumnGeneratorsMui.tsx";

import type { PluginConfigGeneratorOptions } from "@jsoc/grid-core";
import type { ConfigByPlugin, GridPlugin } from "@jsoc/react-grid";

export const getConfigGeneratorOptions = <P extends GridPlugin>(
  plugin: P,
): PluginConfigGeneratorOptions<ConfigByPlugin[P]> => {
  let options: PluginConfigGeneratorOptions;
  switch (plugin) {
    case "mui":
      options = {
        customColumnGeneratorByType: {
          arrayOfObjects: customArrayOfObjectsColumnGeneratorMui,
          object: customArrayOfObjectsColumnGeneratorMui,
        },
      };
      break;
    case "ag":
      options = {
        customColumnGeneratorByType: {
          arrayOfObjects: customArrayOfObjectsColumnGeneratorAg,
          object: customArrayOfObjectsColumnGeneratorAg,
        },
      };
      break;
    default:
      options = {};
  }

  return options;
};
