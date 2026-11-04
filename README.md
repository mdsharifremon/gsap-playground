# GSAP Playground

Small, focused pages for practising GSAP. Each page is one idea: an easing, a method, a text effect, a scroll animation, or a real UI pattern like the add-to-cart fly.

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints. The home page lists every demo.

Needs Node 18 or newer.

## How it is organised

```
index.html          home page, one card per demo
style.css           shared styles (Tailwind v4, Geist font)
public/             images, fonts and video used by the demos
pages/<name>/
  index.html        the demo page
  script.js         the GSAP code
  style.css         styles for this demo only
```

## Add a page

1. Copy an existing folder in `pages/` and rename it.
2. Edit `index.html`, `script.js` and `style.css`.
3. Add a card for it in the root `index.html`.

`npm run dev` serves every page. `npm run build` only builds the pages listed in `vite.config.js`, so add new pages there before building.

## Stack

- [GSAP](https://gsap.com) for the animations
- [Vite](https://vite.dev) for the dev server and build
- [Tailwind CSS](https://tailwindcss.com) v4 for shared styling

Built by [sharifu.com](https://sharifu.com).
