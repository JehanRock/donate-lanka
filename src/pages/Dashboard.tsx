import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentForm } from "@/components/PaymentForm";
import { RealTimeUpdates } from "@/components/RealTimeUpdates";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { NotificationCenter } from "@/components/NotificationCenter";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ProjectGrid } from "@/components/ProjectGrid";
import { 
  Plus, TrendingUp, DollarSign, Users, Eye, Heart,
  BarChart3, Settings, Bell, Smartphone, Award, Target
} from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { mockProjects } from "@/data/mockData";

const Dashboard = () => {
  const userProjects = mockProjects.slice(0, 3); // Show user's projects

  const dashboardStats = [
    {
      title: "Total Raised",
      value: formatCurrency(45623),
      change: "+12.5%",
      changeType: "positive" as const,
      icon: <DollarSign className="w-5 h-5" />,
      description: "Across all your campaigns"
    },
    {
      title: "Active Campaigns",
      value: "3",
      change: "+1",
      changeType: "positive" as const,
      icon: <Target className="w-5 h-5" />,
      description: "Currently running"
    },
    {
      title: "Total Supporters",
      value: "247",
      change: "+18.2%",
      changeType: "positive" as const,
      icon: <Users className="w-5 h-5" />,
      description: "Unique donors"
    },
    {
      title: "Success Rate",
      value: "87%",
      change: "+5.3%",
      changeType: "positive" as const,
      icon: <Award className="w-5 h-5" />,
      description: "Campaign completion rate"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your campaigns and track performance
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <OfflineIndicator />
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </div>

        {/* PWA Install Prompt */}
        <PWAInstallPrompt />

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="text-muted-foreground">
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Badge 
                    variant={stat.changeType === 'positive' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {stat.change}
                  </Badge>
                  <span>{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Common tasks and shortcuts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Campaign
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Bell className="w-4 h-4 mr-2" />
                    Notification Center
                  </Button>
                </CardContent>
              </Card>

              {/* Real-time Updates */}
              <div className="lg:col-span-2">
                <RealTimeUpdates 
                  showGlobal={false}
                  maxItems={6}
                />
              </div>
            </div>

            {/* Recent Campaigns */}
            <Card>
              <CardHeader>
                <CardTitle>Your Recent Campaigns</CardTitle>
                <CardDescription>
                  Overview of your latest fundraising projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectGrid 
                  projects={userProjects}
                  columns={3}
                  size="compact"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>All Your Campaigns</CardTitle>
                    <CardDescription>
                      Manage and monitor all your fundraising campaigns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProjectGrid 
                      projects={userProjects}
                      columns={2}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <PaymentForm 
                  projectId="demo-project"
                  projectTitle="Support Our Platform"
                  minAmount={5}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard 
              projectId="user-projects"
              timeRange="30d"
            />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RealTimeUpdates 
                showGlobal={true}
                maxItems={10}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity Summary</CardTitle>
                  <CardDescription>
                    Your platform activity at a glance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Donations received</span>
                    </div>
                    <Badge variant="secondary">12 today</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Campaign views</span>
                    </div>
                    <Badge variant="secondary">1.2K today</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-sm">New supporters</span>
                    </div>
                    <Badge variant="secondary">8 today</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Goal progress</span>
                    </div>
                    <Badge variant="secondary">+5.2% today</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationCenter />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences and security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Profile Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="w-4 h-4 mr-2" />
                    Notification Preferences
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Payment Methods
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="w-4 h-4 mr-2" />
                    Privacy Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Features</CardTitle>
                  <CardDescription>
                    Access advanced platform capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Advanced Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Mobile App Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Award className="w-4 h-4 mr-2" />
                    Verification Status
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Team Management
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;