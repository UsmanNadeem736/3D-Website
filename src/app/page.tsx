import Link from "next/link";
import { HeroScene } from "@/components/3d";
import { ProductCard } from "@/components/product/ProductCard";
import { FadeIn } from "@/components/ui/FadeIn";
import { getProducts } from "@/lib/db";

export const revalidate = 300;

const perks = [
  { icon: "🔄", title: "360° product views", text: "Rotate, zoom and inspect every product in real-time 3D before you buy." },
  { icon: "🏬", title: "Walk-through 3D store", text: "Browse virtual shelves just like your local pet shop — from your sofa." },
  { icon: "🚚", title: "Free delivery over £30", text: "Fast, tracked delivery with 30-day happy-pet returns." },
  { icon: "🩺", title: "Vet-approved picks", text: "Products reviewed by qualified vets and real pet parents." },
];

const categoryTiles = [
  { name: "Dog", emoji: "🐕", from: "from-violet-500", to: "to-indigo-500" },
  { name: "Cat", emoji: "🐈", from: "from-pink-500", to: "to-rose-500" },
  { name: "Small Pet", emoji: "🐇", from: "from-amber-400", to: "to-orange-500" },
  { name: "Fish", emoji: "🐠", from: "from-sky-400", to: "to-cyan-500" },
];

export default async function Home() {
  const products = await getProducts();
  const featured = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 4);

  return (
    <>
      {/* 3D hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-violet-100 via-violet-50 to-transparent">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pt-10 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pt-0">
          <FadeIn className="relative z-10 py-8 lg:py-24">
            <span className="inline-block rounded-full bg-white px-4 py-1 text-sm font-semibold text-violet-700 shadow-sm">✨ The UK&apos;s first fully-3D pet store</span>
            <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              Pet care, <span className="text-gradient">reimagined</span> in 3D.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-gray-600">
              Spin, zoom and explore food, toys and accessories in 360°. Walk our virtual aisles and find exactly what your best friend needs.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/products" className="rounded-full bg-violet-600 px-7 py-4 font-semibold text-white shadow-xl shadow-violet-300 transition hover:-translate-y-0.5 hover:bg-violet-700">
                Shop 3D products
              </Link>
              <Link href="/store" className="rounded-full bg-white px-7 py-4 font-semibold text-violet-700 shadow-lg transition hover:-translate-y-0.5">
                Enter the virtual store →
              </Link>
            </div>
            <div className="mt-10 flex gap-8 text-sm text-gray-500">
              <div><p className="text-2xl font-extrabold text-gray-900">4.8★</p>12k+ reviews</div>
              <div><p className="text-2xl font-extrabold text-gray-900">2,000+</p>products</div>
              <div><p className="text-2xl font-extrabold text-gray-900">24/7</p>vet advice</div>
            </div>
          </FadeIn>
          <div className="relative h-[420px] sm:h-[520px] lg:h-[640px]">
            <HeroScene />
            <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-4 py-1 text-xs text-gray-500 backdrop-blur">Move your cursor — Biscuit is watching 👀</p>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.08} className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">
              <p className="text-3xl">{p.icon}</p>
              <p className="mt-4 font-bold">{p.title}</p>
              <p className="mt-1 text-sm text-gray-500">{p.text}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold">Shop by pet</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categoryTiles.map((c) => (
            <Link
              key={c.name}
              href={`/products?category=${encodeURIComponent(c.name)}`}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${c.from} ${c.to} p-6 text-white shadow-lg transition hover:-translate-y-1`}
            >
              <span className="block text-6xl transition group-hover:scale-110 animate-float-slow">{c.emoji}</span>
              <span className="mt-6 block text-xl font-bold">{c.name === "Small Pet" ? "Small pets" : `${c.name}s`}</span>
              <span className="text-sm opacity-80">Shop now →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-extrabold">Customer favourites</h2>
            <p className="text-gray-500">Hover a card to bring it to life in 3D.</p>
          </div>
          <Link href="/products" className="font-semibold text-violet-700 hover:underline">View all →</Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Virtual store CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-700 via-violet-600 to-pink-500 p-10 text-white sm:p-16">
          <div className="max-w-xl">
            <h2 className="text-4xl font-extrabold">Step inside the virtual store</h2>
            <p className="mt-4 text-violet-100">Wander 3D aisles for dogs, cats and small pets. Hover a product to lift it off the shelf, click to see it up close, and quick-add straight to your basket.</p>
            <Link href="/store" className="mt-8 inline-block rounded-full bg-white px-7 py-4 font-semibold text-violet-700 shadow-xl transition hover:-translate-y-0.5">Open the 3D store</Link>
          </div>
          <span className="pointer-events-none absolute -bottom-10 -right-6 text-[12rem] opacity-20 sm:text-[16rem]">🐾</span>
        </div>
      </section>
    </>
  );
}
