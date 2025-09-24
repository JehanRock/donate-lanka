import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ChevronLeft, User, Users, Heart, Eye, EyeOff, Check, X, Phone, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import MapLocationPicker from '@/components/MapLocationPicker';

const step1Schema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().min(1, 'Please select your location on the map'),
  category: z.string().min(1, 'Please select a fundraising category'),
});

const step2Schema = z.object({
  beneficiary: z.enum(['yourself', 'someone-else', 'charity'], {
    required_error: 'Please select who you are fundraising for',
  }),
});

const step3Schema = z.object({
  firstName: z.string().trim().min(2, 'First name must be at least 2 characters').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().trim().min(2, 'Last name must be at least 2 characters').max(50, 'Last name must be less than 50 characters'),
  username: z.string().trim().min(3, 'Username must be at least 3 characters').max(30, 'Username must be less than 30 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().trim().email('Please enter a valid email address').max(255, 'Email must be less than 255 characters'),
  confirmEmail: z.string().trim().email('Please enter a valid email address'),
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least 1 lowercase letter')
    .regex(/\d/, 'Password must contain at least 1 number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least 1 symbol'),
}).refine((data) => data.email === data.confirmEmail, {
  message: "Email addresses don't match",
  path: ["confirmEmail"],
});

const step4Schema = z.object({
  countryCode: z.string().min(1, 'Please select a country code'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  verificationMethod: z.enum(['sms', 'voice'], {
    required_error: 'Please select a verification method',
  }),
});

const step5Schema = z.object({
  otpCode: z.string().min(6, 'Please enter the 6-digit code'),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;
type Step4Data = z.infer<typeof step4Schema>;
type Step5Data = z.infer<typeof step5Schema>;

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
  const [selectedVerificationMethod, setSelectedVerificationMethod] = useState<string>('sms');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('US');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null);
  const [step3Data, setStep3Data] = useState<Step3Data | null>(null);
  const [step4Data, setStep4Data] = useState<Step4Data | null>(null);
  const { isAuthenticated, signup } = useAuth();
  const navigate = useNavigate();

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: 'onChange',
    defaultValues: {
      latitude: 7.8731,
      longitude: 80.7718,
      address: '',
      category: ''
    }
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    mode: 'onChange',
  });

  const step3Form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    mode: 'onChange',
  });

  const step4Form = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    mode: 'onChange',
    defaultValues: {
      verificationMethod: 'sms'
    }
  });

  const step5Form = useForm<Step5Data>({
    resolver: zodResolver(step5Schema),
    mode: 'onChange',
  });

  // Auto-skip step 3 if already authenticated
  useEffect(() => {
    if (currentStep === 3 && isAuthenticated) {
      // Skip to phone verification
      setCurrentStep(4);
    }
  }, [currentStep, isAuthenticated]);

  const onStep1Submit = (data: Step1Data) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const onStep2Submit = (data: Step2Data) => {
    setStep2Data(data);
    if (isAuthenticated) {
      // Skip step 3 and go to phone verification
      setCurrentStep(4);
    } else {
      setCurrentStep(3);
    }
  };

  const onStep3Submit = async (data: Step3Data) => {
    try {
      await signup(data.email, data.password, `${data.firstName} ${data.lastName}`, data.username);
      setStep3Data(data);
      setCurrentStep(4);
    } catch (error) {
      // Error is handled by the signup function via toast
      console.error('Signup error:', error);
    }
  };

  const onStep4Submit = (data: Step4Data) => {
    setStep4Data(data);
    setCodeSent(true);
    setCurrentStep(5);
    // In a real app, this would send the verification code
  };

  const onStep5Submit = (data: Step5Data) => {
    // After successful OTP verification, proceed to campaign creation
    const fullData = { ...step1Data, ...step2Data, ...step3Data, ...step4Data, ...data };
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

  const handleVerificationMethodSelect = (method: string) => {
    setSelectedVerificationMethod(method);
    step4Form.setValue('verificationMethod', method as any, { shouldValidate: true });
  };

  const handleCountryCodeSelect = (countryCode: string) => {
    setSelectedCountryCode(countryCode);
    step4Form.setValue('countryCode', countryCode, { shouldValidate: true });
  };

  // Country codes data
  const countryCodes = [
    { code: 'US', name: 'United States', dial: '+1', flag: 'https://flagcdn.com/w20/us.png' },
    { code: 'AF', name: 'Afghanistan', dial: '+93', flag: 'https://flagcdn.com/w20/af.png' },
    { code: 'AL', name: 'Albania', dial: '+355', flag: 'https://flagcdn.com/w20/al.png' },
    { code: 'DZ', name: 'Algeria', dial: '+213', flag: 'https://flagcdn.com/w20/dz.png' },
    { code: 'AR', name: 'Argentina', dial: '+54', flag: 'https://flagcdn.com/w20/ar.png' },
    { code: 'AU', name: 'Australia', dial: '+61', flag: 'https://flagcdn.com/w20/au.png' },
    { code: 'AT', name: 'Austria', dial: '+43', flag: 'https://flagcdn.com/w20/at.png' },
    { code: 'BD', name: 'Bangladesh', dial: '+880', flag: 'https://flagcdn.com/w20/bd.png' },
    { code: 'BE', name: 'Belgium', dial: '+32', flag: 'https://flagcdn.com/w20/be.png' },
    { code: 'BR', name: 'Brazil', dial: '+55', flag: 'https://flagcdn.com/w20/br.png' },
    { code: 'CA', name: 'Canada', dial: '+1', flag: 'https://flagcdn.com/w20/ca.png' },
    { code: 'CN', name: 'China', dial: '+86', flag: 'https://flagcdn.com/w20/cn.png' },
    { code: 'EG', name: 'Egypt', dial: '+20', flag: 'https://flagcdn.com/w20/eg.png' },
    { code: 'FR', name: 'France', dial: '+33', flag: 'https://flagcdn.com/w20/fr.png' },
    { code: 'DE', name: 'Germany', dial: '+49', flag: 'https://flagcdn.com/w20/de.png' },
    { code: 'IN', name: 'India', dial: '+91', flag: 'https://flagcdn.com/w20/in.png' },
    { code: 'ID', name: 'Indonesia', dial: '+62', flag: 'https://flagcdn.com/w20/id.png' },
    { code: 'IT', name: 'Italy', dial: '+39', flag: 'https://flagcdn.com/w20/it.png' },
    { code: 'JP', name: 'Japan', dial: '+81', flag: 'https://flagcdn.com/w20/jp.png' },
    { code: 'MY', name: 'Malaysia', dial: '+60', flag: 'https://flagcdn.com/w20/my.png' },
    { code: 'MX', name: 'Mexico', dial: '+52', flag: 'https://flagcdn.com/w20/mx.png' },
    { code: 'NL', name: 'Netherlands', dial: '+31', flag: 'https://flagcdn.com/w20/nl.png' },
    { code: 'NZ', name: 'New Zealand', dial: '+64', flag: 'https://flagcdn.com/w20/nz.png' },
    { code: 'NG', name: 'Nigeria', dial: '+234', flag: 'https://flagcdn.com/w20/ng.png' },
    { code: 'PK', name: 'Pakistan', dial: '+92', flag: 'https://flagcdn.com/w20/pk.png' },
    { code: 'PH', name: 'Philippines', dial: '+63', flag: 'https://flagcdn.com/w20/ph.png' },
    { code: 'RU', name: 'Russia', dial: '+7', flag: 'https://flagcdn.com/w20/ru.png' },
    { code: 'SA', name: 'Saudi Arabia', dial: '+966', flag: 'https://flagcdn.com/w20/sa.png' },
    { code: 'SG', name: 'Singapore', dial: '+65', flag: 'https://flagcdn.com/w20/sg.png' },
    { code: 'ZA', name: 'South Africa', dial: '+27', flag: 'https://flagcdn.com/w20/za.png' },
    { code: 'KR', name: 'South Korea', dial: '+82', flag: 'https://flagcdn.com/w20/kr.png' },
    { code: 'ES', name: 'Spain', dial: '+34', flag: 'https://flagcdn.com/w20/es.png' },
    { code: 'LK', name: 'Sri Lanka', dial: '+94', flag: 'https://flagcdn.com/w20/lk.png' },
    { code: 'SE', name: 'Sweden', dial: '+46', flag: 'https://flagcdn.com/w20/se.png' },
    { code: 'CH', name: 'Switzerland', dial: '+41', flag: 'https://flagcdn.com/w20/ch.png' },
    { code: 'TH', name: 'Thailand', dial: '+66', flag: 'https://flagcdn.com/w20/th.png' },
    { code: 'TR', name: 'Turkey', dial: '+90', flag: 'https://flagcdn.com/w20/tr.png' },
    { code: 'AE', name: 'UAE', dial: '+971', flag: 'https://flagcdn.com/w20/ae.png' },
    { code: 'GB', name: 'United Kingdom', dial: '+44', flag: 'https://flagcdn.com/w20/gb.png' },
    { code: 'VN', name: 'Vietnam', dial: '+84', flag: 'https://flagcdn.com/w20/vn.png' }
  ];

  const getSelectedCountry = () => countryCodes.find(c => c.code === selectedCountryCode) || countryCodes[0];

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getPasswordRequirements = (password: string) => {
    return [
      { text: 'At least 12 characters', met: password.length >= 12 },
      { text: '1 uppercase letter', met: /[A-Z]/.test(password) },
      { text: '1 lowercase letter', met: /[a-z]/.test(password) },
      { text: '1 number', met: /\d/.test(password) },
      { text: '1 symbol', met: /[^A-Za-z0-9]/.test(password) },
    ];
  };

  const renderStep1 = () => (
    <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-12">
      {/* Location Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Where are you located in Sri Lanka?
          </h2>
          <p className="text-muted-foreground">
            Select your location on the map to help us serve you better.
          </p>
        </div>

        <MapLocationPicker
          onLocationSelect={(locationData) => {
            step1Form.setValue('latitude', locationData.latitude, { shouldValidate: true });
            step1Form.setValue('longitude', locationData.longitude, { shouldValidate: true });
            step1Form.setValue('address', locationData.address, { shouldValidate: true });
          }}
          initialLatitude={step1Form.getValues('latitude')}
          initialLongitude={step1Form.getValues('longitude')}
        />
        
        {step1Form.formState.errors.address && (
          <p className="text-sm text-destructive">{step1Form.formState.errors.address.message}</p>
        )}
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

  const renderStep3 = () => {
    const password = step3Form.watch('password') || '';
    const passwordRequirements = getPasswordRequirements(password);

    return (
      <form onSubmit={step3Form.handleSubmit(onStep3Submit)} className="space-y-8">
        {/* Sign In Link */}
        <div className="text-right">
          <span className="text-muted-foreground">Already have an account? </span>
          <button
            type="button"
            onClick={() => setShowSignIn(true)}
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Your account details
          </h2>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                placeholder="First Name"
                className="h-12"
                {...step3Form.register('firstName')}
              />
              {step3Form.formState.errors.firstName && (
                <p className="text-sm text-destructive">{step3Form.formState.errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Input
                placeholder="Last Name"
                className="h-12"
                {...step3Form.register('lastName')}
              />
              {step3Form.formState.errors.lastName && (
                <p className="text-sm text-destructive">{step3Form.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Username Field */}
          <div className="space-y-2">
            <Input
              placeholder="Username"
              className="h-12"
              {...step3Form.register('username')}
            />
            {step3Form.formState.errors.username && (
              <p className="text-sm text-destructive">{step3Form.formState.errors.username.message}</p>
            )}
          </div>

          {/* Email Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email Address"
                className="h-12"
                {...step3Form.register('email')}
              />
              {step3Form.formState.errors.email && (
                <p className="text-sm text-destructive">{step3Form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Confirm Email Address"
                className="h-12"
                {...step3Form.register('confirmEmail')}
              />
              {step3Form.formState.errors.confirmEmail && (
                <p className="text-sm text-destructive">{step3Form.formState.errors.confirmEmail.message}</p>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-4">
            <div className="relative space-y-2">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="h-12 pr-10"
                  {...step3Form.register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {step3Form.formState.errors.password && (
                <p className="text-sm text-destructive">{step3Form.formState.errors.password.message}</p>
              )}
            </div>

            {/* Password Requirements */}
            {password && (
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium text-foreground">Your password must have:</p>
                <ul className="space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      {req.met ? (
                        <Check className="w-4 h-4 text-success" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className={req.met ? 'text-success' : 'text-muted-foreground'}>
                        {req.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="text-sm text-muted-foreground">
            By continuing, you agree to the DonateLanka{' '}
            <a href="#" className="text-primary underline-offset-4 hover:underline">
              terms of service
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary underline-offset-4 hover:underline">
              privacy notice
            </a>
            .
          </div>
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
            className="px-12 py-3 text-lg rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            disabled={!step3Form.formState.isValid}
          >
            Sign Up
          </Button>
        </div>
      </form>
    );
  };

  const renderStep4 = () => (
    <form onSubmit={step4Form.handleSubmit(onStep4Submit)} className="space-y-12">
      {/* Phone Number Section */}
      <div className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-lg font-medium">Phone number</Label>
            <div className="flex">
              <Select
                value={selectedCountryCode}
                onValueChange={handleCountryCodeSelect}
              >
                <SelectTrigger className="w-auto min-w-[120px] h-12 rounded-r-none border-r-0">
                  <div className="flex items-center">
                    <img 
                      src={getSelectedCountry().flag} 
                      alt={`${getSelectedCountry().name} Flag`} 
                      className="w-5 h-auto mr-2"
                    />
                    <span className="text-sm">{getSelectedCountry().dial}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <div className="flex items-center">
                        <img 
                          src={country.flag} 
                          alt={`${country.name} Flag`} 
                          className="w-4 h-auto mr-2"
                        />
                        <span className="mr-2">{country.name}</span>
                        <span className="text-muted-foreground">{country.dial}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter phone number"
                className="h-12 rounded-l-none border-l-0"
                {...step4Form.register('phoneNumber')}
              />
            </div>
            {step4Form.formState.errors.countryCode && (
              <p className="text-sm text-destructive">{step4Form.formState.errors.countryCode.message}</p>
            )}
            {step4Form.formState.errors.phoneNumber && (
              <p className="text-sm text-destructive">{step4Form.formState.errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Verification Method */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              How should we send the verification code?
            </h3>
            
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleVerificationMethodSelect('sms')}
                className={`w-full p-4 rounded-lg border text-left transition-all duration-200 flex items-center ${
                  selectedVerificationMethod === 'sms'
                    ? 'border-success bg-success/5'
                    : 'border-input hover:border-accent hover:bg-accent/5'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedVerificationMethod === 'sms'
                    ? 'border-success bg-success'
                    : 'border-input'
                }`}>
                  {selectedVerificationMethod === 'sms' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <MessageCircle className="w-5 h-5 mr-3 text-muted-foreground" />
                <span className="text-foreground font-medium">Text message</span>
              </button>

              <button
                type="button"
                onClick={() => handleVerificationMethodSelect('voice')}
                className={`w-full p-4 rounded-lg border text-left transition-all duration-200 flex items-center ${
                  selectedVerificationMethod === 'voice'
                    ? 'border-success bg-success/5'
                    : 'border-input hover:border-accent hover:bg-accent/5'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedVerificationMethod === 'voice'
                    ? 'border-success bg-success'
                    : 'border-input'
                }`}>
                  {selectedVerificationMethod === 'voice' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <Phone className="w-5 h-5 mr-3 text-muted-foreground" />
                <span className="text-foreground font-medium">Voice call</span>
              </button>
            </div>

            {step4Form.formState.errors.verificationMethod && (
              <p className="text-sm text-destructive">{step4Form.formState.errors.verificationMethod.message}</p>
            )}
          </div>
        </div>
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
          disabled={!step4Form.formState.isValid}
        >
          Send code
        </Button>
      </div>
    </form>
  );

  const renderStep5 = () => (
    <form onSubmit={step5Form.handleSubmit(onStep5Submit)} className="space-y-12">
      {/* OTP Input Section */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            We sent a verification code to {step4Data?.phoneNumber || 'your phone'}
          </p>
          
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              onChange={(value) => step5Form.setValue('otpCode', value, { shouldValidate: true })}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {step5Form.formState.errors.otpCode && (
            <p className="text-sm text-destructive text-center">{step5Form.formState.errors.otpCode.message}</p>
          )}

          <p className="text-sm text-muted-foreground">
            Didn't receive a code?{' '}
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="text-primary underline-offset-4 hover:underline"
            >
              Send again
            </button>
          </p>
        </div>
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
          disabled={!step5Form.formState.isValid}
        >
          Verify & Continue
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
              {currentStep} of 6
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
            ) : currentStep === 2 ? (
              <>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Tell us a bit more about your fundraiser
                </h1>
                <p className="text-xl text-muted-foreground">
                  This information helps us get to know you and your fundraising needs.
                </p>
              </>
            ) : currentStep === 3 ? (
              <>
                <div className="mb-4">
                  <p className="text-lg font-medium text-success mb-2">Great Progress</p>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Create an account to save and continue
                </h1>
              </>
            ) : currentStep === 4 ? (
              <>
                <div className="mb-4">
                  <p className="text-lg font-medium text-primary mb-2">Your safety is our priority</p>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Keep your account safe
                </h1>
                <p className="text-xl text-muted-foreground">
                  Add your phone number for another layer of security.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Verify your phone number
                </h1>
                <p className="text-xl text-muted-foreground">
                  Enter the 6-digit code we sent to your phone.
                </p>
              </>
            )}
          </div>

          {/* Dynamic Content */}
          <div className="transition-all duration-500 ease-in-out">
            {currentStep === 1 ? renderStep1() : 
             currentStep === 2 ? renderStep2() : 
             currentStep === 3 ? renderStep3() :
             currentStep === 4 ? renderStep4() : renderStep5()}
          </div>
        </div>
      </div>

      {/* Authentication Modal for Sign In */}
      <AuthModal
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        defaultView="login"
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