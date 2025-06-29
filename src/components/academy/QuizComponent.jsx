import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck, FiX, FiArrowRight, FiArrowLeft, FiTarget } = FiIcons;

const QuizComponent = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
    const maxScore = questions.length * 4; // Assuming 4 is max score per question
    const percentage = Math.round((totalScore / maxScore) * 100);
    setScore(percentage);
    setShowResults(true);
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return {
      title: "Excellent Confidence Level! 🌟",
      message: "You have a strong foundation of dating confidence. Keep building on these strengths!",
      color: "text-green-600"
    };
    if (score >= 60) return {
      title: "Good Confidence Building 💪",
      message: "You're on the right track! Focus on the specific areas we've identified for improvement.",
      color: "text-blue-600"
    };
    return {
      title: "Room for Growth 🌱",
      message: "Don't worry - everyone starts somewhere! Our modules will help build your confidence step by step.",
      color: "text-purple-600"
    };
  };

  if (showResults) {
    const result = getScoreMessage(score);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 text-center"
      >
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <SafeIcon icon={FiTarget} className="h-10 w-10 text-blue-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Assessment Complete!</h2>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="text-4xl font-bold text-blue-600 mb-2">{score}%</div>
          <div className="text-lg text-gray-700">Confidence Score</div>
        </div>
        
        <div className="mb-6">
          <h3 className={`text-xl font-semibold mb-2 ${result.color}`}>
            {result.title}
          </h3>
          <p className="text-gray-600">{result.message}</p>
        </div>
        
        {/* Personalized Recommendations */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left">
          <h4 className="font-semibold text-blue-900 mb-3">📋 Your Personalized Action Plan</h4>
          <ul className="space-y-2 text-blue-800 text-sm">
            {score < 60 && (
              <>
                <li>• Start with daily confidence-building exercises</li>
                <li>• Practice positive self-talk and affirmations</li>
                <li>• Focus on building a strong foundation before dating</li>
              </>
            )}
            {score >= 60 && score < 80 && (
              <>
                <li>• Continue building on your existing confidence</li>
                <li>• Practice conversation skills with our simulator</li>
                <li>• Work on optimizing your dating profile</li>
              </>
            )}
            {score >= 80 && (
              <>
                <li>• You're ready for advanced dating strategies</li>
                <li>• Focus on perfecting your conversation skills</li>
                <li>• Help others by sharing your confidence journey</li>
              </>
            )}
          </ul>
        </div>
        
        <button
          onClick={() => onComplete(score)}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Continue to Next Lesson
        </button>
      </motion.div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {question.question}
          </h2>
          
          <div className="space-y-3 mb-8">
            {question.options.map((option) => (
              <label
                key={option.value}
                className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  answers[question.id] === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.value}
                  onChange={() => handleAnswer(question.id, option.value)}
                  className="sr-only"
                />
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">{option.text}</span>
                  {answers[question.id] === option.value && (
                    <SafeIcon icon={FiCheck} className="h-5 w-5 text-blue-600" />
                  )}
                </div>
              </label>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <SafeIcon icon={FiArrowLeft} className="h-4 w-4" />
          <span>Previous</span>
        </button>
        
        <button
          onClick={handleNext}
          disabled={!answers[question.id]}
          className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span>{currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}</span>
          <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default QuizComponent;