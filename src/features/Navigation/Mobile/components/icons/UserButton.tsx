"use client";

import { User } from "lucide-react";

export default function UserButton() {
  return (
    <User
      className={`
   /* Base styles */
        w-5 h-5
        text-white
        cursor-pointer
        /* 280px breakpoint */
        /* 320px breakpoint */
        /* 380px breakpoint */
        /* 480px breakpoint */
        /* 550px breakpoint */
        550:w-6 550:h-6
      `}
    />
  );
}
