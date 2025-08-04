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
}

const badgeIcons = {
  identity_verified: CheckCircle,
  nonprofit_verified: Building,
  government_approved: Shield,
  partner_organization: Users,
  previous_success: Award,
};

const badgeColors = {
  identity_verified: "bg-green-100 text-green-700 border-green-200",
  nonprofit_verified: "bg-blue-100 text-blue-700 border-blue-200",
  government_approved: "bg-purple-100 text-purple-700 border-purple-200",
  partner_organization: "bg-orange-100 text-orange-700 border-orange-200",
  previous_success: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

export const TrustBadges = ({ 
  badges = [], 
  trustScore, 
  className, 
  showScore = true 
}: TrustBadgesProps) => {
  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getTrustScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-50 border-green-200";
    if (score >= 75) return "bg-blue-50 border-blue-200";
    if (score >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <TooltipProvider>
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        {/* Trust Score */}
        {showScore && trustScore && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium",
                getTrustScoreBg(trustScore)
              )}>
                <Lock className="w-3.5 h-3.5" />
                <span className={getTrustScoreColor(trustScore)}>
                  Trust Score: {trustScore}%
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
                    "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border",
                    colorClass
                  )}
                >
                  <Icon className="w-3 h-3" />
                  <span>{badge.name}</span>
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