const jobs = [
  {
    id: 1,
    title: "SSC CGL 2024",
    organization: "Staff Selection Commission",
    vacancies: "17727",
    qualification: "Graduate",
    lastDate: "31 Oct 2024",
    status: "Active",
  },
  {
    id: 2,
    title: "UPSC Civil Services 2024",
    organization: "Union Public Service Commission",
    vacancies: "1056",
    qualification: "Graduate",
    lastDate: "20 Feb 2024",
    status: "Active",
  },
  {
    id: 3,
    title: "Railway RRB NTPC 2024",
    organization: "Railway Recruitment Board",
    vacancies: "11558",
    qualification: "12th Pass",
    lastDate: "20 Mar 2024",
    status: "Active",
  },
  {
    id: 4,
    title: "Bihar Police Constable 2024",
    organization: "Bihar Police",
    vacancies: "21391",
    qualification: "12th Pass",
    lastDate: "15 Nov 2024",
    status: "Active",
  },
]

export default function LatestJobs() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      {/* Section header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">🔥 Latest Jobs</h2>
        <a href="/jobs" className="text-sm text-blue-700 font-medium hover:underline">
          View All Jobs →
        </a>
      </div>

      {/* Job cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-600 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-blue-700 text-sm">{job.title}</h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                {job.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-2">{job.organization}</p>
            <div className="grid grid-cols-2 gap-1 text-xs text-gray-600 mb-3">
              <span>📋 Vacancies: <strong>{job.vacancies}</strong></span>
              <span>🎓 {job.qualification}</span>
              <span>📅 Last Date: <strong>{job.lastDate}</strong></span>
            </div>
            <a href={`/jobs/${job.id}`} className="block text-center bg-blue-700 text-white text-xs py-1.5 rounded hover:bg-blue-600">
              View Details
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}