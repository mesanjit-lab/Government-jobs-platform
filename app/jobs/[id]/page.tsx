import Header from '../../components/Header'
import Footer from '../../components/Footer'
import {
  Building2, MapPin, Users, Calendar, GraduationCap,
  Clock, ExternalLink, Bell, BookmarkPlus, CheckCircle2,
  ChevronDown, ChevronRight, FileText, AlertCircle
} from 'lucide-react'

const orgLogos: Record<string, { bg: string, text: string, initials: string }> = {
  "Staff Selection Commission": { bg: "bg-blue-700", text: "text-white", initials: "SSC" },
  "Bihar Police Recruitment Board": { bg: "bg-yellow-500", text: "text-white", initials: "BP" },
  "Indian Railways": { bg: "bg-red-600", text: "text-white", initials: "RRB" },
  "UPSSSC": { bg: "bg-green-700", text: "text-white", initials: "UP" },
}

const jobs: Record<string, any> = {
  "1": {
    id: "1", slug: "ssc-chsl-2024",
    title: "SSC CHSL 2024", shortTitle: "SSC CHSL",
    organization: "SSC",
    advertisementNo: "SSC/CHSL/2024",
    description: "Combined Higher Secondary Level Examination 2024",
    publishedAt: "01 Jun 2024", updatedAt: "06 Sep 2026",
    status: "Application Open",
    totalVacancies: 3712,
    applicationStart: "01 Jun 2024", applicationEnd: "15 Jun 2024",
    feeLastDate: "16 Jun 2024", correctionDate: "17 Jun 2024",
    examDate: "To Be Announced", admitCardDate: "To Be Announced", resultDate: "To Be Announced",
    qualification: "12th Pass", minAge: 18, maxAge: 27,
    location: "All India", applyUrl: "https://ssc.nic.in",
    notificationUrl: "https://ssc.nic.in", officialUrl: "https://ssc.nic.in",
    fee: [
      { category: "General / OBC", amount: "100" },
      { category: "SC / ST", amount: "0" },
      { category: "Female", amount: "0" },
      { category: "PwBD", amount: "0" },
    ],
    vacancyDetails: [
      { post: "LDC / JSA", ur: 612, obc: 390, sc: 235, st: 117, ews: 156, total: 1510 },
      { post: "PA / SA", ur: 1234, obc: 823, sc: 612, st: 306, ews: 408, total: 3383 },
      { post: "DEO", ur: 245, obc: 163, sc: 98, st: 49, ews: 65, total: 620 },
    ],
    selectionProcess: ["Tier 1 (CBT)", "Tier 2 (CBT)", "Skill Test", "Merit List"],
    examPattern: [
      { subject: "General Intelligence", questions: 25, marks: 50, duration: "20" },
      { subject: "General Awareness", questions: 25, marks: 50, duration: "20" },
      { subject: "Quantitative Aptitude", questions: 25, marks: 50, duration: "20" },
      { subject: "English", questions: 25, marks: 50, duration: "20" },
    ],
    documents: ["Passport-size photograph", "Signature", "Educational certificates", "Identity proof", "Category certificate if applicable"],
    howToApply: ["Visit official SSC website", "Read official notification carefully", "Register / Login", "Fill application form", "Upload documents", "Pay fee if applicable", "Submit application", "Download/print application form"],
    faq: [
      { q: "When does SSC CHSL 2024 application start?", a: "Application started from 01 Jun 2024." },
      { q: "What is the last date to apply?", a: "Last date is 15 Jun 2024." },
      { q: "What is the application fee?", a: "General/OBC: Rs.100. SC/ST/Female/PwBD: Nil." },
      { q: "What is the age limit?", a: "Minimum 18 years, Maximum 27 years." },
      { q: "What qualification is required?", a: "12th Pass from a recognized board." },
    ],
    relatedJobs: [
      { id: "2", title: "Bihar Police Constable 2024", org: "Bihar Police", vacancies: "21391", qualification: "12th Pass", lastDate: "20 Jun 2024" },
      { id: "3", title: "Railway Group D 2024", org: "Indian Railways", vacancies: "32438", qualification: "10th Pass", lastDate: "25 Jun 2024" },
    ],
  },
  "2": {
    id: "2", slug: "bihar-police-2024",
    title: "Bihar Police Constable 2024", shortTitle: "Bihar Police",
    organization: "Bihar Police Recruitment Board",
    advertisementNo: "BPSSC/2024",
    description: "Bihar Police Constable Recruitment 2024",
    publishedAt: "01 May 2024", updatedAt: "06 Sep 2026",
    status: "Application Open",
    totalVacancies: 21391,
    applicationStart: "01 May 2024", applicationEnd: "20 Jun 2024",
    feeLastDate: "21 Jun 2024", correctionDate: "22 Jun 2024",
    examDate: "Aug 2024", admitCardDate: "Jul 2024", resultDate: "To Be Announced",
    qualification: "12th Pass", minAge: 18, maxAge: 25,
    location: "Bihar", applyUrl: "https://csbc.bih.nic.in",
    notificationUrl: "https://csbc.bih.nic.in", officialUrl: "https://csbc.bih.nic.in",
    fee: [
      { category: "General / OBC", amount: "200" },
      { category: "SC / ST", amount: "50" },
    ],
    vacancyDetails: [
      { post: "Constable (Male)", ur: 8000, obc: 4000, sc: 2000, st: 1000, ews: 1500, total: 16500 },
      { post: "Constable (Female)", ur: 2000, obc: 1000, sc: 500, st: 250, ews: 641, total: 4391 },
    ],
    selectionProcess: ["Written Test", "Physical Test", "Document Verification", "Merit List"],
    examPattern: [
      { subject: "General Knowledge", questions: 50, marks: 50, duration: "30" },
      { subject: "Hindi", questions: 25, marks: 25, duration: "15" },
      { subject: "Mathematics", questions: 25, marks: 25, duration: "15" },
    ],
    documents: ["Passport-size photograph", "Signature", "10th/12th Certificate", "Identity proof", "Category certificate", "Domicile certificate"],
    howToApply: ["Visit CSBC official website", "Read notification", "Register online", "Fill form", "Upload documents", "Pay fee", "Submit", "Print application"],
    faq: [
      { q: "What is the last date?", a: "20 Jun 2024." },
      { q: "What is the age limit?", a: "18-25 years." },
    ],
    relatedJobs: [
      { id: "1", title: "SSC CHSL 2024", org: "SSC", vacancies: "3712", qualification: "12th Pass", lastDate: "15 Jun 2024" },
    ],
  },
}

function AccordionSection({ title, icon, children, defaultOpen = false }: { title: string, icon: React.ReactNode, children: React.ReactNode, defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="bg-white rounded-xl border border-gray-100 shadow-sm group">
      <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none">
        <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
          {icon} {title}
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" />
      </summary>
      <div className="px-4 pb-4 text-xs text-gray-700">{children}</div>
    </details>
  )
}

export default async function JobDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = jobs[id]
  const logo = orgLogos[job?.organization] || { bg: "bg-blue-700", text: "text-white", initials: "MR" }

  if (!job) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-700">Job Not Found</h1>
          <a href="/jobs" className="text-blue-600 hover:underline mt-4 block">Back to Jobs</a>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-32">
      <Header />

      {/* Hero */}
      <div className="bg-blue-900 text-white py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-1 text-xs text-blue-200 mb-3">
            <a href="/" className="hover:text-white">Home</a>
            <ChevronRight className="w-3 h-3" />
            <a href="/jobs" className="hover:text-white">Latest Jobs</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">{job.shortTitle}</span>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="flex gap-4 flex-1">
              <div className={`w-16 h-16 rounded-xl ${logo.bg} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <span className={`${logo.text} font-black text-sm text-center leading-tight`}>{logo.initials}</span>
              </div>
              <div className="flex-1">
                <div className="flex gap-2 mb-2">
                  <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">{job.status}</span>
                  <span className="bg-blue-700 text-white text-xs px-2 py-0.5 rounded-full">Government Job</span>
                </div>
                <h1 className="text-2xl font-bold">{job.title}</h1>
                <p className="text-blue-200 text-sm mt-1">{job.organization}</p>
                <p className="text-blue-300 text-xs mt-0.5">{job.description}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-blue-200">
                  <span><FileText className="w-3 h-3 inline mr-1" />Advt. No. {job.advertisementNo}</span>
                  <span><Calendar className="w-3 h-3 inline mr-1" />Published: {job.publishedAt}</span>
                  <span><Clock className="w-3 h-3 inline mr-1" />Updated: {job.updatedAt}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:min-w-48">
              <a href={job.applyUrl} target="_blank" className="bg-white text-blue-900 font-bold text-sm px-4 py-2 rounded-lg hover:bg-blue-50 text-center flex items-center justify-center gap-1">
                Apply Online <ExternalLink className="w-3 h-3" />
              </a>
              <a href={job.notificationUrl} target="_blank" className="border border-white text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-800 text-center">
                Official Notification
              </a>
              <button className="border border-white text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-800 text-center flex items-center justify-center gap-1">
                <BookmarkPlus className="w-3 h-3" /> Save Job
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main layout — Left content + Right sticky sidebar */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start">

          {/* Left — Main content */}
          <div className="flex-1 space-y-4 min-w-0">

            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h2 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Quick Information
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: <Building2 className="w-4 h-4 text-blue-600" />, label: "Organization", value: job.organization.split(" ")[0] },
                  { icon: <Users className="w-4 h-4 text-blue-600" />, label: "Total Vacancies", value: job.totalVacancies.toLocaleString() },
                  { icon: <GraduationCap className="w-4 h-4 text-blue-600" />, label: "Qualification", value: job.qualification },
                  { icon: <MapPin className="w-4 h-4 text-blue-600" />, label: "Job Location", value: job.location },
                  { icon: <Clock className="w-4 h-4 text-blue-600" />, label: "Age Limit", value: `${job.minAge}-${job.maxAge} Years` },
                  { icon: <Calendar className="w-4 h-4 text-blue-600" />, label: "Last Date", value: job.applicationEnd },
                  { icon: <FileText className="w-4 h-4 text-blue-600" />, label: "Application Mode", value: "Online" },
                  { icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />, label: "Employment Type", value: "Govt Job" },
                ].map((item, i) => (
                  <div key={i} className="bg-blue-50 rounded-lg p-2.5 border border-blue-100">
                    <div className="flex items-center gap-1 mb-1">{item.icon}<span className="text-xs text-gray-500">{item.label}</span></div>
                    <div className="text-xs font-bold text-blue-900">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Dates + Age Limit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-3 py-2">
                <h2 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Important Dates
                </h2>
                <div className="space-y-0">
                  {[
                    { date: job.applicationStart, label: "Application Start Date", status: "done" },
                    { date: job.applicationEnd, label: "Last Date to Apply", status: "done" },
                    { date: job.feeLastDate, label: "Fee Payment Last Date", status: "active" },
                    { date: job.correctionDate, label: "Correction Last Date", status: "upcoming" },
                    { date: job.examDate, label: "Exam Date", status: "tba" },
                    { date: job.admitCardDate, label: "Admit Card Date", status: "tba" },
                    { date: job.resultDate, label: "Result Date", status: "tba" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        item.status === "done" ? "bg-green-500" :
                        item.status === "active" ? "bg-blue-600" :
                        item.status === "tba" ? "bg-gray-300" : "bg-orange-400"
                      }`}></div>
                      <div className="flex-1 flex justify-between items-center py-1 border-b border-gray-50">
                        <span className="text-xs text-gray-700">{item.label}</span>
                        <span className={`text-xs font-semibold ${
                          item.status === "done" ? "text-green-700" :
                          item.status === "active" ? "text-blue-700" :
                          item.status === "tba" ? "text-gray-400" : "text-orange-600"
                        }`}>{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <h2 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Age Limit
                </h2>
                <div className="space-y-2 text-xs text-gray-700">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-50 rounded-lg p-3 border border-green-100 text-center">
                      <div className="text-xs text-gray-500">Minimum Age</div>
                      <div className="text-2xl font-black text-green-700">{job.minAge}</div>
                      <div className="text-xs text-gray-500">Years</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 border border-red-100 text-center">
                      <div className="text-xs text-gray-500">Maximum Age</div>
                      <div className="text-2xl font-black text-red-700">{job.maxAge}</div>
                      <div className="text-xs text-gray-500">Years</div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-2 border border-yellow-100 mt-2">
                    <p className="text-xs text-yellow-800">Age relaxation applicable as per government rules for SC/ST/OBC/PwBD candidates.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fee + Educational Qualification */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:col-span-1">
                <h2 className="text-sm font-bold text-blue-900 mb-2">Application Fee</h2>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left py-1 px-2 text-gray-600 font-semibold">Category</th>
                      <th className="text-right py-1 px-2 text-gray-600 font-semibold">Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {job.fee.map((f: any, i: number) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="py-1 px-2 text-gray-700">{f.category}</td>
                        <td className="py-1 px-2 text-right font-semibold text-blue-900">
                          {f.amount === "0" ? "Nil" : `Rs.${f.amount}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-gray-400 mt-1">Payment via online payment methods.</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:col-span-2">
                <h2 className="text-sm font-bold text-blue-900 mb-2">Educational Qualification</h2>
                <div className="space-y-2 text-xs text-gray-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{job.qualification} from a recognized board/university.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Candidates must have passed qualifying examination from a recognized institution.</span>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2 mt-2 border border-blue-100">
                    <p className="text-xs text-blue-800 font-semibold">Required: {job.qualification}</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-2 mt-1 border border-yellow-100">
                    <p className="text-xs text-yellow-800 font-semibold">All candidates must read the official information completely before applying.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vacancy Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
              <h2 className="text-sm font-bold text-blue-900 mb-2">Vacancy Details</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left py-1.5 px-2 text-gray-600 font-semibold">Post</th>
                      <th className="text-center py-1.5 text-gray-600 font-semibold">UR</th>
                      <th className="text-center py-1.5 text-gray-600 font-semibold">OBC</th>
                      <th className="text-center py-1.5 text-gray-600 font-semibold">SC</th>
                      <th className="text-center py-1.5 text-gray-600 font-semibold">ST</th>
                      <th className="text-center py-1.5 text-gray-600 font-semibold">EWS</th>
                      <th className="text-center py-1.5 px-2 text-gray-600 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {job.vacancyDetails.map((v: any, i: number) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-blue-50">
                        <td className="py-1.5 px-2 text-blue-900 font-medium">{v.post}</td>
                        <td className="py-1.5 text-center text-gray-700">{v.ur}</td>
                        <td className="py-1.5 text-center text-gray-700">{v.obc}</td>
                        <td className="py-1.5 text-center text-gray-700">{v.sc}</td>
                        <td className="py-1.5 text-center text-gray-700">{v.st}</td>
                        <td className="py-1.5 text-center text-gray-700">{v.ews}</td>
                        <td className="py-1.5 text-center px-2 font-bold text-blue-900">{v.total}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 border-t-2 border-gray-200">
                      <td className="py-1.5 px-2 font-bold text-gray-700">Total</td>
                      <td className="py-1.5 text-center font-bold text-gray-700">{job.vacancyDetails.reduce((sum: number, v: any) => sum + v.ur, 0)}</td>
                      <td className="py-1.5 text-center font-bold text-gray-700">{job.vacancyDetails.reduce((sum: number, v: any) => sum + v.obc, 0)}</td>
                      <td className="py-1.5 text-center font-bold text-gray-700">{job.vacancyDetails.reduce((sum: number, v: any) => sum + v.sc, 0)}</td>
                      <td className="py-1.5 text-center font-bold text-gray-700">{job.vacancyDetails.reduce((sum: number, v: any) => sum + v.st, 0)}</td>
                      <td className="py-1.5 text-center font-bold text-gray-700">{job.vacancyDetails.reduce((sum: number, v: any) => sum + v.ews, 0)}</td>
                      <td className="py-1.5 text-center px-2 font-black text-blue-900">{job.vacancyDetails.reduce((sum: number, v: any) => sum + v.total, 0)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Selection Process + Salary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <h2 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Selection Process
                </h2>
                <div className="overflow-x-auto pb-2">
                  <div className="flex items-start min-w-max px-2">
                    {job.selectionProcess.map((step: string, i: number) => (
                      <div key={i} className="flex items-start">
                        <div className="flex flex-col items-center w-20">
                          <div className="flex items-center w-full">
                            {i > 0 && <div className="flex-1 h-0.5 bg-blue-500"></div>}
                            <div className="w-7 h-7 rounded-full bg-blue-700 border-2 border-blue-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {i + 1}
                            </div>
                            {i < job.selectionProcess.length - 1 && <div className="flex-1 h-0.5 bg-blue-500"></div>}
                          </div>
                          <div className="text-center mt-2 px-1">
                            <p className="text-xs font-semibold text-blue-900 leading-tight">{step}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <h2 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Salary / Pay Scale
                </h2>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                    <span className="text-gray-600">Pay Level</span>
                    <span className="font-bold text-blue-900">Level 4 - 7</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                    <span className="text-gray-600">Basic Pay</span>
                    <span className="font-bold text-blue-900">As per applicable pay level</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Other Benefits:</p>
                    <div className="flex flex-wrap gap-2">
                      {["DA", "HRA", "TA", "Medical Benefits", "Pension Scheme"].map((b) => (
                        <span key={b} className="bg-blue-50 text-blue-700 border border-blue-100 text-xs px-2 py-0.5 rounded-full">{b}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exam Pattern */}
            <AccordionSection title="Exam Pattern" icon={<FileText className="w-4 h-4" />}>
              <div className="overflow-x-auto mt-1">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left py-1.5 px-2 text-gray-600">Subject</th>
                      <th className="text-center py-1.5 text-gray-600">Questions</th>
                      <th className="text-center py-1.5 text-gray-600">Marks</th>
                      <th className="text-center py-1.5 text-gray-600">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {job.examPattern.map((e: any, i: number) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-blue-50">
                        <td className="py-1.5 px-2">{e.subject}</td>
                        <td className="py-1.5 text-center">{e.questions}</td>
                        <td className="py-1.5 text-center">{e.marks}</td>
                        <td className="py-1.5 text-center">{e.duration} Min</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 border-t-2 border-gray-200">
                      <td className="py-1.5 px-2 font-black text-gray-700">Total</td>
                      <td className="py-1.5 text-center font-black text-blue-900">{job.examPattern.reduce((sum: number, e: any) => sum + e.questions, 0)}</td>
                      <td className="py-1.5 text-center font-black text-blue-900">{job.examPattern.reduce((sum: number, e: any) => sum + e.marks, 0)}</td>
                      <td className="py-1.5 text-center font-black text-blue-900">{job.examPattern.reduce((sum: number, e: any) => sum + parseInt(e.duration), 0)} Min</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </AccordionSection>

            {/* Important Documents */}
            <AccordionSection title="Important Documents" icon={<FileText className="w-4 h-4" />}>
              <ul className="space-y-1.5 mt-1">
                {job.documents.map((doc: string, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" /> {doc}
                  </li>
                ))}
              </ul>
            </AccordionSection>

            {/* How to Apply */}
            <AccordionSection title="How to Apply" icon={<CheckCircle2 className="w-4 h-4" />}>
              <ol className="space-y-2 mt-1">
                {job.howToApply.map((step: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</div>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </AccordionSection>

            {/* Track + Applied */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h2 className="text-sm font-bold text-blue-900 mb-1 flex items-center gap-2">
                  <Bell className="w-4 h-4" /> Track This Recruitment
                </h2>
                <p className="text-xs text-gray-500 mb-3">Get notified whenever there is a new update for this recruitment.</p>
                <button className="w-full bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 mb-3">Track Job</button>
                <div className="space-y-1.5 text-xs text-gray-600">
                  {["Email", "WhatsApp", "SMS", "Push Notification"].map((ch) => (
                    <label key={ch} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" /> {ch}
                    </label>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h2 className="text-sm font-bold text-blue-900 mb-1">Already applied for this job?</h2>
                <p className="text-xs text-gray-500 mb-3">Mark this job as applied to track your application.</p>
                <button className="w-full border-2 border-blue-700 text-blue-700 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 mb-3">Mark as Applied</button>
                <div className="space-y-1 text-xs text-gray-500">
                  <div className="flex justify-between"><span>Application Date</span><span>-</span></div>
                  <div className="flex justify-between"><span>Application Number</span><span>-</span></div>
                  <div className="flex justify-between"><span>Admit Card Status</span><span>Not Available</span></div>
                  <div className="flex justify-between"><span>Result Status</span><span>Not Available</span></div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h2 className="text-sm font-bold text-blue-900 mb-3">FAQ</h2>
              <div className="space-y-2">
                {job.faq.map((item: any, i: number) => (
                  <details key={i} className="border border-gray-100 rounded-lg group">
                    <summary className="flex items-center justify-between px-3 py-2 cursor-pointer list-none text-xs font-semibold text-gray-800">
                      {item.q}
                      <ChevronDown className="w-3 h-3 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" />
                    </summary>
                    <div className="px-3 pb-2 text-xs text-gray-600">{item.a}</div>
                  </details>
                ))}
              </div>
            </div>

            {/* Related Jobs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h2 className="text-sm font-bold text-blue-900 mb-3">Related Jobs</h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {job.relatedJobs.map((rj: any) => (
                  <a key={rj.id} href={"/jobs/" + rj.id} className="min-w-48 border border-gray-100 rounded-xl p-3 hover:bg-blue-50 flex-shrink-0">
                    <div className="text-xs font-bold text-blue-900">{rj.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{rj.org}</div>
                    <div className="text-xs text-gray-600 mt-1">Vacancies: {rj.vacancies}</div>
                    <div className="text-xs text-gray-600">Qualification: {rj.qualification}</div>
                    <div className="text-xs text-red-500 mt-0.5">Last Date: {rj.lastDate}</div>
                  </a>
                ))}
              </div>
            </div>

            {/* Official Source */}
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
              <h2 className="text-sm font-bold text-blue-900 mb-1 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" /> Official Source
              </h2>
              <p className="text-xs text-gray-600 mb-2">MyResult provides recruitment information for informational purposes. Candidates should always verify important details from the official recruitment notification and official website.</p>
              <a href={job.officialUrl} target="_blank" className="text-xs text-blue-700 font-semibold hover:underline flex items-center gap-1">
                Official Website <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <a href="/jobs" className="block text-center text-xs text-blue-600 hover:underline pb-4">Back to All Jobs</a>
          </div>

          {/* Right — Sticky Important Links sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-4 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h2 className="text-sm font-bold text-blue-900 mb-3">Important Links</h2>
                <div className="space-y-2">
                  {[
                    { label: "Apply Online", url: job.applyUrl, type: "primary" },
                    { label: "Official Notification", url: job.notificationUrl, type: "secondary" },
                    { label: "Official Website", url: job.officialUrl, type: "secondary" },
                    { label: "Admit Card", url: "#", type: "secondary" },
                    { label: "Result", url: "#", type: "secondary" },
                    { label: "Answer Key", url: "#", type: "secondary" },
                    { label: "Exam Date", url: "#", type: "secondary" },
                    { label: "Short Notice", url: "#", type: "secondary" },
                  ].map((link, i) => (
                    <a key={i} href={link.url} target="_blank"
                      className={`flex items-center justify-center gap-1 w-full text-xs py-2 px-3 rounded-lg font-semibold ${
                        link.type === "primary"
                          ? "bg-blue-700 text-white hover:bg-blue-600"
                          : "border border-gray-200 text-blue-700 hover:bg-blue-50"
                      }`}>
                      {link.label}
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-blue-50 rounded-xl border border-yellow-100 p-3">
                <h3 className="text-xs font-bold text-blue-800 mb-2">Disclaimer</h3>
                <p className="text-xs text-gray-800 leading-relaxed">
                  The information provided on this vacancy page, including recruitment details, eligibility criteria, vacancies, important dates, application fees, selection process and other related information, is intended for general informational purposes only. Candidates are advised to verify all important details and the latest updates from the concerned official recruitment authority before applying.
                </p>
                <p className="text-xs text-gray-800 leading-relaxed mt-2">
                  My Result makes reasonable efforts to provide accurate and updated information but does not guarantee that all information is completely accurate, error-free or up to date. My Result shall not be responsible for any loss, inconvenience or consequences arising from errors, omissions or changes in the information provided.
                </p>
                <p className="text-xs text-gray-800 leading-relaxed mt-2">
                  For the latest and legally valid information, candidates should always refer to the official notification and official website of the concerned authority.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg px-4 py-3 z-50">
        <div className="max-w-6xl mx-auto flex gap-3">
          <a href={job.applyUrl} target="_blank" className="flex-1 bg-blue-700 text-white text-sm font-bold py-2.5 rounded-lg text-center hover:bg-blue-600">
            Apply Online
          </a>
          <button className="flex-1 border-2 border-blue-700 text-blue-700 text-sm font-bold py-2.5 rounded-lg hover:bg-blue-50">
            Track Job
          </button>
        </div>
      </div>

      <Footer />
    </main>
  )
}