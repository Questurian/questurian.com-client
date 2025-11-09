"use client";

import { useState } from 'react';
import { EnhancedAuthForm } from '@/features/Auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
  errorMessage?: string;
  prefillEmail?: string;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSuccess,
  title: customTitle,
  subtitle: customSubtitle,
  errorMessage,
  prefillEmail
}: LoginModalProps) {
  const [modalTitle, setModalTitle] = useState("Sign In");
  const [modalSubtitle, setModalSubtitle] = useState("Sign in to your account or create a new one");

  const handleSuccess = () => {
    onClose();
    onSuccess?.();
  };

  const handleModeChange = (isSignUp: boolean, showPasswordStep: boolean) => {
    if (!customTitle && showPasswordStep) {
      setModalTitle(isSignUp ? "Create Your Account" : "Welcome Back");
      setModalSubtitle(isSignUp
        ? "Set up your password to create your account"
        : "Enter your password to sign in"
      );
    } else if (!customTitle && !showPasswordStep) {
      setModalTitle("Sign In");
      setModalSubtitle("Enter your email to continue");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black/30 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal container */}
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal content */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6 relative z-50 pointer-events-auto">
          <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
            <button
              type="button"
              className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="w-full mt-3 text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                {customTitle || modalTitle}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {customSubtitle || modalSubtitle}
              </p>

              <EnhancedAuthForm
                key={isOpen ? 'open' : 'closed'}
                inModal={true}
                onSuccess={handleSuccess}
                errorMessage={errorMessage}
                prefillEmail={prefillEmail}
                onModeChange={handleModeChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}