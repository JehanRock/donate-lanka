import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Impact", href: "/impact" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <header
        className={cn(
          "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300",
          "w-[95%] max-w-6xl"
        )}
      >
        
        <div className={cn(
          "mx-auto px-6 lg:px-8 rounded-full transition-all duration-300",
          "bg-background/20 backdrop-blur-xl border border-white/20",
          "shadow-lg shadow-primary/5",
          isScrolled 
            ? "bg-background/30 backdrop-blur-2xl border-white/30 shadow-xl shadow-primary/10" 
            : "bg-background/15 backdrop-blur-lg"
        )}>
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-1">
              <img 
                src="/logo.png" 
                alt="DonateLanka Logo" 
                className="h-10 w-auto sm:h-12 object-contain"
              />
              <img 
                src="/logo-text.png" 
                alt="DonateLanka Text" 
                className="h-8 w-auto sm:h-10 object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-all duration-200 px-4 py-2 rounded-full",
                    "hover:bg-white/10 hover:text-primary backdrop-blur-sm",
                    isActive(item.href)
                      ? "bg-warning/20 text-warning border border-warning/30"
                      : "text-foreground/80 hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Start Campaign Button */}
              <Button 
                variant="secondary" 
                size="sm" 
                className={cn(
                  "hidden sm:flex rounded-full bg-warning/20 border border-warning/30",
                  "hover:bg-warning/30 backdrop-blur-sm text-warning hover:text-warning-foreground",
                  "transition-all duration-200"
                )}
              >
                Start a Campaign
              </Button>


              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "lg:hidden rounded-full bg-white/10 hover:bg-white/20",
                  "backdrop-blur-sm border border-white/20"
                )}
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigationItems={navigationItems}
      />
    </>
  );
};