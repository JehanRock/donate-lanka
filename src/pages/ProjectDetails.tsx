import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { mockProjects } from "@/data/mockData";
import { Project } from "@/types/project";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Heart, Share2, MapPin, Calendar, Users } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { formatTimeRemaining } from "@/utils/date";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (id) {
      const foundProject = mockProjects.find(p => p.id === id);
      setProject(foundProject || null);
    }
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 lg:px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Project Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/projects')}>
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = (project.currentAmount / project.fundingGoal) * 100;
  const timeRemaining = formatTimeRemaining(project.endDate);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb 
            items={[
              { label: "Projects", href: "/projects" },
              { label: project.title }
            ]}
          />
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/projects')}
            className="px-0"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Projects
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="aspect-video rounded-lg overflow-hidden">
              <img
                src={project.images[0]?.url || "/placeholder.svg"}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Project Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">{project.category}</Badge>
                  {project.featured && (
                    <Badge variant="default">Featured</Badge>
                  )}
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {project.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {project.description}
                </p>
              </div>

              {/* Location and Date */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{project.location.city}, {project.location.state}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Started {project.createdAt.toLocaleDateString()}</span>
                </div>
              </div>

              {/* Story Content */}
              <div className="prose max-w-none">
                <p className="text-foreground leading-relaxed">
                  This project is making a real difference in the community. Support this amazing cause and help make an impact.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Funding Card */}
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(project.currentAmount)}
                </div>
                <div className="text-sm text-muted-foreground">
                  raised of {formatCurrency(project.fundingGoal)} goal
                </div>
              </div>

              <Progress 
                value={progressPercentage} 
                className="h-3"
              />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-foreground">
                    {project.donorCount}
                  </div>
                  <div className="text-muted-foreground">donors</div>
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {timeRemaining}
                  </div>
                  <div className="text-muted-foreground">to go</div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Button className="w-full" size="lg">
                  Donate Now
                </Button>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Heart className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Creator Info */}
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Project Creator</h3>
              
              <div className="flex items-start gap-3">
                <img
                  src={project.creator.avatar || "/placeholder.svg"}
                  alt={project.creator.displayName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-medium text-foreground">
                    {project.creator.displayName}
                  </div>
                  {project.creator.verificationStatus === 'verified' && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      Verified Creator
                    </Badge>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    Creating positive change in the community through meaningful projects.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;