import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, MapPin, Clock, Users } from "lucide-react";
import { Project, ProjectCategory } from "@/types/project";
import { mockProjects } from "@/data/mockData";
import { formatCurrency } from "@/utils/currency";
import { formatTimeRemaining } from "@/utils/date";
import { Link } from "react-router-dom";

interface RelatedProjectsProps {
  currentProjectId: string;
  category: ProjectCategory;
  limit?: number;
}

export const RelatedProjects = ({ 
  currentProjectId, 
  category, 
  limit = 4 
}: RelatedProjectsProps) => {
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [savedProjects, setSavedProjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Find projects in the same category, excluding the current project
    const related = mockProjects
      .filter(project => 
        project.id !== currentProjectId && 
        project.category === category &&
        project.status === 'active'
      )
      .slice(0, limit);
    
    setRelatedProjects(related);
  }, [currentProjectId, category, limit]);

  const handleSaveProject = (projectId: string) => {
    setSavedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  if (relatedProjects.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Related Projects
        </h3>
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No related projects found in this category.
          </p>
          <Link to="/projects">
            <Button variant="outline" className="mt-4">
              Browse All Projects
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-foreground">
          Related Projects
        </h3>
        <Link to={`/projects?category=${category}`}>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {relatedProjects.map((project) => {
          const progressPercentage = (project.currentAmount / project.fundingGoal) * 100;
          const timeRemaining = formatTimeRemaining(project.endDate);
          const isSaved = savedProjects.has(project.id);

          return (
            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                {/* Project Image */}
                <div className="md:w-48 aspect-video md:aspect-square">
                  <Link to={`/projects/${project.id}`}>
                    <img
                      src={project.images[0]?.url || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </Link>
                </div>

                {/* Project Info */}
                <div className="flex-1 p-4 md:p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {project.category}
                          </Badge>
                          {project.featured && (
                            <Badge variant="default" className="text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                        
                        <Link to={`/projects/${project.id}`}>
                          <h4 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                            {project.title}
                          </h4>
                        </Link>
                        
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {project.shortDescription}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSaveProject(project.id)}
                        className={`shrink-0 ${isSaved ? 'text-red-500' : 'text-muted-foreground'}`}
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </Button>
                    </div>

                    {/* Location and Creator */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {project.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{project.location.city}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <span>by {project.creator.displayName}</span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">
                          {formatCurrency(project.currentAmount)}
                        </span>
                        <span className="text-muted-foreground">
                          of {formatCurrency(project.fundingGoal)}
                        </span>
                      </div>
                      
                      <Progress value={progressPercentage} className="h-2" />
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{project.donorCount} supporters</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{timeRemaining}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="pt-2">
                      <Link to={`/projects/${project.id}`}>
                        <Button size="sm" className="w-full md:w-auto">
                          View Project
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Browse More */}
      <div className="text-center pt-4">
        <Link to={`/projects?category=${category}`}>
          <Button variant="outline">
            Browse More {category.charAt(0).toUpperCase() + category.slice(1)} Projects
          </Button>
        </Link>
      </div>
    </div>
  );
};