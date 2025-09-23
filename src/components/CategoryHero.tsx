import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CategoryHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const CategoryHero = ({ searchQuery, onSearchChange }: CategoryHeroProps) => {
  return (
    <section className="relative py-16 lg:py-24 gradient-hero">
      <div className="container mx-auto container-padding">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-6xl font-heading font-bold text-foreground mb-6">
            Explore Categories
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Find the perfect project to support based on your interests and passions
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search categories, projects, or causes..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 pr-32 py-4 text-lg bg-card/80 backdrop-blur-sm border-border/50 focus:border-primary"
              />
              <Button 
                size="lg" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">8</div>
              <div className="text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">150+</div>
              <div className="text-muted-foreground">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">₹2.5M</div>
              <div className="text-muted-foreground">Funds Raised</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};