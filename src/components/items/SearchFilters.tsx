import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, ArrowUpDown } from "lucide-react";

export const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

export const categories = [
  "All Categories",
  "Electronics",
  "Clothing",
  "Books & Supplies",
  "Keys & ID Cards",
  "Bags & Backpacks",
  "Sports Equipment",
  "Jewelry & Accessories",
  "Other",
];

export const locations = [
  "All Locations",
  "Library",
  "Cafeteria",
  "Gymnasium",
  "Science Building",
  "Arts Building",
  "Main Hall",
  "Parking Lot",
  "Sports Field",
  "Other",
];

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
  onClear: () => void;
}

export function SearchFilters({
  searchQuery,
  setSearchQuery,
  category,
  setCategory,
  location,
  setLocation,
  sortOrder,
  setSortOrder,
  onClear,
}: SearchFiltersProps) {
  const hasFilters = searchQuery || category !== "All Categories" || location !== "All Locations" || sortOrder !== "newest";

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location Filter */}
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-full md:w-[200px]" aria-label="Filter by location">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort by Date */}
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-full md:w-[160px]" aria-label="Sort by date found">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
