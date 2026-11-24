(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarse = window.matchMedia("(pointer: coarse)");
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const track = document.querySelector(".track");
  const hero = document.querySelector("[data-hero]");
  const caps = [...document.querySelectorAll(".cap")];
  const age = document.querySelector(".age");
  const ageLabel = document.querySelector("[data-age-label]");
  const digits = [...document.querySelectorAll(".dg")].reverse();
  const loupe = document.querySelector(".loupe");
  const { clamp, lerp, smooth, inOut } = ScrubFilm.math;

  const AGE = 44e6;
  const SUN = [0.25, 0.08];
  const SHORE = [0.64, 0.69];
  const SEGS = [
    { kind: "hero", vh: 100 },
    { clip: 0, vh: 260 },
    { kind: "bridge", vh: 50 },
    { clip: 1, vh: 240 },
    { kind: "flare", vh: 130 },
    { kind: "shore", vh: 230 },
  ];
  const TOTAL = SEGS.reduce((sum, seg) => sum + seg.vh, 0);

  const film = ScrubFilm({
    canvas: document.querySelector(".film"),
    folders: ["f1", "f2"],
    count: 61,
    stills: ["img/a-amber.webp", "img/b-alive.webp", "img/c-shore.webp"],
    focus: [0.38, 0.38, 0.62],
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

  const bloom = (x, y, radius, alpha) => {
    if (alpha <= 0) return;
    const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, "rgba(255,236,190," + alpha.toFixed(3) + ")");
    g.addColorStop(0.45, "rgba(246,198,106," + (alpha * 0.75).toFixed(3) + ")");
    g.addColorStop(1, "rgba(240,160,32,0)");
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, film.W, film.H);
    ctx.restore();
  };

  const shore = (z) => {
    const img = film.stills[2];
    if (!film.ok(img)) return;
    const [x, y] = film.point(img, 2, SHORE[0], SHORE[1]);
    film.zoomed(x, y, z, () => film.paint(img, 2));
  };

  const flare = (p) => {
    const base = last(1);
    if (p < 0.5) {
      film.paint(base, 1);
      if (!film.ok(base)) return;
      const [x, y] = film.point(base, 1, SUN[0], SUN[1]);
      const k = smooth(0, 0.5, p);
      bloom(x, y, lerp(0.15, 2.2, k * k) * Math.max(film.W, film.H), 0.5 + k * 0.5);
      film.fill("rgb(255,240,214)", smooth(0.3, 0.5, p));
    } else {
      shore(1.1 - 0.1 * inOut((p - 0.5) * 2));
      film.fill("rgb(255,240,214)", 1 - smooth(0.5, 0.92, p));
    }
  };

  const yearsAt = (s, p) => {
    const curve = (q) => AGE * (Math.pow(10, 5 * q) - 1) / (Math.pow(10, 5) - 1);
    if (s === 0 || s === 5) return 0;
    if (s === 1) return curve(smooth(0.05, 0.95, p));
    if (s === 4) return curve(1 - smooth(0.15, 0.85, p));
    return AGE;
  };

  const showAge = (v) => {
    digits.forEach((el, k) => {
      const unit = Math.pow(10, k);
      const whole = Math.floor(v / unit) % 10;
      const roll = k === 0 ? v % 1 : smooth(0.96, 1, (v % unit) / unit);
      el.style.setProperty("--d", (whole + roll).toFixed(3));
      el.classList.toggle("lead", k > 0 && v < unit);
    });
    const label = v >= 1 ? "years ago" : "Today";
    if (ageLabel.textContent !== label) ageLabel.textContent = label;
  };

  const locate = (y) => {
    let at = y / vh;
    for (let s = 0; s < SEGS.length; s++) {
      if (at < SEGS[s].vh || s === SEGS.length - 1) return { s, p: clamp(at / SEGS[s].vh) };
      at -= SEGS[s].vh;
    }
  };

  const pointer = { x: 0, y: 0, lx: 0, ly: 0, in: false };
  const loupeOn = () => fine.matches && !reduce.matches;
  window.addEventListener("pointermove", (e) => {
    if (!loupeOn()) return;
    if (!pointer.in) { pointer.lx = e.clientX; pointer.ly = e.clientY; }
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.in = true;
    request();
  }, { passive: true });
  document.addEventListener("pointerleave", () => { pointer.in = false; request(); });
  const sharp = new Image();
  sharp.decoding = "async";
  if (loupeOn()) {
    sharp.src = "img/a-amber-full.webp";
    loupe.style.backgroundImage = "url(img/a-amber-full.webp)";
  }

  const drawLoupe = (visible) => {
    const img = film.stills[0];
    const show = visible && pointer.in && loupeOn() && film.ok(img) && film.ok(sharp);
    loupe.classList.toggle("on", show);
    if (!show) return false;
    pointer.lx += (pointer.x - pointer.lx) * 0.25;
    pointer.ly += (pointer.y - pointer.ly) * 0.25;
    const r = film.rect(img, 0);
    const Z = 1.8;
    loupe.style.transform = "translate3d(" + pointer.lx.toFixed(1) + "px," + pointer.ly.toFixed(1) + "px,0)";
    loupe.style.backgroundSize = (r.w * Z).toFixed(0) + "px " + (r.h * Z).toFixed(0) + "px";
    loupe.style.backgroundPosition = (-((pointer.lx - r.x) * Z - 110)).toFixed(1) + "px " + (-((pointer.ly - r.y) * Z - 110)).toFixed(1) + "px";
    return Math.abs(pointer.x - pointer.lx) > 0.3 || Math.abs(pointer.y - pointer.ly) > 0.3;
  };

  let current = window.scrollY, target = current, frame = 0;
  const render = () => {
    frame = 0;
    target = window.scrollY;
    current = reduce.matches ? target : current + (target - current) * 0.14;
    if (Math.abs(target - current) < 0.4) current = target;

    const { s, p } = locate(current);
    const seg = SEGS[s];
    film.fill("#0a0705");
    if (reduce.matches) {
      const still = [0, 0, p < 0.5 ? 0 : 1, 1, p < 0.5 ? 1 : 2, 2][s];
      film.paint(film.stills[still], still);
    } else if (seg.clip !== undefined) film.clip(seg.clip, p);
    else if (seg.kind === "hero") film.paint(film.stills[0], 0);
    else if (seg.kind === "bridge") { film.paint(last(0), 0); film.paint(film.first(1), 1, smooth(0, 1, p)); }
    else if (seg.kind === "flare") flare(p);
    else shore(1 + 0.14 * inOut(p));

    const past = current - (TOTAL * vh - film.H);
    root.style.setProperty("--end", (smooth(0, 0.85, past / film.H) * 0.82).toFixed(3));

    const ready = root.classList.contains("is-ready");
    const heroFade = s === 0 ? 1 - smooth(0.35, 0.85, p) : 0;
    hero.style.opacity = ready ? heroFade.toFixed(3) : "";
    hero.style.visibility = heroFade > 0 ? "" : "hidden";
    root.classList.toggle("is-moving", s > 0 || p > 0.01);

    caps.forEach((cap) => {
      const on = Number(cap.dataset.seg) === s && p >= Number(cap.dataset.in) && p <= Number(cap.dataset.out) && past < film.H * 0.15;
      cap.classList.toggle("on", on);
    });

    showAge(yearsAt(s, p));
    age.style.opacity = (1 - smooth(0, 0.4, past / film.H)).toFixed(3);

    const moving = drawLoupe(s === 0 && p < 0.6);
    if (current !== target || moving) request();
  };
  function request() { if (!frame) frame = requestAnimationFrame(render); }
  film.changed = request;

  const ready = () => root.classList.add("is-ready");
  if (reduce.matches) ready();
  else {
    film.stills[0].addEventListener("load", () => setTimeout(ready, 300), { once: true });
    if (film.ok(film.stills[0])) setTimeout(ready, 300);
    setTimeout(ready, 3200);
  }

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", layout);
  reduce.addEventListener("change", () => { ready(); request(); });
  layout();
})();
