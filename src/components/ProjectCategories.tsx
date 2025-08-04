import { useState } from "react";
import { ProjectCategoryFilter } from "./ProjectCategoryFilter";
import { ProjectGrid } from "./ProjectGrid";
import { mockProjects } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const ProjectCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter projects based on selected category
  const filteredProjects = selectedCategory
    ? mockProjects.filter(project => project.category === selectedCategory)
    : mockProjects.slice(0, 8); // Show first 8 projects as featured

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Recent Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover inspiring projects from creators across Sri Lanka. 
            Support causes that matter to you and make a real difference in communities.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <ProjectCategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Projects Grid */}
        <ProjectGrid 
          projects={filteredProjects}
          columns={4}
          className="mb-12"
        />

        {/* View More Button */}
        <div className="text-center">
          <Link to="/projects">
            <Button size="lg" variant="outline" className="px-8">
              View All Projects
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
