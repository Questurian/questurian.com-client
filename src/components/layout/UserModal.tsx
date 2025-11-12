"use client";

import { X } from "lucide-react";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserModal({ isOpen, onClose }: UserModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className={`
        /* Base styles */
        fixed inset-0 z-50 overflow-y-auto
        /* 480px breakpoint */
        480:inset-y-0 480:right-0 480:left-auto 480:w-1/2
      `}
    >
      {/* BACKGROUND OVERLAY - Dark 31 31 31 background covering entire page */}
      <div
        className={`
          /* Base styles */
          fixed inset-0 transition-opacity
          /* 480px breakpoint */
          480:inset-y-0 480:right-0 480:left-auto 480:w-1/2
        `}
        aria-hidden="true"
        style={{ backgroundColor: "#1f1f1f" }}
      ></div>

      {/* MODAL CONTAINER - Flexbox wrapper that centers the content */}
      <div
        className={`
          /* Base styles */
          flex flex-col items-center justify-center min-h-screen text-center relative z-50
          /* 480px breakpoint */
          480:w-[440px]
        `}
      >
        {/* CLOSE BUTTON - Top right X button */}
        <button
          onClick={onClose}
          className={`
            /* Base styles */
            absolute top-8 right-8
            p-2 bg-transparent border-0 cursor-pointer
            focus:outline-none transition-colors
            hover:opacity-80
            480:top-10 480:right-10
          `}
          aria-label="Close modal"
        >
          <X className="w-8 h-8 text-white" />
        </button>

        {/* MODAL CONTENT - Centered text */}
        <div
          className={`
            /* Base styles */
            relative pointer-events-auto
          `}
        >
          <h1
            className={`
              /* Base styles */
              text-white text-4xl font-medium
              /* Underline effect */
              underline decoration-white underline-offset-4
              480:text-5xl
            `}
          >
            hello bub
          </h1>
        </div>
      </div>
    </div>
  );
}
