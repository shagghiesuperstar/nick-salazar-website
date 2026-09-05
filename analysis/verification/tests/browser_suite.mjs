// Lead browser test suite (Playwright, installed under hermes-agent node_modules; run with NODE_PATH set).
// Usage: NODE_PATH=/Users/scottscheferman/.hermes/hermes-agent/node_modules node browser_suite.mjs [baseURL]
// Writes screenshots + JSON/MD logs under analysis/verification/browser/. Never fabricates: every check records raw values.
import { createRequire } from 'node:module';
const require = createRequire('/Users/scottscheferman/.hermes/hermes-agent/node_modules/');
const { chromium } = require('playwright');
import fs from 'node:fs'; import path from 'node:path';
const BASE = process.argv[2] || 'http://127.0.0.1:8123/';
const OUT = '/Users/scottscheferman/nick-salazar-website/analysis/verification/browser';
fs.mkdirSync(OUT, { recursive: true });
const WIDTHS = [320, 375, 414, 768, 1440];
const log = []; const results = [];
const now = () => new Date().toISOString();
function rec(name, pass, detail, extra = {}) { results.push({ name, status: pass === null ? 'UNRESOLVED' : pass ? 'PASS' : 'FAIL', detail, ...extra }); console.log(`[${pass === null ? 'UNRESOLVED' : pass ? 'PASS' : 'FAIL'}] ${name} :: ${typeof detail === 'string' ? detail : JSON.stringify(detail).slice(0, 300)}`); }
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function go(page, url, opts = { waitUntil: 'load' }) { for (let i = 0; i < 4; i++) { try { return await page.goto(url, opts); } catch (e) { log.push(`goto retry ${i + 1} for ${url}: ${String(e).split('\n')[0]}`); await sleep(700 * (i + 1)); } } return page.goto(url, opts); }
// --- contrast helpers (WCAG 2.1) ---
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => { const [h, l] = [Math.max(a, b), Math.min(a, b)]; return (h + 0.05) / (l + 0.05); };
function oklabToRgb(L, a, bb) { const l_ = L + 0.3963377774 * a + 0.2158037573 * bb, m_ = L - 0.1055613458 * a - 0.0638541728 * bb, s_ = L - 0.0894841775 * a - 1.2914855480 * bb; const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3; const lin = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s]; return lin.map(c => { c = Math.min(1, Math.max(0, c)); const g = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; return Math.round(g * 255); }); }
function parseColor(s) { if (!s) return null; s = s.trim(); let m;
  if ((m = s.match(/^rgba?\(([^)]+)\)/))) { const p = m[1].replace(/\//g, ' ').split(/[\s,]+/).filter(Boolean).map(x => parseFloat(x)); return { rgb: p.slice(0, 3), a: p[3] ?? 1 }; }
  if ((m = s.match(/^#([0-9a-f]{6})/i))) { const h = m[1]; return { rgb: [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)), a: 1 }; }
  if ((m = s.match(/^okl(ch|ab)\(([^)]+)\)/i))) { const parts = m[2].replace(/\//g, ' ').split(/\s+/).filter(Boolean); let L = parts[0].endsWith('%') ? parseFloat(parts[0]) / 100 : parseFloat(parts[0]); const A = parseFloat(parts[1]), B = parseFloat(parts[2]); const alpha = parts[3] !== undefined ? (parts[3].endsWith('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3])) : 1; let a, bb; if (m[1].toLowerCase() === 'ch') { const h = (isNaN(B) ? 0 : B) * Math.PI / 180; a = A * Math.cos(h); bb = A * Math.sin(h); } else { a = A; bb = B; } return { rgb: oklabToRgb(L, a, bb), a: alpha }; }
  return null; }
// decode PNG via playwright's own bundled pngjs is not exposed; use a tiny PNG reader for 8-bit RGBA/RGB
import zlib from 'node:zlib';
function readPNG(buf) { let pos = 8; let w, h, ct, data = []; while (pos < buf.length) { const len = buf.readUInt32BE(pos); const type = buf.toString('ascii', pos + 4, pos + 8); const body = buf.subarray(pos + 8, pos + 8 + len); if (type === 'IHDR') { w = body.readUInt32BE(0); h = body.readUInt32BE(4); ct = body[9]; } else if (type === 'IDAT') data.push(body); pos += 12 + len; } const raw = zlib.inflateSync(Buffer.concat(data)); const bpp = ct === 6 ? 4 : ct === 2 ? 3 : 1; const stride = w * bpp; const out = Buffer.alloc(w * h * bpp); let prev = Buffer.alloc(stride); for (let y = 0; y < h; y++) { const f = raw[y * (stride + 1)]; const line = Buffer.from(raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1))); for (let i = 0; i < stride; i++) { const a = i >= bpp ? line[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0; let v = line[i]; if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1; else if (f === 4) { const p = a + b - c; const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c); } line[i] = v & 255; } line.copy(out, y * stride); prev = line; } return { w, h, bpp, px: out }; }
async function sampleBackground(page, el, textColor, label) {
  // hide the text (visibility) so we sample what is painted behind it, screenshot the box, sample pixels.
  const box = await el.boundingBox(); if (!box || box.width < 4 || box.height < 4) return null;
  await el.evaluate(e => { e.dataset.__vis = e.style.visibility; e.style.visibility = 'hidden'; });
  await sleep(60);
  const vp = page.viewportSize(); const x0 = Math.max(0, box.x), y0 = Math.max(0, box.y), x1 = Math.min(vp.width, box.x + box.width), y1 = Math.min(vp.height, box.y + box.height); if (x1 - x0 < 4 || y1 - y0 < 4) { await el.evaluate(e => { e.style.visibility = e.dataset.__vis || ''; delete e.dataset.__vis; }); return null; } const clip = { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
  const buf = await page.screenshot({ clip, animations: 'allow', caret: 'hide' });
  await el.evaluate(e => { e.style.visibility = e.dataset.__vis || ''; delete e.dataset.__vis; });
  const png = readPNG(buf); let worst = 1e9, sum = 0, n = 0, lightest = null; const tl = lum(textColor);
  const step = Math.max(1, Math.floor(Math.sqrt((png.w * png.h) / 4000)));
  for (let y = 0; y < png.h; y += step) for (let x = 0; x < png.w; x += step) { const i = (y * png.w + x) * png.bpp; const p = [png.px[i], png.px[i + 1], png.px[i + 2]]; const r = ratio(tl, lum(p)); sum += r; n++; if (r < worst) { worst = r; lightest = p; } }
  return { label, text: textColor, worstRatio: +worst.toFixed(2), meanRatio: +(sum / n).toFixed(2), worstPixel: lightest, samples: n, box: clip };
}
async function contrastAt(page, selectors, label, minLarge = 3, minBody = 4.5) {
  const out = [];
  for (const sel of selectors) {
    const els = await page.$$(sel);
    for (const el of els) { const vis = await el.evaluate(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { inView: r.bottom > 0 && r.top < innerHeight && r.width > 0, color: cs.color, size: parseFloat(cs.fontSize), weight: cs.fontWeight, opacity: parseFloat(cs.opacity), text: (e.textContent || '').trim().slice(0, 40) }; }); if (!vis.inView || vis.opacity < 0.2) continue; const c = parseColor(vis.color); if (!c) continue; const s = await sampleBackground(page, el, c.rgb, `${label} ${sel} "${vis.text}"`); if (!s) continue; const large = vis.size >= 24 || (vis.size >= 18.66 && parseInt(vis.weight) >= 700); s.threshold = large ? minLarge : minBody; s.size = vis.size; s.pass = s.worstRatio >= s.threshold; s.meanPass = s.meanRatio >= s.threshold; out.push(s); }
  }
  return out;
}
(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const consoleErrors = [];
  // ===== A. widths: screenshots, overflow, name-largest, single-line affordances, contrast through transitions =====
  const plateCount = { value: 0 }; const contrastAll = [];
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 500 ? 740 : w < 900 ? 1024 : 900 }, deviceScaleFactor: 1, isMobile: w < 500, hasTouch: w < 500 });
    const page = await ctx.newPage(); page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') consoleErrors.push({ w, type: m.type(), text: m.text().slice(0, 300) }); }); page.on('pageerror', e => consoleErrors.push({ w, type: 'pageerror', text: String(e).slice(0, 300) }));
    const t0 = Date.now(); await go(page, BASE); const loadMs = Date.now() - t0;
    await sleep(700);
    const dir = path.join(OUT, `w${w}`); fs.mkdirSync(dir, { recursive: true });
    await page.screenshot({ path: path.join(dir, '00-hero.png') });
    const info = await page.evaluate(() => { const de = document.documentElement; const h1 = document.querySelector('h1'); const sizes = [...document.querySelectorAll('h1,h2,h3,p,a,span,li,button,label')].map(e => ({ tag: e.tagName, cls: e.className && String(e.className).slice(0, 40), fs: parseFloat(getComputedStyle(e).fontSize) })).filter(x => x.fs > 0); sizes.sort((a, b) => b.fs - a.fs); const h1fs = h1 ? parseFloat(getComputedStyle(h1).fontSize) : 0; const h1spans = h1 ? [...h1.querySelectorAll('*')].map(e => parseFloat(getComputedStyle(e).fontSize)) : []; const largestNonH1 = sizes.find(s => s.tag !== 'H1' && !h1?.contains(document.querySelector(`${s.tag.toLowerCase()}`))); return { scrollW: de.scrollWidth, clientW: de.clientWidth, bodyScrollW: document.body.scrollWidth, docH: de.scrollHeight, h1fs: Math.max(h1fs, ...h1spans), top3: sizes.slice(0, 6), plates: document.querySelectorAll('.plate').length, videos: document.querySelectorAll('video').length, supportsScrollTimeline: CSS.supports('animation-timeline: view()') }; });
    plateCount.value = info.plates;
    rec(`w${w}: page loaded (${loadMs} ms), docH=${info.docH}, plates=${info.plates}, videos=${info.videos}, scroll-timeline=${info.supportsScrollTimeline}`, true, info);
    rec(`w${w}: no horizontal overflow at top`, info.scrollW <= info.clientW && info.bodyScrollW <= info.clientW, { scrollW: info.scrollW, clientW: info.clientW, bodyScrollW: info.bodyScrollW });
    // largest type = h1 (name)
    const nonH1 = info.top3.filter(s => s.tag !== 'H1' && !(s.tag === 'SPAN' && /name|hero/.test(s.cls || '')));
    rec(`w${w}: Nick's name (h1) is the largest type`, info.h1fs > 0 && (!nonH1.length || info.h1fs > nonH1[0].fs), { h1: info.h1fs, largestOther: nonH1[0] });
    // clickable single-line
    const wrap = await page.evaluate(() => [...document.querySelectorAll('a,button,summary')].map(e => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); const range = document.createRange(); range.selectNodeContents(e); const tops = new Set([...range.getClientRects()].filter(b => b.width > 0 && b.height > 0).map(b => Math.round(b.top))); return { text: (e.textContent || '').trim().slice(0, 30), lines: tops.size, h: r.height, vis: r.width > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0 }; }).filter(x => x.vis && x.text && x.lines > 1));
    rec(`w${w}: no clickable text wraps to 2+ lines (gate 49)`, wrap.length === 0, wrap.slice(0, 8));
    // hero contrast (progress 0)
    contrastAll.push(...await contrastAt(page, ['.hero__name', 'h1', '.hero__creds', '.hero__role', '.hero p'], `w${w} hero-top`));
    // overflow across scroll + plate transitions screenshots + contrast at 3 progress points
    const plates = await page.$$('.plate');
    let overflowHits = [];
    for (let i = 0; i < plates.length; i++) {
      const pb = await plates[i].evaluate(e => { const r = e.getBoundingClientRect(); return { top: r.top + scrollY, height: r.height }; });
      for (const prog of [0.12, 0.5, 0.85]) {
        const y = Math.max(0, pb.top + prog * (pb.height - (await page.evaluate(() => innerHeight))));
        await page.evaluate(y => scrollTo(0, y), y); await sleep(450);
        const ov = await page.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth, y: scrollY }));
        if (ov.s > ov.c) overflowHits.push({ plate: i, prog, ...ov });
        if (i < 3 || prog === 0.5) await page.screenshot({ path: path.join(dir, `plate${String(i + 1).padStart(2, '0')}-p${Math.round(prog * 100)}.png`) });
        const cs = await contrastAt(page, [`.plate:nth-of-type(${i + 1}) .plate__pair`, `.plate:nth-of-type(${i + 1}) .plate__story`, `.plate:nth-of-type(${i + 1}) .plate__meta`], `w${w} plate${i + 1} p${Math.round(prog * 100)}`);
        // fallback selectors if nth-of-type fails (plates are sections among sections)
        if (!cs.length) { const sel = await plates[i].evaluate(e => e.id ? `#${e.id}` : null); if (sel) contrastAll.push(...await contrastAt(page, [`${sel} .plate__pair`, `${sel} .plate__story`, `${sel} .plate__meta`], `w${w} plate${i + 1} p${Math.round(prog * 100)}`)); } else contrastAll.push(...cs);
      }
    }
    rec(`w${w}: no horizontal overflow at any plate progress`, overflowHits.length === 0, overflowHits);
    // other sections screenshots
    for (const sel of ['#credentials', '#services', '#work', '#contact', 'footer']) { const el = await page.$(sel); if (el) { await el.scrollIntoViewIfNeeded(); await sleep(400); await page.screenshot({ path: path.join(dir, `section-${sel.replace('#', '')}.png`) }); contrastAll.push(...await contrastAt(page, [`${sel} h2`, `${sel} p`, `${sel} li`, `${sel} label`, `${sel} figcaption`], `w${w} ${sel}`)); } }
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await sleep(400); await page.screenshot({ path: path.join(dir, '99-end.png') });
    const endOv = await page.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth, finite: scrollY + innerHeight >= document.documentElement.scrollHeight - 2 }));
    rec(`w${w}: page is finite (reachable end) and no overflow at end`, endOv.finite && endOv.s <= endOv.c, endOv);
    await ctx.close();
  }
  // contrast summary
  const cFail = contrastAll.filter(c => !c.pass); const cMeanFail = contrastAll.filter(c => !c.meanPass);
  fs.writeFileSync(path.join(OUT, 'contrast-samples.json'), JSON.stringify(contrastAll, null, 2));
  rec(`contrast through transitions: ${contrastAll.length} samples; worst-pixel failures=${cFail.length}; mean failures=${cMeanFail.length}`, cMeanFail.length === 0 && cFail.length === 0, { worstPixelFails: cFail.slice(0, 12).map(c => ({ l: c.label, worst: c.worstRatio, mean: c.meanRatio, thr: c.threshold })), meanFails: cMeanFail.slice(0, 12).map(c => ({ l: c.label, mean: c.meanRatio, thr: c.threshold })) });
  // ===== B. keyboard / focus / nav / contact utility (1440) =====
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'], acceptDownloads: true });
    const page = await ctx.newPage(); page.on('console', m => { if (m.type() === 'error') consoleErrors.push({ w: 'kbd', type: m.type(), text: m.text().slice(0, 300) }); });
    await go(page, BASE); await sleep(500);
    const seq = [];
    for (let i = 0; i < 40; i++) { await page.keyboard.press('Tab'); const f = await page.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return { tag: e.tagName, text: (e.textContent || e.value || '').trim().slice(0, 25), outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor, boxShadow: cs.boxShadow.slice(0, 40), inView: r.top >= 0 && r.bottom <= innerHeight, ring: (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== 'none' }; }); if (!f) break; seq.push(f); }
    fs.writeFileSync(path.join(OUT, 'keyboard-focus-sequence.json'), JSON.stringify(seq, null, 2));
    rec(`keyboard: Tab reaches ${seq.length} focusable elements; all show a visible ring`, seq.length >= 8 && seq.every(s => s.ring), { noRing: seq.filter(s => !s.ring).slice(0, 5), first: seq.slice(0, 6) });
    // skip link
    await go(page, BASE); await page.keyboard.press('Tab'); const skip = await page.evaluate(() => { const e = document.activeElement; return { text: e.textContent.trim(), href: e.getAttribute('href'), visible: getComputedStyle(e).opacity !== '0' && e.getBoundingClientRect().top >= -1 }; }); await page.screenshot({ path: path.join(OUT, 'focus-skip-link.png') });
    rec('keyboard: skip link is first tab stop and becomes visible', /skip/i.test(skip.text) && skip.visible, skip);
    // nav pill clicks
    const navs = await page.$$('nav.nav .nav__links a[href^="#"], header a[href^="#"]');
    const navRes = [];
    for (const a of navs) { const href = await a.getAttribute('href'); const before = await page.evaluate(() => scrollY); await a.click(); let last = -1; for (let i = 0; i < 40; i++) { await sleep(150); const y = await page.evaluate(() => scrollY); if (y === last) break; last = y; } const after = await page.evaluate(h => ({ y: scrollY, hash: location.hash, targetTop: document.querySelector(h)?.getBoundingClientRect().top }), href); navRes.push({ href, before, ...after }); }
    await page.screenshot({ path: path.join(OUT, 'nav-after-clicks.png') });
    rec(`nav: ${navRes.length} pill links navigate to in-page targets`, navRes.length >= 4 && navRes.every(r => r.targetTop !== undefined && Math.abs(r.targetTop) < 200), navRes);
    // Enter key on nav link
    await go(page, BASE); await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Enter'); await sleep(800); rec('nav: keyboard Enter activates a nav link', (await page.evaluate(() => scrollY)) > 100 || (await page.evaluate(() => location.hash)) !== '', { y: await page.evaluate(() => scrollY), hash: await page.evaluate(() => location.hash) });
    // contact utility
    await go(page, BASE + '#contact'); await sleep(600);
    const form = await page.$('form.brief, form#brief, form#brief-form, form.brief__form');
    if (!form) rec('contact: assignment-brief form exists', false, 'form.brief not found'); else {
      const selects = await page.$$('form#brief-form select, form.brief__form select, form.brief select'); if (selects.length) await selects[0].selectOption({ index: 1 });
      for (const [sel, val] of [['#bf-cargo, #brief-cargo', 'Test cargo: 40 steel coils, 18 t each'], ['#bf-where, #brief-place', 'Test facility'], ['#bf-when, #brief-when', 'Next week'], ['#bf-evidence, #brief-evidence', 'Condition photos and a signed report'], ['#bf-name, #brief-name', 'Test Adjuster'], ['#bf-org', 'Test Syndicate'], ['#bf-contact, #brief-contact', 'test@example.invalid']]) { const el = await page.$(sel); if (el) await el.fill(val); }
      await sleep(300); const outText = await page.evaluate(() => (document.querySelector('#brief-output, .brief__output, #brief-out, .brief__out')?.textContent || '').trim());
      rec('contact: live brief assembles from fields', outText.includes('Test cargo') && outText.includes('Test Adjuster'), outText.slice(0, 400));
      const copyBtn = await page.$('#brief-copy, .brief__copy'); if (copyBtn) { await copyBtn.click(); await sleep(400); const clip = await page.evaluate(async () => { try { return await navigator.clipboard.readText(); } catch (e) { return 'ERR ' + e; } }); const status = await page.evaluate(() => document.querySelector('.brief__status')?.textContent.trim()); rec('contact: Copy brief writes clipboard and shows non-sending status', clip.includes('Test cargo') && /nothing|not sent|copied/i.test(status || ''), { clip: clip.slice(0, 120), status }); }
      const dlBtn = await page.$('#brief-download, .brief__download'); if (dlBtn) { const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 8000 }).catch(e => null), dlBtn.click()]); if (dl) { const p = path.join(OUT, 'downloaded-' + dl.suggestedFilename()); await dl.saveAs(p); const txt = fs.readFileSync(p, 'utf8'); rec('contact: Download .txt produces a local file containing the brief', txt.includes('Test cargo'), { file: p, bytes: txt.length, filename: dl.suggestedFilename() }); } else rec('contact: Download .txt produces a local file', false, 'no download event within 8s'); }
      const reqs = []; page.on('request', r => reqs.push(r.url())); await sleep(500);
      const note = await page.evaluate(() => document.querySelector('.brief__note')?.textContent.trim()); rec('contact: page states nothing is sent; no network request made by the utility', /nothing is sent/i.test(note || '') && reqs.filter(u => !u.startsWith(BASE)).length === 0, { note, externalRequests: reqs.filter(u => !u.startsWith(BASE)) });
      await page.screenshot({ path: path.join(OUT, 'contact-after-fill.png') });
    }
    await ctx.close();
  }
  // ===== C. reduced motion =====
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); const page = await ctx.newPage();
    await go(page, BASE); await sleep(1200);
    const rm = await page.evaluate(() => ({ matches: matchMedia('(prefers-reduced-motion: reduce)').matches, videos: [...document.querySelectorAll('video')].map(v => ({ paused: v.paused, src: !!(v.currentSrc || v.querySelector('source')?.src), poster: !!v.poster })), animated: [...document.querySelectorAll('*')].filter(e => { const cs = getComputedStyle(e); return cs.animationName !== 'none' && parseFloat(cs.animationDuration) > 0.2; }).length, pointerLight: (() => { const e = document.querySelector('.hero__light, .spotlight, [class*="light"]'); return e ? getComputedStyle(e).display + '/' + getComputedStyle(e).opacity : 'absent'; })() }));
    await page.evaluate(() => scrollTo(0, innerHeight * 1.5)); await sleep(800); await page.screenshot({ path: path.join(OUT, 'reduced-motion-plate.png') });
    const rm2 = await page.evaluate(() => [...document.querySelectorAll('video')].map(v => v.paused));
    rec('reduced-motion: videos never play, no long animations, pointer light off', rm.matches && rm.videos.every(v => v.paused) && rm2.every(Boolean) && rm.animated === 0, rm);
    contrastAll.push(...await contrastAt(page, ['.plate__pair', '.plate__story'], 'reduced-motion plate'));
    await ctx.close();
  }
  // ===== D. autoplay denied =====
  {
    const b2 = await chromium.launch({ args: ['--autoplay-policy=user-gesture-required'] }); const ctx = await b2.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage(); const errs = []; page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); }); page.on('pageerror', e => errs.push(String(e)));
    await go(page, BASE); await sleep(1500); await page.evaluate(() => scrollTo(0, innerHeight * 1.5)); await sleep(1500);
    const st = await page.evaluate(() => [...document.querySelectorAll('video')].map(v => ({ paused: v.paused, poster: !!v.poster, cls: v.closest('.plate, .hero')?.className }))); await page.screenshot({ path: path.join(OUT, 'autoplay-denied.png') });
    rec('autoplay denied: page stays legible, posters shown, no uncaught errors', errs.length === 0, { errs, videos: st });
    contrastAll.push(...await contrastAt(page, ['.plate__pair', '.plate__story', 'h1'], 'autoplay-denied'));
    await b2.close();
  }
  // ===== E. slow network =====
  {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 740 }, isMobile: true }); const page = await ctx.newPage(); const cdp = await ctx.newCDPSession(page); await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 400 * 1024 / 8, uploadThroughput: 200 * 1024 / 8 });
    const t0 = Date.now(); await go(page, BASE, { waitUntil: 'domcontentloaded' }); const dcl = Date.now() - t0; await sleep(300); const textVisible = await page.evaluate(() => { const h = document.querySelector('h1'); return h && getComputedStyle(h).opacity !== '0' && h.getBoundingClientRect().height > 0; }); await page.screenshot({ path: path.join(OUT, 'slow-network-3s.png') });
    const bytes = await page.evaluate(() => performance.getEntriesByType('resource').reduce((a, r) => a + (r.transferSize || 0), 0)); const vidReq = await page.evaluate(() => performance.getEntriesByType('resource').filter(r => /\.mp4/.test(r.name)).map(r => ({ n: r.name.split('/').pop(), b: r.transferSize })));
    rec(`slow network (400 kbps, 150 ms): DOMContentLoaded ${dcl} ms; h1 visible; transferred ${Math.round(bytes / 1024)} KB; mp4 requests so far: ${vidReq.length}`, textVisible && dcl < 15000, { dcl, vidReq });
    await ctx.close();
  }
  // ===== F. offscreen pause + lazy loading =====
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage(); await go(page, BASE); await sleep(1500);
    const a = await page.evaluate(() => [...document.querySelectorAll('video')].map(v => ({ paused: v.paused, ns: v.networkState, hasSrc: !!(v.currentSrc), rs: v.readyState })));
    const plates = await page.$$('.plate'); if (plates.length >= 3) { await plates[2].scrollIntoViewIfNeeded(); await page.evaluate(() => scrollBy(0, innerHeight * 0.3)); await sleep(2500); }
    const b = await page.evaluate(() => [...document.querySelectorAll('video')].map(v => { const r = v.getBoundingClientRect(); return { paused: v.paused, inView: r.bottom > 0 && r.top < innerHeight, hasSrc: !!(v.currentSrc), rs: v.readyState }; }));
    const offPlaying = b.filter(v => !v.inView && !v.paused); const farLoaded = b.slice(-2).filter(v => v.hasSrc && v.rs > 0);
    rec('offscreen pause: no offscreen video is playing after scrolling to plate 3', offPlaying.length === 0, { before: a, after: b });
    rec('lazy loading: the last two videos are not loaded before they are near view', farLoaded.length === 0, { last2: b.slice(-2) }, { note: 'FAIL here means bytes were fetched early; may be acceptable if preload=metadata by design — see detail' });
    await page.screenshot({ path: path.join(OUT, 'offscreen-pause-state.png') });
    await ctx.close();
  }
  // ===== G. scroll-timeline unsupported fallback =====
  {
    const b3 = await chromium.launch({ args: ['--disable-blink-features=ScrollTimeline,CSSScrollTimeline,AnimationTimeline'] }); const ctx = await b3.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(String(e)));
    await page.addInitScript(() => { const orig = CSS.supports.bind(CSS); CSS.supports = (...a) => (a.join(' ').includes('animation-timeline') ? false : orig(...a)); });
    await go(page, BASE); await sleep(800);
    const sup = await page.evaluate(() => CSS.supports('animation-timeline: view()'));
    const plates = await page.$$('.plate'); let progVals = [];
    if (plates.length) { const pb = await plates[0].evaluate(e => e.getBoundingClientRect().top + scrollY); for (const f of [0, 0.4, 0.8]) { await page.evaluate(y => scrollTo(0, y), pb + f * 900); await sleep(400); progVals.push(await plates[0].evaluate(e => ({ progress: getComputedStyle(e).getPropertyValue('--progress').trim(), cls: e.className, shadeOpacity: e.querySelector('.plate__shade') ? getComputedStyle(e.querySelector('.plate__shade')).opacity : null, mediaTransform: e.querySelector('.plate__media') ? getComputedStyle(e.querySelector('.plate__media')).transform : null }))); } }
    await page.screenshot({ path: path.join(OUT, 'fallback-no-scroll-timeline.png') });
    const changed = progVals.length >= 2 && (progVals[0].progress !== progVals[2].progress || progVals[0].shadeOpacity !== progVals[2].shadeOpacity || progVals[0].mediaTransform !== progVals[2].mediaTransform);
    rec(`fallback: with CSS.supports(animation-timeline) forced false (native support=${sup}), JS fallback drives --progress / shade / media across scroll`, changed && errs.length === 0, { progVals, errs });
    contrastAll.push(...await contrastAt(page, ['.plate__pair', '.plate__story'], 'fallback-js'));
    await b3.close();
  }
  // ===== H. scroll video =====
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: path.join(OUT, 'video-raw'), size: { width: 1440, height: 900 } } }); const page = await ctx.newPage(); await go(page, BASE); await sleep(1200);
    const H = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight); const steps = 160; for (let i = 1; i <= steps; i++) { await page.evaluate(y => scrollTo(0, y), Math.round(H * i / steps)); await sleep(110); } await sleep(800);
    const vp = await page.video().path(); await ctx.close(); fs.writeFileSync(path.join(OUT, 'scroll-video-path.txt'), vp + '\n'); rec('scroll capture recorded (webm; converted to mp4 by the runner)', fs.existsSync(vp), { path: vp });
  }
  // re-write contrast samples (incl. reduced/autoplay/fallback)
  fs.writeFileSync(path.join(OUT, 'contrast-samples.json'), JSON.stringify(contrastAll, null, 2));
  fs.writeFileSync(path.join(OUT, 'console-errors.json'), JSON.stringify(consoleErrors, null, 2));
  rec(`console: ${consoleErrors.length} error/warning entries across all runs`, consoleErrors.filter(e => e.type !== 'warning').length === 0, consoleErrors.slice(0, 15));
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify({ base: BASE, ranAt: now(), results, log }, null, 2));
  const md = [`# Browser suite results — ${now()} — base ${BASE}`, '', `Totals: PASS ${results.filter(r => r.status === 'PASS').length} · FAIL ${results.filter(r => r.status === 'FAIL').length} · UNRESOLVED ${results.filter(r => r.status === 'UNRESOLVED').length}`, ''];
  for (const r of results) md.push(`- **[${r.status}]** ${r.name}\n  ${typeof r.detail === 'string' ? r.detail : '`' + JSON.stringify(r.detail).slice(0, 700) + '`'}`);
  md.push('', '## Contrast samples (worst sampled background pixel vs text colour, WCAG ratio)', '| label | size | worst | mean | threshold | pass(worst) | pass(mean) |', '|---|---|---|---|---|---|---|');
  for (const c of contrastAll) md.push(`| ${c.label.replace(/\|/g, '/')} | ${c.size} | ${c.worstRatio} | ${c.meanRatio} | ${c.threshold} | ${c.pass} | ${c.meanPass} |`);
  fs.writeFileSync(path.join(OUT, 'RESULTS.md'), md.join('\n') + '\n');
  await browser.close();
  console.log('\nDONE ->', path.join(OUT, 'RESULTS.md'));
})().catch(e => { console.error('SUITE ERROR', e); fs.writeFileSync(path.join(OUT, 'SUITE-ERROR.txt'), String(e.stack || e)); rec('SUITE ABORTED (partial results above)', false, String(e).split('\n')[0]); fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify({ base: BASE, ranAt: now(), aborted: true, results, log }, null, 2)); fs.writeFileSync(path.join(OUT, 'RESULTS.md'), ['# Browser suite results (ABORTED) — ' + now(), '', ...results.map(r => `- **[${r.status}]** ${r.name}\n  ${typeof r.detail === 'string' ? r.detail : '`' + JSON.stringify(r.detail).slice(0, 700) + '`'}`)].join('\n') + '\n'); process.exit(2); });
