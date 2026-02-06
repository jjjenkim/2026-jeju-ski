import { MaterialIcon } from '../common/MaterialIcon'

export const ResultsHeader = () => {
  return (
    <div className="px-6 pt-8 pb-4">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-white">Competition</h1>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <MaterialIcon name="tune" className="text-white/60" />
        </button>
      </div>
      <p className="text-white/60 text-sm">Milano Cortina 2026</p>
    </div>
  )
}
