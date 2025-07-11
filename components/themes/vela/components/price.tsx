import clsx from 'clsx';

const Price = ({
  amount,
  className,
  currencyCode,
  currencyCodeClassName
}: {
  amount: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<'p'>) => (
  <p suppressHydrationWarning={true} className={className}>
    {`${new Intl.NumberFormat(undefined, {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parseFloat(amount))}`}
    <span className={clsx('ms-1 inline', currencyCodeClassName)}>{`${currencyCode}`}</span>
  </p>
);

export default Price;
