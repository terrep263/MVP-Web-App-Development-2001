import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRole } from '../../contexts/RoleContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShield, FiCheck, FiX, FiInfo } = FiIcons;

const PermissionMatrix = () => {
  const { getAllRoles } = useRole();
  const [selectedPermission, setSelectedPermission] = useState(null);

  const roles = getAllRoles();
  
  // Get all unique permissions
  const allPermissions = [...new Set(
    roles.flatMap(role => role.permissions)
  )].sort();

  const permissionDescriptions = {
    'manage_users': 'Add, edit, and remove user accounts',
    'manage_roles': 'Change user roles and permissions',
    'view_all_tasks': 'View tasks from all users',
    'edit_all_tasks': 'Edit any user\'s tasks',
    'delete_all_tasks': 'Delete any user\'s tasks',
    'view_analytics': 'Access analytics dashboard',
    'manage_system': 'System-wide configuration',
    'view_team_tasks': 'View tasks from team members',
    'edit_team_tasks': 'Edit team member tasks',
    'assign_tasks': 'Assign tasks to team members',
    'manage_team': 'Manage team settings',
    'create_tasks': 'Create new tasks',
    'edit_own_tasks': 'Edit own tasks',
    'delete_own_tasks': 'Delete own tasks',
    'view_shared_tasks': 'View shared tasks',
    'comment_tasks': 'Add comments to tasks',
    'view_own_tasks': 'View own tasks only'
  };

  const hasPermission = (role, permission) => {
    return role.permissions.includes(permission);
  };

  const getRoleColor = (roleKey) => {
    const colors = {
      admin: 'bg-red-100 text-red-800 border-red-200',
      manager: 'bg-blue-100 text-blue-800 border-blue-200',
      editor: 'bg-green-100 text-green-800 border-green-200',
      viewer: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[roleKey] || colors.viewer;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Permission Matrix</h2>
          <p className="text-gray-600 mt-1">
            View and understand role permissions across the system
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <SafeIcon icon={FiInfo} className="h-4 w-4" />
          <span>Click on a permission for details</span>
        </div>
      </div>

      {/* Role Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map((role) => (
          <motion.div
            key={role.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center space-x-2 mb-3">
              <SafeIcon icon={FiShield} className="h-5 w-5 text-gray-500" />
              <h3 className="font-semibold text-gray-900">{role.name}</h3>
            </div>
            <div className={`inline-flex px-2 py-1 text-xs rounded-full border ${getRoleColor(role.key)}`}>
              Level {role.level}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {role.permissions.length} permissions
            </p>
          </motion.div>
        ))}
      </div>

      {/* Permission Matrix Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permission
                </th>
                {roles.map((role) => (
                  <th
                    key={role.key}
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex flex-col items-center">
                      <span>{role.name}</span>
                      <span className="text-gray-400 text-xs mt-1">
                        Level {role.level}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allPermissions.map((permission, index) => (
                <tr
                  key={permission}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    selectedPermission === permission ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedPermission(
                    selectedPermission === permission ? null : permission
                  )}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                      {selectedPermission === permission && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs text-gray-600 mt-1"
                        >
                          {permissionDescriptions[permission] || 'No description available'}
                        </motion.div>
                      )}
                    </div>
                  </td>
                  {roles.map((role) => (
                    <td key={`${permission}-${role.key}`} className="px-6 py-4 text-center">
                      {hasPermission(role, permission) ? (
                        <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                          <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-600" />
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-6 h-6 bg-red-100 rounded-full">
                          <SafeIcon icon={FiX} className="h-4 w-4 text-red-600" />
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission Details */}
      {selectedPermission && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            {selectedPermission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h3>
          <p className="text-blue-800 mb-4">
            {permissionDescriptions[selectedPermission] || 'No description available'}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Roles with this permission:</h4>
              <div className="space-y-1">
                {roles
                  .filter(role => hasPermission(role, selectedPermission))
                  .map(role => (
                    <div key={role.key} className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-600" />
                      <span className="text-blue-800">{role.name}</span>
                    </div>
                  ))
                }
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Roles without this permission:</h4>
              <div className="space-y-1">
                {roles
                  .filter(role => !hasPermission(role, selectedPermission))
                  .map(role => (
                    <div key={role.key} className="flex items-center space-x-2">
                      <SafeIcon icon={FiX} className="h-4 w-4 text-red-600" />
                      <span className="text-blue-800">{role.name}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-3">Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-gray-700">Permission granted</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiX} className="h-4 w-4 text-red-600" />
            </div>
            <span className="text-gray-700">Permission denied</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionMatrix;