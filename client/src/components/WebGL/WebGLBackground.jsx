/*
 * @deprecated - WebGL background component not currently in use
 * Replaced with CSS-based background effects for better performance
 * Full-screen fluid shader with mouse interaction and reduced motion support
 * Preserved for future WebGL background re-implementation
 */

import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import BackgroundMaterial from './BackgroundMaterial';
import useMousePosition from '../../hooks/useMousePosition';
import useScrollVelocity from '../../hooks/useScrollVelocity';

// Full-screen plane with fluid shader
const FluidPlane = () => {
  const meshRef = useRef();
  const { viewport } = useThree();

  // Get mouse position for shader interaction
  const mousePosition = useMousePosition();
  const scrollVelocity = useScrollVelocity();

  // Normalize mouse coordinates to 0-1 range for shader
  const normalizedMouse = useMemo(() => {
    if (!mousePosition) return { x: 0.5, y: 0.5 };
    return {
      x: mousePosition.x / window.innerWidth,
      y: 1 - mousePosition.y / window.innerHeight, // Flip Y for WebGL coords
    };
  }, [mousePosition]);

  // Resize plane to fill viewport
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.set(viewport.width, viewport.height, 1);
    }
  }, [viewport]);

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} />
      <BackgroundMaterial
        uMouse={normalizedMouse}
        uScrollVelocity={scrollVelocity}
        uResolution={{
          x: window.innerWidth,
          y: window.innerHeight,
        }}
      />
    </mesh>
  );
};

// Main WebGL Background component
const WebGLBackground = () => {
  const containerRef = useRef();
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Visibility API for performance (pause when tab hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Handle WebGL context loss
  useEffect(() => {
    const canvas = containerRef.current?.querySelector('canvas');
    if (!canvas) return;

    const handleContextLost = (e) => {
      e.preventDefault();
      setContextLost(true);
      console.warn('WebGL context lost - falling back to CSS background');
    };

    const handleContextRestored = () => {
      setContextLost(false);
      console.log('WebGL context restored');
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, []);

  // Don't render WebGL if user prefers reduced motion or context is lost
  if (prefersReducedMotion || contextLost) {
    return (
      <div
        className='fixed inset-0 z-0 pointer-events-none'
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, #1a1a0a 0%, #0a0a08 50%, #000000 100%)
          `,
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className='fixed inset-0 z-0 pointer-events-none'
      style={{
        width: '100vw',
        height: '100vh',
      }}
    >
      <Canvas
        gl={{
          antialias: false, // Disable for performance
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]} // Cap pixel ratio for performance
        frameloop={isVisible ? 'always' : 'never'}
        camera={{ position: [0, 0, 1] }}
      >
        <OrthographicCamera makeDefault position={[0, 0, 1]} zoom={1} />
        <FluidPlane />
      </Canvas>
    </div>
  );
};

export default WebGLBackground;
