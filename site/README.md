# Nick Salazar — independent marine surveyor & cargo consultant (static site)

Status: **local preview build, not published.** Branch `feat/t_27ed7897`. Built by a Claude Code Agent Team (lead + 3 teammates, all claude-fable-5-1, effort high); evidence in `../analysis/verification/`.

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
| `index.html` | the whole page: floating pill nav → hero (name + credentials over video) → 6 further video plates with word pairs and story blocks → credentials → services (complete supplied list) → gallery of Nick's photos → why-independent → assignment-brief utility → footer |
| `styles.css`, `tokens.css` | Hallmark studied-DNA build (stamp on line 1 of styles.css); every colour/font is a token in `tokens.css` |
| `app.js` | video play/pause in view, lazy source attach, scroll-progress fallback for browsers without CSS scroll-driven animations, reveal stagger, hero pointer light (off for reduced-motion / touch), nav current-section, assignment-brief copy/download. No network calls. |
| `fonts/` | self-hosted Big Shoulders Display + Geist (SIL OFL 1.1, see `fonts/LICENSES.md`); no runtime requests leave the origin (the favicon is an inline `data:` URI) |
| `assets/videos/`, `assets/photos/` | 7 AI-generated (Grok) clips + posters; 7 client-supplied photos (resized from HEIC originals). Provenance: `assets/MANIFEST.md` and `../analysis/verification/media/reconciliation.md` |

Also present: `.hallmark/log.json` (Hallmark project memory) and `DISPATCH-PROOF.json` (left from the earlier stopped run; not part of the page). Everything is relative-path; the `site/` folder can be dropped onto any static host as-is once the pre-publication items below are done.

## Before publishing (dependencies recorded, not resolved here)

1. **Contact destination.** No phone, email, or address was supplied, so none was invented. The Contact section is an honest local utility: it assembles a plain-text assignment brief the reader copies or downloads and sends through their own channel; it states that nothing is sent. Wire a real destination (or add the real phone/email) at the `<!-- PRE-PUBLICATION DEPENDENCY -->` comment in `index.html`.
2. **Remove `<meta name="robots" content="noindex">`** in `index.html` when the site goes live.
3. **Credentials are client-supplied and unverified** (the page says so). Confirm with Nick before removing the note.
4. **Video plates are AI-generated illustrative footage** and are captioned as such; gallery photographs are from Nick's files. Do not re-caption plates as documentary.
5. Independent external review (the redcell phase, criterion Q) has not run on this build.

## Editing copy

Text lives only in `index.html`. Facts are audited against the two source files in `../analysis/verification/copy/copy-audit.md`; keep new claims traceable to something Nick supplied.

## Evidence manifest

See `../analysis/verification/BUILD-HANDOFF.md` (summary), `../analysis/verification/HASHES.sha256` (immutable hash manifest of the shipped site and evidence), and the sub-folders `engine/` (team runtime evidence), `media/`, `copy/`, `hallmark/`, `browser/` (screenshots at 320/375/414/768/1440 + scroll capture), `tests/` (self-check scripts and raw logs).
