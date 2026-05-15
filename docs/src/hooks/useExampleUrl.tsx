"use client";

import {
  getExampleUrl,
  type ExampleId,
  type FrameworkId,
  type PluginId,
} from "@jsoc/grid-docs";
import { useQuery } from "@tanstack/react-query";

export function useExampleUrl<
  F extends FrameworkId,
  P extends PluginId<F>,
  E extends ExampleId<F, P>,
>(frameworkId: F, pluginId: P, exampleId: E) {
  const url = getExampleUrl(frameworkId, pluginId, exampleId);

  const queryFn = async () => {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (!res.ok) {
        throw new Error("Example not found");
      }
      return url;
    } catch (err) {
      throw new Error("Example not found", { cause: err });
    }
  };

  const result = useQuery({ queryKey: ["example-url", url], queryFn });
  return { url, ...result };
}

// Scenarios of invalid urls:
// Scenario 1: Completely invalid URL
// - Like "/invalid-path/index.html" or "/examples/invalid-path/index.html/invalid-path"
// - In this case, this app's root layout and root not-found page will be rendered inside the preview.
// - This will mirror this whole app inside the preview, which will easily confuse viewers
// - To prevent this, URL validation is being done
//
// Scenario 2: Valid URL to index.html but wrong example id
// - Like "/examples/correct-path/index.html?e=wrong-id"
// - In this case, index file is served from public/ directory.
// - It renders example's app -> ExampleRouter->ExampleDispatcher->ExampleNotFound
// - This is fine and currently being rendered as it is since it doesn't mirror this app

// other options considered to prevent the mirroring caused in Scenario 1
// 1. moving Nextra's Layout component from the root layout to (docs)/layout.tsx and keeping root layout minimal
// but Nextra's <Head> still remains in root layout and we can't move it to (docs)/layout.tsx
// since root layout must contain <body> and moving Head will make Head child of body, which will cause errors
// on the other hand if we keep Head in root layout, it injects custom css, scripts etc in <head> so it will reflect
// in example's preview, this is not ideal

// 2. other option is to check current request pathname (using usePathname in root layout.tsx)
// if it starts with /examples/ then don't render Nextra's Layout,
// but for this we will have to make the root layout client componment
// OR we can use proxy.ts to set custom header "x-pathname" which stores pathname of request
// and in root layout.tsx read header and conditionally render Nextra's Layout
// but proxy.ts  requires server which won't be available in next.js static export build (which i am planning)
