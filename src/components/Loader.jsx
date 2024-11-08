import {
  Html,
  shaderMaterial,
  useProgress,
  useTexture,
} from '@react-three/drei'
import { useThree, extend, useFrame } from '@react-three/fiber'
import { memo, useEffect, useRef, useState } from 'react'
import { SRGBColorSpace, Texture } from 'three'

const DissolveShader = {
  uniforms: {
    uProgress: { value: 3 },
    uTexture: { value: null },
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uProgress;
    uniform sampler2D uTexture;

    varying vec2 vUv;

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float distance = length(vUv - center);
      float dissolve = 1.0 - clamp(distance * 5.0 - uProgress, 0.0, 1.0);
      vec4 color = texture2D(uTexture, vUv);
      gl_FragColor = vec4(color.rgb, color.a * dissolve);
    }
  `,
}

function Component() {
  const { loaded, total } = useProgress()
  const { camera } = useThree()
  const planeMeshRef = useRef()
  let progress = 3

  const inkMap = useTexture('/waterc.webp')
  inkMap.colorSpace = SRGBColorSpace

  const [isLoaded, setIsLoaded] = useState(false)
  const [start, setStart] = useState(true)

  useEffect(() => {
    if (loaded == total) {
      const tmp = setTimeout(() => {
        setIsLoaded(true)
      }, 1000)
      return () => clearTimeout(tmp)
    }
  }, [loaded, total])

  useEffect(() => {
    if (planeMeshRef.current && camera) {
      planeFitPerspectiveCamera(planeMeshRef.current, camera, 0.1)
    }
  }, [planeMeshRef, camera])

  useFrame(() => {
    if (planeMeshRef.current && start && isLoaded) {
      progress -= 0.01
      if (progress < -1) {
        setStart(false)
      }
      planeMeshRef.current.material.uniforms.uProgress.value = progress
    }
  })

  function planeFitPerspectiveCamera(plane, camera, relativeZ = null) {
    const cameraZ = relativeZ !== null ? relativeZ : camera.position.z
    const distance = cameraZ - plane.position.z
    const vFov = (camera.fov * Math.PI) / 180
    const scaleY = 2 * Math.tan(vFov / 2)
    const scaleX = scaleY * camera.aspect

    plane.scale.set(scaleX, scaleY, 1)
  }

  return (
    <group>
      <mesh
        ref={planeMeshRef}
        position={[0, 0, 9]}
      >
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          uniforms={{ ...DissolveShader.uniforms, uTexture: { value: inkMap } }}
          vertexShader={DissolveShader.vertexShader}
          fragmentShader={DissolveShader.fragmentShader}
          transparent
        />
      </mesh>
      {!isLoaded && (
        <Html
          position={[-1, 0, 8]}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: 100,
          }}
        >
          <h3 className='text-3xl text-claret-800 font-serif w-60 mb-4'>
            EXPERIENCE DESIGNED AND DEVELOPED BY DHRUVAL RAVAL
          </h3>
          <h1 className='text-3xl text-claret-800 font-serif'>
            {Math.round((loaded / total) * 100)}%
          </h1>
        </Html>
      )}
    </group>
  )
}

const Loader = memo(Component)
export default Loader
