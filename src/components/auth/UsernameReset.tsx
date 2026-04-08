import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AccountManager } from '../../services/AccountManager';
import { SAIDValidator } from '../../services/SAIDValidator';
import { toast } from 'sonner';
import { User, Check, ArrowRight } from 'lucide-react';

type ResetStep = 'lookup' | 'confirm' | 'success';

interface UsernameResetProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export function UsernameReset({ onComplete, onCancel }: UsernameResetProps) {
  const [step, setStep] = useState<ResetStep>('lookup');
  const [idNumber, setIdNumber] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [foundUsername, setFoundUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Look up username by ID
  const handleLookupUsername = async (e: React.FormEvent) => {
    e.preventDefault();

    if (idNumber.length !== 13) {
      toast.error('SA ID must be 13 digits');
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

      // Get user by ID
      const user = AccountManager.getUserByID(idNumber);
      if (user) {
        setFoundUsername(user.username);
        setStep('confirm');
        toast.success('✅ Account found! Confirm your new username.');
      } else {
        toast.error('❌ No account found with this SA ID');
      }
    } catch (error) {
      toast.error('Error during lookup');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Confirm new username
  const handleResetUsername = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUsername.trim()) {
      toast.error('Please enter a new username');
      return;
    }

    if (newUsername === foundUsername) {
      toast.error('New username must be different from current username');
      return;
    }

    if (newUsername.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    setIsLoading(true);
    try {
      // Check if username already exists
      if (AccountManager.getUser(newUsername)) {
        toast.error('❌ This username is already taken');
        return;
      }

      // Reset username
      const success = AccountManager.resetUsername(idNumber, newUsername);
      if (success) {
        setStep('success');
        toast.success('✅ Username changed successfully!');
      } else {
        toast.error('❌ Failed to reset username');
      }
    } catch (error) {
      toast.error('Error resetting username');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Lookup by ID
  if (step === 'lookup') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>👤 Find Your Username</CardTitle>
          <CardDescription>Enter your SA ID to look up your account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLookupUsername} className="space-y-4">
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

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Looking up...' : 'Look Up Account'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            {onCancel && (
              <Button type="button" variant="ghost" onClick={onCancel} className="w-full">
                Cancel
              </Button>
            )}
          </form>

          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs text-blue-700">
              <strong>Demo:</strong> Use ID <code className="font-mono">9001015800086</code>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Step 2: Confirm change
  if (step === 'confirm') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>🔑 Change Username</CardTitle>
          <CardDescription>Your account is associated with the username shown below</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleResetUsername} className="space-y-4">
            {/* Current username (read-only) */}
            <div className="space-y-2">
              <Label>Current Username</Label>
              <div className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-md font-mono text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                {foundUsername}
              </div>
            </div>

            {/* New username input */}
            <div className="space-y-2">
              <Label htmlFor="new-username">New Username *</Label>
              <Input
                id="new-username"
                type="text"
                placeholder="new_username"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                required
              />
              <p className="text-xs text-gray-600">
                Minimum 3 characters, letters, numbers, and underscores
              </p>
            </div>

            {/* Username validation */}
            {newUsername && (
              <div className="space-y-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-xs font-semibold text-blue-900">Username Check:</p>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li className={newUsername.length >= 3 ? '✅' : '❌'}>
                    At least 3 characters
                  </li>
                  <li className={/^[a-zA-Z0-9_]+$/.test(newUsername) ? '✅' : '❌'}>
                    Only letters, numbers, underscores
                  </li>
                  <li
                    className={newUsername !== foundUsername ? '✅' : '❌'}
                  >
                    Different from current username
                  </li>
                </ul>
              </div>
            )}

            <Button
              type="submit"
              disabled={
                isLoading ||
                newUsername.length < 3 ||
                newUsername === foundUsername ||
                !/^[a-zA-Z0-9_]+$/.test(newUsername)
              }
              className="w-full"
            >
              {isLoading ? 'Updating...' : 'Update Username'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep('lookup')}
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
        <CardTitle>✅ Username Changed</CardTitle>
        <CardDescription>Your username has been updated successfully</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-6 h-6 text-green-600" />
          </div>

          <div className="text-center space-y-3">
            <p className="font-semibold text-gray-900">Username Updated!</p>
            <div className="p-3 bg-gray-100 border border-gray-300 rounded-md">
              <p className="text-sm text-gray-600">Your new username is:</p>
              <p className="font-mono font-semibold text-gray-900">{newUsername}</p>
            </div>
            <p className="text-xs text-gray-600">
              Use this username to log in to your account.
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




