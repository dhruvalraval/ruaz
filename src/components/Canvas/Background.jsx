import { useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { memo, useEffect } from 'react'
import { SRGBColorSpace } from 'three'

function Component() {
  const { scene } = useThree()
  const backgroundTexture = useTexture('/bg.webp')
  backgroundTexture.colorSpace = SRGBColorSpace

  useEffect(() => {
    if (scene) {
      scene.background = backgroundTexture
    }
  }, [scene, backgroundTexture])
  return null
}

const Background = memo(Component)
export default Background
