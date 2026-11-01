export const variants = {eclipse:{name:'Eclipse',color:'#9466ff',dark:'#39216b'},volt:{name:'Volt',color:'#c6ff4d',dark:'#3b481f'}};
export function updateCart(cart, variant, quantity) {
  if (!Object.hasOwn(variants,variant) || !Number.isInteger(quantity)) return cart;
  return {...cart,[variant]:Math.max(0,Math.min(99,quantity))};
}
