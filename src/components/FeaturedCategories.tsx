import { Link } from "react-router-dom";
import { 
  Heart, 
  GraduationCap, 
  Users, 
  ShieldAlert, 
  PawPrint, 
  Laptop, 
  Palette, 
  Trophy,
  ArrowRight,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  count: number;
  href: string;
  featured?: boolean;
  color: string;
  bgColor: string;
}

const CategoryCard = ({ 
  icon: Icon, 
  title, 
  description, 
  count, 
  href, 
  featured = false,
  color,
  bgColor
}: CategoryCardProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "group relative bg-background border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-primary/30",
        featured && "bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20"
      )}
    >
      <div className="flex items-start space-x-4">
        <div className={cn(
          "flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200",
          bgColor,
          color
        )}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {count.toLocaleString()} fundraisers
            </span>
            <ArrowRight className={cn(
              "w-4 h-4 group-hover:translate-x-1 transition-all",
              color.replace('bg-', 'text-').replace('/10', ''),
              "group-hover:opacity-100 opacity-60"
            )} />
          </div>
        </div>
      </div>
    </Link>
  );
};

const categories = [
  {
    icon: Heart,
    title: "Medical",
    description: "Help cover medical expenses, treatments, and emergency healthcare needs",
    count: 312,
    href: "/projects/discovery?category=medical",
    featured: true,
    color: "text-red-600",
    bgColor: "bg-red-500/10",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Support students, schools, and educational programs",
    count: 267,
    href: "/projects/discovery?category=education",
    featured: true,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Users,
    title: "Community",
    description: "Build stronger communities through local projects and initiatives",
    count: 198,
    href: "/projects/discovery?category=community",
    color: "text-green-600",
    bgColor: "bg-green-500/10",
  },
  {
    icon: ShieldAlert,
    title: "Emergency",
    description: "Provide immediate relief for disasters and urgent situations",
    count: 89,
    href: "/projects/discovery?category=emergency",
    color: "text-orange-600",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: PawPrint,
    title: "Animals",
    description: "Rescue, care for, and protect animals in need",
    count: 76,
    href: "/projects/discovery?category=animals",
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: Laptop,
    title: "Technology",
    description: "Innovation and tech solutions for social good",
    count: 54,
    href: "/projects/discovery?category=technology",
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Palette,
    title: "Creative",
    description: "Support artists, creative projects, and cultural initiatives",
    count: 43,
    href: "/projects/discovery?category=creative",
    color: "text-pink-600",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Trophy,
    title: "Sports",
    description: "Athletic programs, equipment, and sports development",
    count: 31,
    href: "/projects/discovery?category=sports",
    color: "text-indigo-600",
    bgColor: "bg-indigo-500/10",
  },
];

export const FeaturedCategories = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Browse by category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find a cause you care about and make a difference. Every donation, no matter the size, helps.
          </p>
        </div>

        {/* Featured Categories - Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {categories.slice(0, 2).map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>

        {/* Regular Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.slice(2).map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>

        {/* Browse All & Start Campaign */}
        <div className="bg-background rounded-2xl border border-border p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready to make a difference?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you want to donate to an existing cause or start your own fundraiser, 
            every action creates positive change in our community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link
              to="/projects/discovery"
              className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg text-foreground font-medium hover:border-primary/30 hover:bg-muted/50 transition-colors"
            >
              Browse all
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              to="/create-campaign"
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus className="mr-2 w-4 h-4" />
              Start a Campaign
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};