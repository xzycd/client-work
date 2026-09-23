(() => {
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)");
  const revealTargets = document.querySelectorAll("[data-reveal]");
  const projects = [...document.querySelectorAll("[data-project]")];
  const strip = document.querySelector("[data-strip]");
  const plates = [...document.querySelectorAll("[data-plate]")];
  const markBars = [...document.querySelectorAll("[data-mark] i")];
  const nowIndex = document.querySelector("[data-now-index]");
  const nowName = document.querySelector("[data-now-name]");
  const transition = document.querySelector(".page-transition");
  const transitionLabel = document.querySelector("[data-transition-label]");
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  requestAnimationFrame(() => body.classList.add("is-ready"));

  const showMark = (position) => {
    markBars.forEach((bar, index) => bar.classList.toggle("is-on", index === position));
    const project = projects[position];
    if (!project) return;
    if (nowIndex) nowIndex.textContent = project.dataset.index;
    if (nowName) nowName.textContent = project.dataset.name;
  };

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

  let stripPosition = 0;
  let stripInView = true;

  if ("IntersectionObserver" in window) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const project = entry.target;
          const active = entry.isIntersecting && entry.intersectionRatio >= 0.32;
          project.classList.toggle("is-active", active);

          project.querySelectorAll("video").forEach((video) => {
            if (active && !reduceMotion.matches) {
              video.preload = "auto";
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          });

          if (active) showMark(projects.indexOf(project));
        });
      },
      { threshold: [0, 0.32, 0.6], rootMargin: "-12% 0px -12%" }
    );

    projects.forEach((project) => activeObserver.observe(project));

    if (strip) {
      new IntersectionObserver(([entry]) => {
        stripInView = entry.isIntersecting;
        if (stripInView) showMark(stripPosition);
      }, { threshold: 0.5 }).observe(strip);
    }
  }

  let stripCycle = 0;

  const openPlate = (position) => {
    stripPosition = position;
    plates.forEach((plate, index) => plate.classList.toggle("is-on", index === position));
    if (stripInView) showMark(position);
  };

  const stopCycle = () => {
    window.clearInterval(stripCycle);
    stripCycle = 0;
  };

  const startCycle = () => {
    stopCycle();
    if (reduceMotion.matches || !finePointer.matches || plates.length < 2 || document.hidden) return;
    stripCycle = window.setInterval(() => openPlate((stripPosition + 1) % plates.length), 3600);
  };

  if (plates.length) {
    openPlate(0);
    startCycle();

    plates.forEach((plate, index) => {
      plate.addEventListener("pointerenter", () => {
        stopCycle();
        openPlate(index);
      });
      plate.addEventListener("focus", () => {
        stopCycle();
        openPlate(index);
      });
    });

    strip?.addEventListener("pointerleave", startCycle);
    strip?.addEventListener("focusout", (event) => {
      if (!strip.contains(event.relatedTarget)) startCycle();
    });
  }

  let scrollFrame = 0;
  const updateScrollMotion = () => {
    scrollFrame = 0;
    if (reduceMotion.matches) return;
    const viewportHeight = window.innerHeight;

    projects.forEach((project) => {
      const bounds = project.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > viewportHeight) return;
      const centerDelta = bounds.top + bounds.height * 0.5 - viewportHeight * 0.5;
      const travel = viewportHeight * 0.5 + bounds.height * 0.5;
      const progress = clamp(centerDelta / travel, -1, 1);
      project.style.setProperty("--project-copy-y", `${(progress * 14).toFixed(2)}px`);
      project.style.setProperty("--stage-y", `${(progress * 8).toFixed(2)}px`);
    });
  };

  const requestScrollUpdate = () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollMotion);
  };

  updateScrollMotion();
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate, { passive: true });

  if (finePointer.matches && !reduceMotion.matches) {
    document.querySelectorAll("[data-preview]").forEach((preview) => {
      let pointerFrame = 0;
      let latestEvent;

      const paintPointer = () => {
        pointerFrame = 0;
        const bounds = preview.getBoundingClientRect();
        const x = clamp((latestEvent.clientX - bounds.left) / bounds.width, 0, 1) - 0.5;
        const y = clamp((latestEvent.clientY - bounds.top) / bounds.height, 0, 1) - 0.5;
        preview.style.setProperty("--shift-x", `${(x * -16).toFixed(1)}px`);
        preview.style.setProperty("--shift-y", `${(y * -12).toFixed(1)}px`);
      };

      preview.addEventListener("pointermove", (event) => {
        latestEvent = event;
        if (!pointerFrame) pointerFrame = requestAnimationFrame(paintPointer);
      });

      preview.addEventListener("pointerleave", () => {
        preview.style.setProperty("--shift-x", "0px");
        preview.style.setProperty("--shift-y", "0px");
      });
    });
  }

  document.querySelectorAll(".project-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      const modifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
      if (event.defaultPrevented || modifiedClick || event.button !== 0 || reduceMotion.matches) return;

      event.preventDefault();
      const project = link.closest("[data-project]");
      if (transitionLabel) transitionLabel.textContent = project?.dataset.name ?? "";
      const light = link.dataset.groundLight && prefersLight.matches;
      transition?.style.setProperty("--to-ground", light ? link.dataset.groundLight : link.dataset.ground);
      transition?.style.setProperty("--to-ink", light ? link.dataset.inkLight : link.dataset.ink);
      body.classList.add("is-transitioning");
      window.setTimeout(() => window.location.assign(link.href), 700);
    });
  });

  window.addEventListener("pageshow", () => body.classList.remove("is-transitioning"));

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopCycle();
    else startCycle();
  });

  reduceMotion.addEventListener("change", () => {
    if (reduceMotion.matches) {
      showEverything();
      stopCycle();
      document.querySelectorAll("video").forEach((video) => video.pause());
    } else {
      startCycle();
      requestScrollUpdate();
    }
  });
})();
