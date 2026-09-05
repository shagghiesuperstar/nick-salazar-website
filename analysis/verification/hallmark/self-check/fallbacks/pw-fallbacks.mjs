// Fallback-matrix checks with Playwright (chromium already installed under ~/Library/Caches/ms-playwright).
// Usage: NODE_PATH=/Users/scottscheferman/.hermes/hermes-agent/node_modules node pw-fallbacks.mjs <outDir>
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const require = createRequire("/Users/scottscheferman/.hermes/hermes-agent/node_modules/");
const { chromium } = require("playwright");
const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });
const URL = "http://127.0.0.1:8131/";
const log = [];
const note = (k, v) => { log.push({ case: k, ...v }); console.log(k, JSON.stringify(v)); };

async function probe(page) {
  return page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const cs = (s) => getComputedStyle(q(s));
    const errs = window.__errs || [];
    return {
      htmlClass: document.documentElement.className,
      supportsScrollTimeline: CSS.supports("animation-timeline: view()"),
      reduce: matchMedia("(prefers-reduced-motion: reduce)").matches,
      shadeOpacity: cs(".plate .plate__shade").opacity,
      shadeAnim: cs(".plate .plate__shade").animationName,
      pairColor: cs(".plate:not(.plate--hero) .plate__pair").color,
      pairTransform: cs(".plate:not(.plate--hero) .plate__pair").transform,
      mediaTransform: cs(".plate:not(.plate--hero) .plate__media").transform,
      revealOpacity: cs("[data-reveal]").opacity,
      lightDisplay: q(".hero__light") ? cs(".hero__light").display : null,
      videos: [...document.querySelectorAll("video")].map((v) => ({ paused: v.paused, hasSrc: !!v.currentSrc, isStatic: v.classList.contains("is-static"), poster: !!v.poster })),
      docW: document.documentElement.scrollWidth, innerW: innerWidth,
      progressVars: [...document.querySelectorAll("[data-plate]")].map((p) => p.style.getPropertyValue("--progress")),
    };
  });
}
async function run(name, launchOpts, ctxOpts, prep, after) {
  const browser = await chromium.launch({ headless: true, ...launchOpts });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...ctxOpts });
  const page = await ctx.newPage();
  const consoleErrs = [];
  page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") consoleErrs.push(m.type() + ": " + m.text()); });
  page.on("pageerror", (e) => consoleErrs.push("pageerror: " + e.message));
  if (prep) await prep(page, ctx);
  await page.goto(URL, { waitUntil: "load" });
  await page.waitForTimeout(1200);
  const top = await probe(page);
  await page.screenshot({ path: path.join(out, `${name}-00-hero.png`) });
  await page.evaluate(() => { const p = document.querySelector("#plate-coils"); window.scrollTo(0, p.offsetTop + innerHeight * 0.55); });
  await page.waitForTimeout(900);
  const mid = await probe(page);
  await page.screenshot({ path: path.join(out, `${name}-01-plate-held.png`) });
  let extra = {};
  if (after) extra = await after(page);
  note(name, { top, mid, consoleErrs, ...extra });
  await browser.close();
}

(async () => {
  // 1 · reduced motion
  await run("reduced-motion", {}, { reducedMotion: "reduce" }, null);
  // 2 · JavaScript disabled (static state must be legible; CSS scroll timelines still run)
  await run("js-off", {}, { javaScriptEnabled: false }, null);
  // 3 · scroll-timeline unsupported → JS --progress fallback (simulated by stubbing CSS.supports before load)
  await run("no-scroll-timeline", {}, {}, async (page) => {
    await page.addInitScript(() => {
      const orig = CSS.supports.bind(CSS);
      CSS.supports = (a, b) => (typeof a === "string" && a.includes("animation-timeline")) ? false : orig(a, b);
      // also neutralise the native scroll-driven animations so only the fallback drives the layers
      document.addEventListener("DOMContentLoaded", () => {
        const st = document.createElement("style");
        st.textContent = ".plate__media,.plate__shade,.plate__pair,.plate__story,.hero__name,.hero__role{animation:none !important}";
        document.head.appendChild(st);
      });
    });
  }, async (page) => {
    // scrub two positions and report --progress values
    const a = await page.evaluate(() => { const p = document.querySelector("#plate-coils"); window.scrollTo(0, p.offsetTop - innerHeight * 0.5); return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r(p.style.getPropertyValue("--progress"))))); });
    const b = await page.evaluate(() => { const p = document.querySelector("#plate-coils"); window.scrollTo(0, p.offsetTop + innerHeight * 0.6); return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r({ progress: p.style.getPropertyValue("--progress"), shade: getComputedStyle(p.querySelector(".plate__shade")).opacity, pair: getComputedStyle(p.querySelector(".plate__pair")).color, media: getComputedStyle(p.querySelector(".plate__media")).transform })))); });
    await page.screenshot({ path: path.join(out, "no-scroll-timeline-02-scrubbed.png") });
    return { progressEntering: a, progressHeld: b };
  });
  // 4 · autoplay denied (user-gesture policy) → poster stays, .is-static, no page errors
  await run("autoplay-denied", { args: ["--autoplay-policy=user-gesture-required"] }, {}, null);
  // 5 · keyboard: tab order reaches skip link, nav, hero CTA; focus ring visible (screenshot)
  {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(URL, { waitUntil: "load" });
    await page.waitForTimeout(800);
    const seq = [];
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
      seq.push(await page.evaluate(() => { const a = document.activeElement; return a.tagName + "." + (a.className || "").toString().split(" ")[0] + ":" + (a.textContent || "").trim().slice(0, 20) + "|outline=" + getComputedStyle(a).outlineStyle + " " + getComputedStyle(a).outlineColor; }));
    }
    await page.screenshot({ path: path.join(out, "keyboard-00-focus.png") });
    // brief utility: fill, copy (clipboard permission), download
    await page.goto(URL + "#contact", { waitUntil: "load" });
    await page.fill("#bf-cargo", "12 steel coils, 18 t each");
    await page.fill("#bf-where", "Test port");
    await page.selectOption("#bf-service", { index: 3 });
    const output = await page.$eval("#brief-output", (e) => e.textContent);
    const ctx = page.context();
    await ctx.grantPermissions(["clipboard-read", "clipboard-write"], { origin: "http://127.0.0.1:8131" });
    await page.click("#brief-copy");
    await page.waitForTimeout(300);
    const status1 = await page.$eval("#brief-status", (e) => e.textContent);
    const copyState = await page.$eval("#brief-copy", (e) => e.dataset.state + "|" + e.textContent);
    const dl = page.waitForEvent("download", { timeout: 5000 }).catch(() => null);
    await page.click("#brief-download");
    const d = await dl;
    const status2 = await page.$eval("#brief-status", (e) => e.textContent);
    await page.screenshot({ path: path.join(out, "brief-00-after-copy-download.png") });
    note("keyboard-and-brief", { tabSequence: seq, briefOutputHead: output.split("\n").slice(0, 5), status1, copyState, download: d ? d.suggestedFilename() : null, status2 });
    await browser.close();
  }
  fs.writeFileSync(path.join(out, "fallback-matrix-results.json"), JSON.stringify(log, null, 2));
})();
