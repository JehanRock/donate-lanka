import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string;
  role?: 'user' | 'admin' | 'organization';
  accountType?: 'personal' | 'organization';
  organizationName?: string;
  organizationType?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, username: string, accountType?: 'personal' | 'organization', organizationName?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    return profile;
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Defer profile fetching to avoid deadlock - use setTimeout(0)
          setTimeout(async () => {
            const profile = await fetchUserProfile(session.user.id);
            
            if (profile) {
              const userData: User = {
                id: session.user.id,
                email: session.user.email || '',
                username: profile.username || '',
                name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
                avatar: profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.first_name}`,
                role: profile.role as 'user' | 'admin' | 'organization',
                accountType: profile.account_type as 'personal' | 'organization',
                organizationName: profile.organization_name,
                organizationType: profile.organization_type
              };
              setUser(userData);
            }
          }, 0);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Auth state change handler will process this session
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (usernameOrEmail: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Determine if input is email or username
      const isEmail = usernameOrEmail.includes('@');
      let email = usernameOrEmail;
      
      // If username provided, look up email from profiles table
      if (!isEmail) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', usernameOrEmail)
          .single();
        
        if (!profile?.email) {
          throw new Error('User not found');
        }
        email = profile.email;
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      // Auth state change handler will update user state
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.message || 'Login failed');
    }
  };

  const signup = async (email: string, password: string, name: string, username: string, accountType: 'personal' | 'organization' = 'personal', organizationName?: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const nameParts = name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: firstName,
            last_name: lastName,
            username,
            role: accountType === 'organization' ? 'organization' : 'user',
            account_type: accountType,
            organization_name: organizationName,
            organization_type: accountType === 'organization' ? 'Company' : undefined
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Auth state change handler will update user state
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.message || 'Signup failed');
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    // Auth state change handler will update user state
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};