'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '~/config/wagmi.config';

interface IWagmiProviderWrapperProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

export function WagmiProviderWrapper({ children }: IWagmiProviderWrapperProps) {
  const [clientConfig, setClientConfig] = useState<any | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Only run on client and after mount
    (async () => {
      if (typeof window === 'undefined') return;

      try {
        // Lazy import config so walletConnect code isn't executed on server
        const mod = await import('~/config/wagmi.config');
        if (!mounted) return;

        // Optional: avoid multiple inits across HMR by setting global flag
        if ((window as any).__WAGMI_PROVIDER_MOUNTED) {
          console.warn(
            'WagmiProvider already mounted previously in this session — skipping re-init.',
          );
          setReady(false);
          return;
        }
        (window as any).__WAGMI_PROVIDER_MOUNTED = true;

        setClientConfig(mod.config);
        setReady(true);
      } catch (e) {
        console.error('Failed to load wagmi config client-side:', e);
        setReady(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Render children during SSR / before config loaded to avoid indexedDB usage on server
  if (!ready || typeof window === 'undefined' || !clientConfig) {
    return <>{children}</>;
  }

  return (
    <WagmiProvider config={clientConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
