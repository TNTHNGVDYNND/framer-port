// WebGL Components - Barrel export
export { default as WebGLBackground } from './WebGLBackground';
export { default as BackgroundMaterial } from './BackgroundMaterial';
export { 
  FluidBackgroundMaterial, 
  FluidFragmentShader, 
  FluidVertexShader 
} from './FluidShader';

// Hooks (also exported from their own directory)
export { default as useMousePosition } from '../../hooks/useMousePosition';
export { default as useScrollVelocity } from '../../hooks/useScrollVelocity';
