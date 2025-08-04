import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WifiOff, Wifi, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OfflineIndicatorProps {
  className?: string;
}

export const OfflineIndicator = ({ className }: OfflineIndicatorProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [pendingActions, setPendingActions] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      
      if (wasOffline) {
        toast({
          title: "Back Online",
          description: "Your connection has been restored. Syncing data...",
          duration: 3000,
        });
        
        // Simulate syncing pending actions
        setTimeout(() => {
          setLastSync(new Date());
          setPendingActions(0);
          setWasOffline(false);
          
          toast({
            title: "Sync Complete",
            description: "All your data has been synchronized.",
            duration: 2000,
          });
        }, 2000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      
      toast({
        title: "You're Offline",
        description: "Don't worry, you can still browse and your actions will sync when you're back online.",
        variant: "destructive",
        duration: 5000,
      });
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Simulate pending actions when offline
    if (!isOnline) {
      const interval = setInterval(() => {
        setPendingActions(prev => prev + Math.floor(Math.random() * 2));
      }, 5000);

      return () => {
        clearInterval(interval);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline, wasOffline, toast]);

  const handleRetry = () => {
    // Force a connection check
    if (navigator.onLine) {
      setIsOnline(true);
      setWasOffline(false);
    } else {
      toast({
        title: "Still Offline",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
    }
  };

  // Show minimal indicator when online
  if (isOnline && !wasOffline) {
    return (
      <Badge variant="secondary" className={`text-xs ${className}`}>
        <Wifi className="w-3 h-3 mr-1" />
        Online
      </Badge>
    );
  }

  // Show detailed offline card when offline
  if (!isOnline) {
    return (
      <Card className={`border-orange-200 bg-orange-50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WifiOff className="w-5 h-5 text-orange-600" />
              <div>
                <h3 className="font-medium text-orange-900">You're Offline</h3>
                <p className="text-sm text-orange-700">
                  You can still browse and interact. Changes will sync when you're back online.
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Retry
            </Button>
          </div>

          {pendingActions > 0 && (
            <div className="mt-3 p-2 bg-orange-100 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-orange-800">
                <AlertCircle className="w-4 h-4" />
                <span>
                  {pendingActions} action{pendingActions !== 1 ? 's' : ''} waiting to sync
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Show sync success indicator when coming back online
  if (isOnline && wasOffline) {
    return (
      <Card className={`border-green-200 bg-green-50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <h3 className="font-medium text-green-900">Back Online</h3>
              <p className="text-sm text-green-700">
                {lastSync 
                  ? `Last synced: ${lastSync.toLocaleTimeString()}`
                  : "Syncing your data..."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};