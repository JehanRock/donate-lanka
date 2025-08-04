import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageCircle, Calendar, Eye } from "lucide-react";
import { ProjectUpdate } from "@/types/project";
import { formatDistanceToNow } from "date-fns";

interface ProjectUpdatesProps {
  updates: ProjectUpdate[];
  creatorName: string;
  creatorAvatar?: string;
}

export const ProjectUpdates = ({ updates, creatorName, creatorAvatar }: ProjectUpdatesProps) => {
  const [expandedUpdate, setExpandedUpdate] = useState<string | null>(null);

  const toggleExpanded = (updateId: string) => {
    setExpandedUpdate(expandedUpdate === updateId ? null : updateId);
  };

  const handleLike = (updateId: string) => {
    // TODO: Implement like functionality
    console.log('Liked update:', updateId);
  };

  const handleComment = (updateId: string) => {
    // TODO: Implement comment functionality
    console.log('Comment on update:', updateId);
  };

  if (!updates || updates.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold text-foreground mb-2">No Updates Yet</h3>
        <p className="text-muted-foreground">
          The project creator hasn't posted any updates yet. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-foreground">
          Project Updates ({updates.length})
        </h3>
        <Badge variant="outline" className="text-xs">
          Latest Activity
        </Badge>
      </div>

      <div className="space-y-6">
        {updates.map((update) => (
          <Card key={update.id} className="p-6">
            {/* Update Header */}
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={creatorAvatar} alt={creatorName} />
                <AvatarFallback>
                  {creatorName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground text-lg">
                    {update.title}
                  </h4>
                  {!update.isPublic && (
                    <Badge variant="secondary" className="text-xs">
                      Supporters Only
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="font-medium">{creatorName}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDistanceToNow(update.publishedAt, { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Update Content */}
            <div className="space-y-4">
              <div className="prose max-w-none">
                <p className="text-foreground leading-relaxed">
                  {expandedUpdate === update.id 
                    ? update.content 
                    : update.content.length > 300 
                      ? `${update.content.substring(0, 300)}...`
                      : update.content
                  }
                </p>
                
                {update.content.length > 300 && (
                  <Button
                    variant="link"
                    onClick={() => toggleExpanded(update.id)}
                    className="p-0 h-auto text-primary"
                  >
                    {expandedUpdate === update.id ? 'Show less' : 'Read more'}
                  </Button>
                )}
              </div>

              {/* Update Images */}
              {update.images && update.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {update.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="aspect-video rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`Update image ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                  {update.images.length > 4 && (
                    <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">
                        +{update.images.length - 4} more
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Separator className="my-4" />

            {/* Update Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(update.id)}
                  className="text-muted-foreground hover:text-red-500"
                >
                  <Heart className="w-4 h-4 mr-1" />
                  {update.likesCount}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleComment(update.id)}
                  className="text-muted-foreground hover:text-primary"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {update.commentsCount}
                </Button>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="w-3 h-3" />
                <span>Public update</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More Updates */}
      {updates.length >= 5 && (
        <div className="text-center pt-4">
          <Button variant="outline">
            Load More Updates
          </Button>
        </div>
      )}
    </div>
  );
};