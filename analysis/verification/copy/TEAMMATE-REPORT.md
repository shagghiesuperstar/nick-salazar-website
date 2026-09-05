# narrative-content — teammate report

Role: narrative-content teammate, Agent Team for Nick Salazar's marine-surveyor site. Branch `feat/t_27ed7897`. Owned files: `site/index.html`, `analysis/verification/copy/**`. Nothing else touched; nothing deleted.

## What I did (chronological)
1. Read, in full: INFO (`Nick salazar website info.txt`), STORY (`nicksalazar story for website.md`), RECOVERY.md, prd-nick-salazar-site.md, arch-nick-salazar-site.md, story-2-build.md, BUILD-ORDER-t_27ed7897.md, analysis/research/zipline-dna.md, Hallmark `references/copy.md`, `anti-patterns.md` (Invented metrics, Italic headers, Eyebrow on every section) and slop-test gates 19, 46, 49, 51, 54, 55.
2. Inspected all 14 shipped images (7 photos, 7 posters) visually and measured dimensions with `sips`; probed the 7 videos with `ffprobe` (all 1168x768, ~10 s). Listed the READ-ONLY source folder: 7 HEIC originals, 7 `grok-*.mp4`, 6 `grok-*.jpg`.
3. Sent the markup contract to visual-motion; asked media-preparation for provenance confirmation.
4. Wrote `site/index.html` first complete draft (25 KB): pill nav, hero, 6 video plates, credentials diptych, 14-item services matrix, 6-photo work gallery, why-independent module, non-sending assignment-brief utility, statement footer.
5. Validated: custom `html.parser` walk (no unclosed tags, no mismatched end tags, no duplicate ids, single h1); `rg` proof of no inline styles/handlers; forbidden-word sweep (see copy-audit.md §G).
6. Wrote `word-pairs.md` and `copy-audit.md` v1.

## Commands run (key)
```
sips -g pixelWidth -g pixelHeight site/assets/photos/*.jpg
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of csv=p=0 site/assets/videos/*.mp4
python3 - <<'PY'  # html.parser structural check (unclosed / mismatched / dup ids / h1 count)
rg -n ' on[a-z]+="' site/index.html            # -> none
rg -n "style=|<font|onclick" site/index.html   # -> none
for w in rare unusual command guarantee settle Houston phone @ testimonial 'trusted by' 'years of' % '\+' ...; do rg -n -i -c -- "$w" site/index.html; done
rg -n "[0-9]" site/index.html | rg -v 'assets/|width=|height=|rows='   # only 1600, 2026, plate numbers
tidy -q -e site/index.html   # system tidy is HTML4-only; rejects <header>/<main>/<video>; not usable as an HTML5 validator (noted, not relied on)
```

## Message log
| # | direction | peer | when (session order) | summary |
|---|---|---|---|---|
| 1 | received | team-lead | start | Assignment: own index.html + copy audit; contract with visual-motion; provenance from media-preparation. |
| 2 | sent | visual-motion | after reading sources | Full markup contract (sections/ids/classes, plate structure, brief ids, data-reveal placement) + 6 questions on hooks, lazy-load attrs, tokens.css, nav collapse. |
| 3 | sent | media-preparation | before drafting | Provenance questions: IMG→photo mapping, Grok render chain, poster-02 size, exclusions, brand names to avoid. |
| 4 | sent | visual-motion | after first draft | First complete draft notice with the exact hook inventory as written. |

| 5 | received | visual-motion | after draft | Their binding contract: nav.nav[data-nav] + details menu, section.plate > .plate__frame, video[data-video] + source[data-src], .plate__word--accent/data-accent, section.section/.section__inner, dl.facts, form#brief-form with bf-* ids and .field/.field__help, footer.foot; no numbers beside headings; word ≤10 chars. |
| 6 | received | media-preparation | after draft | Asset table: all 7 videos + posters are Grok re-stagings of the 7 client photos (no audio); photos are unverified originals; list of visible brand marks / container numbers / signage that must not be named; 07-yard.mp4 is an indoor scene; source has 7 videos not 8. |
| 7 | sent | visual-motion | after rebuild | index.html rebuilt on their contract; 12 numbered deltas (module script at end of body, numbered data-plate, hero__lede + plate__meta in hero, "Build a brief" CTA, services list without numbers (gate 54 rationale), creds diptych classes, work grid classes, why classes, added bf-evidence + bf-contact fields, footer outside main, data-reveal counts, 960 posters available). |
| 8 | sent | media-preparation | after rebuild | Confirmed how provenance was applied to captions; no brand/number/signage named; asked to be told of any filename change. |
| 9 | sent | team-lead | after rebuild | Interim summary with paths and unresolved items (see below). |
| 10 | received | media-preparation | after rebuild | Formal provenance answers: IMG→photo mapping (hero←IMG_2736, coils←1449, crane←3768, drums←1185, skid←4422, warehouse←0317, yard←8805, pixel-correlated); all mp4s Grok-generated re-stagings; poster-02 size is an artefact; source has 7 videos; small unidentified people in some frames (do not call them Nick/crew); full list of visible marks not to name; prefer "AI-generated illustration based on a photograph in Nick's files", avoid "footage" alone. |
| 11 | received | media-preparation | after rebuild | Captions accepted; all 28 shipped filenames frozen; -960 posters available for visual-motion. |
| 12 | sent | media-preparation | after caption change | Confirmed the "footage" wording was replaced page-wide with their preferred phrasing. |
| 13 | received | team-lead | after status | Two corrections from the operator's source-integrity spot check: (1) no responsibility/liability/dispute-outcome wording in plate stories, services, why block; (2) license sentences describe the class only and defer scope to the credential's routes/endorsements/limitations; add responsib/liab/who pays/resolve/decide/authori/unrestricted/endorse to the sweep. |
| 14 | sent | visual-motion | after corrections | Copy-only change notice with the seven line numbers; hooks unchanged; deltas ack still pending. |
| 15 | sent | team-lead | after corrections | Exact lines changed, sweep results, audit updated. |
| 16 | received | visual-motion | after corrections | index.html binds cleanly; integrated pass running on their local server; three requests: favicon data link, keep hero caption last, optionally shorten "Stock throughput warehouse inspections"; module script confirmed fine. |
| 17 | sent | visual-motion | after ack | Favicon link added (line 10); hero caption unchanged; service name kept verbatim (complete supplied list is a copy-integrity requirement) — wrap handling left to CSS. |
| 18 | sent | team-lead | final | Final summary: integration acknowledged, favicon line added, all checks green. |
| 19 | received | visual-motion | after final | Integrated pass complete with screenshots at 320–1440 in analysis/verification/hallmark/self-check/; favicon request (already done); plate captions run 3–4 lines at 375 px, suggested shortening; brief copy/download works with "Copied. Nothing was sent." |
| 20 | sent | visual-motion + media-preparation | after caption tightening | Captions shortened to "<scene> · AI-generated, based on a photograph in Nick's files" (≤ 85 chars); semantics unchanged. |
| 21 | received | visual-motion | after tightening | Explicit ack of all 12 deltas (bound and styled, no renames); one request: sky accent not present in footage per media-preparation and lead ruling — retag plate-containers "Secure." to red and plate-warehouse "Protect." to default orange. |
| 22 | sent | visual-motion | after retag | Retagged both spans; no other change; word-pairs.md accent table updated. |

## Rebuild after peer replies
- index.html rebuilt (28.9 KB) on visual-motion's binding contract; validated again (`check-copy.py` exit 0: no unclosed/mismatched tags, no duplicate ids, single h1, no heading-level jumps, no inline styles/handlers, all hard forbidden terms 0).
- Provenance from media-preparation applied: every video plate captioned as an AI re-staging of a photograph from Nick's files; gallery captions literal, "From Nick's files", no brand / container number / signage / person / location / job named.
- Deviations from the lead's literal markup sketch, all agreed with visual-motion by message: `<nav class="nav">` is the pill (no `<header>` wrapper); brief ids are `bf-*` / `#brief-form` / `#brief-output` / `#brief-copy` / `#brief-download` / `#brief-status` (visual-motion's app.js binds to these); footer classes `foot`/`foot__line`/`foot__meta`; services list has no numbers.
- Caption wording changed on media-preparation's caveat: every video plate now reads "<scene> · AI-generated illustration based on a photograph from Nick's files" (the word "footage" no longer appears on the page); photo-crane alt says "a person in a hard hat", never Nick or crew.
- `check-copy.py` reports 12 quoted phrases in the audit "not found verbatim" — all are quotes of INFO/RECOVERY text or the title with `&amp;`, not page copy; expected.

## Team-lead corrections (source-integrity spot check)
Lines changed in site/index.html: 64 (plate 02 ending → "so the condition at each hand-over is on record"), 81 and 88 (license class sentences, scope deferred to the credential), 89 (master's-license "why" as frame of reference only), 152 unchanged, 156 (cargo claim line → "as observed on attendance and recorded for the claim file"), 306 (plate 06 opening → "Packing problems show up long after the crate is closed…"), 343 (why block → "worth relying on by everyone who has to read it"). Sweep terms added to check-copy.py (hard: responsib, liab, who pays, resolve, decide, authori, unrestricted, dispute, blame; soft: endorse). Result: all hard terms 0; "endorse" appears only as "endorsements and limitations" on lines 81 and 88 (team-lead's own wording). copy-audit.md rows and checklist updated; 8 rows renumbered by script.

## Final state
- visual-motion acknowledged the contract (message 16): no hook changes needed. Favicon `<link rel="icon" href="data:,">` added at line 10 to silence the only console error (no network request). Copy-correction line numbers shifted by +1 accordingly (65, 82, 89, 90, 157, 307, 344).
- Declined request: shortening "Stock throughput warehouse inspections". RECOVERY requires the complete supplied service list; the name stays verbatim and narrow-width wrapping is a CSS concern (visual-motion may reduce the services name size or letter-spacing at ≤414 px).

## Caption tightening (visual-motion request 3, second message)
Plate captions shortened from ~100 to ≤ 85 characters: scene phrase compressed (e.g. "Steel coils, covered store") and provenance tail changed to "AI-generated, based on a photograph in Nick's files". "Based on" keeps media-preparation's attestation limit; "AI-generated" is retained so the tail cannot read as camera footage. Footer sentence unchanged (full form).

## Accent retag (visual-motion, lead ruling)
`data-accent="sky"` removed from the page: plate-containers "Secure." → `data-accent="red"`; plate-warehouse "Protect." → no data-accent (default orange). Accents now use only the orange/red/yellow tokens media-preparation measured in the clips.

## Unresolved items (project-level, not mine to close)
- No contact destination supplied (pre-publication dependency comment at `#contact`).
- Credentials remain client-supplied and unverified; the page says so.
- Contact destination not supplied (pre-publication dependency; HTML comment present at `#contact`).
- `tidy` on this Mac is HTML4-only; HTML5 validation is by the custom parser check only. If the lead has `html5validator`/`vnu` available, run it on `site/index.html`.
