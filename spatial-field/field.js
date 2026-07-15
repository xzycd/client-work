const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.min.js";

const state = {
  tension: 58,
  tempo: 36,
  depth: 72,
  energy: 44,
  topology: "orbit",
  material: "graphite",
  stage: "direction",
};

const stageNames = {
  direction: "Direction",
  structure: "Structure",
  build: "Build",
  delivery: "Delivery",
};

const topologyNames = {
  orbit: "Orbit",
  span: "Span",
  fold: "Fold",
};

const materialNames = {
  graphite: "Graphite",
  glass: "Smoke glass",
  wire: "Wireframe",
};

const stageImages = {
  direction: "assets/field-direction.jpg",
  structure: "assets/field-structure.jpg",
  build: "assets/field-structure.jpg",
  delivery: "assets/field-delivery.jpg",
};

const root = document.documentElement;
const scenePanel = document.querySelector(".scene-panel");
const sceneFallback = document.querySelector("#sceneFallback");
const sceneLoading = document.querySelector("#sceneLoading");
const sceneError = document.querySelector("#sceneError");
const sceneStage = document.querySelector("#sceneStage");
const sceneMode = document.querySelector("#sceneMode");
const recipeDirection = document.querySelector("#recipeDirection");
const recipeStructure = document.querySelector("#recipeStructure");
const recipeBuild = document.querySelector("#recipeBuild");
const recipeStatus = document.querySelector("#recipeStatus");
const exportStill = document.querySelector("#exportStill");
const copyRecipe = document.querySelector("#copyRecipe");
const themeToggle = document.querySelector("#themeToggle");
const themeLabel = themeToggle.querySelector(".theme-label");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const systemThemeQuery = window.matchMedia("(prefers-color-scheme: light)");

let field = null;
let statusTimer = 0;

function readStoredTheme() {
  try {
    return localStorage.getItem("field-theme");
  } catch {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem("field-theme", theme);
  } catch {
    // The theme still works when storage is unavailable.
  }
}

function currentTheme() {
  const explicitTheme = root.dataset.theme;
  if (explicitTheme) return explicitTheme;
  return systemThemeQuery.matches ? "light" : "dark";
}

function syncThemeControl() {
  const theme = currentTheme();
  const isLight = theme === "light";
  themeLabel.textContent = isLight ? "Dark mode" : "Light mode";
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  document.querySelector('meta[name="theme-color"]').setAttribute("content", isLight ? "#e8e6df" : "#101110");
  field?.applyTheme();
}

const savedTheme = readStoredTheme();
if (savedTheme === "light" || savedTheme === "dark") {
  root.dataset.theme = savedTheme;
}
syncThemeControl();

themeToggle.addEventListener("click", () => {
  const nextTheme = currentTheme() === "light" ? "dark" : "light";
  root.dataset.theme = nextTheme;
  storeTheme(nextTheme);
  syncThemeControl();
});

systemThemeQuery.addEventListener("change", () => {
  if (!root.dataset.theme) syncThemeControl();
});

Object.values(stageImages).forEach((source) => {
  const image = new Image();
  image.src = source;
});

function setRangeProgress(input) {
  const min = Number(input.min) || 0;
  const max = Number(input.max) || 100;
  const value = Number(input.value);
  const progress = ((value - min) / (max - min)) * 100;
  input.style.setProperty("--range-progress", `${progress}%`);
  input.setAttribute("aria-valuetext", `${value} out of ${max}`);
}

function updateRecipe() {
  recipeDirection.textContent = `Tension ${state.tension}, tempo ${state.tempo}, depth ${state.depth}`;
  recipeStructure.textContent = `${topologyNames[state.topology]} topology`;
  recipeBuild.textContent = `${materialNames[state.material]} surface, energy ${state.energy}`;
  sceneMode.textContent = `${topologyNames[state.topology]} / ${materialNames[state.material]}`;
}

function setTemporaryStatus(message) {
  window.clearTimeout(statusTimer);
  recipeStatus.textContent = message;
  statusTimer = window.setTimeout(() => {
    recipeStatus.textContent = "Ready to hand off";
  }, 1800);
}

function recipeText() {
  return [
    "FIELD RECIPE",
    "",
    `Direction: tension ${state.tension}, tempo ${state.tempo}, depth ${state.depth}`,
    `Structure: ${topologyNames[state.topology]} topology`,
    `Build: ${materialNames[state.material]} surface, kinetic energy ${state.energy}`,
    "Delivery: responsive canvas, static fallback, reduced-motion mode",
  ].join("\n");
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.append(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  textArea.remove();
  if (!copied) throw new Error("Copy command was rejected");
}

copyRecipe.addEventListener("click", async () => {
  try {
    await copyText(recipeText());
    setTemporaryStatus("Recipe copied");
  } catch {
    setTemporaryStatus("Copy unavailable in this browser");
  }
});

exportStill.addEventListener("click", () => {
  try {
    const source = field ? field.exportImage() : sceneFallback.currentSrc || sceneFallback.src;
    const link = document.createElement("a");
    link.href = source;
    link.download = `field-${state.topology}-${state.material}.${field ? "png" : "jpg"}`;
    document.body.append(link);
    link.click();
    link.remove();
    setTemporaryStatus(field ? "Still exported" : "Reference image exported");
  } catch {
    setTemporaryStatus("Export unavailable in this browser");
  }
});

document.querySelectorAll('input[type="range"]').forEach((input) => {
  setRangeProgress(input);
  input.addEventListener("input", () => {
    const value = Number(input.value);
    state[input.name] = value;
    document.querySelector(`#${input.id}Value`).textContent = value;
    setRangeProgress(input);
    updateRecipe();
    field?.applyState();
  });
});

document.querySelectorAll(".topology-option").forEach((button) => {
  button.addEventListener("click", () => {
    state.topology = button.dataset.topology;
    document.querySelectorAll(".topology-option").forEach((option) => {
      const selected = option === button;
      option.classList.toggle("is-selected", selected);
      option.setAttribute("aria-pressed", String(selected));
    });
    updateRecipe();
    field?.rebuildCore();
  });
});

document.querySelectorAll('input[name="material"]').forEach((input) => {
  input.addEventListener("change", () => {
    if (!input.checked) return;
    state.material = input.value;
    document.querySelectorAll(".material-option").forEach((option) => {
      option.classList.toggle("is-selected", option.contains(input));
    });
    updateRecipe();
    field?.applyState();
  });
});

function setStage(stage) {
  if (!stageNames[stage]) return;
  state.stage = stage;
  sceneStage.textContent = stageNames[stage];
  if (!scenePanel.classList.contains("is-ready")) {
    sceneFallback.src = stageImages[stage];
  } else {
    sceneFallback.animate?.(
      [{ opacity: 0.02 }, { opacity: 0.08 }],
      { duration: reducedMotionQuery.matches ? 1 : 520, easing: "ease-out" },
    );
    sceneFallback.src = stageImages[stage];
  }

  document.querySelectorAll(".chapter-nav button").forEach((button) => {
    const selected = button.dataset.target === stage;
    button.classList.toggle("is-active", selected);
    if (selected) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  });
  field?.setStage(stage);
}

document.querySelectorAll(".chapter-nav button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(`#${button.dataset.target}`).scrollIntoView({
      behavior: reducedMotionQuery.matches ? "auto" : "smooth",
      block: "start",
    });
  });
});

const stageObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setStage(entry.target.dataset.stage);
    });
  },
  { rootMargin: "-42% 0px -45% 0px", threshold: 0 },
);

document.querySelectorAll(".observe-stage").forEach((section) => stageObserver.observe(section));
updateRecipe();
setStage("direction");

function cssColor(variable) {
  return getComputedStyle(root).getPropertyValue(variable).trim();
}

function makeField(THREE) {
  const canvas = document.querySelector("#fieldCanvas");
  let renderer;

  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });
  } catch (error) {
    throw new Error("WebGL renderer unavailable", { cause: error });
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100);
  camera.position.set(0.2, 0.05, 7.3);

  const world = new THREE.Group();
  const coreGroup = new THREE.Group();
  const frameGroup = new THREE.Group();
  const membraneGroup = new THREE.Group();
  const baseGroup = new THREE.Group();
  world.add(coreGroup, frameGroup, membraneGroup, baseGroup);
  scene.add(world);

  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x313331,
    metalness: 0.82,
    roughness: 0.24,
    transparent: true,
    opacity: 1,
    clearcoat: 0.72,
    clearcoatRoughness: 0.2,
  });
  const coreWireMaterial = new THREE.MeshBasicMaterial({
    color: 0xe8653d,
    wireframe: true,
    transparent: true,
    opacity: 0.055,
    depthWrite: false,
  });
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0xe8653d,
    metalness: 0.24,
    roughness: 0.28,
    emissive: 0x431509,
    emissiveIntensity: 0.42,
  });
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0xa5a69f,
    metalness: 0.92,
    roughness: 0.24,
    transparent: true,
    opacity: 0.2,
  });
  const membraneMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x8a8d88,
    metalness: 0,
    roughness: 0.38,
    transmission: 0.72,
    transparent: true,
    opacity: 0.1,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x252624,
    metalness: 0.72,
    roughness: 0.48,
    transparent: true,
    opacity: 0,
  });

  const ambient = new THREE.AmbientLight(0xe8e6df, 0.88);
  const keyLight = new THREE.DirectionalLight(0xf4eee4, 3.8);
  keyLight.position.set(-4.5, 5.5, 6.5);
  const rimLight = new THREE.DirectionalLight(0xaeb5ad, 2.4);
  rimLight.position.set(5.2, -1.6, 3.2);
  const accentLight = new THREE.PointLight(0xe8653d, 34, 12, 2);
  accentLight.position.set(2.6, 0.2, 3.4);
  scene.add(ambient, keyLight, rimLight, accentLight);

  const rodGeometry = new THREE.CylinderGeometry(0.014, 0.014, 1, 7);
  const up = new THREE.Vector3(0, 1, 0);
  const tempDirection = new THREE.Vector3();
  const tempMidpoint = new THREE.Vector3();
  const frameScaleTarget = new THREE.Vector3();

  function addRod(start, end) {
    const rod = new THREE.Mesh(rodGeometry, frameMaterial);
    tempDirection.subVectors(end, start);
    const length = tempDirection.length();
    tempMidpoint.addVectors(start, end).multiplyScalar(0.5);
    rod.position.copy(tempMidpoint);
    rod.scale.y = length;
    rod.quaternion.setFromUnitVectors(up, tempDirection.normalize());
    frameGroup.add(rod);
  }

  const framePairs = [
    [[-1.65, -1.18, -0.7], [-1.12, 1.28, -0.2]],
    [[-1.08, -1.35, 0.6], [-0.28, 1.43, 0.92]],
    [[-0.5, -1.48, -0.9], [0.34, 1.3, -1.05]],
    [[0.12, -1.42, 0.98], [0.86, 1.35, 0.55]],
    [[0.65, -1.36, -0.82], [1.4, 1.12, -0.26]],
    [[1.22, -1.18, 0.58], [1.72, 1.06, 0.18]],
    [[-1.62, -0.45, 0.82], [1.62, 0.72, -0.78]],
    [[-1.48, 0.84, -0.52], [1.55, -0.6, 0.68]],
    [[-1.35, 0.15, -1.1], [1.28, 0.18, 1.08]],
  ];
  framePairs.forEach(([start, end]) => addRod(new THREE.Vector3(...start), new THREE.Vector3(...end)));

  const membraneSpecs = [
    { position: [-0.85, 0.58, -0.35], rotation: [0.28, -0.42, -0.16], scale: [1.2, 0.76, 1] },
    { position: [0.7, -0.42, 0.52], rotation: [-0.3, 0.5, 0.22], scale: [1.05, 0.68, 1] },
    { position: [0.42, 0.82, -0.74], rotation: [0.16, 0.25, 0.62], scale: [0.84, 0.58, 1] },
  ];

  membraneSpecs.forEach((spec, index) => {
    const geometry = new THREE.PlaneGeometry(1.5, 1, 12, 8);
    const membrane = new THREE.Mesh(geometry, membraneMaterial);
    membrane.position.set(...spec.position);
    membrane.rotation.set(...spec.rotation);
    membrane.scale.set(...spec.scale);
    membrane.userData.baseRotation = membrane.rotation.clone();
    membrane.userData.index = index;
    membraneGroup.add(membrane);
  });

  const base = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.16, 3.15), baseMaterial);
  base.position.y = -1.72;
  baseGroup.add(base);
  const baseInset = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.05, 2.52), frameMaterial);
  baseInset.position.y = -1.62;
  baseInset.material = frameMaterial.clone();
  baseInset.material.transparent = true;
  baseInset.material.opacity = 0;
  baseGroup.add(baseInset);

  let coreMesh = null;
  let coreWire = null;
  let accentMesh = null;
  let coreGeometry = null;
  let accentGeometry = null;

  const topologyConfig = {
    orbit: { p: 2, q: 3, radius: 1.06, tube: 0.21, turn: -0.14 },
    span: { p: 3, q: 2, radius: 1.02, tube: 0.17, turn: 0.35 },
    fold: { p: 3, q: 5, radius: 0.92, tube: 0.15, turn: -0.48 },
  };

  function makeKnotCurve(config, scale = 1, phase = 0) {
    const points = [];
    const segments = 240;
    for (let index = 0; index < segments; index += 1) {
      const u = (index / segments) * config.p * Math.PI * 2;
      const cu = Math.cos(u + phase);
      const su = Math.sin(u + phase);
      const quOverP = (config.q / config.p) * u;
      const radial = config.radius * (2 + Math.cos(quOverP)) * 0.5;
      points.push(new THREE.Vector3(
        radial * cu * scale,
        radial * su * scale,
        config.radius * Math.sin(quOverP) * 0.5 * scale,
      ));
    }
    return new THREE.CatmullRomCurve3(points, true, "centripetal", 0.5);
  }

  function disposeCore() {
    if (coreMesh) coreGroup.remove(coreMesh);
    if (coreWire) coreGroup.remove(coreWire);
    if (accentMesh) coreGroup.remove(accentMesh);
    coreGeometry?.dispose();
    accentGeometry?.dispose();
  }

  function rebuildCore() {
    disposeCore();
    const config = topologyConfig[state.topology];
    const mainCurve = makeKnotCurve(config);
    const accentCurve = makeKnotCurve(config, 1.095, 0.018);
    coreGeometry = new THREE.TubeGeometry(mainCurve, 240, config.tube, 12, true);
    accentGeometry = new THREE.TubeGeometry(accentCurve, 240, 0.018, 6, true);
    coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    coreWire = new THREE.Mesh(coreGeometry, coreWireMaterial);
    accentMesh = new THREE.Mesh(accentGeometry, accentMaterial);
    coreGroup.rotation.z = config.turn;
    coreGroup.add(coreMesh, coreWire, accentMesh);
    applyState();
  }

  const stageTargets = {
    direction: {
      coreScale: 1,
      frameScale: 0.72,
      frameOpacity: 0.1,
      membraneOpacity: 0.035,
      baseOpacity: 0,
      baseInsetOpacity: 0,
      worldY: 0,
      cameraZ: 7.25,
    },
    structure: {
      coreScale: 0.76,
      frameScale: 1,
      frameOpacity: 0.72,
      membraneOpacity: 0.16,
      baseOpacity: 0,
      baseInsetOpacity: 0,
      worldY: 0,
      cameraZ: 7.65,
    },
    build: {
      coreScale: 0.94,
      frameScale: 0.9,
      frameOpacity: 0.42,
      membraneOpacity: 0.48,
      baseOpacity: 0.08,
      baseInsetOpacity: 0.05,
      worldY: 0.1,
      cameraZ: 7.45,
    },
    delivery: {
      coreScale: 0.7,
      frameScale: 0.62,
      frameOpacity: 0.18,
      membraneOpacity: 0.18,
      baseOpacity: 0.92,
      baseInsetOpacity: 0.28,
      worldY: 0.48,
      cameraZ: 7.65,
    },
  };

  let stageTarget = stageTargets.direction;
  let reducedMotion = reducedMotionQuery.matches;
  let animationFrame = 0;
  let lastTime = performance.now();
  let dragging = false;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let rotationStartX = -0.14;
  let rotationStartY = 0.35;
  let targetRotationX = rotationStartX;
  let targetRotationY = rotationStartY;
  let hoverX = 0;
  let hoverY = 0;

  function applyTheme() {
    const surface = cssColor("--surface");
    const ink = cssColor("--ink");
    const muted = cssColor("--muted");
    const accent = cssColor("--accent");
    scene.background = new THREE.Color(surface);
    coreWireMaterial.color.set(accent);
    accentMaterial.color.set(accent);
    accentMaterial.emissive.set(accent).multiplyScalar(0.22);
    frameMaterial.color.set(muted);
    baseMaterial.color.set(currentTheme() === "light" ? "#aaa89f" : "#252624");
    if (state.material === "wire") coreWireMaterial.color.set(ink);
    if (state.material === "glass") coreMaterial.color.set(currentTheme() === "light" ? "#cbc9c1" : "#6e736f");
    applyState();
  }

  function applyState() {
    const depth = state.depth / 100;
    const tension = state.tension / 100;
    coreGroup.userData.userScale = new THREE.Vector3(
      0.88 + depth * 0.22,
      0.88 + tension * 0.2,
      0.82 + depth * 0.34,
    );

    coreMaterial.wireframe = false;
    coreMaterial.depthWrite = true;
    coreMaterial.transmission = 0;
    coreMaterial.clearcoat = 0.72;
    coreMaterial.metalness = 0.82;
    coreMaterial.roughness = 0.18 + (1 - tension) * 0.24;
    coreMaterial.opacity = 1;
    coreMaterial.color.set(currentTheme() === "light" ? "#4c4e4b" : "#313331");
    coreWireMaterial.opacity = 0.055;
    coreWireMaterial.color.set(cssColor("--accent"));
    accentMesh.visible = true;

    if (state.material === "glass") {
      coreMaterial.metalness = 0.02;
      coreMaterial.roughness = 0.12;
      coreMaterial.transmission = 0.86;
      coreMaterial.opacity = 0.68;
      coreMaterial.depthWrite = false;
      coreMaterial.clearcoat = 0.28;
      coreMaterial.color.set(currentTheme() === "light" ? "#cbc9c1" : "#6e736f");
      coreWireMaterial.opacity = 0.12;
    }

    if (state.material === "wire") {
      coreMaterial.wireframe = true;
      coreMaterial.metalness = 0.24;
      coreMaterial.roughness = 0.55;
      coreMaterial.opacity = 0.18;
      coreMaterial.depthWrite = false;
      coreMaterial.color.set(cssColor("--muted"));
      coreWireMaterial.opacity = 0.72;
      coreWireMaterial.color.set(cssColor("--ink"));
      accentMesh.visible = state.energy > 8;
    }

    coreMaterial.needsUpdate = true;
    coreWireMaterial.needsUpdate = true;
    if (reducedMotion) renderStatic();
  }

  function setStage(stage) {
    stageTarget = stageTargets[stage] || stageTargets.direction;
    if (reducedMotion) {
      applyStageTargets(1);
      renderStatic();
    }
  }

  function applyStageTargets(ease) {
    const userScale = coreGroup.userData.userScale || new THREE.Vector3(1, 1, 1);
    coreGroup.scale.x = THREE.MathUtils.lerp(coreGroup.scale.x, stageTarget.coreScale * userScale.x, ease);
    coreGroup.scale.y = THREE.MathUtils.lerp(coreGroup.scale.y, stageTarget.coreScale * userScale.y, ease);
    coreGroup.scale.z = THREE.MathUtils.lerp(coreGroup.scale.z, stageTarget.coreScale * userScale.z, ease);
    frameScaleTarget.setScalar(stageTarget.frameScale);
    frameGroup.scale.lerp(frameScaleTarget, ease);
    frameMaterial.opacity = THREE.MathUtils.lerp(frameMaterial.opacity, stageTarget.frameOpacity, ease);
    membraneMaterial.opacity = THREE.MathUtils.lerp(membraneMaterial.opacity, stageTarget.membraneOpacity, ease);
    baseMaterial.opacity = THREE.MathUtils.lerp(baseMaterial.opacity, stageTarget.baseOpacity, ease);
    baseInset.material.opacity = THREE.MathUtils.lerp(baseInset.material.opacity, stageTarget.baseInsetOpacity, ease);
    world.position.y = THREE.MathUtils.lerp(world.position.y, stageTarget.worldY, ease);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, stageTarget.cameraZ, ease);
  }

  function resize() {
    const rect = scenePanel.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    if (reducedMotion) renderStatic();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(scenePanel);

  function renderStatic() {
    applyStageTargets(1);
    world.rotation.x = targetRotationX;
    world.rotation.y = targetRotationY;
    renderer.render(scene, camera);
  }

  function render(time) {
    const delta = Math.min((time - lastTime) / 1000, 0.04);
    lastTime = time;
    const ease = 1 - Math.exp(-delta * 4.8);
    applyStageTargets(ease);

    const autoSpeed = 0.035 + (state.tempo / 100) * 0.19;
    targetRotationY += delta * autoSpeed;
    world.rotation.x = THREE.MathUtils.lerp(world.rotation.x, targetRotationX + hoverY * 0.12, ease * 0.82);
    world.rotation.y = THREE.MathUtils.lerp(world.rotation.y, targetRotationY + hoverX * 0.16, ease * 0.82);
    frameGroup.rotation.y += delta * (0.014 + state.energy * 0.00055);
    frameGroup.rotation.z = Math.sin(time * 0.00022) * state.energy * 0.0009;
    membraneGroup.children.forEach((membrane) => {
      const baseRotation = membrane.userData.baseRotation;
      const phase = time * (0.00028 + state.energy * 0.000002) + membrane.userData.index * 1.9;
      membrane.rotation.x = baseRotation.x + Math.sin(phase) * state.energy * 0.0015;
      membrane.rotation.y = baseRotation.y + Math.cos(phase * 0.8) * state.energy * 0.0012;
    });

    renderer.render(scene, camera);
    animationFrame = requestAnimationFrame(render);
  }

  function startRendering() {
    cancelAnimationFrame(animationFrame);
    if (reducedMotion) {
      renderStatic();
      return;
    }
    lastTime = performance.now();
    animationFrame = requestAnimationFrame(render);
  }

  function pointerPosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: ((event.clientY - rect.top) / rect.height) * 2 - 1,
    };
  }

  canvas.addEventListener("pointerdown", (event) => {
    dragging = true;
    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    rotationStartX = targetRotationX;
    rotationStartY = targetRotationY;
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    const pointer = pointerPosition(event);
    hoverX = pointer.x;
    hoverY = pointer.y;
    if (dragging) {
      targetRotationY = rotationStartY + (event.clientX - pointerStartX) * 0.007;
      targetRotationX = THREE.MathUtils.clamp(rotationStartX + (event.clientY - pointerStartY) * 0.006, -1.15, 1.15);
    }
    if (reducedMotion) renderStatic();
  });

  canvas.addEventListener("pointerup", (event) => {
    dragging = false;
    canvas.releasePointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointercancel", () => {
    dragging = false;
  });

  canvas.addEventListener("pointerleave", () => {
    if (!dragging) {
      hoverX = 0;
      hoverY = 0;
    }
  });

  canvas.addEventListener("keydown", (event) => {
    const step = event.shiftKey ? 0.18 : 0.08;
    if (event.key === "ArrowLeft") targetRotationY -= step;
    else if (event.key === "ArrowRight") targetRotationY += step;
    else if (event.key === "ArrowUp") targetRotationX = Math.max(-1.15, targetRotationX - step);
    else if (event.key === "ArrowDown") targetRotationX = Math.min(1.15, targetRotationX + step);
    else return;
    event.preventDefault();
    if (reducedMotion) renderStatic();
  });

  const handleMotionPreference = (event) => {
    reducedMotion = event.matches;
    startRendering();
  };
  reducedMotionQuery.addEventListener("change", handleMotionPreference);

  function exportImage() {
    renderer.render(scene, camera);
    return renderer.domElement.toDataURL("image/png");
  }

  function destroy() {
    cancelAnimationFrame(animationFrame);
    resizeObserver.disconnect();
    reducedMotionQuery.removeEventListener("change", handleMotionPreference);
    disposeCore();
    rodGeometry.dispose();
    membraneGroup.children.forEach((membrane) => membrane.geometry.dispose());
    base.geometry.dispose();
    baseInset.geometry.dispose();
    [coreMaterial, coreWireMaterial, accentMaterial, frameMaterial, membraneMaterial, baseMaterial, baseInset.material].forEach((material) => material.dispose());
    renderer.dispose();
  }

  rebuildCore();
  applyTheme();
  applyState();
  setStage(state.stage);
  resize();
  startRendering();
  renderer.render(scene, camera);

  return { applyState, applyTheme, rebuildCore, setStage, exportImage, destroy };
}

function showSceneError() {
  sceneLoading.hidden = true;
  sceneError.hidden = false;
  scenePanel.classList.add("has-error");
}

const threeTimeout = new Promise((_, reject) => {
  window.setTimeout(() => reject(new Error("Three.js load timed out")), 10000);
});

Promise.race([import(THREE_URL), threeTimeout])
  .then((THREE) => {
    field = makeField(THREE);
    scenePanel.classList.add("is-ready");
  })
  .catch(() => {
    showSceneError();
  });

window.addEventListener("pagehide", () => {
  stageObserver.disconnect();
  field?.destroy();
}, { once: true });
