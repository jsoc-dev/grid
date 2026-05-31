import { Basic, LocalData, RemoteData } from "./examples/";

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
          basic: Basic,
          "local-data": LocalData,
          "remote-data": RemoteData,
        }}
      />
    </ConfigProvider>
  );
}
