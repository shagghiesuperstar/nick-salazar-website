# Media reconciliation: shipped `site/assets/**` vs read-only client source

Captured 2026-09-04. Method, per shipped file:
1. **Videos** – first frame (`ffmpeg -i X -frames:v 1`) of each shipped mp4 vs first frame of each of the 7 source mp4s (video stream 0),
   compared as 48x32 normalised-RGB correlation. Every shipped clip correlates 0.9999–1.0000 with exactly one source and ≤0.30 with the runner-up.
   Durations (10.04 s, 241 frames @ 24 fps), dimensions (1168x768) and pixel format (yuv420p) also match one-to-one.
2. **Photos/posters** – each shipped jpg vs (a) the 6 source `grok-*.jpg`, (b) sips-converted copies of the 7 `IMG_*.HEIC`
   (converted into the scratchpad, never into the source dir), and (c) first frames of every video. Same correlation metric; every file hits one candidate at 0.9999–1.0000.
3. **SHA256** – no shipped file is a byte-identical copy of any source file (all were re-encoded / resized), so no SHA matches; provenance rests on the pixel comparison above. Full hashes: `probe.json`.

Source inventory (see `originals.sha256`): 7 mp4 + 6 jpg in `assets/`, 7 HEIC in `original photos HEIC format/`, 2 text files, 1 `.DS_Store`.
**Note for the lead: the source contains 7 videos, not 8.** Nothing was dropped; 7 shipped = 7 source. No `08-*.mp4` is possible from this source. 7 plates ≥ the 6 the site needs.

## Videos (all AI-generated, Grok)

| shipped | source mp4 (`assets/`) | corr | confidence | notes |
|---|---|---|---|---|
| `videos/01-hero.mp4` | `grok-0ec8e781-1b66-4c20-99c7-4e621372e7ed-720p.mp4` | 1.0000 | certain | 4.83 MB → 4.57 MB |
| `videos/02-coils.mp4` | `grok-92434e7a-4c80-4925-ac78-67e04c63cce3-720p.mp4` | 0.9999 | certain | 10.88 MB → 2.66 MB |
| `videos/03-crane.mp4` | `grok-b9934f94-3faf-4d5c-983b-2f31d24cb1da-720p.mp4` | 1.0000 | certain | 5.79 MB → 5.54 MB |
| `videos/04-drums.mp4` | `grok-f003a160-4d12-4b95-b4c6-24f741c55806-720p.mp4` | 1.0000 | certain | 7.78 MB → 7.50 MB (largest; under 8 MB cap) |
| `videos/05-containers.mp4` | `grok-272f1684-472a-4d86-b092-d4105cb60f83-720p.mp4` | 0.9999 | certain | 9.75 MB → 2.18 MB |
| `videos/06-warehouse.mp4` | `grok-0f873317-6181-4448-8a61-b3eea0d11664-720p.mp4` | 0.9999 | certain | 10.89 MB → 2.28 MB |
| `videos/07-yard.mp4` | `grok-57c62ca3-a91c-4a60-8684-980268800b06-720p.mp4` | 1.0000 | certain | 6.85 MB → 6.59 MB |

Every source mp4 has **2 video streams** (h264 + an attached mjpeg cover) and **1 AAC stereo audio stream**. Every shipped mp4 has 1 video stream and **0 audio streams** – the earlier run stripped audio, so no `-muted` variants are needed. All shipped mp4s are faststart (`ftyp, moov, free, mdat`). Same resolution/fps/duration as source (no scaling or trimming), only a re-encode at lower bitrate (1.7–6.0 Mb/s vs 3.9–8.7 Mb/s).

## Photos (all client-supplied originals, unverified)

| shipped | source HEIC | corr | confidence | derivation |
|---|---|---|---|---|
| `photos/hero.jpg` | `IMG_2736.HEIC` | 1.0000 | certain | 5712x4284 → 1920x1440 |
| `photos/photo-coils.jpg` | `IMG_1449.HEIC` | 0.9999 | certain | 5712x4284 → 1920x1440 |
| `photos/photo-crane.jpg` | `IMG_3768.HEIC` | 1.0000 | certain | 5712x4284 → 1920x1440 |
| `photos/photo-drums.jpg` | `IMG_1185.HEIC` | 1.0000 | certain | 5712x4284 → 1920x1440 |
| `photos/photo-skid.jpg` | `IMG_4422.HEIC` | 0.9999 | certain | 4032x3024 → 1920x1440 |
| `photos/photo-warehouse.jpg` | `IMG_0317.HEIC` | 0.9999 | certain | 5712x4284 → 1920x1440 |
| `photos/photo-yard.jpg` | `IMG_8805.HEIC` | 1.0000 | certain | 4032x3024 → 1920x1440 |

All 7 HEICs are represented. No HEIC file and no `IMG_*`/`grok-*`/source-path string exists anywhere under `site/` (rg over `site/` excluding binaries; the only hit is `site/DISPATCH-PROOF.json` line 22 `"reviewer_model": "grok-4.6"`, a model name, not an asset path – not my file, left untouched).

## Posters (all AI-generated, Grok)

| shipped | source | corr | confidence | derivation |
|---|---|---|---|---|
| `photos/poster-01-hero.jpg` | `assets/grok-c9f2933b-9a9e-4103-9bc3-2a1c974c1e13.jpg` | 1.0000 | certain | 1728x1152 upscaled → 1920x1280 |
| `photos/poster-02-coils.jpg` | first frame of `grok-92434e7a-…-720p.mp4` | 0.9929 (vs shipped 02 f0) | high | 1168x768 native frame grab; no Grok still exists for this clip |
| `photos/poster-03-crane.jpg` | `assets/grok-355f6788-ec13-4262-8c01-05c12c555821.jpg` | 1.0000 | certain | upscaled → 1920x1280 |
| `photos/poster-04-drums.jpg` | `assets/grok-f07026d9-4da4-41a9-ac65-174465c53bd6.jpg` | 1.0000 | certain | upscaled → 1920x1280 |
| `photos/poster-05-containers.jpg` | `assets/grok-4c4d0d42-b0a0-488e-82a6-9049aac4bb20.jpg` | 1.0000 | certain | upscaled → 1920x1280 |
| `photos/poster-06-warehouse.jpg` | `assets/grok-d48ebf23-6a16-4f31-b667-5dab096e5865.jpg` | 1.0000 | certain | upscaled → 1920x1280 |
| `photos/poster-07-yard.jpg` | `assets/grok-52d1d9cc-01c5-401c-b9f8-6e3116b8cfdd.jpg` | 1.0000 | certain | upscaled → 1920x1280 |

The 6 source `grok-*.jpg` are the Grok keyframe stills from which the clips were animated: each correlates 0.985–0.996 with the first frame of its clip.
**Poster ↔ video first-frame check: all 7 posters match their clip's first frame** (corr 0.9853–0.9957). Small caveats: posters 01/03–07 are 3:2 (1920x1280) while the clips are 1168x768 (1.521:1), a 1.4% aspect difference that `object-fit: cover` hides; poster-02 is 1168x768 native. Each poster's pixel content is identical in framing to the clip, so no swap-flash on play start.
Added this run (new files only): `poster-0N-*-960.jpg` (960 px wide, 88–118 KB each) as a mobile poster set.

## Cross-link that matters for copy honesty

Each AI clip is an animated, recoloured re-staging of one of the client photos (same composition, objects and camera angle):

| AI clip / poster | re-stages client photo | what Grok changed |
|---|---|---|
| 01-hero | `hero.jpg` (IMG_2736) | grey transformer → yellow; sky/crane desaturated to monochrome |
| 02-coils | `photo-coils.jpg` (IMG_1449) | galvanised coil faces → red; hall monochrome |
| 03-crane | `photo-crane.jpg` (IMG_3768) | grey unit → orange, blue crane → black, red flatcar → grey, white slings → yellow, blue sky → grey |
| 04-drums | `photo-drums.jpg` (IMG_1185) | copper-brown drums → yellow, red container walls → dark grey |
| 05-containers | `photo-yard.jpg` (IMG_8805) | navy tarps kept, red flat-racks → grey then red, sky darkened |
| 06-warehouse | `photo-warehouse.jpg` (IMG_0317) | white shrink-wrap → blue, hall monochrome, wood kept warm |
| 07-yard | `photo-skid.jpg` (IMG_4422) | grey units → yellow, warehouse monochrome; hi-vis worker kept |

Consequence: the clips cannot be shown as "footage from a job"; a pairing like "photo (real) + clip (AI illustration of the same scene)" is the honest framing.

## Naming mismatches to be aware of (files are NOT renamed – existing names kept)

- `07-yard.mp4` / `poster-07-yard.jpg` show an **indoor warehouse floor with crated units on an air-cargo dolly**, not an outdoor yard.
- `photo-yard.jpg` shows tarped cargo on flat-rack containers in an **outdoor yard** (it is the scene of `05-containers.mp4`).
- `photo-skid.jpg` is the scene of `07-yard.mp4` (warehouse, dolly).
- `04-drums.mp4` shows tall cylindrical units in a container – "drums" is a reasonable literal word; they may be coils on end or drums, do not assert contents.

## Quality gates (measured)

| gate | result |
|---|---|
| photos ≤ 1920 px wide | pass (max 1920) |
| photos ≤ 350 KB | pass (max 347 KB, `poster-06-warehouse.jpg`) |
| videos ≤ 8 MB | pass (max 7.50 MB, `04-drums.mp4`) |
| `du -sh site/` < 70 MB | pass: 35 MB before this run, 36.5 MB of assets after adding the 960 px posters |
| audio streams in shipped video | none |
| faststart | all 7 |
| poster per video | all 7 (+ 960 px set) |
| HEIC / source-path leaks in `site/` | none |
