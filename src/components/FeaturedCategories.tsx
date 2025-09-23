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
        "group relative overflow-hidden rounded-3xl bg-gradient-to-br from-background to-muted/20 border border-border/50 transition-all duration-500 hover:shadow-2xl hover:border-primary/30 hover:-translate-y-1 backdrop-blur-sm",
        size === "large" ? "p-8 md:col-span-2 lg:row-span-2" : "p-6",
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
        "inline-flex items-center justify-center rounded-2xl mb-6 transition-all duration-300 group-hover:scale-110",
        bgColor,
        size === "large" ? "w-20 h-20" : "w-16 h-16"
      )}>
        <Icon className={cn(
          "transition-all duration-300",
          color,
          size === "large" ? "w-10 h-10" : "w-8 h-8"
        )} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className={cn(
          "font-bold text-foreground mb-3 group-hover:text-primary transition-colors",
          size === "large" ? "text-2xl lg:text-3xl" : "text-xl"
        )}>
          {title}
        </h3>
        <p className={cn(
          "text-muted-foreground mb-6 leading-relaxed",
          size === "large" ? "text-base lg:text-lg" : "text-sm line-clamp-2"
        )}>
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={cn(
              "font-bold text-foreground",
              size === "large" ? "text-2xl" : "text-lg"
            )}>
              {count.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">active projects</span>
          </div>
          <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform duration-300">
            <span className="text-sm font-medium mr-2">Explore</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
    </Link>
  );
};

const categories = [
  {
    icon: Heart,
    title: "Medical & Healthcare",
    description: "Mobile clinics, medical equipment, emergency treatments, and healthcare access for underserved communities across Sri Lanka",
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
    <section className="py-20 lg:py-32 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-4 lg:px-6 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4 mr-2" />
            Popular Categories
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Make Your Impact
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join thousands of changemakers supporting causes that matter. 
            Every contribution creates ripples of positive change across Sri Lanka.
          </p>
        </div>

        {/* Categories Grid - Masonry Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 auto-rows-max">
          {categories.map((category, index) => (
            <div 
              key={category.title}
              className={cn(
                "animate-fade-in",
                category.size === "large" && "md:col-span-2 lg:col-span-2"
              )}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CategoryCard {...category} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-3xl p-8 lg:p-12 border border-border/50">
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Ready to Start Your Own Campaign?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Turn your vision into reality. Create a campaign and rally support from our community of generous donors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/projects/discovery"
                className="inline-flex items-center px-8 py-4 rounded-2xl bg-background border border-border text-foreground hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                Browse All Projects
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/create-campaign"
                className="inline-flex items-center px-8 py-4 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start a Campaign
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};