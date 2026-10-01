/**
 * Uploads the demo catalogue (src/lib/products.ts) to the Firestore `products`
 * collection. Uses the web SDK with your NEXT_PUBLIC_FIREBASE_* config, so
 * temporarily allow writes to /products in firestore.rules while seeding,
 * then switch the rule back to `allow write: if false`.
 *
 *   npm run seed
 */
import { readFileSync, existsSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";

for (const file of [".env.local", ".env"]) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!config.apiKey || !config.projectId) {
  console.error("Missing Firebase config. Copy .env.example to .env.local and fill it in.");
  process.exit(1);
}

// Pull the product array out of the TypeScript source without needing a TS runtime.
const src = readFileSync(new URL("../src/lib/products.ts", import.meta.url), "utf8");
const arrayLiteral = src.slice(src.indexOf("= [", src.indexOf("demoProducts")) + 2, src.indexOf("];") + 1);
const products = Function(`"use strict"; return (${arrayLiteral});`)();

const db = getFirestore(initializeApp(config));
for (const { id, ...data } of products) {
  await setDoc(doc(db, "products", id), data);
  console.log(`✓ ${id}`);
}
console.log(`Seeded ${products.length} products.`);
process.exit(0);
