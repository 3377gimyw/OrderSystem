# Product

## Register

product

## Users

Young customers (20s, mostly groups of friends) seated at a table inside a club-concept Korean 주점. Loud music, low light, drinks already in hand. They arrive at the site by scanning a QR code on the table, order food in under a minute, and put their phone back down. Time-on-task is short and sandwiched between conversation and drinking. They are not browsing; they are placing.

Staff use the same app on a separate `/staff` route to monitor orders. Their context is functional, not atmospheric, but they share the same chrome.

## Product Purpose

Let a table place an order without flagging down a server. Success looks like: an order is placed in under 60 seconds, with no confusion about table number, sold-out items, or what the user already has in the cart. The order lands in the staff Google Sheet correctly attributed to the right table, every time.

The site is **not** a menu browser, a marketing surface, or a loyalty product. There is no signup, no payment, no upsell. The strategic job is *frictionless ordering inside an atmospheric room*.

## Brand Personality

Intimate, sophisticated, dark. The interface should feel like a private moment in a public room: the screen glow on one person's face at a low table while everyone else is dancing. Voice is short, confident, knowing. Not friendly-bubbly, not corporate-polite, not playful-emoji. Quiet authority over enthusiastic helpfulness.

Mood wins over efficiency on every tie. If a "best-practice" affordance breaks atmosphere, atmosphere keeps the seat.

## Anti-references

What this must NOT look like, in order of importance:

- **The default "dark + amber CTA" pub UI** that the original CLAUDE.md specced. Gray-900 + warm orange is the AI-reflex answer for "Korean bar app." Reject it.
- **Generic AI nightlife slop**: vaporwave purple-pink gradients, neon-on-black "cyberpunk", stock smoke/neon-sign imagery, glow-everywhere CSS shadows, glass cards over a blurred photo of bottles.
- **Standard delivery-app patterns**: 배민 / 요기요 / Uber Eats card grids, hero metrics, "popular items" carousels, food-photography-as-card-background.
- **SaaS-cream and tech-minimal**: this is not Linear, not Notion, not Stripe. The product register does not mean borrowing the product-tool aesthetic.
- **Friendly mascots, emojis, exclamation points, sparkle effects, micro-celebrations.** No "Yay! Your order is on its way 🎉".

Side-stripe borders, gradient text, default glassmorphism, identical card grids, and the hero-metric template are banned everywhere; they are doubly banned here.

## Design Principles

1. **Mood is the product.** The customer is paying for a night out, not for software. Every screen should reinforce that they are inside a club, not inside an app. When in doubt, choose the more atmospheric option.
2. **Quiet, not loud.** The room is already loud. The interface is the calm thing the user looks at. Restraint, low contrast against the dark, small confident type. No shouting CTAs, no urgency banners, no animation that demands attention.
3. **Anti-template.** Reject the first shape that comes to mind for any screen (menu grid, cart drawer, success modal). The shape itself should feel considered. If it could appear unchanged in any other ordering app, redesign it.
4. **Trust the user.** Young, in-the-moment, slightly drunk, with friends. They do not need hand-holding copy, tutorial overlays, or "tap here to continue" arrows. Show, don't explain.
5. **Physical reality over visual reality.** Touch targets, table-number entry, sold-out states must survive a dark room and a tipsy thumb. Mood can sacrifice contrast; it cannot sacrifice tap size or table-number correctness, because a wrong table is a real-world failure that breaks the staff workflow.

## Accessibility & Inclusion

No WCAG AA target. Mood wins ties; legibility is tuned to "readable in a dark room with a phone held close," not "readable on a sunny patio." Body type may sit below 4.5:1 contrast where the design calls for it.

Non-negotiables that survive the mood-first rule:

- Tap targets ≥ 44px. Drunk thumbs are the real constraint.
- Table number input must be unmistakable and confirmable. Wrong-table errors are operationally expensive.
- Sold-out items must be visibly unorderable, not just dimmer.
- Korean-only UI. No English fallback expected.
- No motion that flashes or strobes (room lighting may already do that). Reduced-motion preference respected for any non-decorative motion.
