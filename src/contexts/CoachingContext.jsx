import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CoachingContext = createContext();

export const useCoaching = () => {
  const context = useContext(CoachingContext);
  if (!context) {
    throw new Error('useCoaching must be used within a CoachingProvider');
  }
  return context;
};

export const CoachingProvider = ({ children }) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState({
    profileScore: 0,
    conversationSkill: 0,
    dateSuccess: 0,
    overallProgress: 0
  });
  
  const [tasks, setTasks] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    if (user) {
      // Load user progress and tasks
      const savedProgress = localStorage.getItem(`sparkcoach_progress_${user.id}`);
      const savedTasks = localStorage.getItem(`sparkcoach_tasks_${user.id}`);
      const savedAchievements = localStorage.getItem(`sparkcoach_achievements_${user.id}`);
      
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      } else {
        // Initialize with persona-based starting values
        initializeProgress();
      }
      
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        generateInitialTasks();
      }
      
      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements));
      }
    }
  }, [user]);

  const initializeProgress = () => {
    const initialProgress = {
      profileScore: 30,
      conversationSkill: 25,
      dateSuccess: 20,
      overallProgress: 25
    };
    
    setProgress(initialProgress);
    localStorage.setItem(`sparkcoach_progress_${user.id}`, JSON.stringify(initialProgress));
  };

  const generateInitialTasks = () => {
    const persona = user?.persona || 'hesitant_professional';
    
    const taskTemplates = {
      hesitant_professional: [
        {
          title: 'Optimize your dating profile',
          description: 'Upload 3-5 high-quality photos that showcase your personality',
          category: 'profile',
          difficulty: 'easy',
          estimatedTime: '30 minutes'
        },
        {
          title: 'Practice conversation starters',
          description: 'Learn 5 engaging conversation starters for your matches',
          category: 'messaging',
          difficulty: 'medium',
          estimatedTime: '20 minutes'
        },
        {
          title: 'Plan your ideal first date',
          description: 'Design a time-efficient but memorable first date idea',
          category: 'dating',
          difficulty: 'medium',
          estimatedTime: '15 minutes'
        }
      ],
      app_fatigued_swiper: [
        {
          title: 'Refresh your dating profile',
          description: 'Update photos and bio to stand out from the crowd',
          category: 'profile',
          difficulty: 'medium',
          estimatedTime: '45 minutes'
        },
        {
          title: 'Quality over quantity approach',
          description: 'Learn to be more selective and focus on meaningful connections',
          category: 'strategy',
          difficulty: 'hard',
          estimatedTime: '25 minutes'
        },
        {
          title: 'Combat app fatigue',
          description: 'Implement healthy dating app usage habits',
          category: 'wellness',
          difficulty: 'medium',
          estimatedTime: '20 minutes'
        }
      ],
      recently_single: [
        {
          title: 'Build dating confidence',
          description: 'Complete confidence-building exercises and affirmations',
          category: 'confidence',
          difficulty: 'easy',
          estimatedTime: '15 minutes'
        },
        {
          title: 'Create your comeback profile',
          description: 'Craft a profile that highlights your fresh start',
          category: 'profile',
          difficulty: 'easy',
          estimatedTime: '40 minutes'
        },
        {
          title: 'Practice low-pressure conversations',
          description: 'Start with casual, comfortable conversation topics',
          category: 'messaging',
          difficulty: 'easy',
          estimatedTime: '20 minutes'
        }
      ]
    };

    const initialTasks = (taskTemplates[persona] || taskTemplates.hesitant_professional).map((task, index) => ({
      id: Date.now() + index,
      ...task,
      status: 'pending',
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Due in 1 week
    }));

    setTasks(initialTasks);
    localStorage.setItem(`sparkcoach_tasks_${user.id}`, JSON.stringify(initialTasks));
  };

  const completeTask = (taskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed', completedAt: new Date().toISOString() }
        : task
    );
    
    setTasks(updatedTasks);
    localStorage.setItem(`sparkcoach_tasks_${user.id}`, JSON.stringify(updatedTasks));
    
    // Update progress based on completed task
    updateProgressForTask(updatedTasks.find(t => t.id === taskId));
  };

  const updateProgressForTask = (task) => {
    const progressIncrease = {
      profile: { profileScore: 15 },
      messaging: { conversationSkill: 20 },
      dating: { dateSuccess: 25 },
      confidence: { conversationSkill: 10, dateSuccess: 10 },
      strategy: { overallProgress: 15 },
      wellness: { overallProgress: 10 }
    };

    const increase = progressIncrease[task.category] || { overallProgress: 5 };
    
    const newProgress = { ...progress };
    Object.keys(increase).forEach(key => {
      newProgress[key] = Math.min(100, newProgress[key] + increase[key]);
    });
    
    // Update overall progress
    newProgress.overallProgress = Math.round(
      (newProgress.profileScore + newProgress.conversationSkill + newProgress.dateSuccess) / 3
    );
    
    setProgress(newProgress);
    localStorage.setItem(`sparkcoach_progress_${user.id}`, JSON.stringify(newProgress));
  };

  const addAchievement = (achievement) => {
    const newAchievement = {
      id: Date.now(),
      ...achievement,
      unlockedAt: new Date().toISOString()
    };
    
    const updatedAchievements = [...achievements, newAchievement];
    setAchievements(updatedAchievements);
    localStorage.setItem(`sparkcoach_achievements_${user.id}`, JSON.stringify(updatedAchievements));
  };

  const getUpcomingTasks = () => {
    return tasks
      .filter(task => task.status === 'pending')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 3);
  };

  const getStats = () => {
    const completed = tasks.filter(t => t.status === 'completed').length;
    const total = tasks.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      completedTasks: completed,
      totalTasks: total,
      completionRate,
      currentStreak: 0, // TODO: Implement streak calculation
      achievements: achievements.length
    };
  };

  const value = {
    progress,
    tasks,
    achievements,
    completeTask,
    addAchievement,
    getUpcomingTasks,
    getStats
  };

  return (
    <CoachingContext.Provider value={value}>
      {children}
    </CoachingContext.Provider>
  );
};