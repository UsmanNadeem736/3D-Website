import { NextResponse } from "next/server";
import { createOrder, getProducts } from "@/lib/db";
import { shippingFor } from "@/lib/format";
import { stripe } from "@/lib/stripe";
import type { CartItem } from "@/types";

interface CheckoutBody {
  items?: { id: string; quantity: number }[];
  email?: string;
  userId?: string | null;
}

export async function POST(req: Request) {
  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Your basket is empty" }, { status: 400 });
  }

  // Never trust client-side prices: re-price every line from the catalogue.
  const catalogue = new Map((await getProducts()).map((p) => [p.id, p]));
  const lines: CartItem[] = [];
  for (const { id, quantity } of body.items) {
    const product = catalogue.get(id);
    const qty = Math.floor(Number(quantity));
    if (!product || !Number.isFinite(qty) || qty < 1 || qty > 99) {
      return NextResponse.json({ error: `Invalid item: ${id}` }, { status: 400 });
    }
    lines.push({ id, name: product.name, price: product.price, quantity: qty, model: product.model });
  }

  const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const shipping = shippingFor(subtotal);
  const total = Math.round((subtotal + shipping) * 100) / 100;
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

  // Demo mode: no Stripe key configured.
  if (!stripe) {
    const orderId = (await createOrder({ items: lines, total, stripeSessionId: null, userId: body.userId })) ?? crypto.randomUUID();
    return NextResponse.json({ url: `${origin}/checkout/success?demo=1&order=${orderId}` });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: body.email || undefined,
      shipping_address_collection: { allowed_countries: ["GB", "IE"] },
      line_items: [
        ...lines.map((l) => ({
          quantity: l.quantity,
          price_data: {
            currency: "gbp",
            unit_amount: Math.round(l.price * 100),
            product_data: { name: l.name, metadata: { productId: l.id } },
          },
        })),
        ...(shipping > 0
          ? [{ quantity: 1, price_data: { currency: "gbp", unit_amount: Math.round(shipping * 100), product_data: { name: "Standard delivery" } } }]
          : []),
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });

    const orderId = await createOrder({ items: lines, total, stripeSessionId: session.id, userId: body.userId });
    return NextResponse.json({ url: session.url, orderId });
  } catch (err) {
    console.error("[checkout] Stripe error:", err);
    return NextResponse.json({ error: "Payment provider error. Please try again." }, { status: 502 });
  }
}
