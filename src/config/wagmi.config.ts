import { Account, Chain, Client, defineChain, http } from 'viem';
import { createConfig, injected, Transport } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { walletConnect } from 'wagmi/connectors';

// const localnetChain = defineChain({
//   id: 31337,
//   name: 'Localnet',
//   network: 'localnet',
//   nativeCurrency: {
//     name: 'Go',
//     symbol: 'GO',
//     decimals: 18,
//   },
//   rpcUrls: {
//     default: { http: [process.env.NEXT_PUBLIC_LOCAL_NETWORK_URL!] },
//   },
// });

export const clientConfig = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
      showQrModal: false,
    }),
  ],
  ssr: false,
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_TEST_RPC_URL!),
  },
});

export const serverConfig = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_TEST_RPC_URL!),
  },
});

export const simulateContractConfig: Client<Transport, Chain | undefined, Account | undefined> =
  createConfig({
    chains: [sepolia],
    transports: {
      [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_TEST_RPC_URL!),
    },
  }) as unknown as Client<Transport, Chain | undefined, Account | undefined>;
