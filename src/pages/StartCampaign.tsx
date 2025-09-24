import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, User, Users, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';

const step1Schema = z.object({
  country: z.string().min(1, 'Please select your country'),
  zipCode: z.string().min(1, 'Please enter your zip code'),
  category: z.string().min(1, 'Please select a fundraising category'),
});

const step2Schema = z.object({
  beneficiary: z.enum(['yourself', 'someone-else', 'charity'], {
    required_error: 'Please select who you are fundraising for',
  }),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

const categories = [
  'Animals', 'Business', 'Community', 'Creative', 'Education',
  'Emergencies', 'Environment', 'Events', 'Faith', 'Family',
  'Funeral & Memorial', 'Medical', 'Monthly Bills', 'Newlyweds',
  'Other', 'Sports', 'Travel', 'Ukraine Relief', 'Volunteer', 'Wishes'
];

const StartCampaign = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: 'onChange',
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    mode: 'onChange',
  });

  const onStep1Submit = (data: Step1Data) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const onStep2Submit = (data: Step2Data) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    // Combine all data and navigate to full campaign creation
    const fullData = { ...step1Data, ...data };
    localStorage.setItem('campaign_start_data', JSON.stringify(fullData));
    navigate('/create');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    step1Form.setValue('category', category, { shouldValidate: true });
  };

  const handleBeneficiarySelect = (beneficiary: string) => {
    setSelectedBeneficiary(beneficiary);
    step2Form.setValue('beneficiary', beneficiary as any, { shouldValidate: true });
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-12">
      {/* Location Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Where are you located?
          </h2>
          <p className="text-muted-foreground">
            We use your location to determine your currency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select onValueChange={(value) => step1Form.setValue('country', value, { shouldValidate: true })}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="United States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
                <SelectItem value="AU">Australia</SelectItem>
                <SelectItem value="LK">Sri Lanka</SelectItem>
                <SelectItem value="IN">India</SelectItem>
                <SelectItem value="DE">Germany</SelectItem>
                <SelectItem value="FR">France</SelectItem>
              </SelectContent>
            </Select>
            {step1Form.formState.errors.country && (
              <p className="text-sm text-destructive">{step1Form.formState.errors.country.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">Zip code</Label>
            <Input
              id="zipCode"
              placeholder="Zip code"
              className="h-12"
              {...step1Form.register('zipCode')}
            />
            {step1Form.formState.errors.zipCode && (
              <p className="text-sm text-destructive">{step1Form.formState.errors.zipCode.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Category Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">
          What best describes why you're fundraising?
        </h2>

        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategorySelect(category)}
              className={`px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        {step1Form.formState.errors.category && (
          <p className="text-sm text-destructive">{step1Form.formState.errors.category.message}</p>
        )}
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          className="px-12 py-3 text-lg rounded-full bg-success hover:bg-success/90 text-white"
          disabled={!step1Form.formState.isValid}
        >
          Continue
        </Button>
      </div>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-12">
      {/* Beneficiary Selection */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">
          Who are you fundraising for?
        </h2>

        <div className="space-y-4">
          {/* Yourself Option */}
          <button
            type="button"
            onClick={() => handleBeneficiarySelect('yourself')}
            className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between ${
              selectedBeneficiary === 'yourself'
                ? 'border-primary bg-primary/5'
                : 'border-input hover:border-accent hover:bg-accent/5'
            }`}
          >
            <div>
              <h3 className="text-lg font-semibold text-foreground">Yourself</h3>
              <p className="text-muted-foreground">
                Funds are delivered to your bank account for your own use
              </p>
            </div>
            <div className="flex-shrink-0 ml-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
            </div>
          </button>

          {/* Someone Else Option */}
          <button
            type="button"
            onClick={() => handleBeneficiarySelect('someone-else')}
            className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between ${
              selectedBeneficiary === 'someone-else'
                ? 'border-primary bg-primary/5'
                : 'border-input hover:border-accent hover:bg-accent/5'
            }`}
          >
            <div>
              <h3 className="text-lg font-semibold text-foreground">Someone else</h3>
              <p className="text-muted-foreground">
                You'll invite a beneficiary to receive funds or distribute them yourself
              </p>
            </div>
            <div className="flex-shrink-0 ml-4">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-secondary" />
              </div>
            </div>
          </button>

          {/* Charity Option */}
          <button
            type="button"
            onClick={() => handleBeneficiarySelect('charity')}
            className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between ${
              selectedBeneficiary === 'charity'
                ? 'border-primary bg-primary/5'
                : 'border-input hover:border-accent hover:bg-accent/5'
            }`}
          >
            <div>
              <h3 className="text-lg font-semibold text-foreground">Charity</h3>
              <p className="text-muted-foreground">
                Funds are delivered to your chosen nonprofit for you
              </p>
            </div>
            <div className="flex-shrink-0 ml-4">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                <Heart className="w-8 h-8 text-success" />
              </div>
            </div>
          </button>
        </div>

        {step2Form.formState.errors.beneficiary && (
          <p className="text-sm text-destructive">{step2Form.formState.errors.beneficiary.message}</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={goBack}
          className="px-8 py-3 text-lg rounded-full"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        
        <Button
          type="submit"
          size="lg"
          className="px-12 py-3 text-lg rounded-full bg-success hover:bg-success/90 text-white"
          disabled={!step2Form.formState.isValid}
        >
          Continue
        </Button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header spacing */}
      <div className="pt-24"></div>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-12">
          {/* Step Indicator */}
          <div className="text-left">
            <p className="text-sm text-muted-foreground mb-6">
              {currentStep} of 4
            </p>
          </div>

          {/* Header */}
          <div className="text-left space-y-4">
            {currentStep === 1 ? (
              <>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Let's begin your fundraising journey
                </h1>
                <p className="text-xl text-muted-foreground">
                  We're here to guide you every step of the way.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Tell us a bit more about your fundraiser
                </h1>
                <p className="text-xl text-muted-foreground">
                  This information helps us get to know you and your fundraising needs.
                </p>
              </>
            )}
          </div>

          {/* Dynamic Content */}
          <div className="transition-all duration-500 ease-in-out">
            {currentStep === 1 ? renderStep1() : renderStep2()}
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultView="signup"
      />

      {/* Footer Branding */}
      <footer className="bg-secondary py-6 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="DonateLanka Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-secondary-foreground">DonateLanka</span>
            </div>
            <div className="text-sm text-muted-foreground">
              curated by DonateLanka
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StartCampaign;