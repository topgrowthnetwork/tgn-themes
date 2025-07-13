import { useCallback, useEffect, useRef } from 'react';

interface UseAutoPlayProps {
  isPlaying: boolean;
  autoPlayInterval: number;
  onAdvance: () => void;
}

export function useAutoPlay({ isPlaying, autoPlayInterval, onAdvance }: UseAutoPlayProps) {
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const resetAutoPlayTimer = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    if (isPlaying) {
      autoPlayRef.current = setInterval(() => {
        onAdvance();
      }, autoPlayInterval);
    }
  }, [isPlaying, autoPlayInterval, onAdvance]);

  useEffect(() => {
    if (!isPlaying) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
      return;
    }

    // Auto-play timer
    autoPlayRef.current = setInterval(() => {
      onAdvance();
    }, autoPlayInterval);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isPlaying, onAdvance, autoPlayInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, []);

  return {
    resetAutoPlayTimer
  };
}
