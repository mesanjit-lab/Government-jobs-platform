import { getLatestRecruitments } from '../../lib/data/recruitments'

export default function LatestJobs() {
  const jobs = getLatestRecruitments()
  return (
    <div className="bg-white rounded-xl shadow p-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-bold text-gray-800">🔥 Latest Jobs</h2>
        <a href="/jobs" className="text-xs text-blue-600 hover:underline">View All</a>
      </div>

      {/* Job rows */}
      <div className="space-y-1">
        {jobs.map((job) => (
          <a href={job.detail ? "/jobs/" + job.id : undefined} key={job.id} className={`grid grid-cols-12 items-center text-xs py-2 px-1 border-b border-gray-50 rounded transition ${job.detail ? 'hover:bg-blue-50' : ''}`}>
            <div className="col-span-4">
              <div className="font-semibold text-blue-800 leading-tight">{job.title}</div>
              <div className="text-gray-600 text-xs font-medium">{job.organization.name}</div>
            </div>
            <span className="col-span-2 text-center text-gray-700 font-medium">{job.vacancies}</span>
            <span className="col-span-2 text-center text-gray-600">{job.qualification}</span>
            <span className="col-span-2 text-center text-gray-600">{job.lastDate}</span>
            <div className="col-span-2 text-center">
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                job.status === "New" ? "bg-green-100 text-green-700" :
                job.status === "Hot" ? "bg-orange-100 text-orange-700" :
                "bg-blue-100 text-blue-700"
              }`}>{job.status}</span>
            </div>
          </a>
        ))}
      </div>

      <a href="/jobs" className="block text-center text-xs text-blue-600 mt-2 hover:underline">View All Latest Jobs →</a>
    </div>
  )
}
