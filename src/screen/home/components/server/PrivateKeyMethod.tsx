export default function PrivateKeyMethod() {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-8">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center mb-6 shadow-xl opacity-50">
        <svg
          className="w-14 h-14 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M12 2a5 5 0 0 0-5 5c0 2.21 1.57 4.11 3.66 4.79L10 15h4l-.66-3.21C15.43 11.11 17 9.21 17 7a5 5 0 0 0-5-5z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="12" y1="15" x2="12" y2="19" strokeLinecap="round" />
          <line x1="8" y1="19" x2="16" y2="19" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-xl font-bold text-gray-500 mb-2">Private Key</p>
      <p className="text-gray-400 text-center mb-6">Coming Soon</p>
      <input
        type="password"
        placeholder="Enter your private key"
        disabled
        className="w-full max-w-md px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed mb-4 opacity-60"
      />
      <button
        disabled
        className="bg-gray-300 text-gray-500 font-semibold py-3 px-8 rounded-xl cursor-not-allowed opacity-60"
      >
        Not Available Yet
      </button>
    </div>
  );
}
