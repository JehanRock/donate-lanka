import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, MapPin, Users, DollarSign, Heart, ArrowRight, Zap } from "lucide-react";
import { mockProjects } from "@/data/mockData";

export const CategoryProjectShowcase = () => {
  // Get featured projects from each major category
  const featuredProjects = [
    mockProjects.find(p => p.category === "medical" && p.status === "active"),
    mockProjects.find(p => p.category === "education" && p.status === "active"),
    mockProjects.find(p => p.category === "disaster_relief" && p.status === "active"),
    mockProjects.find(p => p.category === "community" && p.status === "active"),
  ].filter(Boolean);

  const urgentProjects = mockProjects
    .filter(p => p.urgent && p.status === "active")
    .slice(0, 2);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProgress = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const getDaysLeft = (endDate: Date) => {
    const today = new Date();
    const deadlineDate = new Date(endDate);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="container mx-auto max-w-7xl">
        {/* Urgent Projects Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Zap className="w-6 h-6 text-red-500" />
                Urgent Projects
              </h2>
              <p className="text-muted-foreground">
                Time-sensitive projects that need immediate support
              </p>
            </div>
            <Button variant="outline" onClick={() => window.location.href = "/projects?urgent=true"}>
              View All Urgent
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {urgentProjects.map((project) => (
              <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 border-2 border-red-200 dark:border-red-800">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={project.images[0]?.url || project.coverImage}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white">
                      <Clock className="w-3 h-3 mr-1" />
                      {getDaysLeft(project.endDate)} days left
                    </Badge>
                    <Button
                      size="sm"
                      className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/20"
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      Donate Now
                    </Button>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">{project.category.replace('_', ' ')}</Badge>
                      <Badge variant="secondary">
                        <MapPin className="w-3 h-3 mr-1" />
                        {project.location?.city || project.location?.country || 'Sri Lanka'}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">
                          {formatCurrency(project.currentAmount)} of {formatCurrency(project.fundingGoal)}
                        </span>
                      </div>
                      <Progress value={calculateProgress(project.currentAmount, project.fundingGoal)} className="h-3" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {project.donorCount} donors
                        </span>
                        <span>{Math.round(calculateProgress(project.currentAmount, project.fundingGoal))}% funded</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Projects by Category */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Projects by Category
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover impactful projects across our main categories, each contributing to specific UN SDGs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProjects.map((project) => (
              <Card key={project.id} className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={project.images[0]?.url || project.coverImage}
                      alt={project.title}
                      className="w-full h-40 object-cover"
                    />
                    <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground">
                      {project.category.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-base text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    
                    <div className="flex items-center text-xs text-muted-foreground mb-3">
                      <MapPin className="w-3 h-3 mr-1" />
                      {project.location?.city || project.location?.country || 'Sri Lanka'}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Raised</span>
                        <span className="font-semibold text-primary">
                          {formatCurrency(project.currentAmount)}
                        </span>
                      </div>
                      <Progress value={calculateProgress(project.currentAmount, project.fundingGoal)} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {project.donorCount}
                        </span>
                        <span>{Math.round(calculateProgress(project.currentAmount, project.fundingGoal))}%</span>
                      </div>
                    </div>

                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                      onClick={() => window.location.href = `/projects/${project.id}`}
                    >
                      View Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="bg-muted/30 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Ready to Make a Difference?
              </h3>
              <p className="text-muted-foreground mb-6">
                Explore all projects across categories or start your own campaign to drive positive change in Sri Lanka
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => window.location.href = "/projects"}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <DollarSign className="mr-2 h-5 w-5" />
                  Browse All Projects
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.href = "/create"}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Start Your Campaign
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};