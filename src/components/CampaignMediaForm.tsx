import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Crop,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Download,
  Eye,
  AlertCircle
} from "lucide-react";
import { CampaignData } from "./CampaignCreationWizard";
import { useToast } from "@/hooks/use-toast";

interface CampaignMediaFormProps {
  data: CampaignData;
  onUpdate: (updates: Partial<CampaignData>) => void;
}

interface ImageUploadState {
  file: File;
  preview: string;
  isProcessing: boolean;
}

export const CampaignMediaForm = ({ data, onUpdate }: CampaignMediaFormProps) => {
  const [coverImageState, setCoverImageState] = useState<ImageUploadState | null>(null);
  const [additionalImages, setAdditionalImages] = useState<ImageUploadState[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const MAX_ADDITIONAL_IMAGES = 8;

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Please upload a valid image file (JPEG, PNG, or WebP)';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB';
    }
    return null;
  };

  const processImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleCoverImageUpload = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast({
        title: "Invalid file",
        description: error,
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const preview = await processImage(file);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      setCoverImageState({
        file,
        preview,
        isProcessing: false
      });

      onUpdate({ coverImage: file });
      
      setTimeout(() => {
        setUploadProgress(100);
        setIsUploading(false);
        clearInterval(progressInterval);
      }, 1000);

      toast({
        title: "Image uploaded successfully",
        description: "Your cover image has been uploaded."
      });
    } catch (error) {
      setIsUploading(false);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAdditionalImageUpload = async (files: FileList) => {
    const newImages: ImageUploadState[] = [];
    const currentTotal = additionalImages.length;
    
    if (currentTotal + files.length > MAX_ADDITIONAL_IMAGES) {
      toast({
        title: "Too many images",
        description: `You can upload up to ${MAX_ADDITIONAL_IMAGES} additional images.`,
        variant: "destructive"
      });
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const error = validateFile(file);
      
      if (error) {
        toast({
          title: "Invalid file",
          description: `${file.name}: ${error}`,
          variant: "destructive"
        });
        continue;
      }

      try {
        const preview = await processImage(file);
        newImages.push({
          file,
          preview,
          isProcessing: false
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: `Failed to process ${file.name}`,
          variant: "destructive"
        });
      }
    }

    if (newImages.length > 0) {
      const updatedImages = [...additionalImages, ...newImages];
      setAdditionalImages(updatedImages);
      onUpdate({ 
        additionalImages: [...data.additionalImages, ...newImages.map(img => img.file)]
      });
    }
  };

  const removeCoverImage = () => {
    setCoverImageState(null);
    onUpdate({ coverImage: undefined });
  };

  const removeAdditionalImage = (index: number) => {
    const newImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(newImages);
    onUpdate({ 
      additionalImages: data.additionalImages.filter((_, i) => i !== index)
    });
  };

  const ImageEditor = ({ src, onSave }: { src: string; onSave: (editedSrc: string) => void }) => {
    return (
      <div className="border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <h4 className="font-medium">Image Editor</h4>
          <Badge variant="secondary">Beta</Badge>
        </div>
        
        <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
          <img src={src} alt="Preview" className="w-full h-full object-contain" />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Crop className="w-4 h-4 mr-1" />
            Crop
          </Button>
          <Button variant="outline" size="sm">
            <RotateCw className="w-4 h-4 mr-1" />
            Rotate
          </Button>
          <Button variant="outline" size="sm">
            <ZoomIn className="w-4 h-4 mr-1" />
            Zoom
          </Button>
          <div className="flex-1" />
          <Button size="sm" onClick={() => onSave(src)}>
            <Download className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Cover Image *</Label>
          <p className="text-xs text-muted-foreground mt-1">
            This will be the main image for your campaign. Recommended size: 1200x675px
          </p>
        </div>

        {!coverImageState ? (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-medium text-foreground mb-2">
                Upload Cover Image
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Drag and drop your image here, or click to browse
              </p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(',')}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCoverImageUpload(file);
                }}
                className="hidden"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-start gap-4">
                <div className="aspect-video w-48 bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={coverImageState.preview} 
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">Cover Image</h4>
                      <p className="text-sm text-muted-foreground">
                        {coverImageState.file.name}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={removeCoverImage}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Size: {(coverImageState.file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading image...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
      </div>

      {/* Additional Images */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Additional Images</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Upload up to {MAX_ADDITIONAL_IMAGES} more images to showcase your project
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => additionalInputRef.current?.click()}
            disabled={additionalImages.length >= MAX_ADDITIONAL_IMAGES}
          >
            <Upload className="w-4 h-4 mr-1" />
            Add Images
          </Button>
        </div>

        <input
          ref={additionalInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          multiple
          onChange={(e) => {
            const files = e.target.files;
            if (files) handleAdditionalImageUpload(files);
          }}
          className="hidden"
        />

        {additionalImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {additionalImages.map((image, index) => (
              <Card key={index} className="p-2">
                <div className="aspect-square bg-muted rounded overflow-hidden mb-2">
                  <img 
                    src={image.preview} 
                    alt={`Additional ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground truncate">
                    {image.file.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAdditionalImage(index)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="border border-dashed rounded-lg p-6 text-center">
            <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No additional images uploaded yet
            </p>
          </div>
        )}
      </div>

      {/* Upload Guidelines */}
      <Card className="p-4 bg-muted/50">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Image Guidelines
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div>
            <h4 className="font-medium text-foreground mb-2">Requirements:</h4>
            <ul className="space-y-1">
              <li>• Formats: JPEG, PNG, WebP</li>
              <li>• Maximum size: 10MB per image</li>
              <li>• Recommended: 1200x675px for cover</li>
              <li>• High resolution for best quality</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">Best Practices:</h4>
            <ul className="space-y-1">
              <li>• Use bright, clear images</li>
              <li>• Show your product/project in use</li>
              <li>• Include people when relevant</li>
              <li>• Avoid text overlays on cover image</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Upload Status */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Images: {(coverImageState ? 1 : 0) + additionalImages.length} / {MAX_ADDITIONAL_IMAGES + 1}
        </span>
        <div className="flex items-center gap-1">
          {coverImageState && (
            <Badge variant="secondary">Cover ✓</Badge>
          )}
          {additionalImages.length > 0 && (
            <Badge variant="outline">+{additionalImages.length}</Badge>
          )}
        </div>
      </div>
    </div>
  );
};