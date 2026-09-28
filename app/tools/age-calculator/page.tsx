'use client'

import { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

type Age = { years: number; months: number; days: number; totalDays: number }

const today = new Date().toISOString().slice(0, 10)

function toDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null
}

function calculateAge(from: Date, to: Date): Age {
  let years = to.getFullYear() - from.getFullYear()
  let months = to.getMonth() - from.getMonth()
  let days = to.getDate() - from.getDate()

  if (days < 0) {
    months -= 1
    days += new Date(to.getFullYear(), to.getMonth(), 0).getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }

  const totalDays = Math.floor((Date.UTC(to.getFullYear(), to.getMonth(), to.getDate()) - Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())) / 86400000)
  return { years, months, days, totalDays }
}

function AgeSummary({ age }: { age: Age }) {
  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          ['Years', age.years],
          ['Months', age.months],
          ['Days', age.days],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-center">
            <p className="text-2xl font-black text-blue-900 sm:text-3xl">{value}</p>
            <p className="text-xs font-semibold text-blue-700">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2 text-center sm:grid-cols-3">
        <div className="rounded-lg bg-gray-50 p-2 text-xs text-gray-600">Total Months: <strong className="text-blue-900">{age.years * 12 + age.months}</strong></div>
        <div className="rounded-lg bg-gray-50 p-2 text-xs text-gray-600">Total Weeks: <strong className="text-blue-900">{Math.floor(age.totalDays / 7)}</strong></div>
        <div className="rounded-lg bg-gray-50 p-2 text-xs text-gray-600">Total Days: <strong className="text-blue-900">{age.totalDays}</strong></div>
      </div>
    </>
  )
}

export default function AgeCalculatorPage() {
  const [dob, setDob] = useState('')
  const [asOnDate, setAsOnDate] = useState(today)
  const [minimumAge, setMinimumAge] = useState('')
  const [maximumAge, setMaximumAge] = useState('')
  const [cutOffDate, setCutOffDate] = useState('')
  const [age, setAge] = useState<Age | null>(null)
  const [cutOffAge, setCutOffAge] = useState<Age | null>(null)
  const [error, setError] = useState('')

  const handleCalculate = () => {
    const birthDate = toDate(dob)
    const calculationDate = toDate(asOnDate)
    if (!birthDate || !calculationDate) {
      setError('Enter valid dates of birth and calculation.')
      setAge(null)
      return
    }
    if (birthDate > calculationDate) {
      setError('Date of birth cannot be after the calculation date.')
      setAge(null)
      return
    }
    setError('')
    setAge(calculateAge(birthDate, calculationDate))

    const cutoff = toDate(cutOffDate)
    if (cutoff && cutoff >= birthDate) setCutOffAge(calculateAge(birthDate, cutoff))
    else setCutOffAge(null)
  }

  const handleReset = () => {
    setDob('')
    setAsOnDate(today)
    setMinimumAge('')
    setMaximumAge('')
    setCutOffDate('')
    setAge(null)
    setCutOffAge(null)
    setError('')
  }

  const min = Number(minimumAge)
  const max = Number(maximumAge)
  const hasRange = minimumAge !== '' || maximumAge !== ''
  const rangeIsValid = (!minimumAge || Number.isFinite(min)) && (!maximumAge || Number.isFinite(max)) && (!minimumAge || !maximumAge || min <= max)
  const inRange = cutOffAge && rangeIsValid && (!minimumAge || cutOffAge.years >= min) && (!maximumAge || cutOffAge.years <= max)

  return (
    <main className="min-h-screen overflow-x-hidden bg-gray-50">
      <Header />
      <div className="bg-blue-900 px-4 py-6 text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-xl font-bold">Age Calculator</h1>
          <p className="mt-1 text-sm text-blue-200">Calculate your exact age for government-exam reference.</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="dob" className="mb-1 block text-xs font-semibold text-gray-700">Date of Birth</label>
              <input id="dob" type="date" value={dob} onChange={(event) => setDob(event.target.value)} className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="as-on-date" className="mb-1 block text-xs font-semibold text-gray-700">Calculate age as on</label>
              <input id="as-on-date" type="date" value={asOnDate} onChange={(event) => setAsOnDate(event.target.value)} className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
          {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button onClick={handleCalculate} className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-600">Calculate Age</button>
            <button onClick={handleReset} className="rounded-lg border border-blue-700 px-5 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-50">Reset</button>
          </div>
        </div>

        {age && <section aria-live="polite" className="mt-5 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6"><h2 className="mb-4 text-sm font-bold text-blue-900">Your Exact Age</h2><AgeSummary age={age} /></section>}

        <section className="mt-5 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-sm font-bold text-blue-900">Government Exam Age-Range Helper <span className="font-normal text-gray-500">(optional)</span></h2>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">Enter the stated age range and cut-off date to check the mathematical age range only.</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div><label htmlFor="minimum-age" className="mb-1 block text-xs font-semibold text-gray-700">Minimum age</label><input id="minimum-age" inputMode="numeric" min="0" type="number" value={minimumAge} onChange={(event) => setMinimumAge(event.target.value)} className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500" /></div>
            <div><label htmlFor="maximum-age" className="mb-1 block text-xs font-semibold text-gray-700">Maximum age</label><input id="maximum-age" inputMode="numeric" min="0" type="number" value={maximumAge} onChange={(event) => setMaximumAge(event.target.value)} className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500" /></div>
            <div><label htmlFor="cut-off-date" className="mb-1 block text-xs font-semibold text-gray-700">Cut-off date</label><input id="cut-off-date" type="date" value={cutOffDate} onChange={(event) => setCutOffDate(event.target.value)} className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500" /></div>
          </div>
          {hasRange && !rangeIsValid && <p role="alert" className="mt-3 text-xs text-red-700">Minimum age must not be greater than maximum age.</p>}
          {cutOffAge && (
            <div aria-live="polite" className="mt-4 rounded-lg bg-blue-50 p-4">
              <p className="text-sm font-bold text-blue-900">Age on cut-off date: {cutOffAge.years} years, {cutOffAge.months} months, {cutOffAge.days} days</p>
              {hasRange && rangeIsValid && <p className={`mt-2 text-xs font-semibold ${inRange ? 'text-green-700' : 'text-red-700'}`}>{inRange ? 'Within the entered age range.' : 'Outside the entered age range.'}</p>}
            </div>
          )}
          <p className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-xs leading-relaxed text-yellow-800">This is a mathematical age-range helper only. It does not determine final recruitment eligibility; category relaxation, domicile, gender, service status, and recruitment-specific rules may differ.</p>
        </section>
      </div>
      <Footer />
    </main>
  )
}
