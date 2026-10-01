"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { PetModel } from "@/components/3d/PetModels";
import { StudioLights } from "@/components/3d/StudioLights";

/** Friendly procedural dog mascot whose head follows the cursor and tail wags. */
function DogMascot() {
  const head = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);

  useFrame(({ pointer, clock }) => {
    const t = clock.elapsedTime;
    if (head.current) {
      head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, pointer.x * 0.6, 0.08);
      head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, -pointer.y * 0.3, 0.08);
    }
    if (tail.current) tail.current.rotation.z = Math.sin(t * 10) * 0.5 + 0.6;
    if (body.current) body.current.position.y = Math.abs(Math.sin(t * 2)) * 0.06;
  });

  const fur = "#f5c38b";
  const dark = "#7c4a1e";

  return (
    <group ref={body} scale={0.95}>
      {/* body */}
      <mesh castShadow position={[0, 0, 0]} scale={[1.1, 0.85, 0.8]}>
        <sphereGeometry args={[0.7, 48, 48]} />
        <meshPhysicalMaterial color={fur} roughness={0.8} sheen={1} sheenColor="#fff7ed" />
      </mesh>
      {/* legs */}
      {[
        [-0.45, 0.3],
        [0.45, 0.3],
        [-0.45, -0.3],
        [0.45, -0.3],
      ].map(([x, z], i) => (
        <mesh key={i} castShadow position={[x, -0.6, z]}>
          <capsuleGeometry args={[0.13, 0.3, 8, 16]} />
          <meshStandardMaterial color={fur} roughness={0.8} />
        </mesh>
      ))}
      {/* collar */}
      <mesh position={[0.55, 0.35, 0]} rotation={[0, 0, -0.9]}>
        <torusGeometry args={[0.33, 0.06, 16, 48]} />
        <meshStandardMaterial color="#7c3aed" />
      </mesh>
      {/* head */}
      <group ref={head} position={[0.75, 0.65, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.5, 48, 48]} />
          <meshPhysicalMaterial color={fur} roughness={0.8} sheen={1} sheenColor="#fff7ed" />
        </mesh>
        {/* snout */}
        <mesh position={[0.4, -0.1, 0]} scale={[1, 0.75, 0.9]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color="#fde7c8" roughness={0.9} />
        </mesh>
        <mesh position={[0.63, -0.03, 0]}>
          <sphereGeometry args={[0.08, 24, 24]} />
          <meshPhysicalMaterial color="#111827" clearcoat={1} roughness={0.2} />
        </mesh>
        {/* eyes */}
        {[0.18, -0.18].map((z) => (
          <group key={z} position={[0.38, 0.15, z]}>
            <mesh>
              <sphereGeometry args={[0.08, 24, 24]} />
              <meshPhysicalMaterial color="#111827" clearcoat={1} roughness={0.1} />
            </mesh>
            <mesh position={[0.05, 0.03, 0.02]}>
              <sphereGeometry args={[0.022, 12, 12]} />
              <meshBasicMaterial color="white" />
            </mesh>
          </group>
        ))}
        {/* ears */}
        {[0.38, -0.38].map((z) => (
          <mesh key={z} position={[-0.05, 0.1, z]} rotation={[z > 0 ? 0.5 : -0.5, 0, 0.2]} scale={[0.6, 1.2, 0.3]}>
            <sphereGeometry args={[0.25, 32, 32]} />
            <meshStandardMaterial color={dark} roughness={0.9} />
          </mesh>
        ))}
        {/* tongue */}
        <mesh position={[0.48, -0.3, 0]} rotation={[0, 0, 0.3]} scale={[1, 1.4, 0.5]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#f472b6" />
        </mesh>
      </group>
      {/* tail */}
      <group ref={tail} position={[-0.75, 0.2, 0]}>
        <mesh position={[-0.15, 0.2, 0]} rotation={[0, 0, 0.5]}>
          <capsuleGeometry args={[0.07, 0.4, 8, 16]} />
          <meshStandardMaterial color={dark} />
        </mesh>
      </group>
    </group>
  );
}

const floaters = [
  { kind: "ball", color: "#f97316", accent: "#ffffff", position: [-1.9, 1.3, -0.5], scale: 0.5 },
  { kind: "bone", color: "#fde68a", accent: "#f59e0b", position: [1.9, 1.6, -0.8], scale: 0.45 },
  { kind: "bowl", color: "#f43f5e", accent: "#fff1f2", position: [-1.8, -0.7, 0.6], scale: 0.5 },
  { kind: "mouse", color: "#9ca3af", accent: "#f9a8d4", position: [1.9, -0.6, 0.5], scale: 0.5 },
  { kind: "collar", color: "#22c55e", accent: "#bbf7d0", position: [0.2, 2.1, -1.5], scale: 0.4 },
] as const;

function Rig() {
  useFrame(({ camera, pointer }) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.6, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.6 + pointer.y * 0.3, 0.03);
    camera.lookAt(0, 0.2, 0);
  });
  return null;
}

export default function HeroScene() {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0.6, 6.5], fov: 45 }}>
      <StudioLights />
      <Rig />
      <group position={[-0.3, -0.2, 0]} rotation={[0, -0.5, 0]}>
        <DogMascot />
      </group>
      {floaters.map((f, i) => (
        <Float key={i} speed={1.5 + i * 0.3} rotationIntensity={1.2} floatIntensity={1.4}>
          <group position={f.position as unknown as [number, number, number]} scale={f.scale}>
            <PetModel kind={f.kind} color={f.color} accent={f.accent} />
          </group>
        </Float>
      ))}
      <Sparkles count={60} scale={[8, 4, 4]} size={3} speed={0.4} color="#c4b5fd" />
      <ContactShadows position={[0, -1.05, 0]} opacity={0.4} scale={10} blur={2.5} far={3} />
    </Canvas>
  );
}
