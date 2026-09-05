# File plan — t_27ed7897 (written BEFORE any edits; no deletions anywhere)

Lead: team-lead (this session, claude-fable-5-1, effort high). Branch feat/t_27ed7897.
Source `/Users/scottscheferman/Nick Salazar Website/` is READ ONLY. Existing files in site/ and analysis/ are preserved; nothing is deleted or moved.

## Disjoint ownership

| Owner | Creates / modifies | Never touches |
|---|---|---|
| media-preparation | `site/assets/**` (may ADD files; existing 7 mp4 + 14 jpg are kept byte-identical unless a re-encode is justified and the prior file is kept), `site/assets/MANIFEST.md`, `analysis/verification/media/**` | index.html, styles.css, app.js |
| narrative-content | `site/index.html`, `analysis/verification/copy/**` | styles.css, app.js, assets |
| visual-motion | `site/styles.css`, `site/tokens.css`, `site/app.js`, `site/fonts/**` (self-hosted OFL webfonts), `analysis/verification/hallmark/zipline-study/**`, `analysis/verification/hallmark/motion-notes.md` | index.html (may REQUEST markup changes via SendMessage), assets |
| team-lead | `site/README.md`, `site/.hallmark/log.json`, `analysis/verification/{engine,tests,browser,plans}/**`, `analysis/verification/hallmark/{SLOP-TEST.md,PRE-EMIT.md}`, `analysis/verification/BUILD-HANDOFF.md`, `analysis/verification/HASHES.sha256` | — |

## Files expected at handoff
- site/index.html, site/styles.css, site/tokens.css, site/app.js, site/README.md, site/fonts/*, site/assets/{videos,photos}/*, site/assets/MANIFEST.md
- analysis/verification/** evidence tree (engine, media, copy, hallmark, browser, tests, BUILD-HANDOFF.md, HASHES.sha256)

## Explicitly NOT done
- No deletion of any existing file. No push, deploy, tunnel, email, or form submission. No writes outside this workspace except Claude runtime team/session files under ~/.claude.
