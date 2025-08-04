import { useState, useEffect, useCallback, useMemo } from "react";
import { ProjectFilterSidebar, ProjectFilters } from "@/components/ProjectFilterSidebar";
import { AdvancedSearch } from "@/components/AdvancedSearch";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ProjectSorting, SortOption, SortDirection } from "@/components/ProjectSorting";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useProjectSorting } from "@/hooks/useProjectSorting";
import { mockProjects } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { Loader2, Grid, List, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Project } from "@/types/project";

const PROJECTS_PER_PAGE = 12;

const ProjectsDiscovery = () => {
  const [filters, setFilters] = useState<ProjectFilters>({
    categories: [],
    fundingRange: [0, 1000000],
    location: "All Locations",
    status: [],
    searchQuery: "",
  });
  
  const [sortBy, setSortBy] = useState<SortOption>("trending");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Filter projects based on all criteria
  const filteredProjects = useMemo(() => {
    let filtered = [...mockProjects];

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(project => 
        filters.categories.includes(project.category)
      );
    }

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(project => 
        filters.status.includes(project.status)
      );
    }

    // Funding range filter
    filtered = filtered.filter(project => 
      project.fundingGoal >= filters.fundingRange[0] && 
      project.fundingGoal <= filters.fundingRange[1]
    );

    // Location filter
    if (filters.location !== "All Locations") {
      filtered = filtered.filter(project => 
        project.location?.city === filters.location ||
        project.location?.state === filters.location
      );
    }

    // Search filter
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      
      // Handle special search syntax
      if (query.startsWith('category:')) {
        const categoryQuery = query.replace('category:', '').trim();
        filtered = filtered.filter(project => 
          project.category.toLowerCase().includes(categoryQuery)
        );
      } else if (query.startsWith('creator:')) {
        const creatorQuery = query.replace('creator:', '').trim();
        filtered = filtered.filter(project => 
          project.creator.displayName.toLowerCase().includes(creatorQuery)
        );
      } else {
        // General search
        filtered = filtered.filter(project => 
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.creator.displayName.toLowerCase().includes(query) ||
          project.category.toLowerCase().includes(query)
        );
      }
    }

    return filtered;
  }, [filters]);

  // Apply sorting
  const sortedProjects = useProjectSorting(filteredProjects, sortBy, sortDirection);

  // Paginated projects for display
  const displayedProjects = useMemo(() => {
    return sortedProjects.slice(0, currentPage * PROJECTS_PER_PAGE);
  }, [sortedProjects, currentPage]);

  const hasMoreProjects = displayedProjects.length < sortedProjects.length;
  const totalPages = Math.ceil(sortedProjects.length / PROJECTS_PER_PAGE);

  // Handle infinite scroll load more
  const handleLoadMore = useCallback(async () => {
    if (hasMoreProjects && !isLoading) {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setCurrentPage(prev => prev + 1);
      setIsLoading(false);
    }
  }, [hasMoreProjects, isLoading]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy, sortDirection]);

  const handleSortChange = (newSortBy: SortOption, newDirection: SortDirection) => {
    setSortBy(newSortBy);
    setSortDirection(newDirection);
  };

  const handleProjectSelect = (project: Project) => {
    // Navigate to project details
    window.location.href = `/projects/${project.id}`;
  };

  const updateSearchQuery = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const activeFiltersCount = 
    filters.categories.length + 
    filters.status.length + 
    (filters.location !== "All Locations" ? 1 : 0) + 
    (filters.fundingRange[0] > 0 || filters.fundingRange[1] < 1000000 ? 1 : 0);

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background w-full">
        <div className="container mx-auto px-4 lg:px-6 py-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb />
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  Discover Projects
                </h1>
                <p className="text-muted-foreground">
                  Find and support amazing projects from creators across Sri Lanka
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <SidebarTrigger className="lg:hidden">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SidebarTrigger>
              </div>
            </div>

            {/* Advanced Search */}
            <div className="max-w-2xl">
              <AdvancedSearch
                projects={mockProjects}
                searchQuery={filters.searchQuery}
                onSearchChange={updateSearchQuery}
                onSuggestionSelect={handleProjectSelect}
              />
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar */}
            <Sidebar className="hidden lg:block w-80 border-r">
              <SidebarContent className="p-6">
                <ProjectFilterSidebar
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </SidebarContent>
            </Sidebar>

            {/* Mobile Sidebar */}
            <Sidebar className="lg:hidden">
              <SidebarContent className="p-6">
                <ProjectFilterSidebar
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </SidebarContent>
            </Sidebar>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Controls Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {sortedProjects.length} projects found
                  </span>
                  {activeFiltersCount > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Sorting */}
                  <ProjectSorting
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    onSortChange={handleSortChange}
                    className="hidden sm:flex"
                  />

                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1 border rounded-md p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="h-8 w-8 p-0"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="h-8 w-8 p-0"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Mobile Sorting */}
              <div className="sm:hidden mb-6">
                <ProjectSorting
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  onSortChange={handleSortChange}
                />
              </div>

              {/* Projects Grid */}
              {sortedProjects.length > 0 ? (
                <>
                  <ProjectGrid 
                    projects={displayedProjects}
                    columns={viewMode === "grid" ? 3 : 1}
                    className="mb-8"
                  />

                  {/* Load More Button */}
                  {hasMoreProjects && (
                    <div className="text-center">
                      <Button 
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        size="lg"
                        variant="outline"
                        className="min-w-40"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          `Load More (${sortedProjects.length - displayedProjects.length} remaining)`
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Results Summary */}
                  <div className="mt-8 text-center text-sm text-muted-foreground">
                    Showing {displayedProjects.length} of {sortedProjects.length} projects
                    {currentPage > 1 && (
                      <span> • Page {currentPage} of {totalPages}</span>
                    )}
                  </div>
                </>
              ) : (
                /* No Results */
                <div className="text-center py-16">
                  <Filter className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No projects found
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    We couldn't find any projects matching your current filters. 
                    Try adjusting your search criteria or clearing some filters.
                  </p>
                  <Button 
                    onClick={() => setFilters({
                      categories: [],
                      fundingRange: [0, 1000000],
                      location: "All Locations",
                      status: [],
                      searchQuery: "",
                    })}
                    variant="outline"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProjectsDiscovery;