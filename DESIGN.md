<!-- SEED: re-run /impeccable document once the new aesthetic is implemented in code, to capture the actual tokens and components. -->
---
name: 주점 모바일 주문
description: A late-night ordering surface for a club-concept Korean 주점. Tinted near-black, a single deep blue, restrained.
---

# Design System: 주점 모바일 주문

## 1. Overview

**Creative North Star: "The Blue Hour"**

The blue hour is the brief window after sunset and before full dark, when the world is saturated, intimate, and held in a single tone. The interface lives there. It is not a generic dark-mode app and it is not a brutalist black-on-black exercise; it is a single deep blue holding the room. Every surface is tinted toward that blue, every neutral leans cool, every form of light on the screen feels filtered through it.

The aesthetic borrows from two named anchors. **Comme des Garçons editorial** sets the rigor: vast negative space, condensed serif headers treated as objects in their own right, asymmetric layouts unafraid to leave a screen mostly empty. **In the Mood for Love** sets the mood: a particular blue with a green undertow, the patient framing of a doorway or a lamp, the sense that something private is happening in a public room. The customer using this app is on the inside of that room; the screen is the lit lamp on a low table.

The system explicitly rejects every shape PRODUCT.md names. Most importantly, it rejects anything that could plausibly have been assembled in Canva. If a screen could be templated, recolored, and shipped for a different restaurant, it has failed.

**Key Characteristics:**
- Restrained palette: tinted near-black surfaces and one deep blue, used sparingly.
- Serif display in Korean for hierarchy, sans body in Korean for everything else.
- Generous negative space; the layout breathes even on a 360px screen.
- Motion only at state boundaries; nothing enters or exits with choreography.
- No cards by default. No grids of identical tiles. The shape of every screen is composed, not templated.

## 2. Colors

The palette is a single deep blue against a tinted near-black, with a small set of cool neutrals between them. Pure black and pure white are forbidden; every neutral carries a hint of the primary hue.

### Primary
- **Hong Kong Night Blue** (`[to be resolved during implementation]`): the one chromatic color in the system. A deep blue with a faint green undertow, sourced from the *In the Mood for Love* reference. Used for primary actions, the table-number affirmation moment, the cart-total figure, and almost nothing else. It is a punctuation mark, not a wash. Express in OKLCH at implementation; target lightness ~30-40%, chroma ~0.10-0.13, hue ~245-255.

### Neutral
- **Tinted Black** (`[to be resolved during implementation]`): the dominant surface color. OKLCH lightness ~12-15%, chroma ~0.008-0.012 toward the primary blue hue. Never `#000`.
- **Smoke** (`[to be resolved during implementation]`): the secondary surface, slightly lifted from Tinted Black; used for the rare moments a panel separates from the canvas. OKLCH lightness ~18-22%, same hue tint.
- **Bone** (`[to be resolved during implementation]`): the body-text color. Off-white, leaning cool. OKLCH lightness ~88-92%, chroma ~0.005 blue. Never `#fff`.
- **Ash** (`[to be resolved during implementation]`): muted text for secondary information (descriptions, metadata, sold-out treatment). Sits between Smoke and Bone in lightness.

### Named Rules

**The Blue Is Rare Rule.** Hong Kong Night Blue appears on no more than 10% of any visible screen. If a screen has a primary button, a price emphasis, and a status pip all in blue, that screen has too much blue. Pick one moment per screen.

**The Tinted-Black Rule.** Backgrounds are tinted near-black, not pure black. The tint is small enough that a casual observer would call it black, large enough that placing it next to `#000` reveals the cool cast. Pure `#000` and pure `#fff` are prohibited everywhere, including text.

**The Sold-Out Visibility Rule.** Sold-out items are not merely dimmer; they read as a different state. PRODUCT.md is explicit: items "must be visibly unorderable, not just dimmer." Strikethrough on the price, a slashed numeral, or a silenced label. Never just `opacity: 0.5`.

## 3. Typography

**Display Font:** A Korean-compatible serif (`[font pairing to be chosen at implementation]`). Recommended starting points: **Noto Serif KR** (free, full weight range, pairs cleanly with Latin) or **Nanum Myeongjo** (more dramatic strokes, more nostalgic print feel, closer to the *In the Mood for Love* type register). Both are free via Google Fonts. Reserve the display serif for hero figures (prices on confirmation, the order-confirmed numeral, occasional category marks). Most screens should use no display type at all.

**Body Font:** A Korean-first sans (`[font pairing to be chosen at implementation]`). Recommended: **Pretendard** (the modern de facto Korean UI sans, Inter-adjacent letterforms, free, full weight range, includes Latin). Fallback: Spoqa Han Sans Neo. Avoid Noto Sans KR for body if Pretendard is available; its metrics feel slightly stiff in tight UI settings.

**Character:** A condensed editorial serif against a humanist UI sans. The serif carries the room; the sans does the work of being read at low light by a tipsy thumb. The pairing should never feel like Google Docs' defaults; it should feel like a lookbook page that happens to also be a button.

### Hierarchy
- **Display** (light or regular weight, large clamp scale, line-height ~1.0-1.05): hero figures, the order-confirmed numeral, the table-number affirmation moment.
- **Headline** (regular weight, ~28-36px, line-height ~1.1): screen titles when present. Most screens carry no headline.
- **Title** (medium weight, ~18-22px sans, line-height ~1.25): menu item names.
- **Body** (regular weight, ~15-16px sans, line-height ~1.5): descriptions, secondary information. Korean readability is the rule, not the Latin 65-75ch line cap.
- **Label** (medium weight, ~12-13px sans, modest letter-spacing): metadata, the "품절" sold-out tag, currency suffix when used decoratively.

### Named Rules

**The Serif Punctuation Rule.** Serif type is reserved for moments that should feel important: a price on confirmation, the table number once entered, a category mark. Using serif for body would dilute it; using serif for everything would turn the system into a magazine, not a tool.

**The Korean-First Rule.** Every typographic decision is validated in Korean first. If a font looks elegant in Latin and stiff in Korean, the choice is wrong. The user never sees Latin in this app.

## 4. Elevation

Flat by default. The system uses tonal layering rather than shadows. Surfaces separate from each other through a small lightness shift in the same blue-tinted neutral family (Tinted Black to Smoke), not through `box-shadow`. The only place a shadow is permissible is the moment the order is confirmed, where a small ambient blue glow can communicate "this is locked in."

### Named Rules

**The No-Shadow Rule.** No `box-shadow` on cards, buttons, modals, or sticky bars. Depth is conveyed by surface tone, never by a drop shadow. A 2014-style elevation shadow is the fastest way to break the room.

**The Glow Is Earned Rule.** A faint blue ambient glow may appear once, on the order-confirmed screen. Anywhere else, glow is decoration, which is forbidden.

## 5. Do's and Don'ts

### Do
- **Do** use Hong Kong Night Blue as a punctuation mark. One moment per screen, not three.
- **Do** keep backgrounds tinted near-black. Never `#000`. Never `#fff` for text.
- **Do** validate every font and color choice in Korean first, not in Latin.
- **Do** make sold-out items visibly unorderable through a state change, not merely lower opacity. PRODUCT.md is explicit on this.
- **Do** keep tap targets ≥ 44px regardless of how spare the visual treatment is. Drunk thumbs are the real constraint.
- **Do** leave space empty. A 360px screen with three menu items and a lot of black is more on-brand than the same screen with six items packed in.

### Don't
- **Don't** revert to the default dark-plus-amber pub UI. Gray-900 with warm orange CTAs is the AI-reflex answer for "Korean bar app" and PRODUCT.md rejects it by name.
- **Don't** use vaporwave purple-pink gradients, neon-on-black cyberpunk glow, stock smoke or neon-sign imagery, or glass cards over a blurred photo of bottles. PRODUCT.md calls all of these out as nightlife slop.
- **Don't** use 배민, 요기요, or Uber Eats card-grid patterns, hero metrics, "popular items" carousels, or food-photography-as-card-background.
- **Don't** borrow the SaaS-cream tech-minimal aesthetic. This is not Linear, not Notion, not Stripe.
- **Don't** add friendly mascots, emojis in UI, exclamation points, sparkle effects, or micro-celebrations. No "Yay! Your order is on its way 🎉".
- **Don't** ship anything that could plausibly have been built in Canva. If a screen feels like a template with the colors swapped, redesign it.
- **Don't** use side-stripe borders, gradient text, default glassmorphism, identical card grids, the hero-metric template, or modals as a first-thought affordance.
- **Don't** animate layout properties; animate `transform` and `opacity` only. No bounce, no elastic, no choreographed entrances.
- **Don't** use em dashes or `--` in any user-facing copy.
- **Don't** chase WCAG AA contrast at the cost of mood. Mood wins ties; legibility is tuned to "phone held close in a dark room."
