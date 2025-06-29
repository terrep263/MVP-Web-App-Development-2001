import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const RoleContext = createContext();

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

// Role definitions with permissions
const ROLES = {
  admin: {
    name: 'Administrator',
    permissions: [
      'manage_users',
      'manage_roles',
      'view_all_tasks',
      'edit_all_tasks',
      'delete_all_tasks',
      'view_analytics',
      'manage_system'
    ],
    color: 'red',
    level: 4
  },
  manager: {
    name: 'Manager',
    permissions: [
      'view_team_tasks',
      'edit_team_tasks',
      'assign_tasks',
      'view_analytics',
      'manage_team'
    ],
    color: 'blue',
    level: 3
  },
  editor: {
    name: 'Editor',
    permissions: [
      'create_tasks',
      'edit_own_tasks',
      'delete_own_tasks',
      'view_shared_tasks',
      'comment_tasks'
    ],
    color: 'green',
    level: 2
  },
  viewer: {
    name: 'Viewer',
    permissions: [
      'view_own_tasks',
      'comment_tasks'
    ],
    color: 'gray',
    level: 1
  }
};

export const RoleProvider = ({ children }) => {
  const { user, updateUserRole } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user) {
      // Load existing users from localStorage
      const savedUsers = localStorage.getItem('app_users');
      
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        // Update current user in the users list
        const updatedUsers = parsedUsers.map(u => 
          u.email === user.email ? { ...user, id: u.id || user.id } : u
        );
        
        // Add current user if not exists
        if (!parsedUsers.find(u => u.email === user.email)) {
          updatedUsers.push(user);
        }
        
        setUsers(updatedUsers);
        localStorage.setItem('app_users', JSON.stringify(updatedUsers));
      } else {
        // Initialize with current user
        const initialUsers = [user];
        setUsers(initialUsers);
        localStorage.setItem('app_users', JSON.stringify(initialUsers));
      }
    }
  }, [user]);

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  const hasRole = (roleName) => {
    return user?.role === roleName;
  };

  const hasMinimumRole = (roleName) => {
    const userLevel = ROLES[user?.role]?.level || 0;
    const requiredLevel = ROLES[roleName]?.level || 0;
    return userLevel >= requiredLevel;
  };

  const updateUserRoleById = async (userId, newRole) => {
    if (!hasPermission('manage_roles')) {
      throw new Error('Insufficient permissions to manage roles');
    }

    // Update in users list
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, role: newRole, permissions: ROLES[newRole]?.permissions || [] } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));

    // If updating current user, update auth context
    if (userId === user?.id) {
      updateUserRole(newRole);
    }

    return Promise.resolve();
  };

  const updateUserStatus = async (userId, status) => {
    if (!hasPermission('manage_users')) {
      throw new Error('Insufficient permissions to manage users');
    }

    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, status, lastActive: new Date().toISOString() } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));

    return Promise.resolve();
  };

  const addUser = async (userData) => {
    if (!hasPermission('manage_users')) {
      throw new Error('Insufficient permissions to manage users');
    }

    const newUser = {
      id: Date.now(),
      ...userData,
      status: 'active',
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=${userData.name}&background=3b82f6&color=fff`,
      permissions: ROLES[userData.role]?.permissions || []
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));

    return Promise.resolve(newUser);
  };

  const removeUser = async (userId) => {
    if (!hasPermission('manage_users')) {
      throw new Error('Insufficient permissions to manage users');
    }

    if (userId === user?.id) {
      throw new Error('Cannot remove your own account');
    }

    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));

    return Promise.resolve();
  };

  const getUserRole = (userId) => {
    const userObj = users.find(u => u.id === userId);
    return userObj?.role || 'viewer';
  };

  const getRoleInfo = (roleName) => {
    return ROLES[roleName] || ROLES.viewer;
  };

  const getAllRoles = () => {
    return Object.entries(ROLES).map(([key, value]) => ({
      key,
      ...value
    }));
  };

  const value = {
    users,
    currentUserRole: user?.role || 'viewer',
    roles: ROLES,
    hasPermission,
    hasRole,
    hasMinimumRole,
    updateUserRole: updateUserRoleById,
    updateUserStatus,
    addUser,
    removeUser,
    getUserRole,
    getRoleInfo,
    getAllRoles
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};