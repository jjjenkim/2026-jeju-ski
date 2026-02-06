import { useEffect, useRef } from 'react'
import { initializeAnimations } from '../utils/animations'

export const useClickAnimation = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const { applyClickAnimations } = initializeAnimations()
      applyClickAnimations(ref.current)
    }
  }, [])

  return ref
}
