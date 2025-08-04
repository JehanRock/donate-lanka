import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProjectCategory } from "@/types/project";

interface ProjectCategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  className?: string;
}

const categories: { label: string; value: ProjectCategory | null }[] = [
  { label: "All Projects", value: null },
  { label: "Medical", value: "medical" },
  { label: "Education", value: "education" },
  { label: "Technology", value: "technology" },
  { label: "Community", value: "community" },
  { label: "Disaster Relief", value: "disaster_relief" },
  { label: "Animals", value: "animals" },
  { label: "Arts & Culture", value: "arts_culture" },
  { label: "Sports", value: "sports" },
];

export const ProjectCategoryFilter = ({ 
  selectedCategory, 
  onCategoryChange, 
  className 
}: ProjectCategoryFilterProps) => {
  return (
    <div className={cn("flex flex-wrap gap-2 justify-center", className)}>
      {categories.map((category) => (
        <Button
          key={category.label}
          variant={selectedCategory === category.value ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.value)}
          className={cn(
            "transition-all duration-200",
            selectedCategory === category.value
              ? "bg-primary text-primary-foreground shadow-md"
              : "hover:bg-muted hover:text-foreground"
          )}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
};