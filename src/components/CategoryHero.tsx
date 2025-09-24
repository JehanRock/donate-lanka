import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Target, TrendingUp, Globe } from "lucide-react";

export const CategoryHero = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/projects?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <section className="relative py-24 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Globe className="w-3 h-3 mr-1" />
              UN SDG Aligned
            </Badge>
            <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
              <TrendingUp className="w-3 h-3 mr-1" />
              500+ Active Projects
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Funding Categories for
            <span className="bg-gradient-text block">
              Sri Lanka's Future
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
            Discover impactful projects across diverse categories, each carefully aligned with the 
            United Nations Sustainable Development Goals. Every donation contributes to building 
            a stronger, more sustainable Sri Lanka by 2030.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by category, SDG, or project type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg rounded-full border-2 border-muted focus:border-primary bg-background/80 backdrop-blur-sm"
              />
              <Button 
                type="submit"
                size="lg"
                className="absolute right-2 top-2 rounded-full"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">8</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-secondary mb-1">17</div>
              <div className="text-sm text-muted-foreground">UN SDGs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-success mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-warning mb-1">25</div>
              <div className="text-sm text-muted-foreground">Districts</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => window.location.href = "/projects"}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
            >
              <Target className="mr-2 h-5 w-5" />
              Browse All Projects
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={() => window.location.href = "/create"}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-8"
            >
              Start Your Campaign
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};