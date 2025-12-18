import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Upload, Heart, Clock, Shield, Sparkles, ArrowRight, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section - Asymmetric, storytelling layout */}
      <section className="relative min-h-[90vh] flex items-center bg-blobs">
        {/* Decorative elements */}
        <div className="absolute top-20 right-[15%] w-32 h-32 rounded-full bg-primary/5 blur-2xl animate-float" />
        <div className="absolute bottom-32 left-[10%] w-40 h-40 rounded-full bg-accent/30 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        
        <div className="container py-16 md:py-24">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left content - intentionally off-grid */}
            <div className="lg:col-span-7 lg:pr-8">
              {/* Handwritten accent */}
              <span 
                className="inline-block font-handwritten text-2xl md:text-3xl text-primary mb-4 animate-slide-left tilt-subtle"
                style={{ animationDelay: "0.1s" }}
              >
                Hey there, Rover! 👋
              </span>
              
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-wide text-foreground leading-[0.9] mb-6 animate-slide-up">
                LOST
                <span className="block text-primary tilt-right inline-block ml-2 lg:ml-4">
                  SOMETHING?
                </span>
              </h1>
              
              <p 
                className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 animate-slide-up leading-relaxed"
                style={{ animationDelay: "0.2s" }}
              >
                Don't worry, we've got your back. Search through found items, report what you've discovered, 
                or let us help reunite you with your stuff.
                <span className="font-handwritten text-primary text-2xl ml-2">It happens to everyone!</span>
              </p>
              
              <div 
                className="flex flex-col sm:flex-row gap-4 animate-slide-up"
                style={{ animationDelay: "0.35s" }}
              >
                <Link to="/browse">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 rounded-organic group">
                    <Search className="mr-2 h-5 w-5 group-hover:animate-wiggle" />
                    Find My Stuff
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/submit">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full sm:w-auto text-lg px-8 rounded-organic border-2"
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    I Found Something
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Right side - Stacked cards with personality */}
            <div className="lg:col-span-5 relative">
              <div className="relative h-[400px] lg:h-[480px]">
                {/* Background card */}
                <div 
                  className="absolute top-8 left-4 right-0 bottom-0 card-handcrafted p-6 tilt-right animate-scale-in"
                  style={{ animationDelay: "0.4s" }}
                >
                  <div className="h-full flex flex-col justify-between opacity-60">
                    <div>
                      <div className="w-16 h-16 rounded-xl bg-secondary mb-4" />
                      <div className="w-3/4 h-4 rounded bg-secondary mb-2" />
                      <div className="w-1/2 h-4 rounded bg-secondary" />
                    </div>
                  </div>
                </div>
                
                {/* Foreground card */}
                <div 
                  className="absolute top-0 left-0 right-8 bottom-8 card-handcrafted p-8 tilt-left animate-scale-in"
                  style={{ animationDelay: "0.5s" }}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <span className="font-handwritten text-lg text-primary">Recently found</span>
                      <h3 className="font-display text-2xl text-foreground">RED WATER BOTTLE</h3>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <p className="text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Found near the gym entrance
                    </p>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Posted 2 hours ago
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                      Available
                    </span>
                    <span className="font-handwritten text-lg text-muted-foreground">Could this be yours?</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats - Organic, scattered layout */}
      <section className="py-16 md:py-20 bg-secondary/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-blobs opacity-50" />
        <div className="container relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {[
              { value: "500+", label: "Items reunited with owners", emoji: "🎉", delay: "0s" },
              { value: "95%", label: "Success rate", emoji: "✨", delay: "0.1s" },
              { value: "24hr", label: "Average response time", emoji: "⚡", delay: "0.2s" },
              { value: "1000+", label: "Happy Rovers helped", emoji: "❤️", delay: "0.3s" },
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className={`text-center lg:text-left p-6 rounded-2xl bg-background/60 backdrop-blur-sm animate-slide-up ${index % 2 === 0 ? 'lg:translate-y-4' : ''}`}
                style={{ animationDelay: stat.delay }}
              >
                <div className="font-display text-4xl md:text-5xl text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground leading-snug">
                  {stat.label} <span className="inline-block ml-1">{stat.emoji}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Storytelling with personality */}
      <section className="py-20 md:py-28 relative">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="font-handwritten text-2xl text-primary mb-2 block animate-fade-in">
              Super simple, we promise
            </span>
            <h2 className="font-display text-4xl md:text-6xl tracking-wide text-foreground mb-4 animate-slide-up">
              HOW IT WORKS
            </h2>
            <p className="text-lg text-muted-foreground animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Three easy steps. That's it. No complicated forms or confusing processes.
            </p>
          </div>

          {/* Steps - Asymmetric layout */}
          <div className="max-w-5xl mx-auto space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            {[
              { 
                step: "1", 
                title: "Browse or Report",
                desc: "Lost something? Check our list. Found something? Snap a photo and tell us about it.",
                icon: Search,
                note: "Takes about 2 minutes"
              },
              { 
                step: "2", 
                title: "Claim Your Item",
                desc: "Spotted your stuff? Fill out a quick claim form. Tell us something only you'd know about it.",
                icon: Upload,
                note: "We verify everything"
              },
              { 
                step: "3", 
                title: "Pick It Up",
                desc: "Swing by the cafeteria exit doors with your ID. We'll have it waiting for you!",
                icon: Heart,
                note: "Mon-Fri, 8am-4pm"
              },
            ].map((item, index) => (
              <div 
                key={item.step}
                className={`relative p-8 rounded-2xl bg-card border border-border/60 animate-slide-up ${
                  index === 1 ? 'lg:-translate-y-6' : ''
                }`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Step number - organic placement */}
                <div className="absolute -top-5 -left-2 font-display text-7xl text-primary/15">
                  {item.step}
                </div>
                
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  
                  <h3 className="font-display text-2xl text-foreground mb-3">
                    {item.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {item.desc}
                  </p>
                  
                  <span className="font-handwritten text-lg text-primary/70">
                    {item.note}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Scattered, organic grid */}
      <section className="py-20 md:py-28 bg-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-blobs" />
        <div className="container relative">
          <div className="mb-16 max-w-2xl">
            <span className="font-handwritten text-2xl text-primary mb-2 block">
              Why students love us
            </span>
            <h2 className="font-display text-4xl md:text-5xl tracking-wide text-foreground mb-4">
              BUILT FOR ROVERS,
              <br />
              <span className="text-primary">BY ROVERS</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              We know what it's like to lose something important. That's why we made this as easy as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: "Smart Search",
                description: "Filter by category, location, date, or just describe what you lost. We'll find it.",
                accent: "Works like magic ✨"
              },
              {
                icon: Shield,
                title: "Secure Claims",
                description: "We verify every claim to make sure items go back to the right person. Your stuff, protected.",
                accent: "100% verified"
              },
              {
                icon: Clock,
                title: "30-Day Hold",
                description: "Items are safely stored for a full month. Plenty of time to realize you're missing something.",
                accent: "No rush"
              },
              {
                icon: Upload,
                title: "Easy Reporting",
                description: "Found something? Upload a photo, add details, done. Help a fellow Rover out.",
                accent: "Under 2 minutes"
              },
              {
                icon: Heart,
                title: "Community Spirit",
                description: "We're all in this together. Every item returned is a small win for everyone.",
                accent: "Go Rovers! 🏈"
              },
              {
                icon: Sparkles,
                title: "Always Improving",
                description: "Got ideas? We're listening. This system is made by students who actually use it.",
                accent: "Your feedback matters"
              },
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className={`card-handcrafted p-6 animate-slide-up ${
                  index % 3 === 1 ? 'lg:translate-y-4' : ''
                }`}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  {feature.description}
                </p>
                <span className="font-handwritten text-primary text-lg">
                  {feature.accent}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Personal, inviting */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
        <div className="absolute inset-0 bg-blobs opacity-20" />
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <span 
              className="inline-block font-handwritten text-2xl md:text-3xl text-primary-foreground/80 mb-4 animate-fade-in"
            >
              Ready when you are
            </span>
            
            <h2 className="font-display text-4xl md:text-6xl tracking-wide text-primary-foreground mb-6 animate-slide-up">
              LET'S FIND YOUR STUFF
            </h2>
            
            <p 
              className="text-lg md:text-xl text-primary-foreground/80 mb-10 animate-slide-up leading-relaxed"
              style={{ animationDelay: "0.1s" }}
            >
              Whether you've lost your favorite hoodie or found someone's calculator, 
              we're here to help. Every item has a story, and every story deserves a happy ending.
            </p>
            
            <div 
              className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Link to="/browse">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="w-full sm:w-auto text-lg px-8 rounded-organic group"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Search Lost Items
                </Button>
              </Link>
              <Link to="/submit">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto text-lg px-8 rounded-organic bg-transparent border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Report Found Item
                </Button>
              </Link>
            </div>
            
            <p 
              className="mt-8 font-handwritten text-xl text-primary-foreground/60 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              Questions? Stop by the cafeteria exit doors or email us anytime! 📧
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}