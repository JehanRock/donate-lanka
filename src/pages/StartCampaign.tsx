import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';

const campaignStartSchema = z.object({
  country: z.string().min(1, 'Please select your country'),
  zipCode: z.string().min(1, 'Please enter your zip code'),
  category: z.string().min(1, 'Please select a fundraising category'),
});

type CampaignStartData = z.infer<typeof campaignStartSchema>;

const categories = [
  'Animals', 'Business', 'Community', 'Creative', 'Education',
  'Emergencies', 'Environment', 'Events', 'Faith', 'Family',
  'Funeral & Memorial', 'Medical', 'Monthly Bills', 'Newlyweds',
  'Other', 'Sports', 'Travel', 'Ukraine Relief', 'Volunteer', 'Wishes'
];

const StartCampaign = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<CampaignStartData>({
    resolver: zodResolver(campaignStartSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: CampaignStartData) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    // Store the initial data and navigate to full campaign creation
    localStorage.setItem('campaign_start_data', JSON.stringify(data));
    navigate('/create');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setValue('category', category, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header spacing */}
      <div className="pt-24"></div>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-left space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Let's begin your fundraising journey
            </h1>
            <p className="text-xl text-muted-foreground">
              We're here to guide you every step of the way.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
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
                  <Select onValueChange={(value) => setValue('country', value, { shouldValidate: true })}>
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
                  {errors.country && (
                    <p className="text-sm text-destructive">{errors.country.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip code</Label>
                  <Input
                    id="zipCode"
                    placeholder="Zip code"
                    className="h-12"
                    {...register('zipCode')}
                  />
                  {errors.zipCode && (
                    <p className="text-sm text-destructive">{errors.zipCode.message}</p>
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
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            {/* Continue Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                className="px-12 py-3 text-lg rounded-full bg-success hover:bg-success/90 text-white"
                disabled={!isValid}
              >
                Continue
              </Button>
            </div>
          </form>
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