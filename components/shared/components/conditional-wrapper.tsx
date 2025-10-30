import { ReactNode } from 'react';

type Props = {
  condition: boolean;
  wrap(children: ReactNode): ReactNode;
  children: ReactNode;
};

function ConditionlWrap({ condition, wrap, children }: Props) {
  return condition ? wrap(children) : children;
}

export default ConditionlWrap;
