import { TrendingUp, Target, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockProjects } from "@/data/mockData";
import { CATEGORY_DATA } from "@/data/categories";

export const CategoryAnalytics = () => {
  // Calculate overall statistics
  const totalProjects = mockProjects.length;
  const activeProjects = mockProjects.filter(p => p.status === 'active').length;
  const totalFunding = mockProjects.reduce((sum, p) => sum + p.currentAmount, 0);
  const totalDonors = mockProjects.reduce((sum, p) => sum + p.donorCount, 0);
  const successfulProjects = mockProjects.filter(p => p.status === 'completed').length;
  const successRate = Math.round((successfulProjects / totalProjects) * 100);

  // Find most active category
  const categoryStats = Object.values(CATEGORY_DATA).map(category => {
    const categoryProjects = mockProjects.filter(p => p.category === category.id);
    return {
      ...category,
      projectCount: categoryProjects.length,
      totalFunding: categoryProjects.reduce((sum, p) => sum + p.currentAmount, 0)
    };
  });

  const mostActiveCategory = categoryStats.reduce((prev, current) => 
    prev.projectCount > current.projectCount ? prev : current
  );

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
          Platform Analytics
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Real-time insights into our crowdfunding platform's performance across all categories
        </p>
      </div>

      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Projects
              </CardTitle>
              <Target className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-foreground mb-1">
              {totalProjects}
            </div>
            <div className="flex items-center text-sm">
              <Badge variant="secondary" className="bg-success/20 text-success">
                {activeProjects} Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-success/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Funding
              </CardTitle>
              <DollarSign className="h-5 w-5 text-success" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-foreground mb-1">
              {formatCurrency(totalFunding)}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 mr-1 text-success" />
              +12% this month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-secondary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Supporters
              </CardTitle>
              <Users className="h-5 w-5 text-secondary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-foreground mb-1">
              {totalDonors.toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 mr-1 text-success" />
              +8% this week
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-warning/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Success Rate
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-warning" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-foreground mb-1">
              {successRate}%
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              {successfulProjects} completed projects
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Most Active Category Highlight */}
      <Card className="bg-gradient-primary text-primary-foreground border-0 overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-heading font-bold mb-2">
                Most Active Category
              </h3>
              <p className="text-primary-foreground/80 mb-4">
                Leading the way in community engagement and funding
              </p>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
                  {mostActiveCategory.name}
                </Badge>
                <span className="text-lg font-semibold">
                  {mostActiveCategory.projectCount} Projects
                </span>
                <span className="text-lg font-semibold">
                  {formatCurrency(mostActiveCategory.totalFunding)} Raised
                </span>
              </div>
            </div>
            <TrendingUp className="h-16 w-16 text-primary-foreground/30" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};