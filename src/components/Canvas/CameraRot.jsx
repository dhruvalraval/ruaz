import { useProgress } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { memo, useEffect, useState } from 'react'
import { lerp } from 'three/src/math/MathUtils.js'

function Component({ controls }) {
  const { loaded, total } = useProgress()

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (loaded === total) {
      const tm = setTimeout(() => {
        setIsLoaded(true)
      }, 1000)
      return () => clearTimeout(tm)
    }
  }, [loaded, total])

  useFrame(({ pointer }) => {
    if (controls.current && isLoaded) {
      if (pointer.x !== undefined && pointer.y !== undefined) {
        controls.current.setTarget(
          pointer.x * 0.3,
          Math.max(0.02, -pointer.y * 0.3),
          0,
          true
        )
      }
    }
  })
  return null
}

const CameraRot = memo(Component)
export default CameraRot
