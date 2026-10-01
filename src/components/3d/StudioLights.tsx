"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Soft studio lighting built from Lightformers, so no HDR file needs to be
 * downloaded at runtime (works offline and avoids third-party CDNs).
 */
export function StudioLights({ intensity = 1 }: { intensity?: number }) {
  return (
    <>
      <ambientLight intensity={0.35 * intensity} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.4 * intensity}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2} position={[0, 5, -5]} scale={[10, 5, 1]} />
        <Lightformer form="rect" intensity={1.5} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={1.5} position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer form="ring" color="#c4b5fd" intensity={3} position={[0, 3, 4]} scale={2} />
      </Environment>
    </>
  );
}
