"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-store";
import type { Product } from "@/types";

export function AddToCartButton({
  product,
  quantity = 1,
  compact = false,
  className = "",
}: {
  product: Product;
  quantity?: number;
  compact?: boolean;
  className?: string;
}) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      disabled={outOfStock}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        add(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
      className={`whitespace-nowrap rounded-full bg-violet-600 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none ${className}`}
    >
      {outOfStock ? "Sold out" : added ? "Added ✓" : compact ? "+ Add" : "Add to basket"}
    </motion.button>
  );
}
