# media-preparation teammate report

Branch `feat/t_27ed7897`, 2026-09-04T22:45:50. Nothing in the read-only client folder was written, moved or deleted;
no existing file anywhere was modified or overwritten. New files only.

## Source-integrity proof
- `analysis/verification/media/originals.sha256` (before) and `originals-after.sha256` (after): **IDENTICAL (all 23 sha256/size/mtime lines match) - source untouched**. 23 files, sha256 + bytes + mtime.

## Deliverables (all under my ownership)
| # | path | status |
|---|---|---|
| 1 | `analysis/verification/media/originals.sha256`, `originals-after.sha256` | done, identical |
| 2 | `analysis/verification/media/probe.json` | ffprobe json for 7 source + 7 shipped mp4; sips dims for 6 grok jpg, 7 HEIC, 14 (+7 new) shipped jpg; sha256 + bytes for all |
| 3 | `analysis/verification/media/reconciliation.md` | every shipped file mapped to its source with correlation score and confidence (all certain); 7 source videos = 7 shipped (there are 7, not 8, in the source; nothing dropped); no HEIC/source-path leaks |
| 4 | quality checks | photos ≤1920 px and ≤350 KB (max 347 KB); videos ≤8 MB (max 7.50 MB); `35M	site/`; 0 audio streams so no -muted variants needed; all faststart; every video has a matching poster whose content equals the first frame (corr 0.985–0.996); NEW mobile posters `poster-0N-*-960.jpg` x7 (88–118 KB) |
| 5 | `analysis/verification/media/content-descriptions.md` | literal descriptions, visible marks to avoid naming, safe captions, AI/original flag, roles |
| 6 | `analysis/verification/media/palette-confirmation.md` + `palette.json` (+ `extract-palette.py`) | orange/red/yellow confirmed from shipped pixels; sky-blue not evidenced (≤1.7 % in one clip); recommendation: yellow for credentials |
| 7 | `site/assets/MANIFEST.md` via `analysis/verification/media/build-manifest.py` | generated; re-run the script to refresh |
| 8 | this file | |

## Key findings for the lead
1. **Source has 7 videos, not 8** (7 mp4 + 6 grok jpg in `assets/`). Shipped 7 = complete. No `08-*.mp4` is possible.
2. **Every AI clip re-stages one client photo** (same composition, recoloured): 01↔hero.jpg, 02↔photo-coils, 03↔photo-crane, 04↔photo-drums, 05↔photo-yard, 06↔photo-warehouse, 07↔photo-skid. Copy must present clips as illustrations, not job footage.
3. Posters 01/03–07 are the Grok keyframe stills upscaled 1728x1152→1920x1280; poster-02 is a native 1168x768 frame grab (no Grok still exists for that clip). Content matches first frames.
4. Shipped mp4s already have audio stripped and faststart; source mp4s each carry AAC stereo + an mjpeg cover stream.
5. Naming mismatch (not renamed): `07-yard.mp4` is an indoor warehouse scene; `photo-yard.jpg` is the outdoor yard (scene of 05-containers); `photo-skid.jpg` is the scene of 07-yard.
6. Visible brand marks/lettering to keep out of copy: HARGIS…, Seacom, CAI, BAHRI, CNEU container numbers, WFS, DOL 3796, SIDA-badge sign, ONLY FOR LASHING. Small unidentified people appear in 03, 07, hero, photo-crane, photo-skid.
7. `site/DISPATCH-PROOF.json` line 22 contains the string `grok-4.6` (a reviewer model name, not an asset path); not my file, untouched, flagged only because it matched my leak grep.
8. Palette: signal-sky #6FB4E2 is absent from the plates; yellow (#F0C61D measured) is the strongest and most frequent second hue → use yellow for credentials. Red measured deeper (#D22628) and orange lighter (#EC7D2F) than tokens; both acceptable as-is.

## Exact commands (reproducible)
```
python3 analysis/verification/media/build-manifest.py       # regenerates site/assets/MANIFEST.md
python3 analysis/verification/media/extract-palette.py      # regenerates palette.json
ffprobe -v error -print_format json -show_format -show_streams <file>   # per file, aggregated into probe.json
sips -g pixelWidth -g pixelHeight -g format <jpg|heic>       # dimensions
ffmpeg -v error -y [-ss T] -i <mp4> [-map 0:v:0] -frames:v 1 <out.jpg>   # frames at t=0,5,9.5 into the scratchpad
sips -s format jpeg -Z 1920 <HEIC> --out <scratchpad>/heic/<name>.jpg    # HEIC → jpg in the scratchpad only
rg -n -i "Nick Salazar Website|IMG_[0-9]{4}|\.HEIC|grok-" site/ --glob '!*.mp4' --glob '!*.jpg'   # leak check
du -sh site/
```
Similarity metric: 48x32 LANCZOS downscale, mean-subtracted RGB vector, cosine correlation (python3 + PIL + numpy). 960 px posters: PIL LANCZOS, progressive JPEG, quality stepped down from 82 until ≤120 KB.

## Palette outcome (final, from visual-motion)
- Orange `#F26B1C` kept (name accent). Red switched to measured `#D9282A`. Yellow `#F2C81C` kept and now used for the credentials accent. Sky-blue token retired/unused with the measurement cited. Plate crop handled with `object-position: 50% 42%`. The `poster-0N-*-960.jpg` set is shipped but not referenced by the plates.

## Unresolved / for the lead
- Whether to keep the filenames with the naming mismatch (07-yard / photo-yard / photo-skid). I did not rename (rule: never move/overwrite).
- `site/assets/` and `analysis/verification/media/` are untracked in git; nothing committed by me.

## Message log
| when | to/from | summary |
|---|---|---|
| start | from team-lead | task brief (this deliverable list) |
| after reconciliation | to narrative-content | asset table: src paths, dimensions, literal descriptions, AI/original flags, roles, marks to avoid |
| after palette | to visual-motion | measured hex/OKLCH per token, sky-blue not evidenced, recommend yellow, video specs 1168x768 / no audio, poster sizes |
| end | to team-lead | completion summary with deliverable paths (this report) |
| after completion | from narrative-content | asked to confirm photo↔HEIC mapping, Grok provenance of clips, poster-02 size, exclusions, avoid-list |
| reply | to narrative-content | confirmed all 7 photo↔IMG mappings and Grok origin; clips re-stage the photos (cannot prove ingestion); suggested caption "AI-generated illustration based on a photograph in Nick's files"; poster-02 size is an artefact; nothing to exclude; full avoid-list |
| follow-up | from narrative-content | captions applied: clips = "Illustrative footage: an AI re-staging of a photograph from Nick's files", originals end "From Nick's files", posters 01–07 (1920 set) referenced; asked to be told of any rename |
| reply | to narrative-content | acknowledged; all 28 filenames frozen, no further re-encodes; any rename would go via lead |
| final | from narrative-content | confirmed wording applied page-wide ("<scene> · AI-generated illustration based on a photograph from Nick's files"), "footage" removed, people described generically, filenames unchanged, no further asks |
| follow-up | from visual-motion | tokens.css written with OKLCH accents, credentials = sky; asked for measured values, silent confirmation, dimensions/aspect (assumed 16:9), poster/first-frame match |
| reply | to visual-motion | corrected my earlier mistyped token OKLCH values (theirs are right); confirmed 0 audio + faststart; warned aspect is 1168x768 = 1.52:1 (~3:2) not 16:9 (16:9 cover crops 14.5 % of height, clips beam/hook in 01/03); posters match first frames 0.985–0.996; measured per-accent hex/OKLCH; recommended credentials = yellow, or measured #7DACE2 labelled film-blue if a blue is kept |
| follow-up | from visual-motion | motion integrated (7 lazy videos, posters in place, hero preload=metadata, muted/looped, pause offscreen); said measured palette not received; will report baseline as final unless values differ |
| reply | to visual-motion | resent measured values in their OKLCH format (orange #EC7D2F, red #D22628, yellow #F0C61D keep, sky not measurable / #7DACE2 film-blue nearest), recommendation credentials = yellow, reminders on 3:2 aspect and silence; asked for their final choice |
| FYI | from narrative-content | plate caption tail shortened at visual-motion's request to "AI-generated, based on a photograph in Nick's files" (wrapping at 375 px); footer keeps full sentence; "footage" still absent; no action needed |
| final | from visual-motion | palette decisions recorded in site/tokens.css citing my files: orange kept #F26B1C; red switched to on-footage #D9282A oklch(57.5% 0.205 28); yellow kept #F2C81C; credentials = yellow (accent-2) per my recommendation and the lead's ruling; sky token retained but marked RETIRED/UNUSED with the 0 %/1.7 % finding, data-accent="sky" resolves to yellow; plates use object-fit: cover with object-position 50% 42% (≈5 % crop at 1440x900); 960 poster set unused but kept. Recorded as final. |
