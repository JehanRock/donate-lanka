import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Settings, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  BarChart3,
  UserCheck
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for admin dashboard
  const stats = {
    totalUsers: 15847,
    totalProjects: 234,
    totalFunding: 2456789,
    activeProjects: 89,
    pendingApprovals: 12,
    successRate: 87
  };

  const recentProjects = [
    { id: 1, title: 'Clean Water Initiative', creator: 'Sarah Johnson', status: 'pending', amount: 25000 },
    { id: 2, title: 'Education for All', creator: 'Michael Chen', status: 'approved', amount: 45000 },
    { id: 3, title: 'Solar Power Village', creator: 'Priya Patel', status: 'under_review', amount: 67000 },
  ];

  const recentUsers = [
    { id: 1, name: 'Alice Smith', email: 'alice@email.com', joined: '2024-01-15', status: 'active' },
    { id: 2, name: 'Bob Wilson', email: 'bob@email.com', joined: '2024-01-14', status: 'pending' },
    { id: 3, name: 'Carol Brown', email: 'carol@email.com', joined: '2024-01-13', status: 'active' },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'destructive', text: 'Pending' },
      approved: { variant: 'default', text: 'Approved' },
      under_review: { variant: 'secondary', text: 'Under Review' },
      active: { variant: 'default', text: 'Active' },
    } as const;

    const config = variants[status as keyof typeof variants];
    return <Badge variant={config.variant as any}>{config.text}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Complete overview and control center for platform management
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Administrator
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalFunding.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+23% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.successRate}%</div>
              <Progress value={stats.successRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Approvals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Pending Approvals
                  </CardTitle>
                  <CardDescription>
                    Projects waiting for admin approval
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <p className="text-sm text-muted-foreground">by {project.creator}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">${project.amount.toLocaleString()}</span>
                        {getStatusBadge(project.status)}
                      </div>
                    </div>
                  ))}
                  <Button className="w-full" variant="outline">
                    View All Pending
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Latest platform activities and events
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                      <div className="text-sm">
                        <p>Project "Clean Water Initiative" approved</p>
                        <p className="text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <UserCheck className="h-4 w-4 text-blue-500 mt-1" />
                      <div className="text-sm">
                        <p>New user registration: Alice Smith</p>
                        <p className="text-muted-foreground">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-1" />
                      <div className="text-sm">
                        <p>Project flagged for review</p>
                        <p className="text-muted-foreground">6 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    View Activity Log
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Management</CardTitle>
                <CardDescription>
                  Review, approve, and manage all projects on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{project.title}</h4>
                        <p className="text-sm text-muted-foreground">Created by {project.creator}</p>
                        <p className="text-sm font-medium mt-1">Goal: ${project.amount.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(project.status)}
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View</Button>
                          <Button size="sm">Approve</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts, permissions, and verification status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-sm text-muted-foreground">Joined: {user.joined}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(user.status)}
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View Profile</Button>
                          <Button size="sm" variant="outline">Edit</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Platform Analytics
                </CardTitle>
                <CardDescription>
                  Comprehensive insights and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground">
                  Detailed analytics and reporting features would be implemented here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Platform Settings
                </CardTitle>
                <CardDescription>
                  Configure platform settings, policies, and system preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Platform Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Platform Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Auto-approve projects</label>
                          <p className="text-xs text-muted-foreground">Automatically approve new project submissions</p>
                        </div>
                        <input type="checkbox" className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Email notifications</label>
                          <p className="text-xs text-muted-foreground">Send email alerts for admin actions</p>
                        </div>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Public registration</label>
                          <p className="text-xs text-muted-foreground">Allow new user registrations</p>
                        </div>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Security Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Two-factor authentication</label>
                          <p className="text-xs text-muted-foreground">Require 2FA for admin accounts</p>
                        </div>
                        <input type="checkbox" className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Session timeout</label>
                          <p className="text-xs text-muted-foreground">Auto-logout after inactivity</p>
                        </div>
                        <select className="text-sm border rounded px-2 py-1">
                          <option>30 minutes</option>
                          <option>1 hour</option>
                          <option>2 hours</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Login attempts</label>
                          <p className="text-xs text-muted-foreground">Max failed login attempts</p>
                        </div>
                        <select className="text-sm border rounded px-2 py-1">
                          <option>3</option>
                          <option>5</option>
                          <option>10</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Content Moderation */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Content Moderation</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Content filters</label>
                          <p className="text-xs text-muted-foreground">Automatic content screening</p>
                        </div>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Manual review required</label>
                          <p className="text-xs text-muted-foreground">All projects need admin approval</p>
                        </div>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Comment moderation</label>
                          <p className="text-xs text-muted-foreground">Pre-moderate user comments</p>
                        </div>
                        <input type="checkbox" className="rounded" />
                      </div>
                    </div>
                  </div>

                  {/* Payment Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Payment Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Platform fee</label>
                          <p className="text-xs text-muted-foreground">Percentage fee on donations</p>
                        </div>
                        <input type="number" className="text-sm border rounded px-2 py-1 w-20" defaultValue="5" min="0" max="100" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Minimum donation</label>
                          <p className="text-xs text-muted-foreground">Minimum amount per donation</p>
                        </div>
                        <input type="number" className="text-sm border rounded px-2 py-1 w-20" defaultValue="1" min="1" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Payout frequency</label>
                          <p className="text-xs text-muted-foreground">How often to process payouts</p>
                        </div>
                        <select className="text-sm border rounded px-2 py-1">
                          <option>Weekly</option>
                          <option>Bi-weekly</option>
                          <option>Monthly</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}