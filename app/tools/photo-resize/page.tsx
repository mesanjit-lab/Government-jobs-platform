'use client'
import { useState, useRef } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { ChevronRight, Upload, Download, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'

// ============================================================
// EXAM REQUIREMENTS — Update these as per official notifications
// ============================================================
const examRequirements: Record<string, any> = {
  ssc: {
    name: "SSC",
    photo: { minKB: 20, maxKB: 50, width: 413, height: 531, formats: ["JPG", "JPEG"], bg: "white" },
    signature: { minKB: 10, maxKB: 20, width: 800, height: 200, formats: ["JPG", "JPEG"], bg: "white" }
  },
  upsc: {
    name: "UPSC",
    photo: { minKB: 20, maxKB: 300, width: 300, height: 300, formats: ["JPG", "JPEG"], bg: "white" },
    signature: { minKB: 10, maxKB: 300, width: 300, height: 100, formats: ["JPG", "JPEG"], bg: "white" }
  },
  railway: {
    name: "Railway / RRB",
    photo: { minKB: 15, maxKB: 100, width: 200, height: 230, formats: ["JPG", "JPEG"], bg: "white" },
    signature: { minKB: 10, maxKB: 30, width: 200, height: 80, formats: ["JPG", "JPEG"], bg: "white" }
  },
  bihar_police: {
    name: "Bihar Police",
    photo: { minKB: 10, maxKB: 50, width: 413, height: 531, formats: ["JPG", "JPEG"], bg: "white" },
    signature: { minKB: 5, maxKB: 20, width: 300, height: 80, formats: ["JPG", "JPEG"], bg: "white" }
  },
  bpsc: {
    name: "BPSC",
    photo: { minKB: 20, maxKB: 200, width: 413, height: 531, formats: ["JPG", "JPEG"], bg: "white" },
    signature: { minKB: 10, maxKB: 50, width: 300, height: 80, formats: ["JPG", "JPEG"], bg: "white" }
  },
  ibps: {
    name: "IBPS",
    photo: { minKB: 20, maxKB: 50, width: 200, height: 230, formats: ["JPG", "JPEG"], bg: "white" },
    signature: { minKB: 10, maxKB: 20, width: 140, height: 60, formats: ["JPG", "JPEG"], bg: "white" }
  },
  sbi: {
    name: "SBI",
    photo: { minKB: 20, maxKB: 50, width: 200, height: 230, formats: ["JPG", "JPEG"], bg: "white" },
    signature: { minKB: 10, maxKB: 20, width: 140, height: 60, formats: ["JPG", "JPEG"], bg: "white" }
  },
  custom: {
    name: "Custom",
    photo: { minKB: 10, maxKB: 100, width: 413, height: 531, formats: ["JPG", "JPEG", "PNG"], bg: "white" },
    signature: { minKB: 5, maxKB: 50, width: 300, height: 80, formats: ["JPG", "JPEG", "PNG"], bg: "white" }
  }
}

const examList = [
  { id: "ssc", label: "SSC (CGL, CHSL, MTS)" },
  { id: "upsc", label: "UPSC Civil Services" },
  { id: "railway", label: "Railway / RRB" },
  { id: "bihar_police", label: "Bihar Police" },
  { id: "bpsc", label: "BPSC" },
  { id: "ibps", label: "IBPS Bank" },
  { id: "sbi", label: "SBI" },
  { id: "custom", label: "Other / Custom" },
]

// Smart compression — find highest quality within KB limit
function smartCompress(canvas: HTMLCanvasElement, maxKB: number): string {
  let lo = 0.1, hi = 1.0, bestUrl = ''
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2
    const url = canvas.toDataURL('image/jpeg', mid)
    const kb = Math.ceil((url.split(',')[1].length * 3) / 4) / 1024
    if (kb <= maxKB) { bestUrl = url; lo = mid }
    else hi = mid
  }
  return bestUrl || canvas.toDataURL('image/jpeg', 0.1)
}

// Get file size in KB from dataURL
function getKB(dataUrl: string): number {
  return Math.ceil((dataUrl.split(',')[1].length * 3) / 4) / 1024
}

// Draw image on canvas with crop-to-fit (center crop)
function drawCropToFit(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const imgRatio = img.naturalWidth / img.naturalHeight
  const targetRatio = w / h
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight
  if (imgRatio > targetRatio) {
    sw = Math.round(img.naturalHeight * targetRatio)
    sx = Math.round((img.naturalWidth - sw) / 2)
  } else {
    sh = Math.round(img.naturalWidth / targetRatio)
    sy = Math.round((img.naturalHeight - sh) / 2)
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h)
}

// Draw image on canvas with fit (letterbox)
function drawFit(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number, bg: string) {
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)
  const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight)
  const nw = Math.round(img.naturalWidth * scale)
  const nh = Math.round(img.naturalHeight * scale)
  const x = Math.round((w - nw) / 2)
  const y = Math.round((h - nh) / 2)
  ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, x, y, nw, nh)
}

export default function PhotoResizePage() {
  const [selectedExam, setSelectedExam] = useState('ssc')
  const [activeTab, setActiveTab] = useState<'photo' | 'signature'>('photo')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [resultKB, setResultKB] = useState<number | null>(null)
  const [originalDims, setOriginalDims] = useState<{w: number, h: number} | null>(null)
  const [status, setStatus] = useState<any>(null)
  const [fitMode, setFitMode] = useState<'crop' | 'fit'>('crop')
  const [bg, setBg] = useState('white')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [customW, setCustomW] = useState('')
  const [customH, setCustomH] = useState('')
  const [customMaxKB, setCustomMaxKB] = useState('')
  const [warning, setWarning] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const req = examRequirements[selectedExam]?.[activeTab]

  const targetW = customW ? parseInt(customW) : req?.width
  const targetH = customH ? parseInt(customH) : req?.height
  const targetMaxKB = customMaxKB ? parseInt(customMaxKB) : req?.maxKB

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) { setStatus({ error: 'Please select a valid image file (JPG, PNG).' }); return }
    if (f.size > 10 * 1024 * 1024) { setStatus({ error: 'File is too large. Please use an image smaller than 10 MB.' }); return }
    setFile(f)
    setResult(null)
    setResultKB(null)
    setStatus(null)
    setWarning(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      setPreview(src)
      const img = document.createElement('img') as HTMLImageElement
      img.onload = () => setOriginalDims({ w: img.naturalWidth, h: img.naturalHeight })
      img.src = src
    }
    reader.readAsDataURL(f)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const fixAutomatically = () => {
    if (!preview) { setStatus({ error: 'Please upload an image first.' }); return }
    if (!targetW || !targetH) { setStatus({ error: 'Please enter valid dimensions.' }); return }
    setProcessing(true)
    setWarning(null)

    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const img = document.createElement('img') as HTMLImageElement

    img.onload = () => {
      canvas.width = targetW
      canvas.height = targetH
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      // Background
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, targetW, targetH)

      // Draw
      if (fitMode === 'crop') drawCropToFit(ctx, img, targetW, targetH)
      else drawFit(ctx, img, targetW, targetH, bg)

      // Smart compress
      const finalUrl = smartCompress(canvas, targetMaxKB)
      const finalKB = getKB(finalUrl)

      setResult(finalUrl)
      setResultKB(finalKB)
      setProcessing(false)

      // Quality warning
      if (finalKB > targetMaxKB * 0.95) {
        setWarning('⚠️ File size is very small. Image quality may be reduced.')
      } else if (finalKB < targetMaxKB * 0.3) {
        setWarning(null)
      }

      // Validation
      const checks = [
        { label: 'Dimensions', ok: true, msg: `${targetW}×${targetH} px` },
        { label: 'File Size', ok: finalKB <= targetMaxKB, msg: `${finalKB.toFixed(1)} KB / Max ${targetMaxKB} KB` },
        { label: 'Format', ok: true, msg: 'JPG' },
      ]
      setStatus({ checks, ready: checks.every(c => c.ok) })
    }
    img.src = preview
  }

  const handleDownload = () => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result
    a.download = `myresult_${selectedExam}_${activeTab}.jpg`
    a.click()
  }

  const validateOnly = () => {
    if (!file || !preview) { setStatus({ error: 'Please upload an image first.' }); return }
    const fileSizeKB = file.size / 1024
    const checks = [
      { label: 'Format', ok: file.type.includes('jpeg') || file.type.includes('jpg') || file.type.includes('png'), msg: file.type.split('/')[1].toUpperCase() },
      { label: 'File Size', ok: fileSizeKB <= targetMaxKB && fileSizeKB >= (req?.minKB || 0), msg: `${fileSizeKB.toFixed(1)} KB (Required: ${req?.minKB || 0}–${targetMaxKB} KB)` },
      { label: 'Dimensions', ok: originalDims?.w === targetW && originalDims?.h === targetH, msg: `${originalDims?.w}×${originalDims?.h} px (Required: ${targetW}×${targetH} px)` },
    ]
    setStatus({ checks, ready: checks.every(c => c.ok) })
  }

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
            <span className="text-white">Photo & Signature Tool</span>
          </div>
          <h1 className="text-xl font-bold">Photo & Signature Resize Tool</h1>
          <p className="text-blue-200 text-sm mt-1">Resize, crop and compress photo/signature for government job applications</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">

        {/* Step 1 — Select Exam */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-sm font-bold text-blue-900 mb-3">Step 1: Select Application / Exam</h2>
          <select
            value={selectedExam}
            onChange={(e) => { setSelectedExam(e.target.value); setResult(null); setStatus(null) }}
            className="w-full border-2 border-blue-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-600 bg-blue-50 text-blue-900 font-semibold"
          >
            {examList.map((e) => (
              <option key={e.id} value={e.id}>{e.label}</option>
            ))}
          </select>
        </div>

        {/* Step 2 — Photo or Signature */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-sm font-bold text-blue-900 mb-3">Step 2: Select Type</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setActiveTab('photo'); setResult(null); setStatus(null) }}
              className={`py-3 rounded-xl text-sm font-bold border-2 transition ${activeTab === 'photo' ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}
            >
              📸 Photo
            </button>
            <button
              onClick={() => { setActiveTab('signature'); setResult(null); setStatus(null) }}
              className={`py-3 rounded-xl text-sm font-bold border-2 transition ${activeTab === 'signature' ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}
            >
              ✍️ Signature
            </button>
          </div>

          {/* Requirements */}
          {req && (
            <div className="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-100">
              <p className="text-xs font-bold text-blue-800 mb-1">{examRequirements[selectedExam]?.name} — {activeTab === 'photo' ? 'Photo' : 'Signature'} Requirements</p>
              <div className="grid grid-cols-2 gap-1 text-xs text-blue-700">
                <span>📐 Size: {req.width}×{req.height} px</span>
                <span>📦 Max: {req.maxKB} KB</span>
                <span>✅ Min: {req.minKB} KB</span>
                <span>🖼️ Format: {req.formats.join(', ')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Step 3 — Upload */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-sm font-bold text-blue-900 mb-3">Step 3: Upload {activeTab === 'photo' ? 'Photo' : 'Signature'}</h2>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-blue-200 rounded-xl p-8 text-center cursor-pointer hover:bg-blue-50 transition"
          >
            <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-blue-700">Click or drag & drop image here</p>
            <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG</p>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
        </div>

        {/* Preview + Fix */}
        {preview && (
          <>
            {/* Fit mode + Background */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">Fit Mode</p>
                  <div className="flex gap-2">
                    <button onClick={() => setFitMode('crop')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 transition ${fitMode === 'crop' ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-600 border-gray-200'}`}>
                      Crop to Fit
                    </button>
                    <button onClick={() => setFitMode('fit')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 transition ${fitMode === 'fit' ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-600 border-gray-200'}`}>
                      Fit
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">Background</p>
                  <div className="flex gap-2">
                    {['white', 'black', 'transparent'].map((c) => (
                      <button key={c} onClick={() => setBg(c)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 transition capitalize ${bg === c ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'}`}>
                        {c === 'transparent' ? 'None' : c.charAt(0).toUpperCase() + c.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Before / After preview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
                <p className="text-xs font-bold text-gray-600 mb-2">Original</p>
                <img src={preview} alt="Original" className="w-full rounded object-contain max-h-48 bg-gray-50" />
                <div className="mt-2 text-xs text-gray-500 space-y-0.5">
                  <p>{originalDims?.w}×{originalDims?.h} px</p>
                  <p>{((file?.size || 0) / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
                <p className="text-xs font-bold text-gray-600 mb-2">Final {activeTab === 'photo' ? 'Photo' : 'Signature'}</p>
                {result ? (
                  <>
                    <img src={result} alt="Result" className="w-full rounded object-contain max-h-48 bg-gray-50" />
                    <div className="mt-2 text-xs space-y-0.5">
                      <p className="text-gray-500">{targetW}×{targetH} px</p>
                      <p className={resultKB && resultKB <= targetMaxKB ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                        {resultKB?.toFixed(1)} KB
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-48 bg-gray-50 rounded flex items-center justify-center">
                    <p className="text-xs text-gray-400">Click Fix Automatically</p>
                  </div>
                )}
              </div>
            </div>

            {/* Warning */}
            {warning && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-700">{warning}</p>
              </div>
            )}

            {/* Advanced Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <button onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex justify-between items-center text-xs font-semibold text-gray-600">
                ⚙️ Advanced Settings
                <span>{showAdvanced ? '▲' : '▼'}</span>
              </button>
              {showAdvanced && (
                <div className="mt-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Custom Width (px)</label>
                      <input type="number" placeholder={String(req?.width)} value={customW}
                        onChange={(e) => setCustomW(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Custom Height (px)</label>
                      <input type="number" placeholder={String(req?.height)} value={customH}
                        onChange={(e) => setCustomH(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 bg-gray-50" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Custom Max KB</label>
                    <input type="number" placeholder={String(req?.maxKB)} value={customMaxKB}
                      onChange={(e) => setCustomMaxKB(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 bg-gray-50" />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button onClick={fixAutomatically} disabled={processing}
                className="w-full bg-blue-700 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-blue-600 disabled:opacity-60 flex items-center justify-center gap-2">
                {processing ? '⏳ Processing...' : '✨ Fix Automatically'}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={validateOnly}
                  className="py-2.5 rounded-xl text-sm font-bold border-2 border-blue-200 text-blue-700 hover:bg-blue-50">
                  🔍 Check Photo
                </button>
                {result && (
                  <button onClick={handleDownload}
                    className="py-2.5 rounded-xl text-sm font-bold bg-green-600 text-white hover:bg-green-500 flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download {activeTab === 'photo' ? 'Photo' : 'Signature'}
                  </button>
                )}
              </div>
            </div>

            {/* Status */}
            {status && (
              <div className={`rounded-xl border p-4 ${status.error ? 'bg-red-50 border-red-100' : status.ready ? 'bg-green-50 border-green-100' : 'bg-yellow-50 border-yellow-100'}`}>
                {status.error ? (
                  <p className="text-sm text-red-600 font-semibold">{status.error}</p>
                ) : (
                  <>
                    <div className="space-y-1.5 mb-3">
                      {status.checks?.map((c: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          {c.ok ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />}
                          <span className={c.ok ? 'text-gray-700' : 'text-red-600 font-semibold'}>{c.label}: {c.msg}</span>
                        </div>
                      ))}
                    </div>
                    <div className={`text-sm font-bold ${status.ready ? 'text-green-700' : 'text-red-600'}`}>
                      {status.ready ? '✅ Ready to Upload' : '❌ Fix Required — Click Fix Automatically'}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {/* Disclaimer */}
        <div className="bg-yellow-50 rounded-xl border border-yellow-100 p-4">
          <p className="text-xs text-yellow-700">Always check the official recruitment notification for the exact photo and signature requirements before submitting your application. Requirements may vary between posts and notifications.</p>
        </div>

        <a href="/tools" className="block text-center text-xs text-blue-600 hover:underline">← Back to Tools</a>
      </div>

      <Footer />
    </main>
  )
}