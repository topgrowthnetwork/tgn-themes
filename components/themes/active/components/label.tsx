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
      className={clsx('absolute bottom-0 left-0 flex w-full px-2 pb-2', {
        'lg:px-20 lg:pb-[35%]': position === 'center'
      })}
    >
      <div className="flex w-full flex-col gap-1 rounded-2xl border bg-white/70 px-2 py-1.5 text-xs font-semibold text-black backdrop-blur-md">
        {/* sm:flex-row sm:items-center sm:gap-0 sm:rounded-full */}
        <h3 className="line-clamp-1 flex-grow tracking-tight">{title}</h3>
        <div
          className={clsx(
            'flex flex-none self-start rounded-full bg-primary-600 px-3 py-1 text-white',
            hasDiscount
              ? 'xs:flex-row xs:items-center xs:gap-1 flex-col items-start gap-0.5'
              : 'items-center'
          )}
        >
          {hasDiscount && (
            <Price
              className="text-xs line-through opacity-70"
              amount={originalAmount}
              currencyCode={currencyCode}
              // currencyCodeClassName="hidden sm:inline"
            />
          )}
          <Price
            className="text-sm"
            amount={amount}
            currencyCode={currencyCode}
            // currencyCodeClassName="hidden sm:inline"
          />
        </div>
      </div>
    </div>
  );
};

export default Label;
