import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Calendar, 
  Target, 
  Clock, 
  Users, 
  Star,
  Eye,
  Share2,
  Heart,
  Edit,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { CampaignData } from "./CampaignCreationWizard";

interface CampaignPreviewProps {
  data: CampaignData;
  onEditCampaign?: () => void;
  onFullPreview?: () => void;
}

export const CampaignPreview = ({ data, onEditCampaign, onFullPreview }: CampaignPreviewProps) => {
  const getCurrency = () => {
    const currencies: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      CAD: 'C$',
      AUD: 'A$'
    };
    return currencies[data.currency] || '$';
  };

  const getDaysRemaining = () => {
    if (data.endDate) {
      return Math.max(0, differenceInDays(data.endDate, new Date()));
    }
    return 0;
  };

  const getReadiness = () => {
    const checks = [
      { label: 'Title', completed: !!data.title },
      { label: 'Description', completed: !!data.description && data.description.length >= 100 },
      { label: 'Category', completed: !!data.category },
      { label: 'Funding Goal', completed: data.fundingGoal > 0 },
      { label: 'End Date', completed: !!data.endDate },
      { label: 'Cover Image', completed: !!data.coverImage },
      { label: 'Location', completed: !!(data.location.country && data.location.city) }
    ];

    const completed = checks.filter(check => check.completed).length;
    const total = checks.length;
    const percentage = (completed / total) * 100;

    return { checks, completed, total, percentage };
  };

  const readiness = getReadiness();

  return (
    <div className="space-y-6">
      {/* Readiness Check */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Campaign Readiness</h3>
          <Badge variant={readiness.percentage === 100 ? "default" : "secondary"}>
            {readiness.completed}/{readiness.total} Complete
          </Badge>
        </div>
        
        <Progress value={readiness.percentage} className="h-2 mb-4" />
        
        <div className="grid grid-cols-2 gap-2">
          {readiness.checks.map((check, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              {check.completed ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-orange-500" />
              )}
              <span className={check.completed ? 'text-foreground' : 'text-muted-foreground'}>
                {check.label}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Campaign Preview */}
      <Card className="overflow-hidden">
        <div className="p-0">
          {/* Cover Image */}
          {data.coverImage ? (
            <div className="aspect-video bg-muted">
              <img 
                src={typeof data.coverImage === 'string' ? data.coverImage : URL.createObjectURL(data.coverImage)}
                alt="Campaign cover"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video bg-muted flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Eye className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Cover image preview</p>
              </div>
            </div>
          )}

          <div className="p-6">
            {/* Header */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {data.category && (
                      <Badge variant="secondary" className="capitalize">
                        {data.category.replace('_', ' ')}
                      </Badge>
                    )}
                  </div>
                  
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {data.title || 'Your Campaign Title'}
                  </h1>
                  
                  <p className="text-muted-foreground">
                    {data.tagline || 'Your campaign tagline will appear here'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Location and Date */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {(data.location.city || data.location.country) && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {[data.location.city, data.location.state, data.location.country]
                        .filter(Boolean)
                        .join(', ')
                      }
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Started {format(new Date(), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Funding Section */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Main Content */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">About This Project</h3>
                  {data.description ? (
                    <div 
                      className="prose prose-sm max-w-none text-foreground"
                      dangerouslySetInnerHTML={{ __html: data.description }}
                    />
                  ) : (
                    <p className="text-muted-foreground italic">
                      Your project description will appear here. Use the rich text editor to create compelling content that tells your story.
                    </p>
                  )}
                </div>

                {/* Video */}
                {data.videoUrl && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Project Video</h3>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center mx-auto mb-2">
                          <Eye className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">Video Player</p>
                        <p className="text-xs text-muted-foreground">{data.videoUrl}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Images */}
                {data.additionalImages.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Project Gallery</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {data.additionalImages.slice(0, 4).map((image, index) => (
                        <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                          <img 
                            src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Funding Sidebar */}
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-foreground">
                        {getCurrency()}{(0).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        raised of {getCurrency()}{data.fundingGoal?.toLocaleString() || 0} goal
                      </div>
                    </div>

                    <Progress value={0} className="h-3" />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-semibold text-foreground">0</div>
                        <div className="text-muted-foreground">supporters</div>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {getDaysRemaining()}
                        </div>
                        <div className="text-muted-foreground">days to go</div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <Button className="w-full" size="lg">
                        Back This Project
                      </Button>
                      
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                          {data.fundingType === 'all_or_nothing' 
                            ? 'All-or-nothing funding' 
                            : 'Flexible funding'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Creator */}
                <Card className="p-4">
                  <h3 className="font-semibold text-foreground mb-3">Creator</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">Your Name</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="w-3 h-3 fill-current text-yellow-400" />
                        <span>New Creator</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Rewards */}
                {data.rewards.length > 0 && (
                  <Card className="p-4">
                    <h3 className="font-semibold text-foreground mb-3">Rewards</h3>
                    <div className="space-y-3">
                      {data.rewards.slice(0, 3).map((reward, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-sm">{reward.title}</div>
                            <Badge variant="outline">
                              {getCurrency()}{reward.amount}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {reward.description}
                          </p>
                          {reward.estimatedDelivery && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Est. delivery: {format(reward.estimatedDelivery, 'MMM yyyy')}
                            </p>
                          )}
                        </div>
                      ))}
                      {data.rewards.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center">
                          +{data.rewards.length - 3} more rewards
                        </p>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Final Check */}
      <Card className="p-4 bg-muted/50">
        <h3 className="text-sm font-medium mb-2">Ready to Launch?</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Review your campaign one final time. Once submitted, your campaign will be reviewed by our team before going live.
        </p>
        
        {readiness.percentage < 100 && (
          <div className="flex items-center gap-2 text-sm text-orange-600 mb-3">
            <AlertCircle className="w-4 h-4" />
            <span>Complete all required fields before submitting</span>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEditCampaign}>
            <Edit className="w-4 h-4 mr-1" />
            Edit Campaign
          </Button>
          <Button variant="outline" size="sm" onClick={onFullPreview}>
            <Eye className="w-4 h-4 mr-1" />
            Full Preview
          </Button>
        </div>
      </Card>
    </div>
  );
};