export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left side */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 leading-tight">
            Find Your Perfect<br />
            <span className="text-blue-800">Government Job</span>
          </h1>
          <p className="text-sm text-gray-800 mt-3">
            Search thousands of jobs, results, admit cards and stay updated every day.
          </p>
          <div className="flex gap-6 mt-5 text-xs text-gray-700">
            <div className="flex items-center gap-1">
              <span className="text-lg">💼</span>
              <div>
                <div className="font-bold text-base text-blue-800">50K+</div>
                <div>Jobs Available</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg">📊</span>
              <div>
                <div className="font-bold text-base text-blue-800">100K+</div>
                <div>Results Declared</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg">👥</span>
              <div>
                <div className="font-bold text-base text-blue-800">10M+</div>
                <div>Users Trust Us</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg">🔔</span>
              <div>
                <div className="font-bold text-base text-blue-800">Daily</div>
                <div>Latest Updates</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Search */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex gap-2 mb-4 text-xs font-semibold">
            <button className="bg-blue-800 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-600">🔍 Search Jobs</button>
            <button className="text-gray-600 px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50">🔍 Search Results</button>
            <button className="text-gray-600 px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50">🔍 Search Admit Card</button>
          </div>

          {/* Search bar */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search for jobs, departments, exams..."
              className="flex-1 border-2 border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-700 placeholder-gray-400 bg-gray-50"
            />
            <button className="bg-blue-800 text-white px-4 py-2 rounded text-sm hover:bg-blue-600">Search</button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Qualification</label>
              <select className="w-full border-2 border-gray-300 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-500 bg-gray-50 text-gray-700">
                <option value="">Select</option>
                <option>10th Pass</option>
                <option>12th Pass</option>
                <option>Graduate</option>
                <option>Post Graduate</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
              <select className="w-full border-2 border-gray-300 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-500 bg-gray-50 text-gray-700">
                <option value="">Select</option>
                <option>Bihar</option>
                <option>Uttar Pradesh</option>
                <option>Delhi</option>
                <option>Rajasthan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
              <select className="w-full border-2 border-gray-300 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-500 bg-gray-50 text-gray-700">
                <option value="">Select</option>
                <option>General</option>
                <option>OBC</option>
                <option>SC</option>
                <option>ST</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Age</label>
              <div className="flex gap-1">
                <input type="number" placeholder="Min" className="w-full border-2 border-gray-300 rounded px-1 py-1.5 text-xs outline-none focus:border-blue-500 bg-gray-50 text-gray-700 placeholder-gray-400" />
                <input type="number" placeholder="Max" className="w-full border-2 border-gray-300 rounded px-1 py-1.5 text-xs outline-none focus:border-blue-500 bg-gray-50 text-gray-700 placeholder-gray-400" />
              </div>
            </div>
          </div>

          <button className="w-full bg-blue-800 text-white py-2 rounded text-sm font-semibold hover:bg-blue-600">🔍 Find My Jobs</button>
        </div>

      </div>
    </section>
  )
}