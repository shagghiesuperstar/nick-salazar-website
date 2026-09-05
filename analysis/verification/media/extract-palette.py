#!/usr/bin/env python3
"""Measure chromatic colour presence in the SHIPPED site media (real pixels).
Writes analysis/verification/media/palette.json. Re-runnable. Needs PIL + numpy + ffmpeg.
Usage: python3 analysis/verification/media/extract-palette.py
"""
import json, subprocess, pathlib, tempfile
import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[3]
VID = ROOT / "site/assets/videos"; PHO = ROOT / "site/assets/photos"
OUT = ROOT / "analysis/verification/media/palette.json"
TOKENS = {"signal-orange": "#F26B1C", "signal-red": "#E5341E", "signal-yellow": "#F2C81C", "signal-sky": "#6FB4E2"}
BANDS = {"red": (345, 15), "orange": (15, 42), "yellow": (42, 70), "green": (70, 170), "cyan-sky": (170, 215), "blue": (215, 265), "violet-magenta": (265, 345)}
SAMPLE_T = [0, 1.5, 3, 4.5, 6, 7.5, 9, 9.9]

def hex2rgb(h): h = h.lstrip("#"); return np.array([int(h[i:i+2], 16) for i in (0, 2, 4)], float)
def rgb2hex(c): return "#%02X%02X%02X" % tuple(int(round(x)) for x in c)
def srgb_to_lin(c):
    c = c / 255.0
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
def rgb_to_oklab(rgb):  # rgb: (...,3) 0-255
    l = srgb_to_lin(np.asarray(rgb, float))
    r, g, b = l[..., 0], l[..., 1], l[..., 2]
    l_ = 0.4122214708*r + 0.5363325363*g + 0.0514459929*b
    m_ = 0.2119034982*r + 0.6806995451*g + 0.1073969566*b
    s_ = 0.0883024619*r + 0.2817188376*g + 0.6299787005*b
    l_, m_, s_ = np.cbrt(l_), np.cbrt(m_), np.cbrt(s_)
    return np.stack([0.2104542553*l_ + 0.7936177850*m_ - 0.0040720468*s_,
                     1.9779984951*l_ - 2.4285922050*m_ + 0.4505937099*s_,
                     0.0259040371*l_ + 0.7827717662*m_ - 0.8086757660*s_], -1)
def oklch_str(rgb):
    L, a, b = rgb_to_oklab(np.asarray(rgb, float))
    C = float(np.hypot(a, b)); h = float(np.degrees(np.arctan2(b, a)) % 360)
    return f"oklch({L:.3f} {C:.3f} {h:.1f})"
def rgb_to_hsv(rgb):
    rgb = np.asarray(rgb, float) / 255.0
    mx = rgb.max(-1); mn = rgb.min(-1); d = mx - mn
    s = np.where(mx > 0, d / np.maximum(mx, 1e-9), 0)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    h = np.zeros_like(mx)
    m = d > 1e-9
    rc = np.where(m, (mx - r) / np.maximum(d, 1e-9), 0); gc = np.where(m, (mx - g) / np.maximum(d, 1e-9), 0); bc = np.where(m, (mx - b) / np.maximum(d, 1e-9), 0)
    h = np.where(mx == r, bc - gc, np.where(mx == g, 2 + rc - bc, 4 + gc - rc))
    h = (h / 6.0 % 1.0) * 360
    return np.where(m, h, 0), s, mx

def frames_of_video(p):
    with tempfile.TemporaryDirectory() as td:
        for i, t in enumerate(SAMPLE_T):
            o = pathlib.Path(td) / f"f{i}.png"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", str(p), "-frames:v", "1", str(o)], check=True)
            yield np.asarray(Image.open(o).convert("RGB").resize((584, 384), Image.BILINEAR), dtype=float)

def analyse(pixels):
    """pixels: (N,3) float 0-255"""
    h, s, v = rgb_to_hsv(pixels)
    chrom = (s > 0.35) & (v > 0.18)
    N = len(pixels)
    rec = {"pixels_sampled": int(N), "chromatic_pct": round(100 * chrom.mean(), 2), "bands": {}, "tokens": {}}
    for name, (lo, hi) in BANDS.items():
        inb = ((h >= lo) & (h < hi)) if lo < hi else ((h >= lo) | (h < hi))
        sel = chrom & inb
        pct = 100 * sel.mean()
        d = {"coverage_pct": round(pct, 2)}
        if sel.sum() > 20:
            med = np.median(pixels[sel], 0); d["median_rgb_hex"] = rgb2hex(med); d["median_oklch"] = oklch_str(med)
        rec["bands"][name] = d
    lab = rgb_to_oklab(pixels)
    for tname, thex in TOKENS.items():
        t = rgb_to_oklab(hex2rgb(thex))
        dist = np.linalg.norm(lab - t, axis=1)
        tC = float(np.hypot(t[1], t[2])); pC = np.hypot(lab[:, 1], lab[:, 2])
        chroma_ok = pC >= 0.5 * tC      # reject greys/near-neutrals that sit close to low-chroma tokens in OKLab
        near = (dist < 0.12) & chroma_ok   # perceptual "same colour family" radius in OKLab, chroma-gated
        d = {"token": thex, "pct_within_dE0.12": round(100 * near.mean(), 2), "pct_within_dE0.08": round(100 * ((dist < 0.08) & chroma_ok).mean(), 2)}
        i = int(dist.argmin()); d["nearest_pixel_hex"] = rgb2hex(pixels[i]); d["nearest_pixel_oklch"] = oklch_str(pixels[i]); d["nearest_dE"] = round(float(dist[i]), 4)
        if near.sum() > 20:
            med = np.median(pixels[near], 0); d["measured_median_hex"] = rgb2hex(med); d["measured_median_oklch"] = oklch_str(med)
        rec["tokens"][tname] = d
    return rec

out = {"method": "chromatic = HSV S>0.35 & V>0.18; bands by hue; token proximity = OKLab euclidean distance; videos sampled at t=" + str(SAMPLE_T) + " downscaled to 584x384; photos downscaled to 960px wide", "tokens": {k: {"hex": v, "oklch": oklch_str(hex2rgb(v))} for k, v in TOKENS.items()}, "files": {}}
for p in sorted(VID.glob("*.mp4")):
    px = np.concatenate([f.reshape(-1, 3) for f in frames_of_video(p)])
    out["files"]["videos/" + p.name] = analyse(px)
for p in sorted(PHO.glob("*.jpg")):
    im = Image.open(p).convert("RGB"); im.thumbnail((960, 960))
    out["files"]["photos/" + p.name] = analyse(np.asarray(im, float).reshape(-1, 3))
OUT.write_text(json.dumps(out, indent=1))
for k, r in out["files"].items():
    bands = " ".join(f"{b}={d['coverage_pct']}%{d.get('median_rgb_hex','')}" for b, d in r["bands"].items() if d["coverage_pct"] >= 0.3)
    toks = " ".join(f"{t}:{d['pct_within_dE0.12']}%/{d.get('measured_median_hex','-')}" for t, d in r["tokens"].items())
    print(f"{k:32s} chrom={r['chromatic_pct']:5.1f}% | {bands} | {toks}")
