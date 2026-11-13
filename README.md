# Bing Chilling

Cool deals, chill prices. A minimal online store built to demonstrate four HCI design patterns: **search bars, progress bars, confirmations and notifications**, plus error handling designed to stay calm, not alarming.

## Features

### Accounts
- **Sign in / create an account:** a tiled cone-logo background that drifts on sign-in and becomes a whirlpool on account creation. A wrong attempt makes the background shudder with a red flash.
- **New accounts:** creating an account returns you to Sign in, with your email filled in, for your first sign-in.
- **Welcome:** a full-screen personal greeting after signing in ("Welcome, Kurt" the first time, then "Good evening, Kurt").
- **Account menu:** your name in the header opens a menu with the email you're signed in with and **Log out**.
- **Return to where you were:** after a refresh, signing in takes you back to the page you were on.

### Shopping
- **Search bar:** live, debounced search across 102 products, combined with a category filter. The heading reads `Category | N items`.
- **Reshuffle:** products shuffle on every visit. Pressing the header logo scrolls to the top and reshuffles them.
- **Add to cart:** the product image flies into the cart icon, which bumps as its count updates.
- **Cart:** quantity steppers. Removing an item slides it off to the right, with **Undo** to bring it back.

### Checkout (progress bar)
- **Layout:** two columns on desktop, with the current step on the left and an **Order summary** on the right (thumbnails, subtotal, delivery, total) that stays in view on every step.
- **Three steps:** Shipping (address and delivery speed), Payment (Visa or Mastercard, online banking via MariBank, GCash, Maya or GoTyme Bank, or cash on delivery; just one mock number) and Review, with a step progress bar. Any input is accepted, and empty fields get friendly inline messages.
- **Saved details:** shipping and payment details are remembered per account after a successful order and filled in next time. Everything resets on refresh.
- **Review:** clear Delivery and Payment panels, each with its own **Change** button. The final button shows the amount, for example "Place order · ₱3,647.00".
- **Hold-to-confirm order dialog:** shows the total, items, address and payment. **Not yet** gets focus first, and the order only goes through after pressing and holding.
- **Payment moment:** a perceived-performance progress bar, then you land on Orders → Pending.
  - Success turns the total green.
  - A decline (tick **Failed payment** on the Review step) turns it red, gives a small shudder and drains the bar back to zero.

### Orders
- **Orders button in the header:** a badge counts new orders and clears once the page has been viewed.
- **Pending tab:** a four-step tracker (Preparing → Shipped → Out for delivery → Delivered) with **Status** buttons to move an order along. Each change sends a notification, and delivered orders move to History automatically.
- **History tab:** every order kept exactly as placed, plus a deduplicated **Buy again** grid ("Ordered 3 times").

### Manage account
- **Where:** opened from **Manage account** in the footer.
- **Newsletter:** shows the subscribed email. **Unsubscribe** opens a "Before you go" dialog that lists what they'd miss, with **Stay subscribed** as the default. Leaving shows a gentle "All set" pop-up in the bottom-left, with no notification.
- **Change password:** current password, new password and confirmation, with inline checks.
- **Delete account:** type **DELETE** to confirm. It removes the cart, orders, notifications and saved details, then ends with a full-screen farewell ("Until next time, Kurt") on the way back to Sign in.
- **Admin account:** protected, so it can't be deleted or have its password changed.

### Notifications & feedback
- **Bell inbox:** unread dots and **Mark all as read**. Messages are never deleted. Orders, status changes, password changes and joining the newsletter all send one.
- **Pop-ups:** monotone, icon-free, sized to their content.
- **Confirmations:** hold-to-confirm before placing an order, a warm "Heading out?" before logging out, "Before you go" before leaving the newsletter, and typing DELETE before deleting an account.
- **Lost connection:** a calm "Take a breather" screen with a breathing logo.
  - It appears on a real outage or via **Lost Connection?** in the footer.
  - In simulation, *Try again* always fails gently and *Back Online!* ends it.

### Feel
- **Seamless navigation** (View Transitions API):
  - **Store pages:** cross-fade while the header and background stay still. Scroll position is remembered.
  - **Sign in ⇄ Create an account:** one card morphs, with its two panels sliding past each other.
  - **Logging out:** the store dissolves in 0.2 s while the wave lines settle and the cone field blooms in diagonally behind the rising sign-in card.
  - **Signing in:** the cones warp outward into the store.
- **Interactive wave background:** lines that ripple around the cursor and invert over the footer.
- **Footer:** a store directory (Shop, Explore, Your account, Help) with real category and account links, plus the newsletter sign-up.
- **Light / dark mode:** an old-style pull-string switch in the top-left with the cone logo as its charm. Tap it, drag it down or press Space, and the new mode spreads out in a circle from the charm. Light by default.
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
