import Container from '@theme/components/container';
import clsx from 'clsx';
import { ReactNode } from 'react';

type Props = {
  isStickyTop: boolean;
  children: ReactNode;
  heightInRems?: number;
  className?: string;
};

function StickyBar({ isStickyTop, children, heightInRems = 4, className = '' }: Props) {
  return (
    <div
      style={{
        ...(isStickyTop && { paddingTop: heightInRems + 'rem' }),
        ...(!isStickyTop && { paddingBottom: heightInRems + 'rem' })
      }}
    >
      <div
        className={clsx(
          'fixed left-0 right-0 z-20 bg-white',
          isStickyTop ? 'top-0' : 'bottom-0',
          className
        )}
        style={{ height: heightInRems + 'rem' }}
      >
        <Container className="!py-0">
          <div style={{ height: heightInRems + 'rem' }}>{children}</div>
        </Container>
      </div>
    </div>
  );
}

export default StickyBar;
