interface MaterialIconProps {
  name: string
  filled?: boolean
  className?: string
}

export const MaterialIcon = ({ name, filled, className = '' }: MaterialIconProps) => {
  const fillStyle = filled ? { fontVariationSettings: "'FILL' 1" } : {}

  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={fillStyle}
    >
      {name}
    </span>
  )
}
