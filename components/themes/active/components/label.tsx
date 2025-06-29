import clsx from 'clsx';
import Price from './price';

const Label = ({
  title,
  amount,
  currencyCode,
  originalAmount,
  position = 'bottom'
}: {
  title: string;
  amount: string;
  currencyCode: string;
  originalAmount?: string;
  position?: 'bottom' | 'center';
}) => {
  const hasDiscount = originalAmount && originalAmount !== amount;

  return (
    <div
      className={clsx('absolute bottom-0 left-0 flex w-full px-4 pb-4 @container/label', {
        'lg:px-20 lg:pb-[35%]': position === 'center'
      })}
    >
      <div className="flex items-center rounded-full border bg-white/70 p-1 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
        <h3 className="me-4 line-clamp-2 flex-grow ps-2 leading-none tracking-tight">{title}</h3>
        <div className="flex flex-none items-center gap-1 rounded-full bg-primary-600 p-2 text-white">
          {hasDiscount && (
            <Price
              className="text-xs line-through opacity-70"
              amount={originalAmount}
              currencyCode={currencyCode}
              currencyCodeClassName="hidden @[275px]/label:inline"
            />
          )}
          <Price
            className="text-sm"
            amount={amount}
            currencyCode={currencyCode}
            currencyCodeClassName="hidden @[275px]/label:inline"
          />
        </div>
      </div>
    </div>
  );
};

export default Label;
