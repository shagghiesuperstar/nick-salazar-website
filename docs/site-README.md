# Nick Salazar — independent marine surveyor & cargo consultant (static site)

Status: **live on Cloudflare Pages (nicksalazar.net) from the `main` branch.** Originally built on branch `feat/t_27ed7897`. Built by a Claude Code Agent Team (lead + 3 teammates, all claude-fable-5-1, effort high); evidence in `../analysis/verification/`.

## View it locally (exact steps)

The page is plain HTML/CSS/JS with no build step. Videos and the assignment-brief utility need an HTTP origin (not `file://`), so run a loopback-only server:

```sh
cd /Users/scottscheferman/nick-salazar-website/site
python3 -m http.server 8123 --bind 127.0.0.1
```

Then open **http://127.0.0.1:8123/** in Chrome, Safari, or Firefox. Stop the server with Ctrl-C. `--bind 127.0.0.1` keeps it on the loopback interface only; nothing is exposed to the network.

Verified during the build on the lead's loopback server at **http://127.0.0.1:8124/**: `curl -sI` returned `HTTP/1.0 200 OK` and every referenced asset returned 200 (raw response head and per-asset table in `../analysis/verification/tests/http-check.log`). Use any free port; 8123 is the documented default, 8124 was used for the recorded verification because the build orchestrator's own 8123 server stopped answering mid-build.

## What is in here

| path | purpose |
|---|---|
| `index.html` | the whole page: floating pill nav → hero (name + credentials over video) → 6 further video plates with word pairs and story blocks → credentials → services (complete supplied list) → gallery of Nick's photos → why-independent → request a survey (email link, request form with Send / Copy / Download, what-to-include aside) → footer |
| `styles.css`, `tokens.css` | Hallmark studied-DNA build (stamp on line 1 of styles.css); every colour/font is a token in `tokens.css` |
| `app.js` | video play/pause in view, lazy source attach, scroll-progress fallback for browsers without CSS scroll-driven animations, reveal stagger, nav current-section + retract on scroll-down, survey-request message assembly with copy/download (local) and **Send to Nick** (the page's only network call: a POST to the Cloudflare Email Worker in `../src/mail-worker.js`, which mails `Houtxsurvey@outlook.com`). |
| `fonts/` | self-hosted Big Shoulders Display + Geist (SIL OFL 1.1, see `fonts/LICENSES.md`); no runtime requests leave the origin (the favicon is an inline `data:` URI) |
| `assets/videos/`, `assets/photos/` | 7 AI-generated (Grok) clips + posters; 7 client-supplied photos (resized from HEIC originals). Provenance: `docs/media-MANIFEST.md` (moved out of `site/` 2026-10-02 so it is not publicly served) and `../analysis/verification/media/reconciliation.md` |

Moved to `docs/` on 2026-10-02 (not publicly served): this README, `media-MANIFEST.md`, `.hallmark/log.json` (Hallmark project memory) and `DISPATCH-PROOF.json`. Everything is relative-path; the `site/` folder can be dropped onto any static host as-is once the pre-publication items below are done.

## Before publishing (dependencies recorded, not resolved here)

1. **Contact.** The Request-a-survey section and footer link to `Houtxsurvey@outlook.com`; **Send to Nick** posts the assembled message to the Email Worker (`../mail-worker.toml`, deployed separately with `npx wrangler deploy -c mail-worker.toml`). Copy and Download stay on the visitor's device. Confirm the mailbox with Nick; a `@nicksalazar.net` address would read stronger to B2B buyers.
2. **Remove `<meta name="robots" content="noindex">`** in `index.html` when the site goes live.
3. **Credentials are client-supplied and unverified** (the page says so). Confirm with Nick before removing the note.
4. **Video plates are AI-generated illustrative footage** (provenance: `media-MANIFEST.md`); gallery photographs are from Nick's files. **Superseded 2026-10-02 by operator order:** the on-page "AI-generated" plate labels and footer sentence were removed; plate captions are now descriptive only (e.g. "Steel coils, covered store"). Do not reinstate the labels without a new operator order, and never caption a plate as "From Nick's files" (that phrase is reserved for the gallery photographs, which are real).
5. Independent external review (the redcell phase, criterion Q) has not run on this build.

## Deploying (Cloudflare)

- **Site:** Cloudflare Pages project `nicksalazar` (`../wrangler.toml`, `pages_build_output_dir = "site"`, plus the Pages Function `../functions/api/contact.js`). If the project is connected to the GitHub repo, every push to `main` builds and deploys production automatically and every other branch gets a preview URL; if it was set up by direct upload, deploy with `npx wrangler pages deploy site --project-name nicksalazar` after merging.
- **Mail worker:** separate Worker `nicksalazar-mail` (`../mail-worker.toml`, `../src/mail-worker.js`); redeploy only when that file changes: `npx wrangler deploy -c mail-worker.toml`.

## Editing copy

Text lives only in `index.html`. Facts are audited against the two source files in `../analysis/verification/copy/copy-audit.md`; keep new claims traceable to something Nick supplied.

## Evidence manifest

See `../analysis/verification/BUILD-HANDOFF.md` (summary), `../analysis/verification/HASHES.sha256` (immutable hash manifest of the shipped site and evidence), and the sub-folders `engine/` (team runtime evidence), `media/`, `copy/`, `hallmark/`, `browser/` (screenshots at 320/375/414/768/1440 + scroll capture), `tests/` (self-check scripts and raw logs).
