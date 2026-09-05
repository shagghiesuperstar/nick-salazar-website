// Simulates an autoplay rejection: HTMLMediaElement.play() returns a rejected promise (NotAllowedError).
import { createRequire } from "node:module";
const require = createRequire("/Users/scottscheferman/.hermes/hermes-agent/node_modules/");
const { chromium } = require("playwright");
const out = process.argv[2];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errs.push(m.type() + ": " + m.text()); });
page.on("pageerror", (e) => errs.push("pageerror: " + e.message));
await page.addInitScript(() => {
  HTMLMediaElement.prototype.play = function () { const e = new DOMException("play() failed because the user didn't interact with the document first.", "NotAllowedError"); return Promise.reject(e); };
});
await page.goto("http://127.0.0.1:8131/", { waitUntil: "load" });
await page.waitForTimeout(1200);
await page.evaluate(() => { const p = document.querySelector("#plate-coils"); window.scrollTo(0, p.offsetTop + innerHeight * 0.55); });
await page.waitForTimeout(900);
const r = await page.evaluate(() => [...document.querySelectorAll("video")].map((v) => ({ paused: v.paused, isStatic: v.classList.contains("is-static"), dataStatic: v.dataset.static, hasSrc: !!v.currentSrc, poster: !!v.poster })));
await page.screenshot({ path: out + "/autoplay-rejected-01-plate-held.png" });
console.log(JSON.stringify({ videos: r, consoleErrs: errs }));
await browser.close();
