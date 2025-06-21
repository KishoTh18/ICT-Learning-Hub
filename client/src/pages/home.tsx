import NavigationHeader from "@/components/navigation-header";
import HeroSection from "@/components/hero-section";
import TopicsGrid from "@/components/topics-grid";
import InteractiveDemo from "@/components/interactive-demo";
import QuizSection from "@/components/quiz-section";
import GameSection from "@/components/game-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      <HeroSection />
      <TopicsGrid />
      <InteractiveDemo />
      <QuizSection />
      <GameSection />
      <Footer />
    </div>
  );
}

