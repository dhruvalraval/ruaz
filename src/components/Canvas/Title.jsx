import { Image, useTexture } from '@react-three/drei'
import { memo, useLayoutEffect, useState } from 'react'
import { AdditiveBlending, SRGBColorSpace } from 'three'

function Component() {
  const [scale, setScale] = useState(1)
  const [positionY, setPositionY] = useState(2.5)
  const title = useTexture('/la vie en rose.png')
  title.colorSpace = SRGBColorSpace
  const isMobile = window.innerWidth < 768 ? true : false
  useLayoutEffect(() => {
    if (isMobile) {
      setScale(0.35)
      setPositionY(3)
    }
  }, [isMobile])
  return (
    <mesh
      position={[0, 2, -1]}
      position-y={positionY}
      scale={scale}
    >
      <planeGeometry args={[10, 2]} />
      <meshStandardMaterial
        transparent={true}
        map={title}
        opacity={0.3}
      />
    </mesh>
  )
}

const Title = memo(Component)
export default Title
