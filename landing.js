(() => {
  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const progress = document.querySelector("[data-scroll-progress]");
  const activeIndex = document.querySelector("[data-active-index]");
  const revealTargets = document.querySelectorAll("[data-reveal]");
  const projects = [...document.querySelectorAll("[data-project]")];
  const hero = document.querySelector("[data-hero]");
  const heroTitle = hero?.querySelector(".hero-title");
  const heroIndex = hero?.querySelector("[data-hero-index]");
  const heroLabel = hero?.querySelector("[data-hero-label]");
  const heroNav = hero?.querySelector(".hero-project-nav");
  const heroNavItems = [...(hero?.querySelectorAll("[data-hero-target]") ?? [])];
  const transitionLabel = document.querySelector("[data-transition-label]");
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const kineticWords = [...document.querySelectorAll("[data-kinetic]")];
  kineticWords.forEach((word, wordIndex) => {
    const value = word.textContent.trim();
    word.textContent = "";
    word.setAttribute("aria-hidden", "true");

    [...value].forEach((character, characterIndex) => {
      const letter = document.createElement("span");
      letter.className = "kinetic-letter";
      letter.textContent = character;
      letter.style.setProperty("--letter-delay", `${(wordIndex * 2 + characterIndex) * 34}ms`);
      word.append(letter);
    });
  });

  const kineticLetters = [...document.querySelectorAll(".kinetic-letter")];
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

  let heroCycle = 0;
  let heroCyclePosition = 0;

  const setHeroState = (item) => {
    if (!item) return;
    const index = item.dataset.heroTarget;
    const label = item.dataset.label;
    heroNavItems.forEach((navItem) => navItem.classList.toggle("is-active", navItem === item));
    if (heroIndex) heroIndex.textContent = index;
    if (heroLabel) heroLabel.textContent = label;
    heroCyclePosition = heroNavItems.indexOf(item);
  };

  const stopHeroCycle = () => {
    window.clearInterval(heroCycle);
    heroCycle = 0;
    hero?.classList.remove("is-cycling");
  };

  const startHeroCycle = () => {
    stopHeroCycle();
    if (reduceMotion.matches || heroNavItems.length < 2 || document.hidden) return;
    hero?.classList.add("is-cycling");
    heroCycle = window.setInterval(() => {
      heroCyclePosition = (heroCyclePosition + 1) % heroNavItems.length;
      setHeroState(heroNavItems[heroCyclePosition]);
    }, 2800);
  };

  if (heroNavItems.length) {
    setHeroState(heroNavItems[0]);
    startHeroCycle();

    heroNavItems.forEach((item) => {
      item.addEventListener("pointerenter", () => {
        stopHeroCycle();
        setHeroState(item);
        hero?.classList.add("is-nav-hover");
      });

      item.addEventListener("focus", () => {
        stopHeroCycle();
        setHeroState(item);
      });
    });

    heroNav?.addEventListener("pointerleave", () => {
      hero?.classList.remove("is-nav-hover");
      startHeroCycle();
    });

    heroNav?.addEventListener("focusout", (event) => {
      if (event.relatedTarget && heroNav.contains(event.relatedTarget)) return;
      startHeroCycle();
    });
  }

  const heroPointer = { x: 0.5, y: 0.5, active: false };
  let heroPointerFrame = 0;
  let latestHeroEvent;

  const resetKineticLetters = () => {
    kineticLetters.forEach((letter) => {
      letter.style.removeProperty("--letter-y");
      letter.style.removeProperty("--letter-r");
    });
  };

  const paintHeroPointer = () => {
    if (!hero || !latestHeroEvent) return;
    const bounds = hero.getBoundingClientRect();
    const localX = clamp(latestHeroEvent.clientX - bounds.left, 0, bounds.width);
    const localY = clamp(latestHeroEvent.clientY - bounds.top, 0, bounds.height);
    heroPointer.x = bounds.width ? localX / bounds.width : 0.5;
    heroPointer.y = bounds.height ? localY / bounds.height : 0.5;
    heroPointer.active = true;

    hero.style.setProperty("--cursor-x", `${localX}px`);
    hero.style.setProperty("--cursor-y", `${localY}px`);
    hero.style.setProperty("--hero-x", `${heroPointer.x * 100}%`);
    hero.style.setProperty("--hero-y", `${heroPointer.y * 100}%`);

    if (finePointer.matches && !reduceMotion.matches) {
      kineticLetters.forEach((letter, index) => {
        const letterBounds = letter.getBoundingClientRect();
        const center = letterBounds.left + letterBounds.width * 0.5;
        const signedDistance = latestHeroEvent.clientX - center;
        const influence = Math.max(0, 1 - Math.abs(signedDistance) / 190);
        const lift = -11 * influence + (heroPointer.y - 0.5) * 4;
        const rotation = clamp(signedDistance / 80, -1, 1) * influence * 1.8;
        letter.style.setProperty("--letter-y", `${lift.toFixed(2)}px`);
        letter.style.setProperty("--letter-r", `${rotation.toFixed(2)}deg`);
        letter.style.zIndex = String(Math.round(influence * 10) + index);
      });
    }

    heroPointerFrame = 0;
  };

  if (hero) {
    hero.addEventListener("pointerenter", () => {
      hero.classList.add("has-pointer");
      heroTitle?.classList.add("is-reacting");
    });

    hero.addEventListener("pointermove", (event) => {
      latestHeroEvent = event;
      if (!heroPointerFrame) heroPointerFrame = requestAnimationFrame(paintHeroPointer);
    });

    hero.addEventListener("pointerleave", () => {
      hero.classList.remove("has-pointer", "is-nav-hover");
      heroTitle?.classList.remove("is-reacting");
      heroPointer.active = false;
      resetKineticLetters();
    });
  }

  let canvasController;
  const heroCanvas = hero?.querySelector("[data-hero-canvas]");

  if (hero && heroCanvas) {
    const context = heroCanvas.getContext("2d", { alpha: true });
    let width = 1;
    let height = 1;
    let canvasFrame = 0;
    let canvasVisible = true;

    const drawField = (time = 0) => {
      if (!context || !width || !height) return;
      const seconds = time * 0.001;
      const focusX = heroPointer.active
        ? heroPointer.x * width
        : width * (0.5 + Math.sin(seconds * 0.44) * 0.27);
      const focusY = heroPointer.active
        ? heroPointer.y * height
        : height * (0.48 + Math.cos(seconds * 0.36) * 0.2);
      const spacing = width < 720 ? 30 : 42;
      const radius = width < 720 ? 125 : 190;

      context.clearRect(0, 0, width, height);

      for (let y = spacing * 0.5; y < height + spacing; y += spacing) {
        for (let x = spacing * 0.5; x < width + spacing; x += spacing) {
          const dx = x - focusX;
          const dy = y - focusY;
          const distance = Math.hypot(dx, dy) || 1;
          const influence = Math.max(0, 1 - distance / radius);
          const wave = Math.sin(seconds * 1.5 + x * 0.017 + y * 0.012) * 1.4;
          const push = influence * influence * (18 + wave * 2);
          const pointX = x + (dx / distance) * push;
          const pointY = y + (dy / distance) * push + wave * (0.25 + influence);
          const size = 0.65 + influence * 1.45;

          context.beginPath();
          context.arc(pointX, pointY, size, 0, Math.PI * 2);
          context.fillStyle = influence > 0.68
            ? `rgba(239, 106, 69, ${0.32 + influence * 0.55})`
            : `rgba(242, 240, 233, ${0.08 + influence * 0.24})`;
          context.fill();
        }
      }

      context.beginPath();
      context.arc(focusX, focusY, 24 + Math.sin(seconds * 2) * 3, 0, Math.PI * 2);
      context.strokeStyle = "rgba(239, 106, 69, 0.26)";
      context.lineWidth = 1;
      context.stroke();

      context.beginPath();
      context.moveTo(focusX - 8, focusY);
      context.lineTo(focusX + 8, focusY);
      context.moveTo(focusX, focusY - 8);
      context.lineTo(focusX, focusY + 8);
      context.strokeStyle = "rgba(239, 106, 69, 0.7)";
      context.stroke();
    };

    const renderField = (time) => {
      canvasFrame = 0;
      if (!canvasVisible || document.hidden) return;
      drawField(time);
      if (!reduceMotion.matches) canvasFrame = requestAnimationFrame(renderField);
    };

    const startField = () => {
      if (canvasFrame || !canvasVisible || document.hidden) return;
      canvasFrame = requestAnimationFrame(renderField);
    };

    const resizeField = () => {
      const bounds = hero.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(bounds.width));
      height = Math.max(1, Math.round(bounds.height));
      heroCanvas.width = Math.round(width * pixelRatio);
      heroCanvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      drawField(performance.now());
      startField();
    };

    if ("ResizeObserver" in window) {
      new ResizeObserver(resizeField).observe(hero);
    } else {
      window.addEventListener("resize", resizeField, { passive: true });
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        ([entry]) => {
          canvasVisible = entry.isIntersecting;
          if (canvasVisible) startField();
        },
        { rootMargin: "120px" }
      ).observe(hero);
    }

    canvasController = { resize: resizeField, start: startField, draw: drawField };
    resizeField();
  }

  let scrollFrame = 0;
  const updateScrollMotion = () => {
    const available = root.scrollHeight - window.innerHeight;
    const amount = available > 0 ? clamp(window.scrollY / available, 0, 1) : 0;
    if (progress) progress.style.transform = `scaleX(${amount})`;

    if (!reduceMotion.matches) {
      const viewportHeight = window.innerHeight;
      const heroShift = clamp(window.scrollY * -0.055, -34, 0);
      heroTitle?.style.setProperty("--hero-scroll-y", `${heroShift.toFixed(2)}px`);

      projects.forEach((project) => {
        const bounds = project.getBoundingClientRect();
        const centerDelta = bounds.top + bounds.height * 0.5 - viewportHeight * 0.5;
        const travel = viewportHeight * 0.5 + bounds.height * 0.5;
        const projectProgress = clamp(centerDelta / travel, -1, 1);
        const stageScale = 1.006 + Math.abs(projectProgress) * 0.012;
        project.style.setProperty("--project-copy-y", `${(projectProgress * 16).toFixed(2)}px`);
        project.style.setProperty("--stage-y", `${(projectProgress * 7).toFixed(2)}px`);
        project.style.setProperty("--stage-scale", stageScale.toFixed(4));
      });
    }

    scrollFrame = 0;
  };

  const requestScrollUpdate = () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(updateScrollMotion);
  };

  updateScrollMotion();
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate, { passive: true });

  if (finePointer.matches && !reduceMotion.matches) {
    document.querySelectorAll("[data-preview]").forEach((preview) => {
      let pointerFrame = 0;
      let latestEvent;

      const paintPointer = () => {
        const bounds = preview.getBoundingClientRect();
        const x = clamp((latestEvent.clientX - bounds.left) / bounds.width, 0, 1);
        const y = clamp((latestEvent.clientY - bounds.top) / bounds.height, 0, 1);
        const shiftX = (x - 0.5) * 18;
        const shiftY = (y - 0.5) * 14;

        preview.style.setProperty("--spot-x", `${x * 100}%`);
        preview.style.setProperty("--spot-y", `${y * 100}%`);
        preview.style.setProperty("--rotate-x", `${(0.5 - y) * 2.4}deg`);
        preview.style.setProperty("--rotate-y", `${(x - 0.5) * 2.8}deg`);
        preview.style.setProperty("--shift-x", `${shiftX}px`);
        preview.style.setProperty("--shift-y", `${shiftY}px`);
        preview.style.setProperty("--open-x", `${shiftX * 0.24}px`);
        preview.style.setProperty("--open-y", `${shiftY * 0.24}px`);
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
        preview.style.setProperty("--open-x", "0px");
        preview.style.setProperty("--open-y", "0px");
        preview.style.setProperty("--slice-one-x", "0px");
        preview.style.setProperty("--slice-one-y", "0px");
        preview.style.setProperty("--slice-two-x", "0px");
        preview.style.setProperty("--slice-two-y", "0px");
        preview.style.setProperty("--slice-three-x", "0px");
        preview.style.setProperty("--slice-three-y", "0px");
      });
    });
  }

  document.querySelectorAll(".project-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      const modifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
      if (event.defaultPrevented || modifiedClick || event.button !== 0 || reduceMotion.matches) return;

      event.preventDefault();
      const name = link.querySelector("h3")?.textContent.replace(/\s+/g, " ").trim() ?? "project";
      if (transitionLabel) transitionLabel.textContent = name;
      body.classList.add("is-transitioning");
      window.setTimeout(() => window.location.assign(link.href), 720);
    });
  });

  window.addEventListener("pageshow", () => body.classList.remove("is-transitioning"));

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopHeroCycle();
    } else {
      startHeroCycle();
      canvasController?.start();
    }
  });

  reduceMotion.addEventListener("change", () => {
    if (reduceMotion.matches) {
      showEverything();
      stopHeroCycle();
      resetKineticLetters();
      document.querySelectorAll("video").forEach((video) => video.pause());
      canvasController?.draw(performance.now());
    } else {
      startHeroCycle();
      canvasController?.resize();
      requestScrollUpdate();
    }
  });
})();
