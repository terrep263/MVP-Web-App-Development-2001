import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiRefreshCw, FiCopy, FiCheck, FiHeart, FiSmile, FiZap, FiTarget } = FiIcons;

const InteractiveLesson = ({ content, lessonId, onComplete }) => {
  const [generatedLines, setGeneratedLines] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('humor');
  const [userInput, setUserInput] = useState('');
  const [practiceCount, setPracticeCount] = useState(0);

  const generateOpeningLines = () => {
    if (lessonId === 'opening-lines') {
      const templates = content.generator.templates[selectedCategory] || [];
      const interests = ['hiking', 'cooking', 'travel', 'photography', 'music'];
      const activities = ['skydiving', 'surfing', 'rock climbing', 'painting'];
      
      const lines = templates.map(template => {
        return template
          .replace('{interest}', interests[Math.floor(Math.random() * interests.length)])
          .replace('{activity}', activities[Math.floor(Math.random() * activities.length)])
          .replace('{topic}', 'sustainable living');
      });
      
      setGeneratedLines(lines);
      setPracticeCount(prev => prev + 1);
    }
  };

  const renderOpeningLineGenerator = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Opening Line Generator
        </h3>
        <p className="text-gray-600">
          Generate personalized opening lines based on different conversation styles
        </p>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {content.generator.categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category.toLowerCase())}
            className={`p-4 rounded-lg border-2 text-center transition-all ${
              selectedCategory === category.toLowerCase()
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <SafeIcon 
              icon={
                category === 'Humor' ? FiSmile :
                category === 'Thoughtful' ? FiHeart :
                category === 'Playful' ? FiZap :
                FiTarget
              } 
              className="h-6 w-6 mx-auto mb-2 text-blue-600" 
            />
            <span className="text-sm font-medium">{category}</span>
          </button>
        ))}
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <button
          onClick={generateOpeningLines}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <SafeIcon icon={FiRefreshCw} className="h-5 w-5" />
          <span>Generate Lines</span>
        </button>
      </div>

      {/* Generated Lines */}
      {generatedLines.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h4 className="font-medium text-gray-900">Generated Opening Lines:</h4>
          {generatedLines.map((line, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <span className="text-gray-800">{line}</span>
              <button
                onClick={() => navigator.clipboard.writeText(line)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Copy to clipboard"
              >
                <SafeIcon icon={FiCopy} className="h-4 w-4" />
              </button>
            </div>
          ))}
        </motion.div>
      )}

      {/* Practice Counter */}
      {practiceCount > 0 && (
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiCheck} className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">
              Great! You've generated {practiceCount} sets of opening lines.
            </span>
          </div>
          {practiceCount >= 3 && (
            <p className="text-green-700 text-sm mt-2">
              Excellent practice! You're ready to move on to the next lesson.
            </p>
          )}
        </div>
      )}
    </div>
  );

  const renderAnxietyExercises = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Confidence Building Exercises
        </h3>
        <p className="text-gray-600">
          Practice these exercises daily to build unshakeable dating confidence
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exercise 1: Power Posing */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3">💪 Power Posing</h4>
          <p className="text-blue-800 text-sm mb-4">
            Stand in a confident pose for 2 minutes before any dating interaction.
          </p>
          <div className="space-y-2 text-blue-700 text-sm">
            <div>• Stand tall with feet shoulder-width apart</div>
            <div>• Place hands on hips or raise them above head</div>
            <div>• Breathe deeply and visualize success</div>
          </div>
        </div>

        {/* Exercise 2: Positive Affirmations */}
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <h4 className="font-semibold text-green-900 mb-3">🌟 Daily Affirmations</h4>
          <p className="text-green-800 text-sm mb-4">
            Repeat these affirmations every morning to build self-confidence.
          </p>
          <div className="space-y-2 text-green-700 text-sm">
            <div>• "I am worthy of love and connection"</div>
            <div>• "I bring unique value to relationships"</div>
            <div>• "Rejection is redirection to better matches"</div>
          </div>
        </div>

        {/* Exercise 3: Comfort Zone Expansion */}
        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-3">🚀 Comfort Zone Challenge</h4>
          <p className="text-purple-800 text-sm mb-4">
            Gradually expand your comfort zone with small daily challenges.
          </p>
          <div className="space-y-2 text-purple-700 text-sm">
            <div>• Make eye contact with 3 strangers today</div>
            <div>• Start one conversation with a new person</div>
            <div>• Give someone a genuine compliment</div>
          </div>
        </div>

        {/* Exercise 4: Visualization */}
        <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
          <h4 className="font-semibold text-yellow-900 mb-3">🎯 Success Visualization</h4>
          <p className="text-yellow-800 text-sm mb-4">
            Spend 5 minutes visualizing successful dating interactions.
          </p>
          <div className="space-y-2 text-yellow-700 text-sm">
            <div>• Imagine confident, natural conversations</div>
            <div>• Visualize positive responses to your messages</div>
            <div>• See yourself enjoying great dates</div>
          </div>
        </div>
      </div>

      {/* Practice Tracker */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4">Track Your Progress</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Power Posing', 'Affirmations', 'Comfort Zone', 'Visualization'].map((exercise, index) => (
            <div key={exercise} className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-gray-600 font-medium">{index + 1}</span>
              </div>
              <div className="text-sm text-gray-700">{exercise}</div>
              <button className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors">
                Done Today
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (lessonId) {
      case 'opening-lines':
        return renderOpeningLineGenerator();
      case 'confidence-building':
        return renderAnxietyExercises();
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">Interactive content for this lesson is coming soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="p-8">
      {renderContent()}
      
      {/* Complete Button */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={() => onComplete()}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          disabled={lessonId === 'opening-lines' && practiceCount < 2}
        >
          {lessonId === 'opening-lines' && practiceCount < 2 
            ? `Generate ${2 - practiceCount} more sets to continue` 
            : 'Mark as Complete'
          }
        </button>
      </div>
    </div>
  );
};

export default InteractiveLesson;