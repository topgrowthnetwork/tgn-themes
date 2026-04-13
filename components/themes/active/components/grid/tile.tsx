import clsx from 'clsx';
import Image from 'next/image';
import Label from '../label';

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  outOfStock,
  outOfStockLabel,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    originalAmount?: string;
    position?: 'bottom' | 'center';
  };
  /** When true, shows {@link outOfStockLabel} over the image and softens the tile styling. */
  outOfStock?: boolean;
  outOfStockLabel?: string;
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={clsx(
        'group flex h-full w-full items-center justify-center overflow-hidden rounded-theme border bg-white dark:bg-black',
        {
          relative: label || outOfStock,
          'border-2 border-primary-600': active,
          'border-neutral-200 hover:border-primary-600 dark:border-neutral-800': !active && !outOfStock,
          'cursor-not-allowed border-neutral-200 opacity-85 dark:border-neutral-700': outOfStock
        }
      )}
    >
      {props.src ? (
        // eslint-disable-next-line jsx-a11y/alt-text -- `alt` is inherited from `props`, which is being enforced with TypeScript
        <Image
          className={clsx('relative h-full w-full object-contain p-2', {
            'transition duration-300 ease-in-out group-hover:scale-105': isInteractive && !outOfStock,
            'pb-4': label,
            'grayscale-[0.4]': outOfStock
          })}
          {...props}
        />
      ) : null}
      {outOfStock && outOfStockLabel ? (
        <div className="pointer-events-none absolute start-3 top-3 z-20">
          <span className="flex h-8 items-center rounded-full bg-neutral-900/85 px-3 text-[0.65rem] font-semibold uppercase tracking-wide text-white shadow-sm">
            {outOfStockLabel}
          </span>
        </div>
      ) : null}
      {label ? (
        <Label
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          originalAmount={label.originalAmount}
          position={label.position}
        />
      ) : null}
    </div>
  );
}
