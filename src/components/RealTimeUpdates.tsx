import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Bell, DollarSign, Users, TrendingUp, Heart, Activity, Clock } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { formatDistanceToNow } from "date-fns";

interface RealTimeUpdate {
  id: string;
  type: 'donation' | 'milestone' | 'comment' | 'goal_reached' | 'project_launched' | 'update_posted';
  projectId: string;
  projectTitle: string;
  message: string;
  amount?: number;
  donorName?: string;
  donorAvatar?: string;
  isAnonymous?: boolean;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface RealTimeUpdatesProps {
  projectId?: string;
  showGlobal?: boolean;
  className?: string;
  maxItems?: number;
}

const generateMockUpdate = (): RealTimeUpdate => {
  const types: RealTimeUpdate['type'][] = ['donation', 'milestone', 'comment', 'goal_reached', 'project_launched', 'update_posted'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const projects = [
    "Help Build Community Garden",
    "Medical Aid for Children",
    "Tech Education Initiative", 
    "Disaster Relief Fund",
    "Animal Shelter Support"
  ];

  const donors = [
    { name: "Sarah Johnson", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=32&h=32&fit=crop&crop=face" },
    { name: "Michael Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" },
    { name: "Emma Davis", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face" },
    { name: "Anonymous", avatar: undefined },
  ];

  const projectTitle = projects[Math.floor(Math.random() * projects.length)];
  const donor = donors[Math.floor(Math.random() * donors.length)];
  const isAnonymous = donor.name === "Anonymous";

  let message = "";
  let amount: number | undefined;

  switch (type) {
    case 'donation':
      amount = Math.floor(Math.random() * 500) + 10;
      message = isAnonymous 
        ? `Anonymous donated ${formatCurrency(amount)} to ${projectTitle}`
        : `${donor.name} donated ${formatCurrency(amount)} to ${projectTitle}`;
      break;
    case 'milestone':
      message = `${projectTitle} reached 75% of funding goal!`;
      break;
    case 'comment':
      message = isAnonymous
        ? `Anonymous left a comment on ${projectTitle}`
        : `${donor.name} commented on ${projectTitle}`;
      break;
    case 'goal_reached':
      message = `🎉 ${projectTitle} reached its funding goal!`;
      break;
    case 'project_launched':
      message = `New project launched: ${projectTitle}`;
      break;
    case 'update_posted':
      message = `${projectTitle} posted a new update`;
      break;
  }

  return {
    id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    projectId: `project_${Math.floor(Math.random() * 100)}`,
    projectTitle,
    message,
    amount,
    donorName: isAnonymous ? undefined : donor.name,
    donorAvatar: isAnonymous ? undefined : donor.avatar,
    isAnonymous,
    timestamp: new Date(Date.now() - Math.random() * 3600000), // Random time within last hour
  };
};

export const RealTimeUpdates = ({ 
  projectId, 
  showGlobal = true, 
  className,
  maxItems = 10 
}: RealTimeUpdatesProps) => {
  const [updates, setUpdates] = useState<RealTimeUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [newUpdatesCount, setNewUpdatesCount] = useState(0);

  useEffect(() => {
    // Initialize with some mock data
    const initialUpdates = Array.from({ length: 5 }, () => generateMockUpdate());
    setUpdates(initialUpdates.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    setIsConnected(true);

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newUpdate = generateMockUpdate();
      
      setUpdates(prev => {
        const updated = [newUpdate, ...prev].slice(0, maxItems);
        return updated;
      });
      
      setNewUpdatesCount(prev => prev + 1);
    }, 3000 + Math.random() * 7000); // Random interval between 3-10 seconds

    return () => clearInterval(interval);
  }, [projectId, maxItems]);

  const handleMarkAsRead = () => {
    setNewUpdatesCount(0);
  };

  const getUpdateIcon = (type: RealTimeUpdate['type']) => {
    switch (type) {
      case 'donation':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'milestone':
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'comment':
        return <Users className="w-4 h-4 text-purple-500" />;
      case 'goal_reached':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'project_launched':
        return <Activity className="w-4 h-4 text-orange-500" />;
      case 'update_posted':
        return <Bell className="w-4 h-4 text-indigo-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getUpdateColor = (type: RealTimeUpdate['type']) => {
    switch (type) {
      case 'donation':
        return "bg-green-50 border-green-200";
      case 'milestone':
        return "bg-blue-50 border-blue-200";
      case 'comment':
        return "bg-purple-50 border-purple-200";
      case 'goal_reached':
        return "bg-red-50 border-red-200";
      case 'project_launched':
        return "bg-orange-50 border-orange-200";
      case 'update_posted':
        return "bg-indigo-50 border-indigo-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            <CardTitle>
              {showGlobal ? "Live Activity Feed" : "Project Updates"}
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-muted-foreground">
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>
          
          {newUpdatesCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAsRead}
              className="text-xs"
            >
              <Bell className="w-3 h-3 mr-1" />
              {newUpdatesCount} new
            </Button>
          )}
        </div>
        
        <CardDescription>
          {showGlobal 
            ? "Real-time updates from all projects on the platform"
            : "Live updates for this project"
          }
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {updates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
          </div>
        ) : (
          updates.map((update, index) => (
            <div
              key={update.id}
              className={`p-3 rounded-lg border transition-all duration-300 ${
                index < newUpdatesCount ? 'ring-2 ring-primary/20' : ''
              } ${getUpdateColor(update.type)}`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar or Icon */}
                <div className="flex-shrink-0">
                  {update.donorAvatar && !update.isAnonymous ? (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={update.donorAvatar} alt={update.donorName} />
                      <AvatarFallback>
                        {update.donorName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-background border flex items-center justify-center">
                      {getUpdateIcon(update.type)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    {update.message}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {update.type.replace('_', ' ')}
                    </Badge>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(update.timestamp, { addSuffix: true })}
                    </div>
                  </div>

                  {/* Special content for certain update types */}
                  {update.type === 'milestone' && (
                    <div className="mt-2">
                      <Progress value={75} className="h-1" />
                      <p className="text-xs text-muted-foreground mt-1">
                        75% of ${formatCurrency(50000)} goal reached
                      </p>
                    </div>
                  )}

                  {update.type === 'goal_reached' && (
                    <div className="mt-2 p-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded">
                      <p className="text-xs font-medium text-green-700">
                        🎉 Congratulations! This project is now fully funded!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};