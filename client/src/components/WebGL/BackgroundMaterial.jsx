/*
 * @deprecated - WebGL background material not currently in use
 * Replaced with CSS-based background effects for better performance
 * Manages FluidBackgroundMaterial uniforms and Three.js integration
 * Preserved for future WebGL background re-implementation
 */

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import PropTypes from 'prop-types';
import { FluidBackgroundMaterial } from './FluidShader';
import * as THREE from 'three';

// Extend THREE namespace with our custom shader material
// This registers the material with Three.js and prevents console warnings
extend({ FluidBackgroundMaterial });

const BackgroundMaterial = ({ uMouse, uScrollVelocity, uResolution }) => {
  const materialRef = useRef();

  // Update uniforms each frame
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      if (uMouse) {
        materialRef.current.uniforms.uMouse.value.set(uMouse.x, uMouse.y);
      }
      
      if (uScrollVelocity !== undefined) {
        materialRef.current.uniforms.uScrollVelocity.value = uScrollVelocity;
      }
      
      if (uResolution) {
        materialRef.current.uniforms.uResolution.value.set(
          uResolution.x,
          uResolution.y
        );
      }
    }
  });

  // Cleanup
  useEffect(() => {
    return () => {
      if (materialRef.current) {
        materialRef.current.dispose();
      }
    };
  }, []);

  // Use the extended material directly
  return (
    <fluidBackgroundMaterial
      ref={materialRef}
      uTime={0}
      uMouse={uMouse ? new THREE.Vector2(uMouse.x, uMouse.y) : new THREE.Vector2(0.5, 0.5)}
      uScrollVelocity={uScrollVelocity || 0}
      uResolution={uResolution ? new THREE.Vector2(uResolution.x, uResolution.y) : new THREE.Vector2(1, 1)}
    />
  );
};

BackgroundMaterial.propTypes = {
  uMouse: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  uScrollVelocity: PropTypes.number,
  uResolution: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
};

export default BackgroundMaterial;
