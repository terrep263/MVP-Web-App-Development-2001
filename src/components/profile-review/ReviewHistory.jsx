import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProfileReview } from '../../contexts/ProfileReviewContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiTrendingUp, FiEye, FiTrash2, FiFilter } = FiIcons;

const ReviewHistory = ({ reviews }) => {
  const { deleteReview, setCurrentReview } = useProfileReview();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredAndSortedReviews = reviews
    .filter(review => {
      if (filter === 'all') return true;
      if (filter === 'high') return review.overallScore >= 8;
      if (filter === 'medium') return review.overallScore >= 6 && review.overallScore < 8;
      if (filter === 'low') return review.overallScore < 6;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'highest') return b.overallScore - a.overallScore;
      if (sortBy === 'lowest') return a.overallScore - b.overallScore;
      return 0;
    });

  const handleViewReview = (review) => {
    setCurrentReview(review);
    // You might want to navigate to the results tab here
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview(reviewId);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <SafeIcon icon={FiCalendar} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
        <p className="text-gray-600">
          Your profile analysis history will appear here once you start reviewing profiles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Sorting */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <SafeIcon icon={FiFilter} className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="all">All Scores</option>
              <option value="high">High (8-10)</option>
              <option value="medium">Medium (6-7)</option>
              <option value="low">Low (0-5)</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Score</option>
              <option value="lowest">Lowest Score</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {review.platform}
                </span>
                <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getScoreColor(review.overallScore)}`}>
                  {review.overallScore}/10
                </span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <SafeIcon icon={FiCalendar} className="h-3 w-3 mr-1" />
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Photo Preview */}
            <div className="relative">
              <div className="grid grid-cols-3 gap-1 p-2">
                {review.photos.slice(0, 3).map((photo, photoIndex) => (
                  <div key={photoIndex} className="aspect-w-1 aspect-h-1">
                    <img
                      src={photo.preview}
                      alt={`Photo ${photoIndex + 1}`}
                      className="w-full h-16 object-cover rounded"
                    />
                  </div>
                ))}
              </div>
              {review.photos.length > 3 && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  +{review.photos.length - 3} more
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 text-center text-sm mb-4">
                <div>
                  <div className="font-semibold text-gray-900">
                    {(review.photoAnalysis.reduce((sum, p) => sum + p.overallScore, 0) / review.photoAnalysis.length).toFixed(1)}
                  </div>
                  <div className="text-gray-600">Photos</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{review.bioAnalysis.overallScore}</div>
                  <div className="text-gray-600">Bio</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewReview(review)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm rounded-md hover:from-pink-700 hover:to-purple-700 transition-all"
                >
                  <SafeIcon icon={FiEye} className="h-4 w-4 mr-1" />
                  View
                </button>
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="px-3 py-2 text-red-600 border border-red-600 text-sm rounded-md hover:bg-red-50 transition-colors"
                >
                  <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      {reviews.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">{reviews.length}</div>
              <div className="text-sm text-gray-600">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {(reviews.reduce((sum, r) => sum + r.overallScore, 0) / reviews.length).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.max(...reviews.map(r => r.overallScore))}
              </div>
              <div className="text-sm text-gray-600">Best Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {reviews.filter(r => r.overallScore >= 8).length}
              </div>
              <div className="text-sm text-gray-600">High Scores</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewHistory;