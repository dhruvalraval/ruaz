import { useFrame, useThree } from '@react-three/fiber'
import { memo, useEffect } from 'react'
import { lerp } from 'three/src/math/MathUtils.js'

function Component({ controls }) {
  useFrame(({ pointer }) => {
    if (controls.current) {
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
