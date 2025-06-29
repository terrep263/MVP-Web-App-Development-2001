// Production configuration
export const productionConfig = {
  // Remove demo mode flags
  isDemoMode: false,
  
  // API endpoints
  apiUrl: import.meta.env.VITE_API_URL || 'https://api.sparkcoach.com',
  
  // Supabase
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
  },
  
  // Stripe
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  },
  
  // Email
  email: {
    apiKey: import.meta.env.VITE_EMAIL_API_KEY,
    fromEmail: import.meta.env.VITE_EMAIL_FROM
  },
  
  // Analytics
  analytics: {
    googleAnalytics: import.meta.env.VITE_GA_TRACKING_ID,
    hotjar: import.meta.env.VITE_HOTJAR_ID
  },
  
  // Security
  security: {
    enableRateLimiting: true,
    maxLoginAttempts: 5,
    sessionTimeout: 24 * 60 * 60 * 1000 // 24 hours
  }
};