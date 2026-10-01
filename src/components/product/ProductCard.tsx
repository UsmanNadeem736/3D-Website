"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { MiniPreview } from "@/components/3d";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ModelSwatch } from "@/components/product/ModelSwatch";
import { Rating } from "@/components/product/Rating";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";

/**
 * Product card with a 3D tilt effect. The live WebGL preview mounts only
 * while the card is hovered/focused, keeping the grid under the browser's
 * WebGL context limit no matter how many products are shown.
 */
export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [active, setActive] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: (index % 4) * 0.08 }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => {
        setActive(false);
        setTilt({ x: 0, y: 0 });
      }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -8, y: ((e.clientX - r.left) / r.width - 0.5) * 8 });
      }}
      style={{ transformPerspective: 900 }}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-violet-100"
    >
      <Link href={`/products/${product.id}`} className="relative block aspect-square" onFocus={() => setActive(true)}>
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-amber-50" />
        {active ? (
          <div className="absolute inset-0">
            <MiniPreview product={product} />
          </div>
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <ModelSwatch model={product.model} className="h-32 w-32 text-6xl shadow-lg transition group-hover:scale-105" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1">
          {product.badges.map((b) => (
            <span key={b} className="rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-violet-700 shadow-sm">{b}</span>
          ))}
        </div>
        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white">3D</span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-pink-500">{product.category}</p>
        <Link href={`/products/${product.id}`} className="mt-1 font-bold text-gray-900 hover:text-violet-700">{product.name}</Link>
        <p className="text-sm text-gray-500">{product.tagline}</p>
        <div className="mt-2"><Rating value={product.rating} reviews={product.reviews} /></div>
        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            <span className="text-xl font-extrabold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="ml-2 text-sm text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>
          <AddToCartButton product={product} compact className="px-4! py-2! text-sm" />
        </div>
      </div>
    </motion.div>
  );
}
