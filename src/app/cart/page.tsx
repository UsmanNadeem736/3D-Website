"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ModelSwatch } from "@/components/product/ModelSwatch";
import { cartSubtotal, useCart } from "@/lib/cart-store";
import { formatPrice, shippingFor } from "@/lib/format";
import { useMounted } from "@/lib/use-mounted";

export default function CartPage() {
  const mounted = useMounted();
  const { items, setQuantity, remove } = useCart();

  if (!mounted) return <div className="min-h-[60vh]" />;

  const subtotal = cartSubtotal(items);
  const shipping = shippingFor(subtotal);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold">Your basket</h1>

      {items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-6xl">🧺</p>
          <p className="mt-4 text-gray-500">Your basket is empty.</p>
          <Link href="/products" className="mt-6 inline-block rounded-full bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700">Browse products</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <ul className="space-y-4 lg:col-span-2">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.li key={item.id} layout exit={{ opacity: 0, x: -60 }} className="flex gap-4 rounded-3xl bg-white p-4 shadow-sm">
                  <ModelSwatch model={item.model} className="h-24 w-24 shrink-0" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-4">
                      <Link href={`/products/${item.id}`} className="font-bold hover:text-violet-700">{item.name}</Link>
                      <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                    <span className="text-sm text-gray-500">{formatPrice(item.price)} each</span>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-full border">
                        <button type="button" className="px-3 py-1" onClick={() => setQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">−</button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button type="button" className="px-3 py-1" onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">+</button>
                      </div>
                      <button type="button" onClick={() => remove(item.id)} className="text-sm text-gray-400 hover:text-red-500">Remove</button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Order summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Delivery</dt><dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd></div>
              <div className="flex justify-between border-t pt-3 text-lg font-bold"><dt>Total</dt><dd>{formatPrice(subtotal + shipping)}</dd></div>
            </dl>
            <Link href="/checkout" className="mt-6 block rounded-full bg-violet-600 py-3 text-center font-semibold text-white hover:bg-violet-700">Proceed to checkout</Link>
            <Link href="/products" className="mt-3 block text-center text-sm text-violet-700 hover:underline">Continue shopping</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
