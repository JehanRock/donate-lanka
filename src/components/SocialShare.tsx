import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, Facebook, Twitter, Linkedin, Link, Mail, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  projectTitle: string;
  projectDescription: string;
  projectUrl: string;
  className?: string;
}

export const SocialShare = ({ 
  projectTitle, 
  projectDescription, 
  projectUrl,
  className 
}: SocialShareProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareUrl = `${window.location.origin}${projectUrl}`;
  const shareText = `Check out this amazing project: ${projectTitle} - ${projectDescription}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Project link has been copied to your clipboard.",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out this project: ${projectTitle}`);
    const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Share2 className="w-4 h-4 mr-1" />
          Share
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share This Project
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Social Media Buttons */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Share on social media</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={shareOnFacebook}
                className="justify-start"
              >
                <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                Facebook
              </Button>
              
              <Button
                variant="outline"
                onClick={shareOnTwitter}
                className="justify-start"
              >
                <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                Twitter
              </Button>
              
              <Button
                variant="outline"
                onClick={shareOnLinkedIn}
                className="justify-start"
              >
                <Linkedin className="w-4 h-4 mr-2 text-blue-700" />
                LinkedIn
              </Button>
              
              <Button
                variant="outline"
                onClick={shareViaEmail}
                className="justify-start"
              >
                <Mail className="w-4 h-4 mr-2 text-green-600" />
                Email
              </Button>
            </div>
          </div>

          {/* Copy Link */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Or copy link</Label>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                onClick={handleCopyLink}
                variant={copied ? "default" : "outline"}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Share Stats */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Help spread the word and support this amazing project!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};