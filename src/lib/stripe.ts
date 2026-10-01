import Stripe from "stripe";

/** Server-side Stripe client. Null when STRIPE_SECRET_KEY is not set (demo mode). */
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const isStripeConfigured = stripe !== null;
