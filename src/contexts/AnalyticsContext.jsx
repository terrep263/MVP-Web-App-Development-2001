import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AnalyticsContext = createContext();

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider = ({ children }) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    userMetrics: {
      dau: 0,
      mau: 0,
      totalUsers: 0,
      activeUsers: 0,
      newUsers: 0
    },
    sessionMetrics: {
      averageSessionLength: 0,
      totalSessions: 0,
      bounceRate: 0,
      pagesPerSession: 0
    },
    featureAdoption: {
      profileReview: 0,
      conversationSimulator: 0,
      academy: 0,
      messageAssistant: 0
    },
    conversionMetrics: {
      freemiumToStandard: 0,
      freemiumToPremium: 0,
      standardToPremium: 0,
      trialConversion: 0
    },
    churnRisk: [],
    userFeedback: [],
    kpiData: {
      datesPerMonth: [],
      confidenceScores: [],
      revenue: []
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
    }
  }, [user]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call to fetch analytics data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockData = generateMockAnalytics();
      setAnalytics(mockData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockAnalytics = () => {
    const now = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    // Generate user metrics
    const totalUsers = 12847;
    const activeUsers = Math.floor(totalUsers * 0.68);
    const dau = Math.floor(activeUsers * 0.23);
    const mau = Math.floor(activeUsers * 0.85);

    // Generate session data
    const sessionData = last30Days.map(date => ({
      date: date.toISOString().split('T')[0],
      sessions: Math.floor(Math.random() * 500) + 200,
      avgLength: Math.floor(Math.random() * 15) + 8, // 8-23 minutes
      bounceRate: Math.random() * 0.3 + 0.1 // 10-40%
    }));

    // Generate feature adoption data
    const featureAdoption = {
      profileReview: Math.floor(totalUsers * 0.78),
      conversationSimulator: Math.floor(totalUsers * 0.45),
      academy: Math.floor(totalUsers * 0.62),
      messageAssistant: Math.floor(totalUsers * 0.23)
    };

    // Generate conversion data
    const conversionMetrics = {
      freemiumToStandard: 12.4, // percentage
      freemiumToPremium: 6.8,
      standardToPremium: 18.2,
      trialConversion: 67.3
    };

    // Generate churn risk users
    const churnRisk = [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        riskScore: 85,
        lastActive: '2024-01-10',
        subscription: 'standard',
        reasons: ['Low feature usage', 'No recent logins'],
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=ef4444&color=fff'
      },
      {
        id: 2,
        name: 'Mike Chen',
        email: 'mike.chen@email.com',
        riskScore: 72,
        lastActive: '2024-01-08',
        subscription: 'premium',
        reasons: ['Declined usage', 'Support tickets'],
        avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=f59e0b&color=fff'
      },
      {
        id: 3,
        name: 'Emma Davis',
        email: 'emma.davis@email.com',
        riskScore: 68,
        lastActive: '2024-01-12',
        subscription: 'standard',
        reasons: ['Subscription downgrades', 'Feature complaints'],
        avatar: 'https://ui-avatars.com/api/?name=Emma+Davis&background=8b5cf6&color=fff'
      }
    ];

    // Generate feedback data
    const userFeedback = [
      {
        id: 1,
        user: 'Alex Thompson',
        rating: 5,
        comment: 'The conversation simulator is amazing! Really helped me build confidence.',
        feature: 'Conversation Simulator',
        date: '2024-01-15',
        sentiment: 'positive'
      },
      {
        id: 2,
        user: 'Lisa Park',
        rating: 4,
        comment: 'Profile review was helpful but could use more detailed suggestions.',
        feature: 'Profile Review',
        date: '2024-01-14',
        sentiment: 'positive'
      },
      {
        id: 3,
        user: 'James Wilson',
        rating: 2,
        comment: 'Academy modules are too basic. Need more advanced content.',
        feature: 'Academy',
        date: '2024-01-13',
        sentiment: 'negative'
      },
      {
        id: 4,
        user: 'Rachel Green',
        rating: 5,
        comment: 'Absolutely love this app! Found my confidence and a great relationship.',
        feature: 'Overall',
        date: '2024-01-12',
        sentiment: 'positive'
      },
      {
        id: 5,
        user: 'David Kim',
        rating: 3,
        comment: 'Good app but premium is expensive for what you get.',
        feature: 'Pricing',
        date: '2024-01-11',
        sentiment: 'neutral'
      }
    ];

    // Generate KPI data
    const datesPerMonth = last30Days.map(date => ({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 50) + 20,
      successful: Math.floor(Math.random() * 30) + 10
    }));

    const confidenceScores = last30Days.map(date => ({
      date: date.toISOString().split('T')[0],
      avgScore: Math.floor(Math.random() * 30) + 60, // 60-90
      users: Math.floor(Math.random() * 100) + 50
    }));

    const revenue = last30Days.map(date => ({
      date: date.toISOString().split('T')[0],
      daily: Math.floor(Math.random() * 5000) + 2000,
      cumulative: 0 // Will be calculated
    }));

    // Calculate cumulative revenue
    let cumulative = 150000; // Starting revenue
    revenue.forEach(day => {
      cumulative += day.daily;
      day.cumulative = cumulative;
    });

    return {
      userMetrics: {
        dau,
        mau,
        totalUsers,
        activeUsers,
        newUsers: Math.floor(Math.random() * 100) + 50
      },
      sessionMetrics: {
        averageSessionLength: sessionData.reduce((sum, day) => sum + day.avgLength, 0) / sessionData.length,
        totalSessions: sessionData.reduce((sum, day) => sum + day.sessions, 0),
        bounceRate: sessionData.reduce((sum, day) => sum + day.bounceRate, 0) / sessionData.length,
        pagesPerSession: Math.random() * 2 + 3 // 3-5 pages per session
      },
      featureAdoption,
      conversionMetrics,
      churnRisk,
      userFeedback,
      kpiData: {
        datesPerMonth,
        confidenceScores,
        revenue,
        sessionData
      }
    };
  };

  const trackEvent = (eventName, properties = {}) => {
    // Simulate event tracking
    console.log('📊 Event tracked:', eventName, properties);
    
    // In a real app, this would send data to analytics service
    const eventData = {
      event: eventName,
      properties: {
        ...properties,
        userId: user?.id,
        timestamp: new Date().toISOString()
      }
    };
    
    // Store locally for demo
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    events.push(eventData);
    localStorage.setItem('analytics_events', JSON.stringify(events.slice(-1000))); // Keep last 1000 events
  };

  const refreshAnalytics = () => {
    loadAnalyticsData();
  };

  const value = {
    analytics,
    isLoading,
    trackEvent,
    refreshAnalytics
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};