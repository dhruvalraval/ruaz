import React, { memo, useRef } from 'react'
import { MeshRefractionMaterial, useGLTF, useTexture } from '@react-three/drei'
import { SRGBColorSpace } from 'three'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'

function Component(props) {
  const { nodes, materials } = useGLTF('/models/ruaz_decimate.glb')
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

  const [
    displacementMap,
    goldRoughnessMap,
    crystalNormalMap,
    envMap,
    chainsMap,
  ] = useTexture([
    '/models/Displacement.webp',
    '/models/gold-scuffed_roughness.webp',
    '/models/crystal-normal.webp',
    '/models/blocky_photo_studio_1k.jpg',
    '/models/chains.png',
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
  // materials['gold.001'].alphaMap = chainsMap
  // materials['gold.001'].transparent = true
  return (
    <group
      {...props}
      ref={groupRef}
      dispose={null}
      position={[0, -2, 0]}
      scale={1.8}
    >
      <mesh
        name='face_low001'
        castShadow
        receiveShadow
        geometry={nodes.face_low001.geometry}
        material={materials.gold}
        position={[0, 0.903, -0.004]}
        scale={[0.77, 0.549, 0.77]}
      />
      <mesh
        name='Torus'
        castShadow
        receiveShadow
        geometry={nodes.Torus.geometry}
        material={materials.gold}
        position={[0, 2.165, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.065}
      />
      <mesh
        name='face_low003'
        castShadow
        receiveShadow
        geometry={nodes.face_low003.geometry}
        position={[0, 0.903, -0.004]}
        scale={[0.77, 0.549, 0.77]}
      >
        <MeshRefractionMaterial
          envMap={envMap}
          color={0xff3f7e}
          bounces={2}
          ior={2.8}
          thickness={0.01}
          fresnel={1}
          aberrationStrength={0.02}
          toneMapped={false}
        />
      </mesh>
      <mesh
        name='BézierCircle'
        castShadow
        receiveShadow
        geometry={nodes.BézierCircle.geometry}
        material={materials['gold.001']}
        position={[0, 3.173, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  )
}

useGLTF.preload('/models/ruaz_decimate.glb')

const Pendant = memo(Component)
export default Pendant
