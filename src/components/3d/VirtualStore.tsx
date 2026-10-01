"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls, RoundedBox } from "@react-three/drei";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { ProductModel } from "@/components/3d/ProductModel";
import { StudioLights } from "@/components/3d/StudioLights";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";

const SLOTS_PER_SHELF = 4;
const SHELF_WIDTH = 6;
const SHELF_LEVELS = [0, 1.6];

function ShelfItem({ product, position }: { product: Product; position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const add = useCart((s) => s.add);

  useFrame(({ clock }, delta) => {
    if (!ref.current) return;
    const target = hovered ? 0.3 : 0;
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, target + Math.sin(clock.elapsedTime * 2 + position[0]) * 0.03, 0.1);
    ref.current.rotation.y += delta * (hovered ? 1.5 : 0.25);
    const s = THREE.MathUtils.lerp(ref.current.scale.x, hovered ? 0.8 : 0.62, 0.1);
    ref.current.scale.setScalar(s);
  });

  return (
    <group position={position}>
      <group
        ref={ref}
        scale={0.62}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "auto";
          router.push(`/products/${product.id}`);
        }}
      >
        <ProductModel product={product} />
      </group>
      {/* price tag */}
      <Html position={[0, -0.45, 0.45]} center distanceFactor={6} zIndexRange={[10, 0]}>
        <div
          className={`whitespace-nowrap rounded-lg px-2 py-1 text-center text-xs font-semibold shadow transition ${
            hovered ? "scale-110 bg-violet-600 text-white" : "bg-white text-gray-800"
          }`}
        >
          {formatPrice(product.price)}
        </div>
      </Html>
      {hovered && (
        <Html position={[0, 1.1, 0]} center distanceFactor={6} zIndexRange={[20, 10]}>
          <div className="w-48 rounded-xl bg-white/95 p-3 text-center shadow-xl backdrop-blur">
            <p className="text-sm font-bold text-gray-900">{product.name}</p>
            <p className="mb-2 text-xs text-gray-500">{product.tagline}</p>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                add(product);
              }}
              className="pointer-events-auto rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white hover:bg-violet-700"
            >
              Quick add
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}

/** Renders sign text into a canvas texture — no font files or DOM overlays needed. */
function SignLabel({ text, width, height }: { text: string; width: number; height: number }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = Math.round((512 * height) / width);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.font = `800 ${Math.round(canvas.height * 0.55)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 4);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, [text, width, height]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={[0, 0, 0.045]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  );
}

function ShelfUnit({ products, position, label, color }: { products: Product[]; position: [number, number, number]; label: string; color: string }) {
  return (
    <group position={position}>
      {/* back panel */}
      <RoundedBox args={[SHELF_WIDTH + 0.3, 3.6, 0.15]} radius={0.05} position={[0, 0.9, -0.6]} receiveShadow>
        <meshStandardMaterial color="#f5f3ff" />
      </RoundedBox>
      {/* sides */}
      {[-1, 1].map((side) => (
        <RoundedBox key={side} args={[0.15, 3.6, 1.3]} radius={0.04} position={[(side * (SHELF_WIDTH + 0.3)) / 2, 0.9, 0]} castShadow>
          <meshStandardMaterial color="#ddd6fe" />
        </RoundedBox>
      ))}
      {/* boards */}
      {SHELF_LEVELS.map((y) => (
        <RoundedBox key={y} args={[SHELF_WIDTH, 0.1, 1.2]} radius={0.03} position={[0, y - 0.55, 0]} receiveShadow castShadow>
          <meshStandardMaterial color="#ffffff" />
        </RoundedBox>
      ))}
      {/* category sign */}
      <group position={[0, 2.95, -0.5]}>
        <RoundedBox args={[2.2, 0.5, 0.08]} radius={0.06}>
          <meshStandardMaterial color={color} />
        </RoundedBox>
        <SignLabel text={label} width={2.1} height={0.45} />
      </group>
      {products.slice(0, SLOTS_PER_SHELF * SHELF_LEVELS.length).map((product, i) => {
        const level = Math.floor(i / SLOTS_PER_SHELF);
        const slot = i % SLOTS_PER_SHELF;
        const x = -SHELF_WIDTH / 2 + (SHELF_WIDTH / SLOTS_PER_SHELF) * (slot + 0.5);
        return <ShelfItem key={product.id} product={product} position={[x, SHELF_LEVELS[level] - 0.1, 0]} />;
      })}
    </group>
  );
}

export default function VirtualStore({ products }: { products: Product[] }) {
  const dogs = products.filter((p) => p.category === "Dog");
  const cats = products.filter((p) => p.category === "Cat");
  const others = products.filter((p) => p.category !== "Dog" && p.category !== "Cat");

  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 2, 8], fov: 50 }}>
      <color attach="background" args={["#faf5ff"]} />
      <fog attach="fog" args={["#faf5ff", 14, 26]} />
      <StudioLights />
      <Suspense fallback={null}>
        <ShelfUnit products={dogs} position={[0, 0, -2]} label="DOGS" color="#7c3aed" />
        <group position={[-6.2, 0, 1]} rotation={[0, Math.PI / 3.2, 0]}>
          <ShelfUnit products={cats} position={[0, 0, 0]} label="CATS" color="#ec4899" />
        </group>
        <group position={[6.2, 0, 1]} rotation={[0, -Math.PI / 3.2, 0]}>
          <ShelfUnit products={others} position={[0, 0, 0]} label="MORE PETS" color="#0ea5e9" />
        </group>
      </Suspense>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.62, 0]} receiveShadow>
        <circleGeometry args={[18, 64]} />
        <meshStandardMaterial color="#ede9fe" />
      </mesh>
      <ContactShadows position={[0, -0.6, 0]} opacity={0.35} scale={30} blur={2} far={4} />
      <OrbitControls
        makeDefault
        target={[0, 1, 0]}
        enablePan={false}
        minDistance={4}
        maxDistance={13}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.1}
        minAzimuthAngle={-Math.PI / 2.5}
        maxAzimuthAngle={Math.PI / 2.5}
      />
    </Canvas>
  );
}
