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
      "group bg-background rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/30 transform-gpu",
      "w-full max-w-sm mx-auto", // Compact and uniform width
      className
    )}>
      <Link to={`/projects/${project.id}`} className="block">
        {/* Project Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {!imageLoaded && !imageError && (
            <Skeleton className="w-full h-full absolute inset-0" />
          )}
          <img
            ref={imgRef}
            alt={project.title}
            className={cn(
              "w-full h-full object-cover transition-all duration-300 group-hover:scale-102",
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
          <div className="absolute top-2 left-2">
            <Badge 
              variant="secondary" 
              className="bg-background/90 backdrop-blur-sm text-foreground text-xs px-2 py-1"
            >
              {project.category}
            </Badge>
          </div>

          {/* Favorite Button */}
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background p-0"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Handle favorite logic
            }}
          >
            <Heart className="w-3.5 h-3.5" />
          </Button>

          {/* Urgent Banner */}
          {isUrgent && (
            <div className="absolute top-0 right-0 bg-secondary text-secondary-foreground px-2 py-1 text-xs font-medium rounded-bl-lg">
              Urgent
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors text-base leading-tight">
            {project.title}
          </h3>

          {/* Location */}
          {project.location && (
            <div className="flex items-center text-muted-foreground mb-3">
              <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
              <span className="text-xs truncate">
                {project.location.city && project.location.state 
                  ? `${project.location.city}, ${project.location.state}` 
                  : project.location.city || project.location.state || project.location.country}
              </span>
            </div>
          )}

          {/* Progress Section */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold text-foreground">
                {formatCurrency(project.currentAmount)}
              </span>
              <span className="text-xs text-muted-foreground">
                {progressPercentage.toFixed(0)}%
              </span>
            </div>
            
            <Progress 
              value={progressPercentage} 
              className="h-1.5 mb-2"
            />
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>of {formatCurrency(project.fundingGoal)}</span>
              <div className="flex items-center">
                <Users className="w-3 h-3 mr-1" />
                <span>{project.donorCount}</span>
              </div>
            </div>
          </div>

          {/* Time Remaining */}
          <div className="flex items-center text-xs text-muted-foreground mb-3">
            <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
            <span>{timeRemaining}</span>
          </div>

          {/* Trust & Verification - Compact */}
          {project.trustScore && project.verificationBadges && (
            <div className="mb-3">
              <TrustBadges 
                badges={project.verificationBadges.slice(0, 2)} 
                trustScore={project.trustScore}
                showScore={true}
                compact={true}
              />
            </div>
          )}

          {/* Creator Info - Compact */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <Avatar className="w-6 h-6 flex-shrink-0">
                <AvatarImage src={project.creator.avatar} />
                <AvatarFallback className="text-[10px]">
                  {project.creator.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground truncate">
                  {project.creator.displayName}
                </p>
                {project.creator.verificationStatus === "verified" && (
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-2.5 h-2.5",
                            i < Math.floor(project.creator.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground ml-1">
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