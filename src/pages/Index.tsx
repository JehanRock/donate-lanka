import { Hero } from "@/components/Hero";
import { StatisticsCounter } from "@/components/StatisticsCounter";
import { SDGSection } from "@/components/SDGSection";
import { SDGCategoriesSection } from "@/components/SDGCategoriesSection";
import { FeaturedCategories } from "@/components/FeaturedCategories";
import { ProjectCategories } from "@/components/ProjectCategories";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <StatisticsCounter />
      <SDGSection />
      <SDGCategoriesSection />
      <FeaturedCategories />
      <ProjectCategories />
    </div>
  );
};

export default Index;
