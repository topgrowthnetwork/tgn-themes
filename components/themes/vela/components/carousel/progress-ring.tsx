import clsx from 'clsx';

interface ProgressRingProps {
  isPlaying: boolean;
  animationKey: number;
}

export function ProgressRing({ isPlaying, animationKey }: ProgressRingProps) {
  return (
    <div className="absolute inset-0 rounded-full p-0.5">
      <div
        key={animationKey}
        className={clsx(
          'progress-ring h-full w-full rounded-full',
          !isPlaying ? 'animate-none' : ''
        )}
      />
    </div>
  );
}
