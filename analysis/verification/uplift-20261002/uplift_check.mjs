// Uplift 2026-10-02 browser check. Real Chrome (channel 'chrome', so H.264 plates play).
// Usage: node uplift_check.mjs [baseURL] [label]
// Writes screenshots + checks.json next to this file. Records raw values; never asserts without measuring.
import { createRequire } from 'node:module';
const require = createRequire('/Users/scottscheferman/.hermes/hermes-agent/node_modules/');
const { chromium } = require('playwright');
import fs from 'node:fs'; import path from 'node:path';
const BASE = process.argv[2] || 'http://127.0.0.1:8131/';
const LABEL = process.argv[3] || 'local';
const OUT = path.join(path.dirname(new URL(import.meta.url).pathname), 'shots-' + LABEL);
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const results = [];
const rec = (name, pass, detail) => { results.push({ name, status: pass ? 'PASS' : 'FAIL', detail }); console.log(`[${pass ? 'PASS' : 'FAIL'}] ${name} :: ${JSON.stringify(detail).slice(0, 400)}`); };

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const consoleIssues = [];

async function scrollThrough(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = page.viewportSize().height;
  for (let y = 0; y <= h; y += Math.round(vh * 0.5)) { await page.evaluate(yy => window.scrollTo(0, yy), y); await sleep(120); }
}

for (const vp of [{ name: 'mobile-390', width: 390, height: 844, mobile: true }, { name: 'desktop-1440', width: 1440, height: 900, mobile: false }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.mobile, hasTouch: vp.mobile, deviceScaleFactor: vp.mobile ? 2 : 1, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) consoleIssues.push({ vp: vp.name, type: m.type(), text: m.text() }); });
  page.on('pageerror', e => consoleIssues.push({ vp: vp.name, type: 'pageerror', text: String(e) }));
  page.on('requestfailed', r => consoleIssues.push({ vp: vp.name, type: 'requestfailed', text: r.url() + ' ' + (r.failure() && r.failure().errorText) }));
  page.on('response', r => { if (r.status() >= 400) consoleIssues.push({ vp: vp.name, type: 'http' + r.status(), text: r.url() }); });
  await page.goto(BASE, { waitUntil: 'load' });
  await sleep(2500);
  await page.screenshot({ path: path.join(OUT, `${vp.name}-01-hero.png`) });
  const hero = await page.evaluate(() => {
    const m = document.querySelector('.plate--hero .plate__media');
    const v = m.querySelector('video'); const p = m.querySelector('.plate__poster');
    return { playing: m.classList.contains('is-playing'), paused: v.paused, t: v.currentTime, posterOpacity: getComputedStyle(p).opacity, static: v.classList.contains('is-static') };
  });
  rec(`${vp.name}: hero video plays and poster crossfades out`, hero.playing && !hero.paused && hero.posterOpacity === '0', hero);
  const navTop = await page.evaluate(() => document.querySelector('[data-nav]').className);
  // scroll a little: nav condenses
  await page.evaluate(() => window.scrollTo(0, 60)); await sleep(500);
  const navScrolled = await page.evaluate(() => { const n = document.querySelector('[data-nav]'); return { cls: n.className, shadow: getComputedStyle(n).boxShadow.slice(0, 40), radius: getComputedStyle(n).borderRadius }; });
  rec(`${vp.name}: nav condenses after scroll`, !navTop.includes('is-scrolled') && navScrolled.cls.includes('is-scrolled') && navScrolled.shadow !== 'none', { navTop, navScrolled });
  // progress hairline
  const prog = await page.evaluate(() => { const s = getComputedStyle(document.body, '::before'); return { content: s.content, height: s.height, anim: s.animationName, timeline: s.animationTimeline, bg: s.backgroundColor }; });
  rec(`${vp.name}: scroll-progress hairline present`, prog.anim === 'read-progress' && prog.height === '2px', prog);
  // shots of each section
  for (const id of ['plate-coils', 'credentials', 'services', 'work', 'why', 'contact']) {
    await page.evaluate(i => { const el = document.getElementById(i); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + (el.classList.contains('plate') ? el.offsetHeight * 0.45 : 0)); }, id);
    await sleep(1600);
    await page.screenshot({ path: path.join(OUT, `${vp.name}-02-${id}.png`) });
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await sleep(1200);
  await page.screenshot({ path: path.join(OUT, `${vp.name}-03-footer.png`) });
  const progEnd = await page.evaluate(() => getComputedStyle(document.body, '::before').transform);
  rec(`${vp.name}: progress hairline full at page end`, /matrix\(1, 0, 0, 1/.test(progEnd), progEnd);
  // reveals all in after scroll-through; section title rule drawn
  await scrollThrough(page); await sleep(1200);
  const rev = await page.evaluate(() => ({ total: document.querySelectorAll('[data-reveal]').length, inCount: document.querySelectorAll('[data-reveal].in').length, ruleTransforms: [...document.querySelectorAll('.section__title')].map(t => getComputedStyle(t, '::before').transform) }));
  rec(`${vp.name}: all reveals fired; title rules drawn`, rev.total === rev.inCount && rev.ruleTransforms.every(t => t === 'none'), rev);
  // horizontal overflow
  const ov = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  rec(`${vp.name}: no horizontal overflow`, ov.sw <= ov.cw, ov);
  // CLS observed over a fresh load + scroll
  const p2 = await ctx.newPage();
  await p2.addInitScript(() => { window.__cls = 0; new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); });
  await p2.goto(BASE, { waitUntil: 'load' }); await sleep(1500); await scrollThrough(p2); await sleep(800);
  const cls = await p2.evaluate(() => window.__cls);
  rec(`${vp.name}: cumulative layout shift`, cls < 0.1, { cls });
  await p2.close();
  // full page (after reveals fired; sticky plates will appear as their frames)
  await page.evaluate(() => window.scrollTo(0, 0)); await sleep(600);
  await page.screenshot({ path: path.join(OUT, `${vp.name}-00-fullpage.png`), fullPage: true });
  // keyboard: first Tab lands on skip link, which becomes visible
  await page.keyboard.press('Tab'); await sleep(200);
  const skip = await page.evaluate(() => ({ active: document.activeElement.className, top: document.activeElement.getBoundingClientRect().top, outline: getComputedStyle(document.activeElement).outlineStyle }));
  rec(`${vp.name}: Tab → visible skip link with focus ring`, skip.active === 'skip' && skip.top >= 0 && skip.outline === 'solid', skip);
  await ctx.close();
}

// Reduced motion
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', e => consoleIssues.push({ vp: 'reduced', type: 'pageerror', text: String(e) }));
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) consoleIssues.push({ vp: 'reduced', type: m.type(), text: m.text() }); });
  await page.goto(BASE, { waitUntil: 'load' }); await sleep(2000);
  const r = await page.evaluate(() => {
    const v = document.querySelector('.plate--hero video');
    const pair = document.querySelector('#plate-coils .plate__pair');
    const rv = document.querySelector('.section__lede[data-reveal]');
    return {
      videoPaused: v.paused, videoStatic: v.classList.contains('is-static'), srcAttached: [...document.querySelectorAll('video source')].filter(s => s.src).length,
      posterOpacity: getComputedStyle(document.querySelector('.plate--hero .plate__poster')).opacity,
      progressAnim: getComputedStyle(document.body, '::before').animationName, progressContent: getComputedStyle(document.body, '::before').content,
      pairAnim: getComputedStyle(pair).animationName, pairTransform: getComputedStyle(pair).transform,
      revealTransform: getComputedStyle(rv).transform, revealTransition: getComputedStyle(rv).transition,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      workImgTransition: getComputedStyle(document.querySelector('.work__img')).transitionDuration,
    };
  });
  rec('reduced-motion: video static, poster shown, no progress bar, no plate animation, no reveal travel, auto scroll',
    r.videoPaused && r.videoStatic && r.posterOpacity === '1' && (r.progressContent === 'none' || r.progressContent === 'normal') && r.pairAnim === 'none' && r.pairTransform === 'none' && r.revealTransform === 'none' && r.scrollBehavior === 'auto', r);
  await page.screenshot({ path: path.join(OUT, `reduced-1440-01-hero.png`) });
  await ctx.close();
}

// Content checks on rendered DOM text + attributes
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  const c = await page.evaluate(() => {
    const html = document.documentElement.outerHTML; const text = document.body.innerText;
    const why = [...document.querySelectorAll('.why__point')].find(a => /No side to take/i.test(a.textContent));
    const banned = /EIMC|AI-generated|\bAI\b|generated|illustration|rendering/i;
    const alts = [...document.querySelectorAll('[alt]')].map(e => e.getAttribute('alt')).filter(a => banned.test(a));
    const metas = [...document.querySelectorAll('meta[content]')].map(e => e.content).filter(a => banned.test(a));
    const ld = document.querySelector('script[type="application/ld+json"]').textContent;
    return { textBanned: (text.match(new RegExp(banned.source, 'gi')) || []), alts, metas, ldBanned: banned.test(ld), whyText: why && why.querySelector('.why__text').textContent, decade: [...document.querySelectorAll('.facts__desc p')].map(p => p.textContent).find(t => /decade/.test(t)), captions: [...document.querySelectorAll('.plate__meta')].map(p => p.textContent) };
  });
  rec('content: no banned terms in visible text / alt / meta / JSON-LD', c.textBanned.length === 0 && c.alts.length === 0 && c.metas.length === 0 && !c.ldBanned, c);
  rec('content: non-biased inside No side to take; decade line without EIMC', /non-biased/.test(c.whyText || '') && c.decade === 'A decade surveying cargo.', { why: c.whyText, decade: c.decade });
  await ctx.close();
}
rec('console: no errors/warnings/failed requests (all contexts)', consoleIssues.length === 0, consoleIssues);
await browser.close();
fs.writeFileSync(path.join(OUT, 'checks.json'), JSON.stringify({ base: BASE, at: new Date().toISOString(), results }, null, 2));
const fails = results.filter(r => r.status !== 'PASS').length;
console.log(`\n${results.length - fails}/${results.length} PASS -> ${OUT}`);
process.exit(fails ? 1 : 0);
