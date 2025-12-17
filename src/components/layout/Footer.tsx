import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import easdLogo from "@/assets/easd-logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={easdLogo} alt="Easton Area School District Logo" className="h-10 w-auto" />
              <span className="font-display text-xl tracking-wide text-foreground">
                EASD LOST & FOUND
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Easton Area School District - Helping reunite students with their belongings.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-display text-lg tracking-wide text-foreground">
              QUICK LINKS
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/browse" className="text-muted-foreground hover:text-primary transition-colors">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link to="/submit" className="text-muted-foreground hover:text-primary transition-colors">
                  Report Found Item
                </Link>
              </li>
              <li>
                <Link to="/claim" className="text-muted-foreground hover:text-primary transition-colors">
                  Claim an Item
                </Link>
              </li>
              <li className="pt-2 border-t border-border mt-2">
                <Link to="/admin/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Staff Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-display text-lg tracking-wide text-foreground">
              CONTACT
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                lostandfound@eastonsd.org
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                (610) 730-0274
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Cafeteria Exit Doors
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h3 className="font-display text-lg tracking-wide text-foreground">
              OFFICE HOURS
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Monday - Friday</li>
              <li>8:00 AM - 4:00 PM</li>
              <li className="pt-2 text-primary font-medium">
                Items held for 30 days
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Easton Area School District Lost & Found. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
