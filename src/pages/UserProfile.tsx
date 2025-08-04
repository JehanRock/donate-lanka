import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserProfile as UserProfileComponent } from "@/components/UserProfile";
import { mockProjects } from "@/data/mockData";
import { User } from "@/types/user";
import { ArrowLeft } from "lucide-react";

// Mock user data - in real app, this would come from API
const mockUsers: User[] = [
  {
    id: "user1",
    email: "emma.williams@example.com",
    firstName: "Emma",
    lastName: "Williams",
    name: "Dr. Emma Williams",
    displayName: "Dr. Emma Williams",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    role: "creator",
    accountStatus: "active",
    verificationStatus: "verified",
    isVerified: true,
    bio: "Dedicated healthcare professional working to improve medical access in underserved communities. 15+ years of experience in emergency medicine.",
    location: "San Francisco, CA",
    website: "https://emmahealth.org",
    socialLinks: {
      twitter: "https://twitter.com/dremma",
      linkedin: "https://linkedin.com/in/emmawilliams"
    },
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2024-01-15"),
    totalRaised: 450000,
    projectsCreated: 3,
    projectsSupported: 12,
    trustScore: 95,
    impactScore: 88
  },
  {
    id: "user2",
    email: "john.smith@example.com",
    firstName: "John",
    lastName: "Smith",
    name: "John Smith",
    displayName: "John Smith",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    role: "donor",
    accountStatus: "active",
    verificationStatus: "verified",
    isVerified: true,
    bio: "Passionate supporter of education and technology initiatives. Believe in the power of community-driven change.",
    location: "New York, NY",
    createdAt: new Date("2023-03-20"),
    updatedAt: new Date("2024-01-10"),
    totalDonated: 15000,
    projectsSupported: 25,
    trustScore: 82,
    impactScore: 76
  }
];

export const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchUser = async () => {
      setLoading(true);
      try {
        // In real app, this would be an API call
        const foundUser = mockUsers.find(u => u.id === userId);
        setUser(foundUser || null);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">User Not Found</h1>
          <p className="text-muted-foreground">
            The user profile you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Check if this is the current user's own profile
  // In real app, this would check against authenticated user
  const isOwnProfile = false;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* User Profile Component */}
        <UserProfileComponent
          user={user}
          projects={mockProjects}
          isOwnProfile={isOwnProfile}
        />
      </div>
    </div>
  );
};