'use client'
import { useState, useRef } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { ChevronRight, Upload, Download, X, FileText, CheckCircle2 } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'

type Tool = 'jpg-to-pdf' | 'merge-pdf' | 'compress-pdf' | 'split-pdf'

const tools = [
  { id: 'jpg-to-pdf' as Tool, icon: '🖼️', label: 'JPG / PNG to PDF', desc: 'Convert images to PDF' },
  { id: 'merge-pdf' as Tool, icon: '📎', label: 'Merge PDF', desc: 'Combine multiple PDFs' },
  { id: 'compress-pdf' as Tool, icon: '📦', label: 'Compress PDF', desc: 'Reduce PDF file size' },
  { id: 'split-pdf' as Tool, icon: '✂️', label: 'Split PDF', desc: 'Extract pages from PDF' },
]

const pageSizes: Record<string, [number, number]> = {
  A4: [595, 842], A3: [842, 1191], Letter: [612, 792], Legal: [612, 1008],
}

const useCases = [
  'Government Job Application', 'SSC', 'UPSC', 'Railway', 'Bihar Police',
  'BPSC', 'Bihar Teacher / TRE', 'IBPS', 'SBI', 'India Post',
  'College / University', 'Scholarship', 'Cyber Cafe', 'Other / Custom'
]

const faqs = [
  { q: 'How can I convert JPG to PDF?', a: 'Select "JPG/PNG to PDF" tool, upload your images, choose page size and click Convert to PDF.' },
  { q: 'How can I merge multiple PDFs?', a: 'Select "Merge PDF" tool, upload all your PDF files, arrange them in order and click Merge PDF.' },
  { q: 'How can I reduce PDF size?', a: 'Select "Compress PDF" tool, upload your PDF and choose compression level.' },
  { q: 'How can I split a PDF?', a: 'Select "Split PDF" tool, upload your PDF and enter the page range you want to extract.' },
  { q: 'Can I use this tool on mobile?', a: 'Yes! This tool is fully mobile-friendly.' },
  { q: 'Is my document uploaded to the server?', a: 'No. All PDF processing is done locally in your browser. Your files are not uploaded to any server.' },
]

async function createBlob(doc: PDFDocument): Promise<Blob> {
  const bytes: Uint8Array = await doc.save()
  return new Blob([bytes], { type: 'application/pdf' })
}

export default function PdfToolsPage() {
  const [activeTool, setActiveTool] = useState<Tool>('jpg-to-pdf')
  const [useCase, setUseCase] = useState('Government Job Application')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [pageSize, setPageSize] = useState('A4')
  const [orientation, setOrientation] = useState('auto')
  const [imageFit, setImageFit] = useState('fit')
  const [margin, setMargin] = useState('small')
  const [compression, setCompression] = useState('recommended')
  const [splitRange, setSplitRange] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultInfo, setResultInfo] = useState<any>(null)
  const [status, setStatus] = useState<any>(null)
  const [dragOver, setDragOver] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const acceptedTypes = activeTool === 'jpg-to-pdf'
    ? 'image/jpeg,image/jpg,image/png'
    : 'application/pdf'

  const handleFiles = (newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles)
    const filtered = arr.filter(f =>
      activeTool === 'jpg-to-pdf' ? f.type.startsWith('image/') : f.type === 'application/pdf'
    )
    if (filtered.length === 0) {
      setStatus({ error: activeTool === 'jpg-to-pdf' ? 'Please select JPG or PNG images.' : 'Please select PDF files.' })
      return
    }
    setFiles(prev => [...prev, ...filtered])
    setResultUrl(null)
    setStatus(null)
    if (activeTool === 'jpg-to-pdf') {
      filtered.forEach(f => {
        const reader = new FileReader()
        reader.onload = (e) => setPreviews(prev => [...prev, e.target?.result as string])
        reader.readAsDataURL(f)
      })
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const moveFile = (from: number, to: number) => {
    const f = [...files], p = [...previews]
    const [fi] = f.splice(from, 1)
    const [pi] = p.splice(from, 1)
    f.splice(to, 0, fi)
    p.splice(to, 0, pi)
    setFiles(f)
    setPreviews(p)
  }

  const getMarginVal = () => margin === 'none' ? 0 : margin === 'small' ? 20 : 40

  const convertImagesToPdf = async () => {
    if (files.length === 0) { setStatus({ error: 'Please upload at least one image.' }); return }
    setProcessing(true)
    setStatus(null)
    try {
      const pdfDoc = await PDFDocument.create()
      const [pw, ph] = pageSizes[pageSize] ?? pageSizes['A4']
      const m = getMarginVal()
      for (const file of files) {
        const buf = await file.arrayBuffer()
        const img = file.type === 'image/png' ? await pdfDoc.embedPng(buf) : await pdfDoc.embedJpg(buf)
        const { width: iw, height: ih } = img
        let fw = pw, fh = ph
        if (orientation === 'landscape' || (orientation === 'auto' && iw > ih)) { fw = ph; fh = pw }
        const page = pdfDoc.addPage([fw, fh])
        const dw = fw - m * 2, dh = fh - m * 2
        let dx = m, dy = m, rw = dw, rh = dh
        if (imageFit === 'fit') {
          const s = Math.min(dw / iw, dh / ih)
          rw = iw * s; rh = ih * s
          dx = m + (dw - rw) / 2; dy = m + (dh - rh) / 2
        } else if (imageFit === 'fill') {
          const s = Math.max(dw / iw, dh / ih)
          rw = iw * s; rh = ih * s
          dx = m - (rw - dw) / 2; dy = m - (rh - dh) / 2
        }
        page.drawImage(img, { x: dx, y: dy, width: rw, height: rh })
      }
      const blob = await createBlob(pdfDoc)
      const url = URL.createObjectURL(blob)
      setResultUrl(url)
      setResultInfo({ name: 'myresult_images_to_pdf.pdf', pages: files.length, size: (blob.size / 1024).toFixed(1), pageSize })
      setStatus({ success: true })
    } catch {
      setStatus({ error: 'Could not process images. Please try again.' })
    }
    setProcessing(false)
  }

  const mergePdfs = async () => {
    if (files.length < 2) { setStatus({ error: 'Please upload at least 2 PDF files.' }); return }
    setProcessing(true)
    setStatus(null)
    try {
      const merged = await PDFDocument.create()
      for (const file of files) {
        const pdf = await PDFDocument.load(await file.arrayBuffer())
        const pages = await merged.copyPages(pdf, pdf.getPageIndices())
        pages.forEach(p => merged.addPage(p))
      }
      const blob = await createBlob(merged)
      const url = URL.createObjectURL(blob)
      setResultUrl(url)
      setResultInfo({ name: 'myresult_merged.pdf', pages: merged.getPageCount(), size: (blob.size / 1024).toFixed(1), pageSize: 'Mixed' })
      setStatus({ success: true })
    } catch {
      setStatus({ error: 'Could not merge PDFs. Please check your files.' })
    }
    setProcessing(false)
  }

  const compressPdf = async () => {
    if (files.length === 0) { setStatus({ error: 'Please upload a PDF file.' }); return }
    setProcessing(true)
    setStatus(null)
    try {
      const pdf = await PDFDocument.load(await files[0].arrayBuffer())
      const useStreams = compression !== 'recommended'
      const bytes: Uint8Array = await pdf.save({ useObjectStreams: useStreams })
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const origKB = files[0].size / 1024
      const finalKB = blob.size / 1024
      setResultUrl(url)
      setResultInfo({
        name: 'myresult_compressed.pdf',
        pages: pdf.getPageCount(),
        size: finalKB.toFixed(1),
        originalSize: origKB.toFixed(1),
        saved: Math.max(0, origKB - finalKB).toFixed(1)
      })
      setStatus({ success: true })
    } catch {
      setStatus({ error: 'Could not compress PDF. Please check your file.' })
    }
    setProcessing(false)
  }

  const splitPdf = async () => {
    if (files.length === 0) { setStatus({ error: 'Please upload a PDF file.' }); return }
    if (!splitRange.trim()) { setStatus({ error: 'Please enter page range (e.g. 1-3).' }); return }
    setProcessing(true)
    setStatus(null)
    try {
      const pdf = await PDFDocument.load(await files[0].arrayBuffer())
      const total = pdf.getPageCount()
      const parts = splitRange.split('-').map(p => parseInt(p.trim()))
      const from = Math.max(1, parts[0] ?? 1) - 1
      const to = Math.min(total, parts[1] ?? parts[0] ?? total) - 1
      const newDoc = await PDFDocument.create()
      const indices = Array.from({ length: to - from + 1 }, (_, i) => from + i)
      const pages = await newDoc.copyPages(pdf, indices)
      pages.forEach(p => newDoc.addPage(p))
      const blob = await createBlob(newDoc)
      const url = URL.createObjectURL(blob)
      setResultUrl(url)
      setResultInfo({
        name: `myresult_pages_${from + 1}_to_${to + 1}.pdf`,
        pages: newDoc.getPageCount(),
        size: (blob.size / 1024).toFixed(1),
        pageSize: 'Original'
      })
      setStatus({ success: true })
    } catch {
      setStatus({ error: 'Could not split PDF. Please check your file and page range.' })
    }
    setProcessing(false)
  }

  const handleProcess = () => {
    if (activeTool === 'jpg-to-pdf') convertImagesToPdf()
    else if (activeTool === 'merge-pdf') mergePdfs()
    else if (activeTool === 'compress-pdf') compressPdf()
    else splitPdf()
  }

  const handleDownload = () => {
    if (!resultUrl || !resultInfo) return
    const a = document.createElement('a')
    a.href = resultUrl
    a.download = resultInfo.name
    a.click()
  }

  const processLabel = {
    'jpg-to-pdf': 'Convert to PDF',
    'merge-pdf': 'Merge PDF',
    'compress-pdf': 'Compress PDF',
    'split-pdf': 'Split PDF',
  }[activeTool]

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
            <span className="text-white">PDF Tools</span>
          </div>
          <h1 className="text-xl font-bold">PDF Tools</h1>
          <p className="text-blue-200 text-sm mt-1">Convert, merge, compress and split PDFs — free, fast and secure</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">

        {/* Tool Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-sm font-bold text-blue-900 mb-3">Select PDF Tool</h2>
          <div className="grid grid-cols-2 gap-2">
            {tools.map((tool) => (
              <button key={tool.id} onClick={() => { setActiveTool(tool.id); setFiles([]); setPreviews([]); setResultUrl(null); setStatus(null) }}
                className={`text-left p-3 rounded-xl border-2 transition ${activeTool === tool.id ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}>
                <div className="text-xl mb-1">{tool.icon}</div>
                <div className="text-xs font-bold text-blue-900">{tool.label}</div>
                <div className="text-xs text-gray-500">{tool.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Use Case */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-sm font-bold text-blue-900 mb-2">What are you using this PDF for?</h2>
          <select value={useCase} onChange={(e) => setUseCase(e.target.value)}
            className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600 bg-blue-50 text-blue-900 font-semibold">
            {useCases.map((u) => <option key={u}>{u}</option>)}
          </select>
          <p className="text-xs text-gray-400 mt-1">Always check the official notification for exact PDF requirements.</p>
        </div>

        {/* Upload */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-sm font-bold text-blue-900 mb-3">Upload Files</h2>
          <div
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-blue-200 hover:bg-blue-50'}`}>
            <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-blue-700">Drop your files here</p>
            <p className="text-xs text-gray-400 mt-1">or click to Choose Files</p>
            <p className="text-xs text-gray-400 mt-1">{activeTool === 'jpg-to-pdf' ? 'Supported: JPG, JPEG, PNG' : 'Supported: PDF'}</p>
          </div>
          <input ref={fileInputRef} type="file" accept={acceptedTypes}
            multiple={activeTool !== 'compress-pdf' && activeTool !== 'split-pdf'}
            className="hidden"
            onChange={(e) => { if (e.target.files) handleFiles(e.target.files) }} />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-bold text-blue-900">Uploaded Files ({files.length})</h2>
              <button onClick={() => fileInputRef.current?.click()}
                className="text-xs text-blue-600 border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-50">
                + Add More
              </button>
            </div>
            <div className="space-y-2">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-3 border border-gray-100 rounded-lg p-2">
                  {previews[i] ? (
                    <img src={previews[i]} alt="" className="w-12 h-12 object-cover rounded" />
                  ) : (
                    <div className="w-12 h-12 bg-red-50 rounded flex items-center justify-center">
                      <FileText className="w-6 h-6 text-red-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{f.name}</p>
                    <p className="text-xs text-gray-400">{(f.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <div className="flex gap-1 items-center">
                    {i > 0 && <button onClick={() => moveFile(i, i - 1)} className="text-xs text-gray-400 hover:text-blue-600 px-1">↑</button>}
                    {i < files.length - 1 && <button onClick={() => moveFile(i, i + 1)} className="text-xs text-gray-400 hover:text-blue-600 px-1">↓</button>}
                    <button onClick={() => removeFile(i)} className="text-red-400 hover:text-red-600 ml-1"><X className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        {files.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
            <h2 className="text-sm font-bold text-blue-900">Settings</h2>

            {activeTool === 'jpg-to-pdf' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Page Size</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(pageSizes).map((s) => (
                      <button key={s} onClick={() => setPageSize(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition ${pageSize === s ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Orientation</label>
                  <div className="flex gap-2">
                    {['auto', 'portrait', 'landscape'].map((o) => (
                      <button key={o} onClick={() => setOrientation(o)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border-2 transition capitalize ${orientation === o ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-600 border-gray-200'}`}>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Image Fit</label>
                  <div className="flex gap-2">
                    {[{ id: 'fit', label: 'Fit to Page' }, { id: 'fill', label: 'Fill Page' }, { id: 'original', label: 'Original Size' }].map((f) => (
                      <button key={f.id} onClick={() => setImageFit(f.id)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border-2 transition ${imageFit === f.id ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-600 border-gray-200'}`}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <button onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-xs font-semibold text-gray-500 hover:text-blue-700">
                    ⚙️ Advanced Settings {showAdvanced ? '▲' : '▼'}
                  </button>
                  {showAdvanced && (
                    <div className="mt-3">
                      <label className="block text-xs font-semibold text-gray-600 mb-2">Margin</label>
                      <div className="flex gap-2">
                        {['none', 'small', 'medium'].map((m) => (
                          <button key={m} onClick={() => setMargin(m)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold border-2 transition capitalize ${margin === m ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-600 border-gray-200'}`}>
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTool === 'compress-pdf' && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Compression Level</label>
                <div className="flex gap-2">
                  {['recommended', 'medium', 'strong'].map((c) => (
                    <button key={c} onClick={() => setCompression(c)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border-2 transition capitalize ${compression === c ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-600 border-gray-200'}`}>
                      {c}
                    </button>
                  ))}
                </div>
                {compression === 'strong' && <p className="text-xs text-yellow-600 mt-1">⚠️ Strong compression may reduce quality.</p>}
              </div>
            )}

            {activeTool === 'split-pdf' && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Page Range</label>
                <input type="text" placeholder="e.g. 1-3 or 5" value={splitRange}
                  onChange={(e) => setSplitRange(e.target.value)}
                  className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600 bg-blue-50 text-blue-900 font-semibold" />
                <p className="text-xs text-gray-400 mt-1">Enter page range like 1-3 or single page like 5</p>
              </div>
            )}
          </div>
        )}

        {/* Process Button */}
        {files.length > 0 && (
          <button onClick={handleProcess} disabled={processing}
            className="w-full bg-blue-700 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-blue-600 disabled:opacity-60 flex items-center justify-center gap-2">
            {processing ? '⏳ Processing PDF...' : `✨ ${processLabel}`}
          </button>
        )}

        {/* Status */}
        {status && (
          <div className={`rounded-xl border p-4 ${status.error ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
            {status.error ? (
              <div className="flex items-start gap-2">
                <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 font-semibold">{status.error}</p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <p className="text-sm text-green-700 font-semibold">PDF created successfully!</p>
              </div>
            )}
          </div>
        )}

        {/* Result */}
        {resultUrl && resultInfo && (
          <div className="bg-white rounded-xl shadow-sm border border-green-100 p-5">
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">🎉</div>
              <h3 className="text-sm font-bold text-green-700">PDF Ready!</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">File Name</span>
                <span className="font-semibold text-gray-800">{resultInfo.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Pages</span>
                <span className="font-semibold text-gray-800">{resultInfo.pages}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">File Size</span>
                <span className="font-semibold text-gray-800">{resultInfo.size} KB</span>
              </div>
              {resultInfo.originalSize && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Original Size</span>
                  <span className="font-semibold text-gray-800">{resultInfo.originalSize} KB</span>
                </div>
              )}
              {resultInfo.saved && parseFloat(resultInfo.saved) > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Space Saved</span>
                  <span className="font-semibold text-green-600">{resultInfo.saved} KB</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <button onClick={handleDownload}
                className="w-full bg-green-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-green-500 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download PDF
              </button>
              <button onClick={() => { setFiles([]); setPreviews([]); setResultUrl(null); setResultInfo(null); setStatus(null) }}
                className="w-full border-2 border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50">
                Create Another PDF
              </button>
            </div>
          </div>
        )}

        {/* Privacy */}
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-3 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">Your files are processed securely in your browser. Files are not uploaded to any server.</p>
        </div>

        {/* Useful For */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-sm font-bold text-blue-900 mb-2">Useful for Government Job Applications</h2>
          <div className="flex flex-wrap gap-2">
            {['Uploading scanned documents', 'Combining multiple pages', 'Reducing PDF size', 'Converting photos to PDF', 'Preparing online applications'].map((u) => (
              <span key={u} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-full">{u}</span>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-sm font-bold text-blue-900 mb-3">FAQ</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <details key={i} className="border border-gray-100 rounded-lg group">
                <summary className="flex justify-between items-center px-3 py-2 cursor-pointer list-none text-xs font-semibold text-gray-800">
                  {faq.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-3 pb-2 text-xs text-gray-600">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 rounded-xl border border-yellow-100 p-4">
          <p className="text-xs text-yellow-700"><strong>Disclaimer:</strong> MyResult provides PDF tools for general document preparation. Users should always check the concerned examination or recruitment authority's official notification for exact requirements.</p>
        </div>

        <a href="/tools" className="block text-center text-xs text-blue-600 hover:underline">← Back to Tools</a>
      </div>

      <Footer />
    </main>
  )
}