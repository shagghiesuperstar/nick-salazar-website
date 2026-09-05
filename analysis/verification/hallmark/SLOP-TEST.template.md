# Hallmark slop test — 58 gates (template generated from installed references/slop-test.md, v1.1.0, commit d5f2606…)

Each answer must be NO for PASS. Result column filled by the lead after reading styles.css/tokens.css/app.js/index.html and the browser evidence.

| gate | question (abridged from source) | result | evidence |
|---|---|---|---|
| 1 | Is the display font Inter, Roboto, Open Sans, Poppins, Lato, or a system default? | | |
| 2 | Is there a purple-to-blue (or cyan-to-magenta) gradient anywhere — including a `background-clip: text` gradient headline? *Genre note: atmospheric allows radial… | | |
| 3 | Is there a 3-equal-column card grid with icon-above-heading tiles? | | |
| 4 | Is any card nested inside another card? | | |
| 5 | Is any card using a thick coloured left/right side-stripe border? | | |
| 6 | Hero shape — centred-everything. Is the hero `min-height: 100vh` with everything centred, OR are the eyebrow, title, lede, AND CTA all stacked on the same centr… | | |
| 7 | Is pure `#000` or pure `#fff` used as a base colour anywhere? *Genre note: modern-minimal allows pure `#fff` paper (the Stripe / ElevenLabs school).* | | |
| 8 | Does the page reuse a structure it shouldn't — either the generic AI template (Hero → 3 features → CTA → footer), or the *same* structural fingerprint / macrost… | | |
| 9 | Are sections separated only by equal whitespace, with no rule, no ornament, no colour shift — every section identical in rhythm? | | |
| 10 | Is `transition-all` (or `transition: all`) used anywhere? (Specify the properties.) | | |
| 11 | Is `hover:scale-105` (or any uniform hover-scale) applied across multiple unrelated elements? | | |
| 12 | Are bouncy / overshoot easings (`cubic-bezier(0.34, 1.56, ...)`, etc.) used on UI state changes — buttons, modals, tooltips? (Reserve overshoots for physical in… | | |
| 13 | Does any element have *more than one* hover effect at the same time (translate + scale + shadow + colour + rotate)? | | |
| 14 | Are you animating `width`, `height`, `top`, `left`, `margin`, or `padding` anywhere? | | |
| 15 | Does the focus ring transition into existence (fade in)? (Focus rings must appear instantly — keyboard users need an immediate indicator.) | | |
| 16 | Is there a celebratory success toast for an action whose effect the user can already see? (Silent success is taste; toasts are for failures and invisible effect… | | |
| 17 | Are tooltip hover-delay and focus-delay equal? (Hover should delay 800–1000 ms; focus should be 0 ms.) | | |
| 18 | Is auto-rotating content (carousel, banner, stats) lacking pause-on-hover-and-focus? (WCAG 2.2.2.) | | |
| 19 | Is there a placeholder name "Jane Doe / John Smith" or a startup cliché (Acme, Nexus, Seamless, Unleash)? | | |
| 20 | Is the `/* Hallmark · macrostructure: <name> · ... */` stamp missing from the top of the CSS? (It must be present.) | | |
| 21 | Did I default to the Specimen macrostructure (numbered left-margin labels + huge serif + asymmetric spans + typographic-only CTA) when the brief did not explici… | | |
| 22 | Does any neutral / surface colour have `oklch(... 0 ...)` (zero chroma)? Pure greys read as flat. Tint every neutral toward the anchor hue — minimum 0.005 chrom… | | |
| 23 | Does the accent colour cover more than ~5 % of any single viewport (count by area: solid fills, large headings in accent, full-bleed accent backgrounds)? If yes… | | |
| 24 | Is any padding / gap / margin a value that isn't on the named spacing scale (`--space-3xs` … `--space-5xl`, multiples of 4 px)? Arbitrary `padding: 17px` is a t… | | |
| 25 | Is any prose container's `max-width` outside the 45–75 ch range? Measure must read; under 45 ch is choppy, over 75 ch loses the eye. | | |
| 26 | Does any interactive element lack `:focus-visible`, `:active`, OR `:disabled` styling? (Eight states is the rule. Default + hover is two; you need at least defa… | | |
| 27 | Is there any `transform` / `animation` keyframe that is NOT covered by a `@media (prefers-reduced-motion: reduce)` fallback? Every motion gets a reduced-motion … | | |
| 28 | If the page has a demo video, does it autoplay with sound, lack a `poster`, lack `fetchpriority="high"`, or use `loading="lazy"` on the LCP element? (LCP-killer… | | |
| 29 | If the page has an abstract background, is it more than one accent colour, more than ~5 % footprint, or animating mesh-gradient on the whole page? (Aurora blobs… | | |
| 30 | Icon tells. Does the page (a) mix two or more icon libraries (Material + Heroicons + Lucide on the same page), OR (b) use an emoji glyph (✨ 🚀 ⚡ 🔥 🎯 ✅) as a feat… | | |
| 31 | If the page has illustration, did I default to a Lottie library when a hand-built SVG or pure-CSS shape would have worked? (Lottie is last resort, not the defau… | | |
| 32 | If I used the same archetype as a previous Hallmark output (per `.hallmark/log.json` or the latest macrostructure stamp), did I pick at least one different *var… | | |
| 33 | Does any visual-only `<svg>`, custom-art `<div>`, `<canvas>`, or decorative figure lack `aria-label` or `aria-hidden="true"`? Hand-built CSS art and SVG illustr… | | |
| 34 | Does the page horizontally scroll on any viewport between 320 px and 1920 px? Open the rendered page; drag the dev-tools width slider across that range. If a ho… | | |
| 35 | For every decorative effect on text — highlighter `<mark>` / `<em>` band / accent stroke / underline — did I visually confirm the position and size? A highlight… | | |
| 36 | Are interactive bars (nav, toolbar, command bar, hero CTA row, footer link strip) explicitly vertically centered? Default flex layouts inherit `align-items: str… | | |
| 37 | Does the page use more than three distinct `font-family` families? Count: `--font-display`, `--font-body`, and at most one outlier (`--font-outlier` for wordmar… | | |
| 38 | Is the outlier face used in more than two slots on the page? The outlier is a register, not a third surface — wordmark + hero stat is the canonical pair, or wor… | | |
| 38a | Is any heading or display type italic (`font-style: italic` on `h1`–`h6`, a `.*__title`, `.hero__title`, a wordmark, a stat figure, a footer statement, or an `<… | | |
| 39 | Do input / textarea / select fields handle every state correctly? Fail on any of these five: - Border-width shifts between states — default / hover / focus / er… | | |
| 40 | Contrast thresholds. Does any text, icon, or `:focus-visible` ring fail its threshold against its *computed* background? Pair every `color` declaration with its… | | |
| 41 | The contrast failures that ship most often. Fail on any: - Button text ≈ button fill — if the computed text colour and fill are within 5 % lightness AND 0.05 ch… | | |
| 42 | Nav fingerprint. Is the page's `<nav>` (or top-of-page `<header>` with role="banner") the AI default — wordmark-left + 4–5 inline text links centred-or-right + … | | |
| 43 | Footer fingerprint. Is the `<footer>` the AI default — 4 columns of links (Product / Company / Resources / Legal) + social-icon row + tiny copyright at the very… | | |
| 44 | Hero fit — sits into the page and fits the fold. Two checks, both on the rendered hero: (a) Is `padding-block-end` ≥ 1.3× `padding-block-start`? Symmetric or to… | | |
| 45 | Decorative-without-purpose. Does the hero contain a decorative element (cursor, scanline, gradient blob, abstract shape, ornament, badge, sticker) that has no s… | | |
| 46 | Invented metric. Does the page contain any quantitative claim — "10× faster", "saves 5 hours per week", "trusted by 50,000+ teams", "99.9 % uptime", "+47 % conv… | | |
| 47 | Re-drawn chrome. Did Hallmark hand-build a fake browser bar (URL pill + traffic-light dots), a fake phone frame (rounded rectangle + notch + speaker slit), a fa… | | |
| 48 | Mid-render token improvisation. Did Hallmark introduce any colour value (`#hex`, `oklch(...)`, `rgb(...)`, `hsl(...)`) or `font-family` declaration *outside* th… | | |
| 49 | Two-line clickable text. Does any button label, primary nav link, footer link, tab label, breadcrumb, or CTA text wrap to two or more lines at any viewport betw… | | |
| 50 | Image-bearing grid track without `minmax(0, 1fr)`. Does any `grid-template-columns` (or `grid-template-rows`) containing a `1fr` track render an `<img>` / `<pic… | | |
| 51 | Display headers without long-word wrap. Does any element rendering display-size text (`h1`, `.hero__display`, `.section__title`, `.skill-row__title`, hero-equiv… | | |
| 52 | Per-theme section-head override without mobile collapse. When a theme or variant overrides `.section__head { grid-template-columns: ... }` to anything other tha… | | |
| 53 | CSS-only radio tab pattern that scroll-jumps. When implementing tab toggles via `<input type="radio">` siblings + `:checked` selectors, does the artifact either… | | |
| 54 | Section eyebrow / tag beside the heading (tag-left, header-right). Does any section render an eyebrow / number / mono-cap label (`01 · THE TOUR`, `02 / FEATURES… | | |
| 55 | All-caps display heads with line-height < 1.0 → cap-collision on wrap. Does any display-size element (`.hero__display`, `.section__title`, `h1`, `h2`, or anythi… | | |
| 56 | Sticky element at `top: 0` below a sticky page-level nav → bleed. Does the artifact declare `position: sticky; top: 0;` on any element OTHER than the page's top… | | |
| 57 | Studied DNA discarded for a catalog theme. Did a `study` diagnosis emit earlier in the conversation, AND does the build's CSS stamp's `theme:` field name a cata… | | |
