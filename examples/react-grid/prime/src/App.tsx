import { Basic, LocalData, RemoteData } from "./examples/";

import { PrimeReactProvider } from "primereact/api";
import { ExamplesRouter } from "@jsoc/react-grid-examples";
import { useDetectColorScheme } from "@jsoc/react-grid-examples";

const themes = {
  light: "lara-light-indigo",
  dark: "lara-dark-indigo",
};

/**
 * Examples of PrimeReact Table rendered using JSOC Grid
 * @see {@link https://primereact.org/datatable/ PrimeReact Table Docs}
 */
export default function App() {
  const colorScheme = useDetectColorScheme();
  const themeUrl = `https://unpkg.com/primereact@10.9.7/resources/themes/${themes[colorScheme]}/theme.css`;

  return (
    <>
      <head>
        <link rel="stylesheet" href={themeUrl} />
      </head>
      <PrimeReactProvider>
        <ExamplesRouter
          pluginId="prime"
          components={{
            basic: Basic,
            "local-data": LocalData,
            "remote-data": RemoteData,
          }}
        />
      </PrimeReactProvider>
    </>
  );
}

// other way to switch theme (must include <link id="theme-link" ... /> in index.html)
// function ThemeSwitcher({ children }: { children: ReactNode }) {
// const negateColorScheme = (colorScheme: "light" | "dark") =>
//   colorScheme === "light" ? "dark" : "light";
//   const colorScheme = useDetectColorScheme();
//   const { changeTheme } = useContext(PrimeReactContext);

//   useEffect(() => {
//     const currentTheme = themes[negateColorScheme(colorScheme)];
//     const nextTheme = themes[colorScheme];
//     changeTheme?.(currentTheme, nextTheme, "theme-link");
//   }, [colorScheme, changeTheme]);

//   return children;
// }
