import { subscribeRemoteData } from "#examples/remoteData/subscribeRemoteData.ts";
import type { ExampleRenderer } from "#examples/types.ts";
import { createErrorMessage } from "#shared/ErrorMessage.tsx";

/**
 * Fetches remote data and invokes `render` when the request succeeds.
 * Shows loading and error states in `root` until data is available.
 * If `url` is not provided, it defaults to the shared remote-data example URL.
 */
export function mountRemoteDataExample(
  root: HTMLElement,
  render: ExampleRenderer,
  url?: string,
): () => void {
  return subscribeRemoteData((state) => {
    if (state.isLoading) {
      root.replaceChildren("Loading...");
    } else if (state.isError) {
      root.replaceChildren(createErrorMessage({ error: state.error }));
    } else {
      render(state.data);
    }
  }, url);
}
