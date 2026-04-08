import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { User, Owner } from '../../types';
import { AccountManager } from '../../services/AccountManager';
import { toast } from 'sonner';
import { LogOut, Trash2, Eye, EyeOff, AlertTriangle } from 'lucide-react';

interface AccountSettingsProps {
  user: User | Owner;
  onLogout: () => void;
}

export function AccountSettings({ user, onLogout }: AccountSettingsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deletePassword) {
      toast.error('Please enter your password to confirm deletion');
      return;
    }

    setIsDeleting(true);
    try {
      const res = AccountManager.deleteAccount(user.username, deletePassword);

      if (res.success) {
        toast.success('✅ Account deleted successfully');
        setTimeout(() => {
          onLogout();
        }, 1500);
      } else {
        toast.error(res.message || '❌ Password incorrect. Account not deleted.');
      }
    } catch (error) {
      toast.error('Error deleting account');
    } finally {
      setIsDeleting(false);
      setDeletePassword('');
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>👤 Account Information</CardTitle>
          <CardDescription>Your account details and settings</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Grid of account info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-600">Username</Label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                <p className="font-mono text-gray-900">{user.username}</p>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-600">Email</Label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-gray-900 break-all">{user.email || 'Not set'}</p>
              </div>
            </div>

            {/* SA ID */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-600">SA ID</Label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                <p className="font-mono text-gray-900">{user.idNumber}</p>
              </div>
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-600">Account Type</Label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                  {user.role === 'owner' ? '🏪 Shop Owner' : '👤 Customer'}
                </span>
              </div>
            </div>
          </div>

          {/* Activity section */}
          <div className="border-t pt-4 space-y-3">
            <p className="text-sm font-semibold text-gray-700">Account Activity</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-600">Registered</p>
                <p className="text-gray-900">
                  {formatDate(user.registeredAt)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-600">Last Login</p>
                <p className="text-gray-900">
                  {user.lastLogin ? formatDate(user.lastLogin) : 'This is your first login'}
                </p>
              </div>
            </div>
          </div>

          {/* Logout button */}
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>

      {/* Delete Account Card */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            ⚠️ Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions on your account</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-red-900">
              <strong>Delete Account:</strong> This action cannot be undone. Your account and all
              associated data will be permanently removed.
            </p>
          </div>

          {!showDeleteConfirm ? (
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          ) : (
            <form onSubmit={handleDeleteAccount} className="space-y-3">
              <div className="p-3 bg-red-100 border border-red-300 rounded-md">
                <p className="text-xs text-red-900">
                  <strong>⚠️ Warning:</strong> This will permanently delete your account,
                  including all your data. This action cannot be reversed.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delete-password" className="text-sm font-semibold">
                  Confirm with your password:
                </Label>
                <div className="relative">
                  <Input
                    id="delete-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={deletePassword}
                    onChange={e => setDeletePassword(e.target.value)}
                    disabled={isDeleting}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={!deletePassword || isDeleting}
                  variant="destructive"
                  className="flex-1"
                >
                  {isDeleting ? 'Deleting...' : 'Permanently Delete'}
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletePassword('');
                    setShowPassword(false);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}




