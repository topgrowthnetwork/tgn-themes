'use client';

import { useEffect, useRef, useState } from 'react';

interface FakeScrollbarProps {
  targetSelector: string;
  className?: string;
}

export function FakeScrollbar({ targetSelector, className = '' }: FakeScrollbarProps) {
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const targetElement = document.querySelector(targetSelector) as HTMLElement;
    if (!targetElement || !thumbRef.current) return;

    const updateThumb = () => {
      if (isDragging) return; // Don't update while dragging

      const scrollPercent =
        targetElement.scrollLeft / (targetElement.scrollWidth - targetElement.clientWidth);
      const thumbPosition = scrollPercent * 80; // 80% max width for the thumb to move

      if (thumbRef.current) {
        thumbRef.current.style.left = `${thumbPosition}%`;
      }
    };

    // Update on scroll
    targetElement.addEventListener('scroll', updateThumb);

    // Initial update
    updateThumb();

    return () => {
      targetElement.removeEventListener('scroll', updateThumb);
    };
  }, [targetSelector, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const targetElement = document.querySelector(targetSelector) as HTMLElement;
    if (!targetElement || !scrollbarRef.current || !thumbRef.current) return;

    const scrollbarRect = scrollbarRef.current.getBoundingClientRect();
    const thumbRect = thumbRef.current.getBoundingClientRect();
    const startX = e.clientX;
    const startThumbLeft = thumbRect.left - scrollbarRect.left;
    const scrollbarWidth = scrollbarRect.width;
    const maxScroll = targetElement.scrollWidth - targetElement.clientWidth;
    const maxThumbPosition = scrollbarWidth * 0.8; // 80% of scrollbar width

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const newThumbLeft = Math.max(0, Math.min(maxThumbPosition, startThumbLeft + deltaX));

      // Update thumb position immediately (1:1 with mouse)
      if (thumbRef.current) {
        thumbRef.current.style.left = `${newThumbLeft}px`;
      }

      // Calculate scroll position from thumb position
      const thumbPercent = newThumbLeft / maxThumbPosition;
      const newScrollLeft = thumbPercent * maxScroll;
      targetElement.scrollLeft = newScrollLeft;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTrackClick = (e: React.MouseEvent) => {
    if (e.target === thumbRef.current) return;

    const targetElement = document.querySelector(targetSelector) as HTMLElement;
    if (!targetElement || !scrollbarRef.current) return;

    const scrollbarRect = scrollbarRef.current.getBoundingClientRect();
    const clickX = e.clientX - scrollbarRect.left;
    const scrollbarWidth = scrollbarRect.width;
    const scrollPercent = clickX / scrollbarWidth;
    const maxScroll = targetElement.scrollWidth - targetElement.clientWidth;

    targetElement.scrollLeft = scrollPercent * maxScroll;
  };

  return (
    <div
      ref={scrollbarRef}
      className={`relative h-2 cursor-pointer rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}
      onClick={handleTrackClick}
    >
      <div
        ref={thumbRef}
        className="absolute top-0 h-full w-[20%] cursor-grab rounded-full bg-gray-400 transition-colors hover:bg-gray-500 active:cursor-grabbing dark:bg-gray-500 dark:hover:bg-gray-400"
        style={{ left: '0%' }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}
