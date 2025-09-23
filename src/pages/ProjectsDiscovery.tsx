import { useState, useEffect, useCallback, useMemo } from "react";
import { ProjectFilters } from "@/types/filters";
import { AdvancedSearch } from "@/components/AdvancedSearch";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ProjectSorting, SortOption, SortDirection } from "@/components/ProjectSorting";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useProjectSorting } from "@/hooks/useProjectSorting";
import { mockProjects } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Loader2, Grid, List, Filter, X, MapPin, DollarSign, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Project, ProjectCategory, ProjectStatus } from "@/types/project";
import { formatCurrency } from "@/utils/currency";

const PROJECTS_PER_PAGE = 12;

// Filter constants
const categories: { label: string; value: ProjectCategory }[] = [
  { label: "Medical", value: "medical" },
  { label: "Education", value: "education" },
  { label: "Technology", value: "technology" },
  { label: "Community", value: "community" },
  { label: "Disaster Relief", value: "disaster_relief" },
  { label: "Animals", value: "animals" },
  { label: "Arts & Culture", value: "arts_culture" },
  { label: "Sports", value: "sports" },
];

const statuses: { label: string; value: ProjectStatus }[] = [
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Draft", value: "draft" },
  { label: "Pending Review", value: "pending_review" },
  { label: "Paused", value: "paused" },
];

const locations = [
  "All Locations",
  "Colombo",
  "Kandy",
  "Galle",
  "Jaffna",
  "Anuradhapura",
  "Negombo",
  "Kurunegala",
  "Ratnapura",
  "Batticaloa",
  "Matara",
];

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
  const [localFundingRange, setLocalFundingRange] = useState(filters.fundingRange);

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

  const updateFilters = (updates: Partial<ProjectFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const toggleCategory = (category: ProjectCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    updateFilters({ categories: newCategories });
  };

  const toggleStatus = (status: ProjectStatus) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    updateFilters({ status: newStatuses });
  };

  const handleFundingRangeChange = (value: number[]) => {
    setLocalFundingRange([value[0], value[1]]);
  };

  const handleFundingRangeCommit = () => {
    updateFilters({ fundingRange: localFundingRange });
  };

  const clearAllFilters = () => {
    const clearedFilters: ProjectFilters = {
      categories: [],
      fundingRange: [0, 1000000],
      location: "All Locations",
      status: [],
      searchQuery: filters.searchQuery, // Keep search query
    };
    setLocalFundingRange([0, 1000000]);
    setFilters(clearedFilters);
  };

  const activeFiltersCount = 
    filters.categories.length + 
    filters.status.length + 
    (filters.location !== "All Locations" ? 1 : 0) + 
    (filters.fundingRange[0] > 0 || filters.fundingRange[1] < 1000000 ? 1 : 0);

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="min-h-screen bg-background">
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
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mb-6">
            <AdvancedSearch
              projects={mockProjects}
              searchQuery={filters.searchQuery}
              onSearchChange={updateSearchQuery}
              onSuggestionSelect={handleProjectSelect}
            />
          </div>
        </div>

        {/* Filter Bar - Kickstarter Style */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Category Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant={filters.categories.length > 0 ? "default" : "outline"}
                  className="h-9"
                >
                  Category
                  {filters.categories.length > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {filters.categories.length}
                    </Badge>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4">
                <div className="space-y-2">
                  <h4 className="font-medium mb-3">Select Categories</h4>
                  {categories.map(category => (
                    <div key={category.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.value}
                        checked={filters.categories.includes(category.value)}
                        onCheckedChange={() => toggleCategory(category.value)}
                      />
                      <label 
                        htmlFor={category.value}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {category.label}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Location Filter */}
            <Select 
              value={filters.location} 
              onValueChange={(value) => updateFilters({ location: value })}
            >
              <SelectTrigger className={cn(
                "w-auto min-w-[140px] h-9",
                filters.location !== "All Locations" && "border-primary"
              )}>
                <MapPin className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant={filters.status.length > 0 ? "default" : "outline"}
                  className="h-9"
                >
                  Status
                  {filters.status.length > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {filters.status.length}
                    </Badge>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-4">
                <div className="space-y-2">
                  <h4 className="font-medium mb-3">Project Status</h4>
                  {statuses.map(status => (
                    <div key={status.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={status.value}
                        checked={filters.status.includes(status.value)}
                        onCheckedChange={() => toggleStatus(status.value)}
                      />
                      <label 
                        htmlFor={status.value}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {status.label}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Funding Range Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant={(filters.fundingRange[0] > 0 || filters.fundingRange[1] < 1000000) ? "default" : "outline"}
                  className="h-9"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Funding Goal
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Funding Goal Range</h4>
                  <Slider
                    value={localFundingRange}
                    onValueChange={handleFundingRangeChange}
                    onValueCommit={handleFundingRangeCommit}
                    max={1000000}
                    min={0}
                    step={10000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatCurrency(localFundingRange[0])}</span>
                    <span>{formatCurrency(localFundingRange[1])}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-9 text-muted-foreground"
              >
                Clear All
                <X className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {filters.categories.map(category => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {categories.find(c => c.value === category)?.label}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => toggleCategory(category)}
                  />
                </Badge>
              ))}
              {filters.status.map(status => (
                <Badge key={status} variant="secondary" className="text-xs">
                  {statuses.find(s => s.value === status)?.label}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => toggleStatus(status)}
                  />
                </Badge>
              ))}
              {filters.location !== "All Locations" && (
                <Badge variant="secondary" className="text-xs">
                  {filters.location}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => updateFilters({ location: "All Locations" })}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>

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
              onClick={clearAllFilters}
              variant="outline"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsDiscovery;