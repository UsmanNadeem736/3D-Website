import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-32 text-center">
      <p className="text-7xl">🐕‍🦺</p>
      <h1 className="mt-6 text-3xl font-extrabold">This page has run off!</h1>
      <p className="mt-2 text-gray-500">We couldn&apos;t find what you were looking for.</p>
      <Link href="/products" className="mt-8 inline-block rounded-full bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700">Back to the shop</Link>
    </div>
  );
}
