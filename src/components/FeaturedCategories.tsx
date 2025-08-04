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
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  count: number;
  color: string;
  href: string;
}

const CategoryCard = ({ icon: Icon, title, description, count, color, href }: CategoryCardProps) => {
  return (
    <Link
      to={href}
      className="group relative overflow-hidden rounded-2xl bg-background border border-border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:border-primary/20"
    >
      {/* Background Gradient */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300",
        color
      )} />
      
      {/* Icon Container */}
      <div className={cn(
        "inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 transition-all duration-300 group-hover:scale-110",
        color.replace('bg-', 'bg-').replace('/10', '/10 group-hover:bg-').replace('/10 group-hover:bg-', '/20')
      )}>
        <Icon className={cn(
          "w-7 h-7 transition-all duration-300",
          color.replace('bg-', 'text-').replace('/10', '').replace('/20', '')
        )} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {count.toLocaleString()} projects
          </span>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-300" />
    </Link>
  );
};

const categories = [
  {
    icon: Heart,
    title: "Medical & Healthcare",
    description: "Mobile clinics, medical equipment, emergency treatments, and healthcare access for rural communities",
    count: 312,
    color: "bg-red-500/10 text-red-600",
    href: "/projects?category=medical",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "School scholarships, educational materials, teacher training, and learning resources for all children",
    count: 267,
    color: "bg-blue-500/10 text-blue-600",
    href: "/projects?category=education",
  },
  {
    icon: Users,
    title: "Community Development",
    description: "Water wells, infrastructure projects, community centers, and local development initiatives",
    count: 198,
    color: "bg-green-500/10 text-green-600",
    href: "/projects?category=community",
  },
  {
    icon: ShieldAlert,
    title: "Disaster Relief",
    description: "Cyclone relief, flood recovery, emergency aid, and disaster preparedness for affected communities",
    count: 89,
    color: "bg-orange-500/10 text-orange-600",
    href: "/projects?category=disaster-relief",
  },
  {
    icon: PawPrint,
    title: "Wildlife & Environment",
    description: "Sea turtle conservation, leopard protection, forest preservation, and marine ecosystem restoration",
    count: 76,
    color: "bg-amber-500/10 text-amber-600",
    href: "/projects?category=animals",
  },
  {
    icon: Laptop,
    title: "Technology Innovation",
    description: "AI wildlife monitoring, digital literacy programs, and tech solutions for social challenges",
    count: 54,
    color: "bg-purple-500/10 text-purple-600",
    href: "/projects?category=technology",
  },
  {
    icon: Palette,
    title: "Arts & Culture",
    description: "Traditional dance festivals, cultural heritage preservation, and support for local artists",
    count: 43,
    color: "bg-pink-500/10 text-pink-600",
    href: "/projects?category=arts-culture",
  },
  {
    icon: Trophy,
    title: "Sports Development",
    description: "Cricket academies, sports equipment, youth training programs, and athletic facility development",
    count: 31,
    color: "bg-indigo-500/10 text-indigo-600",
    href: "/projects?category=sports",
  },
];

export const FeaturedCategories = () => {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Explore Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover projects across diverse categories making a real impact 
            in communities throughout Sri Lanka.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <div 
              key={category.title}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CategoryCard {...category} />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link
            to="/categories"
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
          >
            View All Categories
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};