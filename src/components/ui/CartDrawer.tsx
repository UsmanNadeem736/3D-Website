"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { cartSubtotal, useCart } from "@/lib/cart-store";
import { FREE_SHIPPING_THRESHOLD, formatPrice } from "@/lib/format";
import { useMounted } from "@/lib/use-mounted";
import { ModelSwatch } from "@/components/product/ModelSwatch";

export default function CartDrawer() {
  const mounted = useMounted();
  const { items, isOpen, close, setQuantity, remove } = useCart();
  if (!mounted) return null;

  const subtotal = cartSubtotal(items);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: "100%", rotateY: -15 }}
            animate={{ x: 0, rotateY: 0 }}
            exit={{ x: "100%", rotateY: -15 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            style={{ transformPerspective: 1200 }}
          >
            <div className="flex items-center justify-between border-b p-5">
              <h2 className="text-lg font-bold">Your basket</h2>
              <button type="button" onClick={close} className="rounded-full p-2 hover:bg-gray-100" aria-label="Close cart">✕</button>
            </div>

            <div className="border-b bg-violet-50 px-5 py-3 text-sm">
              {remaining > 0 ? (
                <>Add <b>{formatPrice(remaining)}</b> more for free delivery 🚚</>
              ) : (
                <>🎉 You&apos;ve unlocked <b>free delivery</b>!</>
              )}
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-violet-100">
                <motion.div className="h-full bg-violet-600" animate={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="py-16 text-center text-gray-500">
                  <p className="text-5xl">🐶</p>
                  <p className="mt-4">Your basket is empty.</p>
                  <Link href="/products" onClick={close} className="mt-4 inline-block font-semibold text-violet-700 hover:underline">Start shopping →</Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 80 }}
                        className="flex gap-4 rounded-2xl border border-gray-100 p-3"
                      >
                        <ModelSwatch model={item.model} className="h-20 w-20 shrink-0" />
                        <div className="flex flex-1 flex-col">
                          <Link href={`/products/${item.id}`} onClick={close} className="font-semibold hover:text-violet-700">{item.name}</Link>
                          <span className="text-sm text-gray-500">{formatPrice(item.price)}</span>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center rounded-full border">
                              <button type="button" className="px-3 py-1" onClick={() => setQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">−</button>
                              <span className="w-6 text-center text-sm">{item.quantity}</span>
                              <button type="button" className="px-3 py-1" onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">+</button>
                            </div>
                            <button type="button" className="text-xs text-gray-400 hover:text-red-500" onClick={() => remove(item.id)}>Remove</button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t p-5">
                <div className="flex justify-between text-lg font-bold">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Link href="/cart" onClick={close} className="rounded-full border border-violet-200 py-3 text-center font-semibold text-violet-700 hover:bg-violet-50">View basket</Link>
                  <Link href="/checkout" onClick={close} className="rounded-full bg-violet-600 py-3 text-center font-semibold text-white hover:bg-violet-700">Checkout</Link>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
