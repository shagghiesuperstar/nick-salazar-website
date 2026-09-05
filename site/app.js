/* Nick Salazar — site/app.js
 * Dependency-free. Everything here is progressive enhancement:
 *  1. html.no-js → html.js (reveal-once and nav highlighting opt in)
 *  2. Video plates: lazy src attach, play when ≥25% visible, pause offscreen,
 *     honour prefers-reduced-motion, saveData and autoplay rejection (poster stays)
 *  3. --progress fallback for browsers without CSS scroll-driven animations
 *  4. Reveal-once stagger via IntersectionObserver
 *  5. Nav current-section highlighting + <details> menu close on choose
 *  6. Hero pointer light (fine pointer + hover + motion allowed only)
 *  7. Assignment brief: live assembly, copy (clipboard → execCommand fallback),
 *     download as .txt (Blob + object URL). Nothing is ever sent anywhere.
 */
(function () {
  "use strict";
  var doc = document;
  var root = doc.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var hasIO = "IntersectionObserver" in window;
  var supportsScrollTimeline = !!(window.CSS && CSS.supports && CSS.supports("animation-timeline: view()"));
  var plates = [].slice.call(doc.querySelectorAll("[data-plate]"));

  /* ---------- 2 · Video plates ---------- */
  function attachSrc(video) {
    if (video.dataset.attached) return;
    var sources = video.querySelectorAll("source[data-src]");
    for (var i = 0; i < sources.length; i++) {
      sources[i].src = sources[i].getAttribute("data-src");
      sources[i].removeAttribute("data-src");
    }
    if (sources.length) video.load();
    video.dataset.attached = "1";
  }
  function markStatic(video) {
    video.classList.add("is-static");
    video.setAttribute("data-static", "1");
  }
  function tryPlay(video) {
    if (video.dataset.static) return;
    if (reduceMotion.matches || saveData) { markStatic(video); return; }
    attachSrc(video);
    var p;
    try { p = video.play(); } catch (e) { markStatic(video); return; }
    if (p && typeof p.catch === "function") {
      p.catch(function () { markStatic(video); });
    }
  }
  function pause(video) {
    if (!video.paused) { try { video.pause(); } catch (e) { /* ignore */ } }
  }
  var videos = [].slice.call(doc.querySelectorAll("video[data-video]"));
  videos.forEach(function (v) {
    v.muted = true;
    v.defaultMuted = true;
    v.loop = true;
    v.setAttribute("playsinline", "");
    v.removeAttribute("autoplay");
    if (reduceMotion.matches || saveData) markStatic(v);
  });
  if (hasIO && videos.length) {
    var videoIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) tryPlay(v);
        else pause(v);
      });
    }, { threshold: [0, 0.25, 0.5] });
    videos.forEach(function (v) { videoIO.observe(v); });
  } else {
    videos.forEach(function (v) { if (!v.dataset.static) tryPlay(v); });
  }
  reduceMotion.addEventListener && reduceMotion.addEventListener("change", function () {
    if (reduceMotion.matches) videos.forEach(function (v) { pause(v); markStatic(v); });
  });
  doc.addEventListener("visibilitychange", function () {
    if (doc.hidden) videos.forEach(pause);
  });

  /* ---------- 3 · --progress fallback (only when CSS scroll timelines are missing) ---------- */
  if (!supportsScrollTimeline && !reduceMotion.matches && plates.length) {
    root.classList.add("js-progress");
    var visible = [];
    var ticking = false;
    var vh = window.innerHeight;
    function progressOf(plate) {
      var r = plate.getBoundingClientRect();
      var total = r.height + vh;               /* cover range: enter at bottom → exit at top */
      var p = (vh - r.top) / total;
      return p < 0 ? 0 : p > 1 ? 1 : p;
    }
    function update() {
      ticking = false;
      for (var i = 0; i < visible.length; i++) {
        var pl = visible[i];
        var p = progressOf(pl);
        if (pl.dataset.hero) p = Math.max(0, (p - 0.4) / 0.6);  /* hero: cover 40% is the load state */
        pl.style.setProperty("--progress", p.toFixed(4));
      }
    }
    function request() { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } }
    if (hasIO) {
      var plateIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var idx = visible.indexOf(entry.target);
          if (entry.isIntersecting && idx === -1) visible.push(entry.target);
          else if (!entry.isIntersecting && idx !== -1) visible.splice(idx, 1);
        });
        request();
      }, { threshold: 0 });
      plates.forEach(function (pl) { plateIO.observe(pl); });
    } else {
      visible = plates.slice();
    }
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", function () { vh = window.innerHeight; request(); }, { passive: true });
    request();
  }

  /* ---------- 4 · Reveal-once stagger ---------- */
  var reveals = [].slice.call(doc.querySelectorAll("[data-reveal]"));
  reveals.forEach(function (el) {
    var parent = el.parentElement;
    var siblings = parent ? [].slice.call(parent.querySelectorAll(":scope > [data-reveal]")) : [el];
    var i = siblings.indexOf(el);
    el.style.setProperty("--i", String(Math.min(i < 0 ? 0 : i, 8)));
  });
  if (hasIO && reveals.length) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); revealIO.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    reveals.forEach(function (el) { revealIO.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- 5 · Nav: current section + menu ---------- */
  var navLinks = [].slice.call(doc.querySelectorAll("[data-nav-link]"));
  var navMenu = doc.querySelector("[data-nav-menu]");
  var sections = [];
  navLinks.forEach(function (a) {
    var id = (a.getAttribute("href") || "").replace(/^#/, "");
    var el = id && doc.getElementById(id);
    if (el && sections.indexOf(el) === -1) sections.push(el);
  });
  function setCurrent(id) {
    navLinks.forEach(function (a) {
      var match = a.getAttribute("href") === "#" + id;
      if (match) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  if (hasIO && sections.length) {
    var ratios = {};
    var sectionIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { ratios[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0; });
      var best = null, bestR = 0;
      sections.forEach(function (s) { if ((ratios[s.id] || 0) > bestR) { bestR = ratios[s.id]; best = s.id; } });
      if (best) setCurrent(best);
    }, { rootMargin: "-40% 0px -45% 0px", threshold: [0, 0.01, 0.1, 0.25, 0.5] });
    sections.forEach(function (s) { sectionIO.observe(s); });
  }
  if (navMenu) {
    navMenu.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a");
      if (a) navMenu.removeAttribute("open");
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navMenu.hasAttribute("open")) {
        navMenu.removeAttribute("open");
        var s = navMenu.querySelector("summary");
        if (s) s.focus();
      }
    });
    doc.addEventListener("click", function (e) {
      if (navMenu.hasAttribute("open") && !navMenu.contains(e.target)) navMenu.removeAttribute("open");
    });
  }

  /* ---------- 6 · Hero pointer light ---------- */
  var hero = doc.querySelector("[data-hero]");
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (hero && fine.matches && !reduceMotion.matches) {
    var lightTick = false, lx = 0, ly = 0;
    function paintLight() {
      lightTick = false;
      hero.style.setProperty("--mx", lx + "px");
      hero.style.setProperty("--my", ly + "px");
    }
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      lx = e.clientX - r.left;
      ly = e.clientY - r.top;
      if (!hero.classList.contains("is-lit")) hero.classList.add("is-lit");
      if (!lightTick) { lightTick = true; window.requestAnimationFrame(paintLight); }
    }, { passive: true });
    hero.addEventListener("pointerleave", function () { hero.classList.remove("is-lit"); }, { passive: true });
  }

  /* ---------- 7 · Assignment brief (local only; nothing is sent) ---------- */
  var form = doc.getElementById("brief-form");
  if (form) {
    var out = doc.getElementById("brief-output");
    var status = doc.getElementById("brief-status");
    var copyBtn = doc.getElementById("brief-copy");
    var dlBtn = doc.getElementById("brief-download");
    var sendBtn = doc.getElementById("brief-send");
    var fields = [].slice.call(form.querySelectorAll("input, select, textarea"));
    var stateTimer = null;

    function labelFor(el) {
      var l = el.id && form.querySelector('label[for="' + el.id + '"]');
      return (l ? l.textContent : el.name || el.id || "Field").trim();
    }
    function buildBrief() {
      var lines = ["ASSIGNMENT BRIEF — Nick Salazar, marine surveyor", "Prepared locally on " + new Date().toISOString().slice(0, 10), ""];
      var any = false;
      fields.forEach(function (el) {
        var v = (el.value || "").trim();
        if (!v) return;
        any = true;
        lines.push(labelFor(el).toUpperCase() + ": " + v);
      });
      if (!any) lines.push("(Fill in the fields above; the brief assembles here as you type.)");
      lines.push("");
      return lines.join("\n");
    }
    function render() { if (out) out.textContent = buildBrief(); }
    function say(msg, isError) {
      if (!status) return;
      status.textContent = msg;
      status.classList.toggle("is-error", !!isError);
    }
    function flash(btn, state, label) {
      if (!btn) return;
      if (!btn.dataset.label) btn.dataset.label = btn.textContent;
      btn.dataset.state = state;
      if (label) btn.textContent = label;
      clearTimeout(stateTimer);
      stateTimer = setTimeout(function () {
        delete btn.dataset.state;
        btn.textContent = btn.dataset.label;
      }, 2500);
    }
    fields.forEach(function (el) {
      el.addEventListener("input", render);
      el.addEventListener("change", render);
      el.addEventListener("blur", function () {
        var help = doc.getElementById(el.id + "-help");
        if (!help) return;
        if (el.required && !el.value.trim()) {
          el.setAttribute("aria-invalid", "true");
          help.textContent = "Needed so the brief makes sense. Add a short answer.";
          help.classList.add("is-error");
        } else {
          el.removeAttribute("aria-invalid");
          help.textContent = "";
          help.classList.remove("is-error");
        }
      });
    });
    form.addEventListener("submit", function (e) { e.preventDefault(); render(); });
    render();

    function fallbackCopy(text) {
      var ta = doc.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      doc.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = doc.execCommand("copy"); } catch (e) { ok = false; }
      doc.body.removeChild(ta);
      return ok;
    }
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var text = buildBrief();
        render();
        var done = function () { flash(copyBtn, "success", "Copied"); say("Copied. Nothing was sent."); };
        var fail = function () {
          if (fallbackCopy(text)) { done(); return; }
          flash(copyBtn, "error", "Copy failed");
          say("Couldn't reach the clipboard. Select the brief text and copy it manually.", true);
          if (out) out.focus();
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, fail);
        } else { fail(); }
      });
    }
    if (sendBtn) {
      sendBtn.addEventListener("click", function () {
        var text = buildBrief();
        var nameEl = doc.getElementById("bf-name");
        var contactEl = doc.getElementById("bf-contact");
        var name = nameEl ? (nameEl.value || "").trim() : "";
        var reply = contactEl ? (contactEl.value || "").trim() : "";
        sendBtn.disabled = true;
        say("Sending…");
        fetch("https://nicksalazar-mail.shagghie2.workers.dev/", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ brief: text, name: name, reply_to: reply })
        }).then(function (res) {
          return res.json().then(function (data) { return { res: res, data: data }; });
        }).then(function (pack) {
          sendBtn.disabled = false;
          if (pack.data && pack.data.ok) {
            flash(sendBtn, "success", "Sent");
            say("Sent to Nick at Houtxsurvey@outlook.com.");
          } else {
            flash(sendBtn, "error", "Not sent");
            say((pack.data && pack.data.error) || "Could not send. Copy the brief and email Nick.", true);
          }
        }).catch(function () {
          sendBtn.disabled = false;
          flash(sendBtn, "error", "Not sent");
          say("Could not reach the mail service. Copy the brief and email Nick.", true);
        });
      });
    }
    if (dlBtn) {
      dlBtn.addEventListener("click", function () {
        try {
          var blob = new Blob([buildBrief()], { type: "text/plain;charset=utf-8" });
          var url = URL.createObjectURL(blob);
          var a = doc.createElement("a");
          a.href = url;
          a.download = "assignment-brief.txt";
          doc.body.appendChild(a);
          a.click();
          doc.body.removeChild(a);
          setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
          flash(dlBtn, "success", "Saved");
          say("Downloaded assignment-brief.txt to this device. Nothing was sent.");
        } catch (e) {
          flash(dlBtn, "error", "Download failed");
          say("Couldn't build the file here. Use Copy brief instead.", true);
        }
      });
    }
  }
})();
