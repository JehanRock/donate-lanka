import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, TrendingUp, Clock, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortOption = "newest" | "oldest" | "trending" | "funding_goal" | "progress" | "deadline";
export type SortDirection = "asc" | "desc";

interface ProjectSortingProps {
  sortBy: SortOption;
  sortDirection: SortDirection;
  onSortChange: (sortBy: SortOption, direction: SortDirection) => void;
  className?: string;
}

const sortOptions = [
  { value: "newest", label: "Newest First", icon: Clock },
  { value: "oldest", label: "Oldest First", icon: Clock },
  { value: "trending", label: "Most Popular", icon: TrendingUp },
  { value: "funding_goal", label: "Funding Goal", icon: DollarSign },
  { value: "progress", label: "Progress", icon: TrendingUp },
  { value: "deadline", label: "Deadline", icon: Clock },
];

export const ProjectSorting = ({ 
  sortBy, 
  sortDirection, 
  onSortChange, 
  className 
}: ProjectSortingProps) => {
  const handleSortChange = (value: string) => {
    const newSortBy = value as SortOption;
    // Toggle direction if same sort option selected
    const newDirection = (sortBy === newSortBy && sortDirection === "desc") ? "asc" : "desc";
    onSortChange(newSortBy, newDirection);
  };

  const toggleDirection = () => {
    onSortChange(sortBy, sortDirection === "asc" ? "desc" : "asc");
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-sm font-medium text-foreground">Sort by:</span>
      
      <Select value={sortBy} onValueChange={handleSortChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Choose sorting..." />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => {
            const Icon = option.icon;
            return (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="sm"
        onClick={toggleDirection}
        className="p-2"
        title={`Sort ${sortDirection === "asc" ? "descending" : "ascending"}`}
      >
        <ArrowUpDown className={cn(
          "w-4 h-4 transition-transform duration-200",
          sortDirection === "desc" && "rotate-180"
        )} />
      </Button>
    </div>
  );
};