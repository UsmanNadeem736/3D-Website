"use client";

import { Component, Suspense, useMemo, type ReactNode } from "react";
import { Center, useGLTF } from "@react-three/drei";
import { PetModel } from "@/components/3d/PetModels";
import type { Product } from "@/types";

/** Catches .glb load failures so a missing file falls back to the procedural model. */
class ModelErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function GltfModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  // Clone so the same cached model can be shown in several canvases at once.
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return (
    <Center>
      <primitive object={cloned} />
    </Center>
  );
}

export function ProductModel({ product }: { product: Pick<Product, "model" | "modelUrl"> }) {
  const procedural = <PetModel {...product.model} />;
  if (!product.modelUrl) return procedural;
  return (
    <ModelErrorBoundary fallback={procedural}>
      <Suspense fallback={procedural}>
        <GltfModel url={product.modelUrl} />
      </Suspense>
    </ModelErrorBoundary>
  );
}
