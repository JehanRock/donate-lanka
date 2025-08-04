import { Hero } from "@/components/Hero";
import { StatisticsCounter } from "@/components/StatisticsCounter";
import { ProjectCategories } from "@/components/ProjectCategories";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <StatisticsCounter />
      <ProjectCategories />
    </div>
  );
};

export default Index;
