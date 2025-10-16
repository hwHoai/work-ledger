export default function TrendPage() {
  return (
    <section className="w-full px-6 py-12 md:py-20">
      <div className="max-w-screen-xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Attendance Trends</h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          Analyze patterns and trends in attendance data
        </p>

        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Weekly Trend</h3>
            <p className="text-gray-600">
              Average attendance increased by{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                5.2%
              </span>{' '}
              this week
            </p>
          </div>
          <div className="p-6 bg-gradient-to-r from-green-50 to-cyan-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Monthly Overview</h3>
            <p className="text-gray-600">
              Consistent performance with{' '}
              <span className="bg-gradient-to-r from-green-600 to-cyan-600 bg-clip-text text-transparent font-bold">
                97.8%
              </span>{' '}
              average rate
            </p>
          </div>
          <div className="p-6 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Peak Hours</h3>
            <p className="text-gray-600">
              Most check-ins occur between{' '}
              <span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent font-bold">
                8:00-9:00 AM
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
