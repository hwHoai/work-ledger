import { useAppDispatch } from '~/store/hooks';
import { openWalletModal } from '~/store/walletModalSlice';

export default function CheckInForm() {
  const dispatch = useAppDispatch();

  const onConnectWallet = () => {
    dispatch(openWalletModal());
  };
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
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Submit Attendance
          </button>

          {/* MetaMask Connect Button */}
          <button
            type="button"
            onClick={onConnectWallet}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
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
    </div>
  );
}
