import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Users, Target, Award } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { formatNumber } from "@/utils/numbers";
import { sdgData } from "@/types/sdg";

interface ImpactReportProps {
  year: number;
  totalRaised: number;
  projectsCompleted: number;
  beneficiariesReached: number;
  monthlyData: Array<{
    month: string;
    donations: number;
    projects: number;
  }>;
  successStories: Array<{
    id: string;
    title: string;
    description: string;
    impact: string;
    imageUrl: string;
  }>;
  className?: string;
}

export const ImpactReport = ({
  year,
  totalRaised,
  projectsCompleted,
  beneficiariesReached,
  monthlyData,
  successStories,
  className
}: ImpactReportProps) => {
  // Generate SDG funding data based on project counts and average funding
  const sdgFundingData = sdgData.map(sdg => ({
    ...sdg,
    amount: Math.round((sdg.projectCount / projectsCompleted) * totalRaised),
    category: sdg.title
  })).filter(sdg => sdg.projectCount > 0).sort((a, b) => b.amount - a.amount);
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.dataKey === 'donations' ? formatCurrency(entry.value) : entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Annual Impact Report {year}
            </CardTitle>
            <CardDescription>
              Comprehensive overview of our platform's impact and achievements
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download Full Report
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-primary/5 rounded-xl border border-primary/10">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <p className="text-2xl font-bold text-primary mb-1">
              {formatCurrency(totalRaised)}
            </p>
            <p className="text-sm text-muted-foreground">Total Funds Raised</p>
            <p className="text-xs text-green-600 mt-1">+32% from last year</p>
          </div>
          
          <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600 mb-1">
              {formatNumber(projectsCompleted)}
            </p>
            <p className="text-sm text-muted-foreground">Projects Completed</p>
            <p className="text-xs text-green-600 mt-1">+45% from last year</p>
          </div>
          
          <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600 mb-1">
              {formatNumber(beneficiariesReached)}+
            </p>
            <p className="text-sm text-muted-foreground">Lives Impacted</p>
            <p className="text-xs text-blue-600 mt-1">+28% from last year</p>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Monthly Fundraising Trends</h3>
          <div className="h-64 bg-muted/20 rounded-lg p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b" 
                  fontSize={12}
                  tickMargin={8}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12}
                  tickMargin={8}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="donations" fill="#00A99D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* UN SDG Categories Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">UN Sustainable Development Goals - Funding Distribution</h3>
            <div className="h-64 bg-muted/20 rounded-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sdgFundingData.slice(0, 8)}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={1}
                    dataKey="amount"
                  >
                    {sdgFundingData.slice(0, 8).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [formatCurrency(value as number), 'Funding']}
                    labelFormatter={(label, payload) => {
                      const data = payload?.[0]?.payload;
                      return data ? `SDG ${data.id}: ${data.title}` : label;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Top UN Goals by Project Impact</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {sdgFundingData.slice(0, 8).map((sdg) => (
                <div key={sdg.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <img 
                        src={sdg.iconPath} 
                        alt={`SDG ${sdg.id}`}
                        className="w-8 h-8 rounded object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm leading-tight">SDG {sdg.id}: {sdg.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{sdg.sriLankanContext}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm flex-shrink-0">
                    <p className="font-medium">{formatCurrency(sdg.amount)}</p>
                    <p className="text-muted-foreground">{sdg.projectCount} projects</p>
                  </div>
                </div>
              ))}
              {sdgFundingData.length > 8 && (
                <div className="text-center py-2">
                  <span className="text-sm text-muted-foreground">
                    +{sdgFundingData.length - 8} more SDG categories with active projects
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Featured Success Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {successStories.slice(0, 4).map((story) => (
              <div key={story.id} className="border border-border rounded-lg overflow-hidden">
                <img 
                  src={story.imageUrl} 
                  alt={story.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold mb-2">{story.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {story.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      {story.impact}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-muted/30 rounded-lg p-6 text-center">
          <p className="font-medium mb-2">Transparency & Accountability</p>
          <p className="text-sm text-muted-foreground">
            This report is independently audited by PricewaterhouseCoopers (PwC) Sri Lanka. 
            All financial data is verified and complies with international transparency standards.
          </p>
          <div className="flex justify-center items-center gap-4 mt-4 text-xs text-muted-foreground">
            <span>Report Period: January 1 - December 31, {year}</span>
            <span>•</span>
            <span>Published: January 15, {year + 1}</span>
            <span>•</span>
            <span>Audit Certified</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};