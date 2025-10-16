'use client';

import { ReactNode } from 'react';

export default function WagmiProviderWrapper({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
