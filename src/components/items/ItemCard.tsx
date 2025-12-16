import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Tag } from "lucide-react";
import { Link } from "react-router-dom";

export interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  dateFound: string;
  imageUrl?: string;
  status: "available" | "claimed" | "pending";
}

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const statusColors = {
    available: "bg-green-500/10 text-green-700 border-green-500/20",
    claimed: "bg-muted text-muted-foreground border-muted",
    pending: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-card-hover border-border">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Tag className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg text-foreground line-clamp-1">
            {item.name}
          </h3>
          <Badge variant="outline" className={statusColors[item.status]}>
            {item.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {item.description}
        </p>
        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{new Date(item.dateFound).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        {item.status === "available" && (
          <Link to={`/claim?item=${item.id}`} className="w-full">
            <Button className="w-full" size="sm">
              Claim This Item
            </Button>
          </Link>
        )}
        {item.status !== "available" && (
          <Button variant="secondary" className="w-full" size="sm" disabled>
            {item.status === "claimed" ? "Already Claimed" : "Claim Pending"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
