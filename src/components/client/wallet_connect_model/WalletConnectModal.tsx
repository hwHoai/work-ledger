'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { closeWalletModal } from '~/store/walletModalSlice';
import QRCodeMethod from '~/components/client/wallet_connect_model/QRCodeMethod';
import MetaMaskMethod from '~/components/client/wallet_connect_model/MetaMaskMethod';
import PrivateKeyMethod from '~/components/client/wallet_connect_model/PrivateKeyMethod';
import { Log } from 'viem';
import CoinbaseMethod from './CoinbaseMethod';
import { WalletMethod } from '~/types/wallet-connect-methods';
import { CONNECT_MODEL_CONSTANTS } from '~/config/constants/connect-model.const';


export default function WalletConnectModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.walletModal.isOpen);
  const [selectedMethod, setSelectedMethod] = useState<WalletMethod>('QRCodeMethod');

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(closeWalletModal());
  };

  const handleMethodSelect = (method: WalletMethod) => {
    setSelectedMethod(method);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 px-6 py-5 flex items-center justify-between">
          <h2 id="modal-title" className="text-xl font-bold text-white">
            Connect Wallet
          </h2>
          <button
            onClick={handleClose}
            className="text-white/90 hover:text-white hover:bg-white/20 transition-all p-2 rounded-full"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="min-h-[320px] bg-gray-50">
          {selectedMethod === 'QRCodeMethod' && <QRCodeMethod />}{' '}
          {selectedMethod === 'MetaMaskMethod' && <MetaMaskMethod />}{' '}
          {selectedMethod === 'CoinbaseMethod' && <CoinbaseMethod />}{' '}
          {selectedMethod === 'PrivateKeyMethod' && <PrivateKeyMethod />}
        </div>

        <div className="bg-white border-t-2 border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-3 text-center font-medium">
            Choose connection method:
          </p>
          <div className="grid grid-cols-4 gap-2">
            {CONNECT_MODEL_CONSTANTS.SUPPORTED_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => !method.disabled && handleMethodSelect(method.id)}
                disabled={method.disabled}
                className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all duration-200 ${
                  method.disabled
                    ? 'bg-gray-200 opacity-50 cursor-not-allowed'
                    : 'hover:shadow-md hover:-translate-y-0.5'
                } ${
                  selectedMethod === method.id && !method.disabled
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                    : method.disabled
                      ? ''
                      : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <span className="text-xl">{method.icon}</span>
                <span
                  className={`text-[10px] font-semibold leading-tight ${
                    selectedMethod === method.id && !method.disabled
                      ? 'text-white'
                      : method.disabled
                        ? 'text-gray-400'
                        : 'text-gray-700'
                  }`}
                >
                  {method.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
