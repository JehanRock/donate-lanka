import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp } from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_DATA } from "@/data/categories";
import { mockProjects } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface CategoryGridProps {
  searchQuery?: string;
}

export const CategoryGrid = ({ searchQuery = "" }: CategoryGridProps) => {
  // Filter categories based on search query
  const filteredCategories = Object.values(CATEGORY_DATA).filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.popularTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculate statistics for each category
  const getCategoryStats = (categoryId: string) => {
    const projects = mockProjects.filter(p => p.category === categoryId);
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const totalFunding = projects.reduce((sum, p) => sum + p.currentAmount, 0);
    const successRate = projects.length > 0 
      ? Math.round((projects.filter(p => p.status === 'completed').length / projects.length) * 100)
      : 0;

    return { activeProjects, totalFunding, successRate, totalProjects: projects.length };
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
    return IconComponent || Icons.Folder;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredCategories.map((category) => {
        const stats = getCategoryStats(category.id);
        const IconComponent = getIconComponent(category.icon);
        
        return (
          <Card 
            key={category.id} 
            className={cn(
              "group card-hover border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden",
              "hover:border-primary/30 transition-all duration-300"
            )}
          >
            <CardContent className="p-0">
              {/* Category Header with Icon */}
              <div 
                className="p-6 pb-4 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${category.color}15 0%, ${category.color}05 100%)`
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="p-3 rounded-xl shadow-sm"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <IconComponent 
                      className="h-6 w-6" 
                      style={{ color: category.color }}
                    />
                  </div>
                  
                  {stats.activeProjects > 5 && (
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>

                <h3 className="text-xl font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {category.description}
                </p>
              </div>

              {/* Statistics */}
              <div className="px-6 pb-4">
                <div className="grid grid-cols-2 gap-4 text-center py-4 border-t border-border/30">
                  <div>
                    <div className="text-lg font-semibold text-foreground">
                      {stats.activeProjects}
                    </div>
                    <div className="text-xs text-muted-foreground">Active Projects</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-success">
                      {stats.successRate}%
                    </div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                </div>

                {/* Popular Tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {category.popularTags.slice(0, 3).map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="text-xs bg-muted/50 border-muted-foreground/20"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Link to={`/projects?category=${category.id}`}>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                  >
                    Browse Projects
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};