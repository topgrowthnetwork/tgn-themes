import BaseContainer from '@shared/components/container';
import clsx from 'clsx';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

function Container({ children, className = '' }: Props) {
  return <BaseContainer className={clsx('max-w-screen-xl', className)}>{children}</BaseContainer>;
}

export default Container;
