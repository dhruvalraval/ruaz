import { useFrame, useThree } from '@react-three/fiber'
import { memo, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const WaterShader = {
  uniforms: {
    uTime: { value: 0 },
    uHoverPosition: { value: new THREE.Vector2(-1, -1) },
    uHoverStrength: { value: 0 },
    uHorizonColor: { value: new THREE.Vector4(0.84, 0.31, 0.49, 0.01) }, // Fading color at the horizon
    uEnvMap: { value: null },
    uCameraPosition: { value: new THREE.Vector3(0, 0, 0) },
  },
  vertexShader: `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  uniform vec2 uHoverPosition;
  uniform float uHoverStrength;
  uniform vec3 uCameraPosition;

    #define M_PI 3.14159265358979323846

    float rand(vec2 co){return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);}
    float rand (vec2 co, float l) {return rand(vec2(rand(co), l));}
    float rand (vec2 co, float l, float t) {return rand(vec2(rand(co, l), t));}

    float perlin(vec2 p, float dim, float time) {
        vec2 pos = floor(p * dim);
        vec2 posx = pos + vec2(1.0, 0.0);
        vec2 posy = pos + vec2(0.0, 1.0);
        vec2 posxy = pos + vec2(1.0);
        
        float c = rand(pos, dim, time);
        float cx = rand(posx, dim, time);
        float cy = rand(posy, dim, time);
        float cxy = rand(posxy, dim, time);
        
        vec2 d = fract(p * dim);
        d = -0.5 * cos(d * M_PI) + 0.5;
        
        float ccx = mix(c, cx, d.x);
        float cycxy = mix(cy, cxy, d.x);
        float center = mix(ccx, cycxy, d.y);
        
        return center * 2.0 - 1.0;
    }

    // p must be normalized!
    float perlin(vec2 p, float dim) {
        
        /*vec2 pos = floor(p * dim);
        vec2 posx = pos + vec2(1.0, 0.0);
        vec2 posy = pos + vec2(0.0, 1.0);
        vec2 posxy = pos + vec2(1.0);
        
        // For exclusively black/white noise
        /*float c = step(rand(pos, dim), 0.5);
        float cx = step(rand(posx, dim), 0.5);
        float cy = step(rand(posy, dim), 0.5);
        float cxy = step(rand(posxy, dim), 0.5);*/
        
        /*float c = rand(pos, dim);
        float cx = rand(posx, dim);
        float cy = rand(posy, dim);
        float cxy = rand(posxy, dim);
        
        vec2 d = fract(p * dim);
        d = -0.5 * cos(d * M_PI) + 0.5;
        
        float ccx = mix(c, cx, d.x);
        float cycxy = mix(cy, cxy, d.x);
        float center = mix(ccx, cycxy, d.y);
        
        return center * 2.0 - 1.0;*/
        return perlin(p, dim, 0.0);
    }

  void main() {
    vUv = uv;
    vNormal = normalize(normal);
    vPosition = position;

    // Generate Perlin noise for waves
    float wave = perlin(vec2(position.x * 0.7, position.y * 0.7 + uTime * 0.4), 5.0) * 0.07;

    // Add ripple effect based on hover position
    float distance = distance(vUv, uHoverPosition);
    wave += exp(-distance * 20.0) * uHoverStrength * 0.15;

    // Apply wave height
    vec3 pos = position;
    pos.z += wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform vec4 uHorizonColor;
    uniform samplerCube uEnvMap; // The HDR environment map
    uniform vec3 uCameraPosition;
  
    void main() {
    vec3 I = normalize(vPosition - uCameraPosition); // View direction
    vec3 R = reflect(I, vNormal); // Reflection vector
    vec4 reflectionColor = textureCube(uEnvMap, R); // Sample the HDR environment map

      float fade = smoothstep(0.4,1.0, vUv.y); // Fading out near the horizon
      vec4 waterColor  = mix(vec4(0.8,0.6,0.7, 1.0), uHorizonColor, fade); // Ocean to sky color
      vec4 finalColor = mix(waterColor, reflectionColor, 0.15); // Blend reflection with water color
      gl_FragColor = vec4(finalColor);
    }
    `,
}

function Component({ texture }) {
  const meshRef = useRef()
  const { camera, clock, pointer } = useThree()
  const [hoverPosition, setHoverPosition] = useState(new THREE.Vector2(-1, -1))
  const [hoverStrength, setHoverStrength] = useState(0)

  // Raycaster setup
  const raycaster = useRef(new THREE.Raycaster())

  useFrame(({ _, delta }) => {
    // Update time uniform
    if (meshRef.current) {
      //   console.log(meshRef.current)
      meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime()

      raycaster.current.setFromCamera(pointer, camera)
      const intersects = raycaster.current.intersectObject(meshRef.current)
      if (intersects.length > 0) {
        const intersectPoint = intersects[0].uv
        setHoverPosition(intersectPoint)
        setHoverStrength(1)
      } else {
        setHoverStrength(0)
      }

      meshRef.current.material.uniforms.uCameraPosition.value = camera.position
    }
  })

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uHoverPosition.value = hoverPosition
      meshRef.current.material.uniforms.uHoverStrength.value = hoverStrength
    }
  }, [hoverPosition, hoverStrength])

  return (
    <mesh
      ref={meshRef}
      rotation-x={-Math.PI / 2}
      position={[0, -2, 0]}
      scale={5}
    >
      <planeGeometry args={[20, 20, 128, 128]} />
      <shaderMaterial
        uniforms={{ ...WaterShader.uniforms, uEnvMap: { value: texture } }}
        vertexShader={WaterShader.vertexShader}
        fragmentShader={WaterShader.fragmentShader}
        transparent
      />
    </mesh>
  )
}

const Water = memo(Component)
export default Water
