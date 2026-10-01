import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-violet-100 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="text-lg font-extrabold text-violet-700">
            PawVerse<span className="text-pink-500">3D</span>
          </p>
          <p className="mt-2 text-sm text-gray-500">Pet care, reimagined in three dimensions. Explore every product in 360° before it arrives at your door.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Shop</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li><Link href="/products?category=Dog" className="hover:text-violet-700">Dogs</Link></li>
            <li><Link href="/products?category=Cat" className="hover:text-violet-700">Cats</Link></li>
            <li><Link href="/products?category=Small%20Pet" className="hover:text-violet-700">Small pets</Link></li>
            <li><Link href="/store" className="hover:text-violet-700">Virtual 3D store</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Help</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>Free UK delivery over £30</li>
            <li>30-day happy-pet returns</li>
            <li>Vet advice line 24/7</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Stay in the loop</p>
          <form className="mt-3 flex gap-2">
            <input type="email" placeholder="you@example.com" className="w-full rounded-full border border-violet-200 px-4 py-2 text-sm outline-none focus:border-violet-500" />
            <button type="button" className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700">Join</button>
          </form>
        </div>
      </div>
      <p className="border-t border-violet-50 py-6 text-center text-xs text-gray-400">© {new Date().getFullYear()} PawVerse 3D. Demo store — no real products are sold.</p>
    </footer>
  );
}
