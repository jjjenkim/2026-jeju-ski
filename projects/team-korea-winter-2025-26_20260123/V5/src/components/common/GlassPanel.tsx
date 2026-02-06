import type { ReactNode } from 'react'

interface GlassPanelProps {
  children: ReactNode
  className?: string
  variant?: 'panel' | 'card' | 'modal'
}

export const GlassPanel = ({ children, className = '', variant = 'panel' }: GlassPanelProps) => {
  const variantClass = variant === 'panel'
    ? 'glass-panel'
    : variant === 'card'
    ? 'glass-card'
    : 'glass-modal'

  return (
    <div className={`${variantClass} ${className}`}>
      {children}
    </div>
  )
}
