import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiStar, FiThumbsUp, FiThumbsDown, FiX, FiSend, FiHeart } = FiIcons;

const FeedbackWidget = ({ trigger, feature, onSubmit, customQuestions = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [feedback, setFeedback] = useState({
    rating: 0,
    sentiment: null,
    comment: '',
    feature,
    answers: {}
  });

  const defaultQuestions = [
    {
      id: 'ease_of_use',
      text: 'How easy was this feature to use?',
      type: 'rating',
      scale: 5
    },
    {
      id: 'helpfulness',
      text: 'How helpful was this for your dating journey?',
      type: 'rating',
      scale: 5
    },
    {
      id: 'recommendation',
      text: 'Would you recommend this to a friend?',
      type: 'sentiment'
    }
  ];

  const questions = customQuestions.length > 0 ? customQuestions : defaultQuestions;

  const handleRatingClick = (rating) => {
    setFeedback(prev => ({ ...prev, rating }));
    if (step === 1) setStep(2);
  };

  const handleSentimentClick = (sentiment) => {
    setFeedback(prev => ({ ...prev, sentiment }));
    setTimeout(() => setStep(3), 500);
  };

  const handleQuestionAnswer = (questionId, answer) => {
    setFeedback(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answer }
    }));
  };

  const handleSubmit = async () => {
    if (!feedback.rating && !feedback.sentiment) {
      toast.error('Please provide a rating or feedback');
      return;
    }

    try {
      const feedbackData = {
        ...feedback,
        timestamp: new Date().toISOString(),
        trigger
      };

      // Save to localStorage for demo
      const existingFeedback = JSON.parse(localStorage.getItem('user_feedback') || '[]');
      existingFeedback.unshift(feedbackData);
      localStorage.setItem('user_feedback', JSON.stringify(existingFeedback.slice(0, 100)));

      if (onSubmit) {
        await onSubmit(feedbackData);
      }

      toast.success('Thank you for your feedback!');
      setIsOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to submit feedback');
    }
  };

  const resetForm = () => {
    setStep(1);
    setFeedback({
      rating: 0,
      sentiment: null,
      comment: '',
      feature,
      answers: {}
    });
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        How was your experience with {feature}?
      </h3>
      <div className="flex justify-center space-x-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRatingClick(star)}
            className={`text-2xl transition-colors ${
              star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
            }`}
          >
            <SafeIcon icon={FiStar} className="h-8 w-8" />
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-600">Click a star to rate your experience</p>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Overall, how do you feel about this feature?
      </h3>
      <div className="flex justify-center space-x-6 mb-6">
        <button
          onClick={() => handleSentimentClick('positive')}
          className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
            feedback.sentiment === 'positive'
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 hover:border-green-300'
          }`}
        >
          <SafeIcon icon={FiThumbsUp} className="h-8 w-8 text-green-600 mb-2" />
          <span className="text-sm font-medium text-gray-900">Love it!</span>
        </button>
        <button
          onClick={() => handleSentimentClick('neutral')}
          className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
            feedback.sentiment === 'neutral'
              ? 'border-yellow-500 bg-yellow-50'
              : 'border-gray-200 hover:border-yellow-300'
          }`}
        >
          <SafeIcon icon={FiHeart} className="h-8 w-8 text-yellow-600 mb-2" />
          <span className="text-sm font-medium text-gray-900">It's okay</span>
        </button>
        <button
          onClick={() => handleSentimentClick('negative')}
          className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
            feedback.sentiment === 'negative'
              ? 'border-red-500 bg-red-50'
              : 'border-gray-200 hover:border-red-300'
          }`}
        >
          <SafeIcon icon={FiThumbsDown} className="h-8 w-8 text-red-600 mb-2" />
          <span className="text-sm font-medium text-gray-900">Needs work</span>
        </button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Help us improve! (Optional)
      </h3>
      
      {questions.map((question) => (
        <div key={question.id} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {question.text}
          </label>
          
          {question.type === 'rating' && (
            <div className="flex space-x-1">
              {[...Array(question.scale)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleQuestionAnswer(question.id, i + 1)}
                  className={`w-8 h-8 rounded-full border-2 transition-colors ${
                    feedback.answers[question.id] >= i + 1
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
          
          {question.type === 'sentiment' && (
            <div className="flex space-x-3">
              <button
                onClick={() => handleQuestionAnswer(question.id, 'yes')}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  feedback.answers[question.id] === 'yes'
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : 'border-gray-300 hover:border-green-300'
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => handleQuestionAnswer(question.id, 'no')}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  feedback.answers[question.id] === 'no'
                    ? 'bg-red-100 border-red-500 text-red-800'
                    : 'border-gray-300 hover:border-red-300'
                }`}
              >
                No
              </button>
            </div>
          )}
        </div>
      ))}
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Any specific feedback or suggestions?
        </label>
        <textarea
          value={feedback.comment}
          onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tell us what you think..."
        />
      </div>
      
      <button
        onClick={handleSubmit}
        className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <SafeIcon icon={FiSend} className="h-4 w-4" />
        <span>Submit Feedback</span>
      </button>
    </motion.div>
  );

  return (
    <>
      {/* Trigger Button */}
      {React.cloneElement(trigger, {
        onClick: () => setIsOpen(true)
      })}

      {/* Feedback Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={FiX} className="h-5 w-5" />
              </button>

              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}

              {/* Progress Indicator */}
              <div className="flex justify-center mt-6 space-x-2">
                {[1, 2, 3].map((stepNum) => (
                  <div
                    key={stepNum}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      stepNum <= step ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackWidget;