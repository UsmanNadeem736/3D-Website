"use client";

import { Suspense, useRef, useState, type ComponentRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Float, OrbitControls, Html, useProgress } from "@react-three/drei";
import { ProductModel } from "@/components/3d/ProductModel";
import { StudioLights } from "@/components/3d/StudioLights";
import type { Product } from "@/types";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-violet-700 shadow">
        Loading 3D… {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

export default function Product3DViewer({ product }: { product: Pick<Product, "model" | "modelUrl" | "name"> }) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-violet-100 via-white to-amber-50 sm:h-[540px]">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [2.4, 1.4, 3.2], fov: 42 }}>
        <StudioLights />
        <Suspense fallback={<Loader />}>
          <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4}>
            <ProductModel product={product} />
          </Float>
        </Suspense>
        <ContactShadows position={[0, -0.95, 0]} opacity={0.45} scale={6} blur={2.4} far={2} />
        <OrbitControls
          ref={controls}
          makeDefault
          autoRotate={autoRotate}
          autoRotateSpeed={1.2}
          enablePan={false}
          minDistance={2}
          maxDistance={7}
          minPolarAngle={0.3}
          maxPolarAngle={Math.PI / 1.9}
        />
      </Canvas>

      <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-violet-700 backdrop-blur">
        360° interactive · drag to rotate · scroll / pinch to zoom
      </div>
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          type="button"
          onClick={() => setAutoRotate((v) => !v)}
          className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium shadow hover:bg-white"
        >
          {autoRotate ? "Pause spin" : "Auto spin"}
        </button>
        <button
          type="button"
          onClick={() => controls.current?.reset()}
          className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium shadow hover:bg-white"
        >
          Reset view
        </button>
      </div>
    </div>
  );
}
