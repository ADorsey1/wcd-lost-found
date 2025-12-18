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
    <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-primary">
      <div className="container flex h-18 items-center justify-between py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img 
              src={easdLogo} 
              alt="Easton Area School District Logo" 
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-105" 
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl tracking-wide text-primary-foreground leading-tight">
              ROVER SEARCH
            </span>
            <span className="text-xs text-primary-foreground/70">
              Lost & Found System
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link key={link.href} to={link.href}>
                <Button
                  variant="ghost"
                  className={`font-medium transition-all duration-200 rounded-lg ${
                    isActive 
                      ? "bg-background text-foreground hover:bg-background/90" 
                      : "text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Button>
              </Link>
            );
          })}
          
          {/* Quick search */}
          <Link to="/browse" className="ml-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full text-primary-foreground hover:bg-primary-foreground/10"
              aria-label="Quick search"
            >
              <Search className="h-4 w-4" />
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden rounded-lg text-primary-foreground hover:bg-primary-foreground/10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav 
          className="md:hidden border-t border-primary-foreground/10 bg-primary p-4 animate-slide-up"
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
                    variant="ghost"
                    className={`w-full justify-start font-medium rounded-lg ${
                      isActive 
                        ? "bg-background text-foreground hover:bg-background/90" 
                        : "text-primary-foreground hover:bg-primary-foreground/10"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>
          
          {/* Mobile help message */}
          <div className="mt-4 pt-4 border-t border-primary-foreground/10">
            <p className="text-center text-primary-foreground/70 text-sm">
              Need help? We're at the cafeteria exit!
            </p>
          </div>
        </nav>
      )}
    </header>
  );
}