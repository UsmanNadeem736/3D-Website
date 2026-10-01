# PawVerse 3D — 3D Pet-Care E-Commerce

An immersive pet-care store built with **Next.js 16 (App Router)**, **React Three Fiber / drei**,
**Tailwind CSS 4**, **Framer Motion**, **Firebase** (Firestore + Auth) and **Stripe Checkout**.

## Features

- **3D hero**: an animated dog mascot whose head follows your cursor, with floating products around it.
- **360° product viewer**: rotate, zoom, auto-spin and reset on every product page.
- **Virtual 3D store** (`/store`): walk past dog, cat and "more pets" shelves. Hover a product to lift it off the shelf, click it to open the product page, or quick-add it to your basket.
- **Product cards**: tilt in 3D on hover and switch to a live WebGL preview. Only the hovered card mounts a canvas, so the page stays under the browser's WebGL context limit.
- **Shop page**: filter by category, search, and sort.
- A cart that persists in localStorage, an animated slide-out cart drawer and a free-delivery progress bar.
- **Checkout**: a server-side API route re-prices every item from the catalogue and creates a Stripe Checkout session.
- **Firebase**: products come from Firestore, orders are saved to Firestore, and you can sign in with email or Google.
- **No setup needed to try it**: without env vars the store uses built-in demo products and a demo checkout that takes no payment.
- **No binary assets**: every product has a procedural 3D model. You can swap any of them for a Blender `.glb` export.
- **Product videos**: set a product's `videoUrl` and its video plays under the 3D viewer.

## Quick start

```bash
npm install
npm run dev
# open http://localhost:3000
```

Production build: `npm run build && npm start`

## Configuration (optional)

```bash
cp .env.example .env.local
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase web-app config. This turns on Firestore products and orders, plus Auth. |
| `STRIPE_SECRET_KEY` | Turns on real Stripe Checkout. Use an `sk_test_...` key while developing. |
| `NEXT_PUBLIC_SITE_URL` | Base URL for Stripe success and cancel redirects. |

### Firebase setup
1. Create a project at https://console.firebase.google.com and add a **Web app**.
2. Enable **Firestore** and **Authentication** (Email/Password + Google).
3. Paste the config into `.env.local`.
4. Seed products: allow writes to `/products` in `firestore.rules` for a moment, run `npm run seed`, then remove that write permission again.
5. Deploy the rules in `firestore.rules`.

### Stripe setup
Add `STRIPE_SECRET_KEY` and use test card `4242 4242 4242 4242`.

## Adding your own 3D models and videos

- **Models**: export from Blender as `.glb` into `public/3d-models/`, then set `modelUrl: "/3d-models/your-model.glb"` on the product in `src/lib/products.ts`. If the file is missing or fails to load, the procedural model is shown instead.
- **Videos**: put an `.mp4` into `public/videos/`, then set `videoUrl: "/videos/your-video.mp4"`.

## Project structure

```
src/
├── app/
│   ├── page.tsx                 # Homepage with 3D hero
│   ├── products/page.tsx        # Product grid (filters, search, sort)
│   ├── products/[id]/page.tsx   # Product page with 360° viewer
│   ├── store/page.tsx           # Walk-through virtual 3D store
│   ├── cart/ checkout/ account/ # Basket, Stripe checkout, Firebase auth
│   └── api/checkout, api/products
├── components/
│   ├── 3d/       # HeroScene, Product3DViewer, VirtualStore, PetModels, ...
│   ├── product/  # ProductCard, ProductGrid, AddToCartButton, ...
│   └── ui/       # Navbar, Footer, CartDrawer, FadeIn
├── lib/          # firebase, db, stripe, cart-store, products, format
└── types/
```

## Deploying

Push to GitHub and import the repo in **Vercel**. Add the same env vars in the project settings.
