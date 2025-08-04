import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { mockProjects } from "@/data/mockData";
import { Project, ProjectComment } from "@/types/project";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Heart, Share2, MapPin, Calendar, Users } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { formatTimeRemaining } from "@/utils/date";
import { ProjectImageGallery } from "@/components/ProjectImageGallery";
import { DonationForm } from "@/components/DonationForm";
import { ProjectUpdates } from "@/components/ProjectUpdates";
import { ProjectComments } from "@/components/ProjectComments";
import { SocialShare } from "@/components/SocialShare";
import { CreatorProfile } from "@/components/CreatorProfile";
import { RelatedProjects } from "@/components/RelatedProjects";

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

  // Mock comments data
  const mockComments: ProjectComment[] = [
    {
      id: "comment-1",
      projectId: project.id,
      userId: "user-1", 
      user: { displayName: "Alex Thompson", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
      content: "This is such a wonderful initiative! I'm excited to see how this transforms our neighborhood.",
      createdAt: new Date("2024-01-26"),
      likesCount: 12,
      repliesCount: 0,
      isDeleted: false
    }
  ];

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
            {/* Image Gallery */}
            <ProjectImageGallery images={project.images} title={project.title} />

            {/* Project Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{project.category}</Badge>
                    {project.featured && <Badge variant="default">Featured</Badge>}
                    {project.urgent && <Badge variant="destructive">Urgent</Badge>}
                  </div>
                  <SocialShare 
                    projectTitle={project.title}
                    projectDescription={project.shortDescription}
                    projectUrl={`/projects/${project.id}`}
                  />
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {project.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {project.shortDescription}
                </p>
              </div>

              {/* Location and Date */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {project.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location.city}, {project.location.state}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Started {project.createdAt.toLocaleDateString()}</span>
                </div>
              </div>

              {/* Project Details Tabs */}
              <Tabs defaultValue="story" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="story">Story</TabsTrigger>
                  <TabsTrigger value="updates">Updates</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="faqs">FAQs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="story" className="mt-6">
                  <div className="prose max-w-none">
                    <p className="text-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="updates" className="mt-6">
                  <ProjectUpdates 
                    updates={project.updates}
                    creatorName={project.creator.displayName}
                    creatorAvatar={project.creator.avatar}
                  />
                </TabsContent>
                
                <TabsContent value="comments" className="mt-6">
                  <ProjectComments comments={mockComments} projectId={project.id} />
                </TabsContent>
                
                <TabsContent value="faqs" className="mt-6">
                  {project.faqs.length > 0 ? (
                    <div className="space-y-4">
                      {project.faqs.map((faq) => (
                        <div key={faq.id} className="border rounded-lg p-4">
                          <h4 className="font-semibold text-foreground mb-2">{faq.question}</h4>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No FAQs available yet.</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Donation Form */}
            <DonationForm 
              projectId={project.id}
              projectTitle={project.title}
            />

            {/* Creator Profile */}
            <CreatorProfile creator={project.creator} />
          </div>
        </div>

        {/* Related Projects */}
        <div className="mt-12">
          <RelatedProjects 
            currentProjectId={project.id}
            category={project.category}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;