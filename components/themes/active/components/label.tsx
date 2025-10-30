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
      className={clsx('absolute bottom-0 left-0 flex w-full px-4 pb-4', {
        'lg:px-20 lg:pb-[35%]': position === 'center'
      })}
    >
      <div className="flex w-full flex-col gap-2 rounded-2xl border bg-white/70 p-2 text-xs font-semibold text-black backdrop-blur-md">
        {/* sm:flex-row sm:items-center sm:gap-0 sm:rounded-full */}
        <h3 className="line-clamp-1 flex-grow tracking-tight sm:me-2 sm:line-clamp-2">{title}</h3>
        <div className="flex flex-none items-center gap-1 self-start rounded-full bg-primary-600 px-3 py-1.5 text-white sm:py-2">
          {hasDiscount && (
            <Price
              className="text-xs line-through opacity-70"
              amount={originalAmount}
              currencyCode={currencyCode}
              currencyCodeClassName="hidden sm:inline"
            />
          )}
          <Price
            className="text-sm"
            amount={amount}
            currencyCode={currencyCode}
            currencyCodeClassName="hidden sm:inline"
          />
        </div>
      </div>
    </div>
  );
};

export default Label;
