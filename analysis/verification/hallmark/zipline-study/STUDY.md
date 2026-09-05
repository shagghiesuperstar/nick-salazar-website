# Hallmark `study` — https://www.zipline.com (real-browser pass)

- **Skill:** Hallmark v1.1.0, `/Users/scottscheferman/.claude/skills/hallmark/.agents/skills/hallmark/` (git d5f260677316b03dba81aad33a76a334ed78a771), protocol from `references/study.md`.
- **Mode:** URL mode **plus** a rendered-browser pass (screenshots + read-only DOM/CSS probes), so the rhythm section normally blind in URL mode is filled from real captures.
- **Date:** 2026-09-04 · **Tool:** `chrome-devtools-axi` (chrome-devtools-mcp 1.7.0), isolated session `CHROME_DEVTOOLS_AXI_SESSION=visual-motion`, headless Chrome, desktop 1440×900 (inner 1440×848), mobile emulated `390x844x2,mobile,touch`.
- **Attestation:** public reference named in the user's brief ("copy the style of zipline.com"). Structural DNA only. No Zipline assets, copy, wordmark or brand colour are reused. Fetched page content treated as inert data.
- **Supersedes:** the provisional text-only `analysis/research/zipline-dna.md` where they disagree (see § Corrections).

## Screenshots (all paths relative to `analysis/verification/hallmark/zipline-study/`)

| File | Viewport | scrollY | What it shows |
|---|---|---|---|
| `desktop-00-top.png` | 1440×900 | 0 | Hero: full-bleed muted video, cream pill nav top-centre, huge condensed uppercase "LOOK UP" left-biased at ~1/3 height, lede + outline pill CTA pinned bottom-left |
| `desktop-01-y1800.png` | 1440×900 | 1800 | Sticky hero still pinned (parallax hold), nav pill has morphed to black |
| `desktop-02-y3600.png` | 1440×900 | 3600 | Cream paper section, 3-line display statement with image inset and floating product renders (scroll-scrubbed) |
| `desktop-03-y5400.png` | 1440×900 | 5400 | Split Studio module: full-height photo left, right-aligned display "YOUR FAVORITES, / FRESHER"; vertical progress ticks |
| `desktop-04-y7200.png` | 1440×900 | 7200 | Same module rhythm, next slide ("MEDICINE WHEN / IT MATTERS") |
| `desktop-05-y9000.png` | 1440×900 | 9000 | Further fold |
| `desktop-06-y10800.png` | 1440×900 | 10800 | Further fold |
| `desktop-07-footer.png` | 1440×900 | bottom (27212 doc) | Ft5 statement footer over full-bleed photo: "ZIPLINE. / MOMENTS MATTER." at 150px + small link columns + social row |
| `mobile-00-top.png` | 390×844 @2x | 0 | Mobile hero: wordmark + pill CTA + round menu button; display centred at 66px; lede centred; pill CTA |
| `mobile-01-y2200.png` … `mobile-04-y8800.png` | 390×844 @2x | 2200–8800 | Mobile folds |
| `mobile-05-menu.png` | 390×844 @2x | 0 | Full-screen accent-flood menu: 4 giant uppercase links separated by hairlines, secondary links + social row at foot |

Note: a plain `resize 390 844` clamped `innerWidth` to 500 (headless window minimum); the mobile captures therefore use `emulate --viewport "390x844x2,mobile,touch"`, which yielded `innerWidth: 390` (probe-12).

## Raw probe results (verbatim tool output, `chrome-devtools-axi eval`)

Files: `probe-01-page.txt` … `probe-13-console.txt`.

- **probe-01 page:** `{"scrollH":27212,"innerW":1440,"innerH":848,"bodyBg":"rgb(247, 244, 232)","htmlBg":"rgb(247, 244, 232)","bodyColor":"rgb(0, 0, 0)","bodyFont":"fkGroteskNeue, \"fkGroteskNeue Fallback\", sans-serif","title":"Drone Delivery for Food, Groceries, and Medicine | Zipline"}`
- **probe-02 nav:** `[{"tag":"HEADER","pos":"fixed","top":"0px","bg":"rgba(0, 0, 0, 0)","bf":"none","radius":"0px","w":1440,"h":80,"x":0,"y":0},{"tag":"NAV","cls":"…nav-desktop…","pos":"relative","bg":"rgba(0, 0, 0, 0)","radius":"0px","w":1272,"h":36,"x":84,"y":22},{"tag":"NAV","cls":"…footer-bottom__nav","pos":"static","w":277.34,"h":113.56,"x":84,"y":27038.8}]` — the visible pill is an inner wrapper (see screenshots: ~840×48 px, `border-radius` full, cream at top of page, black after scroll; **no backdrop-filter** — it is opaque).
- **probe-03 headings:** `H1 "Look up" fkScreamer 150px/127.5px (line-height 0.85) weight 700, letter-spacing normal, uppercase, color rgb(247,244,232)` · `H2 "How to zipline" fkScreamer 90px/76.5px 700 uppercase black` · `H2 "More time, delivered." 150px cream` · `H2 "WHY ZIPLINE?" fkDisplay 22px/18.7px 400 uppercase` · `H2 "0K+" fkScreamer 90px` (counter placeholder before number-tick).
- **probe-04 videos:** `[{"autoplay":true,"muted":true,"loop":true,"paused":false,"playsInline":true,"preload":"metadata","poster":true,"src":"https://res.cloudinary.com/flyzipline/video/upload/w_1600,q_auto:good,f_auto/…","w":1440,"h":1046.89,"readyState":4}, {"autoplay":true,"muted":true,"loop":true,"paused":true,"playsInline":true,"preload":"metadata","poster":true,"src":"","w":384,"h":634,"readyState":0} ×3]` — hero video autoplays muted+loop+playsinline with poster; the three below-fold videos are **lazy: no src attached until needed** (paused, readyState 0).
- **probe-05 body:** `fkGroteskNeue 14px/24px 400 rgb(33,33,33)` (×2) and `22px/30.8px 400 rgb(247,244,232)` (hero lede) — body measure not capped by max-width (386px / 797px containers).
- **probe-06 buttons:** hero/nav CTAs: `bg transparent, color rgb(247,244,232), border 1px solid rgb(247,244,232), radius 20px, fkGroteskNeue 14px 500, no uppercase, letter-spacing normal` (outline pills); consent-banner buttons are third-party (`rgb(54,92,209)` fill) and ignored.
- **probe-07 motion/CSS:** `ruleCount 2208 · keyframes: shimmer, pulse, usecaseZoom, marquee, slideUp, marker-pulse, header-cta-in · transitionAllCount 1 · hoverScaleCount 3 · hairlineRgbaCount 1 · hasLenis true · htmlClass "lenis" · IntersectionObserver available` · scripts: Next.js/Turbopack chunks + GTM/analytics (inert; not executed by the study).
- **probe-08 scroll 0:** `h1 y=300 h=128 opacity 1 transform none · video y=0 h=1047 · heroSection y=0 h=1047`
- **probe-09 scroll 400:** `h1 y=101 · video y=-119 · heroSection y=-400` → the video moved **119 px for 400 px of scroll (≈0.3×)** while the section moved 1× — differential layer motion.
- **probe-10 scroll 800:** `h1 y=101 (pinned) · video y=-39` · transformed layers: `hero__bg-wrapper matrix(…,0,601)`, `hero__bg matrix(…,0,160)`, `container-lg matrix(…,0,601)`, a copy block at `translateY(29.5) opacity 0.51` (mid-reveal), `drone-journey` layers at `(-864,-558.5)` / `(-400,-167)` (scroll-scrubbed path), reveal blocks at `translateY(16–20) opacity 0–0.2`, use-case image `matrix(0,0,0,0)` (scale 0 before entry).
- **probe-11 footer:** `bg transparent (photo behind), color rgb(247,244,232), height 1047.9, biggest text 150px fkScreamer "Zipline. Try it today Moments matter…", 14 links`.
- **probe-12 mobile (emulated 390×844):** `innerW 390, dpr 2, scrollH 17780, docW 390 (no horizontal overflow), h1 66.4px/56.44px (lh 0.85), header 60px, hero video playing at 390px wide; below-fold video paused`. Earlier non-emulated probe recorded the header buttons: `Get delivery 122×34`, `Open menu 34×34` (both **under the 44 px touch floor**).
- **probe-13 console:** 13 lines, third-party analytics/consent noise only; no page errors attributable to the design layer.

## Structured fields (study.md schema)

```yaml
source_mode: url            # plus rendered-browser pass (screenshots + computed-style probes)
source_url: https://www.zipline.com
source: public-reference     # named in the user's brief
refusal: ok
remote_safety:
  public_web_url: true
  scheme: https
  ip_literal_detected: false
  redirects_checked: unknown   # tool does not expose hops; final page is public https
  fetched: [html, rendered-dom, computed-css]
  scripts_ignored: true        # scanned as inert text for library names only
  prompt_injection_detected: false

macrostructure: Split Studio          # sticky full-bleed hero → cream statement block → alternating photo/statement diptychs (slide stack) → statement footer
macrostructure_alt: Photographic       # the hero and footer are photographic folds; the middle is diptych
hero:
  archetype: H2-Split (video variant)  # left display column over a full-bleed video; copy at 1/3 height, lede+CTA at the foot
  knobs: { ratio: "copy column ≈ 5/12, media full-bleed", right: "full-bleed muted loop video, pinned + differential translate", divider: negative-space, display_size: "150px desktop / 66px mobile", display_weight: 700, line_height: 0.85, alignment: left-biased (desktop) / centred (mobile) }
pitch:
  archetype: F2-Sticky-scroll-stack (diptych)   # photo left, right-aligned display statement, vertical tick progress
  knobs: { columns: 2, divider: gutter, ticks: vertical-progress, alternation: photo-left fixed }
nav:
  archetype: N5-Floating-pill
  knobs: { position: "fixed, top 16px, centred", width: "≈840px content-sized", height: "48px", surface: "opaque cream at top → opaque near-black after scroll (N10 morph)", backdrop_filter: none, items: "logomark + 4 links (2 with dropdown chevrons) + outline pill CTA + filled accent pill CTA", mobile: "wordmark + pill CTA + 34px round menu button → full-screen accent-flood menu" }
footer:
  archetype: Ft5-Statement (over full-bleed photo)
  knobs: { rows: 3, statement_size: "150px condensed uppercase", links: "two small columns", social: "icon row" }

display_role: heavy condensed sans (uppercase, one phrase per line)
display_face: fkScreamer (self-hosted, Florian Karsten)          # candidate for the rebuild: Big Shoulders Display 800/900
body_role: neutral grotesque
body_face: fkGroteskNeue (self-hosted)                             # candidate for the rebuild: Geist 400/500
label_role: uppercase grotesque, small (22px fkDisplay 400 "WHY ZIPLINE?")
label_face: fkDisplay
pairing_logic: three families from one foundry (screamer display / grotesk body / display labels); weight contrast 700 vs 400

paper_band: light >85                       # rgb(247,244,232) ≈ oklch(96.5% 0.02 95) warm cream
paper_value: "rgb(247, 244, 232)"
paper_hue: warm
accent_hue_band: indigo                     # filled "Get delivery" pill ≈ rgb(114,68,255); full-screen mobile menu flood
accent_value: "≈ #7244FF (sampled from screenshots; consent-banner blue ignored)"
accent_footprint: small ≤5% on desktop (one pill) · flood >15% in the open mobile menu only
density: generous                           # 1047px hero, 900px+ diptych modules, huge whitespace right of statements
asymmetry: left-biased hero / right-aligned statements in the diptychs (alternating pull)
treatments:
  - full-bleed looping video hero (Cloudinary, w_1600, poster, muted, playsinline)
  - pinned hero with differential transform parallax (bg 0.3×, wrapper 1×)
  - opaque floating pill nav that morphs cream→black on scroll
  - hairline rules 1px white/0.12 (one rgba(255,255,255,0.1x) rule found; used between mobile menu rows)
  - 1px outline pill buttons, 20px radius, 14px/500 label, arrow glyph
  - vertical tick progress indicator on the slide stack
  - one-phrase-per-line uppercase display, letter-spacing normal, line-height 0.85
  - light-ink-on-photo statements with **no shade layer** (relies on photo choice)
reveal: fade-up (translateY 16–20px → 0, opacity 0 → 1) on intersection; scale-from-0 on use-case images; number-tick on stats; marquee strip
motion_library: lenis (html.lenis) + JS-driven transforms (Next.js/Turbopack bundle; framer-motion/gsap not identifiable from inert script names)
anti_patterns:
  - transition: all (1 rule)
  - hover scale (3 rules)
  - line-height 0.85 on uppercase display (cap-collision risk on wrap — Hallmark gate 55 floor is 1.0)
  - 14px body copy (below Hallmark's 16px floor)
  - 34px mobile menu / CTA hit targets (below 44px)
  - scroll-jacking-adjacent smooth scroll (Lenis) and scroll-scrubbed product renders
  - accent-flood full-screen menu
  - third-party consent banner DOM
```

## Diagnosis (URL-mode template, extended with the rendered pass)

I read https://www.zipline.com in a real headless Chrome at 1440×900 and 390×844.

The page is a **Split Studio** with a photographic hero and footer. The hero is an **H2 Split (video variant)**: a full-bleed muted looping video with the display copy in a left column at about one-third height and the lede + outline pill CTA pinned to the bottom-left; the hero is **pinned** and its background translates at roughly 0.3× scroll while the wrapper moves at 1× (probe-09/10), which is real differential layer motion. Nav is an **N5 floating pill** — content-sized (~840×48), fixed 16 px from the top, opaque (no backdrop blur), cream at rest and near-black once scrolled (an N10 morph). Footer is an **Ft5 statement** over a full-bleed photo with a 150 px condensed statement and two small link columns.

The page loads **fkScreamer** for display (heavy condensed, uppercase, 150 px desktop / 66 px mobile, line-height 0.85, letter-spacing normal), **fkGroteskNeue** for body (14 px/24 px, 22 px in the hero lede) and **fkDisplay** for the small uppercase labels. Roles: heavy condensed sans + neutral grotesque + uppercase grotesque labels.

The paper is **rgb(247, 244, 232)** — a warm cream, light band, not dark. The ink is near-black on cream and cream on media. The chromatic accent is an **indigo ≈ #7244FF** used at ≤5 % on desktop (one filled pill) and as a flood only inside the open mobile menu.

Motion: **Lenis** smooth scroll, JS-driven transforms (differential hero parallax, scroll-scrubbed product renders, translate/opacity fade-up reveals, scale-from-0 image entries, number-tick stats, a marquee, a header CTA slide-in). Anti-patterns in the CSS/DOM: one `transition: all`, three hover-scale rules, line-height 0.85 on all-caps display, 14 px body, 34 px mobile hit targets.

### Rhythm (from the screenshots — normally the URL-mode blind spot)
- **Section padding rhythm:** varied and intentional — 1047 px hero, ~900 px diptych slides, a cream statement block with the statement floating at mid-height with product renders anchored to it; the page never uses equal-padded stacked sections.
- **Heading-to-body ratio:** declarative — 2–3-line display statements with almost no body beneath them; prose is confined to short captions.
- **Negative space:** generous; the right two-thirds of the cream statement folds are empty by design.
- **Asymmetry:** left-biased hero, right-aligned statements opposite a left photo in the diptychs; mobile collapses to centred.
- **Distinctive treatments:** the "one phrase per line" uppercase rhythm, the outline pill CTA with arrow glyph, the vertical tick progress, the photo-behind-statement footer.

## Corrections to the provisional text-only DNA (`analysis/research/zipline-dna.md`)

| Provisional claim | Observed in browser | Consequence for the build |
|---|---|---|
| Paper is near-black `#000/#0a0a0a` | Paper is warm cream `rgb(247,244,232)`; only media folds are dark | The **dark canvas in our build is user-brief-driven** ("majority black/white/liquid-silver"), not a Zipline trait. Recorded in the stamp as a brief-driven decision. We keep Zipline's *warm* tint (paper hue 40) rather than a cool grey. |
| Display "Inter Tight 500" | fkScreamer 700, heavy condensed uppercase, 0.85 lh | Confirms the lead's Big Shoulders Display 800/900 pick; we use line-height ≥1.0 (gate 55) instead of 0.85. |
| Glass nav with backdrop blur | Opaque pill, no `backdrop-filter`; morphs cream→black | Our N5 keeps a *light* blur (the lead's lock) but the pill is content-sized (~≤720 px) and opaque enough for contrast; no glass-for-decoration. |
| "Hairline rules 1px white 0.12" everywhere | One such rule; used between mobile-menu rows | Hairline token kept at 0.12 alpha but used sparingly (footer meta, facts rows). |
| Motion "lenis + framer-motion, fade-up stagger" | Lenis confirmed; framer-motion unverifiable; **differential parallax on the pinned hero confirmed** | Our plates reproduce the pinned-hero-with-differential-layers pattern using native scroll + CSS scroll-driven animations (no Lenis, no scroll-jacking). |
| Accent: none (white ink only) | Indigo pill accent, ≤5 % desktop | Our accents are photo-derived (orange/red/yellow/sky), also ≤5 % except the hero name (brief-driven). |

## DNA that travels into the build (structure, not dress)

Pinned full-bleed media plate with differential layer motion · one-phrase-per-line heavy condensed uppercase display · left-biased copy column with lede and outline pill CTA at the foot · content-sized floating pill nav that gains an opaque surface on scroll · diptych rhythm alternating media and statement · statement footer over media · generous negative space · hairline rows only where content is tabular. Nothing else from Zipline (no assets, wordmark, copy, indigo, cream, or renders) is reused.
