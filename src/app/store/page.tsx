import type { Metadata } from "next";
import { VirtualStore } from "@/components/3d";
import { getProducts } from "@/lib/db";

export const metadata: Metadata = { title: "Virtual 3D store" };
export const revalidate = 300;

export default async function StorePage() {
  const products = await getProducts();
  return (
    <div className="relative h-[calc(100vh-4rem)] min-h-[560px] w-full">
      <VirtualStore products={products} />
      <div className="pointer-events-none absolute left-4 top-4 max-w-xs rounded-2xl bg-white/85 p-4 shadow-lg backdrop-blur sm:left-8 sm:top-8">
        <h1 className="text-xl font-extrabold">Virtual store</h1>
        <p className="mt-1 text-sm text-gray-600">Drag to look around, scroll or pinch to walk closer. Hover a product to lift it off the shelf, click for details.</p>
      </div>
    </div>
  );
}
