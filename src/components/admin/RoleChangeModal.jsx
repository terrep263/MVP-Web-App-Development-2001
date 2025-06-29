import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useRole } from '../../contexts/RoleContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiX, FiShield, FiAlertTriangle } = FiIcons;

const RoleChangeModal = ({ user, onClose }) => {
  const { updateUserRole, getAllRoles, getRoleInfo } = useRole();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      role: user.role,
      reason: ''
    }
  });

  const selectedRole = watch('role');
  const roleInfo = getRoleInfo(selectedRole);

  const onSubmit = async (data) => {
    try {
      await updateUserRole(user.id, data.role);
      toast.success(`User role updated to ${roleInfo.name}`);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to update user role');
    }
  };

  const roles = getAllRoles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Change User Role</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <SafeIcon icon={FiX} className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* User Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-10 w-10 rounded-full"
              />
              <div>
                <h3 className="font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Current Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Role
            </label>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.role === 'admin' ? 'bg-red-100 text-red-800' :
                user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                user.role === 'editor' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {getRoleInfo(user.role).name}
              </span>
            </div>
          </div>

          {/* New Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Role *
            </label>
            <div className="space-y-2">
              {roles.map((role) => (
                <label
                  key={role.key}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedRole === role.key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    {...register('role', { required: 'Please select a role' })}
                    type="radio"
                    value={role.key}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiShield} className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{role.name}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        role.key === 'admin' ? 'bg-red-100 text-red-800' :
                        role.key === 'manager' ? 'bg-blue-100 text-blue-800' :
                        role.key === 'editor' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        Level {role.level}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {role.permissions.length} permissions
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {/* Role Permissions Preview */}
          {roleInfo && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                {roleInfo.name} Permissions
              </h4>
              <div className="space-y-1">
                {roleInfo.permissions.map((permission) => (
                  <div key={permission} className="text-xs text-gray-600 flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                    {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reason for Change */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Change (Optional)
            </label>
            <textarea
              {...register('reason')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Explain why this role change is necessary..."
            />
          </div>

          {/* Warning for Role Changes */}
          {selectedRole !== user.role && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <SafeIcon icon={FiAlertTriangle} className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">
                    Role Change Warning
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Changing this user's role will immediately affect their access permissions.
                    Make sure this change is intentional and necessary.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || selectedRole === user.role}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <SafeIcon icon={FiShield} className="h-4 w-4 mr-2" />
              )}
              Update Role
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RoleChangeModal;