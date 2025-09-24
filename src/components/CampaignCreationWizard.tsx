import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Circle, 
  ArrowLeft, 
  ArrowRight,
  Save,
  Eye,
  Send
} from "lucide-react";
import { CampaignBasicsForm } from "./CampaignBasicsForm";
import { CampaignStoryForm } from "./CampaignStoryForm";
import { CampaignFundingForm } from "./CampaignFundingForm";
import { CampaignMediaForm } from "./CampaignMediaForm";
import { CampaignPreview } from "./CampaignPreview";
import { useToast } from "@/hooks/use-toast";

export interface CampaignData {
  // Basics
  title: string;
  tagline: string;
  category: string;
  sdgAlignments: number[]; // Array of SDG IDs (1-17)
  location: {
    country: string;
    city: string;
    state?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
  };
  
  // Story
  description: string;
  videoUrl?: string;
  
  // Funding
  fundingGoal: number;
  currency: string;
  fundingType: 'all_or_nothing' | 'keep_what_you_raise';
  endDate: Date;
  minimumDonation: number;
  
  // Media
  coverImage?: File | string;
  additionalImages: (File | string)[];
  
  // Rewards (optional)
  rewards: Array<{
    title: string;
    description: string;
    amount: number;
    estimatedDelivery?: Date;
    quantity?: number;
  }>;
}

const STEPS = [
  {
    id: 'basics',
    title: 'Campaign Basics',
    description: 'Tell us about your project'
  },
  {
    id: 'story',
    title: 'Project Story',
    description: 'Share your story and vision'
  },
  {
    id: 'funding',
    title: 'Funding & Timeline',
    description: 'Set your goals and timeline'
  },
  {
    id: 'media',
    title: 'Images & Media',
    description: 'Upload photos and videos'
  },
  {
    id: 'preview',
    title: 'Review & Submit',
    description: 'Preview and launch your campaign'
  }
];

export const CampaignCreationWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    title: '',
    tagline: '',
    category: '',
    sdgAlignments: [],
    location: { country: '', city: '' },
    description: '',
    fundingGoal: 0,
    currency: 'USD',
    fundingType: 'all_or_nothing',
    endDate: new Date(),
    minimumDonation: 1,
    additionalImages: [],
    rewards: []
  });
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const currentStepData = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const updateCampaignData = (updates: Partial<CampaignData>) => {
    setCampaignData(prev => ({ ...prev, ...updates }));
  };

  const markStepComplete = (stepIndex: number) => {
    setCompletedSteps(prev => new Set([...prev, stepIndex]));
  };

  const isStepValid = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Basics
        return !!(campaignData.title && campaignData.tagline && campaignData.category);
      case 1: // Story
        return !!(campaignData.description && campaignData.description.length >= 100);
      case 2: // Funding
        return !!(campaignData.fundingGoal > 0 && campaignData.endDate);
      case 3: // Media
        return !!(campaignData.coverImage);
      case 4: // Preview
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepValid(currentStep)) {
      markStepComplete(currentStep);
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    } else {
      toast({
        title: "Please complete all required fields",
        description: "Fill in all required information before proceeding.",
        variant: "destructive"
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Draft saved!",
        description: "Your campaign has been saved as a draft.",
      });
    }, 1000);
  };

  const handleSubmit = async () => {
    if (!isStepValid(4)) return;
    
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Campaign submitted!",
        description: "Your campaign has been submitted for review.",
      });
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <CampaignBasicsForm
            data={campaignData}
            onUpdate={updateCampaignData}
          />
        );
      case 1:
        return (
          <CampaignStoryForm
            data={campaignData}
            onUpdate={updateCampaignData}
          />
        );
      case 2:
        return (
          <CampaignFundingForm
            data={campaignData}
            onUpdate={updateCampaignData}
          />
        );
      case 3:
        return (
          <CampaignMediaForm
            data={campaignData}
            onUpdate={updateCampaignData}
          />
        );
      case 4:
        return (
          <CampaignPreview
            data={campaignData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create Your Campaign
          </h1>
          <p className="text-muted-foreground">
            Follow these steps to create and launch your crowdfunding campaign
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-foreground">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const isCompleted = completedSteps.has(index);
              const isCurrent = index === currentStep;
              const isAccessible = index <= currentStep || completedSteps.has(index);

              return (
                <div
                  key={step.id}
                  className={`flex items-center ${index < STEPS.length - 1 ? 'flex-1' : ''}`}
                >
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => isAccessible && setCurrentStep(index)}
                      disabled={!isAccessible}
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                        isCompleted
                          ? 'bg-primary border-primary text-primary-foreground'
                          : isCurrent
                          ? 'border-primary text-primary'
                          : isAccessible
                          ? 'border-muted-foreground text-muted-foreground hover:border-primary hover:text-primary'
                          : 'border-muted text-muted cursor-not-allowed'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <div className="mt-2 text-center">
                      <div className={`text-xs font-medium ${
                        isCurrent ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                  
                  {index < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      completedSteps.has(index) ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {currentStepData.title}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {currentStepData.description}
                  </p>
                </div>
                {currentStep < 4 && (
                  <Badge variant={isStepValid(currentStep) ? "default" : "secondary"}>
                    {isStepValid(currentStep) ? "Complete" : "Incomplete"}
                  </Badge>
                )}
              </div>
            </div>

            {renderStepContent()}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            {currentStep < STEPS.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid(currentStep) || isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Campaign
                  </>
                )}
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            onClick={handleSaveDraft}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};