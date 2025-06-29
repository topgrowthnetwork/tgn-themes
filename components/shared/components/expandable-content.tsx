'use client';

import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { ReactNode, useState } from 'react';

interface ExpandableContentProps {
  children: ReactNode;
  className?: string;
  maxHeight?: string;
  expandText?: string;
  collapseText?: string;
  buttonClassName?: string;
  showGradient?: boolean;
  gradientClassName?: string;
}

export function ExpandableContent({
  children,
  className = '',
  maxHeight = 'max-h-24',
  expandText = 'Read More',
  collapseText = 'Show Less',
  buttonClassName = '',
  showGradient = true,
  gradientClassName = ''
}: ExpandableContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={className}>
      <div
        className={clsx(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'max-h-none' : maxHeight
        )}
      >
        {children}
      </div>

      {/* Gradient overlay for truncated text */}
      {showGradient && !isExpanded && (
        <div
          className={clsx(
            'relative -mt-8 h-8 bg-gradient-to-t from-white to-transparent dark:from-black dark:to-transparent',
            gradientClassName
          )}
        />
      )}

      {/* Expand/Collapse button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={clsx(
          'mt-2 flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700',
          buttonClassName
        )}
      >
        {isExpanded ? (
          <>
            {collapseText}
            <ChevronUpIcon className="h-4 w-4" />
          </>
        ) : (
          <>
            {expandText}
            <ChevronDownIcon className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
}
