import { Link } from "react-router-dom";
import { 
  Heart, 
  GraduationCap, 
  Laptop, 
  Users, 
  ShieldAlert, 
  PawPrint, 
  Palette, 
  Trophy,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CategoryCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  count: number;
  color: string;
  bgColor: string;
  href: string;
  trending?: boolean;
  size?: "default" | "large";
}

const CategoryCard = ({ 
  icon: Icon, 
  title, 
  description, 
  count, 
  color, 
  bgColor,
  href, 
  trending = false,
  size = "default"
}: CategoryCardProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-background border border-border transition-all duration-300 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 backdrop-blur-sm",
        size === "large" ? "p-8" : "p-6",
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      
      {/* Trending Badge */}
      {trending && (
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground border-secondary/30">
            <TrendingUp className="w-3 h-3 mr-1" />
            Trending
          </Badge>
        </div>
      )}
      
      {/* Icon Container */}
      <div className={cn(
        "inline-flex items-center justify-center rounded-xl mb-4 transition-all duration-300 group-hover:scale-105",
        bgColor,
        size === "large" ? "w-16 h-16" : "w-12 h-12"
      )}>
        <Icon className={cn(
          "transition-all duration-300",
          color,
          size === "large" ? "w-8 h-8" : "w-6 h-6"
        )} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className={cn(
          "font-bold text-foreground mb-3 group-hover:text-primary transition-colors",
          size === "large" ? "text-xl lg:text-2xl" : "text-lg"
        )}>
          {title}
        </h3>
        <p className={cn(
          "text-muted-foreground mb-4 leading-relaxed",
          size === "large" ? "text-sm lg:text-base" : "text-sm line-clamp-2"
        )}>
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={cn(
              "font-bold text-foreground",
              size === "large" ? "text-xl" : "text-lg"
            )}>
              {count.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">projects</span>
          </div>
          <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform duration-300">
            <span className="text-sm font-medium mr-2">Explore</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700" />
    </Link>
  );
};

const categories = [
  {
    icon: Heart,
    title: "Medical & Healthcare",
    description: "Mobile clinics, medical equipment, emergency treatments, and healthcare access for underserved communities",
    count: 312,
    color: "text-red-600",
    bgColor: "bg-red-500/10",
    href: "/projects/discovery?category=medical",
    trending: true,
    size: "large" as const,
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "School scholarships, educational materials, and learning resources",
    count: 267,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    href: "/projects/discovery?category=education",
    trending: true,
  },
  {
    icon: Users,
    title: "Community Development",
    description: "Water wells, infrastructure projects, and community centers",
    count: 198,
    color: "text-green-600",
    bgColor: "bg-green-500/10",
    href: "/projects/discovery?category=community",
  },
  {
    icon: ShieldAlert,
    title: "Disaster Relief",
    description: "Emergency aid and disaster preparedness initiatives",
    count: 89,
    color: "text-orange-600",
    bgColor: "bg-orange-500/10",
    href: "/projects/discovery?category=disaster-relief",
  },
  {
    icon: PawPrint,
    title: "Wildlife & Environment",
    description: "Conservation and marine ecosystem restoration",
    count: 76,
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
    href: "/projects/discovery?category=environment",
  },
  {
    icon: Laptop,
    title: "Technology Innovation",
    description: "Digital literacy and tech solutions for social challenges",
    count: 54,
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
    href: "/projects/discovery?category=technology",
  },
  {
    icon: Palette,
    title: "Arts & Culture",
    description: "Cultural heritage preservation and artist support",
    count: 43,
    color: "text-pink-600",
    bgColor: "bg-pink-500/10",
    href: "/projects/discovery?category=arts-culture",
  },
];

export const FeaturedCategories = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-4 lg:px-6 relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4 mr-2" />
            Popular Categories
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Make Your Impact
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands of changemakers supporting causes that matter. 
            Every contribution creates ripples of positive change across Sri Lanka.
          </p>
        </div>

        {/* Featured Category - Large Card */}
        <div className="mb-8">
          <div className="animate-fade-in" style={{ animationDelay: '0s' }}>
            <CategoryCard {...categories[0]} />
          </div>
        </div>

        {/* Regular Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.slice(1).map((category, index) => (
            <div 
              key={category.title}
              className="animate-fade-in"
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              <CategoryCard {...category} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl p-8 border border-border/50">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Start Your Own Campaign?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Turn your vision into reality. Create a campaign and rally support from our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/projects/discovery"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-background border border-border text-foreground hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                Browse All Projects
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                to="/create-campaign"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start a Campaign
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};