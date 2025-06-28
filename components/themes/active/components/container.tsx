import Container from '@shared/components/container';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

function ActiveContainer({ children, className = '' }: Props) {
  return <Container className={className}>{children}</Container>;
}

export default ActiveContainer;
