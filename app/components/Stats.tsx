export default function Stats() {
  return (
    <section className="bg-white py-8 px-4 shadow-sm">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        
        <div className="p-4">
          <div className="text-3xl font-bold text-blue-700">500+</div>
          <div className="text-sm text-gray-500 mt-1">Active Jobs</div>
        </div>

        <div className="p-4">
          <div className="text-3xl font-bold text-blue-700">200+</div>
          <div className="text-sm text-gray-500 mt-1">Results</div>
        </div>

        <div className="p-4">
          <div className="text-3xl font-bold text-blue-700">150+</div>
          <div className="text-sm text-gray-500 mt-1">Admit Cards</div>
        </div>

        <div className="p-4">
          <div className="text-3xl font-bold text-blue-700">50+</div>
          <div className="text-sm text-gray-500 mt-1">Daily Updates</div>
        </div>

      </div>
    </section>
  )
}