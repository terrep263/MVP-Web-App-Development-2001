import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Production admin emails - update these with your actual admin emails
const ADMIN_USERS = [
  'admin@sparkcoach.com',
  'greta@questlabs.ai',
  'support@sparkcoach.com'
];

const getDefaultRole = (email) => {
  if (ADMIN_USERS.includes(email.toLowerCase())) {
    return 'admin';
  }
  
  if (email.endsWith('@sparkcoach.com') || email.endsWith('@questlabs.ai')) {
    return 'manager';
  }
  
  return 'viewer';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email.split('@')[0],
          avatar: session.user.user_metadata?.avatar_url || 
                 `https://ui-avatars.com/api/?name=${session.user.email.split('@')[0]}&background=ec4899&color=fff`,
          role: getDefaultRole(session.user.email),
          hasCompletedOnboarding: session.user.user_metadata?.onboarding_complete || false,
          subscription: session.user.user_metadata?.subscription || 'freemium',
          joinedAt: session.user.created_at,
          permissions: getRolePermissions(getDefaultRole(session.user.email))
        };
        setUser(userData);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email.split('@')[0],
          avatar: session.user.user_metadata?.avatar_url || 
                 `https://ui-avatars.com/api/?name=${session.user.email.split('@')[0]}&background=ec4899&color=fff`,
          role: getDefaultRole(session.user.email),
          hasCompletedOnboarding: session.user.user_metadata?.onboarding_complete || false,
          subscription: session.user.user_metadata?.subscription || 'freemium',
          joinedAt: session.user.created_at,
          permissions: getRolePermissions(getDefaultRole(session.user.email))
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data.user;
  };

  const register = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          onboarding_complete: false,
          subscription: 'freemium'
        }
      }
    });

    if (error) {
      throw error;
    }

    return data.user;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    setUser(null);
  };

  const completeOnboarding = async (onboardingData) => {
    const { error } = await supabase.auth.updateUser({
      data: {
        onboarding_complete: true,
        persona: onboardingData.persona,
        goals: onboardingData.goals
      }
    });

    if (error) {
      throw error;
    }

    setUser(prev => ({
      ...prev,
      hasCompletedOnboarding: true,
      onboardingData
    }));
  };

  const updateSubscription = async (newPlan) => {
    const { error } = await supabase.auth.updateUser({
      data: {
        subscription: newPlan
      }
    });

    if (error) {
      throw error;
    }

    setUser(prev => ({
      ...prev,
      subscription: newPlan
    }));
  };

  const value = {
    user,
    login,
    register,
    logout,
    completeOnboarding,
    updateSubscription,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Helper function to get permissions based on role
const getRolePermissions = (role) => {
  const rolePermissions = {
    admin: [
      'manage_users',
      'manage_roles',
      'view_all_tasks',
      'edit_all_tasks',
      'delete_all_tasks',
      'view_analytics',
      'manage_system'
    ],
    manager: [
      'view_team_tasks',
      'edit_team_tasks',
      'assign_tasks',
      'view_analytics',
      'manage_team'
    ],
    editor: [
      'create_tasks',
      'edit_own_tasks',
      'delete_own_tasks',
      'view_shared_tasks',
      'comment_tasks'
    ],
    viewer: [
      'view_own_tasks',
      'comment_tasks'
    ]
  };

  return rolePermissions[role] || rolePermissions.viewer;
};