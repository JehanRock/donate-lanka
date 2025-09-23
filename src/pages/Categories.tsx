import { useState } from "react";
import { CategoryHero } from "@/components/CategoryHero";
import { CategoryGrid } from "@/components/CategoryGrid";
import { CategoryAnalytics } from "@/components/CategoryAnalytics";
import { CategoryProjectShowcase } from "@/components/CategoryProjectShowcase";
import { Breadcrumb } from "@/components/Breadcrumb";

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <div className="container-padding bg-muted/30 py-4">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/categories" }
          ]}
        />
      </div>

      {/* Hero Section */}
      <CategoryHero 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Category Analytics */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto container-padding">
          <CategoryAnalytics />
        </div>
      </section>

      {/* Categories Grid */}
      <section className="section-padding">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover amazing projects across different categories. Each category represents a unique way to make a positive impact.
            </p>
          </div>
          
          <CategoryGrid searchQuery={searchQuery} />
        </div>
      </section>

      {/* Featured Projects Showcase */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto container-padding">
          <CategoryProjectShowcase />
        </div>
      </section>
    </div>
  );
};

export default Categories;