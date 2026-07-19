import { AdapterCards } from "@/components/AdapterCards";
import { ExamplePageLayout } from "./ExamplePageLayout";

export function ChooseAdapter() {
  return (
    <ExamplePageLayout title="Choose your framework">
      <AdapterCards
        showUpcoming
        hideMetadata
        mainLink={(id) => `/examples/${id}`}
      />
    </ExamplePageLayout>
  );
}
