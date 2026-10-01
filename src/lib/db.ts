import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { demoProducts } from "@/lib/products";
import type { CartItem, Product } from "@/types";

/**
 * Product data access. Reads from the Firestore `products` collection when
 * Firebase is configured and falls back to the bundled demo catalogue
 * otherwise (or if Firestore is empty / unreachable).
 */
export async function getProducts(): Promise<Product[]> {
  const db = getDb();
  if (!db) return demoProducts;
  try {
    const snap = await getDocs(collection(db, "products"));
    if (snap.empty) return demoProducts;
    return snap.docs.map((d) => ({ ...(d.data() as Omit<Product, "id">), id: d.id }));
  } catch (err) {
    console.warn("[db] Firestore read failed, using demo products:", err);
    return demoProducts;
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  const db = getDb();
  if (db) {
    try {
      const snap = await getDoc(doc(db, "products", id));
      if (snap.exists()) return { ...(snap.data() as Omit<Product, "id">), id: snap.id };
    } catch (err) {
      console.warn("[db] Firestore read failed, using demo products:", err);
    }
  }
  return demoProducts.find((p) => p.id === id) ?? null;
}

export async function createOrder(order: {
  items: CartItem[];
  total: number;
  stripeSessionId: string | null;
  userId?: string | null;
}): Promise<string | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const ref = await addDoc(collection(db, "orders"), {
      ...order,
      userId: order.userId ?? null,
      status: "pending",
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (err) {
    console.warn("[db] Could not save order:", err);
    return null;
  }
}
