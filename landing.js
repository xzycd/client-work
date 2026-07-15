(() => {
  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const progress = document.querySelector("[data-scroll-progress]");
  const activeIndex = document.querySelector("[data-active-index]");
  const revealTargets = document.querySelectorAll("[data-reveal]");
  const projects = [...document.querySelectorAll("[data-project]")];

  requestAnimationFrame(() => body.classList.add("is-ready"));

  const showEverything = () => {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
    projects.forEach((project) => project.classList.add("is-visible"));
  };

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    showEverything();
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10%", threshold: 0.12 }
    );

    revealTargets.forEach((target) => revealObserver.observe(target));
    projects.forEach((project) => revealObserver.observe(project));
  }

  if ("IntersectionObserver" in window) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const project = entry.target;
          const videos = project.querySelectorAll("video");
          const active = entry.isIntersecting && entry.intersectionRatio >= 0.32;

          project.classList.toggle("is-active", active);

          videos.forEach((video) => {
            if (active && !reduceMotion.matches) {
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          });

          if (active && activeIndex) activeIndex.textContent = project.dataset.index;
        });
      },
      { threshold: [0, 0.32, 0.6], rootMargin: "-12% 0px -12%" }
    );

    projects.forEach((project) => activeObserver.observe(project));
  }

  let scrollFrame = 0;
  const updateScrollProgress = () => {
    const available = root.scrollHeight - window.innerHeight;
    const amount = available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0;
    if (progress) progress.style.transform = `scaleX(${amount})`;
    scrollFrame = 0;
  };

  const requestProgressUpdate = () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(updateScrollProgress);
  };

  updateScrollProgress();
  window.addEventListener("scroll", requestProgressUpdate, { passive: true });
  window.addEventListener("resize", requestProgressUpdate, { passive: true });

  if (finePointer.matches && !reduceMotion.matches) {
    document.querySelectorAll("[data-preview]").forEach((preview) => {
      let pointerFrame = 0;
      let latestEvent;

      const paintPointer = () => {
        const bounds = preview.getBoundingClientRect();
        const x = Math.min(1, Math.max(0, (latestEvent.clientX - bounds.left) / bounds.width));
        const y = Math.min(1, Math.max(0, (latestEvent.clientY - bounds.top) / bounds.height));
        const shiftX = (x - 0.5) * 18;
        const shiftY = (y - 0.5) * 14;

        preview.style.setProperty("--spot-x", `${x * 100}%`);
        preview.style.setProperty("--spot-y", `${y * 100}%`);
        preview.style.setProperty("--rotate-x", `${(0.5 - y) * 2.4}deg`);
        preview.style.setProperty("--rotate-y", `${(x - 0.5) * 2.8}deg`);
        preview.style.setProperty("--shift-x", `${shiftX}px`);
        preview.style.setProperty("--shift-y", `${shiftY}px`);
        preview.style.setProperty("--slice-one-x", `${shiftX * -0.45}px`);
        preview.style.setProperty("--slice-one-y", `${shiftY * -0.25}px`);
        preview.style.setProperty("--slice-two-x", `${shiftX * 0.2}px`);
        preview.style.setProperty("--slice-two-y", `${shiftY * 0.12}px`);
        preview.style.setProperty("--slice-three-x", `${shiftX * 0.7}px`);
        preview.style.setProperty("--slice-three-y", `${shiftY * 0.35}px`);
        pointerFrame = 0;
      };

      preview.addEventListener("pointermove", (event) => {
        latestEvent = event;
        if (!pointerFrame) pointerFrame = requestAnimationFrame(paintPointer);
      });

      preview.addEventListener("pointerleave", () => {
        preview.style.setProperty("--spot-x", "50%");
        preview.style.setProperty("--spot-y", "50%");
        preview.style.setProperty("--rotate-x", "0deg");
        preview.style.setProperty("--rotate-y", "0deg");
        preview.style.setProperty("--shift-x", "0px");
        preview.style.setProperty("--shift-y", "0px");
        preview.style.setProperty("--slice-one-x", "0px");
        preview.style.setProperty("--slice-one-y", "0px");
        preview.style.setProperty("--slice-two-x", "0px");
        preview.style.setProperty("--slice-two-y", "0px");
        preview.style.setProperty("--slice-three-x", "0px");
        preview.style.setProperty("--slice-three-y", "0px");
      });
    });
  }

  reduceMotion.addEventListener("change", () => {
    if (reduceMotion.matches) {
      showEverything();
      document.querySelectorAll("video").forEach((video) => video.pause());
    }
  });
})();
