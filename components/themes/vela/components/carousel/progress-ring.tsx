import clsx from 'clsx';

interface ProgressRingProps {
  isPlaying: boolean;
  animationKey: number;
  duration?: number;
}

export function ProgressRing({ isPlaying, animationKey, duration = 10000 }: ProgressRingProps) {
  return (
    <div className="absolute inset-0 rounded-full p-0.5">
      <div
        key={animationKey}
        className={clsx(
          'h-full w-full rounded-full bg-[conic-gradient(#787878_var(--pie-progress),white_0%)]',
          isPlaying ? 'animate-sweep' : 'animate-none'
        )}
      />
    </div>
  );
}
