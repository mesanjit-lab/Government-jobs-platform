'use client'
import { useState, useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ChevronRight } from 'lucide-react'

export default function AgeCalculatorPage() {
  const [dobDay, setDobDay] = useState('')
  const [dobMonth, setDobMonth] = useState('')
  const [dobYear, setDobYear] = useState('')
  const [asOnDay, setAsOnDay] = useState('')
  const [asOnMonth, setAsOnMonth] = useState('')
  const [asOnYear, setAsOnYear] = useState('')
  const [tillNow, setTillNow] = useState(false)
  const [result, setResult] = useState<any>(null)

  const asOnDayRef = useRef<HTMLSelectElement>(null)
  const asOnMonthRef = useRef<HTMLSelectElement>(null)
  const asOnYearRef = useRef<HTMLSelectElement>(null)
  const calcBtnRef = useRef<HTMLButtonElement>(null)

  const months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' },
    { value: '03', label: 'March' }, { value: '04', label: 'April' },
    { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' },
    { value: '09', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' },
  ]

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))
  const yearsList = Array.from({ length: 80 }, (_, i) => String(new Date().getFullYear() - i))

  const today = new Date()
  const todayStr = {
    day: String(today.getDate()).padStart(2, '0'),
    month: String(today.getMonth() + 1).padStart(2, '0'),
    year: String(today.getFullYear())
  }

  const handleTillNow = (checked: boolean) => {
    setTillNow(checked)
    if (checked) {
      setAsOnDay(todayStr.day)
      setAsOnMonth(todayStr.month)
      setAsOnYear(todayStr.year)
    } else {
      setAsOnDay('')
      setAsOnMonth('')
      setAsOnYear('')
    }
  }

  const handleDobDayChange = (val: string) => {
    setDobDay(val)
    if (val) asOnDayRef.current?.focus()
  }

  const handleDobMonthChange = (val: string) => {
    setDobMonth(val)
  }

  const handleDobYearChange = (val: string) => {
    setDobYear(val)
    if (val && !tillNow) asOnDayRef.current?.focus()
    if (val && tillNow) calcBtnRef.current?.focus()
  }

  const handleAsOnYearChange = (val: string) => {
    setAsOnYear(val)
    if (val) calcBtnRef.current?.focus()
  }

  const calculateAge = () => {
    const d = asOnDay || todayStr.day
    const m = asOnMonth || todayStr.month
    const y = asOnYear || todayStr.year

    if (!dobDay || !dobMonth || !dobYear) {
      setResult({ error: "Please fill Date of Birth." })
      return
    }

    const dobDate = new Date(`${dobYear}-${dobMonth}-${dobDay}`)
    const asOn = new Date(`${y}-${m}-${d}`)

    if (dobDate > asOn) {
      setResult({ error: "Date of birth cannot be after the reference date." })
      return
    }

    let years2 = asOn.getFullYear() - dobDate.getFullYear()
    let months2 = asOn.getMonth() - dobDate.getMonth()
    let days2 = asOn.getDate() - dobDate.getDate()

    if (days2 < 0) {
      months2--
      const prevMonth = new Date(asOn.getFullYear(), asOn.getMonth(), 0)
      days2 += prevMonth.getDate()
    }

    if (months2 < 0) {
      years2--
      months2 += 12
    }

    const totalDays = Math.floor((asOn.getTime() - dobDate.getTime()) / (1000 * 60 * 60 * 24))
    const totalMonths = years2 * 12 + months2
    const totalWeeks = Math.floor(totalDays / 7)

    setResult({ years: years2, months: months2, days: days2, totalDays, totalMonths, totalWeeks, error: null })
  }

  const inputClass = "w-full border-2 border-blue-200 rounded-lg px-2 py-2 text-sm outline-none focus:border-blue-600 bg-blue-50 text-blue-900 font-semibold"

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
            <span className="text-white">Age Calculator</span>
          </div>
          <h1 className="text-xl font-bold">Age Calculator</h1>
          <p className="text-blue-200 text-sm mt-1">Calculate your exact age for government job eligibility</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-bold text-blue-900 mb-4">Enter Details</h2>

          {/* Date of Birth */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-blue-800 mb-2">📅 Date of Birth</label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Day</label>
                <select value={dobDay} onChange={(e) => handleDobDayChange(e.target.value)} className={inputClass}>
                  <option value="">DD</option>
                  {days.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Month</label>
                <select value={dobMonth} onChange={(e) => handleDobMonthChange(e.target.value)} className={inputClass}>
                  <option value="">MM</option>
                  {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Year</label>
                <select value={dobYear} onChange={(e) => handleDobYearChange(e.target.value)} className={inputClass}>
                  <option value="">YYYY</option>
                  {yearsList.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-2">
              <label className="block text-xs text-gray-400 mb-1">Or enter manually (DD/MM/YYYY)</label>
              <input
                type="text"
                placeholder="e.g. 15/08/1998"
                maxLength={10}
                onKeyDown={(e) => { if (e.key === 'Enter') asOnDayRef.current?.focus() }}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9/]/g, '')
                  const parts = val.split('/')
                  if (parts[0]) setDobDay(parts[0].padStart(2, '0'))
                  if (parts[1]) setDobMonth(parts[1].padStart(2, '0'))
                  if (parts[2]) { setDobYear(parts[2]); if (parts[2].length === 4) asOnDayRef.current?.focus() }
                }}
                className="w-full border-2 border-blue-100 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-blue-50 text-blue-900 font-semibold placeholder-gray-400"
              />
            </div>
          </div>

          {/* As On Date */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-blue-800">📅 As On Date (Reference Date)</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tillNow}
                  onChange={(e) => handleTillNow(e.target.checked)}
                  className="w-4 h-4 accent-blue-700"
                />
                <span className="text-xs font-semibold text-blue-700">Till Now (Today)</span>
              </label>
            </div>

            {tillNow ? (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg px-3 py-2 text-sm font-bold text-blue-900">
                Today: {todayStr.day}/{todayStr.month}/{todayStr.year}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Day</label>
                    <select ref={asOnDayRef} value={asOnDay} onChange={(e) => { setAsOnDay(e.target.value); asOnMonthRef.current?.focus() }} className={inputClass}>
                      <option value="">DD</option>
                      {days.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Month</label>
                    <select ref={asOnMonthRef} value={asOnMonth} onChange={(e) => { setAsOnMonth(e.target.value); asOnYearRef.current?.focus() }} className={inputClass}>
                      <option value="">MM</option>
                      {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Year</label>
                    <select ref={asOnYearRef} value={asOnYear} onChange={(e) => handleAsOnYearChange(e.target.value)} className={inputClass}>
                      <option value="">YYYY</option>
                      {yearsList.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-xs text-gray-400 mb-1">Or enter manually (DD/MM/YYYY)</label>
                  <input
                    type="text"
                    placeholder="e.g. 01/01/2024"
                    maxLength={10}
                    onKeyDown={(e) => { if (e.key === 'Enter') calcBtnRef.current?.focus() }}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9/]/g, '')
                      const parts = val.split('/')
                      if (parts[0]) setAsOnDay(parts[0].padStart(2, '0'))
                      if (parts[1]) setAsOnMonth(parts[1].padStart(2, '0'))
                      if (parts[2]) { setAsOnYear(parts[2]); if (parts[2].length === 4) calcBtnRef.current?.focus() }
                    }}
                    className="w-full border-2 border-blue-100 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-blue-50 text-blue-900 font-semibold placeholder-gray-400"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Usually the last date of application</p>
              </>
            )}
          </div>

          <button
            ref={calcBtnRef}
            onClick={calculateAge}
            className="w-full bg-blue-700 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
          >
            Calculate Age
          </button>
        </div>

        {/* Result */}
        {result && (
          result.error ? (
            <div className="bg-red-50 rounded-xl border border-red-100 p-4">
              <p className="text-sm text-red-600 font-semibold">{result.error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-700 rounded-xl p-5 text-white text-center">
                <p className="text-sm text-blue-200 mb-1">Your Age is</p>
                <div className="flex justify-center gap-6">
                  <div>
                    <div className="text-4xl font-black">{result.years}</div>
                    <div className="text-xs text-blue-200">Years</div>
                  </div>
                  <div className="text-3xl font-light text-blue-300">:</div>
                  <div>
                    <div className="text-4xl font-black">{result.months}</div>
                    <div className="text-xs text-blue-200">Months</div>
                  </div>
                  <div className="text-3xl font-light text-blue-300">:</div>
                  <div>
                    <div className="text-4xl font-black">{result.days}</div>
                    <div className="text-xs text-blue-200">Days</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
                  <div className="text-xl font-black text-blue-900">{result.totalDays.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Total Days</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
                  <div className="text-xl font-black text-blue-900">{result.totalWeeks.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Total Weeks</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
                  <div className="text-xl font-black text-blue-900">{result.totalMonths.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Total Months</div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <h3 className="text-sm font-bold text-blue-900 mb-3">Common Age Eligibility Check</h3>
                <div className="space-y-2">
                  {[
                    { label: "SSC CGL (18-32 years)", min: 18, max: 32 },
                    { label: "SSC CHSL (18-27 years)", min: 18, max: 27 },
                    { label: "Bihar Police Constable (18-25 years)", min: 18, max: 25 },
                    { label: "UPSC IAS (21-32 years)", min: 21, max: 32 },
                    { label: "RRB NTPC (18-33 years)", min: 18, max: 33 },
                  ].map((item, i) => {
                    const eligible = result.years >= item.min && result.years <= item.max
                    return (
                      <div key={i} className="flex justify-between items-center py-1.5 border-b border-gray-50">
                        <span className="text-xs text-gray-700">{item.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${eligible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                          {eligible ? "Eligible ✓" : "Not Eligible ✗"}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        )}

        <div className="bg-yellow-50 rounded-xl border border-yellow-100 p-4">
          <h3 className="text-xs font-bold text-yellow-800 mb-1">Note</h3>
          <p className="text-xs text-yellow-700">Age eligibility is calculated as on the last date of application. Age relaxation is applicable for SC/ST/OBC/PwBD candidates as per government rules. Always verify from official notification.</p>
        </div>

        <a href="/tools" className="block text-center text-xs text-blue-600 hover:underline">← Back to Tools</a>
      </div>

      <Footer />
    </main>
  )
}