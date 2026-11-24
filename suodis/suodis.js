(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const canvas = document.querySelector(".film");
  const ctx = canvas.getContext("2d", { alpha: false });
  const track = document.querySelector(".track");
  const letters = [...document.querySelectorAll(".word span")];
  const hero = document.querySelector("[data-hero]");
  const heroFade = [...hero.querySelectorAll(".hero-line, .cue")];
  const caps = [...document.querySelectorAll(".cap")];
  const tempEl = document.querySelector("[data-temp]");
  const whereEl = document.querySelector("[data-where]");
  const gauge = document.querySelector(".gauge");
  const marker = document.querySelector(".scale b");

  const COUNT = 61;
  const FOLDERS = ["c1", "c2", "c3", "c4"];
  const STILLS = ["img/s1-exterior.webp", "img/s2-interior.webp", "img/s3-stones.webp", "img/s4-ice.webp"];
  const FOCUS = [0.68, 0.42, 0.5, 0.58];
  const WINDOW = [0.648, 0.638, 0.019, 0.03];
  const STONES = [0.1, 0.36];
  const SEGS = [
    { clip: 0, vh: 240 },
    { kind: "window", vh: 130 },
    { clip: 1, vh: 230 },
    { kind: "stones", vh: 80 },
    { clip: 2, vh: 210 },
    { kind: "thaw", vh: 130 },
    { clip: 3, vh: 240 },
  ];
  const WHERE = ["Outside", "Inside", "Inside", "On the stones", "On the stones", "In the lake", "In the lake"];
  const TOTAL = SEGS.reduce((sum, seg) => sum + seg.vh, 0);

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  let W = 0, H = 0, vh = 0, lastWidth = 0;
  const layout = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingQuality = "high";
    if (W !== lastWidth || !vh) { vh = H / 100; lastWidth = W; track.style.height = TOTAL * vh + "px"; }
    request();
  };

  const ok = (img) => img && img.complete && img.naturalWidth > 0;
  const stills = STILLS.map((src) => { const img = new Image(); img.decoding = "async"; img.src = src; return img; });
  const frames = FOLDERS.map(() => new Array(COUNT));

  const queue = [];
  if (!reduce.matches) FOLDERS.forEach((_, c) => { for (let i = 0; i < COUNT; i++) queue.push([c, i]); });
  let loading = 0;
  const pump = () => {
    while (loading < 6 && queue.length) {
      const [c, i] = queue.shift();
      const img = new Image();
      img.decoding = "async";
      loading++;
      img.onload = img.onerror = () => { loading--; if (img.naturalWidth) frames[c][i] = img; request(); pump(); };
      img.src = "frames/" + FOLDERS[c] + "/" + String(i + 1).padStart(3, "0") + ".webp";
    }
  };
  pump();

  const rect = (img, c) => {
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const s = Math.max(W / iw, H / ih);
    const dw = iw * s, dh = ih * s;
    return { x: (W - dw) * FOCUS[c], y: (H - dh) / 2, w: dw, h: dh };
  };
  const paint = (img, c, alpha = 1) => {
    if (!ok(img) || alpha <= 0) return;
    const r = rect(img, c);
    ctx.globalAlpha = Math.min(alpha, 1);
    ctx.drawImage(img, r.x, r.y, r.w, r.h);
    ctx.globalAlpha = 1;
  };
  const nearest = (c, i) => {
    for (let d = 0; d < COUNT; d++) {
      if (ok(frames[c][i - d])) return frames[c][i - d];
      if (ok(frames[c][i + d])) return frames[c][i + d];
    }
    return null;
  };
  const clip = (c, p) => {
    const f = clamp(p) * (COUNT - 1);
    const i = Math.floor(f), t = f - i;
    const a = nearest(c, i);
    const sharp = 1 - smooth(0, 0.07, p);
    if (a) {
      paint(a, c);
      const b = frames[c][i + 1];
      if (t > 0.02 && ok(b)) paint(b, c, t);
      paint(stills[c], c, sharp);
    } else {
      paint(stills[c], c);
    }
  };
  const zoomed = (px, py, z, draw) => {
    ctx.save(); ctx.translate(px, py); ctx.scale(z, z); ctx.translate(-px, -py); draw(); ctx.restore();
  };
  const first = (c) => (ok(stills[c]) ? stills[c] : nearest(c, 0));
  const last = (c) => (reduce.matches ? stills[c] : nearest(c, COUNT - 1) || stills[c]);

  const throughWindow = (p) => {
    const e = inOut(p);
    const base = last(0);
    if (!ok(base)) return;
    const r = rect(base, 0);
    const px = r.x + WINDOW[0] * r.w, py = r.y + WINDOW[1] * r.h;
    const z = 1 + 9 * e * e;
    zoomed(px, py, z, () => paint(base, 0));
    const grow = e * e * Math.max(W, H) * 1.15;
    const hw = WINDOW[2] * r.w * z + grow, hh = WINDOW[3] * r.h * z + grow;
    ctx.save();
    ctx.beginPath(); ctx.rect(px - hw, py - hh, hw * 2, hh * 2); ctx.clip();
    const inside = first(1);
    if (inside) zoomed(px, py, 1.45 - 0.45 * e, () => paint(inside, 1));
    ctx.restore();
    const glow = 1 - smooth(0.35, 0.9, p);
    if (glow > 0) {
      ctx.save();
      ctx.strokeStyle = "rgba(242,153,74," + (0.9 * glow).toFixed(3) + ")";
      ctx.shadowColor = "rgba(242,153,74," + glow.toFixed(3) + ")";
      ctx.shadowBlur = 40; ctx.lineWidth = 2;
      ctx.strokeRect(px - hw, py - hh, hw * 2, hh * 2);
      ctx.restore();
    }
  };

  const intoStones = (p) => {
    const e = inOut(p);
    const base = last(1);
    if (ok(base)) {
      const r = rect(base, 1);
      zoomed(r.x + STONES[0] * r.w, r.y + STONES[1] * r.h, 1 + 1.4 * e, () => paint(base, 1));
    }
    const next = first(2);
    if (next) zoomed(W / 2, H / 2, 1.35 - 0.35 * e, () => paint(next, 2, smooth(0.2, 0.85, p)));
    const flash = Math.sin(Math.PI * p) * 0.22;
    ctx.save(); ctx.globalCompositeOperation = "screen"; ctx.fillStyle = "rgba(242,110,40," + flash.toFixed(3) + ")"; ctx.fillRect(0, 0, W, H); ctx.restore();
  };

  const steamWhite = (a) => {
    if (a <= 0) return;
    ctx.fillStyle = "rgba(236,233,228," + Math.min(a, 1).toFixed(3) + ")";
    ctx.fillRect(0, 0, W, H);
  };
  const thaw = (p) => {
    if (p < 0.5) {
      paint(last(2), 2);
      steamWhite(smooth(0, 0.42, p));
    } else {
      const lake = first(3);
      if (lake) zoomed(W / 2, H / 2, 1.12 - 0.12 * inOut((p - 0.5) * 2), () => paint(lake, 3));
      steamWhite(1 - smooth(0.52, 0.96, p));
    }
  };

  const locate = (y) => {
    let at = y / vh;
    for (let s = 0; s < SEGS.length; s++) {
      if (at < SEGS[s].vh || s === SEGS.length - 1) return { s, p: clamp(at / SEGS[s].vh) };
      at -= SEGS[s].vh;
    }
  };

  const tempAt = (s, p) => {
    if (s === 0) return -14;
    if (s === 1) return lerp(-14, 86, smooth(0.15, 0.95, p));
    if (s < 5) return 86;
    if (s === 5) return lerp(86, 1, smooth(0.1, 0.9, p));
    return 1;
  };
  const lightAt = (s, p) => (s === 4 ? smooth(0.55, 0.9, p) : s === 5 ? 1 - smooth(0.6, 0.85, p) : 0);
  const heat = (t) => {
    const k = clamp(t / 80);
    const c = [lerp(205, 242, k), lerp(216, 153, k), lerp(230, 74, k)].map(Math.round);
    return "rgb(" + c.join(",") + ")";
  };
  const fmt = (t) => (t < 0 ? "−" + -t : t > 0 && t < 10 ? "+" + t : String(t));

  let current = window.scrollY, target = current, frame = 0, shownTemp = null;
  const render = () => {
    frame = 0;
    target = window.scrollY;
    const smoothScroll = !reduce.matches;
    current = smoothScroll ? current + (target - current) * 0.14 : target;
    if (Math.abs(target - current) < 0.4) current = target;

    const { s, p } = locate(current);
    const seg = SEGS[s];
    ctx.fillStyle = "#0d1017"; ctx.fillRect(0, 0, W, H);
    if (reduce.matches) {
      const c = seg.clip ?? (p < 0.5 ? SEGS[s - 1].clip : SEGS[s + 1].clip);
      paint(stills[c], c);
      if (s === 5 && p < 0.5) steamWhite(0.6);
    } else if (seg.clip !== undefined) clip(seg.clip, p);
    else if (seg.kind === "window") throughWindow(p);
    else if (seg.kind === "stones") intoStones(p);
    else thaw(p);

    const past = current - (TOTAL * vh - H);
    root.style.setProperty("--end", (smooth(0, 0.85, past / H) * 0.8).toFixed(3));

    if (s === 0) {
      const k = smooth(0.04, 0.5, p);
      if (!reduce.matches) letters.forEach((el, i) => {
        const lift = k * (60 + i * 26);
        el.style.transform = k ? "translate3d(" + (k * (i - 2) * 6).toFixed(1) + "px," + (-lift).toFixed(1) + "px,0)" : "";
        el.style.filter = k ? "blur(" + (k * (10 + i * 3)).toFixed(1) + "px)" : "";
        el.style.opacity = (1 - smooth(0.06 + i * 0.03, 0.42 + i * 0.03, p)).toFixed(3);
      });
      heroFade.forEach((el) => (el.style.opacity = root.classList.contains("is-ready") ? (1 - smooth(0.02, 0.2, p)).toFixed(3) : ""));
      root.classList.toggle("is-moving", k > 0);
      hero.style.visibility = "";
    } else {
      hero.style.visibility = "hidden";
    }

    caps.forEach((cap) => {
      const on = Number(cap.dataset.seg) === s && p >= Number(cap.dataset.in) && p <= Number(cap.dataset.out) && past < H * 0.15;
      cap.classList.toggle("on", on);
    });

    const t = Math.round(tempAt(s, p));
    if (t !== shownTemp) {
      shownTemp = t;
      tempEl.textContent = fmt(t);
      gauge.style.setProperty("--heat", heat(t));
      marker.style.setProperty("--y", ((100 - t) / 120 * 100).toFixed(2) + "%");
    }
    const where = WHERE[s === 1 || s === 3 || s === 5 ? (p < 0.5 ? s - 1 : s + 1) : s];
    if (whereEl.textContent !== where) whereEl.textContent = where;
    gauge.style.opacity = (1 - smooth(0, 0.4, past / H)).toFixed(3);

    root.classList.toggle("is-light", lightAt(s, p) > 0.5 && past < 0);
    if (current !== target) request();
  };
  function request() { if (!frame) frame = requestAnimationFrame(render); }

  const ready = () => root.classList.add("is-ready");
  if (reduce.matches) ready();
  else {
    stills[0].addEventListener("load", () => setTimeout(ready, 350), { once: true });
    if (ok(stills[0])) setTimeout(ready, 350);
    setTimeout(ready, 3200);
  }
  stills.forEach((img) => img.addEventListener("load", request));

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", layout);
  reduce.addEventListener("change", () => { ready(); request(); });
  layout();
})();
