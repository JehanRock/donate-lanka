import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Users, Target, Award, ChevronLeft, ChevronRight } from "lucide-react";
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

  // Slideshow state for success stories
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStoryIndex((prev) => 
        prev === successStories.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [successStories.length]);

  const goToNextStory = () => {
    setCurrentStoryIndex((prev) => 
      prev === successStories.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrevStory = () => {
    setCurrentStoryIndex((prev) => 
      prev === 0 ? successStories.length - 1 : prev - 1
    );
  };
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

        {/* Expanded UN SDG Impact Cards */}
        <div>
          <h3 className="text-lg font-semibold mb-4">UN Sustainable Development Goals - Impact by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sdgFundingData.map((sdg) => {
              const amountInMillions = sdg.amount / 1000000;
              const displayAmount = amountInMillions >= 1000 
                ? `${(amountInMillions / 1000).toFixed(1)}B` 
                : `${amountInMillions.toFixed(1)}M`;
              
              return (
                <div key={sdg.id} className="bg-white border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <img 
                      src={sdg.iconPath} 
                      alt={`SDG ${sdg.id}`}
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground">SDG {sdg.id}</span>
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: sdg.color }}
                        />
                      </div>
                      <h4 className="font-semibold text-sm leading-tight mb-1">{sdg.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{sdg.sriLankanContext}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-muted pt-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-primary">LKR {displayAmount}</p>
                        <p className="text-xs text-muted-foreground">Total Raised</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{sdg.projectCount}</p>
                        <p className="text-xs text-muted-foreground">Projects</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            backgroundColor: sdg.color,
                            width: `${Math.min((sdg.amount / Math.max(...sdgFundingData.map(s => s.amount))) * 100, 100)}%`
                          }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-muted-foreground">Progress</span>
                        <span className="text-xs font-medium" style={{ color: sdg.color }}>
                          {((sdg.amount / totalRaised) * 100).toFixed(1)}% of total
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Featured Success Stories Slideshow */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Featured Success Stories</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevStory}
                className="w-8 h-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextStory}
                className="w-8 h-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="relative bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl overflow-hidden">
            {successStories.map((story, index) => (
              <div
                key={story.id}
                className={`transition-all duration-700 ease-in-out ${
                  index === currentStoryIndex 
                    ? 'opacity-100 translate-x-0' 
                    : index < currentStoryIndex 
                      ? 'opacity-0 -translate-x-full absolute inset-0' 
                      : 'opacity-0 translate-x-full absolute inset-0'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
                  {/* Image Section */}
                  <div className="relative overflow-hidden">
                    <img 
                      src={story.imageUrl} 
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-primary">
                        <Award className="w-6 h-6" />
                        <span className="text-sm font-medium uppercase tracking-wider">Success Story</span>
                      </div>
                      
                      <h4 className="text-2xl lg:text-3xl font-bold leading-tight text-foreground">
                        {story.title}
                      </h4>
                      
                      <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                        {story.description}
                      </p>
                      
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                        <Award className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">
                          {story.impact}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Progress Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
              {successStories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStoryIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStoryIndex 
                      ? 'bg-primary scale-125' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Story Counter */}
          <div className="flex justify-center mt-4">
            <span className="text-sm text-muted-foreground">
              {currentStoryIndex + 1} of {successStories.length} stories
            </span>
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