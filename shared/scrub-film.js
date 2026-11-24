(() => {
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const coarseToFine = (count) => {
    const seen = new Set();
    const out = [];
    for (let step = 8; step >= 1; step /= 2) {
      for (let i = 0; i < count; i += step) if (!seen.has(i)) { seen.add(i); out.push(i); }
    }
    if (!seen.has(count - 1)) out.push(count - 1);
    return out;
  };

  window.ScrubFilm = ({ canvas, folders, count, stills, focus, loadFrames = true, base = "frames/", maxDpr = 1.75 }) => {
    const ctx = canvas.getContext("2d", { alpha: false });
    const ok = (img) => Boolean(img && img.complete && img.naturalWidth > 0);
    const film = { ctx, W: 0, H: 0, ok, changed: () => {} };

    film.stills = stills.map((src) => {
      const img = new Image();
      img.decoding = "async";
      img.addEventListener("load", () => film.changed());
      img.src = src;
      return img;
    });

    const frames = folders.map(() => new Array(count));
    const queue = [];
    if (loadFrames) folders.forEach((_, c) => coarseToFine(count).forEach((i) => queue.push([c, i])));
    let loading = 0;
    const pump = () => {
      while (loading < 6 && queue.length) {
        const [c, i] = queue.shift();
        const img = new Image();
        img.decoding = "async";
        loading++;
        img.onload = img.onerror = () => {
          loading--;
          if (img.naturalWidth) frames[c][i] = img;
          film.changed();
          pump();
        };
        img.src = base + folders[c] + "/" + String(i + 1).padStart(3, "0") + ".webp";
      }
    };
    pump();

    film.size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      film.W = window.innerWidth;
      film.H = window.innerHeight;
      canvas.width = Math.round(film.W * dpr);
      canvas.height = Math.round(film.H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingQuality = "high";
    };

    film.rect = (img, c) => {
      const s = Math.max(film.W / img.naturalWidth, film.H / img.naturalHeight);
      const w = img.naturalWidth * s, h = img.naturalHeight * s;
      return { x: (film.W - w) * focus[c], y: (film.H - h) / 2, w, h };
    };
    film.point = (img, c, u, v) => {
      const r = film.rect(img, c);
      return [r.x + u * r.w, r.y + v * r.h, r];
    };
    film.paint = (img, c, alpha = 1) => {
      if (!ok(img) || alpha <= 0) return;
      const r = film.rect(img, c);
      ctx.globalAlpha = Math.min(alpha, 1);
      ctx.drawImage(img, r.x, r.y, r.w, r.h);
      ctx.globalAlpha = 1;
    };
    film.fill = (color, alpha = 1) => {
      if (alpha <= 0) return;
      ctx.globalAlpha = Math.min(alpha, 1);
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, film.W, film.H);
      ctx.globalAlpha = 1;
    };
    film.nearest = (c, i) => {
      for (let d = 0; d < count; d++) {
        if (ok(frames[c][i - d])) return frames[c][i - d];
        if (ok(frames[c][i + d])) return frames[c][i + d];
      }
      return null;
    };
    film.first = (c) => (ok(film.stills[c]) ? film.stills[c] : film.nearest(c, 0));
    film.last = (c, preferStill = false) => (preferStill ? film.stills[c] : film.nearest(c, count - 1) || film.stills[c]);
    film.clip = (c, p, sharpUntil = 0.07) => {
      const f = clamp(p) * (count - 1);
      const i = Math.floor(f), t = f - i;
      const a = film.nearest(c, i);
      if (!a) return film.paint(film.stills[c], c);
      film.paint(a, c);
      const b = frames[c][i + 1];
      if (t > 0.02 && ok(b)) film.paint(b, c, t);
      film.paint(film.stills[c], c, 1 - smooth(0, sharpUntil, p));
    };
    film.zoomed = (px, py, z, draw) => {
      ctx.save();
      ctx.translate(px, py);
      ctx.scale(z, z);
      ctx.translate(-px, -py);
      draw();
      ctx.restore();
    };
    return film;
  };

  window.ScrubFilm.math = { clamp, lerp, smooth, inOut };
})();
