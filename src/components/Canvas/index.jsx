import {
  ArcballControls,
  CameraControls,
  CubeCamera,
  Environment,
} from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { memo, Suspense, useEffect, useRef } from 'react'
import Background from './Background'
import Pendant from './models/Pendant'
import Water from './Water'
import Petals from './FloatingPetals'
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  TiltShift2,
} from '@react-three/postprocessing'
import Loader from '../Loader'
import CameraRot from './CameraRot'

function Component() {
  const controlsRef = useRef()

  return (
    <div className='w-screen h-screen'>
      <Canvas
        shadows
        camera={{ fov: 70, position: [0, 0, 10] }}
      >
        <Loader />
        <fogExp2
          attach='fog'
          color='white'
          density={0.001}
          isFogExp2={true}
        />
        <Suspense fallback={null}>
          <CubeCamera>{(texture) => <Water texture={texture} />}</CubeCamera>
          <Petals />
          <Pendant />
          <Background />
          <Environment
            files={'/the_sky_is_on_fire_1k_11zon.jpg'}
            environmentIntensity={1}
          />
        </Suspense>
        <CameraControls
          ref={controlsRef}
          dollySpeed={0.000001}
          truckSpeed={0.000001}
          minAzimuthAngle={0}
          maxAzimuthAngle={0}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
        <CameraRot controls={controlsRef} />
        <EffectComposer>
          <Bloom
            intensity={0.4}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.7}
            height={300}
          />
          <DepthOfField
            focusDistance={0.0}
            focalLength={0.8}
            bokehScale={2}
          />
          <TiltShift2 blur={0.08} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

const CanvasScreen = memo(Component)
export default CanvasScreen
