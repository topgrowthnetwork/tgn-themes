import { useCallback, useEffect, useRef } from 'react';

interface UseAutoPlayProps {
  isPlaying: boolean;
  autoPlayInterval: number;
  onNext: () => void;
}

export function useAutoPlay({ isPlaying, autoPlayInterval, onNext }: UseAutoPlayProps) {
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const resetAutoPlayTimer = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    if (isPlaying) {
      autoPlayRef.current = setInterval(() => {
        onNext();
      }, autoPlayInterval);
    }
  }, [isPlaying, autoPlayInterval, onNext]);

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
      onNext();
    }, autoPlayInterval);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isPlaying, onNext, autoPlayInterval]);

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
