import { Hero } from "@/components/Hero";
import { StatisticsCounter } from "@/components/StatisticsCounter";
import { FeaturedCategories } from "@/components/FeaturedCategories";
import { ProjectCategories } from "@/components/ProjectCategories";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <StatisticsCounter />
      <FeaturedCategories />
      <ProjectCategories />
    </div>
  );
};

export default Index;
