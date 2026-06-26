import { transformAsync } from "@babel/core";
import prettier from "prettier";

export async function transpileTsFile(
  content: string,
  isTsx: boolean,
): Promise<string> {
  // using babel instead of typescript.transpileModule as babel supports preserving newlines
  const result = await transformAsync(content, {
    presets: ["@babel/preset-typescript"],
    plugins: isTsx ? ["@babel/plugin-syntax-jsx"] : [],
    retainLines: true,
  });

  const jsContent = result?.code || "";

  return await prettier.format(jsContent, {
    parser: isTsx ? "babel" : "babel-ts",
  });
}
