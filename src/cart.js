export const variants = {
  eclipse: { name: "Eclipse", color: "#9B70FF", dark: "#30204D" },
  volt: { name: "Volt", color: "#D5FF3F", dark: "#303B12" },
};
export function updateCart(cart, variant, quantity) {
  if (!Object.hasOwn(variants, variant) || !Number.isInteger(quantity))
    return cart;
  return { ...cart, [variant]: Math.max(0, Math.min(99, quantity)) };
}
export function readCart(value) {
  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return {};
    return Object.entries(parsed).reduce(
      (cart, [variant, quantity]) => updateCart(cart, variant, quantity),
      {},
    );
  } catch {
    return {};
  }
}
