# 주점 모바일 주문 웹사이트 (Bar Mobile Ordering Website)

## Project Overview

A mobile-first web ordering system for a Korean bar (주점). Customers scan a QR code at their table, browse the menu, add items to a cart, enter their table number, and submit the order. Orders are sent to a Google Sheet in real-time so staff can view them on any device.

**No login required. No payment processing. Mobile-first.**

---

## Tech Stack

- **Frontend**: React (Vite) + TypeScript
- **Styling**: Tailwind CSS (mobile-first responsive)
- **Order Backend**: Google Apps Script (deployed as a web app) → Google Sheets
- **Deployment**: Vercel (free tier) or Netlify (free tier)
- **Package Manager**: npm

---

## Project Structure

```
/
├── public/
│   └── images/           # Menu item images (webp, compressed)
├── src/
│   ├── components/
│   │   ├── MenuPage.tsx         # Menu listing with categories
│   │   ├── MenuItemCard.tsx     # Individual menu item card
│   │   ├── Cart.tsx             # Cart drawer/page
│   │   ├── CartItem.tsx         # Single item in cart
│   │   ├── OrderForm.tsx        # Table number input + submit
│   │   ├── OrderConfirmation.tsx # Success screen after ordering
│   │   ├── CategoryTabs.tsx     # Menu category filter tabs
│   │   └── Header.tsx           # Top navigation bar
│   ├── context/
│   │   └── CartContext.tsx      # Cart state management (React Context)
│   ├── data/
│   │   └── menu.ts             # Menu items data (name, price, category, image, description)
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── utils/
│   │   └── submitOrder.ts      # Google Apps Script API call
│   ├── App.tsx                  # Main app with routing
│   └── main.tsx                 # Entry point
├── google-apps-script/
│   └── Code.gs                  # Google Apps Script code for receiving orders
├── CLAUDE.md                    # This file
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## Page Flow

```
[Menu Page] → [Cart (drawer or page)] → [Order Form (table number)] → [Confirmation]
```

1. **Menu Page** (`/`): Shows all menu items grouped by category. Each item has name, price, image, and an "add to cart" button with quantity controls.
2. **Cart** (`/cart` or slide-up drawer): Lists added items, quantities, individual prices, and total. Has "order" button.
3. **Order Form** (shown before final submit): Simple input for table number (1~30). Required field.
4. **Order Confirmation**: Shows "Order submitted!" with order summary and table number. Has "Order More" button to go back to menu.

---

## Data Model

### Menu Item

```typescript
interface MenuItem {
  id: string;
  name: string;          // Korean name (e.g., "감자튀김")
  nameEn?: string;       // Optional English name
  price: number;         // In KRW (e.g., 15000)
  category: MenuCategory;
  description?: string;
  image?: string;        // Path to image in /public/images/
  soldOut?: boolean;     // If true, show as sold out and disable ordering
}

type MenuCategory = "안주" | "식사";
// (Side dishes/Snacks | Meals)
```

### Cart Item

```typescript
interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}
```

### Order (sent to Google Sheets)

```typescript
interface Order {
  tableNumber: number;
  items: { name: string; quantity: number; price: number }[];
  totalPrice: number;
  timestamp: string;     // ISO 8601
}
```

---

## Google Sheets Integration

### How It Works

1. Create a Google Sheet with header row: `Timestamp | 테이블 | 감자튀김 | 치킨너겟 | 모듬소시지 | 골뱅이무침 | 라면 | 볶음밥 | 총액 | 상태`
2. Write a Google Apps Script (Code.gs) that:
   - Listens for POST requests via `doPost(e)`
   - Parses the JSON order data
   - Appends ONE row per order, with quantities filling the menu columns
   - Returns success/error JSON response
3. Deploy the script as a Web App (access: "Anyone")
4. Store the Web App URL in `.env` as `VITE_GOOGLE_SCRIPT_URL`

### Google Apps Script (Code.gs)

The script holds the menu column order in a hardcoded `MENU_NAMES` array. To add or remove a menu item, edit both `src/data/menu.ts` and `MENU_NAMES` in `Code.gs`, then add/remove the matching column on the sheet.

### Google Sheet Column Layout

| Timestamp | 테이블 | 감자튀김 | 치킨너겟 | 모듬소시지 | 골뱅이무침 | 라면 | 볶음밥 | 총액 | 상태 |
|-----------|--------|----------|----------|------------|------------|------|--------|------|------|
| 2026-05-02 21:30 | 5 | 2 |  | 1 |  |  | 1 | 47000 | 신규 |

Empty cells mean the item was not ordered. Staff changes "상태" (status) column manually: 신규 → 준비중 → 완료
(New → Preparing → Done)

---

## UI/UX Requirements

### Mobile-First Design
- Viewport: optimized for 360px–430px width (standard phones)
- Touch-friendly: minimum 44px tap targets
- No horizontal scrolling
- Sticky header with cart icon + item count badge
- Bottom-anchored "View Cart" button when items are in cart

### Visual Style
- Clean, modern, dark theme (suits bar/pub atmosphere)
- Background: dark (gray-900 or similar)
- Accent color: warm amber/orange for CTAs
- Cards with subtle borders or shadows for menu items
- Large, readable font sizes (minimum 16px body text)
- Price formatting: Korean Won with comma separators (e.g., "15,000원")

### Animations
- Smooth cart drawer slide-up
- Subtle add-to-cart feedback (button pulse or checkmark)
- Page transitions

### Accessibility
- All images have alt text
- Sufficient color contrast (WCAG AA)
- Form labels on all inputs

---

## Menu Data

Use placeholder data initially. The menu should be easy to update by editing `src/data/menu.ts`.

### Sample Categories and Items

**안주 (Snacks/Side Dishes)**
- 감자튀김 — 12,000원
- 치킨너겟 — 13,000원
- 모듬소시지 — 15,000원
- 골뱅이무침 — 18,000원

**식사 (Meals)**
- 라면 — 5,000원
- 볶음밥 — 8,000원

---

## Key Implementation Rules

1. **All text in Korean** — UI labels, buttons, error messages, everything user-facing is in Korean.
2. **Price display** — Always format with commas and 원 suffix: `15,000원`
3. **Table number validation** — Must be a number between 1 and 30. Show error if empty or out of range.
4. **Cart persistence** — Use React state (Context). Cart clears after successful order.
5. **Sold out items** — Grayed out with "품절" badge. Cannot be added to cart.
6. **Empty cart** — Show friendly empty state with link back to menu.
7. **Order submission** — Show loading spinner during API call. Show error message if it fails with retry button.
8. **No page reload** — SPA behavior. Use React Router for navigation.
9. **Responsive but mobile-focused** — Should look good on mobile. Desktop is secondary but shouldn't break.
10. **Image optimization** — Use webp format, lazy loading, reasonable sizes (max 400px wide).

---

## Environment Variables

```
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

---

## Build & Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:5173)
npm run build        # Production build → /dist
npm run preview      # Preview production build locally
```

---

## Git Workflow

Always push commits to GitHub (`git push`) immediately after committing, unless explicitly told not to. New branches should be pushed with `-u origin <branch>` to set tracking.

---

## Deployment Checklist

- [ ] All menu items have correct prices
- [ ] Google Apps Script is deployed and URL is set in .env
- [ ] Test order submission works end-to-end
- [ ] Test on actual mobile phone (not just browser devtools)
- [ ] Images are optimized and loading correctly
- [ ] Cart works correctly (add, remove, quantity change, clear)
- [ ] Table number validation works
- [ ] Deploy to Vercel/Netlify
- [ ] Generate QR codes for each table pointing to the site URL
