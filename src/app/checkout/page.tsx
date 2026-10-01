"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { ModelSwatch } from "@/components/product/ModelSwatch";
import { cartSubtotal, useCart } from "@/lib/cart-store";
import { formatPrice, shippingFor } from "@/lib/format";
import { useMounted } from "@/lib/use-mounted";

export default function CheckoutPage() {
  const mounted = useMounted();
  const items = useCart((s) => s.items);
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!mounted) return <div className="min-h-[60vh]" />;

  const subtotal = cartSubtotal(items);
  const shipping = shippingFor(subtotal);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-32 text-center">
        <h1 className="text-3xl font-extrabold">Nothing to check out yet</h1>
        <Link href="/products" className="mt-6 inline-block rounded-full bg-violet-600 px-6 py-3 font-semibold text-white">Browse products</Link>
      </div>
    );
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ id, quantity }) => ({ id, quantity })),
          email: email || user?.email || undefined,
          userId: user?.uid ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold">Checkout</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <form onSubmit={handleCheckout} className="space-y-6 rounded-3xl bg-white p-6 shadow-sm lg:col-span-3">
          <div>
            <label htmlFor="email" className="text-sm font-semibold">Email for order updates</label>
            <input
              id="email"
              type="email"
              value={email}
              placeholder={user?.email ?? "you@example.com"}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-violet-200 px-4 py-3 outline-none focus:border-violet-500"
            />
          </div>
          <div className="rounded-2xl bg-violet-50 p-4 text-sm text-gray-600">
            🔒 You&apos;ll enter your delivery address and card details on Stripe&apos;s secure payment page.
            Without Stripe keys configured the store runs in <b>demo mode</b> and no payment is taken.
          </div>
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-violet-600 py-4 font-semibold text-white shadow-lg shadow-violet-200 hover:bg-violet-700 disabled:opacity-60"
          >
            {loading ? "Redirecting to secure payment…" : `Pay ${formatPrice(subtotal + shipping)}`}
          </button>
        </form>

        <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="font-bold">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-3 text-sm">
                <ModelSwatch model={i.model} className="h-12 w-12 shrink-0 text-xl" />
                <span className="flex-1">{i.name} <span className="text-gray-400">× {i.quantity}</span></span>
                <span className="font-semibold">{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Delivery</dt><dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd></div>
            <div className="flex justify-between text-lg font-bold"><dt>Total</dt><dd>{formatPrice(subtotal + shipping)}</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
