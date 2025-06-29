import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiPause, FiVolume2, FiMaximize, FiFileText, FiList } = FiIcons;

const VideoPlayer = ({ videoUrl, transcript, keyPoints, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [watchProgress, setWatchProgress] = useState(0);
  const videoRef = useRef(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
      setWatchProgress(progress);
      
      // Auto-complete when 90% watched
      if (progress >= 90 && watchProgress < 90) {
        onComplete();
      }
    }
  };

  const handleProgressClick = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newProgress = (clickX / rect.width) * 100;
      const newTime = (newProgress / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress(newProgress);
    }
  };

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full aspect-video"
          onTimeUpdate={handleTimeUpdate}
          onLoadedData={() => setProgress(0)}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlayPause}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
            >
              <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="h-5 w-5 text-white" />
            </button>
            
            <div 
              className="flex-1 bg-white bg-opacity-20 rounded-full h-2 cursor-pointer"
              onClick={handleProgressClick}
            >
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="text-white text-sm">
              {Math.round(watchProgress)}% watched
            </div>
          </div>
        </div>

        {/* Video placeholder when no video URL */}
        {!videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center text-white">
              <SafeIcon icon={FiPlay} className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Video content coming soon!</p>
              <p className="text-sm opacity-75">For now, review the key points below</p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs for Transcript and Key Points */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setShowTranscript(false)}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              !showTranscript
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiList} className="h-4 w-4" />
              <span>Key Points</span>
            </div>
          </button>
          <button
            onClick={() => setShowTranscript(true)}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              showTranscript
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiFileText} className="h-4 w-4" />
              <span>Transcript</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {!showTranscript ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Takeaways</h3>
            {keyPoints ? (
              <ul className="space-y-3">
                {keyPoints.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{point}</span>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 italic">
                Key points will be available when the video content is added.
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Transcript</h3>
            <div className="prose max-w-none">
              {transcript ? (
                <p className="text-gray-700 leading-relaxed">{transcript}</p>
              ) : (
                <div className="text-gray-500 italic">
                  Transcript will be available when the video content is added.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Manual Complete Button */}
      {watchProgress < 90 && (
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={() => onComplete()}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Mark as Complete
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;