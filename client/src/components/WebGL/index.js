/*
 * @deprecated - WebGL components are not currently in use
 * Replaced with CSS-based background effects for better performance
 * Files preserved for future refactoring or potential WebGL re-implementation
 */

// WebGL Components - Barrel export
// NOTE: These exports are commented out - components not currently imported anywhere
// export { default as WebGLBackground } from './WebGLBackground';
// export { default as BackgroundMaterial } from './BackgroundMaterial';
// export { 
//   FluidBackgroundMaterial, 
//   FluidFragmentShader, 
//   FluidVertexShader 
// } from './FluidShader';

// Hooks (also exported from their own directory)
export { default as useMousePosition } from '../../hooks/useMousePosition';
export { default as useScrollVelocity } from '../../hooks/useScrollVelocity';
