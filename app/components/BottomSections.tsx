const closingSoonJobs = [
  { id: 1, title: "SSC CHSL 2024", daysLeft: "10 Days Left", urgent: true },
  { id: 2, title: "Bihar Police Constable 2024", daysLeft: "15 Days Left", urgent: false },
  { id: 3, title: "Railway Group D 2024", daysLeft: "20 Days Left", urgent: false },
  { id: 4, title: "UPSSSC PET 2024", daysLeft: "25 Days Left", urgent: false },
  { id: 5, title: "SSC CGL 2024", daysLeft: "35 Days Left", urgent: false },
]

const states = [
  "Bihar", "Uttar Pradesh", "Rajasthan", "Madhya Pradesh", "Delhi",
  "Haryana", "Punjab", "Jharkhand", "West Bengal", "Maharashtra",
  "Tamil Nadu", "Karnataka",
]

const qualifications = [
  "10th Pass", "12th Pass", "ITI", "Diploma", "Graduate",
  "BCA", "B.Sc", "B.Com", "BA", "M.Sc", "M.Com", "Post Graduate",
]

export default function BottomSections() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-4">

      {/* Closing Soon */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold text-gray-800">⏰ Closing Soon Jobs</h2>
          <a href="/jobs" className="text-xs text-blue-600 hover:underline">View All</a>
        </div>
        <div className="space-y-2">
          {closingSoonJobs.map((job) => (
            <a href={"/jobs/" + job.id} key={job.id} className="flex justify-between items-center py-2 border-b border-gray-100 hover:bg-gray-50 px-1 rounded">
              <span className="text-xs text-gray-700">{job.title}</span>
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${job.urgent ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"}`}>
                {job.daysLeft}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Jobs by State */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold text-gray-800">📍 Jobs by State</h2>
          <a href="/jobs" className="text-xs text-blue-600 hover:underline">View All</a>
        </div>
        <div className="flex flex-wrap gap-2">
          {states.map((state) => (
            <a key={state} href={"/jobs?state=" + state}
              className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full hover:bg-blue-100 hover:border-blue-400 transition font-medium">
              {state}
            </a>
          ))}
        </div>
      </div>

      {/* Jobs by Qualification */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold text-gray-800">🎓 Jobs by Qualification</h2>
          <a href="/jobs" className="text-xs text-blue-600 hover:underline">View All</a>
        </div>
        <div className="flex flex-wrap gap-2">
          {qualifications.map((qual) => (
            <a key={qual} href={"/jobs?qualification=" + qual}
              className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full hover:bg-green-100 hover:border-green-400 transition font-medium">
              {qual}
            </a>
          ))}
        </div>
      </div>

    </section>
  )
}