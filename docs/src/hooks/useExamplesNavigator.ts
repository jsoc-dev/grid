"use client";

import { useRouter } from "next/navigation";

export function useExamplesNavigator() {
  const router = useRouter();

  return (segments: string[]) => {
    router.push(`/examples/${segments.join("/")}`);
  };
}
