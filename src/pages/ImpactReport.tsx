import { useState } from "react";
import { ImpactReport } from "@/components/ImpactReport";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, TrendingUp, Calendar } from "lucide-react";

// Mock data for impact reports
const impactReportsData = {
  2024: {
    year: 2024,
    totalRaised: 875000000, // LKR
    projectsCompleted: 1847,
    beneficiariesReached: 124000,
    categoriesData: [
      { category: "Medical", amount: 312500000, projects: 312, color: "#ef4444" },
      { category: "Education", amount: 233750000, projects: 267, color: "#3b82f6" },
      { category: "Community", amount: 173250000, projects: 198, color: "#10b981" },
      { category: "Disaster Relief", amount: 87500000, projects: 89, color: "#f59e0b" },
      { category: "Wildlife", amount: 52500000, projects: 76, color: "#059669" },
      { category: "Technology", amount: 15750000, projects: 54, color: "#8b5cf6" },
    ],
    monthlyData: [
      { month: "Jan", donations: 65000000, projects: 145 },
      { month: "Feb", donations: 78000000, projects: 167 },
      { month: "Mar", donations: 92000000, projects: 189 },
      { month: "Apr", donations: 71000000, projects: 156 },
      { month: "May", donations: 88000000, projects: 178 },
      { month: "Jun", donations: 95000000, projects: 201 },
      { month: "Jul", donations: 83000000, projects: 172 },
      { month: "Aug", donations: 76000000, projects: 163 },
      { month: "Sep", donations: 89000000, projects: 185 },
      { month: "Oct", donations: 91000000, projects: 194 },
      { month: "Nov", donations: 85000000, projects: 181 },
      { month: "Dec", donations: 98000000, projects: 216 },
    ],
    successStories: [
      {
        id: "s1",
        title: "Mobile Clinic Serves 15,000 in Vanni",
        description: "Dr. Wickramasinghe's mobile clinic has provided healthcare to 15,000 people in remote Northern Province villages.",
        impact: "15,000 people reached",
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop"
      },
      {
        id: "s2", 
        title: "1,200 Sea Turtles Released",
        description: "Kosgoda turtle hatchery restoration led to successful release of 1,200 baby sea turtles into the ocean.",
        impact: "1,200 turtles saved",
        imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop"
      },
      {
        id: "s3",
        title: "250 Children Now Have Clean Water",
        description: "Solar-powered water wells in Moneragala provide clean drinking water to 8 village schools.",
        impact: "250 students benefited",
        imageUrl: "https://images.unsplash.com/photo-1594736797933-d0aa5ba20203?w=400&h=300&fit=crop"
      },
      {
        id: "s4",
        title: "AI Wildlife Protection System",
        description: "WildGuard Lanka AI system now monitors 45 leopards and 200+ elephants across 3 national parks.",
        impact: "245 animals protected",
        imageUrl: "https://images.unsplash.com/photo-1549366021-9f761d040a94?w=400&h=300&fit=crop"
      }
    ]
  },
  2023: {
    year: 2023,
    totalRaised: 542000000, // LKR
    projectsCompleted: 1456,
    beneficiariesReached: 89000,
    categoriesData: [
      { category: "Medical", amount: 195000000, projects: 245, color: "#ef4444" },
      { category: "Education", amount: 162600000, projects: 198, color: "#3b82f6" },
      { category: "Community", amount: 130000000, projects: 167, color: "#10b981" },
      { category: "Disaster Relief", amount: 54200000, projects: 67, color: "#f59e0b" },
      { category: "Wildlife", amount: 32500000, projects: 45, color: "#059669" },
      { category: "Technology", amount: 16250000, projects: 34, color: "#8b5cf6" },
    ],
    monthlyData: [
      { month: "Jan", donations: 35000000, projects: 98 },
      { month: "Feb", donations: 42000000, projects: 112 },
      { month: "Mar", donations: 48000000, projects: 125 },
      { month: "Apr", donations: 45000000, projects: 118 },
      { month: "May", donations: 52000000, projects: 134 },
      { month: "Jun", donations: 58000000, projects: 145 },
      { month: "Jul", donations: 47000000, projects: 128 },
      { month: "Aug", donations: 44000000, projects: 121 },
      { month: "Sep", donations: 49000000, projects: 132 },
      { month: "Oct", donations: 51000000, projects: 138 },
      { month: "Nov", donations: 46000000, projects: 126 },
      { month: "Dec", donations: 65000000, projects: 179 },
    ],
    successStories: [
      {
        id: "s5",
        title: "Emergency Flood Relief 2023",
        description: "Rapid response to flooding in Ratnapura provided aid to 500+ families within 48 hours.",
        impact: "500 families aided",
        imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop"
      },
      {
        id: "s6",
        title: "Rural Education Initiative",
        description: "Scholarship program enabled 150 estate children to complete their O-Level examinations.",
        impact: "150 scholarships awarded",
        imageUrl: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop"
      }
    ]
  }
};

const ImpactReportPage = () => {
  const [selectedYear, setSelectedYear] = useState<"2024" | "2023">("2024");
  const currentData = impactReportsData[selectedYear];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Annual Impact Reports
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Comprehensive transparency reports showing how your donations create 
              lasting change across Sri Lankan communities
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-6 py-12">
        {/* Year Selector */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Impact Report Archives
                </CardTitle>
                <CardDescription>
                  Select a year to view detailed impact and financial transparency data
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <Select value={selectedYear} onValueChange={(value: string) => setSelectedYear(value as "2024" | "2023")}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Impact Report */}
        <ImpactReport {...currentData} />

        {/* Commitment to Transparency */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Our Commitment to Transparency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Independent Auditing</h3>
                <p className="text-sm text-muted-foreground">
                  All financial data is independently audited by PricewaterhouseCoopers (PwC) Sri Lanka
                </p>
              </div>
              
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Monthly Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Project progress and financial reports published monthly for complete transparency
                </p>
              </div>
              
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Open Access</h3>
                <p className="text-sm text-muted-foreground">
                  All reports are freely available for download and subject to public scrutiny
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImpactReportPage;