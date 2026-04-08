import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AccountManager } from '../../services/AccountManager';
import { SAIDValidator } from '../../services/SAIDValidator';
import { toast } from 'sonner';
import { ChevronRight, Check, Lock } from 'lucide-react';

type ResetStep = 'verify' | 'reset' | 'success';

interface PasswordResetProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export function PasswordReset({ onComplete, onCancel }: PasswordResetProps) {
  const [step, setStep] = useState<ResetStep>('verify');
  const [idNumber, setIdNumber] = useState('');
  const [username, setUsername] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Verify identity
  const handleInitializeReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (idNumber.length !== 13) {
      toast.error('SA ID must be 13 digits');
      return;
    }

    if (!username.trim()) {
      toast.error('Please enter your username');
      return;
    }

    setIsLoading(true);
    try {
      // Validate ID format
      const idValidation = SAIDValidator.validate(idNumber);
      if (!idValidation.valid) {
        toast.error('Invalid SA ID number');
        return;
      }

      // Initialize password reset
      const res = AccountManager.initializePasswordReset(idNumber, username);
      if (res.success && res.token) {
        setResetToken(res.token ?? '');
        setStep('reset');
        toast.success('✅ Identity verified. Reset your password.');
      } else {
        toast.error(res.message || '❌ Account not found or ID mismatch');
      }
    } catch (error) {
      toast.error('Error during verification');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Reset password using token
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const res = AccountManager.resetPassword(resetToken, newPassword);
      if (res.success) {
        setStep('success');
        toast.success('✅ Password reset successfully!');
      } else {
        toast.error(res.message || '❌ Reset token expired. Please try again.');
        setStep('verify');
      }
    } catch (error) {
      toast.error('Error resetting password');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Verify Identity
  if (step === 'verify') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>🔐 Reset Password</CardTitle>
          <CardDescription>Verify your identity to reset your password</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleInitializeReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sa-id">SA ID Number *</Label>
              <Input
                id="sa-id"
                type="text"
                placeholder="9001015800086"
                value={idNumber}
                onChange={e => setIdNumber(e.target.value.replace(/\D/g, '').slice(0, 13))}
                maxLength={13}
                required
              />
              <p className="text-xs text-gray-600">13 digits, no spaces or dashes</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                type="text"
                placeholder="your_username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Verifying...' : 'Verify Identity'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>

            {onCancel && (
              <Button type="button" variant="ghost" onClick={onCancel} className="w-full">
                Cancel
              </Button>
            )}
          </form>

          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs text-blue-700">
              <strong>Demo:</strong> Use ID <code className="font-mono">9001015800086</code> with any username
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Step 2: Reset Password
  if (step === 'reset') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>🔖 Create New Password</CardTitle>
          <CardDescription>Enter a secure password for your account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password *</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
              <p className="text-xs text-gray-600">Minimum 6 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password *</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Password strength indicator */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-700">Password Strength:</p>
              <div className="flex gap-1">
                <div
                  className={`flex-1 h-1 rounded-full ${
                    newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
                <div
                  className={`flex-1 h-1 rounded-full ${
                    newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
                <div
                  className={`flex-1 h-1 rounded-full ${
                    /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword)
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={
                isLoading ||
                newPassword.length < 6 ||
                newPassword !== confirmPassword
              }
              className="w-full"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
              <Lock className="w-4 h-4 ml-2" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep('verify')}
              className="w-full"
            >
              Back
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Step 3: Success
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>✅ Password Reset Successful</CardTitle>
        <CardDescription>Your password has been updated</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-6 h-6 text-green-600" />
          </div>

          <div className="text-center space-y-2">
            <p className="font-semibold text-gray-900">Password updated successfully!</p>
            <p className="text-sm text-gray-600">
              You can now log in with your new password.
            </p>
          </div>

          <Button
            onClick={onComplete || (() => window.location.reload())}
            className="w-full"
          >
            Return to Login
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}




