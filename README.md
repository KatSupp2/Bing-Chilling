# Bing Chilling

Cool deals, chill prices. A minimal online store built to demonstrate four HCI design patterns: **search bars, progress bars, confirmations and notifications**, plus error handling designed to stay calm, not alarming.

## Features

- **Sign in / create an account:** a tiled cone-logo background that drifts on sign-in and becomes a whirlpool on account creation. A wrong attempt makes the background shudder with a red flash. A full-screen personal greeting follows a successful sign-in.
- **Search bar:** live, debounced search across 102 products, combined with a category filter. The heading reads `Category | N items`.
- **Shopping:** products shuffle on every visit, and pressing the header logo reshuffles them. Adding to the cart sends the product image flying into the cart icon, which bumps as the count updates.
- **Cart:** quantity steppers. Removing an item slides it off to the right, with **Undo** to bring it back. Returns and support details sit under the total.
- **Checkout progress bar:** a three-step bar (Shipping, Payment, Review), then a full-screen payment moment with a perceived-performance bar.
  - Success turns the total green.
  - A decline turns it red, gives a small shudder, and drains the bar back to zero.
- **Confirmations:** before placing an order and before logging out.
- **Notifications:** an inbox in the bell menu with unread dots and **Mark all as read**. Messages are never deleted. Toasts are monotone.
- **Lost connection:** a calm "Take a breather" screen with a breathing logo.
  - It appears on a real outage or via **Lost Connection?** in the footer.
  - In simulation, *Try again* always fails gently and *Back Online!* ends it.
- **Seamless navigation:** the View Transitions API cross-fades between store pages while the header and background stay still. Scroll position is remembered, and signing in returns you to the page you were on.
- **Interactive wave background:** lines that ripple around the cursor and invert over the footer.
- **Light / dark mode:** light by default, with a toggle in a fixed position.
- **Accessibility:** respects reduced motion, uses screen-reader live regions, and keeps keyboard focus inside the lost-connection screen.

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui (Radix), Zustand, React Router, Sonner, lucide-react. Deployed on Vercel.

## Getting started

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Demo account

Sign in with **admin** / **admin**, or create your own account. Accounts, carts and notifications are kept in memory only: nothing is stored, and everything resets on refresh. In checkout, tick **Simulate a failed payment** on the Review step to see the decline flow.

## Deployment

`vercel.json` rewrites every route to `index.html`, so client-side routes work on refresh. Pushing to `main` redeploys automatically once the GitHub repo is imported into Vercel.
