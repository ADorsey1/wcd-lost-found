import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ItemCard, Item } from "@/components/items/ItemCard";
import { SearchFilters } from "@/components/items/SearchFilters";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export default function Browse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("All Locations");
  const [sortOrder, setSortOrder] = useState("newest");

  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['found-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('found_items')
        .select('*')
        .neq('status', 'claimed')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map((item): Item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        category: item.category,
        location: item.location,
        dateFound: item.date_found,
        imageUrl: item.image_url || undefined,
        status: item.status as 'available' | 'claimed' | 'pending',
        reporterName: item.reporter_name,
        reporterEmail: item.reporter_email,
        reporterPhone: item.reporter_phone || undefined,
      }));
    },
  });

  const filteredItems = useMemo(() => {
    const filtered = items.filter((item) => {
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

    // Sort by date found
    return filtered.sort((a, b) => {
      const dateA = new Date(a.dateFound).getTime();
      const dateB = new Date(b.dateFound).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [items, searchQuery, category, location, sortOrder]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategory("All Categories");
    setLocation("All Locations");
    setSortOrder("newest");
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
            Search through {items.length} items in our lost and found database.
          </p>
        </div>

        <div className="mb-8">
          <SearchFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            category={category}
            setCategory={setCategory}
            location={location}
            setLocation={setLocation}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            onClear={handleClearFilters}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="font-display text-2xl text-foreground mb-2">
              UNABLE TO LOAD ITEMS
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              There was an error loading the items. Please try again later.
            </p>
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && filteredItems.length > 0 && (
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
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="font-display text-2xl text-foreground mb-2">
              NO ITEMS FOUND
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {items.length === 0 
                ? "No items have been reported yet. Check back later or report a found item!"
                : "We couldn't find any items matching your search. Try adjusting your filters or check back later as new items are added daily."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
