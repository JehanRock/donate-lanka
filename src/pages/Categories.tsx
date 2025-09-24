import { CategoryHero } from "@/components/CategoryHero";
import { CategoryGrid } from "@/components/CategoryGrid";
import { CategoryAnalytics } from "@/components/CategoryAnalytics";
import { CategoryProjectShowcase } from "@/components/CategoryProjectShowcase";

const Categories = () => {
  return (
    <div className="min-h-screen">
      <CategoryHero />
      <CategoryAnalytics />
      <CategoryGrid />
      <CategoryProjectShowcase />
    </div>
  );
};

export default Categories;