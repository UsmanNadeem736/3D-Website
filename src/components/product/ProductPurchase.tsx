"use client";

import { useState } from "react";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import type { Product } from "@/types";

export function ProductPurchase({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const max = Math.max(1, Math.min(product.stock, 20));

  return (
    <div className="mt-8">
      <p className={`mb-3 text-sm font-medium ${product.stock < 20 ? "text-amber-600" : "text-green-600"}`}>
        {product.stock <= 0 ? "Out of stock" : product.stock < 20 ? `Only ${product.stock} left in stock` : "In stock — ships tomorrow"}
      </p>
      <div className="flex gap-4">
        <div className="flex items-center rounded-full border border-violet-200 bg-white">
          <button type="button" className="px-4 py-3 text-lg" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
          <span className="w-8 text-center font-semibold">{qty}</span>
          <button type="button" className="px-4 py-3 text-lg" onClick={() => setQty((q) => Math.min(max, q + 1))} aria-label="Increase quantity">+</button>
        </div>
        <AddToCartButton product={product} quantity={qty} className="flex-1" />
      </div>
    </div>
  );
}
