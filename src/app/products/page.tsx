import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getProducts } from "@/lib/db";

export const metadata: Metadata = { title: "Shop all products" };
export const revalidate = 300;

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold">Shop all</h1>
      <p className="mb-8 mt-2 text-gray-500">{products.length} products · every one viewable in interactive 3D</p>
      <Suspense>
        <ProductGrid products={products} />
      </Suspense>
    </div>
  );
}
