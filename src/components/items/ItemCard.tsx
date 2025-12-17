import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Tag, User, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  dateFound: string;
  imageUrl?: string;
  status: "available" | "claimed" | "pending";
  reporterName?: string;
  reporterEmail?: string;
  reporterPhone?: string;
}

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const statusColors = {
    available: "bg-green-500/10 text-green-700 border-green-500/20",
    claimed: "bg-muted text-muted-foreground border-muted",
    pending: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  };

  return (
    <>
      <Card 
        className="group overflow-hidden transition-all duration-300 hover:shadow-card-hover border-border cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
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
            <Link 
              to={`/claim?item=${item.id}`} 
              className="w-full"
              onClick={(e) => e.stopPropagation()}
            >
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{item.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {item.imageUrl && (
              <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Badge variant="outline" className={statusColors[item.status]}>
                {item.status}
              </Badge>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Found on {new Date(item.dateFound).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Reporter Contact Info */}
            <div className="border-t pt-4">
              <h4 className="font-semibold text-sm mb-3">Found By</h4>
              <div className="flex flex-col gap-2 text-sm">
                {item.reporterName && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{item.reporterName}</span>
                  </div>
                )}
                {item.reporterEmail && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <a 
                      href={`mailto:${item.reporterEmail}`} 
                      className="text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.reporterEmail}
                    </a>
                  </div>
                )}
                {item.reporterPhone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <a 
                      href={`tel:${item.reporterPhone}`} 
                      className="text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.reporterPhone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {item.status === "available" && (
              <Link 
                to={`/claim?item=${item.id}`} 
                className="block"
                onClick={() => setIsOpen(false)}
              >
                <Button className="w-full">
                  Claim This Item
                </Button>
              </Link>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
