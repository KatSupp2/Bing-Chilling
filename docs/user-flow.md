# Bing Chilling: User Flow

Shows the four HCI design patterns in the app. Paste the code block into [mermaid.live](https://mermaid.live) to render it.

Legend: **blue** = Search Bar · **green** = Progress Bar · **amber** = Confirmation · **pink** = Notification

```mermaid
flowchart TD
  A([Start: open Bing Chilling]) --> HA{Has an account?}
  HA -- No --> RG[Register form: name, email, password]
  RG --> RV{Valid and email not taken?}
  RV -- No --> RE[Inline errors + Notification: Email already exists] --> RG
  RV -- Yes --> RT[Notification: Account created, welcome!] --> H
  HA -- Yes --> L[Login form]
  L --> LV{Correct email and password?}
  LV -- No --> LN[Notification: Invalid email or password] --> L
  LV -- Yes --> LT[Notification: Welcome back!] --> H[Home: product catalog]

  H --> S[Search bar: type keyword, results filter live]
  S --> R{Any matches?}
  R -- No --> RN[Empty state: No products match your search] --> S
  R -- Yes --> P[Browse results]

  P --> AC[Add to cart] --> ACT[Notification: Item added to cart + cart badge]
  ACT --> GC{Go to cart?}
  GC -- No --> S
  GC -- Yes --> CART[Cart page]

  CART --> RM{Remove an item?}
  RM -- Yes --> RMC{{Confirmation: Remove this item?}}
  RMC -- Cancel --> CART
  RMC -- Remove --> RMT[Notification: Item removed] --> CART
  RM -- No --> PB[Checkout progress bar: Shipping → Payment → Review]

  PB --> PO{{Confirmation: Place this order? Shows total}}
  PO -- Cancel --> PB
  PO -- Place order --> PP[Payment progress bar: rushes ahead, slows near 90%]
  PP --> OK{Payment succeeded?}
  OK -- No --> PF[Notification: Payment could not be completed, bar resets] --> PB
  OK -- Yes --> PD[Bar fills to 100%: Payment confirmed]
  PD --> NT[Notification: Order placed + bell inbox entry] --> H

  H --> LO{{Confirmation: Log out?}}
  LO -- Cancel --> H
  LO -- Log out --> LOT[Notification: Logged out] --> E([End])

  classDef search fill:#dbeafe,stroke:#2563eb
  classDef progress fill:#dcfce7,stroke:#16a34a
  classDef confirm fill:#fef3c7,stroke:#d97706
  classDef notify fill:#fce7f3,stroke:#db2777
  class S,RN search
  class PB,PP,PD progress
  class RMC,PO,LO confirm
  class RE,RT,LN,LT,ACT,RMT,PF,NT,LOT notify
```

## Demo notes
- **Accounts are temporary.** They are kept in memory only: no database and no browser storage. Refreshing the page clears all accounts and logs you out, so register again after a refresh.
- **Demo account.** `admin` / `admin` always works, as a fallback in case registration fails during a demo.
- **Per-account cart and notifications.** Each account has its own cart and bell inbox. They are kept when you log out and back in, and cleared on refresh.
- **Payment failure.** On the checkout *Review* step, tick "Demo: simulate a failed payment" to show the failure path.
