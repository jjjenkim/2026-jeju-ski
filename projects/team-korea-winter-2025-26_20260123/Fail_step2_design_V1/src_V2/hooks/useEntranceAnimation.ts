import { useEffect, useRef } from 'react'
import { initializeAnimations } from '../utils/animations'

export const useEntranceAnimation = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const { applyEntranceAnimations } = initializeAnimations()
      applyEntranceAnimations(ref.current)
    }
  }, [])

  return ref
}
