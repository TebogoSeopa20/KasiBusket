import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { toast } from 'sonner';

interface DriverFaceVerificationProps {
  driverId: string;
  driverName: string;
  onVerified?: (verified: boolean) => void;
  isActive?: boolean;
}

export function DriverFaceVerification({
  driverId,
  driverName,
  onVerified,
  isActive = false
}: DriverFaceVerificationProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [faceDetected, setFaceDetected] = useState(false);
  const [detectionCount, setDetectionCount] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading face-api models:', error);
        toast.error('Failed to load face verification system');
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  // Start camera
  useEffect(() => {
    if (!isActive || isLoading) return;

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        toast.error('Camera access denied. Please enable camera permissions.');
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive, isLoading]);

  // Face detection loop
  useEffect(() => {
    if (!isActive || isLoading || !videoRef.current) return;

    const detectFace = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      try {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender();

        const displaySize = {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight
        };

        faceapi.matchDimensions(canvasRef.current, displaySize);
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
        }

        if (detections.length > 0) {
          setFaceDetected(true);
          setDetectionCount(prev => prev + 1);

          // Verify after 5 consecutive detections (good driver verification)
          if (detectionCount > 5) {
            onVerified?.(true);
            toast.success('✅ Driver verified! Proceeding with delivery.');
          }
        } else {
          setFaceDetected(false);
          setDetectionCount(0);
        }
      } catch (error) {
        console.error('Face detection error:', error);
      }

      animationFrameRef.current = requestAnimationFrame(detectFace);
    };

    animationFrameRef.current = requestAnimationFrame(detectFace);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, isLoading, detectionCount, onVerified]);

  if (!isActive) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">📍 Face Recognition Driver Verification</h3>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading face detection system...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full rounded-lg border-2 border-blue-300"
              style={{ maxHeight: '400px', transform: 'scaleX(-1)' }}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full"
              style={{ transform: 'scaleX(-1)' }}
            />
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${faceDetected ? 'bg-green-100' : 'bg-red-100'}`}>
              <p className="text-sm font-semibold">Face Status</p>
              <p className={`text-lg font-bold ${faceDetected ? 'text-green-700' : 'text-red-700'}`}>
                {faceDetected ? '✅ Detected' : '❌ Not Detected'}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-blue-100">
              <p className="text-sm font-semibold">Verification Progress</p>
              <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((detectionCount / 5) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">{Math.min(detectionCount, 5)}/5 detections</p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Keep your face in view</strong> for verification. System will auto-verify after consistent face detection.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm"><strong>Driver:</strong> {driverName}</p>
            <p className="text-sm text-gray-600">This verification helps ensure authentic deliveries and customer safety.</p>
          </div>
        </div>
      )}
    </div>
  );
}




