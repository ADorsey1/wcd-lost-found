import { useState, useMemo } from "react";
import { ItemCard } from "@/components/items/ItemCard";
import { SearchFilters } from "@/components/items/SearchFilters";
import { mockItems } from "@/data/mockItems";

export default function Browse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("All Locations");

  const filteredItems = useMemo(() => {
    return mockItems.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        category === "All Categories" || item.category === category;

      const matchesLocation =
        location === "All Locations" || item.location === location;

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [searchQuery, category, location]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategory("All Categories");
    setLocation("All Locations");
  };

  return (
    <div className="py-8 md:py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl tracking-wide text-foreground mb-2">
            BROWSE ITEMS
          </h1>
          <p className="text-lg text-muted-foreground">
            Search through {mockItems.length} items in our lost and found database.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <SearchFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            category={category}
            setCategory={setCategory}
            location={location}
            setLocation={setLocation}
            onClear={handleClearFilters}
          />
        </div>

        {/* Results */}
        {filteredItems.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Showing {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ItemCard item={item} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="font-display text-2xl text-foreground mb-2">
              NO ITEMS FOUND
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We couldn't find any items matching your search. Try adjusting your 
              filters or check back later as new items are added daily.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
