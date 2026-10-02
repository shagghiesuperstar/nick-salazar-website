# nicksalazar.net — operator edits + polish pass · 2026-10-02

**Status: LIVE on nicksalazar.net. GitHub push NOT done (blocked on identity, see below).**

| item | value |
|---|---|
| Site commit (deployed) | `e37a521` "Operator edits + premium polish pass" (on top of baseline `4571de0` = the previously-live working copy) |
| Local `main` | fast-forwarded to the site commit, then this RESULT commit on top |
| `origin/main` (`git ls-remote origin main`) | `1aee917148f3d6f7651fdf4fd4706218321d2168`, **unchanged** (push blocked) |
| Cloudflare deployment | https://52495ea7.nicksalazar.pages.dev (project `nicksalazar`, branch `main`, from repo root, Functions bundle uploaded) |
| Rollback | redeploy `~/.hermes/backups/nick-salazar-live-20261002/site`, or `git checkout 4571de0 -- site` and deploy |

## Blocked: GitHub push identity
`gh auth switch --user shagghiesuperstar` → "no accounts matched that criteria". `gh` holds only LAMBODOG (both `GH_TOKEN` env and keyring). Git's https credential helper for github.com is `gh auth git-credential`, so a push would go out as LAMBODOG. The SSH key is rejected by GitHub (`Permission denied (publickey)`). The order says this repo pushes as shagghiesuperstar, not LAMBODOG, so nothing was pushed.
To finish: `gh auth login` as shagghiesuperstar (or unset GH_TOKEN and log in), then `git push origin main` (fast-forward from `1aee917`; no force needed).

## DONE-means evidence
1. **Banned terms.** `grep -rniE "EIMC|AI-generated|\bAI\b.*(generat|render|illustrat)|illustration" site/` returns **0** (also 0 with `-I` and with `grok` added). Live `https://nicksalazar.net/` HTML returns **0**; live `/llms.txt` returns **0**. The rendered DOM check (visible text, every `alt`, every `meta content`, JSON-LD) against `/EIMC|AI-generated|\bAI\b|generated|illustration|rendering/i` found 0 hits locally and live. robots.txt line-1 comment "AI/AEO crawlers" was reworded; user-agent names are untouched.
   - Internal provenance docs that were publicly served from `site/` (README.md, assets/MANIFEST.md, DISPATCH-PROOF.json, .hallmark/) moved to `docs/`. They now 404 on the live domain. Provenance is preserved in the repo. `docs/site-README.md` records the operator order as superseding the old "caption as AI" rule.
2. **Content live.** `Nick is a non-biased, independent surveyor: engaged by one party, answerable only to the facts. That independence is what makes a survey report worth relying on by everyone who has to read it.` sits inside the *No side to take* article (`site/index.html:399`). `<p>A decade surveying cargo.</p>` (`:146`). Hero plate caption: "Heavy unit on a spreader beam, ship's crane" (`:93`). Footer: "Credentials as supplied by Nick Salazar." (`:518`).
3. **Polish shipped.** Details below. `app.js` = **14,653 B** (was 15,288; under 18 KB).
4. **Main.** See the table and the blocked note above.
5. **Live bytes.** Fetched with `Accept-Encoding: identity`, compared with `cmp` against `git show HEAD:site/…`:

| URL | HTTP | live bytes | committed | cmp |
|---|---|---|---|---|
| / | 200 | 33708 | 33708 | identical |
| /styles.css | 200 | 40694 | 40694 | identical |
| /app.js | 200 | 14653 | 14653 | identical |
| /tokens.css | 200 | 10433 | 10433 | identical |
| /llms.txt | 200 | 752 | 752 | identical |
| /robots.txt | 200 | 610 | 610 | identical |
| /styles.css?v=20261002 · /app.js?v=… · /tokens.css?v=… | 200 | same sizes | | |
| /api/contact OPTIONS | 405 | function routed (it only exports `onRequestPost`; `functions/` unchanged since 7d950bb) | | |
| /api/contact POST `{}` | 400 | validation reject, no email sent | | |
| /api/contact GET | 404 | no GET handler, by design | | |
| /README.md, /assets/MANIFEST.md, /DISPATCH-PROOF.json, /.hallmark/log.json | 404 | | | |

## Polish techniques (file:line)
Tokens are on one easing curve (`--ease-out`) and one duration scale. `--dur-slow: 900ms` was added at `tokens.css:168`.
- **Poster→video crossfade, no pop.** An `<img class="plate__poster">` overlays each video (`index.html:84,105,167,257,327,351,375`). It fades out on the clip's first `playing` event (`app.js:58`, `styles.css:269-275`). When the clip is static, has saveData on, or reduced motion is set, the still simply stays.
- **Reading-progress hairline.** 2px, accent colour, pure CSS `animation-timeline: scroll(root)`, no JS. Absent where unsupported and under reduced motion (`styles.css:55-73`).
- **Nav condenses on scroll.** Deeper surface, firmer edge, layered soft shadow (`styles.css:123`, `app.js:180,183`, `tokens.css:86,195`). The existing hide-on-scroll-down retract is kept.
- **Section-title accent rule.** A short 2px accent rule draws in left to right, once, with the reveal (`styles.css:594-607`; titles joined `data-reveal`).
- **Reveals retuned.** Slower and short-travel: 10px over 900ms on the expo-out curve (`styles.css:556-557`).
- **Gallery hover.** Clipped frame and slow scale of 1.025, plus a caption tint (`index.html:282-312`, `styles.css:732-737`, `tokens.css:185`).
- **Contact email underline** draws in on hover and focus (`styles.css:802-805`). Inline links get a resting hairline underline that turns accent on hover (`styles.css:918`).
- **Squared controls.** Pill buttons, nav and links became 4px/8px radii (`styles.css:84,134,157,194,831,…`).
- **Press state** `translateY(1px) scale(.99)` (`styles.css:857`). The input focus ring eases in (`:947`).
- **Typography.** `text-wrap: pretty` on running text (`:40`) and `balance` on headings (`:422,590,673,783,1020`). Lining figures in all-caps contexts, e.g. "1600-TON" (`:42`). Also `font-optical-sizing`, kerning and `hanging-punctuation` (`:22-26`).
- **Feathered copy backplate.** The plate copy backplate fades in over the nav band. This removes a hard horizontal edge across the top of the hero, which was also present on the previous live site (`styles.css:307-308`). Copy starts below that band, so contrast under the text is unchanged.
- **Removed: cursor-follow hero light** (div, CSS, JS block, `--light-*`/`--color-light`/`--z-light` tokens). It amounted to a cursor-follower blob, which the ban list excludes.
- **Cache-bust.** `styles.css?v=20261002`, `app.js?v=20261002`, and `@import tokens.css?v=20261002`. `_headers` serves all three `immutable` for 7 days, so returning visitors would otherwise have mixed new HTML with stale CSS.
- **Pre-existing, not counted as new:** smooth anchor scroll with scroll-margin offset, `::selection`, focus-visible ring, reveal stagger, offscreen video pause and lazy src attach, plate parallax/vignette.

## Browser verification (real Chrome via Playwright, `uplift_check.mjs`)
- Local (`shots-local/`): **20/20 PASS**.
- Live (`shots-live/`): **19/20**. The single non-pass is 3 `requestfailed net::ERR_ABORTED` on plate MP4s (06/07). That is Chrome cancelling in-flight media range requests when the test scrolls past a plate in about 120ms steps and the existing pause-offscreen logic pauses it. Python's local server serves no ranges, so it does not appear there. **0 console errors, 0 warnings, 0 page errors, 0 HTTP ≥400** in every context.
- What the checks cover:
  - the hero clip plays and the poster fades to 0
  - the nav condenses
  - the progress bar exists and is full at page end
  - all 34 reveals fire and all 5 title rules are drawn
  - no horizontal overflow at 390 or 1440
  - CLS of 0 / 0.0002 locally and 0 / 0.018 live
  - Tab reaches a visible skip link with a solid focus ring
  - reduced motion: video static and paused, poster at opacity 1, no progress bar, no plate animation or transform, no reveal travel (opacity 150ms only), `scroll-behavior: auto`, gallery transitions at 0s
- Screenshots reviewed by eye: 390px and 1440px for the hero, coils plate, credentials, services, work, why, contact and footer, plus full-page and reduced-motion shots. No layout breaks, every plate caption is descriptive only, and controls are squared.

## Found
- `site/` had publicly served internal docs that stated the plates were AI-generated (README, MANIFEST) and agent metadata (DISPATCH-PROOF.json, .hallmark). These were moved; see item 1.
- styles.css, app.js and tokens.css were served `immutable` with no version, so any CSS change would have reached returning visitors only after up to 7 days, mixed with new HTML. Now versioned. **Bump `?v=` on every future change to these files.**
- The hard edge at the top of the hero (veil start) was a pre-existing visual defect on the old live site. Fixed.
- The "Send to Nick" button posts to the mail worker (`nicksalazar-mail.shagghie2.workers.dev`), not `/api/contact`. `/api/contact` remains deployed but unused by the page. Both were untouched.
