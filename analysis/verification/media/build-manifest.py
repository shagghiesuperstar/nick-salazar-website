#!/usr/bin/env python3
"""Regenerate site/assets/MANIFEST.md from the filesystem.
Dimensions/duration/size/SHA256 are measured live. Provenance (source file, generation type)
comes from the PROVENANCE table below, which was established in
analysis/verification/media/reconciliation.md (frame/pixel comparison, 2026-09-04).
Usage: python3 analysis/verification/media/build-manifest.py
"""
import hashlib, json, pathlib, subprocess, datetime
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[3]
ASSETS = ROOT / "site/assets"
OUT = ASSETS / "MANIFEST.md"
AI = "AI-generated (Grok)"
ORIG = "client-supplied original photo (unverified)"
# shipped path -> (source file in read-only dir, generation type, how derived)
PROVENANCE = {
 "videos/01-hero.mp4":       ("assets/grok-0ec8e781-1b66-4c20-99c7-4e621372e7ed-720p.mp4", AI, "re-encoded, audio + mjpeg cover stream dropped"),
 "videos/02-coils.mp4":      ("assets/grok-92434e7a-4c80-4925-ac78-67e04c63cce3-720p.mp4", AI, "re-encoded, audio + mjpeg cover stream dropped"),
 "videos/03-crane.mp4":      ("assets/grok-b9934f94-3faf-4d5c-983b-2f31d24cb1da-720p.mp4", AI, "re-encoded, audio + mjpeg cover stream dropped"),
 "videos/04-drums.mp4":      ("assets/grok-f003a160-4d12-4b95-b4c6-24f741c55806-720p.mp4", AI, "re-encoded, audio + mjpeg cover stream dropped"),
 "videos/05-containers.mp4": ("assets/grok-272f1684-472a-4d86-b092-d4105cb60f83-720p.mp4", AI, "re-encoded, audio + mjpeg cover stream dropped"),
 "videos/06-warehouse.mp4":  ("assets/grok-0f873317-6181-4448-8a61-b3eea0d11664-720p.mp4", AI, "re-encoded, audio + mjpeg cover stream dropped"),
 "videos/07-yard.mp4":       ("assets/grok-57c62ca3-a91c-4a60-8684-980268800b06-720p.mp4", AI, "re-encoded, audio + mjpeg cover stream dropped"),
 "photos/hero.jpg":            ("original photos HEIC format/IMG_2736.HEIC", ORIG, "HEIC -> JPEG, downscaled 5712x4284 -> 1920x1440"),
 "photos/photo-coils.jpg":     ("original photos HEIC format/IMG_1449.HEIC", ORIG, "HEIC -> JPEG, downscaled 5712x4284 -> 1920x1440"),
 "photos/photo-crane.jpg":     ("original photos HEIC format/IMG_3768.HEIC", ORIG, "HEIC -> JPEG, downscaled 5712x4284 -> 1920x1440"),
 "photos/photo-drums.jpg":     ("original photos HEIC format/IMG_1185.HEIC", ORIG, "HEIC -> JPEG, downscaled 5712x4284 -> 1920x1440"),
 "photos/photo-skid.jpg":      ("original photos HEIC format/IMG_4422.HEIC", ORIG, "HEIC -> JPEG, downscaled 4032x3024 -> 1920x1440"),
 "photos/photo-warehouse.jpg": ("original photos HEIC format/IMG_0317.HEIC", ORIG, "HEIC -> JPEG, downscaled 5712x4284 -> 1920x1440"),
 "photos/photo-yard.jpg":      ("original photos HEIC format/IMG_8805.HEIC", ORIG, "HEIC -> JPEG, downscaled 4032x3024 -> 1920x1440"),
 "photos/poster-01-hero.jpg":       ("assets/grok-c9f2933b-9a9e-4103-9bc3-2a1c974c1e13.jpg", AI, "Grok keyframe still, upscaled 1728x1152 -> 1920x1280"),
 "photos/poster-02-coils.jpg":      ("assets/grok-92434e7a-4c80-4925-ac78-67e04c63cce3-720p.mp4", AI, "first frame extracted from the video (no Grok still exists for this clip)"),
 "photos/poster-03-crane.jpg":      ("assets/grok-355f6788-ec13-4262-8c01-05c12c555821.jpg", AI, "Grok keyframe still, upscaled 1728x1152 -> 1920x1280"),
 "photos/poster-04-drums.jpg":      ("assets/grok-f07026d9-4da4-41a9-ac65-174465c53bd6.jpg", AI, "Grok keyframe still, upscaled 1728x1152 -> 1920x1280"),
 "photos/poster-05-containers.jpg": ("assets/grok-4c4d0d42-b0a0-488e-82a6-9049aac4bb20.jpg", AI, "Grok keyframe still, upscaled 1728x1152 -> 1920x1280"),
 "photos/poster-06-warehouse.jpg":  ("assets/grok-d48ebf23-6a16-4f31-b667-5dab096e5865.jpg", AI, "Grok keyframe still, upscaled 1728x1152 -> 1920x1280"),
 "photos/poster-07-yard.jpg":       ("assets/grok-52d1d9cc-01c5-401c-b9f8-6e3116b8cfdd.jpg", AI, "Grok keyframe still, upscaled 1728x1152 -> 1920x1280"),
}
# the real photo each AI clip visibly re-stages (same scene, recoloured/animated by Grok)
SCENE_OF_VIDEO = {"01": "photos/hero.jpg", "02": "photos/photo-coils.jpg", "03": "photos/photo-crane.jpg",
                  "04": "photos/photo-drums.jpg", "05": "photos/photo-yard.jpg", "06": "photos/photo-warehouse.jpg", "07": "photos/photo-skid.jpg"}

def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def probe(p):
    j = json.loads(subprocess.run(["ffprobe", "-v", "error", "-print_format", "json", "-show_format", "-show_streams", str(p)], capture_output=True, text=True).stdout)
    v = [s for s in j["streams"] if s["codec_type"] == "video"][0]; a = [s for s in j["streams"] if s["codec_type"] == "audio"]
    return v["width"], v["height"], float(j["format"]["duration"]), v["codec_name"], v.get("pix_fmt"), v["avg_frame_rate"], len(a)

rows_v, rows_p = [], []
files = sorted(p for p in ASSETS.rglob("*") if p.is_file() and p.suffix.lower() in (".mp4", ".jpg"))
posters = {p.name[7:9]: p for p in (ASSETS / "photos").glob("poster-0?-*.jpg") if not p.stem.endswith("-960")}
posters960 = {p.name[7:9]: p for p in (ASSETS / "photos").glob("poster-0?-*-960.jpg")}
for p in files:
    rel = p.relative_to(ASSETS).as_posix(); size = p.stat().st_size; h = sha(p)
    src, gen, how = PROVENANCE.get(rel, ("UNKNOWN - not in provenance table", "UNKNOWN", ""))
    if rel.endswith("-960.jpg"):
        base = rel.replace("-960.jpg", ".jpg"); src, gen, how = PROVENANCE[base][0], PROVENANCE[base][1], f"960px derivative of {base}"
    if p.suffix == ".mp4":
        w, hgt, dur, codec, pix, fps, na = probe(p); n = p.name[:2]
        rows_v.append(f"| `{rel}` | `{src}` | {gen} | {w}x{hgt} | {dur:.2f}s @ {fps} | {codec}/{pix}, audio streams: {na} | {size/1e6:.2f} MB | `{posters[n].relative_to(ASSETS).as_posix()}` + `{posters960[n].name}` | `{SCENE_OF_VIDEO[n]}` | `{h[:16]}…` |")
    else:
        w, hgt = Image.open(p).size
        pair = ""
        if p.name.startswith("poster-"):
            n = p.name[7:9]; pair = f"poster for `videos/{n}-*.mp4`"
        rows_p.append(f"| `{rel}` | `{src}` | {gen} | {w}x{hgt} | {size/1e3:.0f} KB | {pair} | {how} | `{h[:16]}…` |")

total = sum(p.stat().st_size for p in files)
md = f"""# site/assets manifest

Generated {datetime.datetime.now().isoformat(timespec='seconds')} by `analysis/verification/media/build-manifest.py`
(re-run that script to refresh; do not hand-edit). Full SHA256 values are in
`analysis/verification/media/probe.json`. Source paths are relative to the read-only client folder
`Nick Salazar Website/`.

Honesty notes
- Every `videos/*.mp4` and every `photos/poster-*.jpg` is **AI-generated (Grok)**. They are not documentary footage.
  Each clip visibly re-stages one of the client photos (column "scene re-staged from") with altered colours,
  so they must be presented as illustrative, never as proof of a job.
- Every `photos/hero.jpg` and `photos/photo-*.jpg` is a **client-supplied original photo** (from an IMG_*.HEIC).
  Nothing about them is verified: no location, date, job, client, outcome or person is known.
- Visible marks/logos in the footage (see `analysis/verification/media/content-descriptions.md`) are NOT endorsements
  and must not be named in copy.
- No shipped video has an audio stream, so `autoplay muted playsinline` is safe. All mp4s are faststart (moov before mdat).

Totals: {len(files)} files, {total/1e6:.1f} MB.

## Videos

| shipped | source | type | px | duration | codec | size | poster | scene re-staged from | sha256 |
|---|---|---|---|---|---|---|---|---|---|
{chr(10).join(rows_v)}

## Photos and posters

| shipped | source | type | px | size | pairing | derivation | sha256 |
|---|---|---|---|---|---|---|---|
{chr(10).join(rows_p)}
"""
OUT.write_text(md)
print(md)
