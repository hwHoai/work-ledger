export default function ServicesPage() {
  return (
    <section className="w-full px-6 py-12 md:py-20">
      <div className="max-w-screen-xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Our Services</h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          Blockchain-powered attendance solutions for modern workplaces
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-2xl mb-4">
              🔒
            </div>
            <h3 className="font-semibold text-xl mb-2">Secure Records</h3>
            <p className="text-gray-600 mb-4">
              Immutable blockchain storage ensures tamper-proof attendance records
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center text-white text-2xl mb-4">
              ⚡
            </div>
            <h3 className="font-semibold text-xl mb-2">Real-time Tracking</h3>
            <p className="text-gray-600 mb-4">
              Instant attendance verification with blockchain confirmations
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center text-white text-2xl mb-4">
              📊
            </div>
            <h3 className="font-semibold text-xl mb-2">Analytics & Reports</h3>
            <p className="text-gray-600 mb-4">
              Comprehensive insights and customizable reporting dashboards
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-red-400 flex items-center justify-center text-white text-2xl mb-4">
              🌐
            </div>
            <h3 className="font-semibold text-xl mb-2">Multi-location Support</h3>
            <p className="text-gray-600 mb-4">
              Manage attendance across multiple offices and remote teams
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
