import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CoachContext = createContext();

export const useCoach = () => {
  const context = useContext(CoachContext);
  if (!context) {
    throw new Error('useCoach must be used within a CoachProvider');
  }
  return context;
};

export const CoachProvider = ({ children }) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState({
    profileScore: 0,
    conversationSkills: 0,
    confidenceLevel: 0,
    completedTasks: 0,
    totalTasks: 10
  });
  const [tasks, setTasks] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    if (user) {
      const savedProgress = localStorage.getItem(`spark_progress_${user.id}`);
      const savedTasks = localStorage.getItem(`spark_tasks_${user.id}`);
      const savedAchievements = localStorage.getItem(`spark_achievements_${user.id}`);

      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      } else {
        // Initialize with default progress
        const initialProgress = {
          profileScore: 35,
          conversationSkills: 20,
          confidenceLevel: 45,
          completedTasks: 2,
          totalTasks: 10
        };
        setProgress(initialProgress);
        localStorage.setItem(`spark_progress_${user.id}`, JSON.stringify(initialProgress));
      }

      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        // Initialize with sample tasks based on persona
        const persona = user.onboardingData?.persona || 'hesitant-professional';
        const initialTasks = getTasksForPersona(persona);
        setTasks(initialTasks);
        localStorage.setItem(`spark_tasks_${user.id}`, JSON.stringify(initialTasks));
      }

      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements));
      }
    }
  }, [user]);

  const getTasksForPersona = (persona) => {
    const baseTasks = [
      {
        id: 1,
        title: 'Complete Profile Review',
        description: 'Get your dating profile analyzed by our AI coach',
        category: 'profile',
        status: 'pending',
        priority: 'high',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedTime: '15 min'
      },
      {
        id: 2,
        title: 'Practice Conversation Starters',
        description: 'Learn 5 engaging opening lines that work',
        category: 'conversation',
        status: 'completed',
        priority: 'medium',
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedTime: '20 min'
      }
    ];

    const personaTasks = {
      'hesitant-professional': [
        {
          id: 3,
          title: 'Build Confidence Module',
          description: 'Overcome dating anxiety with proven techniques',
          category: 'confidence',
          status: 'pending',
          priority: 'high',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedTime: '30 min'
        },
        {
          id: 4,
          title: 'Professional Person Dating Tips',
          description: 'Balance career success with dating life',
          category: 'lifestyle',
          status: 'pending',
          priority: 'medium',
          estimatedTime: '25 min'
        }
      ],
      'app-fatigued': [
        {
          id: 3,
          title: 'App Strategy Refresh',
          description: 'Optimize your approach to dating apps',
          category: 'strategy',
          status: 'pending',
          priority: 'high',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedTime: '35 min'
        },
        {
          id: 4,
          title: 'Quality over Quantity',
          description: 'Learn to have better conversations with fewer matches',
          category: 'conversation',
          status: 'pending',
          priority: 'medium',
          estimatedTime: '20 min'
        }
      ],
      'recently-single': [
        {
          id: 3,
          title: 'Ready to Date Assessment',
          description: 'Ensure you\'re emotionally ready for new connections',
          category: 'wellness',
          status: 'pending',
          priority: 'high',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedTime: '25 min'
        },
        {
          id: 4,
          title: 'Fresh Start Guide',
          description: 'Create an authentic new dating identity',
          category: 'profile',
          status: 'pending',
          priority: 'medium',
          estimatedTime: '40 min'
        }
      ]
    };

    return [...baseTasks, ...(personaTasks[persona] || personaTasks['hesitant-professional'])];
  };

  const completeTask = (taskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed', completedAt: new Date().toISOString() }
        : task
    );
    setTasks(updatedTasks);
    localStorage.setItem(`spark_tasks_${user.id}`, JSON.stringify(updatedTasks));

    // Update progress
    const completedCount = updatedTasks.filter(t => t.status === 'completed').length;
    const updatedProgress = {
      ...progress,
      completedTasks: completedCount
    };
    setProgress(updatedProgress);
    localStorage.setItem(`spark_progress_${user.id}`, JSON.stringify(updatedProgress));
  };

  const updateProgress = (updates) => {
    const updatedProgress = { ...progress, ...updates };
    setProgress(updatedProgress);
    localStorage.setItem(`spark_progress_${user.id}`, JSON.stringify(updatedProgress));
  };

  const addAchievement = (achievement) => {
    const newAchievement = {
      ...achievement,
      id: Date.now(),
      unlockedAt: new Date().toISOString()
    };
    const updatedAchievements = [...achievements, newAchievement];
    setAchievements(updatedAchievements);
    localStorage.setItem(`spark_achievements_${user.id}`, JSON.stringify(updatedAchievements));
  };

  const value = {
    progress,
    tasks,
    achievements,
    completeTask,
    updateProgress,
    addAchievement
  };

  return (
    <CoachContext.Provider value={value}>
      {children}
    </CoachContext.Provider>
  );
};