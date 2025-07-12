import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid';
import { ProgressRing } from './progress-ring';

interface PlayPauseButtonProps {
  isPlaying: boolean;
  animationKey: number;
  onTogglePlay: () => void;
}

export function PlayPauseButton({ isPlaying, animationKey, onTogglePlay }: PlayPauseButtonProps) {
  return (
    <div className="relative">
      <button
        onClick={onTogglePlay}
        className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg"
        aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
      >
        <ProgressRing isPlaying={isPlaying} animationKey={animationKey} />

        {/* Play/Pause Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isPlaying ? (
            <PauseIcon className="h-4 w-4 text-gray-700" />
          ) : (
            <PlayIcon className="ml-0.5 h-4 w-4 text-gray-500 transition-colors group-hover:text-gray-700" />
          )}
        </div>
      </button>
    </div>
  );
}
