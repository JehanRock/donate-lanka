import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, User, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { MobileNav } from "./MobileNav";
import { AuthModal } from "./AuthModal";
import { useAuth } from "@/contexts/AuthContext";
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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

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
                asChild
                className={cn(
                  "hidden sm:flex rounded-full bg-warning/20 border border-warning/30",
                  "hover:bg-warning/30 backdrop-blur-sm text-warning hover:text-warning-foreground",
                  "transition-all duration-200"
                )}
              >
                <Link to="/start">Start a Campaign</Link>
              </Button>

              {/* Authentication Actions */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "rounded-full bg-white/10 hover:bg-white/20",
                        "backdrop-blur-sm border border-white/20"
                      )}
                    >
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="text-xs">
                          {user?.name?.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/users/${user?.id}`}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "hidden sm:flex rounded-full bg-white/10 hover:bg-white/20",
                    "backdrop-blur-sm border border-white/20 text-foreground/80"
                  )}
                  onClick={() => setShowAuthModal(true)}
                >
                  Sign In
                </Button>
              )}

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

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultView="signup"
      />
    </>
  );
};