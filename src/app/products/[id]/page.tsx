import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Product3DViewer } from "@/components/3d";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { Rating } from "@/components/product/Rating";
import { getProduct, getProducts } from "@/lib/db";
import { formatPrice } from "@/lib/format";

type Props = { params: Promise<{ id: string }> };

export const revalidate = 300;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  return product ? { title: product.name, description: product.description } : { title: "Product not found" };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const related = (await getProducts()).filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-violet-700">Home</Link> /{" "}
        <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-violet-700">{product.category}</Link> /{" "}
        <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <Product3DViewer product={product} />
          {product.videoUrl && (
            <video
              className="aspect-video w-full rounded-3xl bg-black object-cover shadow-sm"
              poster={product.videoPoster}
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
            >
              {product.videoWebmUrl && <source src={product.videoWebmUrl} type="video/webm" />}
              <source src={product.videoUrl} type="video/mp4" />
            </video>
          )}
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            {product.badges.map((b) => (
              <span key={b} className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">{b}</span>
            ))}
          </div>
          <h1 className="mt-3 text-4xl font-extrabold">{product.name}</h1>
          <p className="mt-1 text-lg text-gray-500">{product.tagline}</p>
          <div className="mt-3"><Rating value={product.rating} reviews={product.reviews} /></div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
                <span className="rounded-full bg-pink-100 px-2 py-0.5 text-sm font-semibold text-pink-600">
                  Save {Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-gray-700">{product.description}</p>

          <ul className="mt-6 grid grid-cols-2 gap-3">
            {product.features.map((f) => (
              <li key={f} className="flex items-center gap-2 rounded-2xl bg-white p-3 text-sm shadow-sm">
                <span className="text-violet-600">✓</span> {f}
              </li>
            ))}
          </ul>

          <ProductPurchase product={product} />

          <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs text-gray-500">
            <div className="rounded-2xl border border-violet-100 p-3">🚚<br />Free UK delivery over £30</div>
            <div className="rounded-2xl border border-violet-100 p-3">↩️<br />30-day returns</div>
            <div className="rounded-2xl border border-violet-100 p-3">🔒<br />Secure Stripe checkout</div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-extrabold">You might also like</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
