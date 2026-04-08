import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { OTPService } from '../../services/OTPService';
import { toast } from 'sonner';
import { Clock, RotateCcw } from 'lucide-react';

interface OTPVerificationProps {
  identifier: string; // email or phone
  onSuccess: (verified: boolean) => void;
  onCancel?: () => void;
  method: 'email' | 'sms';
}

export function OTPVerification({ identifier, onSuccess, onCancel, method }: OTPVerificationProps) {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [attempts, setAttempts] = useState(0);
  const [showResend, setShowResend] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error('OTP must be 6 digits');
      return;
    }

    setIsVerifying(true);
    try {
      const result = OTPService.verifyOTP(identifier, otp);

      if (result.valid) {
        toast.success('✅ OTP verified successfully!');
        onSuccess(true);
      } else {
        setAttempts(prev => prev + 1);
        toast.error(result.message);

        if (attempts >= 4) {
          toast.error('❌ Maximum attempts reached. Please try again later.');
          onSuccess(false);
        }
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
      setOtp('');
    }
  };

  const handleResend = async () => {
    try {
      if (method === 'email') {
        await OTPService.sendOTPEmail(identifier, OTPService.generateOTP(), identifier);
        toast.success('📧 New OTP sent to your email');
      } else {
        const newOTP = OTPService.generateOTP();
        await OTPService.sendOTPSMS(identifier, newOTP);
        toast.success('📡 New OTP sent to your phone');
      }

      // Reset timer
      setTimeLeft(600);
      setShowResend(false);
      setOtp('');
      setAttempts(0);
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Verify Your {method === 'email' ? 'Email' : 'Phone'}</CardTitle>
        <CardDescription>
          Enter the 6-digit OTP sent to {identifier}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp-input">One-Time Password</Label>
            <Input
              id="otp-input"
              type="text"
              inputMode="numeric"
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              disabled={isVerifying}
              className="text-center text-2xl tracking-widest font-bold"
            />
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {/* Attempt counter */}
          <div className="text-xs text-center text-gray-600">
            Attempts: {attempts + 1}/5
          </div>

          {/* Progress bar for attempts */}
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                attempts < 3 ? 'bg-green-500' : attempts < 4 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${((attempts + 1) / 5) * 100}%` }}
            />
          </div>

          {/* Verify button */}
          <Button type="submit" disabled={isVerifying || otp.length !== 6} className="w-full">
            {isVerifying ? 'Verifying...' : 'Verify OTP'}
          </Button>

          {/* Resend option */}
          {showResend && (
            <Button
              type="button"
              variant="outline"
              onClick={handleResend}
              className="w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Resend OTP
            </Button>
          )}

          {/* Cancel button */}
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="w-full"
            >
              Cancel
            </Button>
          )}
        </form>

        {/* Demo OTP hint */}
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-blue-700">
            <strong>Demo:</strong> For testing, the OTP is <code className="font-bold">000000</code>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}




