import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X, MapPin, DollarSign, Filter, RotateCcw } from "lucide-react";
import { ProjectCategory, ProjectStatus } from "@/types/project";
import { formatCurrency } from "@/utils/currency";
import { cn } from "@/lib/utils";

export interface ProjectFilters {
  categories: ProjectCategory[];
  fundingRange: [number, number];
  location: string;
  status: ProjectStatus[];
  searchQuery: string;
}

interface ProjectFilterSidebarProps {
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
  className?: string;
}

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

export const ProjectFilterSidebar = ({ 
  filters, 
  onFiltersChange, 
  className 
}: ProjectFilterSidebarProps) => {
  const [localFundingRange, setLocalFundingRange] = useState(filters.fundingRange);

  const updateFilters = (updates: Partial<ProjectFilters>) => {
    onFiltersChange({ ...filters, ...updates });
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
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.status.length > 0 ||
    filters.location !== "All Locations" ||
    filters.fundingRange[0] > 0 ||
    filters.fundingRange[1] < 1000000;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Active Filters:</p>
          <div className="flex flex-wrap gap-1">
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
        </div>
      )}

      <Separator />

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="font-medium">Categories</h4>
        <div className="space-y-2">
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
      </div>

      <Separator />

      {/* Funding Goal Range */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          <h4 className="font-medium">Funding Goal</h4>
        </div>
        <div className="space-y-4">
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
      </div>

      <Separator />

      {/* Location */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <h4 className="font-medium">Location</h4>
        </div>
        <Select 
          value={filters.location} 
          onValueChange={(value) => updateFilters({ location: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map(location => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Project Status */}
      <div className="space-y-3">
        <h4 className="font-medium">Status</h4>
        <div className="space-y-2">
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
      </div>
    </div>
  );
};