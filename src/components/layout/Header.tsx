import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search } from "lucide-react";
import easdLogo from "@/assets/easd-logo.png";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse Items" },
  { href: "/submit", label: "Report Found" },
  { href: "/claim", label: "Claim Item" },
];

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-18 items-center justify-between py-3">
        {/* Logo with personality */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img 
              src={easdLogo} 
              alt="Easton Area School District Logo" 
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-105" 
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl tracking-wide text-foreground leading-tight transition-colors group-hover:text-primary">
              ROVER SEARCH
            </span>
            <span className="text-xs text-muted-foreground font-handwritten text-base">
              Finding lost treasures since '24 ✨
            </span>
          </div>
        </Link>

        {/* Desktop Navigation - with subtle personality */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link key={link.href} to={link.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`font-medium transition-all duration-200 ${
                    isActive 
                      ? "rounded-organic" 
                      : "hover:bg-accent/50 rounded-lg"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Button>
              </Link>
            );
          })}
          
          {/* Quick search hint */}
          <Link to="/browse" className="ml-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary/5"
              aria-label="Quick search"
            >
              <Search className="h-4 w-4 text-primary" />
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden rounded-lg"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation - with slide animation */}
      {mobileMenuOpen && (
        <nav 
          className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-md p-4 animate-slide-up"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start font-medium ${
                      isActive ? "rounded-organic" : "rounded-lg"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>
          
          {/* Mobile friendly message */}
          <div className="mt-4 pt-4 border-t border-border/60">
            <p className="font-handwritten text-center text-muted-foreground text-lg">
              Need help? We're at the cafeteria exit! 🚪
            </p>
          </div>
        </nav>
      )}
    </header>
  );
}