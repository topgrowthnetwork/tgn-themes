import Container from '@shared/components/container';
import clsx from 'clsx';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

function ActiveContainer({ children, className = '' }: Props) {
  return <Container className={clsx('max-w-screen-2xl', className)}>{children}</Container>;
}

export default ActiveContainer;
