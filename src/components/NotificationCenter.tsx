import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, BellOff, Settings, Check, CheckCheck, Trash2, 
  DollarSign, Heart, MessageCircle, TrendingUp, Users,
  Mail, Smartphone, Globe, Clock, Star, Award, AlertCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: 'donation' | 'milestone' | 'comment' | 'update' | 'goal_reached' | 'system' | 'social';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isImportant: boolean;
  actionUrl?: string;
  avatar?: string;
  metadata?: Record<string, any>;
}

interface NotificationSettings {
  email: {
    donations: boolean;
    milestones: boolean;
    comments: boolean;
    updates: boolean;
    weekly_summary: boolean;
  };
  push: {
    donations: boolean;
    milestones: boolean;
    comments: boolean;
    updates: boolean;
    instant: boolean;
  };
  frequency: 'instant' | 'hourly' | 'daily' | 'weekly';
}

interface NotificationCenterProps {
  className?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "donation",
    title: "New Donation Received",
    message: "Sarah Johnson donated $50 to your Medical Aid project",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isRead: false,
    isImportant: true,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=32&h=32&fit=crop&crop=face",
  },
  {
    id: "2", 
    type: "milestone",
    title: "Milestone Reached!",
    message: "Your project has reached 75% of its funding goal",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false,
    isImportant: true,
  },
  {
    id: "3",
    type: "comment",
    title: "New Comment",
    message: "Michael Chen commented on your project update",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    isRead: true,
    isImportant: false,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
  },
  {
    id: "4",
    type: "update",
    title: "Weekly Summary",
    message: "Your projects received 12 new donations this week",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isRead: true,
    isImportant: false,
  },
  {
    id: "5",
    type: "goal_reached",
    title: "Goal Achieved! 🎉",
    message: "Community Garden project has reached its funding goal",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isRead: true,
    isImportant: true,
  },
  {
    id: "6",
    type: "system",
    title: "Account Verification",
    message: "Please verify your account to receive donations",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isRead: false,
    isImportant: true,
  },
];

const defaultSettings: NotificationSettings = {
  email: {
    donations: true,
    milestones: true,
    comments: true,
    updates: false,
    weekly_summary: true,
  },
  push: {
    donations: true,
    milestones: true,
    comments: false,
    updates: false,
    instant: true,
  },
  frequency: 'instant',
};

export const NotificationCenter = ({ className }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const importantCount = notifications.filter(n => n.isImportant && !n.isRead).length;

  useEffect(() => {
    // Simulate receiving new notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        const newNotification: Notification = {
          id: `new_${Date.now()}`,
          type: ['donation', 'comment', 'milestone'][Math.floor(Math.random() * 3)] as any,
          title: "New Activity",
          message: "You have new activity on your project",
          timestamp: new Date(),
          isRead: false,
          isImportant: Math.random() > 0.5,
        };
        
        setNotifications(prev => [newNotification, ...prev].slice(0, 20));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'donation':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'milestone':
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-purple-500" />;
      case 'update':
        return <Bell className="w-4 h-4 text-orange-500" />;
      case 'goal_reached':
        return <Award className="w-4 h-4 text-yellow-500" />;
      case 'system':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'social':
        return <Users className="w-4 h-4 text-indigo-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'important':
        return notification.isImportant;
      default:
        return true;
    }
  });

  const updateSettings = (path: string, value: any) => {
    setSettings(prev => {
      const keys = path.split('.');
      const updated = { ...prev };
      let current: any = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <CardDescription>
          Stay updated with your project activity and platform news
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            {/* Filter Buttons */}
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All ({notifications.length})
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Unread ({unreadCount})
              </Button>
              <Button
                variant={filter === 'important' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('important')}
              >
                Important ({importantCount})
              </Button>
            </div>

            {/* Notifications List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BellOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications found</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border transition-all hover:bg-muted/50 ${
                      !notification.isRead ? 'bg-primary/5 border-primary/20' : 'bg-background'
                    } ${notification.isImportant ? 'ring-1 ring-orange-200' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar or Icon */}
                      <div className="flex-shrink-0">
                        {notification.avatar ? (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={notification.avatar} />
                            <AvatarFallback>
                              {getNotificationIcon(notification.type)}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm leading-relaxed">
                              {notification.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-1 ml-2">
                            {notification.isImportant && (
                              <Star className="w-3 h-3 text-orange-500 fill-current" />
                            )}
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-6 px-2 text-xs"
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-6 px-2 text-xs hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <h3 className="font-medium">Email Notifications</h3>
                </div>
                
                <div className="space-y-3 pl-6">
                  {Object.entries(settings.email).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={`email-${key}`} className="text-sm">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Label>
                      <Switch
                        id={`email-${key}`}
                        checked={value}
                        onCheckedChange={(checked) => updateSettings(`email.${key}`, checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Push Notifications */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <h3 className="font-medium">Push Notifications</h3>
                </div>
                
                <div className="space-y-3 pl-6">
                  {Object.entries(settings.push).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={`push-${key}`} className="text-sm">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Label>
                      <Switch
                        id={`push-${key}`}
                        checked={value}
                        onCheckedChange={(checked) => updateSettings(`push.${key}`, checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Notification Frequency */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <h3 className="font-medium">Notification Frequency</h3>
                </div>
                
                <div className="space-y-2 pl-6">
                  {['instant', 'hourly', 'daily', 'weekly'].map((frequency) => (
                    <div key={frequency} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={frequency}
                        name="frequency"
                        value={frequency}
                        checked={settings.frequency === frequency}
                        onChange={(e) => updateSettings('frequency', e.target.value)}
                        className="w-4 h-4"
                      />
                      <Label htmlFor={frequency} className="text-sm">
                        {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};