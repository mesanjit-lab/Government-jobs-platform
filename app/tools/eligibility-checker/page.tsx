'use client'
import { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { ChevronRight, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'

const jobs = [
  {
    id: 1, title: "SSC CGL 2024", organization: "Staff Selection Commission",
    minAge: 18, maxAge: 32, qualification: "graduate",
    category: "central", state: "all",
    fee: { general: 100, obc: 100, sc: 0, st: 0, female: 0 },
    vacancies: 17727, lastDate: "10 Jul 2024"
  },
  {
    id: 2, title: "SSC CHSL 2024", organization: "Staff Selection Commission",
    minAge: 18, maxAge: 27, qualification: "12th",
    category: "central", state: "all",
    fee: { general: 100, obc: 100, sc: 0, st: 0, female: 0 },
    vacancies: 3712, lastDate: "15 Jun 2024"
  },
  {
    id: 3, title: "Bihar Police Constable 2024", organization: "Bihar Police",
    minAge: 18, maxAge: 25, qualification: "12th",
    category: "state", state: "bihar",
    fee: { general: 200, obc: 200, sc: 50, st: 50, female: 0 },
    vacancies: 21391, lastDate: "20 Jun 2024"
  },
  {
    id: 4, title: "Railway Group D 2024", organization: "Indian Railways",
    minAge: 18, maxAge: 33, qualification: "10th",
    category: "railway", state: "all",
    fee: { general: 500, obc: 500, sc: 250, st: 250, female: 250 },
    vacancies: 32438, lastDate: "25 Jun 2024"
  },
  {
    id: 5, title: "UPSC Civil Services 2024", organization: "UPSC",
    minAge: 21, maxAge: 32, qualification: "graduate",
    category: "central", state: "all",
    fee: { general: 100, obc: 100, sc: 0, st: 0, female: 0 },
    vacancies: 1056, lastDate: "20 Feb 2024"
  },
  {
    id: 6, title: "BPSC 70th 2024", organization: "BPSC",
    minAge: 20, maxAge: 37, qualification: "graduate",
    category: "state", state: "bihar",
    fee: { general: 600, obc: 600, sc: 150, st: 150, female: 150 },
    vacancies: 2100, lastDate: "25 Jul 2024"
  },
  {
    id: 7, title: "RRB NTPC 2024", organization: "Railway Recruitment Board",
    minAge: 18, maxAge: 33, qualification: "12th",
    category: "railway", state: "all",
    fee: { general: 500, obc: 500, sc: 250, st: 250, female: 250 },
    vacancies: 11558, lastDate: "30 Jul 2024"
  },
  {
    id: 8, title: "UPSSSC PET 2024", organization: "UPSSSC",
    minAge: 18, maxAge: 40, qualification: "12th",
    category: "state", state: "up",
    fee: { general: 185, obc: 185, sc: 95, st: 95, female: 95 },
    vacancies: 50000, lastDate: "30 Jun 2024"
  },
]

const qualificationLevels: Record<string, number> = {
  "8th": 1, "10th": 2, "12th": 3, "iti": 3, "diploma": 4,
  "bca": 5, "bsc": 5, "bcom": 5, "ba": 5, "btech": 5, "be": 5,
  "graduate": 5, "mca": 6, "msc": 6, "mcom": 6, "ma": 6,
  "mtech": 6, "me": 6, "mba": 6, "postgraduate": 6, "phd": 7
}

export default function EligibilityCheckerPage() {
  const [age, setAge] = useState('')
  const [qualification, setQualification] = useState('')
  const [category, setCategory] = useState('')
  const [gender, setGender] = useState('')
  const [state, setState] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [checked, setChecked] = useState(false)

  const checkEligibility = () => {
    if (!age || !qualification || !category || !gender || !state) {
      alert('Please fill all fields.')
      return
    }

    const userAge = parseInt(age)
    const userQualLevel = qualificationLevels[qualification] || 0

    const checked = jobs.map(job => {
      const checks = []

      // Age check
      const ageRelaxation = category === 'sc' || category === 'st' ? 5 :
        category === 'obc' ? 3 : 0
      const maxAgeWithRelax = job.maxAge + ageRelaxation
      const ageOk = userAge >= job.minAge && userAge <= maxAgeWithRelax
      checks.push({
        label: 'Age',
        ok: ageOk,
        msg: ageOk
          ? `${userAge} years — within ${job.minAge}-${job.maxAge} years`
          : `${userAge} years — required ${job.minAge}-${job.maxAge} years${ageRelaxation > 0 ? ` (+${ageRelaxation} relaxation)` : ''}`
      })

      // Qualification check
      const jobQualLevel = qualificationLevels[job.qualification] || 0
      const qualOk = userQualLevel >= jobQualLevel
      checks.push({
        label: 'Qualification',
        ok: qualOk,
        msg: qualOk
          ? `${qualification.toUpperCase()} — meets requirement`
          : `${qualification.toUpperCase()} — required ${job.qualification.toUpperCase()}`
      })

      // State check
      const stateOk = job.state === 'all' || job.state === state
      checks.push({
        label: 'State',
        ok: stateOk,
        msg: stateOk ? 'Open for your state' : `Only for ${job.state.toUpperCase()} residents`
      })

      // Fee
      const fee = gender === 'female' ? job.fee.female :
        category === 'sc' ? job.fee.sc :
        category === 'st' ? job.fee.st :
        category === 'obc' ? job.fee.obc : job.fee.general

      const eligible = ageOk && qualOk && stateOk

      return { ...job, checks, eligible, fee }
    })

    setResults(checked)
    setChecked(true)
  }

  const eligible = results.filter(r => r.eligible)
  const notEligible = results.filter(r => !r.eligible)

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-blue-900 text-white py-4 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-1 text-xs text-blue-200 mb-2">
            <a href="/" className="hover:text-white">Home</a>
            <ChevronRight className="w-3 h-3" />
            <a href="/tools" className="hover:text-white">Tools</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Eligibility Checker</span>
          </div>
          <h1 className="text-xl font-bold">Eligibility Checker</h1>
          <p className="text-blue-200 text-sm mt-1">Check which government jobs you are eligible for</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-bold text-blue-900 mb-4">Enter Your Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Your Age</label>
              <input type="number" placeholder="e.g. 24" value={age}
                onChange={(e) => setAge(e.target.value)} min={1} max={60}
                className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600 bg-blue-50 text-blue-900 font-semibold" />
            </div>

            {/* Qualification */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Highest Qualification</label>
              <select value={qualification} onChange={(e) => setQualification(e.target.value)}
                className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600 bg-blue-50 text-blue-900 font-semibold">
                <option value="">Select Qualification</option>
                <optgroup label="School Level">
                  <option value="8th">8th Pass</option>
                  <option value="10th">10th Pass / Matriculation</option>
                  <option value="12th">12th Pass / Intermediate</option>
                  <option value="iti">ITI</option>
                  <option value="diploma">Diploma / Polytechnic</option>
                </optgroup>
                <optgroup label="Graduation">
                  <option value="ba">BA (Bachelor of Arts)</option>
                  <option value="bsc">B.Sc (Bachelor of Science)</option>
                  <option value="bcom">B.Com (Bachelor of Commerce)</option>
                  <option value="btech">B.Tech / B.E (Engineering)</option>
                  <option value="bca">BCA (Computer Applications)</option>
                  <option value="graduate">Any Other Graduate</option>
                </optgroup>
                <optgroup label="Post Graduation">
                  <option value="ma">MA (Master of Arts)</option>
                  <option value="msc">M.Sc (Master of Science)</option>
                  <option value="mcom">M.Com (Master of Commerce)</option>
                  <option value="mtech">M.Tech / M.E (Engineering)</option>
                  <option value="mca">MCA (Computer Applications)</option>
                  <option value="mba">MBA</option>
                  <option value="postgraduate">Any Other Post Graduate</option>
                </optgroup>
                <optgroup label="Higher Education">
                  <option value="phd">Ph.D / Doctorate</option>
                </optgroup>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600 bg-blue-50 text-blue-900 font-semibold">
                <option value="">Select Category</option>
                <option value="general">General</option>
                <option value="obc">OBC</option>
                <option value="sc">SC</option>
                <option value="st">ST</option>
                <option value="ews">EWS</option>
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}
                className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600 bg-blue-50 text-blue-900 font-semibold">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* State */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Your State</label>
              <select value={state} onChange={(e) => setState(e.target.value)}
                className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600 bg-blue-50 text-blue-900 font-semibold">
                <option value="">Select State</option>
                <option value="bihar">Bihar</option>
                <option value="up">Uttar Pradesh</option>
                <option value="delhi">Delhi</option>
                <option value="rajasthan">Rajasthan</option>
                <option value="jharkhand">Jharkhand</option>
                <option value="mp">Madhya Pradesh</option>
                <option value="maharashtra">Maharashtra</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <button onClick={checkEligibility}
            className="w-full mt-4 bg-blue-700 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-600">
            ✅ Check My Eligibility
          </button>
        </div>

        {/* Results */}
        {checked && (
          <>
            {/* Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-xl border border-green-100 p-3 text-center">
                <div className="text-2xl font-black text-green-700">{eligible.length}</div>
                <div className="text-xs text-green-600">Eligible Jobs</div>
              </div>
              <div className="bg-red-50 rounded-xl border border-red-100 p-3 text-center">
                <div className="text-2xl font-black text-red-600">{notEligible.length}</div>
                <div className="text-xs text-red-500">Not Eligible</div>
              </div>
            </div>

            {/* Eligible Jobs */}
            {eligible.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h2 className="text-sm font-bold text-green-700 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Eligible Jobs ({eligible.length})
                </h2>
                <div className="space-y-3">
                  {eligible.map((job) => (
                    <div key={job.id} className="border border-green-100 rounded-lg p-3 bg-green-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-sm font-bold text-blue-900">{job.title}</h3>
                          <p className="text-xs text-gray-500">{job.organization}</p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Eligible ✓</span>
                      </div>
                      <div className="space-y-1 mb-2">
                        {job.checks.map((check: any, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            {check.ok
                              ? <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                              : <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />}
                            <span className={check.ok ? 'text-gray-600' : 'text-red-500'}>{check.label}: {check.msg}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-green-100">
                        <span>👥 {job.vacancies.toLocaleString()} Vacancies</span>
                        <span>💰 Fee: Rs.{job.fee}</span>
                        <span>📅 {job.lastDate}</span>
                      </div>
                      <a href={"/jobs/" + job.id}
                        className="block mt-2 text-center text-xs bg-blue-700 text-white py-1.5 rounded-lg hover:bg-blue-600">
                        View Details →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Not Eligible */}
            {notEligible.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h2 className="text-sm font-bold text-red-600 mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Not Eligible ({notEligible.length})
                </h2>
                <div className="space-y-2">
                  {notEligible.map((job) => (
                    <div key={job.id} className="border border-red-100 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xs font-bold text-gray-700">{job.title}</h3>
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Not Eligible</span>
                      </div>
                      <div className="space-y-0.5">
                        {job.checks.filter((c: any) => !c.ok).map((check: any, i: number) => (
                          <div key={i} className="flex items-center gap-1 text-xs text-red-500">
                            <XCircle className="w-3 h-3 flex-shrink-0" />
                            <span>{check.label}: {check.msg}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Disclaimer */}
        <div className="bg-yellow-50 rounded-xl border border-yellow-100 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-700">This eligibility check is based on general criteria and is for reference only. Always verify eligibility from the official recruitment notification before applying.</p>
          </div>
        </div>

        <a href="/tools" className="block text-center text-xs text-blue-600 hover:underline">← Back to Tools</a>
      </div>

      <Footer />
    </main>
  )
}