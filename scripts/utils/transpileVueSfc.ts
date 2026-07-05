import { transpileTsFile } from "#scripts/utils/transpileTsFile.ts";

import { extractScriptsFromVueSfc } from "@jsoc/grid-docs";

export async function transpileVueSfc(content: string): Promise<string> {
  const scripts = extractScriptsFromVueSfc(content);
  let transpiledContent = content;

  for (const script of scripts) {
    if (script.lang === "typescript" || script.lang === "tsx") {
      const scriptLines = script.script.split("\n");
      const isTsx = script.lang === "tsx";

      const openTag = scriptLines[0].replace(
        /\blang="[^"]*"/,
        isTsx ? 'lang="jsx"' : 'lang="js"',
      );
      const innerContent = scriptLines.slice(1, -1).join("\n");
      const jsCode = await transpileTsFile(innerContent, isTsx);

      const endTag = scriptLines[scriptLines.length - 1];
      const newScript = [openTag, jsCode.replace(/\n+$/, ""), endTag].join(
        "\n",
      );

      // Safe string replacement: pass a function to avoid $ replacement token bugs
      transpiledContent = transpiledContent.replace(
        script.script,
        () => newScript,
      );
    }
  }

  return transpiledContent;
}
