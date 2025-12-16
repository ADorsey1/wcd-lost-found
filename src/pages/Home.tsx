import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Upload, ClipboardList, Clock, Shield, Users } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Easy Search",
    description: "Quickly find your lost items with powerful search and filtering options.",
  },
  {
    icon: Upload,
    title: "Report Items",
    description: "Help others by reporting found items with photos and details.",
  },
  {
    icon: ClipboardList,
    title: "Simple Claims",
    description: "Straightforward claim process to reunite you with your belongings.",
  },
  {
    icon: Clock,
    title: "30-Day Holding",
    description: "Items are safely stored for 30 days before being donated.",
  },
  {
    icon: Shield,
    title: "Verified Claims",
    description: "Secure verification process ensures items go to rightful owners.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Students helping students create a better campus community.",
  },
];

const stats = [
  { value: "500+", label: "Items Returned" },
  { value: "95%", label: "Return Rate" },
  { value: "24hr", label: "Avg Response" },
  { value: "1000+", label: "Happy Students" },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-foreground py-20 md:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(352,85%,42%)_0%,hsl(0,0%,8%)_100%)] opacity-90" />
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-5xl md:text-7xl tracking-wide text-background mb-6 animate-fade-in">
              LOST SOMETHING?
              <br />
              <span className="text-primary">WE'VE GOT YOU.</span>
            </h1>
            <p className="text-lg md:text-xl text-background/80 mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              Easton Area School District's official lost and found system. Search for lost items, 
              report found belongings, and help reunite Rovers with their stuff.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <Link to="/browse">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Items
                </Button>
              </Link>
              <Link to="/submit">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 bg-background/10 text-background border-background/20 hover:bg-background/20">
                  <Upload className="mr-2 h-5 w-5" />
                  Report Found Item
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-secondary">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="font-display text-4xl md:text-5xl text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl tracking-wide text-foreground mb-4">
              HOW IT WORKS
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to find your lost items or help others find theirs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Search or Report", desc: "Browse existing items or report a found item with details and photos." },
              { step: "02", title: "Submit a Claim", desc: "Found your item? Submit a claim with identifying details." },
              { step: "03", title: "Pick It Up", desc: "Visit the office with your ID to collect your verified item." },
            ].map((item, index) => (
              <div 
                key={item.step} 
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="font-display text-6xl text-primary/20 mb-2">
                  {item.step}
                </div>
                <h3 className="font-display text-2xl text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl tracking-wide text-foreground mb-4">
              WHY USE OUR SYSTEM?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built by students, for students. Making it easier to recover lost items.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="border-border hover:shadow-card-hover transition-shadow duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container">
          <div className="text-center">
            <h2 className="font-display text-4xl md:text-5xl tracking-wide text-primary-foreground mb-4">
              READY TO GET STARTED?
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Whether you've lost something or found someone else's belongings, 
              we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/browse">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8">
                  Search Lost Items
                </Button>
              </Link>
              <Link to="/submit">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Report Found Item
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
