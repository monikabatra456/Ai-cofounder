import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again!');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#0A0F2C] z-[9999] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-[#111827] border border-[#1F2937] rounded-[24px] p-8 md:p-12 max-w-[420px] w-full text-center shadow-2xl"
        >
          {/* Logo */}
          <div className="w-14 h-14 bg-[#3B82F6] rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6 shadow-lg shadow-blue-500/20">
            F
          </div>

          <h1 className="text-[26px] font-bold text-white leading-tight">
            Welcome to FounderAI
          </h1>
          <p className="text-[#9CA3AF] text-[15px] mt-2">
            India ka pehla AI Co-Founder
          </p>

          {/* Divider */}
          <div className="my-8 flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-[#1F2937]"></div>
            <span className="text-[#4B5563] text-xs uppercase tracking-wider font-medium">
              Sign in to continue
            </span>
            <div className="flex-1 h-[1px] bg-[#1F2937]"></div>
          </div>

          {/* Google Button */}
          <button
            id="googleSignInBtn"
            onClick={handleGoogleSignIn}
            disabled={isLoggingIn}
            className="w-full h-[52px] bg-white text-[#1F2937] rounded-xl flex items-center justify-center gap-3 text-[15px] font-semibold cursor-pointer transition-all hover:bg-[#F3F4F6] hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? (
              <>
                <div className="w-5 h-5 border-2 border-[#1F2937] border-t-[#3B82F6] rounded-full animate-spin"></div>
                <span className="text-[#6B7280]">Signing in...</span>
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.2 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.2-2.7-.4-4z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5L31.8 33c-2.1 1.5-4.8 2.5-7.8 2.5-5.2 0-9.7-3.5-11.3-8.3l-6.6 5.1C9.6 39.5 16.3 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.4-2.3 4.4-4.3 5.8l5.7 5c3.4-3.1 5.3-7.7 5.3-13.8 0-1.3-.2-2.7-.4-4z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <p className="mt-5 text-[#6B7280] text-xs leading-relaxed">
            Sign in karne se tum humare <br />
            <span className="underline cursor-pointer">Terms of Service</span> aur <span className="underline cursor-pointer">Privacy Policy</span> <br />
            se agree karte ho
          </p>

          {/* Features Preview */}
          <div className="mt-8 pt-6 border-t border-[#1F2937] space-y-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-full bg-[#1E3A5F] flex items-center justify-center text-sm flex-shrink-0">
                📊
              </div>
              <div>
                <div className="text-white text-[13px] font-medium">AI Market Analysis</div>
                <div className="text-[#9CA3AF] text-xs">Instant startup research</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-full bg-[#064E3B] flex items-center justify-center text-sm flex-shrink-0">
                📍
              </div>
              <div>
                <div className="text-white text-[13px] font-medium">Investor Finder</div>
                <div className="text-[#9CA3AF] text-xs">25+ investors near you</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-full bg-[#2E1065] flex items-center justify-center text-sm flex-shrink-0">
                📑
              </div>
              <div>
                <div className="text-white text-[13px] font-medium">Pitch Deck Generator</div>
                <div className="text-[#9CA3AF] text-xs">10 slides in 10 seconds</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
