import React, { memo, useRef } from 'react'
import {
  MeshRefractionMaterial,
  Sparkles,
  useGLTF,
  useTexture,
} from '@react-three/drei'
import { MeshPhysicalMaterial, SRGBColorSpace } from 'three'
import { useFrame, useLoader } from '@react-three/fiber'
import { MathUtils } from 'three'
import { lerp } from 'three/src/math/MathUtils.js'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'

function Component(props) {
  const { nodes, materials } = useGLTF('/models/ruaz2-v1.glb')

  const exrTexture = useLoader(EXRLoader, '/gem-2.exr')

  const groupRef = useRef()
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(Date.now() / 1000) * 0.06
      groupRef.current.rotation.y = MathUtils.damp(
        groupRef.current.rotation.y,
        (state.pointer.x * Math.PI) / 5,
        2.75,
        delta
      )

      if (state.pointer.x !== undefined && state.pointer.y !== undefined) {
        groupRef.current.rotation.y = lerp(
          groupRef.current.rotation.y,
          state.pointer.x,
          0.05
        )
        groupRef.current.rotation.x = lerp(
          groupRef.current.rotation.x,
          state.pointer.y * 0.1,
          0.05
        )
      }
    }
  })

  const [displacementMap] = useTexture(['/models/Displacement.webp'])
  displacementMap.colorSpace = SRGBColorSpace
  displacementMap.flipY = false

  const goldMat = new MeshPhysicalMaterial({
    color: 0xe7c257,
    metalness: 1,
    roughness: 0,
    bumpMap: displacementMap,
    bumpScale: 2,
    iridescence: 0.1,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [100, 400],
    reflectivity: 0.5,
    specularColor: 0xe7c257,
    specularIntensity: 1,
  })

  return (
    <group
      {...props}
      ref={groupRef}
      dispose={null}
      position={[0, -4, 0]}
      scale={1.8}
    >
      <mesh
        name='BézierCircle'
        castShadow
        receiveShadow
        geometry={nodes.BézierCircle.geometry}
        material={goldMat}
        position={[0, 4.392, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        name='face_low001'
        castShadow
        receiveShadow
        geometry={nodes.face_low001.geometry}
        material={goldMat}
        position={[0, 2.122, -0.004]}
        scale={[0.77, 0.544, 0.77]}
      >
        <Sparkles
          count={50}
          scale={10}
          size={6}
          speed={0.001}
          noise={0.1}
        />
      </mesh>
      <mesh
        name='uploads_files_2102400_heart+shape'
        castShadow
        receiveShadow
        geometry={nodes['uploads_files_2102400_heart+shape'].geometry}
        position={[0, 2.88, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.122, 0.108, 0.108]}
      >
        <MeshRefractionMaterial
          envMap={exrTexture}
          color={0xe1405c}
          bounces={4}
          ior={2.8}
          thickness={0.01}
          fresnel={1}
          aberrationStrength={0.01}
          toneMapped={true}
        />
      </mesh>
    </group>
  )
}

useGLTF.preload('/models/ruaz2-v1.glb')

const Pendant = memo(Component)
export default Pendant
