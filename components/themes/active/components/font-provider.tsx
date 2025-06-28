'use client';

import { useEffect } from 'react';

interface FontProviderProps {
  fontClasses: string[];
  children: React.ReactNode;
}

export default function FontProvider({ fontClasses, children }: FontProviderProps) {
  useEffect(() => {
    // Apply font classes to HTML element for global access
    const htmlElement = document.documentElement;
    htmlElement.classList.add(...fontClasses);

    // Cleanup on unmount
    return () => {
      htmlElement.classList.remove(...fontClasses);
    };
  }, [fontClasses]);

  return <div className={fontClasses.join(' ')}>{children}</div>;
}
