# Bing Chilling

Cool deals, chill prices. A minimal online store built to demonstrate four HCI design patterns: **search bars, progress bars, confirmations and notifications**, plus error handling designed to stay calm, not alarming.

## Features

### Accounts
- **Sign in / create an account:** a tiled cone-logo background that drifts on sign-in and becomes a whirlpool on account creation. A wrong attempt makes the background shudder with a red flash.
- **Welcome:** a full-screen personal greeting after signing in.
- **Return to where you were:** after a refresh, signing in takes you back to the page you were on.

### Shopping
- **Search bar:** live, debounced search across 102 products, combined with a category filter. The heading reads `Category | N items`.
- **Reshuffle:** products shuffle on every visit. Pressing the header logo scrolls to the top and reshuffles them.
- **Add to cart:** the product image flies into the cart icon, which bumps as its count updates.
- **Cart:** quantity steppers. Removing an item slides it off to the right, with **Undo** to bring it back.

### Checkout (progress bar)
- **Three steps:** Shipping (address and delivery speed), Payment (card, GCash or cash on delivery) and Review, with a step progress bar. Any input is accepted, and empty fields get friendly inline messages.
- **Saved details:** shipping and payment details are remembered per account after a successful order and filled in next time. The CVC is never saved, and everything resets on refresh.
- **Hold-to-confirm order dialog:** shows the total, items, address and payment. **Not yet** gets focus first, and the order only goes through after pressing and holding.
- **Payment moment:** a perceived-performance progress bar, then you land on Orders → Pending.
  - Success turns the total green.
  - A decline (tick **Failed payment** on the Review step) turns it red, gives a small shudder and drains the bar back to zero.

### Orders
- **Orders button in the header:** a badge counts new orders and clears once the page has been viewed.
- **Pending tab:** a four-step tracker (Preparing → Shipped → Out for delivery → Delivered) with **Status** buttons to move an order along. Each change sends a notification, and delivered orders move to History automatically.
- **History tab:** every order kept exactly as placed, plus a deduplicated **Buy again** grid ("Ordered 3 times").

### Notifications & feedback
- **Bell inbox:** unread dots and **Mark all as read**. Messages are never deleted.
- **Pop-ups:** monotone, icon-free, sized to their content.
- **Confirmations:** before placing an order and before logging out.
- **Lost connection:** a calm "Take a breather" screen with a breathing logo.
  - It appears on a real outage or via **Lost Connection?** in the footer.
  - In simulation, *Try again* always fails gently and *Back Online!* ends it.

### Feel
- **Seamless navigation:** the View Transitions API cross-fades between pages while the header and background stay still. Scroll position is remembered.
- **Interactive wave background:** lines that ripple around the cursor and invert over the footer.
- **Light / dark mode:** light by default, with a toggle in a fixed position.
- **Text selection:** text can't be selected outside form fields, except order numbers, which select in one click.
- **Accessibility:** respects reduced motion, uses screen-reader live regions, and keeps keyboard focus inside dialogs.

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

Sign in with **admin** / **admin**, or create your own account. Accounts, carts, orders, notifications and saved checkout details are kept in memory only: nothing is stored, and everything resets on refresh.

## Deployment

`vercel.json` rewrites every route to `index.html`, so client-side routes work on refresh. Every push to `main` redeploys automatically on Vercel.
