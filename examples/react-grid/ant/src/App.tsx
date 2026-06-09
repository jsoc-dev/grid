import basic from "./examples/Basic";
import localData from "./examples/LocalData";
import remoteData from "./examples/RemoteData";

import {
  ExamplesRouter,
  useDetectColorScheme,
} from "@jsoc/react-grid-examples";
import { ConfigProvider, theme } from "antd";

/**
 * Examples of Ant Design Table rendered using JSOC Grid
 * @see {@link https://ant.design/components/table Learn more about Ant Design Table}
 */
export default function App() {
  const colorScheme = useDetectColorScheme();
  const themeConfig = {
    algorithm:
      colorScheme === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <ExamplesRouter
        pluginId="ant"
        components={{
          basic,
          localData,
          remoteData,
        }}
      />
    </ConfigProvider>
  );
}
