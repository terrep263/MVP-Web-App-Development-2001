import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiCamera, FiFileText, FiAlertCircle, FiCheckCircle, FiInfo, FiRefreshCw, FiDownload } = FiIcons;

const AnalysisResults = ({ review, isAnalyzing, onReanalyze }) => {
  const [activeSection, setActiveSection] = useState('overview');

  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-600 mx-auto mb-6"></div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Your Profile</h3>
        <p className="text-gray-600">
          Our AI is examining your photos and bio to provide personalized feedback...
        </p>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <SafeIcon icon={FiCamera} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analysis Available</h3>
        <p className="text-gray-600 mb-6">
          Upload your profile photos and bio to get started with AI analysis.
        </p>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 8) return 'bg-green-100';
    if (score >= 6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const sections = [
    { id: 'overview', label: 'Overview', icon: FiTrendingUp },
    { id: 'photos', label: 'Photo Analysis', icon: FiCamera },
    { id: 'bio', label: 'Bio Analysis', icon: FiFileText }
  ];

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className={`${getScoreBgColor(review.overallScore)} px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Profile Analysis Complete</h2>
              <p className="text-gray-700">
                Platform: {review.platform.charAt(0).toUpperCase() + review.platform.slice(1)}
              </p>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(review.overallScore)}`}>
                {review.overallScore}/10
              </div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Analyzed on {new Date(review.createdAt).toLocaleDateString()}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onReanalyze}
                className="inline-flex items-center px-4 py-2 text-pink-600 border border-pink-600 rounded-lg hover:bg-pink-50 transition-colors"
              >
                <SafeIcon icon={FiRefreshCw} className="h-4 w-4 mr-2" />
                Re-analyze
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <SafeIcon icon={FiDownload} className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeSection === section.id
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <SafeIcon icon={section.icon} className="h-5 w-5" />
              <span>{section.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Section Content */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeSection === 'overview' && (
          <OverviewSection review={review} />
        )}
        
        {activeSection === 'photos' && (
          <PhotoAnalysisSection review={review} />
        )}
        
        {activeSection === 'bio' && (
          <BioAnalysisSection review={review} />
        )}
      </motion.div>
    </div>
  );
};

const OverviewSection = ({ review }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Score Breakdown */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Breakdown</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Photos Average</span>
          <span className="font-semibold">
            {(review.photoAnalysis.reduce((sum, p) => sum + p.overallScore, 0) / review.photoAnalysis.length).toFixed(1)}/10
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Bio Quality</span>
          <span className="font-semibold">{review.bioAnalysis.overallScore}/10</span>
        </div>
        <div className="border-t pt-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">Overall Score</span>
            <span className="text-xl font-bold text-pink-600">{review.overallScore}/10</span>
          </div>
        </div>
      </div>
    </div>

    {/* Improvements */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Improvements</h3>
      <div className="space-y-3">
        {review.improvements.slice(0, 3).map((improvement, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
              improvement.priority === 'high' ? 'bg-red-100 text-red-600' :
              improvement.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
            }`}>
              <SafeIcon icon={improvement.priority === 'high' ? FiAlertCircle : FiInfo} className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{improvement.title}</h4>
              <p className="text-sm text-gray-600">{improvement.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PhotoAnalysisSection = ({ review }) => (
  <div className="space-y-6">
    {review.photoAnalysis.map((photo, index) => (
      <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img
              src={review.photos[index].preview}
              alt={`Photo ${index + 1}`}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="md:w-2/3 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Photo {index + 1}</h3>
              <span className={`text-xl font-bold ${
                photo.overallScore >= 8 ? 'text-green-600' :
                photo.overallScore >= 6 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {photo.overallScore}/10
              </span>
            </div>
            
            {/* Score Details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {Object.entries(photo.scores).map(([metric, score]) => (
                <div key={metric} className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="capitalize text-gray-600">
                      {metric.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="font-medium">{Math.round(score)}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Feedback */}
            {photo.feedback.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Feedback:</h4>
                {photo.feedback.map((feedback, fidx) => (
                  <div key={fidx} className={`p-3 rounded-lg ${
                    feedback.type === 'warning' ? 'bg-red-50 border border-red-200' :
                    feedback.type === 'info' ? 'bg-blue-50 border border-blue-200' :
                    'bg-green-50 border border-green-200'
                  }`}>
                    <p className="text-sm text-gray-800">{feedback.message}</p>
                    <p className="text-xs text-gray-600 mt-1">{feedback.suggestion}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const BioAnalysisSection = ({ review }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900">Bio Analysis</h3>
      <span className={`text-xl font-bold ${
        review.bioAnalysis.overallScore >= 8 ? 'text-green-600' :
        review.bioAnalysis.overallScore >= 6 ? 'text-yellow-600' : 'text-red-600'
      }`}>
        {review.bioAnalysis.overallScore}/10
      </span>
    </div>

    {/* Bio Text */}
    <div className="mb-6">
      <h4 className="font-medium text-gray-900 mb-2">Your Bio:</h4>
      <div className="bg-gray-50 rounded-lg p-4 border">
        <p className="text-gray-800">{review.bio}</p>
      </div>
      <div className="text-sm text-gray-600 mt-2">
        {review.bioAnalysis.wordCount} words, {review.bioAnalysis.sentenceCount} sentences
      </div>
    </div>

    {/* Score Breakdown */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Score Breakdown</h4>
        <div className="space-y-3">
          {Object.entries(review.bioAnalysis.scores).map(([metric, score]) => (
            <div key={metric} className="text-sm">
              <div className="flex justify-between mb-1">
                <span className="capitalize text-gray-600">
                  {metric.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="font-medium">{Math.round(score)}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
        <div className="space-y-2">
          {review.bioAnalysis.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start space-x-2">
              <SafeIcon icon={FiCheckCircle} className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Feedback */}
    {review.bioAnalysis.feedback.length > 0 && (
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Detailed Feedback</h4>
        <div className="space-y-3">
          {review.bioAnalysis.feedback.map((feedback, index) => (
            <div key={index} className={`p-4 rounded-lg ${
              feedback.type === 'warning' ? 'bg-red-50 border border-red-200' :
              feedback.type === 'info' ? 'bg-blue-50 border border-blue-200' :
              'bg-green-50 border border-green-200'
            }`}>
              <p className="font-medium text-gray-900">{feedback.message}</p>
              <p className="text-sm text-gray-600 mt-1">{feedback.suggestion}</p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default AnalysisResults;