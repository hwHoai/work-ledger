import { WalletMethod } from '~/types/wallet-connect-methods';

export class CONNECT_MODEL_CONSTANTS {
  static readonly SUPPORTED_METHODS = [
    {
      id: 'QRCodeMethod' as WalletMethod,
      name: 'QR Code',
      icon: '📱',
      disabled: false,
    },
    {
      id: 'MetaMaskMethod' as WalletMethod,
      name: 'MetaMask',
      icon: '🦊',
      disabled: true,
    },
    {
      id: 'CoinbaseMethod' as WalletMethod,
      name: 'Coinbase',
      icon: '💙',
      disabled: true,
    },
    {
      id: 'PrivateKeyMethod' as WalletMethod,
      name: 'Private Key',
      icon: '🔑',
      disabled: true,
    },
  ];
}
