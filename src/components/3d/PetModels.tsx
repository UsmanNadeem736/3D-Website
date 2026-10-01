"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ModelKind } from "@/types";

/**
 * Procedural, asset-free 3D models for every product type. Each model is
 * roughly 1.5 units tall and centred on the origin, resting on y = -0.75,
 * so they can be swapped for real .glb exports without layout changes.
 */

type ModelProps = { color: string; accent: string };

function Mat({ color, rough = 0.45, metal = 0.05, ...rest }: { color: string; rough?: number; metal?: number } & Partial<THREE.MeshPhysicalMaterialParameters>) {
  return <meshPhysicalMaterial color={color} roughness={rough} metalness={metal} clearcoat={0.3} {...(rest as object)} />;
}

function Ball({ color, accent }: ModelProps) {
  return (
    <group>
      <mesh castShadow>
        <sphereGeometry args={[0.7, 64, 64]} />
        <Mat color={color} rough={0.6} />
      </mesh>
      {/* tennis-ball seam */}
      <mesh rotation={[Math.PI / 2, 0.4, 0]}>
        <torusGeometry args={[0.705, 0.03, 16, 96]} />
        <Mat color={accent} />
      </mesh>
      <mesh rotation={[0.3, Math.PI / 2, 0]}>
        <torusGeometry args={[0.705, 0.03, 16, 96]} />
        <Mat color={accent} />
      </mesh>
    </group>
  );
}

function Bone({ color, accent }: ModelProps) {
  const knobs: [number, number][] = [
    [-0.85, 0.22],
    [-0.85, -0.22],
    [0.85, 0.22],
    [0.85, -0.22],
  ];
  return (
    <group rotation={[0.2, 0, 0.35]}>
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.2, 1.5, 16, 32]} />
        <Mat color={color} />
      </mesh>
      {knobs.map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0]} castShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
          <Mat color={color} />
        </mesh>
      ))}
      {[-0.4, 0, 0.4].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.205, 0.025, 12, 48]} />
          <Mat color={accent} />
        </mesh>
      ))}
    </group>
  );
}

function Bag({ color, accent }: ModelProps) {
  return (
    <group>
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[1.1, 1.5, 0.55]} />
        <Mat color={color} rough={0.35} />
      </mesh>
      {/* crimped top */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[1.12, 0.12, 0.2]} />
        <Mat color={color} rough={0.3} />
      </mesh>
      {/* label */}
      <mesh position={[0, 0.05, 0.28]}>
        <planeGeometry args={[0.85, 0.7]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      {/* fish logo */}
      <group position={[0, 0.08, 0.285]}>
        <mesh scale={[1, 0.55, 0.2]}>
          <sphereGeometry args={[0.22, 32, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0.26, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.1, 0.16, 3]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
      <mesh position={[0, -0.22, 0.285]}>
        <planeGeometry args={[0.6, 0.06]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function Bowl({ color, accent }: ModelProps) {
  const points = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      pts.push(new THREE.Vector2(0.55 + 0.35 * Math.sin(t * Math.PI * 0.5), -0.35 + t * 0.6));
    }
    return pts;
  }, []);
  return (
    <group position={[0, -0.3, 0]}>
      <mesh castShadow>
        <latheGeometry args={[points, 64]} />
        <Mat color={color} rough={0.2} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.58, 0.58, 0.08, 64]} />
        <Mat color={accent} />
      </mesh>
      {/* slow-feeder maze */}
      {[0.18, 0.38].map((r) => (
        <mesh key={r} position={[0, -0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.045, 12, 48]} />
          <Mat color={accent} />
        </mesh>
      ))}
    </group>
  );
}

function Bed({ color, accent }: ModelProps) {
  return (
    <group position={[0, -0.4, 0]}>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.32, 32, 64]} />
        <Mat color={color} rough={0.95} sheen={1} sheenColor={new THREE.Color(accent)} />
      </mesh>
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.9, 0.95, 0.2, 64]} />
        <Mat color={accent} rough={1} />
      </mesh>
    </group>
  );
}

function Collar({ color, accent }: ModelProps) {
  const lights = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!lights.current) return;
    lights.current.children.forEach((c, i) => {
      const m = (c as THREE.Mesh).material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 1 + Math.sin(clock.elapsedTime * 4 + i) * 0.9;
    });
  });
  return (
    <group rotation={[1.1, 0, 0]}>
      <mesh castShadow>
        <torusGeometry args={[0.7, 0.09, 24, 96]} />
        <Mat color={color} />
      </mesh>
      <group ref={lights}>
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.7, Math.sin(a) * 0.7, 0.08]}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.5} />
            </mesh>
          );
        })}
      </group>
      <mesh position={[0, -0.82, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.04, 32]} />
        <Mat color="#facc15" metal={0.9} rough={0.2} />
      </mesh>
    </group>
  );
}

function Mouse({ color, accent }: ModelProps) {
  const tail = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (tail.current) tail.current.rotation.y = Math.sin(clock.elapsedTime * 6) * 0.4;
  });
  return (
    <group position={[0, -0.35, 0]}>
      <mesh castShadow scale={[1, 0.7, 0.75]}>
        <sphereGeometry args={[0.6, 48, 48]} />
        <Mat color={color} rough={0.5} />
      </mesh>
      <mesh position={[0.6, 0.02, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.25, 0.45, 32]} />
        <Mat color={color} rough={0.5} />
      </mesh>
      <mesh position={[0.84, 0.02, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <Mat color={accent} />
      </mesh>
      {[0.22, -0.22].map((z) => (
        <group key={z}>
          <mesh position={[0.35, 0.4, z]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.17, 0.17, 0.04, 32]} />
            <Mat color={accent} />
          </mesh>
          <mesh position={[0.62, 0.15, z * 0.55]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
        </group>
      ))}
      <group ref={tail} position={[-0.6, 0, 0]}>
        <mesh position={[-0.4, 0.1, 0]} rotation={[0, 0, 1.3]}>
          <capsuleGeometry args={[0.03, 0.8, 8, 16]} />
          <Mat color={accent} />
        </mesh>
      </group>
    </group>
  );
}

function Tower({ color, accent }: ModelProps) {
  const platforms: [number, number, number, number][] = [
    [0, -0.7, 0, 0.75],
    [0.3, 0.05, 0.1, 0.45],
    [-0.25, 0.65, -0.1, 0.4],
  ];
  return (
    <group>
      {platforms.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} castShadow receiveShadow>
          <cylinderGeometry args={[r, r, 0.1, 48]} />
          <Mat color={color} rough={1} />
        </mesh>
      ))}
      {[
        [0.3, -0.33, 0.1, 0.65],
        [-0.25, 0.0, -0.1, 1.3],
      ].map(([x, y, z, h], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, h, 24]} />
          <Mat color={accent} rough={1} />
        </mesh>
      ))}
      {/* hideaway box */}
      <mesh position={[-0.35, -0.42, 0.15]} castShadow>
        <boxGeometry args={[0.55, 0.45, 0.5]} />
        <Mat color={color} rough={1} />
      </mesh>
      <mesh position={[-0.35, -0.42, 0.41]}>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      {/* toy ball on a string */}
      <mesh position={[0.6, -0.25, 0.1]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
    </group>
  );
}

function Bottle({ color, accent }: ModelProps) {
  return (
    <group>
      <mesh castShadow position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.38, 0.42, 1.2, 48]} />
        <Mat color={color} rough={0.15} transmission={0.2} thickness={0.5} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.18, 0.38, 0.15, 48]} />
        <Mat color={color} rough={0.15} />
      </mesh>
      <mesh position={[0, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.17, 0.18, 32]} />
        <Mat color={accent} rough={0.3} />
      </mesh>
      <mesh position={[0.12, 0.76, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.25, 0.05, 0.08]} />
        <Mat color={accent} />
      </mesh>
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.395, 0.425, 0.6, 48, 1, true]} />
        <meshStandardMaterial color={accent} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Carrier({ color, accent }: ModelProps) {
  return (
    <group position={[0, -0.2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[1.5, 0.9, 0.9]} />
        <Mat color={color} rough={0.35} />
      </mesh>
      {/* front grille */}
      <group position={[0.76, 0, 0]}>
        {[-0.24, -0.12, 0, 0.12, 0.24].map((z) => (
          <mesh key={z} position={[0, 0, z]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
            <Mat color={accent} metal={0.8} rough={0.3} />
          </mesh>
        ))}
      </group>
      {/* vents */}
      {[-0.4, -0.15, 0.1, 0.35].map((x) => (
        <mesh key={x} position={[x, 0.1, 0.455]}>
          <boxGeometry args={[0.12, 0.4, 0.02]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
      ))}
      {/* handle */}
      <mesh position={[0, 0.6, 0]}>
        <torusGeometry args={[0.3, 0.05, 16, 48, Math.PI]} />
        <Mat color={accent} />
      </mesh>
    </group>
  );
}

function FishBowl({ color, accent }: ModelProps) {
  const fish = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!fish.current) return;
    const t = clock.elapsedTime * 0.8;
    fish.current.position.set(Math.cos(t) * 0.35, Math.sin(t * 2) * 0.08 - 0.05, Math.sin(t) * 0.35);
    fish.current.rotation.y = -t;
  });
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.75, 64, 64, 0, Math.PI * 2, 0.35, Math.PI - 0.35]} />
        <meshPhysicalMaterial color="#ffffff" transmission={1} roughness={0.05} thickness={0.2} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <sphereGeometry args={[0.7, 48, 48, 0, Math.PI * 2, 1.2, Math.PI - 1.55]} />
        <meshStandardMaterial color={color} transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, -0.66, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.06, 48]} />
        <meshStandardMaterial color="#e7d3a3" />
      </mesh>
      <group ref={fish}>
        <mesh scale={[1, 0.6, 0.35]}>
          <sphereGeometry args={[0.12, 24, 24]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[-0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.07, 0.1, 3]} />
          <meshStandardMaterial color={accent} />
        </mesh>
      </group>
    </group>
  );
}

function Hutch({ color, accent }: ModelProps) {
  return (
    <group position={[0, -0.1, 0]}>
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 1, 0.8]} />
        <Mat color={color} rough={0.9} />
      </mesh>
      {/* roof */}
      <mesh castShadow position={[0, 0.65, 0]} rotation={[0, 0, Math.PI / 4]} scale={[1, 1, 1.15]}>
        <boxGeometry args={[0.8, 0.8, 0.85]} />
        <Mat color={accent} rough={0.9} />
      </mesh>
      {/* mesh window */}
      <mesh position={[0.32, 0.05, 0.41]}>
        <planeGeometry args={[0.6, 0.6]} />
        <meshStandardMaterial color="#d1d5db" wireframe />
      </mesh>
      <mesh position={[-0.4, 0.05, 0.405]}>
        <planeGeometry args={[0.45, 0.6]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      {/* legs */}
      {[
        [-0.7, -0.35],
        [0.7, -0.35],
        [-0.7, 0.35],
        [0.7, 0.35],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.6, z]}>
          <boxGeometry args={[0.08, 0.25, 0.08]} />
          <Mat color={color} />
        </mesh>
      ))}
    </group>
  );
}

const registry: Record<ModelKind, (p: ModelProps) => React.JSX.Element> = {
  ball: Ball,
  bone: Bone,
  bag: Bag,
  bowl: Bowl,
  bed: Bed,
  collar: Collar,
  mouse: Mouse,
  tower: Tower,
  bottle: Bottle,
  carrier: Carrier,
  fishbowl: FishBowl,
  hutch: Hutch,
};

export function PetModel({ kind, color, accent }: { kind: ModelKind } & ModelProps) {
  const Component = registry[kind] ?? Ball;
  return <Component color={color} accent={accent} />;
}
