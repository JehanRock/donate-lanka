import { ProjectCard } from "./ProjectCard";
import { Project } from "@/types/project";
import { cn } from "@/lib/utils";

interface ProjectGridProps {
  projects: Project[];
  className?: string;
  columns?: 1 | 2 | 3 | 4;
  size?: "default" | "compact";
}

export const ProjectGrid = ({ 
  projects, 
  className, 
  columns = 4,
  size = "default" 
}: ProjectGridProps) => {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
  };

  return (
    <div className={cn(
      "grid gap-6",
      gridClasses[columns],
      className
    )}>
      {projects.map((project, index) => (
        <div 
          key={project.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <ProjectCard 
            project={project} 
            size={size}
            className="h-full" 
          />
        </div>
      ))}
    </div>
  );
};