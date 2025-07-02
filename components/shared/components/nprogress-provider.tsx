'use client';

import { AppProgressProvider } from '@bprogress/next';

const NProgressProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppProgressProvider
      height="2px"
      color="var(--theme-color-600)"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </AppProgressProvider>
  );
};

export default NProgressProvider;
