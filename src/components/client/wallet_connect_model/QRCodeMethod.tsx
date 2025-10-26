'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useCallback, useEffect, useState } from 'react';
import { useConnect, useDisconnect } from 'wagmi';
import { useAppDispatch } from '~/store/hooks';
import { closeWalletModal, setConnectedWallet } from '~/store/walletModalSlice';

export default function QRCodeMethod() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [connectUri, setConnectUri] = useState<string>('');
  const { connectAsync, connectors } = useConnect();
  const walletConnectConnector = connectors.find((c: { id: string }) => c.id === 'walletConnect');
  const { disconnectAsync } = useDisconnect();
  const dispatch = useAppDispatch();

  const handleMessage = useCallback((event: { type: string; data?: unknown; uid: string }) => {
    if (event.type === 'display_uri' && typeof event.data === 'string') {
      console.warn('Received connect URI:', event.data);
      setConnectUri(event.data);
      setIsLoading(false);
    }
  }, []);

  const handleConnectSuccess = useCallback(async (data: any) => {
    dispatch(setConnectedWallet(data.accounts[0]));
    setTimeout(() => {
      setIsLoading(false);
      dispatch(closeWalletModal());
    }, 1000);
  }, [dispatch]);

  useEffect(() => {
    if (!walletConnectConnector) {
      setError('There was an error to get the QR Code. Please try again later !');
      setIsLoading(false);
      // return an empty cleanup to keep consistent-return (always return a function)
      return () => {};
    }
    walletConnectConnector.emitter.on('message', handleMessage);
    walletConnectConnector.emitter.on('connect', handleConnectSuccess);

    (async () => {
      await disconnectAsync();
      await connectAsync({ connector: walletConnectConnector });
    })();

    return () => {
      walletConnectConnector.emitter.off('message', handleMessage);
      walletConnectConnector.emitter.off('connect', handleConnectSuccess);
    };
    // include dependencies used inside effect
  }, [walletConnectConnector, disconnectAsync, connectAsync, handleMessage, handleConnectSuccess]);

  const handleRefresh = async () => {
    setIsLoading(true);
    setError('');
    setConnectUri('');
    try {
      await disconnectAsync();
      await connectAsync({ connector: walletConnectConnector! });
    } catch (err) {
      setError('Failed to refresh the QR Code. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 px-6">
      {/* QR Code Container */}
      <div className="relative">
        {/* Animated gradient border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 rounded-3xl blur-lg opacity-75 animate-pulse" />

        <div className="relative w-80 h-80 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 rounded-3xl shadow-2xl overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-300/20 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-orange-300/20 to-transparent rounded-full blur-2xl" />

          {/* Content */}
          <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
            {error ? (
              // Error State
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center shadow-lg">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-800 mb-2">Connection Error</p>
                  <p className="text-sm text-gray-600 max-w-xs">{error}</p>
                </div>
                <button
                  onClick={handleRefresh}
                  className="mt-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  Try Again
                </button>
              </div>
            ) : isLoading ? (
              // Loading State
              <div className="flex flex-col items-center gap-6">
                {/* Animated spinner */}
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-8 border-transparent border-t-pink-500 border-r-rose-500 rounded-full animate-spin" />
                  <div
                    className="absolute inset-3 border-8 border-transparent border-b-orange-500 border-l-pink-400 rounded-full animate-spin"
                    style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
                  />
                  <div className="absolute inset-9 bg-gradient-to-br from-pink-400 via-rose-400 to-orange-400 rounded-full animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-orange-600 bg-clip-text text-transparent mb-2">
                    Generating QR Code
                  </p>
                  <p className="text-sm text-gray-500">Please wait a moment...</p>
                </div>
              </div>
            ) : (
              // QR Code Display
              <div className="flex flex-col items-center gap-4">
                {/* QR Code with white background */}
                <div className="p-4 bg-white rounded-2xl shadow-lg">
                  <QRCodeSVG
                    value={connectUri || 'https://example.com/wallet-connect'}
                    size={224}
                    level="H"
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Title and description */}
      <div className="mt-8 text-center space-y-2">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-orange-600 bg-clip-text text-transparent">
          Connect Your Wallet
        </h3>
      </div>

      {/* Refresh button */}
      {!error && (
        <button
          onClick={handleRefresh}
          className="mt-6 group flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all"
        >
          <svg
            className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Refresh Code</span>
        </button>
      )}
    </div>
  );
}
