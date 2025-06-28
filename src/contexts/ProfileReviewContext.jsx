import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ProfileReviewContext = createContext();

export const useProfileReview = () => {
  const context = useContext(ProfileReviewContext);
  if (!context) {
    throw new Error('useProfileReview must be used within a ProfileReviewProvider');
  }
  return context;
};

export const ProfileReviewProvider = ({ children }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [currentReview, setCurrentReview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (user) {
      const savedReviews = localStorage.getItem(`profile_reviews_${user.id}`);
      if (savedReviews) {
        setReviews(JSON.parse(savedReviews));
      }
    }
  }, [user]);

  const saveReviews = (newReviews) => {
    if (user) {
      localStorage.setItem(`profile_reviews_${user.id}`, JSON.stringify(newReviews));
    }
  };

  // Simulated AI photo analysis
  const analyzePhotos = async (photos) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return photos.map((photo, index) => {
      // Generate realistic photo analysis scores
      const scores = {
        lighting: Math.random() * 40 + 60, // 60-100
        composition: Math.random() * 30 + 70, // 70-100
        facialExpression: Math.random() * 25 + 75, // 75-100
        backgroundQuality: Math.random() * 35 + 65, // 65-100
        imageSharpness: Math.random() * 20 + 80, // 80-100
        authenticity: Math.random() * 15 + 85, // 85-100
      };

      const overallScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;

      const feedback = [];
      
      if (scores.lighting < 75) {
        feedback.push({
          type: 'warning',
          message: `Photo ${index + 1}: Poor lighting detected. Natural lighting can improve appeal by 35%.`,
          suggestion: 'Try taking photos near a window during golden hour or in well-lit areas.'
        });
      }

      if (scores.composition < 80) {
        feedback.push({
          type: 'info',
          message: `Photo ${index + 1}: Composition could be improved. Consider the rule of thirds.`,
          suggestion: 'Position yourself off-center and ensure the background complements your appearance.'
        });
      }

      if (scores.facialExpression < 85) {
        feedback.push({
          type: 'tip',
          message: `Photo ${index + 1}: A genuine smile can increase match rates by 14%.`,
          suggestion: 'Practice a natural, confident smile that reaches your eyes.'
        });
      }

      if (scores.backgroundQuality < 75) {
        feedback.push({
          type: 'warning',
          message: `Photo ${index + 1}: Cluttered background distracts from your presence.`,
          suggestion: 'Choose clean, interesting backgrounds that tell a story about your lifestyle.'
        });
      }

      return {
        photoIndex: index,
        scores,
        overallScore: Math.round(overallScore * 10) / 10,
        feedback,
        recommendations: generatePhotoRecommendations(scores, index)
      };
    });
  };

  // Simulated NLP bio analysis
  const analyzeBio = async (bioText, prompts) => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const wordCount = bioText.split(' ').length;
    const sentenceCount = bioText.split(/[.!?]+/).length - 1;
    const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1);

    // Analyze sentiment and engagement factors
    const engagementWords = ['adventure', 'travel', 'laugh', 'explore', 'passion', 'love', 'enjoy', 'fun'];
    const negativeWords = ['hate', 'don\'t', 'not', 'never', 'dislike'];
    
    const engagementScore = engagementWords.filter(word => 
      bioText.toLowerCase().includes(word)
    ).length * 15;
    
    const negativityPenalty = negativeWords.filter(word => 
      bioText.toLowerCase().includes(word)
    ).length * 10;

    const scores = {
      clarity: Math.min(100, Math.max(20, 100 - Math.abs(avgWordsPerSentence - 15) * 5)),
      uniqueness: Math.random() * 30 + 60,
      engagement: Math.min(100, Math.max(30, 70 + engagementScore - negativityPenalty)),
      authenticity: Math.random() * 20 + 75,
      completeness: Math.min(100, (wordCount / 150) * 100),
    };

    const overallScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;

    const feedback = [];

    if (wordCount < 50) {
      feedback.push({
        type: 'warning',
        message: 'Bio is too short. Profiles with 50+ words get 25% more matches.',
        suggestion: 'Add more details about your interests, hobbies, or what you\'re looking for.'
      });
    }

    if (wordCount > 200) {
      feedback.push({
        type: 'info',
        message: 'Bio might be too long. Consider condensing to key highlights.',
        suggestion: 'Keep it concise but meaningful - aim for 50-150 words.'
      });
    }

    if (scores.engagement < 70) {
      feedback.push({
        type: 'tip',
        message: 'Bio lacks engaging language. Use action words and positive framing.',
        suggestion: 'Include words like "adventure", "explore", "passionate about" to create interest.'
      });
    }

    if (negativeWords.some(word => bioText.toLowerCase().includes(word))) {
      feedback.push({
        type: 'warning',
        message: 'Avoid negative language. Focus on what you DO want rather than what you don\'t.',
        suggestion: 'Replace negative statements with positive preferences and interests.'
      });
    }

    return {
      scores,
      overallScore: Math.round(overallScore * 10) / 10,
      wordCount,
      sentenceCount,
      feedback,
      recommendations: generateBioRecommendations(scores, bioText)
    };
  };

  const generatePhotoRecommendations = (scores, index) => {
    const recommendations = [];
    
    if (index === 0) {
      recommendations.push('Your main photo should be a clear, smiling headshot with good lighting');
    }
    
    if (scores.lighting < 80) {
      recommendations.push('Use natural light whenever possible - it\'s more flattering than artificial lighting');
    }
    
    if (scores.composition < 85) {
      recommendations.push('Follow the rule of thirds - position yourself off-center for better composition');
    }
    
    recommendations.push('Show variety: include full body shots, activity photos, and social pictures');
    
    return recommendations;
  };

  const generateBioRecommendations = (scores, bioText) => {
    const recommendations = [];
    
    if (scores.uniqueness < 75) {
      recommendations.push('Make your bio more unique by sharing specific interests or unusual hobbies');
    }
    
    if (scores.engagement < 80) {
      recommendations.push('Add conversation starters or questions to encourage matches to message you');
    }
    
    if (scores.authenticity < 85) {
      recommendations.push('Be more authentic by sharing personal stories or genuine personality traits');
    }
    
    recommendations.push('Include what you\'re looking for in a relationship to attract compatible matches');
    
    return recommendations;
  };

  const calculateOverallScore = (photoAnalysis, bioAnalysis) => {
    const avgPhotoScore = photoAnalysis.reduce((sum, photo) => sum + photo.overallScore, 0) / photoAnalysis.length;
    const bioScore = bioAnalysis.overallScore;
    
    // Weight photos 60%, bio 40%
    return Math.round((avgPhotoScore * 0.6 + bioScore * 0.4) * 10) / 10;
  };

  const analyzeProfile = async (profileData) => {
    setIsAnalyzing(true);
    
    try {
      const [photoAnalysis, bioAnalysis] = await Promise.all([
        analyzePhotos(profileData.photos),
        analyzeBio(profileData.bio, profileData.prompts || [])
      ]);

      const overallScore = calculateOverallScore(photoAnalysis, bioAnalysis);
      
      const review = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        platform: profileData.platform,
        overallScore,
        photoAnalysis,
        bioAnalysis,
        photos: profileData.photos,
        bio: profileData.bio,
        prompts: profileData.prompts,
        improvements: generateImprovements(photoAnalysis, bioAnalysis, overallScore)
      };

      const newReviews = [review, ...reviews];
      setReviews(newReviews);
      saveReviews(newReviews);
      setCurrentReview(review);
      
      return review;
    } catch (error) {
      console.error('Analysis failed:', error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateImprovements = (photoAnalysis, bioAnalysis, overallScore) => {
    const improvements = [];
    
    // Photo improvements
    photoAnalysis.forEach((photo, index) => {
      if (photo.overallScore < 8) {
        improvements.push({
          type: 'photo',
          priority: photo.overallScore < 6 ? 'high' : 'medium',
          title: `Improve Photo ${index + 1}`,
          description: `Current score: ${photo.overallScore}/10`,
          actions: photo.recommendations
        });
      }
    });

    // Bio improvements
    if (bioAnalysis.overallScore < 8) {
      improvements.push({
        type: 'bio',
        priority: bioAnalysis.overallScore < 6 ? 'high' : 'medium',
        title: 'Enhance Your Bio',
        description: `Current score: ${bioAnalysis.overallScore}/10`,
        actions: bioAnalysis.recommendations
      });
    }

    // Overall improvements
    if (overallScore < 7) {
      improvements.unshift({
        type: 'overall',
        priority: 'high',
        title: 'Profile Needs Major Improvements',
        description: 'Focus on the highest priority items first',
        actions: ['Start with photo quality improvements', 'Rewrite bio for better engagement']
      });
    }

    return improvements;
  };

  const deleteReview = (reviewId) => {
    const newReviews = reviews.filter(review => review.id !== reviewId);
    setReviews(newReviews);
    saveReviews(newReviews);
    
    if (currentReview?.id === reviewId) {
      setCurrentReview(null);
    }
  };

  const getLatestReview = () => {
    return reviews.length > 0 ? reviews[0] : null;
  };

  const value = {
    reviews,
    currentReview,
    isAnalyzing,
    analyzeProfile,
    deleteReview,
    getLatestReview,
    setCurrentReview
  };

  return (
    <ProfileReviewContext.Provider value={value}>
      {children}
    </ProfileReviewContext.Provider>
  );
};