import { Hero } from "@/components/Hero";
import { StatisticsCounter } from "@/components/StatisticsCounter";
import { SDGSection } from "@/components/SDGSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <StatisticsCounter />
      <SDGSection />
    </div>
  );
};

export default Index;
