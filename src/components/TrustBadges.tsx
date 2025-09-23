import { Shield, CheckCircle, Award, Building, Users, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { VerificationBadge } from "@/types/project";

interface TrustBadgesProps {
  badges?: VerificationBadge[];
  trustScore?: number;
  className?: string;
  showScore?: boolean;
  compact?: boolean;
}

const badgeIcons = {
  identity_verified: CheckCircle,
  nonprofit_verified: Building,
  government_approved: Shield,
  partner_organization: Users,
  previous_success: Award,
};

const badgeColors = {
  identity_verified: "bg-warning/10 text-warning border-warning/30",
  nonprofit_verified: "bg-primary/10 text-primary border-primary/30",
  government_approved: "bg-secondary/10 text-secondary border-secondary/30",
  partner_organization: "bg-orange-100 text-orange-700 border-orange-200",
  previous_success: "bg-warning/10 text-warning border-warning/30",
};

export const TrustBadges = ({ 
  badges = [], 
  trustScore, 
  className, 
  showScore = true,
  compact = false
}: TrustBadgesProps) => {
  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 75) return "text-warning";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getTrustScoreBg = (score: number) => {
    if (score >= 90) return "bg-success/10 border-success/30";
    if (score >= 75) return "bg-warning/10 border-warning/30";
    if (score >= 60) return "bg-warning/10 border-warning/30";
    return "bg-destructive/10 border-destructive/30";
  };

  return (
    <TooltipProvider>
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        {/* Trust Score */}
        {showScore && trustScore && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(
                "flex items-center gap-1 rounded-full border font-medium",
                compact ? "px-2 py-0.5 text-xs" : "px-3 py-1.5 text-sm",
                getTrustScoreBg(trustScore)
              )}>
                <Lock className={compact ? "w-2.5 h-2.5" : "w-3.5 h-3.5"} />
                <span className={getTrustScoreColor(trustScore)}>
                  {compact ? `${trustScore}%` : `Trust Score: ${trustScore}%`}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <p className="font-medium">Trust Score: {trustScore}%</p>
                <p className="text-muted-foreground mt-1">
                  Based on verification status, project history, 
                  transparency, and community feedback
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Verification Badges */}
        {badges.map((badge) => {
          const Icon = badgeIcons[badge.type] || CheckCircle;
          const colorClass = badgeColors[badge.type] || badgeColors.identity_verified;

          return (
            <Tooltip key={badge.id}>
              <TooltipTrigger asChild>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "flex items-center gap-1 border font-medium",
                    compact ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
                    colorClass
                  )}
                >
                  <Icon className={compact ? "w-2.5 h-2.5" : "w-3 h-3"} />
                  <span>{compact ? badge.name.split(' ')[0] : badge.name}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm max-w-xs">
                  <p className="font-medium">{badge.name}</p>
                  <p className="text-muted-foreground mt-1">{badge.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Verified by {badge.verifiedBy} on{" "}
                    {badge.verifiedAt.toLocaleDateString()}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};