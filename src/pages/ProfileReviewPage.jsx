import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfileReview } from '../contexts/ProfileReviewContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import UploadSection from '../components/profile-review/UploadSection';
import AnalysisResults from '../components/profile-review/AnalysisResults';
import ReviewHistory from '../components/profile-review/ReviewHistory';
import SubscriptionGate from '../components/subscription/SubscriptionGate';
import UsageIndicator from '../components/subscription/UsageIndicator';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiCamera, FiFileText, FiTrendingUp, FiRefreshCw } = FiIcons;

const ProfileReviewPage = () => {
  const { currentReview, isAnalyzing, analyzeProfile, reviews } = useProfileReview();
  const { canUseFeature, trackUsage } = useSubscription();
  const [activeTab, setActiveTab] = useState('upload');

  const tabs = [
    { id: 'upload', label: 'Upload Profile', icon: FiCamera },
    { id: 'results', label: 'Analysis Results', icon: FiTrendingUp },
    { id: 'history', label: 'Review History', icon: FiFileText }
  ];

  const handleAnalysisComplete = (review) => {
    setActiveTab('results');
    toast.success(`Profile analyzed! Overall score: ${review.overallScore}/10`);
  };

  const handleReanalyze = () => {
    setActiveTab('upload');
    toast.info('Upload your updated profile for re-analysis');
  };

  const wrappedAnalyzeProfile = async (profileData) => {
    trackUsage('profileReviews');
    return analyzeProfile(profileData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiCamera} className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Profile Review
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Upload your dating app screenshots and get instant AI-powered feedback 
            on your photos and bio. Improve your profile score and get more matches!
          </p>

          {/* Usage Indicator */}
          <div className="max-w-md mx-auto mb-6">
            <UsageIndicator feature="profileReview" />
          </div>

          {currentReview && (
            <div className="inline-flex items-center space-x-4 bg-white rounded-lg px-6 py-3 shadow-sm border border-gray-200">
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  currentReview.overallScore >= 8 ? 'text-green-600' : 
                  currentReview.overallScore >= 6 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {currentReview.overallScore}/10
                </div>
                <div className="text-sm text-gray-600">Current Score</div>
              </div>
              <button
                onClick={handleReanalyze}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all text-sm"
              >
                <SafeIcon icon={FiRefreshCw} className="h-4 w-4" />
                <span>Re-analyze</span>
              </button>
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                disabled={tab.id === 'results' && !currentReview && !isAnalyzing}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <SafeIcon icon={tab.icon} className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'upload' && (
              <SubscriptionGate 
                feature="profileReview"
                title="Profile Review"
                description="Get AI-powered feedback on your dating profile"
              >
                <UploadSection 
                  onAnalysisComplete={handleAnalysisComplete} 
                  isAnalyzing={isAnalyzing}
                  analyzeProfile={wrappedAnalyzeProfile}
                />
              </SubscriptionGate>
            )}

            {activeTab === 'results' && (
              <AnalysisResults 
                review={currentReview} 
                isAnalyzing={isAnalyzing} 
                onReanalyze={handleReanalyze} 
              />
            )}

            {activeTab === 'history' && (
              <ReviewHistory reviews={reviews} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileReviewPage;