# site/assets manifest

Generated 2026-09-04T22:42:16 by `analysis/verification/media/build-manifest.py`
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

Totals: 28 files, 36.5 MB.

## Videos

| shipped | source | type | px | duration | codec | size | poster | scene re-staged from | sha256 |
|---|---|---|---|---|---|---|---|---|---|
| `videos/01-hero.mp4` | `assets/grok-0ec8e781-1b66-4c20-99c7-4e621372e7ed-720p.mp4` | AI-generated (Grok) | 1168x768 | 10.04s @ 24/1 | h264/yuv420p, audio streams: 0 | 4.57 MB | `photos/poster-01-hero.jpg` + `poster-01-hero-960.jpg` | `photos/hero.jpg` | `73edf3737802ae3f…` |
| `videos/02-coils.mp4` | `assets/grok-92434e7a-4c80-4925-ac78-67e04c63cce3-720p.mp4` | AI-generated (Grok) | 1168x768 | 10.04s @ 24/1 | h264/yuv420p, audio streams: 0 | 2.66 MB | `photos/poster-02-coils.jpg` + `poster-02-coils-960.jpg` | `photos/photo-coils.jpg` | `7b3607723e1e54d1…` |
| `videos/03-crane.mp4` | `assets/grok-b9934f94-3faf-4d5c-983b-2f31d24cb1da-720p.mp4` | AI-generated (Grok) | 1168x768 | 10.04s @ 24/1 | h264/yuv420p, audio streams: 0 | 5.54 MB | `photos/poster-03-crane.jpg` + `poster-03-crane-960.jpg` | `photos/photo-crane.jpg` | `b003a05b0ea9d0d5…` |
| `videos/04-drums.mp4` | `assets/grok-f003a160-4d12-4b95-b4c6-24f741c55806-720p.mp4` | AI-generated (Grok) | 1168x768 | 10.04s @ 24/1 | h264/yuv420p, audio streams: 0 | 7.50 MB | `photos/poster-04-drums.jpg` + `poster-04-drums-960.jpg` | `photos/photo-drums.jpg` | `201a1f6706327fce…` |
| `videos/05-containers.mp4` | `assets/grok-272f1684-472a-4d86-b092-d4105cb60f83-720p.mp4` | AI-generated (Grok) | 1168x768 | 10.04s @ 24/1 | h264/yuv420p, audio streams: 0 | 2.18 MB | `photos/poster-05-containers.jpg` + `poster-05-containers-960.jpg` | `photos/photo-yard.jpg` | `a424ea1979d0870c…` |
| `videos/06-warehouse.mp4` | `assets/grok-0f873317-6181-4448-8a61-b3eea0d11664-720p.mp4` | AI-generated (Grok) | 1168x768 | 10.04s @ 24/1 | h264/yuv420p, audio streams: 0 | 2.28 MB | `photos/poster-06-warehouse.jpg` + `poster-06-warehouse-960.jpg` | `photos/photo-warehouse.jpg` | `2b3e33ba2db98017…` |
| `videos/07-yard.mp4` | `assets/grok-57c62ca3-a91c-4a60-8684-980268800b06-720p.mp4` | AI-generated (Grok) | 1168x768 | 10.04s @ 24/1 | h264/yuv420p, audio streams: 0 | 6.59 MB | `photos/poster-07-yard.jpg` + `poster-07-yard-960.jpg` | `photos/photo-skid.jpg` | `2bec3f889dab0397…` |

## Photos and posters

| shipped | source | type | px | size | pairing | derivation | sha256 |
|---|---|---|---|---|---|---|---|
| `photos/hero.jpg` | `original photos HEIC format/IMG_2736.HEIC` | client-supplied original photo (unverified) | 1920x1440 | 344 KB |  | HEIC -> JPEG, downscaled 5712x4284 -> 1920x1440 | `a4c587a36639e6d8…` |
| `photos/photo-coils.jpg` | `original photos HEIC format/IMG_1449.HEIC` | client-supplied original photo (unverified) | 1920x1440 | 320 KB |  | HEIC -> JPEG, downscaled 5712x4284 -> 1920x1440 | `5e2cc710be9ed42c…` |
| `photos/photo-crane.jpg` | `original photos HEIC format/IMG_3768.HEIC` | client-supplied original photo (unverified) | 1920x1440 | 347 KB |  | HEIC -> JPEG, downscaled 5712x4284 -> 1920x1440 | `c51c35797dbb9b2b…` |
| `photos/photo-drums.jpg` | `original photos HEIC format/IMG_1185.HEIC` | client-supplied original photo (unverified) | 1920x1440 | 329 KB |  | HEIC -> JPEG, downscaled 5712x4284 -> 1920x1440 | `6922ceeb33f35099…` |
| `photos/photo-skid.jpg` | `original photos HEIC format/IMG_4422.HEIC` | client-supplied original photo (unverified) | 1920x1440 | 312 KB |  | HEIC -> JPEG, downscaled 4032x3024 -> 1920x1440 | `76bad24927d65fa4…` |
| `photos/photo-warehouse.jpg` | `original photos HEIC format/IMG_0317.HEIC` | client-supplied original photo (unverified) | 1920x1440 | 300 KB |  | HEIC -> JPEG, downscaled 5712x4284 -> 1920x1440 | `99870178f1ade1cb…` |
| `photos/photo-yard.jpg` | `original photos HEIC format/IMG_8805.HEIC` | client-supplied original photo (unverified) | 1920x1440 | 333 KB |  | HEIC -> JPEG, downscaled 4032x3024 -> 1920x1440 | `2e195cbbb83128c4…` |
| `photos/poster-01-hero-960.jpg` | `assets/grok-c9f2933b-9a9e-4103-9bc3-2a1c974c1e13.jpg` | AI-generated (Grok) | 960x640 | 100 KB | poster for `videos/01-*.mp4` | 960px derivative of photos/poster-01-hero.jpg | `f9445bba66c33ce8…` |
| `photos/poster-01-hero.jpg` | `assets/grok-c9f2933b-9a9e-4103-9bc3-2a1c974c1e13.jpg` | AI-generated (Grok) | 1920x1280 | 328 KB | poster for `videos/01-*.mp4` | Grok keyframe still, upscaled 1728x1152 -> 1920x1280 | `b689f4df7bd67b81…` |
| `photos/poster-02-coils-960.jpg` | `assets/grok-92434e7a-4c80-4925-ac78-67e04c63cce3-720p.mp4` | AI-generated (Grok) | 960x631 | 118 KB | poster for `videos/02-*.mp4` | 960px derivative of photos/poster-02-coils.jpg | `53abe926824f8552…` |
| `photos/poster-02-coils.jpg` | `assets/grok-92434e7a-4c80-4925-ac78-67e04c63cce3-720p.mp4` | AI-generated (Grok) | 1168x768 | 162 KB | poster for `videos/02-*.mp4` | first frame extracted from the video (no Grok still exists for this clip) | `04769f03a32a7bad…` |
| `photos/poster-03-crane-960.jpg` | `assets/grok-355f6788-ec13-4262-8c01-05c12c555821.jpg` | AI-generated (Grok) | 960x640 | 88 KB | poster for `videos/03-*.mp4` | 960px derivative of photos/poster-03-crane.jpg | `7f4fd7f143d133e2…` |
| `photos/poster-03-crane.jpg` | `assets/grok-355f6788-ec13-4262-8c01-05c12c555821.jpg` | AI-generated (Grok) | 1920x1280 | 319 KB | poster for `videos/03-*.mp4` | Grok keyframe still, upscaled 1728x1152 -> 1920x1280 | `502ce630f96e6ac2…` |
| `photos/poster-04-drums-960.jpg` | `assets/grok-f07026d9-4da4-41a9-ac65-174465c53bd6.jpg` | AI-generated (Grok) | 960x640 | 116 KB | poster for `videos/04-*.mp4` | 960px derivative of photos/poster-04-drums.jpg | `0a3021751fde263b…` |
| `photos/poster-04-drums.jpg` | `assets/grok-f07026d9-4da4-41a9-ac65-174465c53bd6.jpg` | AI-generated (Grok) | 1920x1280 | 334 KB | poster for `videos/04-*.mp4` | Grok keyframe still, upscaled 1728x1152 -> 1920x1280 | `675a687df2db02a1…` |
| `photos/poster-05-containers-960.jpg` | `assets/grok-4c4d0d42-b0a0-488e-82a6-9049aac4bb20.jpg` | AI-generated (Grok) | 960x640 | 95 KB | poster for `videos/05-*.mp4` | 960px derivative of photos/poster-05-containers.jpg | `9493e70e8959e4b3…` |
| `photos/poster-05-containers.jpg` | `assets/grok-4c4d0d42-b0a0-488e-82a6-9049aac4bb20.jpg` | AI-generated (Grok) | 1920x1280 | 345 KB | poster for `videos/05-*.mp4` | Grok keyframe still, upscaled 1728x1152 -> 1920x1280 | `78de84961b06df84…` |
| `photos/poster-06-warehouse-960.jpg` | `assets/grok-d48ebf23-6a16-4f31-b667-5dab096e5865.jpg` | AI-generated (Grok) | 960x640 | 113 KB | poster for `videos/06-*.mp4` | 960px derivative of photos/poster-06-warehouse.jpg | `81a9d1022bf9c2a1…` |
| `photos/poster-06-warehouse.jpg` | `assets/grok-d48ebf23-6a16-4f31-b667-5dab096e5865.jpg` | AI-generated (Grok) | 1920x1280 | 347 KB | poster for `videos/06-*.mp4` | Grok keyframe still, upscaled 1728x1152 -> 1920x1280 | `b6e3465e4240694b…` |
| `photos/poster-07-yard-960.jpg` | `assets/grok-52d1d9cc-01c5-401c-b9f8-6e3116b8cfdd.jpg` | AI-generated (Grok) | 960x640 | 103 KB | poster for `videos/07-*.mp4` | 960px derivative of photos/poster-07-yard.jpg | `49adc7055b2dc761…` |
| `photos/poster-07-yard.jpg` | `assets/grok-52d1d9cc-01c5-401c-b9f8-6e3116b8cfdd.jpg` | AI-generated (Grok) | 1920x1280 | 325 KB | poster for `videos/07-*.mp4` | Grok keyframe still, upscaled 1728x1152 -> 1920x1280 | `771c5b8a6f405a68…` |
