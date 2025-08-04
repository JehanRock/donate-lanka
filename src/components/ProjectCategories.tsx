import { useState } from "react";
import { ProjectCategoryFilter } from "./ProjectCategoryFilter";
import { ProjectGrid } from "./ProjectGrid";
import { ProjectSorting, SortOption, SortDirection } from "./ProjectSorting";
import { mockProjects } from "@/data/mockData";
import { useProjectSorting } from "@/hooks/useProjectSorting";
import { Button } from "@/components/ui/button";
import { ArrowRight, Grid, List } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export const ProjectCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("trending");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAll, setShowAll] = useState(false);

  // Filter projects based on selected category
  const categoryFiltered = selectedCategory
    ? mockProjects.filter(project => project.category === selectedCategory)
    : mockProjects;

  // Apply sorting
  const sortedProjects = useProjectSorting(categoryFiltered, sortBy, sortDirection);
  
  // Show limited or all projects based on state
  const displayedProjects = showAll ? sortedProjects : sortedProjects.slice(0, 8);

  const handleSortChange = (newSortBy: SortOption, newDirection: SortDirection) => {
    setSortBy(newSortBy);
    setSortDirection(newDirection);
  };

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

        {/* Filters and Controls */}
        <div className="space-y-6 mb-8">
          {/* Category Filter */}
          <ProjectCategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Sorting and View Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <ProjectSorting
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
            />
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="p-2"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="p-2"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <ProjectGrid 
          projects={displayedProjects}
          columns={viewMode === "grid" ? 4 : 1}
          className="mb-8"
        />

        {/* View More/Less Buttons */}
        <div className="text-center space-y-4">
          {!showAll && sortedProjects.length > 8 && (
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => setShowAll(true)}
              className="px-8"
            >
              Show More Projects ({sortedProjects.length - 8} more)
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}
          
          {showAll && (
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => setShowAll(false)}
              className="px-8"
            >
              Show Less
            </Button>
          )}
          
          <div>
            <Link to="/projects">
              <Button size="lg" variant="default" className="px-8">
                Browse All Projects
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
