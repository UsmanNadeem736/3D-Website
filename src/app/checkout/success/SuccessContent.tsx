"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-store";

export function SuccessContent() {
  const params = useSearchParams();
  const clear = useCart((s) => s.clear);
  const demo = params.get("demo") === "1";
  const order = params.get("order");

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200 }} className="text-8xl">
        🐶
      </motion.div>
      <h1 className="mt-6 text-4xl font-extrabold">Thank you! Pawsome choice.</h1>
      <p className="mt-3 text-gray-600">
        Your order {order ? <b>#{order.slice(0, 8)}</b> : null} is confirmed and will be on its way soon.
      </p>
      {demo && (
        <p className="mx-auto mt-4 max-w-sm rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
          Demo mode: no payment was taken. Add your Stripe keys to <code>.env.local</code> to enable real checkout.
        </p>
      )}
      <Link href="/products" className="mt-8 inline-block rounded-full bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700">Keep shopping</Link>
    </div>
  );
}
