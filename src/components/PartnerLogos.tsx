import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Building, Globe, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PartnerOrganization } from "@/types/project";

interface PartnerLogosProps {
  partners: PartnerOrganization[];
  className?: string;
  showDetails?: boolean;
}

const partnerTypeIcons = {
  ngo: Building,
  government: Award,
  corporate: Building,
  international: Globe,
  academic: Building,
};

const partnerTypeColors = {
  ngo: "bg-green-100 text-green-700 border-green-200",
  government: "bg-blue-100 text-blue-700 border-blue-200",
  corporate: "bg-purple-100 text-purple-700 border-purple-200",
  international: "bg-orange-100 text-orange-700 border-orange-200",
  academic: "bg-indigo-100 text-indigo-700 border-indigo-200",
};

export const PartnerLogos = ({ 
  partners, 
  className, 
  showDetails = true 
}: PartnerLogosProps) => {
  if (!partners || partners.length === 0) return null;

  const verifiedPartners = partners.filter(p => p.verificationStatus === 'verified');

  if (verifiedPartners.length === 0) return null;

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5" />
          Trusted Partners
        </CardTitle>
        <CardDescription>
          This project is supported by verified organizations and institutions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showDetails ? (
          <div className="space-y-4">
            {verifiedPartners.map((partner) => {
              const Icon = partnerTypeIcons[partner.type];
              const colorClass = partnerTypeColors[partner.type];

              return (
                <div 
                  key={partner.id} 
                  className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  {/* Partner Logo */}
                  <div className="flex-shrink-0">
                    {partner.logoUrl ? (
                      <img 
                        src={partner.logoUrl} 
                        alt={`${partner.name} logo`}
                        className="w-12 h-12 object-contain rounded-lg border border-border"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Partner Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {partner.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {partner.partnership.role}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", colorClass)}
                        >
                          {partner.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {partner.website && (
                          <a 
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mt-2">
                      {partner.partnership.description}
                    </p>

                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span>
                        Partnership since {partner.partnership.startDate.getFullYear()}
                      </span>
                      <span>•</span>
                      <span>Contribution: {partner.partnership.contribution}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Compact logo grid
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {verifiedPartners.map((partner) => (
              <div 
                key={partner.id}
                className="flex items-center justify-center p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                title={partner.name}
              >
                {partner.logoUrl ? (
                  <img 
                    src={partner.logoUrl} 
                    alt={`${partner.name} logo`}
                    className="max-w-full max-h-8 object-contain"
                  />
                ) : (
                  <div className="text-xs text-center text-muted-foreground">
                    {partner.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            All partnerships are verified and regularly audited for transparency
          </p>
        </div>
      </CardContent>
    </Card>
  );
};