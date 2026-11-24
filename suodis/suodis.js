(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarse = window.matchMedia("(pointer: coarse)");
  const track = document.querySelector(".track");
  const letters = [...document.querySelectorAll(".word span")];
  const hero = document.querySelector("[data-hero]");
  const heroFade = [...hero.querySelectorAll(".hero-line, .cue")];
  const caps = [...document.querySelectorAll(".cap")];
  const tempEl = document.querySelector("[data-temp]");
  const whereEl = document.querySelector("[data-where]");
  const gauge = document.querySelector(".gauge");
  const marker = document.querySelector(".scale b");
  const soundButton = document.querySelector(".sound");
  const { clamp, lerp, smooth, inOut } = ScrubFilm.math;
  let audio = null;
  soundButton.addEventListener("click", () => {
    if (!audio) {
      audio = new Audio("img/sound.mp3");
      audio.loop = true;
    }
    const on = audio.paused;
    if (on) audio.play().catch(() => soundButton.setAttribute("aria-pressed", "false"));
    else audio.pause();
    soundButton.setAttribute("aria-pressed", String(on));
    request();
  });

  const COUNT = 61;
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

  const film = ScrubFilm({
    canvas: document.querySelector(".film"),
    folders: ["c1", "c2", "c3", "c4"],
    count: COUNT,
    stills: ["img/s1-exterior.webp", "img/s2-interior.webp", "img/s3-stones.webp", "img/s4-ice.webp"],
    focus: [0.68, 0.42, 0.5, 0.58],
    loadFrames: !reduce.matches,
  });
  const { ctx } = film;
  const last = (c) => film.last(c, reduce.matches);

  let vh = 0, lastWidth = 0;
  const layout = () => {
    film.size();
    if (film.W !== lastWidth || !vh || !coarse.matches) {
      vh = film.H / 100;
      lastWidth = film.W;
      track.style.height = TOTAL * vh + "px";
    }
    request();
  };

  const throughWindow = (p) => {
    const e = inOut(p);
    const base = last(0);
    if (!film.ok(base)) return;
    const [px, py, r] = film.point(base, 0, WINDOW[0], WINDOW[1]);
    const z = 1 + 9 * e * e;
    film.zoomed(px, py, z, () => film.paint(base, 0));
    const grow = e * e * Math.max(film.W, film.H) * 1.15;
    const hw = WINDOW[2] * r.w * z + grow, hh = WINDOW[3] * r.h * z + grow;
    ctx.save();
    ctx.beginPath();
    ctx.rect(px - hw, py - hh, hw * 2, hh * 2);
    ctx.clip();
    const inside = film.first(1);
    if (inside) film.zoomed(px, py, 1.45 - 0.45 * e, () => film.paint(inside, 1));
    ctx.restore();
    const glow = 1 - smooth(0.35, 0.9, p);
    if (glow > 0) {
      ctx.save();
      ctx.strokeStyle = "rgba(242,153,74," + (0.9 * glow).toFixed(3) + ")";
      ctx.shadowColor = "rgba(242,153,74," + glow.toFixed(3) + ")";
      ctx.shadowBlur = 40;
      ctx.lineWidth = 2;
      ctx.strokeRect(px - hw, py - hh, hw * 2, hh * 2);
      ctx.restore();
    }
  };

  const intoStones = (p) => {
    const e = inOut(p);
    const base = last(1);
    if (film.ok(base)) {
      const [sx, sy] = film.point(base, 1, STONES[0], STONES[1]);
      film.zoomed(sx, sy, 1 + 1.4 * e, () => film.paint(base, 1));
    }
    const next = film.first(2);
    if (next) film.zoomed(film.W / 2, film.H / 2, 1.35 - 0.35 * e, () => film.paint(next, 2, smooth(0.2, 0.85, p)));
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    film.fill("rgb(242,110,40)", Math.sin(Math.PI * p) * 0.22);
    ctx.restore();
  };

  const steam = (a) => film.fill("rgb(236,233,228)", a);
  const thaw = (p) => {
    if (p < 0.5) {
      film.paint(last(2), 2);
      steam(smooth(0, 0.42, p));
    } else {
      const lake = film.first(3);
      if (lake) film.zoomed(film.W / 2, film.H / 2, 1.12 - 0.12 * inOut((p - 0.5) * 2), () => film.paint(lake, 3));
      steam(1 - smooth(0.52, 0.96, p));
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
    return "rgb(" + [lerp(205, 242, k), lerp(216, 153, k), lerp(230, 74, k)].map(Math.round).join(",") + ")";
  };
  const fmt = (t) => (t < 0 ? "−" + -t : t > 0 && t < 10 ? "+" + t : String(t));

  let current = window.scrollY, target = current, frame = 0, shownTemp = null;
  const render = () => {
    frame = 0;
    target = window.scrollY;
    current = reduce.matches ? target : current + (target - current) * 0.14;
    if (Math.abs(target - current) < 0.4) current = target;

    const { s, p } = locate(current);
    const seg = SEGS[s];
    film.fill("#0d1017");
    if (reduce.matches) {
      const c = seg.clip ?? (p < 0.5 ? SEGS[s - 1].clip : SEGS[s + 1].clip);
      film.paint(film.stills[c], c);
      if (s === 5 && p < 0.5) steam(0.85);
    } else if (seg.clip !== undefined) film.clip(seg.clip, p);
    else if (seg.kind === "window") throughWindow(p);
    else if (seg.kind === "stones") intoStones(p);
    else thaw(p);

    const past = current - (TOTAL * vh - film.H);
    root.style.setProperty("--end", (smooth(0, 0.85, past / film.H) * 0.8).toFixed(3));

    if (s === 0) {
      const k = smooth(0.04, 0.5, p);
      const ready = root.classList.contains("is-ready");
      letters.forEach((el, i) => {
        const drift = reduce.matches ? 0 : k;
        el.style.transform = drift ? "translate3d(" + (drift * (i - 2) * 6).toFixed(1) + "px," + (-drift * (60 + i * 26)).toFixed(1) + "px,0)" : "";
        el.style.filter = drift ? "blur(" + (drift * (10 + i * 3)).toFixed(1) + "px)" : "";
        el.style.opacity = ready ? (1 - smooth(0.06 + i * 0.03, 0.42 + i * 0.03, p)).toFixed(3) : "";
      });
      heroFade.forEach((el) => (el.style.opacity = ready ? (1 - smooth(0.02, 0.2, p)).toFixed(3) : ""));
      root.classList.toggle("is-moving", k > 0);
      hero.style.visibility = "";
    } else {
      hero.style.visibility = "hidden";
    }

    caps.forEach((cap) => {
      const on = Number(cap.dataset.seg) === s && p >= Number(cap.dataset.in) && p <= Number(cap.dataset.out) && past < film.H * 0.15;
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
    gauge.style.opacity = (1 - smooth(0, 0.4, past / film.H)).toFixed(3);
    if (audio && !audio.paused) audio.volume = clamp((0.25 + 0.75 * clamp((tempAt(s, p) + 14) / 100)) * (1 - smooth(0, 1, past / film.H)));

    const light = reduce.matches ? s === 5 && p < 0.5 : lightAt(s, p) > 0.5;
    root.classList.toggle("is-light", light && past < 0);
    if (current !== target) request();
  };
  function request() { if (!frame) frame = requestAnimationFrame(render); }
  film.changed = request;

  const ready = () => root.classList.add("is-ready");
  if (reduce.matches) ready();
  else {
    film.stills[0].addEventListener("load", () => setTimeout(ready, 350), { once: true });
    if (film.ok(film.stills[0])) setTimeout(ready, 350);
    setTimeout(ready, 3200);
  }

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", layout);
  reduce.addEventListener("change", () => { ready(); request(); });
  layout();
})();
