const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });

export const formatPrice = (value: number) => gbp.format(value);

export const FREE_SHIPPING_THRESHOLD = 30;
export const SHIPPING_FEE = 3.99;

export function shippingFor(subtotal: number) {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}
