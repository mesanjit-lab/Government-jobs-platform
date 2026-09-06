import Header from '../components/Header'
import Footer from '../components/Footer'

const jobs = [
  { id: 1, title: "SSC CHSL 2024", organization: "Staff Selection Commission", vacancies: "3712", qualification: "12th Pass", lastDate: "15 Jun 2024", status: "New", category: "Central Govt", state: "All India" },
  { id: 2, title: "Bihar Police Constable 2024", organization: "Bihar Police", vacancies: "21391", qualification: "12th Pass", lastDate: "20 Jun 2024", status: "New", category: "State Govt", state: "Bihar" },
  { id: 3, title: "Railway Group D 2024", organization: "Indian Railways", vacancies: "32438", qualification: "10th Pass", lastDate: "25 Jun 2024", status: "Hot", category: "Railway", state: "All India" },
  { id: 4, title: "UPSSSC PET 2024", organization: "UPSSSC", vacancies: "50000+", qualification: "12th Pass", lastDate: "30 Jun 2024", status: "Hot", category: "State Govt", state: "Uttar Pradesh" },
  { id: 5, title: "SSC CGL 2024", organization: "Staff Selection Commission", vacancies: "17727", qualification: "Graduate", lastDate: "10 Jul 2024", status: "Updated", category: "Central Govt", state: "All India" },
  { id: 6, title: "UPSC Civil Services 2024", organization: "UPSC", vacancies: "1056", qualification: "Graduate", lastDate: "20 Feb 2024", status: "Active", category: "Central Govt", state: "All India" },
  { id: 7, title: "Bihar BPSC 70th 2024", organization: "BPSC", vacancies: "2100", qualification: "Graduate", lastDate: "25 Jul 2024", status: "New", category: "State Govt", state: "Bihar" },
  { id: 8, title: "RRB ALP 2024", organization: "Railway Recruitment Board", vacancies: "5696", qualification: "10th Pass", lastDate: "30 Jul 2024", status: "New", category: "Railway", state: "All India" },
]

export default function JobsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* Page header */}
      <div className="bg-blue-800 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold">Latest Government Jobs 2024</h1>
          <p className="text-blue-200 text-sm mt-1">Find latest sarkari naukri, government jobs notifications</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-sm font-bold text-gray-800 mb-3">Filter Jobs</h2>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Qualification</label>
              <select className="w-full border border-gray-400 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-500 bg-gray-50">
                <option value="">All</option>
                <option>10th Pass</option>
                <option>12th Pass</option>
                <option>Graduate</option>
                <option>Post Graduate</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">State</label>
              <select className="w-full border border-gray-400 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-500 bg-gray-50">
                <option value="">All States</option>
                <option>Bihar</option>
                <option>Uttar Pradesh</option>
                <option>Delhi</option>
                <option>Rajasthan</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
              <select className="w-full border border-gray-400 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-500 bg-gray-50">
                <option value="">All</option>
                <option>Central Govt</option>
                <option>State Govt</option>
                <option>Railway</option>
                <option>Bank</option>
                <option>Defence</option>
              </select>
            </div>

            <button className="w-full bg-blue-700 text-white py-2 rounded text-xs font-semibold hover:bg-blue-600">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Jobs list */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-gray-800">All Jobs ({jobs.length})</h2>
              <select className="border border-gray-300 rounded px-2 py-1 text-xs outline-none">
                <option>Latest First</option>
                <option>Last Date</option>
                <option>Vacancies</option>
              </select>
            </div>

            <div className="space-y-3">
              {jobs.map((job) => (
                <a href={"/jobs/" + job.id} key={job.id} className="block border border-gray-100 rounded-lg p-3 hover:bg-blue-50 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-blue-800">{job.title}</h3>
                      <p className="text-xs text-gray-600 font-medium mt-0.5">{job.organization}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ml-2 ${
                      job.status === "New" ? "bg-green-100 text-green-700" :
                      job.status === "Hot" ? "bg-orange-100 text-orange-700" :
                      job.status === "Updated" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>{job.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
                    <span>👥 <strong>{job.vacancies}</strong> Vacancies</span>
                    <span>🎓 {job.qualification}</span>
                    <span>📍 {job.state}</span>
                    <span className="text-red-500">📅 Last Date: <strong>{job.lastDate}</strong></span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </main>
  )
}