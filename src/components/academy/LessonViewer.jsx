import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAcademy } from '../../contexts/AcademyContext';
import VideoPlayer from './VideoPlayer';
import QuizComponent from './QuizComponent';
import InteractiveLesson from './InteractiveLesson';
import WorksheetDownload from './WorksheetDownload';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiCheck, FiDownload, FiPlay } = FiIcons;

const LessonViewer = () => {
  const { 
    currentModule, 
    currentLesson, 
    setCurrentLesson, 
    setCurrentModule,
    lessonContent,
    completeLesson 
  } = useAcademy();
  
  const [lessonCompleted, setLessonCompleted] = useState(false);

  if (!currentModule || !currentLesson) return null;

  const lesson = currentModule.lessons.find(l => l.id === currentLesson);
  const content = lessonContent[currentLesson];

  const handleLessonComplete = (score = null) => {
    completeLesson(currentModule.id, currentLesson, score);
    setLessonCompleted(true);
  };

  const handleBackToModule = () => {
    setCurrentLesson(null);
    setCurrentModule(null);
  };

  const renderLessonContent = () => {
    if (!content) return <div>Content not available</div>;

    switch (content.type) {
      case 'video':
        return (
          <VideoPlayer 
            videoUrl={content.videoUrl}
            transcript={content.transcript}
            keyPoints={content.keyPoints}
            onComplete={handleLessonComplete}
          />
        );
      case 'quiz':
        return (
          <QuizComponent 
            questions={content.questions}
            onComplete={handleLessonComplete}
          />
        );
      case 'interactive':
        return (
          <InteractiveLesson 
            content={content}
            lessonId={currentLesson}
            onComplete={handleLessonComplete}
          />
        );
      case 'worksheet':
        return (
          <WorksheetDownload 
            content={content}
            lessonTitle={lesson.title}
            onComplete={handleLessonComplete}
          />
        );
      default:
        return <div>Unknown lesson type</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <button
          onClick={handleBackToModule}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <SafeIcon icon={FiArrowLeft} className="h-5 w-5" />
          <span>Back to {currentModule.title}</span>
        </button>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {lesson.title}
              </h1>
              <p className="text-gray-600 mb-4">{lesson.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Duration: {lesson.duration}</span>
                <span className="capitalize">Type: {content?.type || 'Unknown'}</span>
              </div>
            </div>
            {lessonCompleted && (
              <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg">
                <SafeIcon icon={FiCheck} className="h-5 w-5" />
                <span className="font-medium">Completed</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Lesson Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        {renderLessonContent()}
      </motion.div>

      {/* Next Steps */}
      {lessonCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-green-50 rounded-lg p-6 border border-green-200"
        >
          <h3 className="font-semibold text-green-900 mb-3">🎉 Lesson Complete!</h3>
          <p className="text-green-800 mb-4">
            Great job completing "{lesson.title}". Ready for the next challenge?
          </p>
          <div className="flex space-x-3">
            <button
              onClick={handleBackToModule}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue Module
            </button>
            <button className="px-4 py-2 bg-white text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors">
              Review Lesson
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LessonViewer;