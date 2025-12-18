import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Heart } from "lucide-react";
import easdLogo from "@/assets/easd-logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-secondary/30 relative overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/3 blur-3xl" />
      
      <div className="container py-16 relative">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand with personality */}
          <div className="space-y-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src={easdLogo} 
                alt="Easton Area School District Logo" 
                className="h-10 w-auto transition-transform group-hover:scale-105" 
              />
              <span className="font-display text-xl tracking-wide text-foreground">
                ROVER SEARCH
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Helping Rovers find their lost treasures since 2024. 
              <span className="font-handwritten text-primary text-lg block mt-1">
                Because losing stuff happens!
              </span>
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-display text-lg tracking-wide text-foreground">
              QUICK LINKS
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  to="/browse" 
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Browse Items
                </Link>
              </li>
              <li>
                <Link 
                  to="/submit" 
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Report Found Item
                </Link>
              </li>
              <li>
                <Link 
                  to="/claim" 
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Claim an Item
                </Link>
              </li>
              <li className="pt-2 border-t border-border/60 mt-2">
                <Link 
                  to="/admin/login" 
                  className="text-muted-foreground/70 hover:text-primary transition-colors text-xs"
                >
                  Staff Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact - with friendly tone */}
          <div className="space-y-4">
            <h3 className="font-display text-lg tracking-wide text-foreground">
              FIND US
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="mailto:lostandfound@eastonsd.org"
                  className="flex items-start gap-3 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <Mail className="h-4 w-4 mt-0.5 text-primary/60 group-hover:text-primary" />
                  <span>lostandfound@eastonsd.org</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+16107300274"
                  className="flex items-start gap-3 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <Phone className="h-4 w-4 mt-0.5 text-primary/60 group-hover:text-primary" />
                  <span>(610) 730-0274</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 text-primary/60" />
                <span>Cafeteria Exit Doors<br />
                  <span className="font-handwritten text-primary text-base">Can't miss it!</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Hours - with personality */}
          <div className="space-y-4">
            <h3 className="font-display text-lg tracking-wide text-foreground">
              HOURS
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Monday – Friday</p>
              <p>8:00 AM – 4:00 PM</p>
              <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-primary font-medium text-xs uppercase tracking-wide mb-1">
                  Good to know
                </p>
                <p className="text-muted-foreground">
                  Items held for <span className="font-semibold text-foreground">30 days</span> before donation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar - with heart */}
        <div className="mt-12 pt-8 border-t border-border/60">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-primary fill-primary animate-pulse" /> by Rovers, for Rovers
            </p>
            <p>
              © {new Date().getFullYear()} Easton Area School District
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}