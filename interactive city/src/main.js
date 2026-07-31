import "./style.css";
import { CityScene } from "./city-scene.js";
import {
  CITIES,
  getAllLandmarks,
  getCity,
  getDistrict as findDistrict,
  getDistrictForLandmark as findDistrictForLandmark,
  getLandmark as findLandmark,
} from "./data.js";
import { localizeCity, t } from "./i18n.js";

const dom = {
  app: document.querySelector("#app"),
  canvas: document.querySelector("#city-canvas"),
  viewport: document.querySelector("#viewport"),
  loadingMark: document.querySelector("#loading-mark"),
  loadingCityLabel: document.querySelector("#loading-city-label"),
  loadingStatus: document.querySelector("#loading-status"),
  loadingProgress: document.querySelector("#loading-progress"),
  citySwitcher: document.querySelector("#city-switcher"),
  cityTransition: document.querySelector("#city-transition"),
  cityTransitionLabel: document.querySelector("#city-transition-label"),
  introEyebrow: document.querySelector("#intro-eyebrow"),
  introTitle: document.querySelector("#intro-title"),
  introBody: document.querySelector("#intro-body"),
  introCount: document.querySelector("#intro-count"),
  enterButton: document.querySelector("#enter-button"),
  introTrailButton: document.querySelector("#intro-trail-button"),
  brandHome: document.querySelector("#brand-home"),
  surpriseButton: document.querySelector("#surprise-button"),
  trailsButton: document.querySelector("#trails-button"),
  aboutButton: document.querySelector("#about-button"),
  languageControl: document.querySelector("#language-control"),
  themeButton: document.querySelector("#theme-button"),
  themeLabel: document.querySelector("#theme-label"),
  crumbCity: document.querySelector("#crumb-city"),
  crumbDistrict: document.querySelector("#crumb-district"),
  crumbPlace: document.querySelector("#crumb-place"),
  hotspots: document.querySelector("#hotspots"),
  districtRail: document.querySelector("#district-rail"),
  storyPanel: document.querySelector("#story-panel"),
  storyImage: document.querySelector("#story-image"),
  storyImageSkeleton: document.querySelector("#story-image-skeleton"),
  storyLevel: document.querySelector("#story-level"),
  storyLocalName: document.querySelector("#story-local-name"),
  storyTitle: document.querySelector("#story-title"),
  storyPosition: document.querySelector("#story-position"),
  storyHook: document.querySelector("#story-hook"),
  storyFact: document.querySelector("#story-fact"),
  storyBody: document.querySelector("#story-body"),
  storyLook: document.querySelector("#story-look"),
  factBlock: document.querySelector("#fact-block"),
  lookBlock: document.querySelector("#look-block"),
  quickFacts: document.querySelector("#quick-facts"),
  placeList: document.querySelector("#place-list"),
  panelBack: document.querySelector("#panel-back"),
  storySource: document.querySelector("#story-source"),
  imageSource: document.querySelector("#image-source"),
  imageCredit: document.querySelector("#image-credit"),
  placePager: document.querySelector("#place-pager"),
  previousPlace: document.querySelector("#previous-place"),
  nextPlace: document.querySelector("#next-place"),
  trailsDialog: document.querySelector("#trails-dialog"),
  aboutDialog: document.querySelector("#about-dialog"),
  trailOptions: document.querySelector("#trail-options"),
  trailProgress: document.querySelector("#trail-progress"),
  trailCount: document.querySelector("#trail-count"),
  trailName: document.querySelector("#trail-name"),
  trailExit: document.querySelector("#trail-exit"),
  trailNext: document.querySelector("#trail-next"),
  coach: document.querySelector("#coach"),
  coachClose: document.querySelector("#coach-close"),
  introFactIndex: document.querySelector("#intro-fact-index"),
  introFactText: document.querySelector("#intro-fact-text"),
  introFact: document.querySelector(".intro-fact"),
  liveStatus: document.querySelector("#live-status"),
  webglError: document.querySelector("#webgl-error"),
  webglFallbackCopy: document.querySelector("#webgl-fallback-copy"),
  fallbackDistricts: document.querySelector("#fallback-districts"),
};

const initialRoute = parseHash();
const storedLanguage = readStorage("cities-inside-language");
const preferredLanguage = window.navigator.language?.toLowerCase().startsWith("lt") ? "lt" : "en";
const initialLanguage = storedLanguage === "lt" || storedLanguage === "en" ? storedLanguage : preferredLanguage;
let CITY = localizeCity(getCity(initialRoute.cityId), initialLanguage);
let DISTRICTS = CITY.districts;
let TRAILS = CITY.trails;
let ALL_LANDMARKS = getAllLandmarks(CITY);

const getDistrict = (id) => findDistrict(CITY, id);
const getLandmark = (id) => findLandmark(CITY, id);
const getDistrictForLandmark = (id) => findDistrictForLandmark(CITY, id);

const storedTheme = readStorage("cities-inside-theme");
const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
const state = {
  entered: false,
  cityId: CITY.id,
  level: "city",
  districtId: null,
  landmarkId: null,
  theme: storedTheme || (systemPrefersLight ? "light" : "dark"),
  language: initialLanguage,
  trailId: null,
  trailIndex: 0,
};

let scene = null;
let hotspotElements = new Map();
let introFactIndex = 0;
let introFactTimer = null;
let imageRequest = 0;
let handlingHistory = false;
let citySwitchTimer = null;

applyTheme(state.theme, false);
applyDocumentLanguage();
applyCityIdentity();
applyInterfaceCopy();
renderDistrictRail();
renderTrailOptions();
renderFallbackDistricts();
renderAll();
startIntroFacts();
bindUi();
boot();

function boot() {
  setLoading(t(state.language, CITY.id === "klaipeda" ? "soundingChannel" : "layingRiver"), 14);
  window.requestAnimationFrame(() => {
    try {
      setLoading(t(state.language, "raisingSkyline"), 38);
      scene = createScene();
      scene.setTheme(state.theme, true);
      setLoading(t(state.language, "connectingStories", { count: ALL_LANDMARKS.length }), 76);
    } catch (error) {
      console.error("Unable to create the 3D city", error);
      showWebglFallback();
    }

    if (initialRoute.level !== "city") {
      state.entered = true;
      dom.app.classList.add("has-entered");
      applyRoute(initialRoute, { history: false, announce: false, immediate: true });
    }

    preloadImage(CITY.photo.url)
      .catch(() => undefined)
      .finally(() => {
        setLoading(t(state.language, "openingCity"), 100);
        window.setTimeout(() => {
          dom.app.classList.remove("is-loading");
          renderAll();
        }, 360);
      });
  });
}

function bindUi() {
  dom.citySwitcher.querySelectorAll("[data-city-id]").forEach((button) => {
    button.addEventListener("click", () => switchCity(button.dataset.cityId));
  });
  dom.enterButton.addEventListener("click", () => enterExperience());
  dom.introTrailButton.addEventListener("click", () => openTrails());
  dom.brandHome.addEventListener("click", () => goToCity());
  dom.surpriseButton.addEventListener("click", () => surpriseMe());
  dom.trailsButton.addEventListener("click", () => openTrails());
  dom.aboutButton.addEventListener("click", () => openDialog(dom.aboutDialog));
  dom.themeButton.addEventListener("click", () => {
    applyTheme(state.theme === "dark" ? "light" : "dark", true);
  });
  dom.languageControl.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.language, true));
  });
  dom.crumbCity.addEventListener("click", () => goToCity());
  dom.crumbDistrict.addEventListener("click", () => {
    if (state.districtId) selectDistrict(state.districtId);
  });
  dom.crumbPlace.addEventListener("click", () => {
    if (state.landmarkId) selectLandmark(state.landmarkId);
  });
  dom.panelBack.addEventListener("click", () => navigateBack());
  dom.previousPlace.addEventListener("click", () => pagePlace(-1));
  dom.nextPlace.addEventListener("click", () => pagePlace(1));
  dom.trailExit.addEventListener("click", () => exitTrail());
  dom.trailNext.addEventListener("click", () => advanceTrail());
  dom.coachClose.addEventListener("click", () => dismissCoach());

  document.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector(`#${button.dataset.closeDialog}`)?.close();
    });
  });

  [dom.trailsDialog, dom.aboutDialog].forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !dom.trailsDialog.open && !dom.aboutDialog.open) {
      navigateBack();
    }
    if (event.key === "ArrowRight" && state.level === "landmark") {
      event.preventDefault();
      if (state.trailId) advanceTrail();
      else pagePlace(1);
    }
    if (event.key === "ArrowLeft" && state.level === "landmark" && !state.trailId) {
      event.preventDefault();
      pagePlace(-1);
    }
  });

  window.addEventListener("popstate", () => {
    handlingHistory = true;
    applyRoute(parseHash(), { history: false, announce: true });
    handlingHistory = false;
  });

  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (event) => {
    if (!readStorage("cities-inside-theme")) applyTheme(event.matches ? "light" : "dark", false);
  });
}

function createScene() {
  return new CityScene(dom.canvas, CITY, {
    onSelectDistrict: (id) => selectDistrict(id),
    onSelectLandmark: (id) => selectLandmark(id),
    onBack: () => navigateBack(),
    onProject: updateHotspotPositions,
    onHover: updateHotspotHover,
  });
}

function enterExperience({ showCoach = true } = {}) {
  if (!state.entered) {
    state.entered = true;
    dom.app.classList.add("has-entered");
    window.clearInterval(introFactTimer);
    introFactTimer = null;
    renderAll();
    scene?.setSelection(
      { level: state.level, districtId: state.districtId, landmarkId: state.landmarkId },
      false,
    );
    announce(t(state.language, "cityOpened", { city: CITY.name }));
  }

  if (showCoach && !readStorage("cities-inside-coach-seen")) {
    window.setTimeout(() => {
      dom.coach.hidden = false;
    }, 720);
  }
}

function dismissCoach() {
  dom.coach.hidden = true;
  writeStorage("cities-inside-coach-seen", "true");
}

function switchCity(cityId, options = {}) {
  const nextCity = localizeCity(getCity(cityId), state.language);
  if (!nextCity || nextCity.id === CITY.id) {
    if (options.route) applyLocalRoute(options.route, options);
    else if (state.level !== "city") goToCity(options);
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animate = options.animate !== false && !reduceMotion;
  const wasEntered = state.entered;
  window.clearTimeout(citySwitchTimer);
  dom.cityTransitionLabel.textContent = t(
    state.language,
    nextCity.id === "klaipeda" ? "cityTransitionSea" : "cityTransitionInland",
  );
  if (animate) dom.app.classList.add("is-city-switching");

  const rebuild = () => {
    scene?.destroy();
    scene = null;
    CITY = nextCity;
    DISTRICTS = CITY.districts;
    TRAILS = CITY.trails;
    ALL_LANDMARKS = getAllLandmarks(CITY);
    state.cityId = CITY.id;
    state.level = "city";
    state.districtId = null;
    state.landmarkId = null;
    state.trailId = null;
    state.trailIndex = 0;
    state.entered = wasEntered;
    dom.app.classList.toggle("has-entered", state.entered);
    dom.webglError.hidden = true;
    applyCityIdentity();
    applyInterfaceCopy();
    renderDistrictRail();
    renderTrailOptions();
    renderFallbackDistricts();

    try {
      scene = createScene();
      scene.setTheme(state.theme, true);
    } catch (error) {
      console.error(`Unable to create the ${CITY.name} scene`, error);
      showWebglFallback();
    }

    if (options.route) applyLocalRoute(options.route, { ...options, history: false });
    else {
      scene?.setSelection({ level: "city", districtId: null, landmarkId: null }, true);
      renderAll();
    }

    resetIntroFacts();
    preloadImage(CITY.photo.url).catch(() => undefined);
    if (options.history !== false) updateHistory(buildHash());
    if (options.announce !== false) announce(t(state.language, "cityReady", {
      city: CITY.name,
      districts: DISTRICTS.length,
      places: ALL_LANDMARKS.length,
    }));
  };

  if (animate) {
    citySwitchTimer = window.setTimeout(rebuild, 280);
    window.setTimeout(() => dom.app.classList.remove("is-city-switching"), 1120);
  } else {
    rebuild();
    dom.app.classList.remove("is-city-switching");
  }
}

function applyCityIdentity() {
  document.documentElement.dataset.city = CITY.id;
  dom.app.dataset.city = CITY.id;
  dom.loadingCityLabel.textContent = t(state.language, "assembling", { city: CITY.name });
  dom.viewport.setAttribute("aria-label", t(state.language, "viewportLabel", { city: CITY.name }));
  dom.canvas.setAttribute(
    "aria-label",
    t(state.language, "canvasLabel", { city: CITY.name }),
  );
  dom.introEyebrow.textContent = CITY.eyebrow;
  dom.introTitle.textContent = CITY.headline;
  dom.introBody.textContent = t(
    state.language,
    CITY.id === "klaipeda" ? "introBodyKlaipeda" : "introBodyVilnius",
  );
  dom.introCount.innerHTML = t(state.language, "introCount", {
    districts: DISTRICTS.length,
    places: ALL_LANDMARKS.length,
  });
  dom.enterButton.textContent = t(state.language, "enter", { city: CITY.name });
  dom.crumbCity.textContent = CITY.name;
  dom.districtRail.setAttribute("aria-label", t(state.language, "districtRailLabel", { city: CITY.name }));
  dom.webglFallbackCopy.textContent = t(state.language, "fallback", { city: CITY.name });
  dom.citySwitcher.querySelectorAll("[data-city-id]").forEach((button) => {
    const active = button.dataset.cityId === CITY.id;
    button.setAttribute("aria-current", String(active));
    button.tabIndex = active ? -1 : 0;
  });
  document.title = state.language === "lt"
    ? `${CITY.name} iš vidaus | Gyvas 3D miesto atlasas`
    : `${CITY.name} Inside | Living 3D City Atlas`;
  document.querySelector('meta[name="description"]')?.setAttribute(
    "content",
    state.language === "lt"
      ? `Tyrinėkite miestą „${CITY.name}“ – nuo gyvo 3D modelio iki netikėtų, šaltiniais pagrįstų atskirų vietų istorijų.`
      : `Explore ${CITY.name} from a living 3D city model down to surprising, sourced stories in individual places.`,
  );
  document.documentElement.style.setProperty("--city-secondary", CITY.scene.secondary);
  document.documentElement.style.setProperty("--district-count", String(DISTRICTS.length));
  applyContextColor();
  applyTheme(state.theme, false);
}

function applyDocumentLanguage() {
  document.documentElement.lang = state.language;
  document.documentElement.dataset.language = state.language;
  dom.app.dataset.language = state.language;
  dom.languageControl.setAttribute("aria-label", t(state.language, "languageLabel"));
  dom.languageControl.querySelectorAll("[data-language]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.language === state.language));
  });
}

function applyInterfaceCopy() {
  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };

  setText(".skip-link", t(state.language, "skip"));
  setText(".brand-name", state.language === "lt" ? "Miestai iš vidaus" : "Cities Inside");
  dom.brandHome.setAttribute("aria-label", t(state.language, "returnCity"));
  dom.citySwitcher.setAttribute("aria-label", t(state.language, "chooseCity"));
  dom.hotspots.setAttribute("aria-label", t(state.language, "visiblePlaces"));
  dom.placeList.setAttribute("aria-label", t(state.language, "placesInDistrict"));
  setText('[data-city-id="vilnius"] small', t(state.language, "inland"));
  setText('[data-city-id="klaipeda"] small', t(state.language, "seaside"));
  document.querySelector(".breadcrumbs")?.setAttribute("aria-label", t(state.language, "currentLevel"));
  dom.surpriseButton.textContent = t(state.language, "surprise");
  dom.trailsButton.textContent = t(state.language, "trails");
  dom.aboutButton.textContent = t(state.language, "about");
  dom.introTrailButton.textContent = t(state.language, "chooseTrail");
  setText(".fact-block > span", t(state.language, "worthKnowing"));
  setText(".look-block > span", t(state.language, "lookCloser"));
  dom.trailExit.textContent = t(state.language, "exitTrail");
  setText("#trails-dialog .modal-header p", t(state.language, "routesEyebrow"));
  setText("#trails-title", t(state.language, "routesTitle"));
  setText('#trails-dialog [data-close-dialog="trails-dialog"]', t(state.language, "close"));
  setText("#about-dialog .modal-header p", t(state.language, "aboutEyebrow"));
  setText("#about-title", t(state.language, "aboutTitle"));
  setText('#about-dialog [data-close-dialog="about-dialog"]', t(state.language, "close"));
  const aboutParagraphs = document.querySelectorAll(".about-copy p");
  ["aboutOne", "aboutTwo", "aboutThree"].forEach((key, index) => {
    if (aboutParagraphs[index]) aboutParagraphs[index].textContent = t(state.language, key);
  });
  setText("#webgl-error > div > p:first-child", t(state.language, "unavailable"));
  setText("#webgl-error h2", t(state.language, "storiesWork"));
  const coachLines = dom.coach.querySelectorAll("p");
  if (coachLines[0]) coachLines[0].innerHTML = `<strong>${t(state.language, "drag")}</strong> ${t(state.language, "orbit")}`;
  if (coachLines[1]) coachLines[1].innerHTML = `<strong>${t(state.language, "pinch")}</strong> ${t(state.language, "zoom")}`;
  if (coachLines[2]) coachLines[2].innerHTML = `<strong>${t(state.language, "tap")}</strong> ${t(state.language, "closer")}`;
  dom.coachClose.textContent = t(state.language, "gotIt");
  applyTheme(state.theme, false);
}

function applyLanguage(language, persist) {
  if (!(["en", "lt"].includes(language)) || language === state.language) return;
  dom.app.classList.add("is-language-switching");
  state.language = language;
  CITY = localizeCity(getCity(state.cityId), language);
  DISTRICTS = CITY.districts;
  TRAILS = CITY.trails;
  ALL_LANDMARKS = getAllLandmarks(CITY);
  applyDocumentLanguage();
  scene?.setContentData(CITY);
  applyCityIdentity();
  applyInterfaceCopy();
  renderDistrictRail();
  renderTrailOptions();
  renderFallbackDistricts();
  renderAll();
  resetIntroFacts();
  if (persist) writeStorage("cities-inside-language", language);
  announce(language === "lt" ? "Kalba pakeista į lietuvių." : "Language changed to English.");
  window.setTimeout(() => dom.app.classList.remove("is-language-switching"), 620);
}

function applyContextColor() {
  const district = getDistrict(state.districtId);
  const color = district?.color || CITY.scene.accent;
  document.documentElement.style.setProperty("--accent", color);
  document.documentElement.style.setProperty("--district-color", color);
}

function resetIntroFacts() {
  window.clearInterval(introFactTimer);
  introFactTimer = null;
  introFactIndex = 0;
  dom.introFactIndex.textContent = "01";
  dom.introFactText.textContent = CITY.quickFacts[0];
  dom.introFact.classList.remove("is-changing");
  if (!state.entered) startIntroFacts();
}

function goToCity(options = {}) {
  enterExperience({ showCoach: false });
  if (state.trailId) exitTrail({ render: false });
  state.level = "city";
  state.districtId = null;
  state.landmarkId = null;
  scene?.setSelection({ level: "city", districtId: null, landmarkId: null }, options.immediate);
  renderAll();
  if (options.history !== false) updateHistory(buildHash());
  if (options.announce !== false) announce(t(state.language, "returnedCity", { city: CITY.name }));
}

function selectDistrict(id, options = {}) {
  const district = getDistrict(id);
  if (!district) return;
  enterExperience({ showCoach: false });
  if (state.trailId && !options.fromTrail) exitTrail({ render: false });
  state.level = "district";
  state.districtId = id;
  state.landmarkId = null;
  scene?.setSelection({ level: "district", districtId: id, landmarkId: null }, options.immediate);
  renderAll();
  if (options.history !== false) updateHistory(buildHash("district", id));
  if (options.announce !== false) announce(t(state.language, "districtOpened", {
    district: district.name,
    count: district.landmarks.length,
  }));
}

function selectLandmark(id, options = {}) {
  const landmark = getLandmark(id);
  const district = getDistrictForLandmark(id);
  if (!landmark || !district) return;
  enterExperience({ showCoach: false });

  if (state.trailId && !options.fromTrail) {
    const trail = TRAILS.find((item) => item.id === state.trailId);
    const index = trail?.stops.indexOf(id) ?? -1;
    if (index === -1) exitTrail({ render: false });
    else state.trailIndex = index;
  }

  state.level = "landmark";
  state.districtId = district.id;
  state.landmarkId = id;
  scene?.setSelection(
    { level: "landmark", districtId: district.id, landmarkId: id },
    options.immediate,
  );
  renderAll();
  if (options.history !== false) updateHistory(buildHash("place", id));
  if (options.announce !== false) announce(`${landmark.name}. ${landmark.hook}`);
}

function navigateBack() {
  if (state.level === "landmark" && state.districtId) {
    selectDistrict(state.districtId);
    return;
  }
  if (state.level === "district") {
    goToCity();
  }
}

function pagePlace(direction) {
  const district = getDistrict(state.districtId);
  if (!district || !state.landmarkId) return;
  const currentIndex = district.landmarks.findIndex((landmark) => landmark.id === state.landmarkId);
  const nextIndex = (currentIndex + direction + district.landmarks.length) % district.landmarks.length;
  selectLandmark(district.landmarks[nextIndex].id);
}

function surpriseMe() {
  const choices = ALL_LANDMARKS.filter((landmark) => landmark.id !== state.landmarkId);
  const landmark = choices[Math.floor(Math.random() * choices.length)];
  if (landmark) selectLandmark(landmark.id);
}

function renderAll() {
  dom.app.dataset.level = state.level;
  applyContextColor();
  renderBreadcrumbs();
  renderStory();
  renderHotspots();
  renderDistrictRailState();
  renderTrailProgress();
}

function renderBreadcrumbs() {
  const district = getDistrict(state.districtId);
  const landmark = getLandmark(state.landmarkId);
  dom.crumbCity.setAttribute("aria-current", state.level === "city" ? "page" : "false");
  dom.crumbDistrict.disabled = !district;
  dom.crumbDistrict.textContent = district?.name || t(state.language, "district");
  dom.crumbDistrict.setAttribute("aria-current", state.level === "district" ? "page" : "false");
  dom.crumbPlace.disabled = !landmark;
  dom.crumbPlace.textContent = landmark?.name || t(state.language, "place");
  dom.crumbPlace.setAttribute("aria-current", state.level === "landmark" ? "page" : "false");
}

function renderStory() {
  const district = getDistrict(state.districtId);
  const landmark = getLandmark(state.landmarkId);
  const item = landmark || district || CITY;
  const isLandmark = Boolean(landmark);
  const isDistrict = Boolean(district) && !isLandmark;
  const isCity = !district && !landmark;

  dom.storyPanel.style.setProperty("--panel-accent", district?.color || CITY.scene.accent);

  dom.panelBack.hidden = isCity;
  dom.panelBack.textContent = isLandmark ? district.name : t(state.language, "city");
  dom.storyLevel.textContent = isLandmark
    ? t(state.language, "districtPlace", { district: district.name })
    : isDistrict
      ? t(state.language, "places", { count: district.landmarks.length })
      : t(state.language, "cityView");
  dom.storyLocalName.textContent = item.localName || district?.localName || item.name;
  dom.storyTitle.textContent = item.name;
  dom.storyPosition.innerHTML = formatCoordinates(item.coordinates);
  dom.storyHook.textContent = item.hook || item.intro;
  dom.storyBody.textContent = item.story || "";

  dom.factBlock.hidden = !isLandmark;
  dom.storyFact.textContent = landmark?.fact || "";
  dom.lookBlock.hidden = !isLandmark || !landmark.lookFor;
  dom.storyLook.textContent = landmark?.lookFor || "";

  dom.quickFacts.replaceChildren();
  if (isCity) {
    CITY.quickFacts.forEach((fact) => {
      const element = document.createElement("p");
      element.className = "quick-fact";
      element.textContent = fact;
      dom.quickFacts.append(element);
    });
  }

  renderPlaceList(isDistrict ? district : null, isLandmark ? district : null);
  dom.placePager.hidden = !isLandmark || Boolean(state.trailId);
  if (isLandmark) {
    const index = district.landmarks.findIndex((place) => place.id === landmark.id);
    const previous = district.landmarks[(index - 1 + district.landmarks.length) % district.landmarks.length];
    const next = district.landmarks[(index + 1) % district.landmarks.length];
    dom.previousPlace.textContent = t(state.language, "previous", { name: previous.name });
    dom.nextPlace.textContent = t(state.language, "next", { name: next.name });
  }

  dom.storySource.href = item.sourceUrl;
  dom.storySource.textContent = state.language === "lt" ? t(state.language, "readSource") : item.sourceLabel || t(state.language, "readSource");
  dom.imageSource.href = item.photo.source;
  dom.imageSource.textContent = t(state.language, "imageSource");
  dom.imageCredit.textContent = `${item.photo.credit} / ${item.photo.license} / Wikimedia Commons`;
  setStoryImage(item.photo);

  const scroll = dom.storyPanel.querySelector(".story-scroll");
  scroll.scrollTo({ top: 0, behavior: "instant" });
}

function renderPlaceList(primaryDistrict, siblingDistrict) {
  dom.placeList.replaceChildren();
  const district = primaryDistrict || siblingDistrict;
  if (!district) return;

  district.landmarks.forEach((landmark) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-current", landmark.id === state.landmarkId ? "true" : "false");
    button.setAttribute("aria-label", t(state.language, "openPlace", { name: landmark.name }));
    button.addEventListener("click", () => selectLandmark(landmark.id));

    const image = document.createElement("img");
    image.src = landmark.photo.url;
    image.alt = "";
    image.loading = "lazy";
    image.referrerPolicy = "no-referrer";

    const name = document.createElement("strong");
    name.textContent = landmark.name;

    const type = document.createElement("span");
    type.textContent = landmark.type;

    button.append(image, name, type);
    dom.placeList.append(button);
  });
}

function setStoryImage(photo) {
  const request = ++imageRequest;
  dom.storyImage.classList.remove("is-loaded");
  dom.storyImageSkeleton.classList.remove("is-hidden", "is-error");
  dom.storyImageSkeleton.textContent = "";
  dom.storyImage.alt = photo.alt;
  dom.storyImage.referrerPolicy = "no-referrer";
  dom.storyImage.onload = () => {
    if (request !== imageRequest) return;
    dom.storyImage.classList.add("is-loaded");
    dom.storyImageSkeleton.classList.add("is-hidden");
  };
  dom.storyImage.onerror = () => {
    if (request !== imageRequest) return;
    dom.storyImageSkeleton.classList.add("is-error");
    dom.storyImageSkeleton.textContent = t(state.language, "imageUnavailable");
  };
  dom.storyImage.src = photo.url;
  if (dom.storyImage.complete && dom.storyImage.naturalWidth) dom.storyImage.onload();
}

function renderHotspots() {
  const items = state.level === "city"
    ? DISTRICTS.map((district) => ({ type: "district", data: district }))
    : (getDistrict(state.districtId)?.landmarks || []).map((landmark) => ({
        type: "landmark",
        data: landmark,
      }));

  dom.hotspots.replaceChildren();
  hotspotElements = new Map();
  items.forEach(({ type, data }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hotspot";
    button.dataset.type = type;
    button.dataset.id = data.id;
    const itemDistrict = type === "district" ? data : getDistrict(state.districtId);
    button.style.setProperty("--item-color", itemDistrict?.color || CITY.scene.accent);
    button.setAttribute("aria-label", t(state.language, "openHotspot", {
      verb: t(state.language, type === "district" ? "explore" : "open"),
      name: data.name,
      hook: data.hook,
    }));
    if (data.id === state.landmarkId) button.classList.add("is-active");

    const label = document.createElement("span");
    label.className = "hotspot-label";
    label.textContent = data.name;
    const stem = document.createElement("span");
    stem.className = "hotspot-stem";
    stem.setAttribute("aria-hidden", "true");
    button.append(label, stem);

    button.addEventListener("click", () => {
      if (type === "district") selectDistrict(data.id);
      else selectLandmark(data.id);
    });
    button.addEventListener("pointerenter", () => scene?.setHover({ type, id: data.id }));
    button.addEventListener("pointerleave", () => scene?.setHover(null));
    dom.hotspots.append(button);
    hotspotElements.set(`${type}:${data.id}`, button);
  });
}

function updateHotspotPositions(labels) {
  const topbarHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--topbar-height")) || 72;
  const panelWidth = window.innerWidth > 720
    ? Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--panel-width")) || 440
    : 0;

  const seen = new Set();
  const occupied = [];
  const labelOffsets = [0, -48, 48, -96, 96];
  const orderedLabels = [...labels].sort((a, b) => a.depth - b.depth);

  orderedLabels.forEach((label) => {
    const key = `${label.type}:${label.id}`;
    const element = hotspotElements.get(key);
    if (!element) return;
    seen.add(key);
    const behindPanel = window.innerWidth > 720 && label.x > window.innerWidth - panelWidth - 20;
    const aboveTopbar = label.y < topbarHeight + 8;
    const scale = clampScale(1.04 - Math.max(0, label.depth) * 0.16);
    const baseAnchorY = label.y - topbarHeight;
    const width = Math.max(108, element.offsetWidth) * scale;
    const height = Math.max(52, element.offsetHeight) * scale;
    let placement = null;

    if (label.visible && !behindPanel && !aboveTopbar) {
      for (const offset of labelOffsets) {
        const anchorY = baseAnchorY + offset;
        const rect = {
          left: label.x - width / 2 - 7,
          right: label.x + width / 2 + 7,
          top: anchorY - height - 7,
          bottom: anchorY + 7,
        };
        const overlaps = occupied.some((item) => !(
          rect.right < item.left
          || rect.left > item.right
          || rect.bottom < item.top
          || rect.top > item.bottom
        ));
        if (rect.top >= 8 && rect.bottom <= window.innerHeight - topbarHeight - 8 && !overlaps) {
          placement = { anchorY, rect };
          break;
        }
      }
    }

    if (placement) occupied.push(placement.rect);
    element.style.left = `${label.x}px`;
    element.style.top = `${placement?.anchorY ?? baseAnchorY}px`;
    element.style.setProperty("--hotspot-scale", String(scale));
    element.classList.toggle("is-visible", Boolean(placement));
    element.classList.toggle("is-occluded", !placement);
  });

  hotspotElements.forEach((element, key) => {
    if (!seen.has(key)) {
      element.classList.remove("is-visible");
      element.classList.add("is-occluded");
    }
  });
}

function updateHotspotHover(interaction) {
  hotspotElements.forEach((element, key) => {
    element.classList.toggle("is-active", key === (interaction ? `${interaction.type}:${interaction.id}` : ""));
  });
}

function renderDistrictRail() {
  dom.districtRail.replaceChildren();
  DISTRICTS.forEach((district) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.districtId = district.id;
    button.style.setProperty("--item-color", district.color);
    button.textContent = district.name;
    button.setAttribute("aria-label", t(state.language, "exploreDistrict", {
      name: district.name,
      hook: district.hook,
    }));
    button.addEventListener("click", () => selectDistrict(district.id));
    dom.districtRail.append(button);
  });
}

function renderDistrictRailState() {
  dom.districtRail.querySelectorAll("button").forEach((button) => {
    button.setAttribute("aria-current", button.dataset.districtId === state.districtId ? "true" : "false");
  });
}

function renderTrailOptions() {
  dom.trailOptions.replaceChildren();
  TRAILS.forEach((trail) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "trail-option";
    button.addEventListener("click", () => startTrail(trail.id));

    const copy = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = trail.name;
    const hook = document.createElement("p");
    hook.textContent = trail.hook;
    copy.append(title, hook);

    const count = document.createElement("span");
    count.textContent = t(state.language, "trailPlaces", { count: trail.stops.length });
    button.append(copy, count);
    dom.trailOptions.append(button);
  });
}

function openTrails() {
  openDialog(dom.trailsDialog);
}

function startTrail(id) {
  const trail = TRAILS.find((item) => item.id === id);
  if (!trail) return;
  state.trailId = id;
  state.trailIndex = 0;
  dom.trailsDialog.close();
  selectLandmark(trail.stops[0], { fromTrail: true });
  announce(t(state.language, "trailStarted", { trail: trail.name, count: trail.stops.length }));
}

function advanceTrail() {
  const trail = TRAILS.find((item) => item.id === state.trailId);
  if (!trail) return;
  if (state.trailIndex >= trail.stops.length - 1) {
    exitTrail();
    announce(t(state.language, "trailComplete", { trail: trail.name }));
    return;
  }
  state.trailIndex += 1;
  selectLandmark(trail.stops[state.trailIndex], { fromTrail: true });
}

function exitTrail({ render = true } = {}) {
  state.trailId = null;
  state.trailIndex = 0;
  if (render) renderAll();
}

function renderTrailProgress() {
  const trail = TRAILS.find((item) => item.id === state.trailId);
  dom.trailProgress.hidden = !trail;
  if (!trail) return;
  dom.trailCount.textContent = `${state.trailIndex + 1} / ${trail.stops.length}`;
  dom.trailName.textContent = trail.name;
  dom.trailNext.textContent = t(
    state.language,
    state.trailIndex === trail.stops.length - 1 ? "finishTrail" : "nextPlace",
  );
}

function renderFallbackDistricts() {
  dom.fallbackDistricts.replaceChildren();
  DISTRICTS.forEach((district) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = district.name;
    button.addEventListener("click", () => {
      dom.webglError.hidden = true;
      selectDistrict(district.id);
    });
    dom.fallbackDistricts.append(button);
  });
}

function showWebglFallback() {
  dom.webglError.hidden = false;
  state.entered = true;
  dom.app.classList.add("has-entered");
}

function applyTheme(theme, persist) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;
  dom.themeLabel.textContent = t(state.language, theme === "dark" ? "night" : "day");
  dom.themeButton.setAttribute("aria-label", t(state.language, theme === "dark" ? "switchDay" : "switchNight"));
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    "content",
    CITY?.id === "klaipeda"
      ? theme === "dark" ? "#06161d" : "#dff0ef"
      : theme === "dark" ? "#0d1110" : "#e4eadf",
  );
  scene?.setTheme(theme);
  if (persist) writeStorage("cities-inside-theme", theme);
}

function applyRoute(route, options = {}) {
  if (route.cityId !== CITY.id) {
    switchCity(route.cityId, {
      ...options,
      route,
      animate: options.immediate ? false : options.animate,
    });
    return;
  }
  applyLocalRoute(route, options);
}

function applyLocalRoute(route, options = {}) {
  if (route.level === "landmark") selectLandmark(route.id, options);
  else if (route.level === "district") selectDistrict(route.id, options);
  else goToCity(options);
}

function parseHash() {
  const hash = window.location.hash.replace(/^#/, "");
  const params = new URLSearchParams(hash);
  const placeId = params.get("place");
  const districtId = params.get("district");
  let cityId = params.get("city") || "vilnius";

  if (!params.get("city") && placeId) {
    cityId = CITIES.find((city) => findLandmark(city, placeId))?.id || cityId;
  }
  if (!params.get("city") && districtId) {
    cityId = CITIES.find((city) => findDistrict(city, districtId))?.id || cityId;
  }

  const routeCity = getCity(cityId);
  if (placeId && findLandmark(routeCity, placeId)) {
    return { cityId: routeCity.id, level: "landmark", id: placeId };
  }
  if (districtId && findDistrict(routeCity, districtId)) {
    return { cityId: routeCity.id, level: "district", id: districtId };
  }
  return { cityId: routeCity.id, level: "city" };
}

function buildHash(kind, id) {
  const params = new URLSearchParams({ city: CITY.id });
  if (kind && id) params.set(kind, id);
  return `#${params.toString()}`;
}

function updateHistory(hash) {
  if (handlingHistory || window.location.hash === hash) return;
  window.history.pushState({}, "", hash);
}

function formatCoordinates([lat, lon]) {
  return `${lat.toFixed(4)}° N<br>${lon.toFixed(4)}° E`;
}

function setLoading(status, progress) {
  dom.loadingStatus.textContent = status;
  dom.loadingProgress.style.width = `${progress}%`;
}

function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.referrerPolicy = "no-referrer";
    image.onload = resolve;
    image.onerror = reject;
    image.src = url;
  });
}

function startIntroFacts() {
  introFactTimer = window.setInterval(() => {
    introFactIndex = (introFactIndex + 1) % CITY.quickFacts.length;
    dom.introFact.classList.add("is-changing");
    window.setTimeout(() => {
      dom.introFactIndex.textContent = String(introFactIndex + 1).padStart(2, "0");
      dom.introFactText.textContent = CITY.quickFacts[introFactIndex];
      dom.introFact.classList.remove("is-changing");
    }, 190);
  }, 3900);
}

function openDialog(dialog) {
  if (!dialog.open) dialog.showModal();
}

function announce(message) {
  dom.liveStatus.textContent = "";
  window.setTimeout(() => {
    dom.liveStatus.textContent = message;
  }, 20);
}

function clampScale(value) {
  return Math.max(0.82, Math.min(1.05, value));
}

function readStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // The experience remains fully usable when storage is unavailable.
  }
}
