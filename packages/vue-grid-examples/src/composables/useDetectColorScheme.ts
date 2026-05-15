import { onUnmounted, ref } from "vue";

export function useDetectColorScheme() {
  const colorScheme = ref<"dark" | "light">(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  );

  const matcher = window.matchMedia("(prefers-color-scheme: dark)");

  const onChange = (event: MediaQueryListEvent) => {
    colorScheme.value = event.matches ? "dark" : "light";
  };

  matcher.addEventListener("change", onChange);
  onUnmounted(() => matcher.removeEventListener("change", onChange));

  return colorScheme;
}
