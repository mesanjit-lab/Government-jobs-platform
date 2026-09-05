const jobs = [
  { id: 1, title: "SSC CHSL 2024", organization: "Combined Higher Secondary Level", vacancies: "3712", qualification: "12th Pass", lastDate: "15 Jun 2024", status: "New" },
  { id: 2, title: "Bihar Police Constable 2024", organization: "Bihar Police Recruitment", vacancies: "21391", qualification: "12th Pass", lastDate: "20 Jun 2024", status: "New" },
  { id: 3, title: "Railway Group D 2024", organization: "Indian Railways Recruitment", vacancies: "32438", qualification: "10th Pass", lastDate: "25 Jun 2024", status: "Hot" },
  { id: 4, title: "UPSSSC PET 2024", organization: "Uttar Pradesh PET Exam", vacancies: "50000+", qualification: "12th Pass", lastDate: "30 Jun 2024", status: "Hot" },
  { id: 5, title: "SSC CGL 2024", organization: "Combined Graduate Level", vacancies: "17727", qualification: "Graduate", lastDate: "10 Jul 2024", status: "Updated" },
]

export default function LatestJobs() {
  return (
    <div className="bg-white rounded-xl shadow p-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-bold text-gray-800">🔥 Latest Jobs</h2>
        <a href="/jobs" className="text-xs text-blue-600 hover:underline">View All</a>
      </div>
      <div className="space-y-1.5">
        {jobs.map((job) => (
          <a href={"/jobs/" + job.id} key={job.id} className="block border border-gray-100 rounded-lg px-2 py-1.5 hover:bg-blue-50 transition">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-blue-700">{job.title}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ml-1 ${
                job.status === "New" ? "bg-green-100 text-green-700" :
                job.status === "Hot" ? "bg-orange-100 text-orange-700" :
                "bg-blue-100 text-blue-700"
              }`}>{job.status}</span>
            </div>
            <p className="text-xs text-gray-400">{job.organization}</p>
            <div className="flex gap-3 mt-1 text-xs">
              <span className="text-gray-600">👥 <strong>{job.vacancies}</strong> Vacancies</span>
              <span className="text-gray-600">🎓 <strong>{job.qualification}</strong></span>
              <span className="text-red-500">📅 <strong>{job.lastDate}</strong></span>
            </div>
          </a>
        ))}
      </div>
      <a href="/jobs" className="block text-center text-xs text-blue-600 mt-2 hover:underline">View All Jobs →</a>
    </div>
  )
}