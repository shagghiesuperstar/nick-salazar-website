# A–Q original criteria → controlling overrides → evidence (evidence paths final; verdicts in browser/RESULTS.md from the final run)

Controlling order: RECOVERY.md > BUILD-ORDER > original story-2-build.md A–Q. "Override" notes where RECOVERY changed the original clause.

| # | Original criterion (story-2-build.md) | Controlling override (RECOVERY.md / BUILD-ORDER) | Implementation | Evidence (paths) |
|---|---|---|---|---|
| A | "Most fantastic, exceptional website" (awwwards-tier) | Q external review pending; lead evidences design decisions + screenshots | Hallmark studied-DNA build, Big Shoulders Display + Geist, video plates | `analysis/verification/browser/w1440/*.png`, `scroll-capture-1440.mp4` |
| B | Elegant/professional/serious/design-forward, no slop tells | unchanged | Slop matrix 58 gates | `analysis/verification/hallmark/SLOP-TEST.md`, `PRE-EMIT.md` |
| C | Hallmark skill copying zipline.com DNA | Apply actual installed Hallmark + real browser Zipline study; no copying assets/copy/brand | studied-DNA stamp in styles.css; real screenshots | `analysis/verification/hallmark/zipline-study/STUDY.md` + png |
| D | Compelling/confident/hyper-modern/dynamic/interactive/bold | unchanged | plates, motion, brief utility | browser screenshots + RESULTS.md |
| E | Parallax as you scroll, movies play, big bold industrial font with strong word pairs per video | ≥6 plates; user intent overrides Hallmark "no parallax" | 7 plates (`data-plate` 01–07), word pairs in `copy/word-pairs.md`; CSS scroll-driven animation + JS fallback | `tests/static-audit.md`, `browser/RESULTS.md` (fallback check), `hallmark/motion-notes.md` |
| F | Overlay block of detailed storytelling per plate | unchanged; source-grounded, no invented facts | `.plate__story` per plate | `analysis/verification/copy/copy-audit.md` |
| G | Video darkens under shader as words brighten to white with scroll; legible at every intermediate state | RECOVERY: readable at EVERY intermediate state, measured through the transition | shade opacity ramp + text colour ramp + guaranteed backplate | `browser/contrast-samples.json`, `browser/RESULTS.md` contrast rows at p12/p50/p85 |
| H | Same primary colours from the photos for large titles and Nick's name | unchanged | name in signal-orange | `media/palette-confirmation.md`, tokens.css |
| I | Name largest/boldest; certs beside it in a different primary colour; (original said name in WHITE) | RECOVERY: name in photo-derived accent (orange), credentials DIFFERENT photo-derived accent → yellow (sky-blue not evidenced in footage) | h1 signal-orange; credentials signal-yellow (`--color-accent-2`), signal-sky retired as unevidenced (tokens.css comment) | `media/palette-confirmation.md` (§ credentials accent), browser "name is largest type" checks at 5 widths |
| J | All colours pulled from the videos | confirm against actual frames | measured medians documented | `media/palette.json`, `media/palette-confirmation.md` |
| K | Storytelling infinite scroll parallax | RECOVERY: continuous FINITE storytelling, reachable conclusion, no scroll trap | finite page, footer + contact reachable | browser "page is finite" checks |
| L | Majority black/white/liquid-silver; colour only for key words | unchanged (accent < ~5% except hero name, brief-driven) | tokens, sparse accents | slop gate 23 in SLOP-TEST.md; screenshots |
| M | Industrial, clean, colour pop, studio not SaaS | unchanged | heavy condensed display, hairlines, pill nav | screenshots |
| N | Depth (foreground/background) tied to parallax | RECOVERY: REAL differential layer motion, not z-index alone | media/shade/copy layers move at different rates | `hallmark/motion-notes.md`, fallback check values (`mediaTransform` at 3 scroll positions) |
| O | Single clean navigation pills at top | native accessible nav pills | N5 floating pill nav, keyboard-operable | browser keyboard/nav checks, `focus-skip-link.png`, `nav-after-clicks.png` |
| P | Very subtle mouse lighting | disabled on coarse pointer / reduced motion | hero pointer light, guards | static audit (pointer guards), reduced-motion check |
| Q | AR method / likely-client review | External independent review (redcell) is a SEPARATE phase — pending, not done in this team | — | recorded as pending in BUILD-HANDOFF.md |

Six build DONE-MEANS (RECOVERY) → evidence:
1. Fable 5.1 High interactive lead + communicating teammates → `engine/ENGINE-EVIDENCE.md`, `engine/captures/*`, `engine/snapshots/*`
2. Functional local site, real HTTP, manifest reconciled, self-checks with logs, originals preserved → `tests/http-check.log`, `tests/static-audit.md`, `tests/run-*.log`, `media/reconciliation.md`, `media/originals.sha256` vs `originals-after.sha256`, `site/assets/MANIFEST.md`
3. A–Q implemented + real desktop/mobile screenshots + scroll capture → this table, `browser/w*/`, `browser/scroll-capture-1440.mp4`
4. Hallmark from installed source (v1.1.0, commit d5f2606…), real Zipline study, slop checklist, copy audit → `hallmark/*`, `copy/copy-audit.md`
5. Accessibility/motion/performance/interaction cases exercised; failures resolved or marked → `browser/RESULTS.md`
6. README with exact local steps, verified preview URL, evidence manifest; immutable hash manifest; no publish/send/fabricated contact → `site/README.md`, `HASHES.sha256`, `BUILD-HANDOFF.md`
