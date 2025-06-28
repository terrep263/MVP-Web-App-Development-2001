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
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState('editor');

  useEffect(() => {
    if (user) {
      // Load users and roles from localStorage
      const savedUsers = localStorage.getItem('taskflow_users');
      const savedUserRoles = localStorage.getItem('taskflow_user_roles');
      
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      } else {
        // Initialize with current user and some sample users
        const initialUsers = [
          {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: 'admin',
            status: 'active',
            lastActive: new Date().toISOString(),
            joinedAt: new Date().toISOString()
          },
          {
            id: 2,
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=10b981&color=fff',
            role: 'manager',
            status: 'active',
            lastActive: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()
          },
          {
            id: 3,
            name: 'Mike Chen',
            email: 'mike@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=f59e0b&color=fff',
            role: 'editor',
            status: 'active',
            lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString()
          },
          {
            id: 4,
            name: 'Emma Davis',
            email: 'emma@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Emma+Davis&background=8b5cf6&color=fff',
            role: 'viewer',
            status: 'inactive',
            lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
            joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString()
          }
        ];
        setUsers(initialUsers);
        localStorage.setItem('taskflow_users', JSON.stringify(initialUsers));
      }

      if (savedUserRoles) {
        const userRoles = JSON.parse(savedUserRoles);
        setCurrentUserRole(userRoles[user.id] || 'editor');
      } else {
        // Set current user as admin by default
        const userRoles = { [user.id]: 'admin' };
        localStorage.setItem('taskflow_user_roles', JSON.stringify(userRoles));
        setCurrentUserRole('admin');
      }
    }
  }, [user]);

  const hasPermission = (permission) => {
    const role = ROLES[currentUserRole];
    return role && role.permissions.includes(permission);
  };

  const hasRole = (roleName) => {
    return currentUserRole === roleName;
  };

  const hasMinimumRole = (roleName) => {
    const userLevel = ROLES[currentUserRole]?.level || 0;
    const requiredLevel = ROLES[roleName]?.level || 0;
    return userLevel >= requiredLevel;
  };

  const updateUserRole = (userId, newRole) => {
    if (!hasPermission('manage_roles')) {
      throw new Error('Insufficient permissions to manage roles');
    }

    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('taskflow_users', JSON.stringify(updatedUsers));

    // Update role mapping
    const userRoles = JSON.parse(localStorage.getItem('taskflow_user_roles') || '{}');
    userRoles[userId] = newRole;
    localStorage.setItem('taskflow_user_roles', JSON.stringify(userRoles));

    // Update current user role if it's the current user
    if (userId === user?.id) {
      setCurrentUserRole(newRole);
    }
  };

  const updateUserStatus = (userId, status) => {
    if (!hasPermission('manage_users')) {
      throw new Error('Insufficient permissions to manage users');
    }

    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, status } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('taskflow_users', JSON.stringify(updatedUsers));
  };

  const addUser = (userData) => {
    if (!hasPermission('manage_users')) {
      throw new Error('Insufficient permissions to manage users');
    }

    const newUser = {
      id: Date.now(),
      ...userData,
      status: 'active',
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=${userData.name}&background=3b82f6&color=fff`
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('taskflow_users', JSON.stringify(updatedUsers));

    // Update role mapping
    const userRoles = JSON.parse(localStorage.getItem('taskflow_user_roles') || '{}');
    userRoles[newUser.id] = userData.role;
    localStorage.setItem('taskflow_user_roles', JSON.stringify(userRoles));

    return newUser;
  };

  const removeUser = (userId) => {
    if (!hasPermission('manage_users')) {
      throw new Error('Insufficient permissions to manage users');
    }

    if (userId === user?.id) {
      throw new Error('Cannot remove your own account');
    }

    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('taskflow_users', JSON.stringify(updatedUsers));

    // Remove from role mapping
    const userRoles = JSON.parse(localStorage.getItem('taskflow_user_roles') || '{}');
    delete userRoles[userId];
    localStorage.setItem('taskflow_user_roles', JSON.stringify(userRoles));
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
    currentUserRole,
    roles: ROLES,
    hasPermission,
    hasRole,
    hasMinimumRole,
    updateUserRole,
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