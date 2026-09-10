'use client'
import { useState, useRef } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { ChevronRight } from 'lucide-react'

export default function AgeCalculatorPage() {
  const [dobDay, setDobDay] = useState('')
  const [dobMonth, setDobMonth] = useState('')
  const [dobYear, setDobYear] = useState('')
  const [asOnDay, setAsOnDay] = useState('')
  const [asOnMonth, setAsOnMonth] = useState('')
  const [asOnYear, setAsOnYear] = useState('')
  const [tillNow, setTillNow] = useState(false)
  const [dobManual, setDobManual] = useState('')
  const [asOnManual, setAsOnManual] = useState('')
  const [result, setResult] = useState<any>(null)

  const [todayStr] = useState(() => {
    const today = new Date()
    return {
      day: String(today.getDate()).padStart(2, '0'),
      month: String(today.getMonth() + 1).padStart(2, '0'),
      year: String(today.getFullYear())
    }
  })

  const asOnSectionRef = useRef<HTMLDivElement>(null)
  const asOnDayRef = useRef<HTMLSelectElement>(null)
  const asOnMonthRef = useRef<HTMLSelectElement>(null)
  const asOnYearRef = useRef<HTMLSelectElement>(null)
  const tillNowRef = useRef<HTMLInputElement>(null)
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

  const handleTillNow = (checked: boolean) => {
    setTillNow(checked)
    if (checked) {
      setAsOnDay(todayStr.day)
      setAsOnMonth(todayStr.month)
      setAsOnYear(todayStr.year)
      setTimeout(() => calcBtnRef.current?.focus(), 100)
    } else {
      setAsOnDay('')
      setAsOnMonth('')
      setAsOnYear('')
      setAsOnManual('')
    }
  }

  // Format manual input with auto slash
  const formatManual = (val: string, prev: string) => {
    let digits = val.replace(/[^0-9]/g, '')
    let formatted = ''
    if (digits.length <= 2) {
      formatted = digits
    } else if (digits.length <= 4) {
      formatted = digits.slice(0, 2) + '/' + digits.slice(2)
    } else {
      formatted = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4, 8)
    }
    return formatted
  }

  const handleDobManual = (val: string) => {
    const formatted = formatManual(val, dobManual)
    setDobManual(formatted)
    const parts = formatted.split('/')
    if (parts[0]?.length === 2) setDobDay(parts[0])
    if (parts[1]?.length === 2) setDobMonth(parts[1])
    if (parts[2]?.length === 4) {
      setDobYear(parts[2])
      // Auto move to As On section
      setTimeout(() => {
        asOnSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        if (tillNow) calcBtnRef.current?.focus()
        else asOnDayRef.current?.focus()
      }, 200)
    }
  }

  const handleAsOnManual = (val: string) => {
    const formatted = formatManual(val, asOnManual)
    setAsOnManual(formatted)
    const parts = formatted.split('/')
    if (parts[0]?.length === 2) setAsOnDay(parts[0])
    if (parts[1]?.length === 2) setAsOnMonth(parts[1])
    if (parts[2]?.length === 4) {
      setAsOnYear(parts[2])
      setTimeout(() => calcBtnRef.current?.focus(), 200)
    }
  }

  const calculateAge = () => {
    const d = tillNow ? todayStr.day : asOnDay
    const m = tillNow ? todayStr.month : asOnMonth
    const y = tillNow ? todayStr.year : asOnYear

    if (!dobDay || !dobMonth || !dobYear) {
      setResult({ error: "Please fill Date of Birth." })
      return
    }
    if (!d || !m || !y) {
      setResult({ error: "Please fill As On Date or select Till Now." })
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
          <div className="mb-5">
            <label className="block text-xs font-bold text-blue-800 mb-2">📅 Date of Birth</label>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Day</label>
                <select value={dobDay} onChange={(e) => { setDobDay(e.target.value) }} className={inputClass}>
                  <option value="">DD</option>
                  {days.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Month</label>
                <select value={dobMonth} onChange={(e) => setDobMonth(e.target.value)} className={inputClass}>
                  <option value="">MM</option>
                  {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Year</label>
                <select value={dobYear} onChange={(e) => {
                  setDobYear(e.target.value)
                  if (e.target.value) setTimeout(() => { if (tillNow) calcBtnRef.current?.focus(); else asOnDayRef.current?.focus() }, 100)
                }} className={inputClass}>
                  <option value="">YYYY</option>
                  {yearsList.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-2">
              <label className="block text-xs text-gray-400 mb-1">Or enter manually (DD/MM/YYYY) — auto formats</label>
              <input
                type="text"
                placeholder="DD/MM/YYYY"
                value={dobManual}
                maxLength={10}
                onChange={(e) => handleDobManual(e.target.value)}
                className="w-full border-2 border-blue-100 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-blue-50 text-blue-900 font-semibold placeholder-gray-400"
              />
            </div>
          </div>

          {/* As On Date */}
          <div className="mb-4" ref={asOnSectionRef}>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-blue-800">📅 As On Date (Reference Date)</label>
              <label className="flex items-center gap-2 cursor-pointer bg-blue-50 border-2 border-blue-200 rounded-lg px-3 py-1.5">
                <input
                  ref={tillNowRef}
                  type="checkbox"
                  checked={tillNow}
                  onChange={(e) => handleTillNow(e.target.checked)}
                  className="w-4 h-4 accent-blue-700"
                />
                <span className="text-xs font-bold text-blue-700">Till Now (Today)</span>
              </label>
            </div>

            {tillNow ? (
              <div className="bg-blue-700 border-2 border-blue-600 rounded-lg px-4 py-3 text-white font-bold text-sm text-center">
                Today: {todayStr.day}/{todayStr.month}/{todayStr.year}
              </div>
            ) : (
              <>
            <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Day</label>
                    <select ref={asOnDayRef} value={asOnDay} onChange={(e) => { setAsOnDay(e.target.value); if (e.target.value) setTimeout(() => asOnMonthRef.current?.focus(), 100) }} className={inputClass}>
                      <option value="">DD</option>
                      {days.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Month</label>
                    <select ref={asOnMonthRef} value={asOnMonth} onChange={(e) => { setAsOnMonth(e.target.value); if (e.target.value) setTimeout(() => asOnYearRef.current?.focus(), 100) }} className={inputClass}>
                      <option value="">MM</option>
                      {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Year</label>
                    <select ref={asOnYearRef} value={asOnYear} onChange={(e) => { setAsOnYear(e.target.value); if (e.target.value) setTimeout(() => calcBtnRef.current?.focus(), 100) }} className={inputClass}>
                      <option value="">YYYY</option>
                      {yearsList.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-xs text-gray-400 mb-1">Or enter manually (DD/MM/YYYY) — auto formats</label>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={asOnManual}
                    maxLength={10}
                    onChange={(e) => handleAsOnManual(e.target.value)}
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