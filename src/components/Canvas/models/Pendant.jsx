import React, { memo, useRef } from 'react'
import {
  MeshRefractionMaterial,
  Sparkles,
  useGLTF,
  useTexture,
} from '@react-three/drei'
import { SRGBColorSpace } from 'three'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'

function Component(props) {
  const { nodes, materials } = useGLTF('/models/ruaz2-v1.glb')
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
    }
  })

  const [displacementMap, goldRoughnessMap, crystalNormalMap, envMap] =
    useTexture([
      '/models/Displacement.webp',
      '/models/gold-scuffed_roughness.webp',
      '/models/crystal-normal.webp',
      '/models/blocky_photo_studio_1k.jpg',
    ])
  displacementMap.colorSpace =
    crystalNormalMap.colorSpace =
    goldRoughnessMap.colorSpace =
      SRGBColorSpace
  displacementMap.flipY =
    crystalNormalMap.flipY =
    goldRoughnessMap.flipY =
      false

  materials.gold.bumpMap = displacementMap
  materials.gold.roughnessMap = goldRoughnessMap
  materials['Emarald.002'].normalMap = crystalNormalMap

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
        material={materials['gold.001']}
        position={[0, 4.392, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        name='face_low001'
        castShadow
        receiveShadow
        geometry={nodes.face_low001.geometry}
        material={materials.gold}
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
          envMap={envMap}
          color={0xe0115f}
          bounces={2}
          ior={2.8}
          thickness={0.01}
          fresnel={1}
          aberrationStrength={0.01}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

useGLTF.preload('/models/ruaz2-v1.glb')

const Pendant = memo(Component)
export default Pendant
