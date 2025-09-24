import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Target, Heart, GraduationCap, Stethoscope, Home, Shield, Zap, Palette, Trophy } from "lucide-react";
import { sdgData } from "@/types/sdg";

// Mapping fundraising categories to relevant SDGs
const categorySDGMapping = [
  {
    id: "health",
    title: "Health & Medical",
    description: "Supporting healthcare access, medical treatments, and wellness initiatives across Sri Lanka",
    icon: Stethoscope,
    color: "#4C9F38",
    relatedSDGs: [3, 1, 6], // Good Health, No Poverty, Clean Water
    projectCount: 125,
    bgGradient: "from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30"
  },
  {
    id: "education",
    title: "Education & Learning",
    description: "Empowering communities through quality education, scholarships, and skill development programs",
    icon: GraduationCap,
    color: "#C5192D",
    relatedSDGs: [4, 5, 8], // Quality Education, Gender Equality, Decent Work
    projectCount: 98,
    bgGradient: "from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30"
  },
  {
    id: "community",
    title: "Community Development",
    description: "Building stronger, more inclusive communities through infrastructure and social programs",
    icon: Home,
    color: "#FD9D24",
    relatedSDGs: [11, 16, 17], // Sustainable Cities, Peace & Justice, Partnerships
    projectCount: 87,
    bgGradient: "from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30"
  },
  {
    id: "disaster",
    title: "Disaster Relief & Climate",
    description: "Emergency response, climate adaptation, and environmental conservation efforts",
    icon: Shield,
    color: "#3F7E44",
    relatedSDGs: [13, 11, 15], // Climate Action, Sustainable Cities, Life on Land
    projectCount: 76,
    bgGradient: "from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30"
  },
  {
    id: "economic",
    title: "Economic Empowerment",
    description: "Supporting livelihoods, entrepreneurship, and sustainable economic growth initiatives",
    icon: Zap,
    color: "#A21942",
    relatedSDGs: [8, 1, 9], // Decent Work, No Poverty, Industry & Innovation
    projectCount: 64,
    bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30"
  },
  {
    id: "culture",
    title: "Arts & Culture",
    description: "Preserving heritage, promoting creativity, and celebrating Sri Lankan cultural diversity",
    icon: Palette,
    color: "#DD1367",
    relatedSDGs: [4, 11, 16], // Quality Education, Sustainable Cities, Peace & Justice
    projectCount: 42,
    bgGradient: "from-pink-50 to-fuchsia-50 dark:from-pink-950/30 dark:to-fuchsia-950/30"
  }
];

export const SDGCategoriesSection = () => {
  const handleViewCategory = (categoryId: string) => {
    window.location.href = `/projects?category=${categoryId}`;
  };

  const handleViewAllSDGs = () => {
    window.location.href = "/projects";
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Funding Categories Aligned with UN SDGs
          </h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Every donation on FundLanka directly contributes to the United Nations Sustainable Development Goals. 
            Discover how your support across different categories creates meaningful impact toward a better Sri Lanka by 2030.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {categorySDGMapping.map((category) => (
            <Card 
              key={category.id}
              className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-primary/50 bg-gradient-to-br ${category.bgGradient}`}
              onClick={() => handleViewCategory(category.id)}
            >
              <CardContent className="p-6">
                {/* Icon and Title */}
                <div className="flex items-center mb-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 shadow-lg"
                    style={{ backgroundColor: category.color + '20' }}
                  >
                    <category.icon 
                      className="w-6 h-6" 
                      style={{ color: category.color }}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <Badge variant="secondary" className="mt-1">
                      {category.projectCount} Projects
                    </Badge>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {category.description}
                </p>

                {/* Related SDGs */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    Supports UN SDGs:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {category.relatedSDGs.map((sdgId) => {
                      const sdg = sdgData.find(s => s.id === sdgId);
                      return sdg ? (
                        <div 
                          key={sdgId}
                          className="flex items-center gap-1 bg-background/60 rounded-full px-2 py-1 text-xs"
                        >
                          <img 
                            src={sdg.iconPath}
                            alt={`SDG ${sdg.id}`}
                            className="w-4 h-4 rounded-sm"
                          />
                          <span className="text-foreground font-medium">SDG {sdg.id}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  Browse Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-6">
          <div className="bg-muted/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Together, We're Building a Sustainable Future
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              By supporting projects across these categories, you're directly contributing to Sri Lanka's progress 
              toward achieving all 17 UN Sustainable Development Goals by 2030.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleViewAllSDGs}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Target className="mr-2 h-5 w-5" />
                View All Projects
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => window.location.href = "/create-campaign"}
              >
                <Heart className="mr-2 h-5 w-5" />
                Start Your Own Campaign
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};