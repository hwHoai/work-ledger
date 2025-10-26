'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Transport,
  useAccount,
  useConfig,
  useConnect,
  useDisconnect,
  useSimulateContract,
  useWatchContractEvent,
  useWriteContract,
} from 'wagmi';
import {
  BLOCKCHAIN_CONSTANTS,
  CONSTRACT_ABI,
  EVENT_ABI,
} from '~/config/constants/blockchain.const';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { RootState } from '~/store/store';
import { openWalletModal } from '~/store/walletModalSlice';
import { axiosInstance } from '~/config/axios.config';
import Toast from '~/components/ui/Toast';
import { setActiveIndex } from '~/store/navigationSlice';

export default function CheckInForm() {
  const dispatch = useAppDispatch();
  const writeContractAsync = useWriteContract().writeContractAsync;
  const { isOpen: isWalletModalOpen, connectedWallet } = useAppSelector(
    (state: RootState) => state.walletModal,
  );
  const onConnectWallet = () => {
    dispatch(openWalletModal());
  };
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [pendingTxHash, setPendingTxHash] = useState<string | null>(null);
  const [txConfirmed, setTxConfirmed] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type?: 'info' | 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'info',
  });
  const confirmTimer = useRef<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();

  const simulateContract = useSimulateContract({
    abi: [CONSTRACT_ABI.CHECK_IN],
    address: BLOCKCHAIN_CONSTANTS.CHECK_IN_CONTRACT_ADDRESS as `0x${string}`,
    account: connectedWallet as `0x${string}`,
    functionName: 'checkIn',
  });

  useWatchContractEvent({
    address: BLOCKCHAIN_CONSTANTS.CHECK_IN_CONTRACT_ADDRESS as `0x${string}`,
    abi: [EVENT_ABI.EMPLOYEE_CHECKED_IN_ABI],
    eventName: 'CheckedIn',
    onLogs: async (logs: any[]) => {
      console.warn('Employee Checked In Event Logs:', logs);
      try {
        Promise.all(
          logs.map(async (log) => {
            await axiosInstance.post('/employee/checkin', {
              employeeWallet: log.args.empWallet,
              contractAddress: BLOCKCHAIN_CONSTANTS.CHECK_IN_CONTRACT_ADDRESS,
              blockTimestamp: log.blockTimestamp,
              blockHash: log.blockHash,
              blockNumber: Number(log.blockNumber).toString(),
              logIndex: Number(log.logIndex),
              transactionHash: log.transactionHash,
              transactionIndex: log.transactionIndex,
              createdAt: new Date(Number(log.args.timestamps)),
            } as any);
          }),
        );
  setIsSuccess(true);
        setIsError(false);
        setTxConfirmed(true);
        setToast({ visible: true, message: 'Check-in confirmed', type: 'success' });
        if (confirmTimer.current) {
          window.clearTimeout(confirmTimer.current);
          confirmTimer.current = null;
        }
      } catch (error) {
        console.error('Error processing CheckedIn event logs:', error);
        const msg = (error as any)?.message || String(error);
        setIsSuccess(false);
        setIsError(true);
        setErrorMessage(msg);
        setToast({ visible: true, message: 'Error processing event: ' + msg, type: 'error' });
        if (confirmTimer.current) {
          window.clearTimeout(confirmTimer.current);
          confirmTimer.current = null;
        }
      } finally {
        setIsCheckingIn(false);
        if (disconnectAsync) {
          disconnectAsync().catch((err) => console.warn('disconnect failed', err));
        }
      }
    },
  });

  useEffect(() => {
    if (isWalletModalOpen) {
      return;
    }
    if (!connectedWallet) {
      return;
    }
    if (!isConnected) {
      return;
    }

    try {
      (async () => {
        setIsCheckingIn(true);
        if (!simulateContract?.data?.request) {
          return;
        }
        await writeContractAsync(simulateContract.data?.request);
      })();
    } catch (error) {
      console.error('Check-in failed:', error);
      setIsCheckingIn(false);
    }
  }, [isWalletModalOpen, connectedWallet, isConnected, simulateContract, writeContractAsync]);

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!connectedWallet) {
      dispatch(openWalletModal());
      return;
    }

    if (!simulateContract?.data?.request) {
      console.error('Unable to prepare transaction request');
      return;
    }

    try {
      setIsCheckingIn(true);
      const res: any = await writeContractAsync(simulateContract.data?.request);
      const txHash = res?.hash || res?.transactionHash || (typeof res === 'string' ? res : null);
      if (txHash) {
        setPendingTxHash(txHash);
        setToast({
          visible: true,
          message: `Transaction sent ${txHash.slice(0, 8)}...`,
          type: 'info',
        });
      } else {
        setToast({ visible: true, message: 'Transaction submitted', type: 'info' });
      }

      // Start fallback timer: if no onLogs confirmation within 2 minutes, notify user and clear state
      if (confirmTimer.current) {
        window.clearTimeout(confirmTimer.current);
      }
      confirmTimer.current = window.setTimeout(
        () => {
          if (!txConfirmed) {
            setToast({
              visible: true,
              message: 'Still waiting for confirmation — please check the tx on explorer',
              type: 'info',
            });
            setIsCheckingIn(false);
          }
          confirmTimer.current = null;
        },
        2 * 60 * 1000,
      );
      // keep isCheckingIn true until event handler sets it false
    } catch (err) {
      console.error('Check-in submit error', err);
      const message = (err as any)?.message || 'Transaction failed';
      // Detect common chain configuration error from wagmi/viem and give a helpful message
      if (typeof message === 'string' && message.toLowerCase().includes('chain not configured')) {
        setToast({
          visible: true,
          message:
            'Target chain is not configured in the app. Please enable the correct chain in `src/config/wagmi.config.ts`.',
          type: 'error',
        });
      } else {
        setToast({ visible: true, message, type: 'error' });
      }
      setErrorMessage(message);
      setIsError(true);
      setIsCheckingIn(false);
      if (confirmTimer.current) {
        window.clearTimeout(confirmTimer.current);
        confirmTimer.current = null;
      }
    }
  };

  // Clear timer when component unmounts
  useEffect(() => {
    return () => {
      if (confirmTimer.current) {
        window.clearTimeout(confirmTimer.current);
      }
    };
  }, []);

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 flex flex-col justify-center">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">Employee Check-In</h2>
        <p className="text-gray-600 text-center">Record your attendance on the blockchain</p>
      </div>

      {/* Form */}
      <div className="space-y-6 flex flex-row items-center gap-4 px-8 justify-between">
        {/* Employee ID Input */}
        <div className="flex-1">
          <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">
            Employee ID
          </label>
          <input
            type="text"
            id="employeeId"
            placeholder="Enter your employee ID"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Buttons in Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isCheckingIn}
            className={`py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
              isCheckingIn
                ? 'bg-blue-400 text-white cursor-not-allowed opacity-80'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            {isCheckingIn ? (
              <span className="flex items-center gap-3">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Checking in...
              </span>
            ) : (
              'Submit Attendance'
            )}
          </button>

          {/* MetaMask Connect Button */}
          <button
            type="button"
            onClick={onConnectWallet}
            disabled={isCheckingIn}
            aria-busy={isCheckingIn}
            className={`flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
              isCheckingIn
                ? 'bg-orange-300 text-white cursor-not-allowed opacity-80'
                : 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M37.5 7.5L22.5 18.75L25 12.5L37.5 7.5Z" fill="currentColor" opacity="0.8" />
              <path d="M2.5 7.5L17.5 18.75L15 12.5L2.5 7.5Z" fill="currentColor" opacity="0.8" />
              <path d="M32.5 27.5L28.75 33.75L37.5 36.25L40 27.5H32.5Z" fill="currentColor" />
              <path d="M0 27.5L2.5 36.25L11.25 33.75L7.5 27.5H0Z" fill="currentColor" />
            </svg>
            Use Wallet
          </button>
        </div>
      </div>

      {/* Info Text */}
      <p className="text-xs text-gray-500 text-center mt-6">
        Your attendance will be securely recorded on the blockchain
      </p>
      {isCheckingIn && (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm text-gray-700">
          {/* spinner: use animate-spin and an arc path so rotation is visible */}
          <svg className="w-4 h-4 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span>Waiting for blockchain confirmation — please keep this tab open.</span>
        </div>
      )}
      {pendingTxHash && (
        <div className="mt-3 text-center text-sm">
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-full border border-gray-200">
            <span className="font-medium">Pending Tx:</span>
            <a
              href={`https://sepolia.etherscan.io/tx/${pendingTxHash}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              {pendingTxHash.slice(0, 10)}...
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(pendingTxHash || '');
                setToast({ visible: true, message: 'Transaction hash copied', type: 'success' });
              }}
              className="ml-2 text-xs text-gray-600 hover:text-gray-800"
              type="button"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-900 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 6L9 17l-5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="font-medium">Check-in confirmed</div>
          </div>
          {pendingTxHash && (
            <a
              href={`https://sepolia.etherscan.io/tx/${pendingTxHash}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-green-700 underline"
            >
              View transaction
            </a>
          )}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => dispatch(setActiveIndex(1))}
              className="px-3 py-1 bg-green-600 text-white rounded-md text-sm"
            >
              View Attendance
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSuccess(false);
                setPendingTxHash(null);
              }}
              className="px-3 py-1 border rounded-md text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {isError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-900 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 17h.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="font-medium">Check-in failed</div>
          </div>
          {errorMessage && (
            <div className="text-sm text-red-700 max-w-lg text-center">{errorMessage}</div>
          )}
          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                setIsError(false);
                setErrorMessage(null);
                setPendingTxHash(null);
                setIsCheckingIn(false);
              }}
              className="px-3 py-1 border rounded-md text-sm"
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isCheckingIn}
              className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
            >
              Retry
            </button>
            {errorMessage && (
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(errorMessage || '');
                  setToast({ visible: true, message: 'Error copied', type: 'info' });
                }}
                className="px-3 py-1 border rounded-md text-sm"
              >
                Copy Details
              </button>
            )}
          </div>
        </div>
      )}

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((s) => ({ ...s, visible: false }))}
      />
    </div>
  );
}
