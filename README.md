# AFTR.
Original recovery brand portfolio demo built with React, Vite, Tailwind CSS, GSAP ScrollTrigger, Motion, and Lenis. JSX only.

## Development
Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

## Verify and build
```sh
npm test
npm run build
```

Deploy to Vercel using the Vite preset, build command `npm run build`, output directory `dist`. No environment variables or backend are required.

## Structure
- `src/main.jsx`: page sections, layered packaging artwork, forms, and native modal shopping bag
- `src/style.css`: responsive design, packaging, and reduced-motion behavior
- `src/cart.js`: centralized variants and bounded cart quantity updates
- `src/cart.test.js`: cart state validation

The packaging is original CSS artwork with live readable typography; Blender was unavailable. Photography is delivered through Unsplash responsive image URLs; fonts use Google Fonts. These require an internet connection. Replace remote assets with licensed local production media before launch if offline delivery is needed.

Prices, ingredients, dosage, shipping, contact channels, and checkout are intentionally unverified. No actual orders, subscriptions, or messages are submitted. Cart state lives in memory. Forms validate locally; replace their submit handlers with provider integration and server validation when approved. Both variants represent the same core concept, with different packaging.
