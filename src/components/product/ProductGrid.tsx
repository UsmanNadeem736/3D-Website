"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { categories } from "@/lib/products";
import type { Product } from "@/types";

const sorts = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  rating: "Top rated",
} as const;

type SortKey = keyof typeof sorts;

export function ProductGrid({ products }: { products: Product[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const category = params.get("category") ?? "All";
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (!q || `${p.name} ${p.tagline} ${p.description}`.toLowerCase().includes(q)),
    );
    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "rating":
        return [...list].sort((a, b) => b.rating - a.rating);
      default:
        return list;
    }
  }, [products, category, query, sort]);

  const setCategory = (c: string) => {
    const next = new URLSearchParams(params.toString());
    if (c === "All") next.delete("category");
    else next.set("category", c);
    router.replace(`/products${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                category === c ? "bg-violet-600 text-white shadow-lg shadow-violet-200" : "bg-white text-gray-700 hover:bg-violet-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-full border border-violet-200 bg-white px-4 py-2 text-sm outline-none focus:border-violet-500 lg:w-64"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-violet-200 bg-white px-4 py-2 text-sm outline-none focus:border-violet-500"
          >
            {Object.entries(sorts).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="py-20 text-center text-gray-500">No products match your search. 🐾</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
