(() => {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const svgNS = "http://www.w3.org/2000/svg";
  const $ = (s) => document.querySelector(s);
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };

  const tiers = [
    { name: "Mild Mercy", pepper: "Jalapeño · 2,500–8,000 SHU", line: "Jalapeño and roasted garlic. It goes on eggs.", price: 8 },
    { name: "Some Mercy", pepper: "Habanero · 100,000–350,000 SHU", line: "Habanero and mango. Sweet first, then it isn't.", price: 9 },
    { name: "No Mercy", pepper: "Carolina Reaper · up to 2.2 million SHU", line: "Carolina Reaper and black pepper. Use it a drop at a time.", price: 11 },
  ];
  const ground = [[0, "#f4eee1"], [0.4, "#ffc27a"], [0.62, "#ff6a2a"], [0.82, "#c8150c"], [1, "#2b0606"]];
  const sauce = [[0, "#5a8f29"], [0.3, "#9aa526"], [0.45, "#f2a516"], [0.6, "#f2761b"], [0.8, "#c4100a"], [1, "#8a0606"]];
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (stops, v) => {
    let i = 0;
    while (i < stops.length - 2 && v > stops[i + 1][0]) i++;
    const [a, ca] = stops[i], [b, cb] = stops[i + 1];
    const t = clamp((v - a) / (b - a)), x = hex(ca), y = hex(cb);
    return x.map((c, k) => Math.round(c + (y[k] - c) * t));
  };
  const css = (rgb) => "rgb(" + rgb.join(" ") + ")";
  const lum = (rgb) => {
    const [r, g, b] = rgb.map((c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const word = $(".word"), melt = $(".melt"), drips = $(".drips");
  const filter = $("#melt"), warp = filter.querySelector("feDisplacementMap"), soft = filter.querySelector("feGaussianBlur"), noise = filter.querySelector("feTurbulence");
  const bottle = $(".bottle"), wave = $(".sauce"), chillies = $(".chillies");
  const dial = $(".dial"), knob = dial.querySelector(".knob"), ticks = dial.querySelector(".ticks");
  const hint = $(".hint"), buy = $("[data-buy]"), buyLabel = $("[data-buy-label]");
  const out = { tier: $("[data-tier]"), pepper: $("[data-pepper]"), line: $("[data-line]") };
  const theme = $('meta[name="theme-color"]');
  const chilli = '<path d="M3 2c2 0 3 1 3 3 4 1 7 5 7 10-3-2-6-4-8-8-1 0-2-1-2-2V2Z"/>';

  for (let i = 0; i <= 20; i++) {
    const a = (-135 + i * 13.5) * Math.PI / 180, major = i % 5 === 0;
    const r1 = major ? 86 : 92, r2 = 104;
    const l = document.createElementNS(svgNS, "line");
    l.setAttribute("x1", (Math.sin(a) * r1).toFixed(1)); l.setAttribute("y1", (-Math.cos(a) * r1).toFixed(1));
    l.setAttribute("x2", (Math.sin(a) * r2).toFixed(1)); l.setAttribute("y2", (-Math.cos(a) * r2).toFixed(1));
    l.setAttribute("stroke-width", major ? 5 : 2.5);
    ticks.append(l);
  }

  let seed = 11;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const anchors = { S: [0.5], m: [0.5], a: [0.42], l: [0.5], M: [0.2, 0.8], e: [0.5], r: [0.24], c: [0.5] };
  let pool = [], drops = [], box = null;

  const layout = () => {
    drips.replaceChildren();
    pool = [];
    seed = 11;
    melt.querySelectorAll("text").forEach((t) => {
      const base = +t.getAttribute("y");
      [...t.textContent].forEach((ch, i) => {
        const ext = t.getExtentOfChar(i);
        (anchors[ch] || []).forEach((f) => {
          const w = 16 + rand() * 18, x = ext.x + ext.width * f;
          const g = document.createElementNS(svgNS, "g");
          const r = document.createElementNS(svgNS, "rect"), c = document.createElementNS(svgNS, "circle");
          r.setAttribute("x", (x - w / 2).toFixed(1)); r.setAttribute("y", base - 30); r.setAttribute("width", w.toFixed(1)); r.setAttribute("rx", (w / 2).toFixed(1));
          c.setAttribute("cx", x.toFixed(1)); c.setAttribute("r", (w * 0.62).toFixed(1));
          g.append(r, c); drips.append(g);
          pool.push({ r, c, x, w, base, reach: (base < 400 ? 50 : 70) + rand() * (base < 400 ? 70 : 150), phase: rand() * 6.28, speed: 0.6 + rand() * 0.9, next: 1 + rand() * 3 });
        });
      });
    });
    const b = melt.getBBox();
    box = { x: b.x - 30, y: b.y - 20, w: b.width + 60, h: b.height + 300 };
    word.setAttribute("viewBox", [box.x, box.y, box.w, box.h - 120].map((v) => v.toFixed(0)).join(" "));
    ["x", "y"].forEach((k) => filter.setAttribute(k, box[k]));
    filter.setAttribute("width", box.w); filter.setAttribute("height", box.h);
    filter.setAttribute("filterUnits", "userSpaceOnUse");
  };

  let heat = 0.17, shown = -1, tierShown = -1, last = 0, clock = 0, raf = 0, tween = null;

  const paint = (now) => {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    const still = reduce.matches;
    if (!still) clock += dt;
    if (tween) {
      const t = clamp((now - tween.start) / tween.ms), e = 1 - (1 - t) ** 3;
      heat = tween.from + (tween.to - tween.from) * e;
      if (t >= 1) tween = null;
    }
    const h = heat;

    if (h !== shown) {
      const bg = mix(ground, h), dark = lum(bg) > 0.18;
      root.style.setProperty("--bg", css(bg));
      root.style.setProperty("--ink", dark ? "#1c120e" : "#fff1e6");
      root.style.setProperty("--sauce", css(mix(sauce, h)));
      root.style.setProperty("--sweat", smooth(0.45, 0.7, h).toFixed(3));
      root.style.setProperty("--shake", smooth(0.8, 1, h).toFixed(3));
      root.style.setProperty("--shiver", h > 0.8 && !still ? "running" : "paused");
      theme.content = css(bg);
      knob.setAttribute("transform", "rotate(" + (-135 + h * 270).toFixed(1) + ")");
      const level = 1 + Math.round(h * 9);
      const tier = h < 1 / 3 ? 0 : h < 2 / 3 ? 1 : 2;
      dial.setAttribute("aria-valuenow", level);
      dial.setAttribute("aria-valuetext", tiers[tier].name + ", " + level + " of 10");
      if (tier !== tierShown) {
        tierShown = tier;
        const t = tiers[tier];
        out.tier.firstChild.nodeValue = t.name;
        out.pepper.textContent = t.pepper;
        out.line.textContent = t.line;
        buyLabel.textContent = "Add " + t.name + " · €" + t.price;
      }
      const n = 1 + Math.min(4, Math.floor(h * 5));
      if (chillies.childElementCount !== n) {
        chillies.innerHTML = Array.from({ length: n }, (_, i) => '<g transform="translate(' + (i * 22) + ' 0) scale(1.4)">' + chilli + "</g>").join("");
        chillies.setAttribute("transform", "translate(" + (100 - (n * 22 - 4) / 2).toFixed(1) + " 400)");
      }
      bottle.classList.toggle("popped", h > 0.97);
      if (h < 0.05) melt.removeAttribute("filter"); else melt.setAttribute("filter", "url(#melt)");
      drips.style.display = h < 0.05 ? "none" : "";
      shown = h;
    }

    const flow = smooth(0.05, 1, h);
    const wob = still ? 0 : Math.sin(clock * 1.3) * 0.08;
    warp.setAttribute("scale", (flow * 38 * (1 + wob)).toFixed(2));
    soft.setAttribute("stdDeviation", (flow * 7).toFixed(2));
    if (!still && h > 0.3) noise.setAttribute("baseFrequency", (0.011 + Math.sin(clock * 0.7) * 0.0012).toFixed(4) + " " + (0.028 + Math.cos(clock * 0.9) * 0.002).toFixed(4));

    pool.forEach((d) => {
      const len = d.reach * smooth(0.08, 0.95, h) * (still ? 1 : 0.85 + 0.15 * Math.sin(clock * d.speed + d.phase));
      d.r.setAttribute("height", (len + 30).toFixed(1));
      d.c.setAttribute("cy", (d.base + len).toFixed(1));
      if (!still && h > 0.6 && (d.next -= dt * (h * 1.6)) <= 0) {
        d.next = 1.4 + Math.random() * 3.2;
        const c = document.createElementNS(svgNS, "circle");
        c.setAttribute("cx", d.x.toFixed(1)); c.setAttribute("r", (d.w * 0.5).toFixed(1));
        drips.append(c);
        drops.push({ c, y: d.base + len, v: 40 });
      }
    });
    drops = drops.filter((p) => {
      p.v += 1400 * dt; p.y += p.v * dt;
      if (p.y > box.y + box.h) { p.c.remove(); return false; }
      p.c.setAttribute("cy", p.y.toFixed(1));
      return true;
    });

    const amp = still ? 0 : 3 + h * 9;
    const y = 214, s = Math.sin(clock * (2 + h * 6)) * amp;
    wave.setAttribute("d", "M0 " + y + " Q50 " + (y - s).toFixed(1) + " 100 " + y + " T200 " + y + " V560 H0Z");

    raf = 0;
    if (tween || (!still && (h > 0.05 || drops.length))) raf = requestAnimationFrame(paint);
  };
  const go = () => { if (!raf) { last = 0; raf = requestAnimationFrame(paint); } };

  const set = (h, ms = 0) => {
    h = clamp(h);
    if (ms && !reduce.matches) tween = { from: heat, to: h, start: performance.now(), ms };
    else { tween = null; heat = h; }
    hint.style.opacity = "0";
    go();
  };

  let dragging = false;
  const fromPointer = (e) => {
    const r = dial.getBoundingClientRect();
    let a = Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180 / Math.PI;
    if (Math.abs(a) > 135) a = heat > 0.5 ? 135 : -135;
    set((a + 135) / 270);
  };
  dial.addEventListener("pointerdown", (e) => { dragging = true; dial.setPointerCapture(e.pointerId); dial.focus({ preventScroll: true }); fromPointer(e); });
  dial.addEventListener("pointermove", (e) => { if (dragging) fromPointer(e); });
  ["pointerup", "pointercancel"].forEach((t) => dial.addEventListener(t, () => { dragging = false; }));
  dial.addEventListener("keydown", (e) => {
    const step = { ArrowUp: 0.05, ArrowRight: 0.05, ArrowDown: -0.05, ArrowLeft: -0.05, PageUp: 0.2, PageDown: -0.2 }[e.key];
    if (step) set(heat + step);
    else if (e.key === "Home") set(0, 400);
    else if (e.key === "End") set(1, 400);
    else return;
    e.preventDefault();
  });
  dial.addEventListener("wheel", (e) => { if (document.activeElement !== dial) return; e.preventDefault(); set(heat - Math.sign(e.deltaY) * 0.03); }, { passive: false });

  document.querySelectorAll("[data-heat]").forEach((b) => b.addEventListener("click", () => {
    scrollTo({ top: 0, behavior: reduce.matches ? "auto" : "smooth" });
    set(+b.dataset.heat, 900);
  }));
  let reset = 0;
  buy.addEventListener("click", () => {
    buyLabel.textContent = "In the basket. Not really.";
    clearTimeout(reset);
    reset = setTimeout(() => { tierShown = -1; shown = -1; go(); }, 1800);
  });
  reduce.addEventListener("change", () => { shown = -1; go(); });

  const start = () => { layout(); shown = -1; go(); };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(start);
  addEventListener("resize", () => { shown = -1; go(); });
})();
