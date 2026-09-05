# Palette confirmation from real pixels

Script: `extract-palette.py` (re-runnable) → `palette.json`. Measured on the SHIPPED files: 8 frames per clip (t = 0…9.9 s) downscaled to 584x384,
photos at 960 px. "Chromatic" = HSV S>0.35 and V>0.18. Token proximity = OKLab distance < 0.12 with a chroma gate (pixel chroma ≥ ½ token chroma)
so greys cannot count as "sky-blue". Coverage is % of all sampled pixels.

## The four baseline tokens

| token | proposed | measured evidence (shipped clips) | verdict |
|---|---|---|---|
| signal-orange | `#F26B1C` oklch(0.684 0.185 45.1) | 03-crane orange unit: median `#EC7D2F` oklch(0.703 0.162 51.2), 1.3 % of pixels; 04-drums straps `#E27B29` oklch(0.686 0.156 53.9) 2.6 %; photo-drums `#F17A48` oklch(0.707 0.160 42.4) | **confirmed**; footage orange is slightly lighter/yellower than the token. Nearest real value `#EC7D2F`. Keep `#F26B1C` or nudge to `#EE7A2E` if you want it to sit on the footage. |
| signal-red | `#E5341E` oklch(0.602 0.215 30.8) | 02-coils red coil faces: median `#D22628` oklch(0.559 0.206 26.7), 9.3 % of pixels (the strongest single colour in any clip); 05-containers flat-racks turn red `#BF565D` oklch(0.587 0.135 18.1) late in the clip | **confirmed**; footage red is deeper and less orange than the token. Nearest real value `#D22628`. Recommend `#D9282A` or keep. |
| signal-yellow | `#F2C81C` oklch(0.845 0.168 93.0) | 07-yard units `#F0C61D` oklch(0.839 0.167 92.8) 11 %; 04-drums cylinders `#EAB91C` oklch(0.807 0.160 88.6) 7.7 %; 01-hero unit `#E2BE20` oklch(0.809 0.160 94.5) 3 %; 03-crane slings `#E9C021` oklch(0.820 0.161 92.5) | **confirmed strongly**; present in 4 of 7 clips at high coverage; token is within 0.03 OKLab of the measured median. |
| signal-sky | `#6FB4E2` oklch(0.742 0.097 239.1) | 0.0 % in 01, 02, 03, 04, 07; 0.33 % in 05 (tarp highlights); **1.7 % in 06-warehouse only** (blue film highlights, median `#7DACE2` oklch(0.732 0.094 252.5)); 8 % in `photo-crane.jpg` (real sky, `#7695C2` oklch(0.664 0.076 257.6), greyer/more violet) | **not evidenced as a footage colour.** The only light blue in the clips is one tarp in one clip. |

## Answer to the lead's question (credentials accent)

Sky-blue is **not** really present in the footage. The clips are monochrome plus one warm subject colour each; the only blues are the
navy tarps in 05-containers (band median `#1D2D57` oklch(0.308 0.078 266.2), 16.6 %) and the blue film in 06-warehouse (band median `#1658A1` oklch(0.462 0.134 254.6), 5.3 %). Both are too dark
for text on a dark ground and neither is "sky". The real photos do carry sky-blue (`photo-crane.jpg` 53 % blue band, median `#4C6899` oklch(0.517 0.085 261.1)), but that is the
photo layer, not the plates.

**Recommendation: use signal-yellow for the credentials accent** (name in orange, credentials in yellow). Evidence: yellow is the most
frequently and most heavily present chromatic hue across the plates (4/7 clips, up to 11 % coverage, measured `#F0C61D` ≈ token), and it is
hue-distinct from orange by ~20° in OKLCH (orange ≈ 55°, yellow ≈ 90°) while red is only ~10° from orange, which would blur. If a cool second
accent is still wanted, the only footage-derived option is a tarp blue around `#2F6FBF` (lightened from `#1658A1` for contrast), which appears in 1–2
plates only; label it "tarp-blue", not "sky".

## Per-file coverage (chromatic hue bands, % of pixels; medians in `palette.json`)

| file | chromatic % | red | orange | yellow | cyan-sky | blue |
|---|---|---|---|---|---|---|
| 01-hero.mp4 | 12.4 | 1.2 | 3.3 | 7.9 | 0 | 0 |
| 02-coils.mp4 | 28.5 | 28.4 | 0 | 0 | 0 | 0 |
| 03-crane.mp4 | 9.5 | 5.0 | 4.0 | 0.5 | 0 | 0 |
| 04-drums.mp4 | 17.4 | 0.6 | 5.2 | 11.7 | 0 | 0 |
| 05-containers.mp4 | 21.5 | 4.9 | 0 | 0 | 0 | 16.6 |
| 06-warehouse.mp4 | 31.3 | 0 | 24.7 (wood) | 0 | 5.3 | 1.3 |
| 07-yard.mp4 | 18.7 | 0 | 2.1 | 16.5 | 0 | 0 |
| hero.jpg | 0.8 | 0 | 0 | 0.5 | 0 | 0 |
| photo-coils.jpg | 2.8 | 0 | 2.7 | 0 | 0 | 0 |
| photo-crane.jpg | 60.5 | 1.2 | 1.1 | 0 | 4.7 | 53.5 (sky) |
| photo-drums.jpg | 48.2 | 35.5 (container) | 12.7 | 0 | 0 | 0 |
| photo-skid.jpg | 7.1 | 0 | 5.9 | 1.1 | 0 | 0 |
| photo-warehouse.jpg | 18.7 | 0 | 16.4 (wood) | 1.9 | 0 | 0.3 |
| photo-yard.jpg | 13.5 | 3.9 | 1.6 | 0.6 | 1.4 | 6.0 |

Baseline comparison: the earlier `analysis/palette/frame_palette.json` was computed on source frames/photos with a coarse RGB bucket; this pass
uses the shipped files and OKLab distances, so numbers differ but the qualitative picture is the same (warm accents dominate; blue only in tarps and real sky).
