import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Users, DollarSign, Target, TrendingUp } from "lucide-react";
import { sdgData } from "@/types/sdg";

// Enhanced category data aligned with UN SDGs
const categoryData = [
  {
    id: "health",
    title: "Health & Medical",
    description: "Supporting healthcare access, medical treatments, and wellness initiatives across Sri Lanka",
    icon: "🏥",
    color: "#4C9F38",
    gradientFrom: "from-green-400",
    gradientTo: "to-emerald-600",
    relatedSDGs: [3, 1, 6], // Good Health, No Poverty, Clean Water
    stats: {
      activeProjects: 125,
      totalRaised: 2850000,
      successRate: 87,
      avgDonation: 2500
    },
    recentTrend: "+12%",
    urgentCount: 8
  },
  {
    id: "education",
    title: "Education & Learning",
    description: "Empowering communities through quality education, scholarships, and skill development",
    icon: "🎓",
    color: "#C5192D",
    gradientFrom: "from-red-400",
    gradientTo: "to-rose-600",
    relatedSDGs: [4, 5, 8], // Quality Education, Gender Equality, Decent Work
    stats: {
      activeProjects: 98,
      totalRaised: 1920000,
      successRate: 92,
      avgDonation: 1800
    },
    recentTrend: "+18%",
    urgentCount: 5
  },
  {
    id: "community",
    title: "Community Development",
    description: "Building stronger, more inclusive communities through infrastructure and social programs",
    icon: "🏘️",
    color: "#FD9D24",
    gradientFrom: "from-orange-400",
    gradientTo: "to-amber-600",
    relatedSDGs: [11, 16, 17], // Sustainable Cities, Peace & Justice, Partnerships
    stats: {
      activeProjects: 87,
      totalRaised: 3200000,
      successRate: 89,
      avgDonation: 3200
    },
    recentTrend: "+7%",
    urgentCount: 12
  },
  {
    id: "disaster",
    title: "Disaster Relief & Climate",
    description: "Emergency response, climate adaptation, and environmental conservation efforts",
    icon: "🛡️",
    color: "#3F7E44",
    gradientFrom: "from-emerald-400",
    gradientTo: "to-green-700",
    relatedSDGs: [13, 11, 15], // Climate Action, Sustainable Cities, Life on Land
    stats: {
      activeProjects: 76,
      totalRaised: 4100000,
      successRate: 94,
      avgDonation: 4500
    },
    recentTrend: "+25%",
    urgentCount: 15
  },
  {
    id: "economic",
    title: "Economic Empowerment",
    description: "Supporting livelihoods, entrepreneurship, and sustainable economic growth",
    icon: "⚡",
    color: "#A21942",
    gradientFrom: "from-purple-400",
    gradientTo: "to-pink-600",
    relatedSDGs: [8, 1, 9], // Decent Work, No Poverty, Industry & Innovation
    stats: {
      activeProjects: 64,
      totalRaised: 1650000,
      successRate: 85,
      avgDonation: 2100
    },
    recentTrend: "+15%",
    urgentCount: 6
  },
  {
    id: "environment",
    title: "Environment & Wildlife",
    description: "Protecting biodiversity, marine life, and promoting sustainable practices",
    icon: "🌿",
    color: "#0A97D9",
    gradientFrom: "from-blue-400",
    gradientTo: "to-cyan-600",
    relatedSDGs: [14, 15, 6], // Life Below Water, Life on Land, Clean Water
    stats: {
      activeProjects: 52,
      totalRaised: 980000,
      successRate: 91,
      avgDonation: 1600
    },
    recentTrend: "+22%",
    urgentCount: 4
  },
  {
    id: "culture",
    title: "Arts & Culture",
    description: "Preserving heritage, promoting creativity, and celebrating Sri Lankan diversity",
    icon: "🎨",
    color: "#DD1367",
    gradientFrom: "from-pink-400",
    gradientTo: "to-rose-600",
    relatedSDGs: [4, 11, 16], // Quality Education, Sustainable Cities, Peace & Justice
    stats: {
      activeProjects: 42,
      totalRaised: 620000,
      successRate: 88,
      avgDonation: 1200
    },
    recentTrend: "+9%",
    urgentCount: 2
  },
  {
    id: "technology",
    title: "Innovation & Technology",
    description: "Fostering digital literacy, tech innovation, and sustainable solutions",
    icon: "💻",
    color: "#FD6925",
    gradientFrom: "from-orange-400",
    gradientTo: "to-red-500",
    relatedSDGs: [9, 4, 8], // Industry & Innovation, Quality Education, Decent Work
    stats: {
      activeProjects: 35,
      totalRaised: 750000,
      successRate: 83,
      avgDonation: 2800
    },
    recentTrend: "+31%",
    urgentCount: 3
  }
];

export const CategoryGrid = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCategoryClick = (categoryId: string) => {
    window.location.href = `/projects?category=${categoryId}`;
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore Categories by Impact
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Each category represents a pathway to achieving specific UN Sustainable Development Goals. 
            Discover where your support can make the greatest difference.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryData.map((category) => (
            <Card 
              key={category.id}
              className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 hover:border-primary/30 overflow-hidden"
              onClick={() => handleCategoryClick(category.id)}
            >
              {/* Header with Gradient */}
              <CardHeader className={`p-0 h-32 bg-gradient-to-br ${category.gradientFrom} ${category.gradientTo} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 p-6 text-white h-full flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="text-3xl mb-2">{category.icon}</div>
                    {category.urgentCount > 0 && (
                      <Badge className="bg-red-500 hover:bg-red-600 text-white">
                        {category.urgentCount} Urgent
                      </Badge>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-yellow-200 transition-colors">
                      {category.title}
                    </h3>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {category.description}
                </p>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-muted-foreground">
                      <Target className="w-4 h-4 mr-1" />
                      Active Projects
                    </span>
                    <span className="font-semibold text-foreground">{category.stats.activeProjects}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-muted-foreground">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Total Raised
                    </span>
                    <span className="font-semibold text-foreground">{formatCurrency(category.stats.totalRaised)}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span className="font-semibold text-foreground">{category.stats.successRate}%</span>
                    </div>
                    <Progress value={category.stats.successRate} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-muted-foreground">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Growth
                    </span>
                    <span className="font-semibold text-success">{category.recentTrend}</span>
                  </div>
                </div>

                {/* Related SDGs */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    UN SDGs:
                  </h4>
                  <div className="flex gap-1">
                    {category.relatedSDGs.map((sdgId) => {
                      const sdg = sdgData.find(s => s.id === sdgId);
                      return sdg ? (
                        <div 
                          key={sdgId}
                          className="w-8 h-8 rounded-sm overflow-hidden shadow-sm hover:scale-110 transition-transform"
                          title={`SDG ${sdg.id}: ${sdg.title}`}
                        >
                          <img 
                            src={sdg.iconPath}
                            alt={`SDG ${sdg.id}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  variant="outline" 
                  className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
                >
                  Explore Projects
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};