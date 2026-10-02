// Footer credit check 2026-10-02. Usage: node credit_check.mjs <baseURL> <label>
// Screenshots the footer at 1440 + 390, plus a hover shot; records computed colors/decoration.
import { createRequire } from 'node:module';
const require = createRequire('/Users/scottscheferman/.hermes/hermes-agent/node_modules/');
const { chromium } = require('playwright');
import fs from 'node:fs'; import path from 'node:path';
const BASE = process.argv[2] || 'http://127.0.0.1:8765/';
const LABEL = process.argv[3] || 'local';
const OUT = path.join(path.dirname(new URL(import.meta.url).pathname), LABEL);
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = {};
for (const vp of [{ name: '1440', width: 1440, height: 900, mobile: false }, { name: '390', width: 390, height: 844, mobile: true }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.mobile, hasTouch: vp.mobile, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await sleep(1200);
  const foot = page.locator('footer.foot');
  const link = page.locator('.foot__credit a');
  const read = () => link.evaluate(a => { const s = getComputedStyle(a), p = getComputedStyle(a.parentElement); const r = a.parentElement.getBoundingClientRect(), f = a.closest('footer').getBoundingClientRect();
    return { text: a.parentElement.textContent.trim(), href: a.getAttribute('href'), target: a.target, rel: a.rel, color: s.color, deco: s.textDecorationLine, fontSize: p.fontSize, mediaInCredit: a.parentElement.querySelectorAll('img,svg,picture').length, creditLeft: r.left, creditBottomGap: f.bottom - r.bottom, lines: Math.round(r.height / parseFloat(p.lineHeight || p.fontSize)) }; });
  const accent = await page.evaluate(() => { const d = document.createElement('i'); d.style.color = 'var(--color-accent)'; document.body.append(d); const c = getComputedStyle(d).color; d.remove(); return c; });
  const rest = await read();
  await foot.screenshot({ path: path.join(OUT, `footer-${vp.name}.png`) });
  await link.hover(); await sleep(700);
  const hover = await read();
  await foot.screenshot({ path: path.join(OUT, `footer-${vp.name}-hover.png`) });
  await page.mouse.move(0, 0); await sleep(700);
  await page.locator('.foot__mail').focus(); await page.keyboard.press('Tab'); await sleep(700);
  const focused = await page.evaluate(() => document.activeElement.closest('.foot__credit') ? getComputedStyle(document.activeElement).outlineStyle : 'NOT_FOCUSED:' + document.activeElement.outerHTML.slice(0, 80));
  await foot.screenshot({ path: path.join(OUT, `footer-${vp.name}-focus.png`) });
  report[vp.name] = { accent, rest, hover, focusOutline: focused, hoverIsAccent: hover.color === accent, restIsAccent: rest.color === accent };
  await ctx.close();
}
await browser.close();
fs.writeFileSync(path.join(OUT, 'checks.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
