export default function AttendancePage() {
  return (
    <section className="w-full px-6 py-12 md:py-20">
      <div className="max-w-screen-xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Attendance Dashboard</h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          View and manage employee attendance records
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              247
            </div>
            <div className="text-sm text-gray-500 mt-2">Present Today</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-cyan-50 rounded-lg">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-cyan-600 bg-clip-text text-transparent">
              98.5%
            </div>
            <div className="text-sm text-gray-500 mt-2">Attendance Rate</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-orange-50 rounded-lg">
            <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
              12
            </div>
            <div className="text-sm text-gray-500 mt-2">On Leave</div>
          </div>
        </div>
      </div>
    </section>
  );
}
