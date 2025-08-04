import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Smartphone, Download, Zap, Wifi, Bell } from "lucide-react";

interface PWAInstallPromptProps {
  className?: string;
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt = ({ className }: PWAInstallPromptProps) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed (running in standalone mode)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                              (window.navigator as any).standalone === true;
    
    setIsStandalone(isInStandaloneMode);
    
    if (isInStandaloneMode) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(event);
      
      // Show install prompt after a delay (don't be too aggressive)
      setTimeout(() => {
        setIsVisible(true);
      }, 5000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
      
      // Show success message
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(() => {
          console.log('App installed successfully!');
        });
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if the user has already dismissed the prompt recently
    const lastDismissed = localStorage.getItem('pwa-install-dismissed');
    if (lastDismissed) {
      const daysSinceDismissed = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) { // Don't show again for 7 days
        setIsVisible(false);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      // Show the install prompt
      await deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsInstalled(true);
      } else {
        console.log('User dismissed the install prompt');
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
      }
      
      setIsVisible(false);
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Error during app installation:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if app is already installed or no install prompt is available
  if (isInstalled || isStandalone || !deferredPrompt || !isVisible) {
    return null;
  }

  return (
    <Card className={`border-primary/20 bg-gradient-to-r from-primary/5 to-blue-500/5 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Install Our App</CardTitle>
            <Badge variant="secondary" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Fast
            </Badge>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <CardDescription>
          Get the best experience with our Progressive Web App
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
            <Wifi className="w-4 h-4 text-blue-500" />
            <span className="text-sm">Works Offline</span>
          </div>
          
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">Lightning Fast</span>
          </div>
          
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
            <Bell className="w-4 h-4 text-green-500" />
            <span className="text-sm">Push Notifications</span>
          </div>
        </div>

        {/* Benefits List */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            <span>Access your campaigns anytime, anywhere</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            <span>Receive instant notifications for donations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            <span>Native app-like experience on your device</span>
          </div>
        </div>

        {/* Install Button */}
        <div className="flex gap-2">
          <Button onClick={handleInstallClick} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Install App
          </Button>
          
          <Button variant="outline" onClick={handleDismiss}>
            Maybe Later
          </Button>
        </div>

        {/* Installation Instructions for iOS */}
        {/iPhone|iPad|iPod/.test(navigator.userAgent) && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 mb-2 font-medium">
              For iOS users:
            </p>
            <ol className="text-xs text-blue-700 space-y-1">
              <li>1. Tap the Share button at the bottom of the screen</li>
              <li>2. Scroll down and tap "Add to Home Screen"</li>
              <li>3. Tap "Add" to install the app</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
};