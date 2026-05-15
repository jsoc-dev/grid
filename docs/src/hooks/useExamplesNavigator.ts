"use client";

import { useRouter } from "next/navigation";

export function useExamplesNavigator() {
  const router = useRouter();

  const navigateToExample = (segments: string[]) => {
    const basePath = "/examples/";
    const examplesPath = segments.join("/");
    const path = `${basePath}${examplesPath}`;
    router.push(path);
  };

  return navigateToExample;
}
