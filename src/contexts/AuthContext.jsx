import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('spark_coach_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const userData = {
            id: Date.now(),
            email,
            name: email.split('@')[0],
            avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=ec4899&color=fff`,
            hasCompletedOnboarding: false,
            subscription: 'free',
            joinedAt: new Date().toISOString()
          };
          setUser(userData);
          localStorage.setItem('spark_coach_user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const register = async (email, password, name) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password && name) {
          const userData = {
            id: Date.now(),
            email,
            name,
            avatar: `https://ui-avatars.com/api/?name=${name}&background=ec4899&color=fff`,
            hasCompletedOnboarding: false,
            subscription: 'free',
            joinedAt: new Date().toISOString()
          };
          setUser(userData);
          localStorage.setItem('spark_coach_user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('All fields are required'));
        }
      }, 1000);
    });
  };

  const socialLogin = async (provider) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userData = {
          id: Date.now(),
          email: `user@${provider}.com`,
          name: `${provider} User`,
          avatar: `https://ui-avatars.com/api/?name=${provider}+User&background=ec4899&color=fff`,
          hasCompletedOnboarding: false,
          subscription: 'free',
          joinedAt: new Date().toISOString(),
          provider
        };
        setUser(userData);
        localStorage.setItem('spark_coach_user', JSON.stringify(userData));
        resolve(userData);
      }, 1000);
    });
  };

  const completeOnboarding = (onboardingData) => {
    const updatedUser = {
      ...user,
      hasCompletedOnboarding: true,
      onboardingData
    };
    setUser(updatedUser);
    localStorage.setItem('spark_coach_user', JSON.stringify(updatedUser));
  };

  const updateSubscription = (newPlan) => {
    const updatedUser = {
      ...user,
      subscription: newPlan
    };
    setUser(updatedUser);
    localStorage.setItem('spark_coach_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('spark_coach_user');
  };

  const value = {
    user,
    login,
    register,
    socialLogin,
    completeOnboarding,
    updateSubscription,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};