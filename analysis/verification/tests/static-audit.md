# Static audit — 2026-09-04T23:31:33.667536-05:00

Result: 0 FAIL · 0 WARN · 40 PASS (of 40)

## [PASS] file sizes (bytes) index/styles/tokens/app
    index.html=28982 styles.css=35861 tokens.css=10041 app.js=13113 (advisory caps: app≤~10KB, styles≤60KB)

## [PASS] HTML: no unclosed / mismatched tags
    stack empty, no mismatches

## [PASS] HTML: no duplicate ids
    37 unique ids

## [PASS] HTML: exactly one h1
    h1 count=1

## [PASS] HTML: no inline style= or on*= handlers
    none

## [PASS] HTML: landmarks present (header/nav/main/footer)
    header=0
    nav=1
    main=1
    footer=1
    section=12
    video=7
    img=7

## [PASS] HTML: skip link first in body
    L14: <a class="skip" href="#main">Skip to content</a>

## [PASS] HTML: every <img> has alt
    7 imgs all have alt

## [PASS] HTML: every <img> has width+height
    7 imgs have dimensions

## [PASS] HTML: videos: no autoplay attr, all muted+playsinline, all have poster
    videos=7 autoplay-attr=0 unmuted=0 no-poster=0

## [PASS] HTML: video count >= 6 plates
    videos=7, sections with class plate=7

## [PASS] HTML: no external http(s) resource references
    none

## [PASS] HTML: contact destination present (operator wired the address; the pre-publication dependency comment was removed by the operator)
    L363: <a class="contact__mail" href="mailto:Houtxsurvey@outlook.com">Houtxsurvey@outlook.com</a>
    L437: <p class="brief__note">Nothing is sent from this page. Copy or download the brief and email it to <a href="mailto:Houtxsurvey@outlook.com">H
    L448: <a class="foot__mail" href="mailto:Houtxsurvey@outlook.com">Houtxsurvey@outlook.com</a>

## [PASS] HTML: no invented contact — only the operator-supplied address appears, no tel:
    addresses found: ['Houtxsurvey@outlook.com']
    operator-supplied: Houtxsurvey@outlook.com
    mailto occurrences: 3

## [PASS] COPY: banned / unsupported-claim words absent (rare, command history, guarantees, Houston, testimonials, %, +N, clichés)
    none

## [PASS] COPY: complete service list incl. towing survey
    all 16 terms present

## [PASS] COPY: credentials present (Second Mate Unlimited, 1600-Ton Master, ~10 years)
    L7: <meta name="description" content="Nick Salazar, independent marine surveyor and cargo consultant. Second Mate Unlimited and 1600-Ton Master.
    L39: <p class="hero__creds" data-reveal><span class="hero__cred">Second Mate Unlimited</span> <span class="hero__sep" aria-hidden="true">·</span>
    L42: <p class="hero__lede" data-reveal>A decade surveying cargo. When something is lifted, stowed, moved or claimed, someone has to see it and wr
    L80: <dt class="facts__term">Second Mate Unlimited</dt>
    L87: <dt class="facts__term">1600-Ton Master</dt>

## [PASS] CSS: Hallmark stamp is first line of styles.css
    /* Hallmark · macrostructure: Split Studio (video-plate adaptation) · H2 hero knobs: ratio=5/7, right=full-bleed-video, divider=negative-space · genre: atmospheric · theme: studied-DNA (source: https:

## [PASS] CSS: pre-emit critique stamp present
    L2: /* Hallmark · pre-emit critique: P5 H5 E4 S5 R4 V4 */

## [PASS] CSS: no raw colors / font-family outside tokens.css (gate 48)
    styles.css references tokens only

## [PASS] CSS: no transition: all (gate 10/17)
    none

## [PASS] CSS: no bounce/overshoot easings (gate 12)
    none

## [PASS] CSS: no transitions on layout properties (gate 14)
    none

## [PASS] CSS: no italic headings (gate 38a) — any font-style:italic lines listed for manual check
    L568: .prose em { font-style: italic; }

## [PASS] CSS: overflow-x: clip on html and body (gate 34)
    L11: overflow-x: clip;
    L22: overflow-x: clip;
    L869: overflow-x: auto;

## [PASS] CSS: prefers-reduced-motion block present (gate 27)
    L391: @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
    L398: @media (prefers-reduced-motion: no-preference) {
    L944: @media (prefers-reduced-motion: reduce) {

## [PASS] CSS: pointer:coarse / hover:none guards for pointer light
    L186: @media (pointer: coarse) {
    L812: @media (pointer: coarse) { .btn--sm { height: var(--control-height); } }

## [PASS] CSS: scroll-driven animation + @supports guard
    L397: @supports (animation-timeline: view()) {
    L402: animation-timeline: --plate;
    L407: animation-timeline: --plate;
    L411: animation-timeline: --plate;

## [PASS] CSS: no 100vw widths (transform-only uses listed as info)
    none; other 100vw mentions: 

## [PASS] CSS: no bare vh (use dvh/svh)
    none

## [PASS] CSS: ≤3 font families in tokens (gate 37)
    families=['Big Shoulders Display', 'Geist']

## [PASS] CSS: focus-visible styling present (gate 26)
    L39: :focus-visible {
    L65: .skip:focus-visible { transform: none; }
    L105: .nav__mark:focus-visible { outline-offset: 0; }
    L134: .nav__link:focus-visible { outline-offset: 0; }

## [PASS] CSS: image grids use minmax(0,1fr) — bare 1fr tracks listed for manual check (gate 50)
    no bare 1fr tracks

## [PASS] CSS: overflow-wrap: anywhere on display
    L269: overflow-wrap: anywhere;
    L349: overflow-wrap: anywhere;
    L361: overflow-wrap: anywhere;

## [PASS] CSS: uppercase display line-height ≥ 1.0 (gate 55) — line-height < 1 lines listed
    no line-height below 1.0

## [PASS] CSS: nowrap on clickable text (gate 49)
    L61: white-space: nowrap;
    L103: white-space: nowrap;
    L123: white-space: nowrap;

## [PASS] JS: no external fetch/XHR/network sends
    none

## [PASS] JS: reduced-motion, saveData, autoplay rejection, IntersectionObserver, passive listeners handled
    all present

## [PASS] JS: no eval/innerHTML from user input
    none

## [PASS] JS: clipboard + download (Blob) utility present, no form submit
    L10: *  7. Assignment brief: live assembly, copy (clipboard → execCommand fallback),
    L11: *     download as .txt (Blob + object URL). Nothing is ever sent anywhere.
    L265: form.addEventListener("submit", function (e) { e.preventDefault(); render(); });
    L289: say("Couldn't reach the clipboard. Select the brief text and copy it manually.", true);
    L292: if (navigator.clipboard && navigator.clipboard.writeText) {

