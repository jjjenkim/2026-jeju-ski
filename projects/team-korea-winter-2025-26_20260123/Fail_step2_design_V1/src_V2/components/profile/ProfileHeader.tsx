import { MaterialIcon } from '../common/MaterialIcon'
import { useNavigate } from 'react-router-dom'

interface ProfileHeaderProps {
  name: string
  sport: string
  backgroundImage?: string
  isActive?: boolean
}

export const ProfileHeader = ({
  name,
  sport,
  backgroundImage = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
  isActive = true
}: ProfileHeaderProps) => {
  const navigate = useNavigate()

  return (
    <div className="relative h-96 md:h-[480px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Fixed Buttons */}
      <div className="absolute top-8 left-0 right-0 px-6 flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full glass-panel flex items-center justify-center"
        >
          <MaterialIcon name="arrow_back" className="text-white" />
        </button>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center">
            <MaterialIcon name="share" className="text-white" />
          </button>
          <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center">
            <MaterialIcon name="favorite_border" className="text-white" />
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="absolute bottom-8 left-0 right-0 px-6">
        <div className="inline-block px-3 py-1 bg-primary rounded-full text-white text-xs font-bold mb-3">
          TEAM KOREA
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{name}</h1>
        <div className="flex items-center gap-2">
          <span className="text-white/80">{sport}</span>
          {isActive && (
            <>
              <span className="text-white/40">•</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/80 text-sm">Active</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
