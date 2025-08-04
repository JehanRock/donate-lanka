import { Shield, Lock, CreditCard, Globe, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SecurityBadgesProps {
  className?: string;
  showSSL?: boolean;
  showPaymentSecurity?: boolean;
  showDataProtection?: boolean;
  size?: "sm" | "default" | "lg";
}

export const SecurityBadges = ({ 
  className,
  showSSL = true,
  showPaymentSecurity = true,
  showDataProtection = true,
  size = "default"
}: SecurityBadgesProps) => {
  const badgeSize = {
    sm: "px-2 py-1 text-xs",
    default: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const iconSize = {
    sm: "w-3 h-3",
    default: "w-4 h-4",
    lg: "w-5 h-5"
  };

  return (
    <TooltipProvider>
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        {/* SSL Certificate */}
        {showSSL && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className={cn(
                  "flex items-center gap-1.5 bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
                  badgeSize[size]
                )}
              >
                <Lock className={iconSize[size]} />
                <span>SSL Secured</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm max-w-xs">
                <p className="font-medium">256-bit SSL Encryption</p>
                <p className="text-muted-foreground mt-1">
                  Your personal and payment information is encrypted and secure
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Payment Security */}
        {showPaymentSecurity && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className={cn(
                  "flex items-center gap-1.5 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
                  badgeSize[size]
                )}
              >
                <CreditCard className={iconSize[size]} />
                <span>PCI Compliant</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm max-w-xs">
                <p className="font-medium">PCI DSS Certified</p>
                <p className="text-muted-foreground mt-1">
                  Payment processing meets the highest security standards
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <img src="/placeholder.svg" alt="Visa" className="h-4" />
                  <img src="/placeholder.svg" alt="Mastercard" className="h-4" />
                  <img src="/placeholder.svg" alt="PayPal" className="h-4" />
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Data Protection */}
        {showDataProtection && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className={cn(
                  "flex items-center gap-1.5 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
                  badgeSize[size]
                )}
              >
                <Shield className={iconSize[size]} />
                <span>Privacy Protected</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm max-w-xs">
                <p className="font-medium">GDPR Compliant</p>
                <p className="text-muted-foreground mt-1">
                  Your data is protected according to international privacy laws
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Verified Platform */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="outline" 
              className={cn(
                "flex items-center gap-1.5 bg-primary-50 text-primary border-primary/20 hover:bg-primary-100",
                badgeSize[size]
              )}
            >
              <CheckCircle className={iconSize[size]} />
              <span>Verified Platform</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm max-w-xs">
              <p className="font-medium">Trusted Crowdfunding Platform</p>
              <p className="text-muted-foreground mt-1">
                Licensed and regulated by Sri Lankan financial authorities
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};