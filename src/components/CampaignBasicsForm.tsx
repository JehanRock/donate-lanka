import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CampaignData } from "./CampaignCreationWizard";
import MapLocationPicker from "./MapLocationPicker";
import { sdgData } from "@/types/sdg";

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

  const handleSDGToggle = (sdgId: number) => {
    const currentSDGs = data.sdgAlignments || [];
    const isSelected = currentSDGs.includes(sdgId);
    
    const updatedSDGs = isSelected 
      ? currentSDGs.filter(id => id !== sdgId)
      : [...currentSDGs, sdgId];
    
    onUpdate({ sdgAlignments: updatedSDGs });
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

        {/* UN SDG Alignment */}
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium">
              UN Sustainable Development Goals Alignment
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Select one or more UN SDGs that your campaign directly supports (optional but recommended)
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {sdgData.map((sdg) => {
              const isSelected = data.sdgAlignments?.includes(sdg.id);
              
              return (
                <button
                  key={sdg.id}
                  type="button"
                  onClick={() => handleSDGToggle(sdg.id)}
                  className={`relative flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                    isSelected 
                      ? 'border-primary bg-primary/10 shadow-md' 
                      : 'border-muted hover:border-primary/50 bg-background'
                  }`}
                >
                  <img 
                    src={sdg.iconPath} 
                    alt={`SDG ${sdg.id}: ${sdg.title}`}
                    className="w-12 h-12 rounded object-cover mb-2"
                  />
                  <span className="text-xs font-medium text-center leading-tight">
                    SDG {sdg.id}
                  </span>
                  <span className="text-xs text-muted-foreground text-center leading-tight mt-1">
                    {sdg.title.length > 20 ? `${sdg.title.substring(0, 20)}...` : sdg.title}
                  </span>
                  
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">✓</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          
          {data.sdgAlignments && data.sdgAlignments.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs text-muted-foreground">Selected SDGs:</span>
              {data.sdgAlignments.map((sdgId) => {
                const sdg = sdgData.find(s => s.id === sdgId);
                return sdg ? (
                  <Badge key={sdgId} variant="secondary" className="text-xs">
                    SDG {sdg.id}: {sdg.title}
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <Card className="p-4 bg-muted/50">
        <h3 className="text-sm font-medium mb-2">💡 Tips for Success</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Choose a clear, compelling title that explains what you're creating</li>
          <li>• Write a tagline that captures the essence of your project</li>
          <li>• Select the most relevant category to help supporters find you</li>
          <li>• Align with UN SDGs to showcase your project's global impact</li>
          <li>• Be specific about your location to build local support</li>
        </ul>
      </Card>
    </div>
  );
};