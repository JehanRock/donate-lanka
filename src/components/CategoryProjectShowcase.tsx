import { useState } from "react";
import { ArrowRight, Clock, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockProjects } from "@/data/mockData";
import { CATEGORY_DATA } from "@/data/categories";
import { formatCurrency } from "@/utils/currency";
import { Link } from "react-router-dom";

export const CategoryProjectShowcase = () => {
  const [selectedCategory, setSelectedCategory] = useState("trending");

  // Get featured projects for each category
  const getFeaturedProjects = (categoryId: string, limit = 3) => {
    return mockProjects
      .filter(p => p.category === categoryId)
      .sort((a, b) => b.donorCount - a.donorCount)
      .slice(0, limit);
  };

  // Get trending projects (high donor count and recent activity)
  const getTrendingProjects = (limit = 6) => {
    return mockProjects
      .filter(p => p.status === 'active')
      .sort((a, b) => {
        const trendingScoreA = a.donorCount + (a.currentAmount / a.fundingGoal) * 100;
        const trendingScoreB = b.donorCount + (b.currentAmount / b.fundingGoal) * 100;
        return trendingScoreB - trendingScoreA;
      })
      .slice(0, limit);
  };

  // Get urgent projects (close to deadline)
  const getUrgentProjects = (limit = 6) => {
    const now = new Date();
    return mockProjects
      .filter(p => p.status === 'active')
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
      .slice(0, limit);
  };

  const ProjectCard = ({ project }: { project: any }) => {
    const progress = (project.currentAmount / project.fundingGoal) * 100;
    const daysLeft = Math.ceil(
      (new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    const category = CATEGORY_DATA[project.category as keyof typeof CATEGORY_DATA];

    return (
      <Card className="group card-hover bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30">
        <CardContent className="p-0">
          {/* Project Image */}
          <div className="relative overflow-hidden rounded-t-lg h-48">
            <img 
              src={project.images[0]?.url || "/placeholder.svg"} 
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3">
              <Badge 
                variant="secondary" 
                className="bg-card/90 backdrop-blur-sm"
                style={{ color: category?.color }}
              >
                {category?.name}
              </Badge>
            </div>
            {project.isUrgent && (
              <div className="absolute top-3 right-3">
                <Badge variant="destructive" className="bg-warning text-warning-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  Urgent
                </Badge>
              </div>
            )}
          </div>

          <div className="p-6">
            <h3 className="font-heading font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Progress */}
            <div className="space-y-3 mb-4">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-foreground">
                    {formatCurrency(project.currentAmount)}
                  </span>
                  <span className="text-muted-foreground">
                    of {formatCurrency(project.fundingGoal)}
                  </span>
                </div>
                <span className="text-primary font-medium">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{project.donorCount} supporters</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{daysLeft} days left</span>
              </div>
            </div>

            {/* Action */}
            <Link to={`/projects/${project.id}`}>
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                View Project
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
          Featured Projects
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover inspiring projects making a real difference in communities across various categories
        </p>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:inline-flex">
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="urgent" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Urgent
          </TabsTrigger>
          <TabsTrigger value="medical" className="flex items-center gap-2">
            Medical
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getTrendingProjects(6).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="urgent" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getUrgentProjects(6).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="medical" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFeaturedProjects("medical", 6).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <div className="text-center pt-8">
        <Link to="/projects">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-600">
            View All Projects
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};