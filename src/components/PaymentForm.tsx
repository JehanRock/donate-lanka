import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Lock, CreditCard, Shield, Heart, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/currency";

interface PaymentFormProps {
  projectId: string;
  projectTitle: string;
  minAmount?: number;
  onPaymentSuccess?: (amount: number, paymentId: string) => void;
  className?: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank';
  name: string;
  icon: React.ReactNode;
  fees: number;
}

const paymentMethods: PaymentMethod[] = [
  { id: 'card', type: 'card', name: 'Credit/Debit Card', icon: <CreditCard className="w-4 h-4" />, fees: 2.9 },
  { id: 'paypal', type: 'paypal', name: 'PayPal', icon: <div className="w-4 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center">P</div>, fees: 3.4 },
  { id: 'bank', type: 'bank', name: 'Bank Transfer', icon: <div className="w-4 h-4 bg-green-600 rounded text-white text-xs flex items-center justify-center">B</div>, fees: 0.8 },
];

const quickAmounts = [10, 25, 50, 100, 250, 500];

export const PaymentForm = ({ 
  projectId, 
  projectTitle, 
  minAmount = 1,
  onPaymentSuccess,
  className 
}: PaymentFormProps) => {
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<string>("card");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<string>("monthly");
  const [tip, setTip] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Card form fields
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod);
  const numericAmount = parseFloat(amount) || 0;
  const fees = selectedPaymentMethod ? (numericAmount * selectedPaymentMethod.fees / 100) : 0;
  const totalAmount = numericAmount + tip + fees;

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const handleTipChange = (percentage: number) => {
    const tipAmount = numericAmount * (percentage / 100);
    setTip(tipAmount);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      setExpiryDate(formatted);
    }
  };

  const validateForm = () => {
    if (numericAmount < minAmount) {
      toast({
        title: "Invalid Amount",
        description: `Minimum donation amount is ${formatCurrency(minAmount)}`,
        variant: "destructive",
      });
      return false;
    }

    if (selectedMethod === 'card') {
      if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
        toast({
          title: "Missing Card Information",
          description: "Please fill in all card details",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      toast({
        title: "Payment Successful!",
        description: `Thank you for your ${formatCurrency(totalAmount)} donation to ${projectTitle}`,
      });

      onPaymentSuccess?.(totalAmount, paymentId);

      // Reset form
      setAmount("");
      setCardNumber("");
      setExpiryDate("");
      setCvv("");
      setCardholderName("");
      setTip(0);
      
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Support This Project
        </CardTitle>
        <CardDescription>
          Your contribution helps bring {projectTitle} to life
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Donation Amount */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-base font-medium">
              Donation Amount
            </Label>
            
            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant={amount === quickAmount.toString() ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQuickAmount(quickAmount)}
                  className="h-10"
                >
                  {formatCurrency(quickAmount)}
                </Button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="Enter custom amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                min={minAmount}
                step="0.01"
              />
            </div>
          </div>

          {/* Tip Section */}
          {numericAmount > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Add a tip to support the platform (optional)
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 10, 15, 20].map((percentage) => (
                  <Button
                    key={percentage}
                    type="button"
                    variant={tip === (numericAmount * percentage / 100) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTipChange(percentage)}
                  >
                    {percentage === 0 ? "No tip" : `${percentage}%`}
                  </Button>
                ))}
              </div>
              {tip > 0 && (
                <p className="text-sm text-muted-foreground">
                  Tip amount: {formatCurrency(tip)}
                </p>
              )}
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Payment Method</Label>
            <div className="grid gap-2">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {method.icon}
                      <span className="font-medium">{method.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {method.fees}% fee
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card Details Form */}
          {selectedMethod === 'card' && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                Your payment information is secure and encrypted
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      value={expiryDate}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recurring Donation */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring"
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
              />
              <Label htmlFor="recurring" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Make this a recurring donation
              </Label>
              <Badge variant="secondary" className="ml-2">
                <Star className="w-3 h-3 mr-1" />
                Popular
              </Badge>
            </div>

            {isRecurring && (
              <Select value={recurringFrequency} onValueChange={setRecurringFrequency}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Anonymous Donation */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
            />
            <Label htmlFor="anonymous" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Make this donation anonymous
            </Label>
          </div>

          <Separator />

          {/* Payment Summary */}
          {numericAmount > 0 && (
            <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Donation amount:</span>
                <span>{formatCurrency(numericAmount)}</span>
              </div>
              {tip > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Platform tip:</span>
                  <span>{formatCurrency(tip)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Processing fee:</span>
                <span>{formatCurrency(fees)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12"
            disabled={!amount || numericAmount < minAmount || isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing Payment...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Donate {amount ? formatCurrency(totalAmount) : formatCurrency(minAmount)}
                {isRecurring && ` ${recurringFrequency}`}
              </div>
            )}
          </Button>
        </form>

        {/* Security Badges */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            SSL Secured
          </div>
          <div className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            256-bit Encryption
          </div>
        </div>
      </CardContent>
    </Card>
  );
};