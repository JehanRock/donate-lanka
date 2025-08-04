import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, CreditCard, Shield } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { useToast } from "@/hooks/use-toast";

interface DonationFormProps {
  projectId: string;
  projectTitle: string;
  suggestedAmounts?: number[];
}

export const DonationForm = ({ 
  projectId, 
  projectTitle, 
  suggestedAmounts = [25, 50, 100, 250] 
}: DonationFormProps) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
    anonymous: false,
    message: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue > 0) {
      setSelectedAmount(numericValue);
    } else {
      setSelectedAmount(null);
    }
    setCustomAmount(value);
  };

  const handleDonate = async () => {
    if (!selectedAmount || selectedAmount <= 0) {
      toast({
        title: "Please select an amount",
        description: "Choose a donation amount to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Thank you for your donation!",
        description: `Your ${formatCurrency(selectedAmount)} donation to "${projectTitle}" has been processed.`,
      });
      setIsProcessing(false);
      
      // Reset form
      setSelectedAmount(null);
      setCustomAmount("");
      setDonorInfo({
        name: "",
        email: "",
        anonymous: false,
        message: ""
      });
    }, 2000);
  };

  const finalAmount = selectedAmount || 0;

  return (
    <div className="bg-card border rounded-lg p-6 space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-foreground">Support This Project</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Your contribution helps make this project a reality
        </p>
      </div>

      <Separator />

      {/* Amount Selection */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Choose Amount</Label>
        
        {/* Suggested Amounts */}
        <div className="grid grid-cols-2 gap-2">
          {suggestedAmounts.map((amount) => (
            <Button
              key={amount}
              variant={selectedAmount === amount ? "default" : "outline"}
              onClick={() => handleAmountSelect(amount)}
              className="h-12"
            >
              {formatCurrency(amount)}
            </Button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="space-y-2">
          <Label htmlFor="custom-amount" className="text-xs text-muted-foreground">
            Or enter custom amount
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              id="custom-amount"
              type="number"
              placeholder="0.00"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              className="pl-8"
              min="1"
              step="0.01"
            />
          </div>
        </div>

        {/* Recurring Donation */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="recurring"
            checked={isRecurring}
            onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
          />
          <Label 
            htmlFor="recurring" 
            className="text-sm cursor-pointer"
          >
            Make this a monthly donation
          </Label>
        </div>
      </div>

      <Separator />

      {/* Donor Information */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Donor Information (Optional)</Label>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="donor-name" className="text-xs text-muted-foreground">
              Name
            </Label>
            <Input
              id="donor-name"
              placeholder="Your name"
              value={donorInfo.name}
              onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="donor-email" className="text-xs text-muted-foreground">
              Email
            </Label>
            <Input
              id="donor-email"
              type="email"
              placeholder="your@email.com"
              value={donorInfo.email}
              onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="donor-message" className="text-xs text-muted-foreground">
            Message (Optional)
          </Label>
          <Input
            id="donor-message"
            placeholder="Leave a message of support..."
            value={donorInfo.message}
            onChange={(e) => setDonorInfo({ ...donorInfo, message: e.target.value })}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="anonymous"
            checked={donorInfo.anonymous}
            onCheckedChange={(checked) => 
              setDonorInfo({ ...donorInfo, anonymous: checked as boolean })
            }
          />
          <Label htmlFor="anonymous" className="text-sm cursor-pointer">
            Donate anonymously
          </Label>
        </div>
      </div>

      <Separator />

      {/* Summary */}
      {finalAmount > 0 && (
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Donation Amount:</span>
            <span className="font-medium">{formatCurrency(finalAmount)}</span>
          </div>
          {isRecurring && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Frequency:</span>
              <span>Monthly</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Processing Fee:</span>
            <span className="font-medium">{formatCurrency(finalAmount * 0.029 + 0.30)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>{formatCurrency(finalAmount + (finalAmount * 0.029 + 0.30))}</span>
          </div>
        </div>
      )}

      {/* Donate Button */}
      <Button
        onClick={handleDonate}
        disabled={!selectedAmount || selectedAmount <= 0 || isProcessing}
        className="w-full h-12"
        size="lg"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Processing...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            {finalAmount > 0 
              ? `Donate ${formatCurrency(finalAmount)}${isRecurring ? '/month' : ''}` 
              : 'Donate Now'
            }
          </div>
        )}
      </Button>

      {/* Security Note */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
        <Shield className="w-3 h-3" />
        <span>Secure payment powered by Stripe</span>
      </div>
    </div>
  );
};