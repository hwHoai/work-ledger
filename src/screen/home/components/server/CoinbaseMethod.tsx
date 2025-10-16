export default function CoinbaseMethod() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center mb-6 shadow-xl opacity-50">
        <svg className="w-14 h-14 text-white" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      </div>
      <p className="text-xl font-bold text-gray-500 mb-2">Coinbase Wallet</p>
      <p className="text-gray-400 text-center mb-6">Coming Soon</p>
      <button
        disabled
        className="bg-gray-300 text-gray-500 font-semibold py-3 px-8 rounded-xl cursor-not-allowed opacity-60"
      >
        Not Available Yet
      </button>
    </div>
  );
}
