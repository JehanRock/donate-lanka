import { Link } from "react-router-dom";
import { Calendar, MapPin, Star, Users, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/currency";
import { formatTimeRemaining } from "@/utils/date";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  className?: string;
  size?: "default" | "compact";
}

export const ProjectCard = ({ project, className, size = "default" }: ProjectCardProps) => {
  const progressPercentage = (project.currentAmount / project.fundingGoal) * 100;
  const timeRemaining = formatTimeRemaining(project.endDate);
  const isUrgent = new Date(project.endDate).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000; // 7 days

  return (
    <div className={cn(
      "group bg-background rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20",
      size === "compact" ? "max-w-sm" : "max-w-md",
      className
    )}>
      <Link to={`/projects/${project.id}`} className="block">
        {/* Project Image */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={project.images[0]?.url || project.coverImage || '/placeholder.svg'}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge 
              variant="secondary" 
              className="bg-background/90 backdrop-blur-sm text-foreground"
            >
              {project.category}
            </Badge>
          </div>

          {/* Favorite Button */}
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background p-0"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Handle favorite logic
            }}
          >
            <Heart className="w-4 h-4" />
          </Button>

          {/* Urgent Banner */}
          {isUrgent && (
            <div className="absolute top-0 right-0 bg-secondary text-secondary-foreground px-3 py-1 text-xs font-medium">
              Urgent
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4 lg:p-6">
          {/* Title */}
          <h3 className={cn(
            "font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors",
            size === "compact" ? "text-base" : "text-lg"
          )}>
            {project.title}
          </h3>

          {/* Location */}
          {project.location && (
            <div className="flex items-center text-muted-foreground mb-3">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">
                {project.location.city && project.location.state 
                  ? `${project.location.city}, ${project.location.state}` 
                  : project.location.city || project.location.state || project.location.country}
              </span>
            </div>
          )}

          {/* Progress Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {formatCurrency(project.currentAmount)}
              </span>
              <span className="text-sm text-muted-foreground">
                {progressPercentage.toFixed(0)}%
              </span>
            </div>
            
            <Progress 
              value={progressPercentage} 
              className="h-2 mb-2"
            />
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>of {formatCurrency(project.fundingGoal)}</span>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{project.donorCount} donors</span>
              </div>
            </div>
          </div>

          {/* Time Remaining */}
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{timeRemaining}</span>
          </div>

          {/* Creator Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={project.creator.avatar} />
                <AvatarFallback className="text-xs">
                  {project.creator.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {project.creator.displayName}
                </p>
                {project.creator.verificationStatus === "verified" && (
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-3 h-3",
                            i < Math.floor(project.creator.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground ml-1">
                      ({project.creator.rating})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};