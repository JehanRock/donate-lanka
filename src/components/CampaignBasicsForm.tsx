import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { CampaignData } from "./CampaignCreationWizard";
import MapLocationPicker from "./MapLocationPicker";

interface CampaignBasicsFormProps {
  data: CampaignData;
  onUpdate: (updates: Partial<CampaignData>) => void;
}

const CATEGORIES = [
  { value: 'technology', label: 'Technology' },
  { value: 'arts_culture', label: 'Arts & Culture' },
  { value: 'community', label: 'Community' },
  { value: 'education', label: 'Education' },
  { value: 'medical', label: 'Medical' },
  { value: 'animals', label: 'Animals' },
  { value: 'sports', label: 'Sports' },
  { value: 'disaster_relief', label: 'Disaster Relief' }
];

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IN', label: 'India' },
  { value: 'JP', label: 'Japan' }
];

export const CampaignBasicsForm = ({ data, onUpdate }: CampaignBasicsFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Campaign title is required';
        } else if (value.length < 10) {
          newErrors.title = 'Title must be at least 10 characters';
        } else if (value.length > 100) {
          newErrors.title = 'Title must be less than 100 characters';
        } else {
          delete newErrors.title;
        }
        break;
      case 'tagline':
        if (!value.trim()) {
          newErrors.tagline = 'Tagline is required';
        } else if (value.length > 150) {
          newErrors.tagline = 'Tagline must be less than 150 characters';
        } else {
          delete newErrors.tagline;
        }
        break;
      case 'city':
        if (!value.trim()) {
          newErrors.city = 'City is required';
        } else {
          delete newErrors.city;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (field: string, value: string) => {
    validateField(field, value);
    
    if (field === 'city' || field === 'state') {
      onUpdate({
        location: {
          ...data.location,
          [field]: value
        }
      });
    } else {
      onUpdate({ [field]: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* Campaign Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            Campaign Title *
          </Label>
          <Input
            id="title"
            placeholder="Give your campaign a compelling title"
            value={data.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={errors.title ? 'border-destructive' : ''}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {data.title.length}/100 characters
          </p>
        </div>

        {/* Tagline */}
        <div className="space-y-2">
          <Label htmlFor="tagline" className="text-sm font-medium">
            Short Description *
          </Label>
          <Textarea
            id="tagline"
            placeholder="Briefly describe your project in one or two sentences"
            value={data.tagline}
            onChange={(e) => handleInputChange('tagline', e.target.value)}
            className={`min-h-[80px] ${errors.tagline ? 'border-destructive' : ''}`}
          />
          {errors.tagline && (
            <p className="text-sm text-destructive">{errors.tagline}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {data.tagline.length}/150 characters
          </p>
        </div>

        {/* Location */}
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-4">Project Location in Sri Lanka *</h3>
          <MapLocationPicker
            onLocationSelect={(locationData) => {
              onUpdate({
                location: {
                  ...data.location,
                  latitude: locationData.latitude,
                  longitude: locationData.longitude,
                  address: locationData.address,
                  country: 'LK', // Always Sri Lanka
                  city: locationData.address.split(',')[0] || '', // Extract city from address
                }
              });
            }}
            initialLatitude={data.location.latitude || 7.8731}
            initialLongitude={data.location.longitude || 80.7718}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Click on the map or drag the pin to select your project location
          </p>
        </Card>

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Category *
          </Label>
          <Select value={data.category} onValueChange={(value) => onUpdate({ category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category for your campaign" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Choose the category that best describes your project
          </p>
        </div>
      </div>

      {/* Tips */}
      <Card className="p-4 bg-muted/50">
        <h3 className="text-sm font-medium mb-2">💡 Tips for Success</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Choose a clear, compelling title that explains what you're creating</li>
          <li>• Write a tagline that captures the essence of your project</li>
          <li>• Select the most relevant category to help supporters find you</li>
          <li>• Be specific about your location to build local support</li>
        </ul>
      </Card>
    </div>
  );
};