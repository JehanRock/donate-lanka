import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { CategoryFilters } from "@/types/category";

interface CategoryFilterProps {
  filters: CategoryFilters;
  onFiltersChange: (filters: CategoryFilters) => void;
  totalCount: number;
  filteredCount: number;
}

export const CategoryFilter = ({ 
  filters, 
  onFiltersChange, 
  totalCount, 
  filteredCount 
}: CategoryFilterProps) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleSortChange = (field: 'sortBy' | 'sortOrder', value: string) => {
    onFiltersChange({ 
      ...filters, 
      [field]: value as any 
    });
  };

  const handleReset = () => {
    onFiltersChange({
      search: "",
      sortBy: "name",
      sortOrder: "asc"
    });
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Filter Categories</h3>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredCount} of {totalCount} categories
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
            aria-label="Search categories"
          />
        </div>

        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Advanced Filters
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sort-by">Sort By</Label>
                <Select 
                  value={filters.sortBy} 
                  onValueChange={(value) => handleSortChange('sortBy', value)}
                >
                  <SelectTrigger id="sort-by">
                    <SelectValue placeholder="Select sort field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="projectCount">Project Count</SelectItem>
                    <SelectItem value="createdAt">Date Created</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort-order">Sort Order</Label>
                <Select 
                  value={filters.sortOrder} 
                  onValueChange={(value) => handleSortChange('sortOrder', value)}
                >
                  <SelectTrigger id="sort-order">
                    <SelectValue placeholder="Select sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={handleReset} size="sm">
                Reset Filters
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
