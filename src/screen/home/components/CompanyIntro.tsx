export default function CompanyIntro() {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 flex flex-col justify-center overflow-y-auto max-h-full">
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to Work Ledger
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          The future of attendance tracking powered by blockchain technology
        </p>
      </div>

      {/* Features */}
      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-xl">
            🔒
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Secure & Transparent</h3>
            <p className="text-gray-600 text-sm">
              All attendance records are immutably stored on the blockchain, ensuring tamper-proof
              data integrity.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center text-white text-xl">
            ⚡
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Real-time Verification</h3>
            <p className="text-gray-600 text-sm">
              Instant confirmation and verification of attendance through blockchain consensus.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center text-white text-xl">
            📊
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Analytics Dashboard</h3>
            <p className="text-gray-600 text-sm">
              Comprehensive insights and reports for HR management and compliance tracking.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-red-400 flex items-center justify-center text-white text-xl">
            🌐
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Multi-platform Access</h3>
            <p className="text-gray-600 text-sm">
              Access from anywhere using web, mobile, or MetaMask wallet integration.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            5,000+
          </div>
          <div className="text-xs text-gray-500 mt-1">Employees</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-cyan-600 bg-clip-text text-transparent">
            99.8%
          </div>
          <div className="text-xs text-gray-500 mt-1">Accuracy</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
            24/7
          </div>
          <div className="text-xs text-gray-500 mt-1">Available</div>
        </div>
      </div>
    </div>
  );
}
