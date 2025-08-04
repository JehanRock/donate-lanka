import { Link } from "react-router-dom";
import { Calendar, MapPin, Star, Users, Heart, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { TrustBadges } from "@/components/TrustBadges";
import { formatCurrency } from "@/utils/currency";
import { formatTimeRemaining } from "@/utils/date";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  className?: string;
  size?: "default" | "compact";
}

export const ProjectCard = ({ project, className, size = "default" }: ProjectCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const progressPercentage = (project.currentAmount / project.fundingGoal) * 100;
  const timeRemaining = formatTimeRemaining(project.endDate);
  const isUrgent = new Date(project.endDate).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000; // 7 days

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && imgRef.current && !imageLoaded && !imageError) {
            const img = imgRef.current;
            img.src = project.images[0]?.url || project.coverImage || '/placeholder.svg';
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [project.images, project.coverImage, imageLoaded, imageError]);

  return (
    <div className={cn(
      "group bg-background rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20",
      size === "compact" ? "max-w-sm" : "max-w-md",
      className
    )}>
      <Link to={`/projects/${project.id}`} className="block">
        {/* Project Image */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          {!imageLoaded && !imageError && (
            <Skeleton className="w-full h-full absolute inset-0" />
          )}
          <img
            ref={imgRef}
            alt={project.title}
            className={cn(
              "w-full h-full object-cover transition-all duration-300 group-hover:scale-105",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          {imageError && (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
              <span className="text-sm">Image unavailable</span>
            </div>
          )}
          
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

          {/* Trust & Verification */}
          {project.trustScore && project.verificationBadges && (
            <div className="mb-4">
              <TrustBadges 
                badges={project.verificationBadges.slice(0, 2)} 
                trustScore={project.trustScore}
                showScore={size !== "compact"}
              />
            </div>
          )}

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