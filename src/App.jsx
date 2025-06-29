import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QuestProvider } from '@questlabs/react-sdk';
import '@questlabs/react-sdk/dist/style.css';

import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { CoachProvider } from './contexts/CoachContext';
import { ProfileReviewProvider } from './contexts/ProfileReviewContext';
import { ConversationProvider } from './contexts/ConversationContext';
import { AcademyProvider } from './contexts/AcademyContext';
import { AnalyticsProvider } from './contexts/AnalyticsContext';
import { RoleProvider } from './contexts/RoleContext';
import { ReferralProvider } from './contexts/ReferralContext';
import { ProgressEmailProvider } from './contexts/ProgressEmailContext';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import ProfileReviewPage from './pages/ProfileReviewPage';
import ConversationSimulatorPage from './pages/ConversationSimulatorPage';
import AcademyPage from './pages/AcademyPage';
import BillingPage from './pages/BillingPage';
import AdminDashboard from './pages/AdminDashboard';
import UserManagementPage from './pages/UserManagementPage';
import ReferralPage from './pages/ReferralPage';
import SuccessStoriesPage from './pages/SuccessStoriesPage';
import ProtectedRoute from './components/ProtectedRoute';
import HelpHub from './components/help/HelpHub';
import questConfig from './config/questConfig';

function App() {
  return (
    <QuestProvider
      apiKey={questConfig.APIKEY}
      entityId={questConfig.ENTITYID}
      apiType="PRODUCTION"
    >
      <AuthProvider>
        <RoleProvider>
          <SubscriptionProvider>
            <AnalyticsProvider>
              <ReferralProvider>
                <ProgressEmailProvider>
                  <CoachProvider>
                    <ProfileReviewProvider>
                      <ConversationProvider>
                        <AcademyProvider>
                          <Router>
                            <div className="min-h-screen bg-gray-50">
                              <Navbar />
                              <main>
                                <Routes>
                                  <Route path="/" element={<HomePage />} />
                                  <Route path="/login" element={<LoginPage />} />
                                  <Route path="/register" element={<RegisterPage />} />
                                  <Route path="/onboarding" element={<OnboardingPage />} />
                                  <Route path="/success-stories" element={<SuccessStoriesPage />} />
                                  <Route
                                    path="/dashboard"
                                    element={
                                      <ProtectedRoute>
                                        <Dashboard />
                                      </ProtectedRoute>
                                    }
                                  />
                                  <Route
                                    path="/profile"
                                    element={
                                      <ProtectedRoute>
                                        <ProfilePage />
                                      </ProtectedRoute>
                                    }
                                  />
                                  <Route
                                    path="/billing"
                                    element={
                                      <ProtectedRoute>
                                        <BillingPage />
                                      </ProtectedRoute>
                                    }
                                  />
                                  <Route
                                    path="/referral"
                                    element={
                                      <ProtectedRoute>
                                        <ReferralPage />
                                      </ProtectedRoute>
                                    }
                                  />
                                  <Route
                                    path="/profile-review"
                                    element={
                                      <ProtectedRoute>
                                        <ProfileReviewPage />
                                      </ProtectedRoute>
                                    }
                                  />
                                  <Route
                                    path="/conversation-simulator"
                                    element={
                                      <ProtectedRoute>
                                        <ConversationSimulatorPage />
                                      </ProtectedRoute>
                                    }
                                  />
                                  <Route
                                    path="/academy"
                                    element={
                                      <ProtectedRoute>
                                        <AcademyPage />
                                      </ProtectedRoute>
                                    }
                                  />
                                  <Route
                                    path="/admin"
                                    element={
                                      <ProtectedRoute>
                                        <AdminDashboard />
                                      </ProtectedRoute>
                                    }
                                  />
                                  <Route
                                    path="/users"
                                    element={
                                      <ProtectedRoute>
                                        <UserManagementPage />
                                      </ProtectedRoute>
                                    }
                                  />
                                </Routes>
                              </main>
                              <HelpHub />
                              <Toaster
                                position="top-right"
                                toastOptions={{
                                  duration: 3000,
                                  style: {
                                    background: '#363636',
                                    color: '#fff',
                                  },
                                }}
                              />
                            </div>
                          </Router>
                        </AcademyProvider>
                      </ConversationProvider>
                    </ProfileReviewProvider>
                  </CoachProvider>
                </ProgressEmailProvider>
              </ReferralProvider>
            </AnalyticsProvider>
          </SubscriptionProvider>
        </RoleProvider>
      </AuthProvider>
    </QuestProvider>
  );
}

export default App;