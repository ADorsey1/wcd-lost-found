import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import easdLogo from "@/assets/easd-logo.png";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse Items" },
  { href: "/submit", label: "Report Found Item" },
  { href: "/claim", label: "Claim Item" },
];

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={easdLogo} alt="Easton Area School District Logo" className="h-12 w-auto" />
          <div className="flex flex-col">
            <span className="font-display text-xl tracking-wide text-foreground leading-tight">
              ROVER SEARCH
            </span>
            <span className="text-xs text-muted-foreground">
              Easton Area School District
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href}>
              <Button
                variant={location.pathname === link.href ? "default" : "ghost"}
                className="font-medium"
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-border bg-background p-4">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  variant={location.pathname === link.href ? "default" : "ghost"}
                  className="w-full justify-start font-medium"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
