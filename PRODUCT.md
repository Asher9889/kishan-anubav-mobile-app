# Product

## Register

product

## Users

Indian farmers and agricultural workers, primarily rural, varying literacy levels. Context: mobile-first, often on basic smartphones with unreliable connectivity. Need quick access to crop advice, weather, market prices, and agri-knowledge. Primary interaction mode is voice (ask a question, get an answer) with text as secondary.

## Product Purpose

Krishi Anubhav AI ("Krishi Experience AI") is an AI-powered agricultural assistant that gives farmers instant, voice-driven access to expert knowledge — crop management, pest control, weather insights, market information — in their own language. Success means farmers make better decisions faster, reducing crop loss and improving yield, without needing to read manuals or visit extension offices.

## Brand Personality

Warm, Trustworthy, Modern. Approachable like a fellow farmer who knows their stuff, competent like an agri-expert, never cold or corporate. The tone is helpful, patient, and direct — plain language, no jargon unless explained.

## Anti-references

- **No cold/sterile tech look.** Avoid blue-heavy corporate palettes, minimalist gray-on-white, and generic SaaS patterns. This is an agri-tool, not a fintech dashboard.
- **No patronizing design.** Big, simple UI is not the same as childish. Respect the user's intelligence while making every action obvious.
- **No copy-heavy docs-like layouts.** Farmers don't read manuals. Surface the primary action (ask a question / voice input) immediately.

## Design Principles

1. **Voice-first, text-second.** The microphone is the primary input affordance, not an afterthought. Design the UI around voice interaction — listen-first, confirm, respond.
2. **Warmth without patronizing.** The existing amber/orange + green palette anchors a warm, earthy, trustworthy feel. Use it generously. High-contrast text (never light gray), spacious touch targets (min 48pt), and icon + label everywhere.
3. **Clarity at every size.** Assume the user may have the font scaled up, poor eyesight, or bright outdoor sunlight. Large type, bold weight where it matters, high contrast ratios (≥4.5:1 body), and reduce reliance on subtle color-only signals.
4. **Offline-resilient by default.** Farmers face unreliable networks. Every screen should load cached content first, show skeleton states instantly, and communicate connectivity status clearly.
5. **Progressive disclosure.** The home screen surfaces exactly one primary action (ask a question / talk to the AI). All other features (news, profile, settings) are a tap away but never compete for attention.

## Accessibility & Inclusion

Voice-first / low-literacy support is the primary accessibility requirement. This means:
- Voice input as the default interaction
- Large, legible text (minimum 16px body, 48pt touch targets)
- High contrast ratios throughout
- Icon + text labels, never icon-only
- Clear error states with spoken alternatives
- Support for reduced motion preferences
- Multi-language support (i18n already set up)
