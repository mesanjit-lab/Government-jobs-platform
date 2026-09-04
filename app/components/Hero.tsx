export default function Hero() {
  return (
    <section className="bg-blue-700 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Headline */}
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Find Your Perfect Government Job
        </h1>
        <p className="text-blue-100 mb-8 text-sm md:text-base">
          Search latest government jobs, results, admit cards and more — all in one place.
        </p>

        {/* Search Box */}
        <div className="bg-white rounded-lg p-2 flex flex-col md:flex-row gap-2 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search jobs, departments, exams..."
            className="flex-1 px-4 py-2 text-gray-700 rounded outline-none text-sm"
          />
          <button className="bg-yellow-400 text-blue-900 font-bold px-6 py-2 rounded hover:bg-yellow-300 text-sm">
            Find My Jobs
          </button>
        </div>

        {/* Filter tags */}
        <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs">
          <span className="bg-blue-600 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-500">10th Pass</span>
          <span className="bg-blue-600 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-500">12th Pass</span>
          <span className="bg-blue-600 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-500">Graduate</span>
          <span className="bg-blue-600 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-500">Bihar</span>
          <span className="bg-blue-600 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-500">UP</span>
          <span className="bg-blue-600 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-500">Railway</span>
          <span className="bg-blue-600 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-500">SSC</span>
        </div>

      </div>
    </section>
  )
}