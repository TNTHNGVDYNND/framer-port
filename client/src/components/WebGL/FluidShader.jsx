import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Simplified shader to prevent context loss
const FluidBackgroundMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0.5, 0.5),
    uScrollVelocity: 0,
    uResolution: new THREE.Vector2(1, 1),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader - Simplified for performance
  `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uScrollVelocity;
    uniform vec2 uResolution;
    
    varying vec2 vUv;
    
    // Simple hash function
    float hash(float n) { 
      return fract(sin(n) * 43758.5453123);
    }
    
    // Simplified noise - just 2 octaves
    float noise(vec2 x) {
      vec2 p = floor(x);
      vec2 f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      
      float n = p.x + p.y * 57.0;
      return mix(
        mix(hash(n), hash(n + 1.0), f.x),
        mix(hash(n + 57.0), hash(n + 58.0), f.x),
        f.y
      );
    }
    
    // Fractal Brownian Motion - 2 octaves only
    float fbm(vec2 x) {
      float v = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100.0);
      
      for(int i = 0; i < 2; ++i) {
        v += a * noise(x);
        x = x * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }
    
    void main() {
      vec2 uv = vUv;
      float time = uTime * 0.08;
      
      // Very subtle mouse influence
      vec2 mouseOffset = (uMouse - 0.5) * 0.02;
      
      // Scroll creates very subtle flow
      float scrollFlow = uScrollVelocity * 0.1;
      
      // Simple distorted UV
      vec2 distortedUV = uv + vec2(
        sin(uv.y * 3.0 + time) * 0.01 * scrollFlow,
        0.0
      );
      
      // Base noise - just 2 layers
      float n1 = fbm(distortedUV * 2.0 + mouseOffset + time * 0.3);
      float n2 = fbm(distortedUV * 4.0 - mouseOffset - time * 0.2);
      
      // Combine
      float noise = n1 * 0.6 + n2 * 0.4;
      
      // Moody forest colors
      vec3 darkGreen = vec3(0.04, 0.06, 0.05);
      vec3 midGreen = vec3(0.08, 0.10, 0.07);
      vec3 amber = vec3(0.25, 0.18, 0.08);
      
      // Mix colors
      vec3 color = mix(darkGreen, midGreen, noise);
      
      // Subtle amber glow from top
      float glow = smoothstep(0.8, 0.0, uv.y) * 0.15;
      glow *= (0.5 + 0.5 * sin(time + uv.x * 2.0));
      color += amber * glow;
      
      // Vignette
      float vignette = 1.0 - length((uv - 0.5) * 1.2);
      vignette = smoothstep(0.0, 0.7, vignette);
      color *= vignette * 0.3 + 0.7;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

export { FluidBackgroundMaterial };
export default FluidBackgroundMaterial;
