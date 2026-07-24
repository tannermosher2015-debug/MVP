---
name: Real Estate on Molokai
description: Warm Hawaiian luxury for a Molokaʻi brokerage, Cinzel + Josefin Sans on an ivory canvas with a bronze accent.
colors:
  ivory: "#f8f4ed"
  cream: "#efe8dc"
  sand: "#e4d9c6"
  sand-deep: "#cdbfa6"
  ink: "#2b221c"
  cocoa: "#3a2e26"
  espresso: "#211814"
  espresso-deep: "#19110d"
  taupe: "#6b5e52"
  taupe-light: "#8a7c6d"
  bronze: "#a07d4b"
  bronze-deep: "#6f5125"
  bronze-light: "#c2a06a"
  gold: "#d9b87f"
  ocean: "#2c5a57"
  ocean-light: "#3b7a74"
typography:
  display:
    fontFamily: "Cinzel, Georgia, serif"
    fontSize: "clamp(2.75rem, 8vw, 7rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Josefin Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  eyebrow:
    fontFamily: "Josefin Sans, ui-sans-serif, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.32em"
rounded:
  field: "12px"
  card: "16px"
  panel: "24px"
  pill: "9999px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  button-primary-hover:
    backgroundColor: "{colors.bronze}"
    textColor: "{colors.ivory}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "10px 24px"
  card-listing:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
  input-field:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "12px 16px"
---

# Design System: Real Estate on Molokai

## Overview

**Creative North Star: "Unhurried Island Luxury"**

The system sells a slow, high-value place through restraint. It behaves like a print real-estate portfolio brought to warm life: a deep ivory canvas, cinematic graded photography, elegant Cinzel display type set large and quiet, and a single bronze accent used sparingly enough that it always reads as intentional. Nothing shouts. Depth comes from generous space and hairline rules, not from boxes and heavy shadows, and motion is calm and settled rather than playful.

The palette is entirely warm: sand and ivory neutrals, espresso darks, a bronze/gold metallic accent, and a rare ocean teal for a sense of place. Luxury here is conveyed by what is left out, so new work should reach for more air and better photography before it reaches for more elements.

**Key Characteristics:**
- Warm, tinted neutrals only; no cool grays and no pure black or white.
- Cinzel for display and numbers, Josefin Sans for everything read.
- Bronze as a rare accent, ocean teal rarer still.
- Near-flat at rest; depth and warmth appear on hover.
- Calm `--ease-luxe` motion, fully reduced-motion safe.

## Colors

A warm, sand-to-espresso neutral field carrying one metallic accent (bronze/gold) and a sparing ocean teal for place.

### Primary
- **Bronze** (`#a07d4b`): the signature accent, used for hairline rules, hover underlines, icons, and decorative marks. Large or decorative use only.
- **Bronze Deep** (`#6f5125`): the AA-safe bronze for small text, links, and labels on light surfaces. This is the text-weight accent.

### Secondary
- **Gold** (`#d9b87f`): a lighter warm metallic for accents on dark (espresso) surfaces, such as contact icons and eyebrows in `light` tone.

### Tertiary
- **Ocean** (`#2c5a57`) / **Ocean Light** (`#3b7a74`): a teal sense-of-place accent used rarely (a success badge, a rare highlight), never as a second brand color.

### Neutral
- **Ivory** (`#f8f4ed`): the default page background and the light text color on dark surfaces.
- **Cream** (`#efe8dc`) / **Sand** (`#e4d9c6`) / **Sand Deep** (`#cdbfa6`): warm surface steps for alternating bands and subtle fills.
- **Ink** (`#2b221c`): default body text and the primary-button fill.
- **Cocoa** (`#3a2e26`): softer dark text.
- **Espresso** (`#211814`) / **Espresso Deep** (`#19110d`): dark section backgrounds (contact, mobile menu, footer) and the source hue for all shadows.
- **Taupe** (`#6b5e52`) / **Taupe Light** (`#8a7c6d`): muted secondary text and form labels.

### Named Rules
**The Bronze-Deep Rule.** Small text, links, and labels on light use `bronze-deep` (#6f5125), the AA-safe bronze. The lighter `bronze` (#a07d4b) is reserved for large or decorative use.
**The Sparing Ocean Rule.** Ocean teal is a sense-of-place accent, used rarely and never promoted into a second brand color.

## Typography

**Display Font:** Cinzel (with Georgia, serif fallback)
**Body Font:** Josefin Sans (with ui-sans-serif, system-ui fallback)

**Character:** Cinzel is an engraved, classical serif that gives headlines and prices a commissioned, gallery feel; Josefin Sans is a geometric humanist sans that keeps the reading and UI light and airy. The pairing reads as understated luxury rather than corporate real estate.

### Hierarchy
- **Display** (Cinzel 500, `clamp(2.75rem, 8vw, 7rem)`, line-height 0.98, -0.02em): hero and section headlines only.
- **Display Small** (Cinzel 500, `clamp(2rem, 5vw, 3.75rem)`, line-height 1.04): sub-section headlines.
- **Heading** (Cinzel 500, line-height 1.08, -0.01em): h1 to h5, including listing titles and prices.
- **Body** (Josefin Sans 400, 1rem, line-height 1.7): all reading text, constrained to a 60ch `measure` for long copy.
- **Eyebrow / Label** (Josefin Sans, 0.75rem, uppercase, 0.32em `tracking-luxe`): section eyebrows and form labels.
- **Nav / Meta** (Josefin Sans, 11 to 13px, uppercase, 0.18em `tracking-wide-2`): navigation and small meta rows.

### Named Rules
**The Two-Voice Rule.** Cinzel speaks only in display and numbers; Josefin Sans carries everything you actually read. Never set body copy in Cinzel.
**The Luxe Tracking Rule.** Uppercase eyebrows and labels ride at 0.32em (`tracking-luxe`); navigation at 0.18em. Prices and stats use `.nums` (tabular figures) to prevent layout shift.

## Layout

A centered `max-w-7xl` column with `px-5` to `px-8` gutters. Sections alternate between the ivory canvas and warm sand or dark espresso bands to pace a long single-page scroll. Content uses a 12-column grid at `lg` (for example the contact section's 5/7 split). Vertical rhythm is generous (`py-24` to `py-32` per section). Reading copy is capped at 60ch (`measure`). Density is deliberately low: whitespace does the work that borders would in a denser system.

## Elevation & Depth

Near-flat by default. Surfaces rest with hairline rings (`ring-1 ring-ink/5`) and 1px warm rules; real elevation appears only on interaction. Every shadow is warm, tinted from espresso (`rgba(33,24,20,...)`) and often negatively spread so it stays soft.

### Shadow Vocabulary
- **Nav (raised)** (`box-shadow: 0 8px 30px rgba(33,24,20,0.06)`): the sticky header once scrolled.
- **Card rest** (`box-shadow: 0 1px 0 rgba(33,24,20,0.06)` + `ring-1 ring-ink/5`): listing cards at rest.
- **Card hover** (`box-shadow: 0 24px 60px -20px rgba(33,24,20,0.35)` with `-translate-y-1.5`): the lift on hover.
- **Dropdown / overlay** (`box-shadow: 0 20px 50px -20px rgba(33,24,20,0.35)`): nav dropdown and floating panels.
- **Mobile bar** (`box-shadow: 0 -8px 30px rgba(33,24,20,0.10)`): the sticky mobile action bar, shadow cast upward.

### Named Rules
**The Warm Shadow Rule.** Shadows are always espresso-tinted `rgba(33,24,20,...)`, never neutral black. If a shadow looks gray, it is wrong.
**The Flat-At-Rest Rule.** Cards and surfaces are near-flat until hover or focus; depth is a response to interaction, not a default.

## Shapes

A soft, stepped radius language. Actions are full pills; content radii step up with the size of the container: fields at 12px (`rounded-xl`), cards at 16px (`rounded-2xl`), large panels at 24px (`rounded-3xl`), and the logo chip at 8px. Borders are hairline and low-contrast (`border-ink/10` to `border-ink/15`), or the bronze gradient hairline `.rule-bronze`. Photography sits in rounded frames under a warm `.graded` grade and a cinematic bottom scrim for legible overlaid text.

### Named Rule
**The Pill-and-Panel Rule.** Interactive actions are full pills (`rounded-full`); content containers step ivory to field (12px) to card (16px) to panel (24px). Do not square off an action or fully-round a content block.

## Components

### Buttons
- **Shape:** full pill (`rounded-full`).
- **Primary:** ink fill, ivory text, uppercase `tracking-luxe`, padding roughly `16px 32px` (`bg-ink text-ivory`). Used for the main form submit and mobile primary action.
- **Hover / Focus:** background transitions ink to `bronze` over 300ms; disabled state drops opacity to 70%.
- **Outline / Secondary:** transparent with a hairline border (`border-ink/25` to `border-ink/30`), ink text; over the dark hero it inverts to ivory border and text. Hover fills bronze (light) or ivory (on dark). This is the nav "Inquire" and the mobile "Call".

### Chips / Pills
- **Style:** small `rounded-full` labels, 10 to 11px, uppercase `tracking-luxe`. Type chips use `bg-ivory/95 text-ink`; status chips use `bg-bronze/90 text-ivory`.

### Cards (Listing)
- **Corner Style:** 16px (`rounded-2xl`).
- **Background:** white, with a hairline `ring-1 ring-ink/5`.
- **Shadow Strategy:** flat at rest (see Elevation), lifts `-translate-y-1.5` with a warm shadow on hover; the price sits in Cinzel over a bottom scrim, and the round arrow affordance shifts to `gold` on hover.
- **Internal Padding:** `p-6`. The whole card is one click target (`after:absolute after:inset-0`) with a `bronze-deep` focus ring.

### Inputs / Fields
- **Style:** ivory fill, 12px radius, hairline `border-ink/15`, `px-4 py-3`.
- **Label:** xs uppercase `tracking-wide-2` in taupe, with a bronze required asterisk.
- **Focus:** border shifts to `bronze` (`focus-visible:border-bronze`), no glow.
- **Error:** red-500 border, red-600 message text with `role="alert"`; success swaps to an ocean check badge and a "Mahalo!" confirmation.

### Navigation
- **Style:** fixed, transparent over the hero, transitioning on scroll to `bg-ivory/90 backdrop-blur-md` with a hairline `border-ink/10` and a soft warm shadow.
- **Links:** 11 to 13px uppercase `tracking-wide-2`, with a bronze underline that grows from width 0 to full on hover; a Cinzel logo on a small white chip.
- **Mobile:** full-screen espresso overlay, Cinzel links at `text-3xl`, focus-trapped with Escape-to-close and a phone row at the bottom.

### Signature Component (Eyebrow)
The recurring section opener: an index number in `.nums` bronze, a short bronze hairline rule, then an uppercase `tracking-luxe` label. `dark` tone uses `bronze-deep` text; `light` tone (on espresso) uses `gold`. It is the system's most identifiable structural device and should open sections consistently.

## Do's and Don'ts

### Do:
- **Do** lead with real, warm-graded photography (`.graded`) and let images carry the luxury; text recedes over a scrim.
- **Do** keep bronze rare: rules, underlines, icons, and small accents. Use `bronze-deep` for any small text on light.
- **Do** set prices and stats in Cinzel with `.nums` tabular figures.
- **Do** open sections with the Eyebrow pattern (index + bronze rule + `tracking-luxe` label).
- **Do** honor `prefers-reduced-motion` and keep the `bronze-deep` `:focus-visible` ring on every interactive element.

### Don't:
- **Don't** introduce a new accent hue; the system is warm neutrals + bronze/gold with a sparing ocean teal.
- **Don't** use neutral black or white shadows or flat `#000`/`#fff` text; shadows are espresso-tinted, text is ink or ivory.
- **Don't** set body or UI copy in Cinzel; it is display-and-numbers only.
- **Don't** box everything; lean on hairline rules and ivory space rather than heavy cards, and never nest cards.
- **Don't** use bounce or elastic easing; motion is `--ease-luxe` `cubic-bezier(0.22, 1, 0.36, 1)`, calm and settled.
