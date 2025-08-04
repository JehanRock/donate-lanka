import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { 
  TrendingUp, TrendingDown, DollarSign, Users, Eye, Heart,
  Download, Calendar, Target, Clock, Globe, MapPin,
  Share2, MessageCircle, Star, Award
} from "lucide-react";
import { formatCurrency } from "@/utils/currency";

interface AnalyticsDashboardProps {
  projectId?: string;
  timeRange?: '7d' | '30d' | '90d' | '1y' | 'all';
  className?: string;
}

interface Metric {
  label: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface ChartData {
  name: string;
  value: number;
  donations?: number;
  views?: number;
  shares?: number;
  date?: string;
  color?: string;
}

const generateMockData = (days: number): ChartData[] => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    
    return {
      name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      date: date.toISOString(),
      value: Math.floor(Math.random() * 1000) + 100,
      donations: Math.floor(Math.random() * 50) + 5,
      views: Math.floor(Math.random() * 500) + 50,
      shares: Math.floor(Math.random() * 25) + 2,
    };
  });
};

const trafficSources: ChartData[] = [
  { name: 'Direct', value: 35, color: '#0088FE' },
  { name: 'Social Media', value: 28, color: '#00C49F' },
  { name: 'Search Engines', value: 20, color: '#FFBB28' },
  { name: 'Email', value: 10, color: '#FF8042' },
  { name: 'Referrals', value: 7, color: '#8884D8' },
];

const donorDemographics: ChartData[] = [
  { name: '18-24', value: 15 },
  { name: '25-34', value: 32 },
  { name: '35-44', value: 28 },
  { name: '45-54', value: 18 },
  { name: '55+', value: 7 },
];

const topCountries: ChartData[] = [
  { name: 'United States', value: 45 },
  { name: 'Canada', value: 18 },
  { name: 'United Kingdom', value: 12 },
  { name: 'Australia', value: 8 },
  { name: 'Germany', value: 6 },
  { name: 'Others', value: 11 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const AnalyticsDashboard = ({ 
  projectId, 
  timeRange = '30d',
  className 
}: AnalyticsDashboardProps) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [selectedMetric, setSelectedMetric] = useState<string>('overview');

  const metrics: Metric[] = [
    {
      label: "Total Raised",
      value: formatCurrency(34567),
      change: 12.5,
      changeType: "increase",
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-green-600"
    },
    {
      label: "Total Donors",
      value: 234,
      change: 8.2,
      changeType: "increase", 
      icon: <Users className="w-5 h-5" />,
      color: "text-blue-600"
    },
    {
      label: "Page Views",
      value: "12.4K",
      change: -3.1,
      changeType: "decrease",
      icon: <Eye className="w-5 h-5" />,
      color: "text-purple-600"
    },
    {
      label: "Conversion Rate",
      value: "3.2%",
      change: 0.5,
      changeType: "increase",
      icon: <Target className="w-5 h-5" />,
      color: "text-orange-600"
    },
  ];

  const getTimeRangeDays = (range: string) => {
    switch (range) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      case '1y': return 365;
      default: return 30;
    }
  };

  const chartData = generateMockData(getTimeRangeDays(selectedTimeRange));

  const handleExportData = () => {
    // Mock export functionality
    const csvContent = "Date,Donations,Views,Shares\n" + 
      chartData.map(d => `${d.date},${d.donations},${d.views},${d.shares}`).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${selectedTimeRange}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive insights into your campaign performance
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedTimeRange} onValueChange={(value: any) => setSelectedTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={metric.color}>
                  {metric.icon}
                </div>
                <Badge 
                  variant={metric.changeType === 'increase' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {metric.changeType === 'increase' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {Math.abs(metric.change)}%
                </Badge>
              </div>
              <div className="mt-2">
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funding">Funding</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Donation Trends</CardTitle>
                <CardDescription>Daily donation amounts over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), 'Amount']} />
                    <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your visitors are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={trafficSources}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {trafficSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funding" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Funding Progress</CardTitle>
                <CardDescription>Cumulative donations over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), 'Total Raised']} />
                    <Line type="monotone" dataKey="value" stroke="#00C49F" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Funding Goal</CardTitle>
                <CardDescription>Progress towards target</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(34567)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    of {formatCurrency(50000)} goal
                  </div>
                </div>
                
                <Progress value={69.1} className="h-3" />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Progress:</span>
                    <span className="font-medium">69.1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining:</span>
                    <span className="font-medium">{formatCurrency(15433)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Days left:</span>
                    <span className="font-medium">23 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Donor Age Groups</CardTitle>
                <CardDescription>Age distribution of your supporters</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={donorDemographics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
                <CardDescription>Geographic distribution of supporters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topCountries.map((country, index) => (
                    <div key={country.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-sm">{country.name}</span>
                      </div>
                      <span className="text-sm font-medium">{country.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>Views, shares, and comments over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="views" stroke="#8884d8" name="Views" />
                    <Line type="monotone" dataKey="shares" stroke="#82ca9d" name="Shares" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Summary</CardTitle>
                <CardDescription>Key engagement statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Total Views</span>
                    </div>
                    <span className="font-medium">12,456</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Total Shares</span>
                    </div>
                    <span className="font-medium">342</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Comments</span>
                    </div>
                    <span className="font-medium">89</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-sm">Likes</span>
                    </div>
                    <span className="font-medium">1,234</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Score</CardTitle>
                <CardDescription>Overall campaign performance</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-muted-foreground/20"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.85)}`}
                      className="text-green-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">85</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Badge variant="default" className="bg-green-500">
                    <Star className="w-3 h-3 mr-1" />
                    Excellent
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Your campaign is performing exceptionally well
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
                <CardDescription>Breakdown of performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Funding Progress</span>
                      <span className="text-sm font-medium">69%</span>
                    </div>
                    <Progress value={69} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Engagement Rate</span>
                      <span className="text-sm font-medium">8.2%</span>
                    </div>
                    <Progress value={82} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Conversion Rate</span>
                      <span className="text-sm font-medium">3.2%</span>
                    </div>
                    <Progress value={64} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Social Reach</span>
                      <span className="text-sm font-medium">12.4K</span>
                    </div>
                    <Progress value={91} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};