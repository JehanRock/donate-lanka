import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, FolderOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Category } from "@/types/category";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onViewProjects: (categoryId: string) => void;
}

export const CategoryCard = ({ category, onEdit, onDelete, onViewProjects }: CategoryCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-l-4" style={{ borderLeftColor: category.color }}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0" 
              style={{ backgroundColor: category.color }}
              aria-label={`Category color: ${category.color}`}
            />
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg font-semibold truncate">{category.name}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                {category.description}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Category options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(category)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewProjects(category.id)}>
                <FolderOpen className="h-4 w-4 mr-2" />
                View Projects
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(category.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FolderOpen className="h-4 w-4" />
            <span>{category.projectCount} projects</span>
          </div>
          <time className="text-xs text-muted-foreground">
            {category.createdAt.toLocaleDateString()}
          </time>
        </div>
        {category.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {category.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {category.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{category.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
