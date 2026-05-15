import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HeroSection } from "@/components/home/HeroSection";
import { PlaygroundSection } from "@/components/home/PlaygroundSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <PlaygroundSection />
      <FeaturesSection />
    </main>
  );
}
