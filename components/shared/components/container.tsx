import clsx from 'clsx';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

function BaseContainer({ children, className = '' }: Props) {
  return (
    <div
      className={clsx('mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10', className)}
    >
      <div className="mx-auto sm:max-w-2xl lg:max-w-none">{children}</div>
    </div>
  );
}

export default BaseContainer;
