import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const routeLabels: Record<string, string> = {
  "/": "Home",
  "/projects": "Projects",
  "/categories": "Categories",
  "/about": "About",
  "/news": "News",
  "/contact": "Contact",
  "/dashboard": "Dashboard",
  "/profile": "Profile",
  "/login": "Sign In",
  "/register": "Create Account",
};

export const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
  const location = useLocation();
  
  // Auto-generate breadcrumbs from current path if items not provided
  const breadcrumbItems = items || generateBreadcrumbsFromPath(location.pathname);

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("flex items-center space-x-1 text-sm", className)}
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <Fragment key={index}>
              <li className="flex items-center">
                {index === 0 && (
                  <Home className="w-4 h-4 mr-1" />
                )}
                {item.href && !isLast ? (
                  <Link
                    to={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span 
                    className={cn(
                      isLast 
                        ? "text-foreground font-medium" 
                        : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </li>
              {!isLast && (
                <li>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" }
  ];

  let currentPath = "";
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // Try to get a friendly label, fallback to segment
    const label = routeLabels[currentPath] || 
                  segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    
    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath
    });
  });

  return breadcrumbs;
}