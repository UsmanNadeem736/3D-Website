"use client";

import { Canvas } from "@react-three/fiber";
import { Float, PresentationControls } from "@react-three/drei";
import { ProductModel } from "@/components/3d/ProductModel";
import { StudioLights } from "@/components/3d/StudioLights";
import type { Product } from "@/types";

/** Lightweight canvas used inside product cards (mounted only while hovered). */
export default function MiniPreview({ product }: { product: Pick<Product, "model" | "modelUrl"> }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.6, 3.6], fov: 40 }} gl={{ antialias: true, alpha: true }}>
      <StudioLights />
      <PresentationControls global={false} polar={[-0.3, 0.3]} azimuth={[-Infinity, Infinity]} snap>
        <Float speed={3} rotationIntensity={0.6} floatIntensity={0.6}>
          <ProductModel product={product} />
        </Float>
      </PresentationControls>
    </Canvas>
  );
}
