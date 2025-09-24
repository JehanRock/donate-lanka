import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, DollarSign, Target, Globe, Award, Heart, Zap } from "lucide-react";

export const CategoryAnalytics = () => {
  const overallStats = [
    {
      icon: Target,
      label: "Total Projects",
      value: "579",
      change: "+23%",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: DollarSign,
      label: "Total Raised",
      value: "LKR 16.2M",
      change: "+18%",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      icon: Users,
      label: "Active Donors",
      value: "12,847",
      change: "+31%",
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      icon: Award,
      label: "Success Rate",
      value: "89%",
      change: "+5%",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    }
  ];

  const sdgProgress = [
    { id: 3, title: "Good Health", progress: 87, projects: 125, color: "#4C9F38" },
    { id: 4, title: "Quality Education", progress: 92, projects: 98, color: "#C5192D" },
    { id: 11, title: "Sustainable Cities", progress: 78, projects: 87, color: "#FD9D24" },
    { id: 13, title: "Climate Action", progress: 95, projects: 76, color: "#3F7E44" },
    { id: 8, title: "Decent Work", progress: 83, projects: 64, color: "#A21942" },
    { id: 14, title: "Life Below Water", progress: 91, projects: 52, color: "#0A97D9" }
  ];

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <TrendingUp className="w-3 h-3 mr-1" />
              Live Analytics
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Impact Dashboard
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Real-time insights into how your donations are driving Sri Lanka toward the UN Sustainable Development Goals
          </p>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {overallStats.map((stat, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* SDG Progress */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              UN SDG Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sdgProgress.map((sdg) => (
                <div key={sdg.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img 
                        src={`/sdg-icons/sdg-${sdg.id.toString().padStart(2, '0')}.jpg`}
                        alt={`SDG ${sdg.id}`}
                        className="w-8 h-8 rounded"
                      />
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">SDG {sdg.id}</h4>
                        <p className="text-xs text-muted-foreground">{sdg.title}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {sdg.projects} projects
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{sdg.progress}%</span>
                    </div>
                    <Progress value={sdg.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="w-5 h-5 text-red-500" />
                Most Supported Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-4xl">🏥</div>
                <div>
                  <h3 className="font-bold text-xl text-foreground">Health & Medical</h3>
                  <p className="text-muted-foreground">125 active projects • 87% success rate</p>
                  <Badge className="mt-2 bg-success text-success-foreground">
                    LKR 2.85M raised this month
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-warning/5 to-success/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="w-5 h-5 text-yellow-500" />
                Fastest Growing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-4xl">💻</div>
                <div>
                  <h3 className="font-bold text-xl text-foreground">Innovation & Technology</h3>
                  <p className="text-muted-foreground">35 active projects • 83% success rate</p>
                  <Badge className="mt-2 bg-warning text-warning-foreground">
                    +31% growth this quarter
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};