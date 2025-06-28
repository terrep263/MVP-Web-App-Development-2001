import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (user) {
      const savedTasks = localStorage.getItem(`taskflow_tasks_${user.id}`);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        // Initialize with sample tasks
        const sampleTasks = [
          {
            id: 1,
            title: 'Welcome to TaskFlow!',
            description: 'This is your first task. Click edit to modify it.',
            status: 'todo',
            priority: 'medium',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString(),
            category: 'Getting Started'
          }
        ];
        setTasks(sampleTasks);
        localStorage.setItem(`taskflow_tasks_${user.id}`, JSON.stringify(sampleTasks));
      }
    }
  }, [user]);

  const saveTasks = (newTasks) => {
    if (user) {
      localStorage.setItem(`taskflow_tasks_${user.id}`, JSON.stringify(newTasks));
    }
  };

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      createdAt: new Date().toISOString(),
      status: 'todo'
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    return newTask;
  };

  const updateTask = (taskId, updates) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const todo = tasks.filter(task => task.status === 'todo').length;
    const overdue = tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
    ).length;

    return { total, completed, inProgress, todo, overdue };
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getTaskStats
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};