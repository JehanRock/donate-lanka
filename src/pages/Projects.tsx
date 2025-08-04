import { useState } from "react";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ProjectCategoryFilter } from "@/components/ProjectCategoryFilter";
import { Breadcrumb } from "@/components/Breadcrumb";
import { mockProjects } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter projects based on category and search
  const filteredProjects = mockProjects.filter(project => {
    const matchesCategory = !selectedCategory || project.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            All Projects
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover and support amazing projects from creators across Sri Lanka. 
            Find causes that matter to you and make a real difference.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <ProjectCategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground text-center">
            Showing {filteredProjects.length} of {mockProjects.length} projects
          </p>
        </div>

        {/* Projects Grid */}
        <ProjectGrid 
          projects={filteredProjects}
          columns={3}
          className="mb-12"
        />

        {/* Load More Button (placeholder for future pagination) */}
        {filteredProjects.length > 0 && filteredProjects.length >= 12 && (
          <div className="text-center">
            <Button variant="outline" size="lg">
              Load More Projects
            </Button>
          </div>
        )}

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Filter className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No projects found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria to find more projects.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;