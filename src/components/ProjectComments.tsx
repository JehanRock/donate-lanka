import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Flag, Reply } from "lucide-react";
import { ProjectComment } from "@/types/project";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ProjectCommentsProps {
  comments: ProjectComment[];
  projectId: string;
}

export const ProjectComments = ({ comments, projectId }: ProjectCommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    
    // Simulate comment submission
    setTimeout(() => {
      toast({
        title: "Comment posted!",
        description: "Your comment has been added to the project.",
      });
      setNewComment("");
      setIsSubmitting(false);
    }, 1000);
  };

  const handleReply = async (commentId: string) => {
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    
    // Simulate reply submission
    setTimeout(() => {
      toast({
        title: "Reply posted!",
        description: "Your reply has been added.",
      });
      setReplyText("");
      setReplyTo(null);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleLike = (commentId: string) => {
    // TODO: Implement like functionality
    console.log('Liked comment:', commentId);
  };

  const handleReport = (commentId: string) => {
    // TODO: Implement report functionality
    toast({
      title: "Comment reported",
      description: "Thank you for helping keep our community safe.",
    });
  };

  const topLevelComments = comments.filter(comment => !comment.parentId);
  const getReplies = (parentId: string) => 
    comments.filter(comment => comment.parentId === parentId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-foreground">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Share your thoughts about this project..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmitting}
                  size="sm"
                >
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {topLevelComments.length === 0 ? (
          <div className="text-center py-8">
            <h4 className="text-lg font-medium text-foreground mb-2">
              No comments yet
            </h4>
            <p className="text-muted-foreground">
              Be the first to share your thoughts about this project!
            </p>
          </div>
        ) : (
          topLevelComments.map((comment) => {
            const replies = getReplies(comment.id);
            
            return (
              <Card key={comment.id} className="p-4">
                {/* Main Comment */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.user.avatar} alt={comment.user.displayName} />
                      <AvatarFallback>
                        {comment.user.displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">
                          {comment.user.displayName}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                        </span>
                        {comment.updatedAt && comment.updatedAt > comment.createdAt && (
                          <Badge variant="outline" className="text-xs">
                            Edited
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-foreground leading-relaxed mb-3">
                        {comment.content}
                      </p>
                      
                      {/* Comment Actions */}
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(comment.id)}
                          className="text-muted-foreground hover:text-red-500 h-auto p-1"
                        >
                          <Heart className="w-3 h-3 mr-1" />
                          {comment.likesCount}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                          className="text-muted-foreground hover:text-primary h-auto p-1"
                        >
                          <Reply className="w-3 h-3 mr-1" />
                          Reply
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReport(comment.id)}
                          className="text-muted-foreground hover:text-destructive h-auto p-1"
                        >
                          <Flag className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Reply Form */}
                  {replyTo === comment.id && (
                    <div className="ml-11 pt-3 border-t">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">You</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-3">
                          <Textarea
                            placeholder={`Reply to ${comment.user.displayName}...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="min-h-[60px] resize-none text-sm"
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleReply(comment.id)}
                              disabled={!replyText.trim() || isSubmitting}
                              size="sm"
                              className="text-xs"
                            >
                              {isSubmitting ? "Posting..." : "Reply"}
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => {
                                setReplyTo(null);
                                setReplyText("");
                              }}
                              size="sm"
                              className="text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {replies.length > 0 && (
                    <div className="ml-11 space-y-3 pt-3 border-t">
                      {replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-3">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={reply.user.avatar} alt={reply.user.displayName} />
                            <AvatarFallback className="text-xs">
                              {reply.user.displayName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-foreground text-sm">
                                {reply.user.displayName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(reply.createdAt, { addSuffix: true })}
                              </span>
                            </div>
                            
                            <p className="text-foreground text-sm leading-relaxed mb-2">
                              {reply.content}
                            </p>
                            
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLike(reply.id)}
                                className="text-muted-foreground hover:text-red-500 h-auto p-1 text-xs"
                              >
                                <Heart className="w-3 h-3 mr-1" />
                                {reply.likesCount}
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReport(reply.id)}
                                className="text-muted-foreground hover:text-destructive h-auto p-1 text-xs"
                              >
                                <Flag className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Load More Comments */}
      {comments.length >= 10 && (
        <div className="text-center pt-4">
          <Button variant="outline">
            Load More Comments
          </Button>
        </div>
      )}
    </div>
  );
};