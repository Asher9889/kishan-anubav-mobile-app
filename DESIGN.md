---
name: Krishi Anubhav AI
description: AI-powered agricultural assistant for Indian farmers
colors:
  primary: "#8F4E00"
  primary-container: "#FF9933"
  secondary: "#056E00"
  secondary-container: "#8DFC75"
  tertiary: "#79573F"
  tertiary-container: "#D4A98D"
  neutral-bg: "#FBF9F4"
  neutral-surface: "#F5F3EE"
  neutral-text: "#1B1C19"
  neutral-text-secondary: "#554336"
  neutral-text-muted: "#887364"
  error: "#BA1A1A"
  warning: "#D97706"
  border: "#DBC2B0"
typography:
  display:
    fontFamily: "Inter"
    fontSize: "28px"
    fontWeight: 800
    lineHeight: 1.21
  headline:
    fontFamily: "Inter"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.27
  title:
    fontFamily: "Inter"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.33
  body:
    fontFamily: "Inter"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Inter"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.38
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  xxl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: "0 32px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.primary}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: "0 32px"
    height: "48px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "0 32px"
    height: "48px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "0 32px"
    height: "48px"
  button-destructive:
    backgroundColor: "{colors.error}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: "0 32px"
    height: "48px"
  button-success:
    backgroundColor: "{colors.secondary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: "0 32px"
    height: "48px"
  input:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.lg}"
    padding: "0 16px"
    height: "48px"
---

# Design System: Krishi Anubhav AI

## 1. Overview

**Creative North Star: "The Sunlit Field"**

A design system rooted in the warmth of Indian soil and the clarity of morning light over a ready harvest. Amber, green, and warm neutrals create an interface that feels like trusted advice from someone who knows the land — authoritative without being cold, modern without being sterile.

The system is tactile and warm: generously rounded controls (24px+ on buttons), gentle spring animations on interaction, matte-like surfaces rendered in a warm off-white (#FBF9F4) that avoids the clinical feel of pure white. Depth comes through tonal layering (surface container variants from lowest to highest at different lightness steps) with subtle shadows reserved for interactive states like pressed buttons and elevated sheets. This is an earthy-yet-modern agricultural tool — not a corporate dashboard, not a playful game, not a cold fintech product.

**Key Characteristics:**
- Voice-first interaction design with large, high-contrast touch targets (48pt minimum)
- Warm amber/orange primary anchored by a confident green secondary — colors that signal ripeness, growth, and trust
- Generous rounded corners throughout — buttons are pill-shaped (9999px radius), containers are softly curved (8–16px)
- Single-family typography (Inter) at high weights (800 for display, 700 for headings) for legibility in bright outdoor light
- Offline-resilient patterns with clear connectivity states and skeleton loading
- Reduced motion respected — all animations degrade to crossfade or instant transitions

## 2. Colors: The Sunlit Field Palette

A warm-anchored palette built around Harvest Amber (primary) and Field Green (secondary), grounded by Earthen Brown (tertiary). The background is a warm off-white — not pure white, not cream, but a natural near-white with the barest hint of warmth (#FBF9F4).

### Primary
- **Harvest Amber** (#8F4E00 / oklch(43.6% 0.085 55.9)): The primary brand color. Used for key CTAs (primary buttons), active tab icons, selected states, and as the anchor for the warm end of the palette. In dark mode it shifts to a glowing sky-blue (#60A5FA) for readability against dark surfaces.
- **Amber Glow** (#FF9933 / oklch(72.5% 0.132 62.8)): Primary container. Used for filled surfaces within primary context (badges, chips, progress fills). Also the active voice recording glow.

### Secondary
- **Field Green** (#056E00 / oklch(42.7% 0.148 136.2)): Success and affirmative actions. Appears in success states, secondary buttons marked "complete", and as confirmation signals. Dark mode shifts to a bright green (#4ADE80).
- **Sprout** (#8DFC75): Secondary container. Used as fill surfaces for green-context items.

### Tertiary
- **Earthen Brown** (#79573F / oklch(43.5% 0.045 62.5)): Used sparingly for tertiary surfaces, some card backgrounds in content-heavy screens. A grounding note that prevents the palette from feeling too high-chroma.

### Neutral
- **Warm Cream** (#FBF9F4): Body background. The base canvas on which everything sits. Not pure white — it has a very gentle warmth (chroma ~0.01 toward 70° hue) that keeps the app from feeling sterile.
- **Warm Surface** (#F5F3EE): Card and surface backgrounds. One step down from the body bg, used for inputs, secondary cards, and grouped content.
- **Ink** (#1B1C19): Primary body text. High contrast (≈12:1 against Warm Cream). Never use a lighter gray for body text.
- **Clay** (#554336): Secondary text. Still high contrast (≈6.5:1 against Warm Cream). For captions and metadata.
- **Stone** (#887364): Muted/disabled text (≈3.8:1 against Warm Cream — intentional for disabled states only, never for readable content).
- **Warm Border** (#DBC2B0): Subtle borders and outlines.

### Error
- **Alert Red** (#BA1A1A): Error states, destructive actions. High contrast against backgrounds.

### Named Rules
**The One Hue Rule.** Never use a color from outside this palette unless it's a data-visualization distinct series (charts, graphs). All accent colors pull toward amber or green; stray blues, purples, or pinks break the warm-coherent field.

**The Contrast Rule.** Body text (#1B1C19) on body background (#FBF9F4) achieves ≈12:1 contrast. Never drop below WCAG AA (4.5:1) for body text. The most common failure in agricultural-themed apps is light gray text on tinted near-white.

## 3. Typography

**Display Font:** Inter ExtraBold (800)
**Body Font:** Inter Regular (400)
**Size Scale:** 12–28px — intentionally compact for a mobile-first product. No display sizes above 28px; the app is a tool, not a billboard.

**Character:** Inter is a reliable, hardworking sans-serif — neutral without being cold, legible at small sizes and bright light. Used across all roles. The single-family choice avoids pairing conflicts and keeps the font stack simple (critical for fast cold-starts on rural networks).

### Hierarchy
- **Display** (800, 28px, 1.21): Headings on feature screens (home hero, profile name, AI chat welcome). Very rare — one per screen maximum.
- **Headline** (700, 22px, 1.27): Section titles, screen headings. The most common heading level.
- **Title** (700, 18px, 1.33): Card titles, list item headings, modal headers.
- **Body** (400, 16px, 1.625): Running text, chat messages, descriptions. Max line length 65–75 characters.
- **Label** (500, 13px, 1.38): Button labels, tab labels, captions, metadata.
- **Small** (400, 12px, 1.33): Fine print, timestamps, secondary metadata.

### Named Rules
**The Minimum 16 Rule.** No body text below 16px. Captions and labels may use 13px only at high weight (500). 12px is reserved for purely decorative metadata (timestamps). If text carries information, it must be ≥16px.

**The Large Touch Rule.** All interactive text is backed by a touch target of at least 48pt. Inline link text gets at minimum 10px of padding above and below.

## 4. Elevation

The system uses hybrid elevation: tonal surface layering for structural hierarchy, with subtle box-shadows reserved for interactive states (pressed buttons, elevated modals, floating action buttons).

Surface hierarchy is expressed through the Material-inspired surface container scale:
- **Lowest** (White #FFFFFF): Modal sheets, dialogs on top of everything.
- **Low** (#F5F3EE): Default card, input, and grouped container surface.
- **Default** (#F0EEE9): Tabs, navigation bars, section backgrounds.
- **High** (#EAE8E3): Pressed state surface (touch feedback).
- **Highest** (#E4E2DD): Dragged or long-pressed state.

This means the majority of the UI is flat — depth is read through lightness, not shadows. Shadows appear only in specific contexts where a surface literally overlaps another:

### Shadow Vocabulary
- **ambient-low** (`0 2px 8px rgba(0,0,0,0.06)`): Default card elevation on home feed items, knowledge post cards.
- **ambient-mid** (`0 4px 16px rgba(0,0,0,0.08)`): Raised controls, bottom sheets, action sheets.
- **ambient-high** (`0 8px 24px rgba(0,0,0,0.10)`): Modals, dialogs, floating action buttons.

Dark mode shadows use `rgba(0,0,0,0.24)` to `rgba(0,0,0,0.40)` — darker base because dark surfaces need more contrast to feel elevated.

### Named Rules
**The Surface-Over-Shadow Rule.** Prefer tonal separation over box-shadow. If two surfaces can be distinguished by background lightness alone, don't add a shadow. Shadows are for motion state (pressed, elevated, dragged), not static hierarchy.

## 5. Components

Components are tactile and warm: pill-shaped buttons (9999px radius), generously padded inputs, rounded cards with subtle tonal backgrounds. Spring animations run on press (scale 1→1.05→1 at 400 stiffness / 15 damping) with haptic feedback on iOS. Reduced motion collapses all animations to instant transitions.

### Buttons
- **Shape:** Pill-shaped (border-radius: 9999px), full height 48px (default), 44px (sm), 54px (lg).
- **Primary:** Harvest Amber background (#8F4E00) → Amber Glow (#FF9933) on hover/press. White text (#FFFFFF). Padding: 16px horizontal.
- **Secondary / Success:** Field Green background (#056E00). White text.
- **Destructive:** Alert Red background (#BA1A1A). White text.
- **Outline:** Transparent background, 1px Warm Border (#DBC2B0), Harvest Amber text.
- **Ghost:** Transparent background, Harvest Amber text. No visible boundary until pressed.
- **Link:** Inline text only, no visual button shape. Harvest Amber with underline.
- **Icon support:** All button variants support a leading icon (lucide-react-native) at 18px (default), 16px (sm), or 24px (lg).
- **Motion:** On press, scale animates to 1.05 with slight brightness increase (spring: damping 15, stiffness 400). On release, returns to 1 (spring: damping 20, stiffness 400).
- **Loading state:** Replaces content with a matching spinner (color matches text color).

### Inputs / Fields
- **Style:** Filled surface (#F5F3EE / Warm Surface), none at rest. Rounded corners (12px / rounded.lg). Height: 48px (text inputs) or auto (multiline).
- **Focus:** Border shifts to Harvest Amber (#8F4E00) with a subtle glow (`box-shadow: 0 0 0 3px rgba(143, 78, 0, 0.12)`).
- **Placeholder:** #554336 (Clay) — NOT the muted/disabled gray. Must meet 4.5:1 contrast.
- **Error:** Border shifts to Alert Red (#BA1A1A) with error-light background tint (`rgba(186, 26, 26, 0.10)`).
- **Disabled:** 0.5 opacity with no interaction.

### Cards / Containers
- **Corner Style:** 12px radius (rounded.lg) for knowledge post cards, 16px (rounded.xl) for profile cards.
- **Background:** White (#FFFFFF). Secondary cards use Warm Surface (#F5F3EE).
- **Shadow Strategy:** ambient-low shadow at rest on feed items. No shadow on embedded surface containers (tonal separation only).
- **Internal Padding:** 16px (spacing.md) default.

### Navigation
- **Bottom Tab Bar:** Pill-shaped indicator on active tab. Tab icon + label below. Active: Harvest Amber (#8F4E00), inactive: Stone (#887364).
- **Top Stack Header:** Transparent with translucent glass effect (`rgba(255,255,255,0.72)`). Title in Headline weight (700, 18px). Back chevron in Harvest Amber.

### Chips
- **Style:** Filled with primaryMuted (`rgba(143, 78, 0, 0.12)`) for selected, neutral surface for unselected. Full rounded (9999px).
- **Text:** Harvest Amber for selected, Clay for unselected. Label weight (500, 13px).

### Sheet / Modal
- **Style:** Cards-style bottom sheet with grab handle. Rounded top corners at 16px (rounded.xl). Background: White (#FFFFFF). ambient-mid shadow. Glass backdrop (`rgba(0, 0, 0, 0.24)`).

### Voice Button
- **Signature Component.** A large pill-shaped button (48px+) with a pulsing glow ring effect. At idle: Harvest Amber (#8F4E00). When recording: Amber Glow (#FF9933) with expanding pulse rings at `voicePulse` and `voiceRing` opacities (0.16 and 0.08).
- **Glow animation:** CSS equivalent of a conic gradient rotating, implemented in Reanimated with a `withRepeat`+`withSpring` loop on scale and opacity of concentric rings.

## 6. Do's and Don'ts

### Do:
- **Do** use Harvest Amber (#8F4E00) as the single primary accent on CTA buttons, active tabs, and selected states. Its warmth carries the brand.
- **Do** pair primary actions with the Field Green (#056E00) secondary for success/completion signals.
- **Do** use the tonal surface scale (low → highest) for structural depth. Two surfaces at different lightness need no shadow.
- **Do** use Inter at high weights (700–800) for headings. Legibility in outdoor light requires weight, not size.
- **Do** keep body text at #1B1C19 (Ink) on #FBF9F4 (Warm Cream). This is ≈12:1 contrast.
- **Do** provide icon + label on every tab and primary action. Never icon-only in the bottom tab bar.
- **Do** respect reduced motion: collapse all entrance and state-change animations to an instant crossfade when `prefers-reduced-motion: reduce` is active.
- **Do** ensure the voice button is visually prominent — it's the primary input affordance.
- **Do** use the `text-wrap: balance` equivalent (manual line-breaks or RN text balancing) on headings.

### Don't:
- **Don't** use light gray text on tinted backgrounds. Text must meet 4.5:1 minimum. Stone (#887364) is for disabled states only.
- **Don't** use blue-heavy palettes or corporate navy tones. This is an agricultural tool, not a fintech dashboard.
- **Don't** use side-stripe borders (border-left >1px colored accent) on cards, list items, or callouts. Use full borders or background tints instead.
- **Don't** use gradient text (`background-clip: text` with gradient). Emphasis via weight or size only.
- **Don't** use glassmorphism as default decoration. Blur and glass effects are reserved for the voice-glow animation only.
- **Don't** use the hero-metric template (big number, small label, supporting stats). This is a voice-first assistant, not a SaaS dashboard.
- **Don't** use identically sized cards in a uniform grid with icon + heading + text. Vary the layout.
- **Don't** use numbered section markers (01 / 02 / 03) as decorative scaffolding.
- **Don't** use uppercase tracked eyebrows (tiny all-caps text with wide tracking above every section). One is character; every section is a tell.
- **Don't** let text overflow its container. Test headings at every breakpoint; the viewport is part of the design.
