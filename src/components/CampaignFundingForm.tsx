import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  DollarSign, 
  Target, 
  Clock, 
  Plus, 
  Trash2,
  Info,
  TrendingUp
} from "lucide-react";
import { format, addDays, addMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { CampaignData } from "./CampaignCreationWizard";

interface CampaignFundingFormProps {
  data: CampaignData;
  onUpdate: (updates: Partial<CampaignData>) => void;
}

const CURRENCIES = [
  { value: 'USD', label: '$ USD', symbol: '$' },
  { value: 'EUR', label: '€ EUR', symbol: '€' },
  { value: 'GBP', label: '£ GBP', symbol: '£' },
  { value: 'CAD', label: '$ CAD', symbol: 'C$' },
  { value: 'AUD', label: '$ AUD', symbol: 'A$' }
];

const DURATION_PRESETS = [
  { label: '30 days', days: 30 },
  { label: '45 days', days: 45 },
  { label: '60 days', days: 60 },
  { label: '90 days', days: 90 }
];

export const CampaignFundingForm = ({ data, onUpdate }: CampaignFundingFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showRewardForm, setShowRewardForm] = useState(false);
  const [newReward, setNewReward] = useState({
    title: '',
    description: '',
    amount: 0,
    estimatedDelivery: undefined as Date | undefined,
    quantity: undefined as number | undefined
  });

  const selectedCurrency = CURRENCIES.find(c => c.value === data.currency) || CURRENCIES[0];

  const validateFundingGoal = (amount: number) => {
    const newErrors = { ...errors };
    
    if (amount <= 0) {
      newErrors.fundingGoal = 'Funding goal must be greater than 0';
    } else if (amount < 100) {
      newErrors.fundingGoal = 'Minimum funding goal is $100';
    } else if (amount > 10000000) {
      newErrors.fundingGoal = 'Maximum funding goal is $10,000,000';
    } else {
      delete newErrors.fundingGoal;
    }
    
    setErrors(newErrors);
  };

  const validateMinimumDonation = (amount: number) => {
    const newErrors = { ...errors };
    
    if (amount <= 0) {
      newErrors.minimumDonation = 'Minimum donation must be greater than 0';
    } else if (amount > data.fundingGoal * 0.1) {
      newErrors.minimumDonation = 'Minimum donation should not exceed 10% of funding goal';
    } else {
      delete newErrors.minimumDonation;
    }
    
    setErrors(newErrors);
  };

  const handleFundingGoalChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    validateFundingGoal(amount);
    onUpdate({ fundingGoal: amount });
  };

  const handleMinimumDonationChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    validateMinimumDonation(amount);
    onUpdate({ minimumDonation: amount });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      onUpdate({ endDate: date });
    }
  };

  const setDurationPreset = (days: number) => {
    const endDate = addDays(new Date(), days);
    handleEndDateChange(endDate);
  };

  const addReward = () => {
    if (newReward.title && newReward.description && newReward.amount > 0) {
      onUpdate({
        rewards: [...data.rewards, { ...newReward }]
      });
      setNewReward({
        title: '',
        description: '',
        amount: 0,
        estimatedDelivery: undefined,
        quantity: undefined
      });
      setShowRewardForm(false);
    }
  };

  const removeReward = (index: number) => {
    const newRewards = data.rewards.filter((_, i) => i !== index);
    onUpdate({ rewards: newRewards });
  };

  const getDaysRemaining = () => {
    if (data.endDate) {
      const today = new Date();
      const diffTime = data.endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Funding Goal */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fundingGoal" className="text-sm font-medium">
            Funding Goal *
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {selectedCurrency.symbol}
            </div>
            <Input
              id="fundingGoal"
              type="number"
              placeholder="0"
              value={data.fundingGoal || ''}
              onChange={(e) => handleFundingGoalChange(e.target.value)}
              className={`pl-8 ${errors.fundingGoal ? 'border-destructive' : ''}`}
            />
          </div>
          {errors.fundingGoal && (
            <p className="text-sm text-destructive">{errors.fundingGoal}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Currency</Label>
          <Select value={data.currency} onValueChange={(value) => onUpdate({ currency: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency.value} value={currency.value}>
                  {currency.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Funding Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Funding Model *</Label>
        <RadioGroup
          value={data.fundingType}
          onValueChange={(value: 'all_or_nothing' | 'keep_what_you_raise') => 
            onUpdate({ fundingType: value })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all_or_nothing" id="all_or_nothing" />
            <Label htmlFor="all_or_nothing" className="flex-1 cursor-pointer">
              <div className="font-medium">All-or-Nothing</div>
              <div className="text-sm text-muted-foreground">
                Receive funds only if you reach your goal. More motivation, higher success rates.
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="keep_what_you_raise" id="keep_what_you_raise" />
            <Label htmlFor="keep_what_you_raise" className="flex-1 cursor-pointer">
              <div className="font-medium">Keep What You Raise</div>
              <div className="text-sm text-muted-foreground">
                Keep all funds raised, even if you don't reach your goal. More flexible.
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Campaign Duration */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Campaign Duration *</Label>
        
        {/* Quick Presets */}
        <div className="flex gap-2 flex-wrap">
          {DURATION_PRESETS.map((preset) => (
            <Button
              key={preset.days}
              variant="outline"
              size="sm"
              onClick={() => setDurationPreset(preset.days)}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Custom End Date */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !data.endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.endDate ? format(data.endDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={data.endDate}
                  onSelect={handleEndDateChange}
                  disabled={(date) => date < addDays(new Date(), 1)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Duration</Label>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">
                {getDaysRemaining()} days
              </span>
              {getDaysRemaining() > 0 && (
                <Badge variant="outline" className="text-xs">
                  {getDaysRemaining() < 30 ? 'Short' : getDaysRemaining() < 60 ? 'Medium' : 'Long'}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Minimum Donation */}
      <div className="space-y-2">
        <Label htmlFor="minimumDonation" className="text-sm font-medium">
          Minimum Donation Amount
        </Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {selectedCurrency.symbol}
          </div>
          <Input
            id="minimumDonation"
            type="number"
            placeholder="1"
            value={data.minimumDonation || ''}
            onChange={(e) => handleMinimumDonationChange(e.target.value)}
            className={`pl-8 ${errors.minimumDonation ? 'border-destructive' : ''}`}
          />
        </div>
        {errors.minimumDonation && (
          <p className="text-sm text-destructive">{errors.minimumDonation}</p>
        )}
        <p className="text-xs text-muted-foreground">
          The minimum amount supporters can contribute to your campaign
        </p>
      </div>

      {/* Rewards Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Rewards (Optional)</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Offer rewards to incentivize higher contributions
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRewardForm(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Reward
          </Button>
        </div>

        {/* Existing Rewards */}
        {data.rewards.length > 0 && (
          <div className="space-y-3">
            {data.rewards.map((reward, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{reward.title}</h4>
                      <Badge variant="secondary">
                        {selectedCurrency.symbol}{reward.amount}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {reward.description}
                    </p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      {reward.quantity && (
                        <span>Limited: {reward.quantity} available</span>
                      )}
                      {reward.estimatedDelivery && (
                        <span>
                          Delivery: {format(reward.estimatedDelivery, "MMM yyyy")}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeReward(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add Reward Form */}
        {showRewardForm && (
          <Card className="p-4 border-dashed">
            <div className="space-y-4">
              <h4 className="font-medium">Add New Reward</h4>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Reward Title</Label>
                  <Input
                    placeholder="e.g., Early Bird Special"
                    value={newReward.title}
                    onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Contribution Amount</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {selectedCurrency.symbol}
                    </div>
                    <Input
                      type="number"
                      placeholder="0"
                      className="pl-8"
                      value={newReward.amount || ''}
                      onChange={(e) => setNewReward({ ...newReward, amount: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Description</Label>
                <Textarea
                  placeholder="Describe what supporters will receive..."
                  value={newReward.description}
                  onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Quantity (Optional)</Label>
                  <Input
                    type="number"
                    placeholder="Unlimited"
                    value={newReward.quantity || ''}
                    onChange={(e) => setNewReward({ 
                      ...newReward, 
                      quantity: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Estimated Delivery</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "justify-start text-left font-normal w-full",
                          !newReward.estimatedDelivery && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {newReward.estimatedDelivery 
                          ? format(newReward.estimatedDelivery, "MMM yyyy") 
                          : "Select month"
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newReward.estimatedDelivery}
                        onSelect={(date) => setNewReward({ ...newReward, estimatedDelivery: date })}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" onClick={addReward}>
                  Add Reward
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowRewardForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Summary */}
      <Card className="p-4 bg-muted/50">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Campaign Summary
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Goal</div>
            <div className="font-medium">
              {selectedCurrency.symbol}{data.fundingGoal?.toLocaleString() || 0}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Duration</div>
            <div className="font-medium">
              {getDaysRemaining()} days
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Model</div>
            <div className="font-medium">
              {data.fundingType === 'all_or_nothing' ? 'All-or-Nothing' : 'Flexible'}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
