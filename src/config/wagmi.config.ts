import { defineChain, http } from 'viem';
import { createConfig, injected } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { walletConnect } from 'wagmi/connectors';

const localnetChain = defineChain({
  id: 31337,
  name: 'Localnet',
  network: 'localnet',
  nativeCurrency: {
    name: 'Go',
    symbol: 'GO',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_LOCAL_NETWORK_URL!] },
  },
});

export const config = createConfig({
  chains: [localnetChain, sepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
      showQrModal: false,
    }),
  ],
  transports: {
    [localnetChain.id]: http(),
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_TEST_RPC_URL!),
  },
});
