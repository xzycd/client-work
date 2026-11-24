(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");

  /* A spring for one value. resp is roughly how long it takes to get there,
     in seconds; damp 1 settles without overshoot, below 1 bounces. A new
     target re-aims it from where it is, at the speed it already has, so a
     value can be grabbed and redirected mid-flight without a jump. Under
     reduced motion it lands at once. */
  const Spring = (get, set, done) => {
    const s = { v: 0, to: 0, resp: 0.5, damp: 1, raf: 0, last: 0 };
    const step = (now) => {
      s.raf = 0;
      const dt = Math.min(0.05, (now - s.last) / 1000);
      s.last = now;
      const k = (2 * Math.PI / s.resp) ** 2, c = 2 * s.damp * Math.sqrt(k);
      const tol = s.tol;
      let x = get();
      for (let i = 0, h = dt / 4; i < 4; i++) { s.v += (-k * (x - s.to) - c * s.v) * h; x += s.v * h; }
      if (Math.abs(x - s.to) < tol && Math.abs(s.v) < tol * 10) {
        s.v = 0;
        set(s.to);
        if (done) done();
        return;
      }
      set(x);
      s.raf = requestAnimationFrame(step);
    };
    s.go = (to, opt = {}) => {
      s.to = to;
      s.resp = opt.resp || 0.5;
      s.damp = opt.damp || 1;
      s.tol = opt.tol || 1e-3;
      if (opt.v !== undefined) s.v = opt.v;
      if (reduce.matches) { s.stop(); set(to); if (done) done(); return; }
      if (!s.raf) { s.last = performance.now(); s.raf = requestAnimationFrame(step); }
    };
    s.stop = () => { if (s.raf) cancelAnimationFrame(s.raf); s.raf = 0; s.v = 0; };
    s.moving = () => !!s.raf;
    return s;
  };

  /* Where a throw comes to rest under the same exponential friction a page
     scroll uses. v is in units per second; the answer is in units. */
  const project = (v, rate = 0.998) => (v / 1000) * rate / (1 - rate);

  /* Past a limit the value follows less and less instead of stopping dead. */
  const rubber = (x, lo, hi, dim) => {
    if (x < lo) { const o = lo - x; return lo - (o * dim * 0.55) / (dim + 0.55 * o); }
    if (x > hi) { const o = x - hi; return hi + (o * dim * 0.55) / (dim + 0.55 * o); }
    return x;
  };

  /* Release velocity from the last ~90 ms of pointer samples. */
  const Tracker = () => {
    let h = [];
    return {
      reset: () => { h = []; },
      add: (x, t) => { h.push({ x, t }); if (h.length > 8) h.shift(); },
      velocity: () => {
        if (h.length < 2) return 0;
        const b = h[h.length - 1];
        let a = h[0];
        for (let i = h.length - 2; i >= 0; i--) { a = h[i]; if (b.t - a.t > 90) break; }
        return b.t > a.t ? (b.x - a.x) / ((b.t - a.t) / 1000) : 0;
      },
    };
  };

  window.Hand = { Spring, project, rubber, Tracker, reduce };
})();
