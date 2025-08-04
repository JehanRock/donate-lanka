import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ProjectImage } from "@/types/project";

interface ProjectImageGalleryProps {
  images: ProjectImage[];
  title: string;
}

export const ProjectImageGallery = ({ images, title }: ProjectImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">No images available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div 
        className="aspect-video rounded-lg overflow-hidden cursor-pointer relative group"
        onClick={() => setIsLightboxOpen(true)}
      >
        <img
          src={images[selectedImageIndex]?.url || "/placeholder.svg"}
          alt={images[selectedImageIndex]?.alt || title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        
        {/* Navigation arrows for main image */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost" 
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`aspect-video rounded cursor-pointer overflow-hidden border-2 transition-colors ${
                index === selectedImageIndex 
                  ? "border-primary" 
                  : "border-transparent hover:border-muted-foreground"
              }`}
              onClick={() => setSelectedImageIndex(index)}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
          <div className="relative w-full h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
            
            <img
              src={images[selectedImageIndex]?.url}
              alt={images[selectedImageIndex]?.alt || title}
              className="w-full h-full object-contain"
            />
            
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};