# AFTR. — The Afterhours Club

An original, entirely 2D nighttime brand campaign and concept storefront. React + Vite, JSX, Tailwind CSS, GSAP/ScrollTrigger, Motion and Lenis. No WebGL, 3D assets, payment services or backend.

## Run

```sh
npm install
npm run dev
npm test
npm run build
```

Pages: `/`, `/product`, `/about`, `/contact`. `/product?colorway=volt` selects Volt. Vite handles local route fallbacks; Netlify and Vercel fallback configurations are included. Other static hosts must rewrite application routes to `index.html`.

## Implementation

- `src/main.jsx`: reusable image, selector, quantity, accordion, navigation and bag components; campaign sections and four page compositions.
- `src/style.css`: desktop/mobile art direction, typography, photographic layers, masking and reduced-motion rules.
- `src/cart.js`: shared packaging definitions and validated cart updates/storage parsing.
- `src/cart.test.js`: quantity boundaries, colorway isolation and malformed storage checks.
- `public/images`: optimized original WebP campaign photography and transparent packaging assets. Small responsive variants are included for photographic scenes.

GSAP uses matchMedia cleanup, Lenis is destroyed on cleanup, and its ticker is removed. Reduced-motion mode disables the introduction, smooth scrolling, marquee, parallax, CSS transitions and animated product entrances. Native dialogs provide keyboard trapping and Escape dismissal. Native links preserve normal browser navigation. The shopping bag persists across page loads in sessionStorage, with validation and an in-memory fallback if storage is unavailable.

## Assets

Original runner, gummy macro and packaging images were created with the built-in image generation tool. Final creative briefs and asset provenance are in `public/images/ASSETS.md`. Supporting lifestyle photographs are responsive Unsplash images. Google Fonts supplies Archivo Black, Space Grotesk and DM Mono. Supporting photographs and fonts require network access.

## Availability

Both colorways represent the same unverified product concept. $32 is explicitly preview pricing. Formula, ingredients, allergens, directions, suitability, shipping and returns are placeholders. No medical benefits, clinical results, real orders or successful payments are claimed. Contact fields validate locally; submissions are never sent or stored. Supply verified product data and real service integrations before commercial use.

## Verification

Cart tests and production build pass. Chromium checks cover colorway transitions, quantity updates, cart totals, cart persistence across pages, removal, dialog Escape dismissal, form validation and non-delivery messaging, mobile navigation and reduced motion. All four pages were checked for overflow at 320px, 390px and 768px; the desktop campaign was visually checked at 1440px. Physical-device performance and non-Chromium browsers have not been tested.
