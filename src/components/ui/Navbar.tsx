"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cartCount, useCart } from "@/lib/cart-store";
import { useMounted } from "@/lib/use-mounted";
import { useAuth } from "@/components/AuthProvider";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/products" },
  { name: "3D Store", href: "/store" },
];

export default function Navbar() {
  const pathname = usePathname();
  const mounted = useMounted();
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.open);
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const count = mounted ? cartCount(items) : 0;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 border-b border-violet-100 bg-white/80 backdrop-blur-lg"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold text-violet-700">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-600 text-lg text-white">🐾</span>
          PawVerse<span className="text-pink-500">3D</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className="relative rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:text-violet-700">
                {active && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-violet-100" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                )}
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/account" className="hidden rounded-full px-3 py-2 text-sm font-medium text-gray-700 hover:text-violet-700 sm:block">
            {user ? user.displayName?.split(" ")[0] || "Account" : "Sign in"}
          </Link>
          <button
            type="button"
            onClick={openCart}
            aria-label="Open cart"
            className="relative rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
          >
            🛒 Cart
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-pink-500 px-1 text-xs font-bold"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-gray-700 md:hidden"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-violet-100 md:hidden"
          >
            <div className="flex flex-col p-4">
              {[...navItems, { name: user ? "My account" : "Sign in", href: "/account" }].map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-3 font-medium text-gray-700 hover:bg-violet-50">
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
