import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Calendar, 
  Heart, 
  Star, 
  Users, 
  DollarSign, 
  Trophy,
  MessageCircle,
  Share2,
  UserPlus,
  UserCheck
} from "lucide-react";
import { User } from "@/types/user";
import { Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";

interface UserProfileProps {
  user: User;
  projects?: Project[];
  isOwnProfile?: boolean;
  className?: string;
}

export const UserProfile = ({ 
  user, 
  projects = [], 
  isOwnProfile = false,
  className = "" 
}: UserProfileProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("projects");

  const createdProjects = projects.filter(p => p.creator.id === user.id);
  const supportedProjects = projects.filter(p => 
    p.donorCount > 0 // This would be based on actual donation data
  ).slice(0, 6);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: Implement follow/unfollow API call
  };

  const stats = [
    { label: "Projects Created", value: createdProjects.length, icon: Trophy },
    { label: "Total Raised", value: `$${createdProjects.reduce((sum, p) => sum + p.currentAmount, 0).toLocaleString()}`, icon: DollarSign },
    { label: "Supporters", value: createdProjects.reduce((sum, p) => sum + p.donorCount, 0), icon: Users },
    { label: "Impact Score", value: user.impactScore || 0, icon: Star },
  ];

  return (
    <div className={`max-w-6xl mx-auto space-y-6 ${className}`}>
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              {!isOwnProfile && (
                <Button 
                  onClick={handleFollow}
                  variant={isFollowing ? "outline" : "default"}
                  className="w-full md:w-auto"
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Follow
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Profile Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                  <div className="flex items-center gap-4 text-muted-foreground mb-3">
                    {user.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {user.bio && (
                <p className="text-muted-foreground mb-4">{user.bio}</p>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">
                  {user.role === 'creator' ? 'Project Creator' : 'Supporter'}
                </Badge>
                {user.isVerified && (
                  <Badge variant="default">
                    <Star className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {createdProjects.length >= 5 && (
                  <Badge variant="outline">
                    <Trophy className="h-3 w-3 mr-1" />
                    Experienced Creator
                  </Badge>
                )}
              </div>

              {/* Trust Score */}
              {user.trustScore && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Trust Score</span>
                    <span className="text-sm text-muted-foreground">{user.trustScore}/100</span>
                  </div>
                  <Progress value={user.trustScore} className="h-2" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects">Projects Created</TabsTrigger>
          <TabsTrigger value="supported">Projects Supported</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          {createdProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground">
                  {isOwnProfile 
                    ? "Ready to make a difference? Create your first project!"
                    : "This user hasn't created any projects yet."
                  }
                </p>
                {isOwnProfile && (
                  <Button className="mt-4">
                    Create Project
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="supported" className="space-y-6">
          {supportedProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supportedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} size="compact" />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Support History</h3>
                <p className="text-muted-foreground">
                  {isOwnProfile 
                    ? "Start supporting amazing projects today!"
                    : "This user hasn't supported any projects yet."
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Activity Feed</h3>
              <p className="text-muted-foreground">
                Recent activity will appear here soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};