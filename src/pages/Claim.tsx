import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Send, ArrowLeft, CheckCircle, Package, MapPin, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Claim() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const itemId = searchParams.get("item");

  const { data: selectedItem, isLoading } = useQuery({
    queryKey: ['found-item', itemId],
    queryFn: async () => {
      if (!itemId) return null;
      const { data, error } = await supabase
        .from('found_items')
        .select('*')
        .eq('id', itemId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!itemId,
  });

  // Fetch available items for carousel when no item is selected
  const { data: availableItems, isLoading: isLoadingItems } = useQuery({
    queryKey: ['available-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('found_items')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    enabled: !itemId,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    studentId: "",
    proofOfOwnership: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!itemId) {
      toast.error("No item selected");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('claims')
        .insert({
          item_id: itemId,
          claimant_name: formData.name,
          claimant_email: formData.email,
          claimant_phone: formData.phone || null,
          student_id: formData.studentId || null,
          description_proof: formData.proofOfOwnership,
          status: 'pending',
        });

      if (error) {
        console.error('Claim error:', error);
        throw error;
      }

      // Update item status to pending
      await supabase
        .from('found_items')
        .update({ status: 'pending' })
        .eq('id', itemId);

      toast.success("Claim submitted successfully!", {
        description: "We'll review your claim and contact you within 24-48 hours.",
      });

      navigate("/browse");
    } catch (error) {
      console.error('Submission error:', error);
      toast.error("Failed to submit claim", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="py-8 md:py-12">
      <div className="container max-w-2xl">
        {/* Back Link */}
        <Link
          to="/browse"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Browse
        </Link>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl tracking-wide text-foreground mb-2">
            CLAIM AN ITEM
          </h1>
          <p className="text-lg text-muted-foreground">
            Submit a claim request to retrieve your lost item.
          </p>
        </div>

        {/* Selected Item Preview */}
        {isLoading && (
          <Card className="mb-6 border-primary/20 bg-accent/30">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Skeleton className="h-20 w-20 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedItem && (
          <Card className="mb-6 border-primary/20 bg-accent/30">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                {selectedItem.image_url && (
                  <img
                    src={selectedItem.image_url}
                    alt={selectedItem.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-foreground">
                    Claiming: {selectedItem.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Found at {selectedItem.location} on{" "}
                    {new Date(selectedItem.date_found).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Item Selection Carousel - shown when no item selected */}
        {!itemId && (
          <Card className="mb-6 border-primary/20 bg-accent/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Select an Item to Claim</CardTitle>
              <CardDescription>
                Browse available items below or <Link to="/browse" className="text-primary underline">view all items</Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingItems ? (
                <div className="flex gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-40 rounded-lg flex-shrink-0" />
                  ))}
                </div>
              ) : availableItems && availableItems.length > 0 ? (
                <Carousel className="w-full" opts={{ align: "start", loop: true }}>
                  <CarouselContent className="-ml-2">
                    {availableItems.map((item) => (
                      <CarouselItem key={item.id} className="pl-2 basis-1/2 md:basis-1/3">
                        <button
                          onClick={() => navigate(`/claim?item=${item.id}`)}
                          className="w-full text-left"
                        >
                          <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                            <CardContent className="p-3">
                              {item.image_url ? (
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="h-20 w-full rounded object-cover mb-2"
                                />
                              ) : (
                                <div className="h-20 w-full rounded bg-muted flex items-center justify-center mb-2">
                                  <Package className="h-8 w-8 text-muted-foreground" />
                                </div>
                              )}
                              <h4 className="font-medium text-sm text-foreground truncate">
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{item.location}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(item.date_found).toLocaleDateString()}</span>
                              </div>
                            </CardContent>
                          </Card>
                        </button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="-left-4" />
                  <CarouselNext className="-right-4" />
                </Carousel>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No items currently available. Check back later!
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Claim Form</CardTitle>
            <CardDescription>
              Please fill out this form completely. We'll verify your ownership 
              before releasing the item.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Personal Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID Number</Label>
                  <Input
                    id="studentId"
                    placeholder="Enter your student ID (optional)"
                    value={formData.studentId}
                    onChange={(e) => handleInputChange("studentId", e.target.value)}
                  />
                </div>
              </div>

              {/* Item Verification */}
              <div className="border-t border-border pt-6 space-y-4">
                <h3 className="font-semibold text-foreground">Item Verification</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="proofOfOwnership">
                    Proof of Ownership / Description *
                  </Label>
                  <Textarea
                    id="proofOfOwnership"
                    placeholder="Describe specific features that prove this is your item: brand, color, unique markings, serial numbers, contents, lock combinations, etc..."
                    value={formData.proofOfOwnership}
                    onChange={(e) => handleInputChange("proofOfOwnership", e.target.value)}
                    rows={5}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Be as specific as possible. This helps us verify you're the rightful owner.
                  </p>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-accent/50 rounded-lg p-4 border border-border">
                <h4 className="font-semibold text-foreground mb-2">
                  What happens next?
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>1. We'll review your claim within 24-48 hours</li>
                  <li>2. You'll receive an email with next steps</li>
                  <li>3. Bring your student ID to pick up the item</li>
                  <li>4. Items are available at Main Office, Room 101</li>
                </ul>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg" 
                disabled={isSubmitting || !itemId}
              >
                {isSubmitting ? (
                  <>
                    <Send className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Claim...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Submit Claim
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
