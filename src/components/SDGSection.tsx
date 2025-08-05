import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Target, Users, Lightbulb } from "lucide-react";
import { sdgData, SDG } from "@/types/sdg";
import { cn } from "@/lib/utils";

export const SDGSection = () => {
  const [selectedSDG, setSelectedSDG] = useState<SDG | null>(null);

  const handleSDGClick = (sdg: SDG) => {
    setSelectedSDG(sdg);
  };

  const handleBrowseProjects = () => {
    // Navigate to projects page with SDG filter
    window.location.href = "/projects";
  };

  const handleLearnMore = () => {
    window.open("https://sdgs.un.org/goals", "_blank");
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Mission: Advancing Sri Lanka Through the UN Sustainable Development Goals
          </h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            At FundLanka, every project and donation directly supports Sri Lanka's progress toward the 
            United Nations' 17 Sustainable Development Goals (SDGs). From eradicating poverty to protecting 
            our environment, your generosity fuels real, measurable change across all 25 districts.
          </p>
          <p className="text-lg text-muted-foreground mt-2 font-medium">
            Discover how your support helps build a brighter, more sustainable future for all Sri Lankans.
          </p>
        </div>

        {/* SDG Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {sdgData.map((sdg) => (
            <Card 
              key={sdg.id}
              className={cn(
                "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg",
                "border-2 hover:border-primary/50 group"
              )}
              onClick={() => handleSDGClick(sdg)}
            >
              <CardContent className="p-6 text-center">
                {/* Official UN SDG Icon */}
                <div className="w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <img 
                    src={sdg.iconPath}
                    alt={`SDG ${sdg.id}: ${sdg.title}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Title */}
                <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base group-hover:text-primary transition-colors">
                  {sdg.title}
                </h3>
                
                {/* Project Count Badge */}
                <Badge variant="secondary" className="mb-3">
                  {sdg.projectCount} Projects
                </Badge>
                
                {/* Sri Lankan Context */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {sdg.sriLankanContext}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Ready to make a difference?</h3>
            <p className="text-muted-foreground">
              Explore projects by SDG, or start your own campaign to help Sri Lanka achieve the 2030 Agenda!
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleBrowseProjects}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Target className="mr-2 h-5 w-5" />
              Browse Projects by SDG
            </Button>
            <Button 
              onClick={handleLearnMore}
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Learn More About the SDGs
            </Button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            FundLanka is committed to transparency and impact. Track our progress toward the SDGs in our{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto text-sm text-primary underline"
              onClick={() => window.location.href = "/impact"}
            >
              Annual Impact Report
            </Button>
          </p>
        </div>
      </div>

      {/* SDG Detail Modal */}
      <Dialog open={!!selectedSDG} onOpenChange={() => setSelectedSDG(null)}>
        <DialogContent className="max-w-2xl">
          {selectedSDG && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shadow-md">
                    <img 
                      src={selectedSDG.iconPath}
                      alt={`SDG ${selectedSDG.id}: ${selectedSDG.title}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selectedSDG.title}</DialogTitle>
                    <Badge variant="secondary" className="mt-1">
                      {selectedSDG.projectCount} Active Projects
                    </Badge>
                  </div>
                </div>
                <DialogDescription className="text-base leading-relaxed">
                  {selectedSDG.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center">
                    <Users className="mr-2 h-5 w-5 text-primary" />
                    Impact in Sri Lanka
                  </h4>
                  <p className="text-muted-foreground">
                    {selectedSDG.sriLankanContext}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={handleBrowseProjects}
                    className="flex-1"
                  >
                    <Target className="mr-2 h-4 w-4" />
                    View Related Projects
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open(`https://sdgs.un.org/goals/goal${selectedSDG.id}`, "_blank")}
                  >
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Learn More
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};