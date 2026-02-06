import { useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { initializeAnimations } from '../../utils/animations'

export const BottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (navRef.current) {
      const { applyClickAnimations } = initializeAnimations()
      applyClickAnimations(navRef.current)
    }
  }, [])

  return (
    <nav ref={navRef} className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto z-50 px-6 pb-8 pointer-events-none">
      <div className="glass-panel pointer-events-auto rounded-full flex items-center justify-around py-3 px-4 shadow-2xl border-white/20">
        <button onClick={() => navigate('/')} className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-primary' : 'text-white/40'}`}>
          <span className="material-symbols-outlined" style={isActive('/') ? { fontVariationSettings: "'FILL' 1" } : {}}>dashboard</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">Main</span>
        </button>
        <button onClick={() => navigate('/results')} className={`flex flex-col items-center gap-1 ${isActive('/results') ? 'text-primary' : 'text-white/40'}`}>
          <span className="material-symbols-outlined" style={isActive('/results') ? { fontVariationSettings: "'FILL' 1" } : {}}>leaderboard</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">Results</span>
        </button>
        <button onClick={() => navigate('/profile')} className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-primary' : 'text-white/40'}`}>
          <span className="material-symbols-outlined" style={isActive('/profile') ? { fontVariationSettings: "'FILL' 1" } : {}}>person</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">Athletes</span>
        </button>
        <button onClick={() => navigate('/analysis/season')} className={`flex flex-col items-center gap-1 ${isActive('/analysis/season') ? 'text-primary' : 'text-white/40'}`}>
          <span className="material-symbols-outlined">analytics</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">Insight</span>
        </button>
      </div>
    </nav>
  )
}
