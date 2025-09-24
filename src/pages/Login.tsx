import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, User, Check } from 'lucide-react';
import { Login as LoginForm } from '@/components/Login';
import { Signup } from '@/components/Signup';

type AccountType = 'personal' | 'organization';
type ViewType = 'selection' | 'login' | 'signup';

export default function LoginPage() {
  const [accountType, setAccountType] = useState<AccountType>('personal');
  const [view, setView] = useState<ViewType>('selection');

  const handleAccountTypeSelect = (type: AccountType) => {
    setAccountType(type);
    setView('login');
  };

  const handleSuccess = () => {
    // Redirect to dashboard or previous page
    window.location.href = '/dashboard';
  };

  const renderAccountSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary-50 flex items-center justify-center container-padding">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
            Join Our Community
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your account type to get started with creating meaningful impact
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Personal Account */}
          <Card className="relative overflow-hidden group hover:shadow-card-hover transition-all duration-300 cursor-pointer border-2 hover:border-primary-200"
                onClick={() => handleAccountTypeSelect('personal')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-primary-100 rounded-full w-fit">
                <User className="h-8 w-8 text-primary-600" />
              </div>
              <CardTitle className="text-2xl font-heading">Personal Account</CardTitle>
              <CardDescription className="text-base">
                For individuals who want to support causes and create campaigns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  'Support projects you care about',
                  'Create personal fundraising campaigns',
                  'Track your donation history',
                  'Connect with like-minded individuals'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-success" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-6" variant="outline">
                Get Started
              </Button>
            </CardContent>
          </Card>

          {/* Organization Account */}
          <Card className="relative overflow-hidden group hover:shadow-card-hover transition-all duration-300 cursor-pointer border-2 hover:border-secondary-200"
                onClick={() => handleAccountTypeSelect('organization')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-secondary-100 rounded-full w-fit">
                <Building2 className="h-8 w-8 text-secondary-600" />
              </div>
              <CardTitle className="text-2xl font-heading">Organization Account</CardTitle>
              <CardDescription className="text-base">
                For companies, NGOs, and institutions focused on corporate social responsibility
              </CardDescription>
              <Badge variant="secondary" className="mt-2">Corporate Features</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  'Bulk donation capabilities',
                  'Team member management',
                  'Corporate matching programs',
                  'Advanced CSR reporting',
                  'Custom branding options'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-success" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-6" variant="secondary">
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderAuthForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary-50 flex items-center justify-center container-padding">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <button 
            onClick={() => setView('selection')}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors self-start"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to account selection
          </button>
          
          <div className="flex items-center justify-center gap-2">
            {accountType === 'personal' ? (
              <User className="h-6 w-6 text-primary-600" />
            ) : (
              <Building2 className="h-6 w-6 text-secondary-600" />
            )}
            <Badge variant={accountType === 'personal' ? 'default' : 'secondary'}>
              {accountType === 'personal' ? 'Personal' : 'Organization'}
            </Badge>
          </div>
          
          <CardTitle className="text-2xl font-heading">
            {view === 'login' ? 'Welcome back!' : 'Create account'}
          </CardTitle>
          <CardDescription>
            {view === 'login' 
              ? `Sign in to your ${accountType} account`
              : `Create your ${accountType} account to get started`
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {view === 'login' ? (
            <LoginForm onSuccess={handleSuccess} />
          ) : (
            <Signup onSuccess={handleSuccess} />
          )}
          
          <div className="mt-6 text-center">
            {view === 'login' ? (
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button
                  onClick={() => setView('signup')}
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  onClick={() => setView('login')}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (view === 'selection') {
    return renderAccountSelection();
  }

  return renderAuthForm();
}