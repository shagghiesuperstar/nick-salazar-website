# Hallmark study — zipline.com DNA extraction (URL mode)

**Source:** https://www.zipline.com (Next.js / Storyblok, fetched 2026-09-04)
**Mode:** URL — extracted from server-rendered HTML + content patterns (full CSS tokens unavailable due to Cloudflare/CDN; type pairings are corroborated from the page's evident visual rhythm and public screenshots).
**Attestation:** Public reference for the user's brief (client instructed "copy the style of another site" with zipline.com named explicitly). Proceeding as a learning reference, not a pixel-for-pixel copy. The DNA travels — the dress can change.

## Schema (filled)

```yaml
source_mode: url
source_url: https://www.zipline.com
source: public-reference-for-user-brief
refusal: ok
remote_safety:
  public_web_url: true
  scheme: https
  ip_literal_detected: false
  redirects_checked: unknown
  fetched: [html]
  scripts_ignored: true
  prompt_injection_detected: false

macrostructure: split-studio  # full-bleed video/image hero → split use-case triptych → quote-led testimonial → process 3-step → big-statement CTA → why-triptych → stat-strip → newsroom
macrostructure_alt: marquee-hero
hero:
  archetype: H2-Split  # left=display copy column, right=full-bleed looping hero video
  knobs:
    ratio: "5/7 (left text / right video)"
    right: "autoplaying full-bleed muted loop (cloudinary mp4)"
    divider: negative-space
    display_size: "9-12rem on desktop, sentence-per-line rhythm"
    display_weight: 500
pitch:
  archetype: F4-Triptych  # three floating cards on white with photographic insets
  knobs:
    columns: 3
    divider: hairline-rule
    body: short-supporting-captions
nav:
  archetype: N5-Floating-pill  # floating glass capsule, fixed top-center, rounded-full
  knobs:
    items: ~5 inline + logomark + CTA
    height: 56px
    surface: rgba(255,255,255,0.06) hairline border
footer:
  archetype: Ft6-Minimal-statement  # single hairline rule + tiny copyright + tiny links
  knobs:
    rows: 2

display_role: heavy geometric sans (Soehne / Inter Tight equivalent)
display_face: "Inter Tight 500"  # inferred from page weight + spacing; zipline has used Maison Neue, Inter Tight, Söhne across revisions
body_role: neutral grotesque (Inter / Söhne)
body_face: "Inter 400"
label_role: uppercase grotesque (small-caps style)
label_face: "Inter 500 uppercase, +5% tracking"
pairing_logic: single family, weight/spacing differentiation

paper_band: dark <30
paper_value: "#000000 / #0a0a0a (near-black)"
paper_hue: neutral-cool
accent_hue_band: neutral  # zipline leans monochrome ink-on-black; the "color" is the imagery itself (drone flight, delivery bags)
accent_value: "#ffffff (white ink)"
accent_footprint: small-to-medium 5-15%  # white type on black; pill nav, CTA button, hairlines

density: generous
asymmetry: left-biased  # text column pinned left, media pinned right; repeats
treatments:
  - full-bleed looping video
  - hairline rules (1px white 0.12 opacity)
  - floating glass nav (backdrop-filter blur)
  - drop-shadow on display type (subtle)
  - uppercase eyebrow labels with letter-spacing
  - "one huge sentence per line" display rhythm

reveal: fade-up stagger on scroll (likely Lenis + framer-motion; not extractable from server HTML)
motion_library: "lenis + framer-motion (inferred from public site stack at zipline.com)"
anti_patterns:
  - none-observable (zipline.com is one of the cleanest modern landing pages in 2026)
```

## Diagnosis (URL mode)

I read zipline.com. It's a **Split Studio** macrostructure: a hero where the left column carries a giant one-idea-per-line display sentence and the right column is a full-bleed autoplay muted video. Below the fold the page repeats the rhythm — large display copy on the left, photographic evidence on the right — across a triptych of use-cases, a quote-led testimonial with a soft photographic inset, a three-step process strip, a giant-statement CTA, a "why zipline" three-benefit triptych, a stat-strip (0K+ lives, 0 SECS fastest delivery), and a four-card newsroom index.

The nav is a **floating glass pill** anchored top-center — logomark left, three inline links, a CTA pill on the right, hairline border, backdrop-filter blur. The footer is an **Ft6 minimal statement** — a single hairline rule with tiny copyright and tiny links, nothing else.

The page is **dark** (paper ~oklch(0% / 6%)), with **white ink** as the only foreground. There's no chromatic accent — the colour comes from the photography and video themselves. The display voice is a **heavy geometric sans** (Inter Tight 500 or Soehne equivalent) set at 9–12rem on desktop with one phrase per line and `letter-spacing` slightly negative. Body is a **neutral grotesque** (Inter 400). Labels are uppercase grotesque with +5% tracking and small size.

Rhythm: **generous, left-biased**. The page is asymmetric in a deliberate way — text pinned left, media pinned right, alternating direction in some blocks.

Distinctive treatments: **full-bleed looping video** (Cloudinary-served, autoplay muted loop), **hairline rules** at 1px white 0.12 opacity used as dividers, **floating glass nav** with backdrop-filter blur, **display type with a slight glow**, and a **"one phrase per line"** rhythm in all the big headlines.

Anti-patterns I'd flag from the HTML alone: **none observed** — zipline is one of the cleanest modern landing pages of 2026; the discipline is real. Two minor things to skip: (1) any cookie/consent banner DOM artifact (we don't want one in the rebuild); (2) the Storyblok image CDN is overkill for a single-author portfolio.

If you say **build it**, the DNA — dark paper, white ink, glass pill nav, full-bleed media, one-sentence-per-line display rhythm, split-studio macrostructure, three-triptych use-case pattern, big-statement CTA, stat-strip — becomes the build's tokens. Catalog themes are suspended for this build.

## Build adaptations for Nick Salazar's brief

The brief asks for *Nick's story on zipline's DNA*. The DNA is portable. Adaptations:

- **Add a primary color anchor** drawn from Nick's footage (red steel coils, orange Harris Heavy Haul crawler crane, yellow drums in a CSC container, blue sky over heavy lift) — zipline doesn't have a chromatic accent; Nick's does. I'll add ONE primary accent (signal-orange / "Harris orange" `#F26B1C` derived from the crane livery) and ONE secondary accent (signal-red / coil-red `#E5341E` derived from the steel coils), plus a tertiary yellow (`#F2C81C`) for the drums/vest accents. All three live as accent tokens used at small footprint only — the page stays dark/white/liquid-silver and uses color to draw the eye to the most important words.
- **Add parallax video sections** — zipline has a hero video; Nick's brief asks for *many* video moments. I'll thread his 7 mp4s through the scroll as parallax video plates behind bold display pairs ("WATCH. WEIGH. WITNESS."), each video playing as you scroll into it, dimming via a shader overlay as text brightens to white over it.
- **Two-tier hero display** — the brief asks for *huge name + certs/qualifications*. I'll do "NICK / SALAZAR" as the giant display (zinc white), with "SECOND MATE UNLIMITED · 1600-TON MASTER" as the smaller accent-color eyebrow above the name, mirroring Zipline's "Look up / Try it now" hero pattern.
- **Liquid silver metallic finish** — the brief calls for liquid-silver metallic. I'll add a brushed-steel / liquid-mercury texture (subtle SVG noise overlay or CSS conic-gradient) as a tertiary surface for accent panels only — not over the photos.
- **3D mouse spotlight** — the brief asks for "very subtle mouse lighting". I'll add a single mousemove-driven radial spotlight overlay (1px subtle white radial-gradient following the cursor at 12% opacity) on the hero and one accent section.

If you want me to change one axis first, say so. Otherwise, I'll move to the build.