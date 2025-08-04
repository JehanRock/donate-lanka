import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  CheckCircle, 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  MessageCircle,
  ExternalLink,
  Award,
  Heart,
  TrendingUp
} from "lucide-react";
import { Project } from "@/types/project";
import { formatDistanceToNow } from "date-fns";

interface CreatorProfileProps {
  creator: Project['creator'];
  projectsCount?: number;
  totalFundsRaised?: number;
  joinedDate?: Date;
  bio?: string;
  socialLinks?: {
    website?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export const CreatorProfile = ({ 
  creator, 
  projectsCount = 5,
  totalFundsRaised = 125000,
  joinedDate = new Date('2020-01-15'),
  bio = "Passionate about creating positive change in communities through innovative projects and meaningful collaborations.",
  socialLinks = {}
}: CreatorProfileProps) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleMessage = () => {
    // TODO: Implement messaging functionality
    console.log('Open message dialog');
  };

  return (
    <Card className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Project Creator</h3>
        {creator.verificationStatus === 'verified' && (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        )}
      </div>

      {/* Creator Info */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={creator.avatar} alt={creator.displayName} />
            <AvatarFallback className="text-lg">
              {creator.displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-foreground text-lg">
                {creator.displayName}
              </h4>
              {creator.verificationStatus === 'verified' && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
            
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-foreground">
                {creator.rating.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                (142 reviews)
              </span>
            </div>

            {creator.location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                <MapPin className="w-3 h-3" />
                <span>{creator.location}</span>
              </div>
            )}

            <p className="text-sm text-muted-foreground leading-relaxed">
              {bio}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleFollow}
            variant={isFollowing ? "outline" : "default"}
            size="sm"
            className="flex-1"
          >
            <Heart className={`w-4 h-4 mr-1 ${isFollowing ? 'fill-current' : ''}`} />
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
          
          <Button
            onClick={handleMessage}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Message
          </Button>
        </div>
      </div>

      <Separator />

      {/* Creator Stats */}
      <div className="space-y-4">
        <h5 className="font-medium text-foreground">Creator Stats</h5>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="font-semibold text-foreground">{projectsCount}</div>
            <div className="text-xs text-muted-foreground">Projects</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="font-semibold text-foreground">
              ${(totalFundsRaised / 1000).toFixed(0)}k
            </div>
            <div className="text-xs text-muted-foreground">Funds Raised</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="font-semibold text-foreground">1,247</div>
            <div className="text-xs text-muted-foreground">Supporters</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="font-semibold text-foreground">98%</div>
            <div className="text-xs text-muted-foreground">Success Rate</div>
          </div>
        </div>
      </div>

      {/* Member Since */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="w-4 h-4" />
        <span>Member since {formatDistanceToNow(joinedDate, { addSuffix: true })}</span>
      </div>

      {/* Social Links */}
      {(socialLinks.website || socialLinks.twitter || socialLinks.linkedin) && (
        <>
          <Separator />
          <div className="space-y-3">
            <h5 className="font-medium text-foreground">Connect</h5>
            <div className="space-y-2">
              {socialLinks.website && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start p-2 h-auto"
                  onClick={() => window.open(socialLinks.website, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span className="text-sm">Website</span>
                </Button>
              )}
              
              {socialLinks.twitter && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start p-2 h-auto"
                  onClick={() => window.open(socialLinks.twitter, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span className="text-sm">Twitter</span>
                </Button>
              )}
              
              {socialLinks.linkedin && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start p-2 h-auto"
                  onClick={() => window.open(socialLinks.linkedin, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span className="text-sm">LinkedIn</span>
                </Button>
              )}
            </div>
          </div>
        </>
      )}

      {/* View Full Profile */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            View Full Profile
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={creator.avatar} alt={creator.displayName} />
                <AvatarFallback>
                  {creator.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {creator.displayName}
              {creator.verificationStatus === 'verified' && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Extended Bio */}
            <div>
              <h4 className="font-medium mb-2">About</h4>
              <p className="text-muted-foreground leading-relaxed">
                {bio} I've been creating impactful projects for over 4 years, focusing on community development, 
                education, and sustainable solutions. My goal is to bring people together and create lasting positive change.
              </p>
            </div>

            {/* Achievements */}
            <div>
              <h4 className="font-medium mb-3">Achievements</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <div>
                    <div className="font-medium text-sm">Top Creator</div>
                    <div className="text-xs text-muted-foreground">2023</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium text-sm">Most Funded</div>
                    <div className="text-xs text-muted-foreground">Community</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Projects */}
            <div>
              <h4 className="font-medium mb-3">Recent Projects</h4>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-12 h-12 bg-muted rounded-lg"></div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Community Garden Project {i}</div>
                      <div className="text-xs text-muted-foreground">Fully funded • 3 months ago</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};