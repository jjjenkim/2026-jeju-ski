import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { MaterialIcon } from '../common/MaterialIcon'

interface AnalysisModalProps {
  children: ReactNode
  title: string
}

export const AnalysisModal = ({ children, title }: AnalysisModalProps) => {
  const navigate = useNavigate()

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm">
      <div className="glass-modal h-full flex flex-col">
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <MaterialIcon name="close" className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
