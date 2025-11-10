'use client';

import { TextSearch } from 'lucide-react';

export default function MenuIcon() {
  return (
    <TextSearch
      className={`
        /* Base styles */
        w-4 h-4
        /* 280px breakpoint */
        /* 320px breakpoint */
        /* 380px breakpoint */
        /* 480px breakpoint */
        480:w-5 480:h-5
        /* 550px breakpoint */
        550:w-6 550:h-6
      `}
    />
  );
}
