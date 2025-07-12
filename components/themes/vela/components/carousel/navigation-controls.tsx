import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

interface NavigationControlsProps {
  selectedIndex: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
}

export function NavigationControls({
  selectedIndex,
  totalSlides,
  onPrev,
  onNext
}: NavigationControlsProps) {
  if (totalSlides <= 1) return null;

  return (
    <div className="flex h-9 rounded-full bg-white shadow-lg">
      <button
        onClick={onPrev}
        className="flex w-8 items-center justify-center rounded-l-full transition-colors hover:bg-gray-50"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
      </button>

      <div className="flex w-12 items-center justify-center gap-[1px] border-l border-r border-gray-200 text-xs font-medium text-gray-700">
        <span>{selectedIndex + 1}</span>
        <span>/</span>
        <span>{totalSlides}</span>
      </div>

      <button
        onClick={onNext}
        className="flex w-8 items-center justify-center rounded-r-full transition-colors hover:bg-gray-50"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="h-4 w-4 text-gray-600" />
      </button>
    </div>
  );
}
