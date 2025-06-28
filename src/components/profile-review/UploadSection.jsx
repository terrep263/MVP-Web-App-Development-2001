import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProfileReview } from '../../contexts/ProfileReviewContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiUpload, FiX, FiImage, FiHeart, FiMessageCircle, FiSmartphone, FiTrendingUp } = FiIcons;

const UploadSection = ({ onAnalysisComplete, isAnalyzing }) => {
  const { analyzeProfile } = useProfileReview();
  const [selectedPlatform, setSelectedPlatform] = useState('tinder');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [bioText, setBioText] = useState('');
  const [prompts, setPrompts] = useState(['', '', '']);

  const platforms = [
    { id: 'tinder', name: 'Tinder', icon: FiHeart, color: 'from-red-500 to-pink-500' },
    { id: 'bumble', name: 'Bumble', icon: FiMessageCircle, color: 'from-yellow-500 to-orange-500' },
    { id: 'hinge', name: 'Hinge', icon: FiSmartphone, color: 'from-purple-500 to-indigo-500' }
  ];

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
    if (uploadedPhotos.length + files.length > 6) {
      toast.error('Maximum 6 photos allowed');
      return;
    }

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedPhotos(prev => [...prev, {
            id: Date.now() + Math.random(),
            file,
            preview: e.target.result,
            name: file.name
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removePhoto = (photoId) => {
    setUploadedPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const handlePromptChange = (index, value) => {
    const newPrompts = [...prompts];
    newPrompts[index] = value;
    setPrompts(newPrompts);
  };

  const handleAnalyze = async () => {
    if (uploadedPhotos.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }

    if (!bioText.trim() && selectedPlatform !== 'tinder') {
      toast.error('Please add your bio text');
      return;
    }

    try {
      const profileData = {
        platform: selectedPlatform,
        photos: uploadedPhotos,
        bio: bioText,
        prompts: prompts.filter(p => p.trim())
      };

      const review = await analyzeProfile(profileData);
      onAnalysisComplete(review);
    } catch (error) {
      toast.error('Analysis failed. Please try again.');
    }
  };

  const canAnalyze = uploadedPhotos.length > 0 && (bioText.trim() || selectedPlatform === 'tinder');

  return (
    <div className="space-y-8">
      {/* Platform Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Dating Platform</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => setSelectedPlatform(platform.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedPlatform === platform.id
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${platform.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <SafeIcon icon={platform.icon} className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-medium text-gray-900">{platform.name}</h4>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Photo Upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Your Photos</h3>
        
        {uploadedPhotos.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-pink-400 transition-colors">
            <SafeIcon icon={FiUpload} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Profile Photos</h4>
            <p className="text-gray-600 mb-4">
              Drag and drop your photos here, or click to select files
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium rounded-lg hover:from-pink-700 hover:to-purple-700 cursor-pointer transition-all"
            >
              <SafeIcon icon={FiImage} className="h-5 w-5 mr-2" />
              Choose Photos
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {uploadedPhotos.map((photo, index) => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={photo.preview}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <SafeIcon icon={FiX} className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Photo {index + 1}
                  </div>
                </div>
              ))}
            </div>
            
            {uploadedPhotos.length < 6 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="additional-upload"
                />
                <label
                  htmlFor="additional-upload"
                  className="inline-flex items-center px-4 py-2 text-pink-600 border border-pink-600 rounded-lg hover:bg-pink-50 cursor-pointer transition-colors"
                >
                  <SafeIcon icon={FiUpload} className="h-4 w-4 mr-2" />
                  Add More Photos ({6 - uploadedPhotos.length} remaining)
                </label>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Bio Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Bio & Prompts</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio Text {selectedPlatform !== 'tinder' && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter your dating profile bio..."
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {bioText.length} characters
            </div>
          </div>

          {selectedPlatform === 'hinge' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hinge Prompts (Optional)
              </label>
              {prompts.map((prompt, index) => (
                <input
                  key={index}
                  type="text"
                  value={prompt}
                  onChange={(e) => handlePromptChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent mb-2"
                  placeholder={`Prompt ${index + 1} answer...`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Analysis Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze || isAnalyzing}
          className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Analyzing Profile...
            </>
          ) : (
            <>
              <SafeIcon icon={FiTrendingUp} className="h-5 w-5 mr-2" />
              Analyze My Profile
            </>
          )}
        </button>
        
        {!canAnalyze && (
          <p className="text-sm text-red-600 mt-2">
            Please upload at least one photo and add your bio to continue
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default UploadSection;