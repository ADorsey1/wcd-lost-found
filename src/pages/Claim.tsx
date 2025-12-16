import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockItems } from "@/data/mockItems";
import { toast } from "sonner";
import { Send, ArrowLeft, CheckCircle } from "lucide-react";

export default function Claim() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const itemId = searchParams.get("item");
  const selectedItem = itemId ? mockItems.find((i) => i.id === itemId) : null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    studentId: "",
    itemDescription: "",
    proofOfOwnership: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Claim submitted successfully!", {
      description: "We'll review your claim and contact you within 24-48 hours.",
    });

    setIsSubmitting(false);
    navigate("/browse");
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
        {selectedItem && (
          <Card className="mb-6 border-primary/20 bg-accent/30">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                {selectedItem.imageUrl && (
                  <img
                    src={selectedItem.imageUrl}
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
                    {new Date(selectedItem.dateFound).toLocaleDateString()}
                  </p>
                </div>
              </div>
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
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID Number *</Label>
                  <Input
                    id="studentId"
                    placeholder="Enter your student ID"
                    value={formData.studentId}
                    onChange={(e) => handleInputChange("studentId", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Item Verification */}
              <div className="border-t border-border pt-6 space-y-4">
                <h3 className="font-semibold text-foreground">Item Verification</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="itemDescription">
                    Describe the Item in Detail *
                  </Label>
                  <Textarea
                    id="itemDescription"
                    placeholder="Describe specific features: brand, color, size, any markings or damage, contents (if applicable)..."
                    value={formData.itemDescription}
                    onChange={(e) => handleInputChange("itemDescription", e.target.value)}
                    rows={4}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Be as specific as possible. This helps us verify you're the rightful owner.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proofOfOwnership">
                    Proof of Ownership *
                  </Label>
                  <Textarea
                    id="proofOfOwnership"
                    placeholder="Describe any unique identifiers: serial numbers, photos you have, receipts, personal markings, lock combinations, specific contents..."
                    value={formData.proofOfOwnership}
                    onChange={(e) => handleInputChange("proofOfOwnership", e.target.value)}
                    rows={4}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    We may ask you to verify this information when you pick up the item.
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

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
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
