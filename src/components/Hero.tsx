import { useState } from "react";
import { Search, ArrowRight, Play, Users, Heart, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to projects page with search query
      window.location.href = `/projects?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Extended Background Elements */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      <div className="absolute -inset-y-20 inset-x-0 bg-gradient-warm opacity-30" />
      <div className="absolute inset-0 -top-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-pulse delay-500" />
        <div className="absolute top-10 right-1/4 w-36 h-36 bg-warning/8 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute bottom-1/3 left-1/4 w-28 h-28 bg-success/8 rounded-full blur-2xl animate-pulse delay-300" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 lg:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
            <Heart className="w-4 h-4 mr-2" />
            Trusted by 72,000+ donors • LKR 875M+ raised for 1,847+ projects
          </Badge>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Empowering{" "}
            <span className="bg-gradient-text bg-clip-text text-transparent">
              Sri Lankan Communities
            </span>{" "}
            Through Crowdfunding
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            From Jaffna to Hambantota, we connect generous hearts with meaningful causes. 
            Support education, healthcare, disaster relief, and community development 
            projects that create lasting change across all 25 districts of Sri Lanka.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search water wells, mobile clinics, school scholarships..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-32 py-4 text-base rounded-full border-2 bg-background/90 backdrop-blur-sm"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-6"
                >
                  Search
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </form>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="px-8 py-4 text-base rounded-full">
              Start a Campaign
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-base rounded-full">
              <Play className="mr-2 w-5 h-5" />
              Watch How It Works
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              72,850+ Active Donors
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-2" />
              LKR 875M+ Raised Successfully
            </div>
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              All 25 Districts • 12,400+ Communities
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};