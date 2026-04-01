import React from 'react';
import { cn } from '../lib/utils';

interface LoadingOverlayProps {
  isVisible: boolean;
}

const STEPS = [
  "🔍 Idea analyze ho rahi hai...",
  "📈 Market research chal rahi hai...",
  "🏆 Competitors dhundh rahe hain...",
  "🎨 Pitch deck ban rahi hai...",
  "📍 Investors locate kar rahe hain...",
  "✉️ Email draft taiyaar ho rahi hai..."
];

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible }) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % STEPS.length);
    }, 1500);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1.1; // Reaches 100 in ~9 seconds
      });
    }, 100);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-[999] animate-fade-in">
      <div className="card max-w-[380px] w-[90%] p-12 text-center animate-scale-in">
        <div className="relative w-[72px] h-[72px] mx-auto">
          <div className="absolute inset-0 border-4 border-border rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-accent rounded-full animate-spin-slow" />
        </div>

        <p className="mt-7 text-lg font-medium text-white min-h-[28px] transition-opacity duration-300">
          {STEPS[currentStep]}
        </p>

        <div className="mt-6 w-full h-1.5 bg-border rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-accent to-blue-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-2.5 text-text-muted text-sm font-medium">
          {Math.round(progress)}%
        </div>

        <p className="mt-2 text-[11px] text-[#6B7280]">
          Yeh 8-10 seconds leta hai...
        </p>
      </div>
    </div>
  );
};
