export default function MetaMaskMethod() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-6 shadow-xl">
        <svg className="w-14 h-14 text-white" viewBox="0 0 40 40" fill="currentColor">
          <path d="M37.5 7.5L22.5 18.75L25 12.5L37.5 7.5Z" opacity="0.9" />
          <path d="M2.5 7.5L17.5 18.75L15 12.5L2.5 7.5Z" opacity="0.9" />
          <path d="M32.5 27.5L28.75 33.75L37.5 36.25L40 27.5H32.5Z" />
          <path d="M0 27.5L2.5 36.25L11.25 33.75L7.5 27.5H0Z" />
        </svg>
      </div>
      <p className="text-xl font-bold text-gray-900 mb-2">Connect with MetaMask</p>
      <p className="text-gray-600 text-center mb-6">
        Connect using your MetaMask browser extension
      </p>
      <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-8 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
        Open MetaMask
      </button>
    </div>
  );
}
