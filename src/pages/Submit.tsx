import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, locations } from "@/components/items/SearchFilters";
import { toast } from "sonner";
import { Upload, Camera, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Submit() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    category: "",
    location: "",
    dateFound: "",
    finderName: "",
    finderEmail: "",
    finderPhone: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl: string | null = null;

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('item-images')
          .upload(fileName, imageFile);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error('Failed to upload image');
        }

        const { data: { publicUrl } } = supabase.storage
          .from('item-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      // Insert item into database
      const { error: insertError } = await supabase
        .from('found_items')
        .insert({
          name: formData.itemName,
          description: formData.description,
          category: formData.category,
          location: formData.location,
          date_found: formData.dateFound,
          image_url: imageUrl,
          reporter_name: formData.finderName,
          reporter_email: formData.finderEmail,
          reporter_phone: formData.finderPhone || null,
          status: 'available',
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error('Failed to submit item');
      }

      toast.success("Item submitted successfully!", {
        description: "Thank you for helping reunite someone with their belongings.",
      });

      navigate("/browse");
    } catch (error) {
      console.error('Submission error:', error);
      toast.error("Failed to submit item", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const filteredCategories = categories.filter((c) => c !== "All Categories");
  const filteredLocations = locations.filter((l) => l !== "All Locations");

  return (
    <div className="py-8 md:py-12">
      <div className="container max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl tracking-wide text-foreground mb-2">
            REPORT FOUND ITEM
          </h1>
          <p className="text-lg text-muted-foreground">
            Help a fellow student by reporting an item you've found.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
            <CardDescription>
              Please provide as much detail as possible to help identify the item.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Item Photo (Optional)</Label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer">
                    <div className={`h-32 w-32 rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden transition-colors hover:border-primary ${imagePreview ? "border-solid" : ""}`}>
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-1" />
                          <span className="text-xs text-muted-foreground">Add photo</span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-muted-foreground">
                    A photo helps owners identify their items more easily.
                  </p>
                </div>
              </div>

              {/* Item Name */}
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name *</Label>
                <Input
                  id="itemName"
                  placeholder="e.g., Black iPhone, Blue Jacket, Calculator"
                  value={formData.itemName}
                  onChange={(e) => handleInputChange("itemName", e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the item in detail: color, brand, size, distinguishing features..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label>Where Found *</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => handleInputChange("location", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredLocations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date Found */}
              <div className="space-y-2">
                <Label htmlFor="dateFound">Date Found *</Label>
                <Input
                  id="dateFound"
                  type="date"
                  value={formData.dateFound}
                  onChange={(e) => handleInputChange("dateFound", e.target.value)}
                  required
                />
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-4">Your Contact Information</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="finderName">Your Name *</Label>
                    <Input
                      id="finderName"
                      placeholder="Enter your full name"
                      value={formData.finderName}
                      onChange={(e) => handleInputChange("finderName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="finderEmail">Email *</Label>
                      <Input
                        id="finderEmail"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.finderEmail}
                        onChange={(e) => handleInputChange("finderEmail", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="finderPhone">Phone (Optional)</Label>
                      <Input
                        id="finderPhone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.finderPhone}
                        onChange={(e) => handleInputChange("finderPhone", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Submit Found Item
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
