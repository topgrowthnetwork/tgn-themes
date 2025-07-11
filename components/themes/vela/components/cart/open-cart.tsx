import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function OpenCart({
  className,
  quantity = 5
}: {
  className?: string;
  quantity?: number;
}) {
  return (
    <div className="group relative flex h-12 w-12 items-center justify-center text-black transition-colors dark:text-white">
      <ShoppingCartIcon
        className={clsx(
          'h-8 w-auto transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400',
          className
        )}
      />

      {quantity ? (
        <div className="absolute right-0.5 top-1 h-4 w-4 rounded bg-primary-600 text-[11px] font-medium text-white">
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
