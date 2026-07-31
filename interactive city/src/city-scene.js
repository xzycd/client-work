import * as THREE from "three";
import { MapControls } from "three/examples/jsm/controls/MapControls.js";

const PALETTES = {
  dark: {
    background: 0x10120f,
    fog: 0x10120f,
    land: 0x181c16,
    landEdge: 0x51594a,
    district: 0x2a3026,
    districtLine: 0x7c8671,
    building: 0x444b3d,
    buildingSelected: 0x707960,
    roof: 0x30362c,
    road: 0x6f7867,
    river: 0x708f99,
    landmark: 0x858e79,
    landmarkDim: 0x4c5346,
    light: 0xe8ecdc,
  },
  light: {
    background: 0xdfe2da,
    fog: 0xdfe2da,
    land: 0xcdd3c7,
    landEdge: 0x7a8573,
    district: 0xb8c0b1,
    districtLine: 0x687260,
    building: 0x939e8d,
    buildingSelected: 0x68745f,
    roof: 0x757f70,
    road: 0x6f7c6a,
    river: 0x537e8b,
    landmark: 0x4f5a4b,
    landmarkDim: 0x90998b,
    light: 0xffffff,
  },
};

const STYLE_METRICS = {
  old: { min: 0.3, max: 1.25, width: [0.28, 0.68], depth: [0.24, 0.58], roofChance: 0.72 },
  bohemian: { min: 0.22, max: 0.9, width: [0.28, 0.72], depth: [0.24, 0.64], roofChance: 0.8 },
  industrial: { min: 0.28, max: 1.45, width: [0.4, 1.1], depth: [0.36, 0.92], roofChance: 0.18 },
  contrast: { min: 0.28, max: 3.5, width: [0.3, 0.84], depth: [0.28, 0.7], roofChance: 0.32 },
  wood: { min: 0.2, max: 0.78, width: [0.28, 0.68], depth: [0.24, 0.58], roofChance: 0.84 },
  baroque: { min: 0.28, max: 1.3, width: [0.32, 0.82], depth: [0.28, 0.68], roofChance: 0.64 },
  soviet: { min: 0.55, max: 1.8, width: [0.55, 1.35], depth: [0.3, 0.56], roofChance: 0.02 },
};

const clamp = THREE.MathUtils.clamp;

const randomFrom = (seedString) => {
  let seed = 2166136261;
  for (let index = 0; index < seedString.length; index += 1) {
    seed ^= seedString.charCodeAt(index);
    seed = Math.imul(seed, 16777619);
  }

  return () => {
    seed += 0x6d2b79f5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const easeInOut = (value) =>
  value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;

export class CityScene {
  constructor(canvas, city, callbacks = {}) {
    this.canvas = canvas;
    this.city = city;
    this.config = city.scene;
    this.districts = city.districts;
    this.callbacks = callbacks;
    this.palettes = this.config.palette || PALETTES;
    this.center = { lat: this.config.center[0], lon: this.config.center[1] };
    this.scaleX = this.config.scale[0];
    this.scaleZ = this.config.scale[1];
    this.accentColor = new THREE.Color(this.config.accent || "#d6e967");
    this.secondaryColor = new THREE.Color(this.config.secondary || "#ff8a4c");
    this.theme = "dark";
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.selection = { level: "city", districtId: null, landmarkId: null };
    this.pointerDown = null;
    this.hovered = null;
    this.cameraTween = null;
    this.animationFrame = null;
    this.destroyed = false;
    this.clock = new THREE.Clock();
    this.districtEntries = new Map();
    this.landmarkEntries = new Map();
    this.raycastTargets = [];
    this.flowMaterials = [];
    this.movers = [];
    this.revealStartedAt = performance.now();

    this.initRenderer();
    this.initScene();
    this.createGround();
    this.createWater();
    this.createRoads();
    this.createDistricts();
    this.createMovers();
    this.createAtmosphere();
    this.initControls();
    this.bindEvents();
    this.resize();
    this.setTheme(this.theme, true);
    this.setSelection(this.selection, true);
    this.animate();
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 720 ? 1.35 : 1.8));
    this.renderer.shadowMap.enabled = window.innerWidth > 900;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  initScene() {
    const palette = this.palettes.dark;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(palette.fog, this.city.id === "klaipeda" ? 0.015 : 0.019);

    this.camera = new THREE.PerspectiveCamera(34, 1, 0.1, 130);
    this.camera.position.set(this.city.id === "klaipeda" ? -2.6 : -1.8, this.city.id === "klaipeda" ? 18.5 : 20.5, 24);

    this.world = new THREE.Group();
    this.scene.add(this.world);

    this.hemiLight = new THREE.HemisphereLight(palette.light, this.city.id === "klaipeda" ? 0x071a21 : 0x171a14, 2.3);
    this.scene.add(this.hemiLight);

    this.keyLight = new THREE.DirectionalLight(palette.light, 3.4);
    this.keyLight.position.set(-10, 18, 8);
    this.keyLight.castShadow = this.renderer.shadowMap.enabled;
    this.keyLight.shadow.mapSize.set(1024, 1024);
    this.keyLight.shadow.camera.left = -18;
    this.keyLight.shadow.camera.right = 18;
    this.keyLight.shadow.camera.top = 13;
    this.keyLight.shadow.camera.bottom = -13;
    this.scene.add(this.keyLight);

    this.rimLight = new THREE.DirectionalLight(this.secondaryColor, 1.25);
    this.rimLight.position.set(14, 8, -10);
    this.scene.add(this.rimLight);

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
  }

  createGround() {
    const palette = this.palettes.dark;
    const shapes = this.config.groundShapes || [];
    this.landMaterial = new THREE.MeshStandardMaterial({
      color: palette.land,
      roughness: 0.97,
      metalness: 0,
    });
    this.landLineMaterial = new THREE.LineBasicMaterial({
      color: palette.landEdge,
      transparent: true,
      opacity: 0.52,
    });
    this.landMeshes = [];
    this.landBoundaries = [];
    this.contourLines = [];

    shapes.forEach((points, shapeIndex) => {
      const shape = new THREE.Shape();
      points.forEach(([x, z], index) => {
        if (index === 0) shape.moveTo(x, z);
        else shape.lineTo(x, z);
      });
      shape.closePath();

      const geometry = new THREE.ShapeGeometry(shape);
      geometry.rotateX(-Math.PI / 2);
      const land = new THREE.Mesh(geometry, this.landMaterial);
      land.receiveShadow = true;
      this.landMeshes.push(land);
      this.world.add(land);

      const boundaryGeometry = new THREE.BufferGeometry().setFromPoints(
        points.map(([x, z]) => new THREE.Vector3(x, 0.035, -z)),
      );
      const boundary = new THREE.LineLoop(boundaryGeometry, this.landLineMaterial);
      this.landBoundaries.push(boundary);
      this.world.add(boundary);

      [0.92, 0.78].forEach((scale, index) => {
        const contourGeometry = new THREE.BufferGeometry().setFromPoints(
          points.map(([x, z]) => new THREE.Vector3(x * scale, 0.02 + index * 0.003, -z * scale)),
        );
        const contourMaterial = new THREE.LineBasicMaterial({
          color: palette.landEdge,
          transparent: true,
          opacity: shapeIndex === 0 ? 0.12 : 0.08,
        });
        const line = new THREE.LineLoop(contourGeometry, contourMaterial);
        this.contourLines.push({ line, material: contourMaterial });
        this.world.add(line);
      });
    });
  }

  createWater() {
    const palette = this.palettes.dark;
    this.riverMaterial = new THREE.MeshStandardMaterial({
      color: palette.river,
      roughness: 0.28,
      metalness: 0.16,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });
    this.riverMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uCityTime = { value: 0 };
      shader.vertexShader = `uniform float uCityTime;\n${shader.vertexShader}`;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\ntransformed.y += sin((position.x + position.z) * 2.4 + uCityTime * 1.8) * 0.022;",
      );
      this.waterShader = shader;
    };

    this.waterMeshes = [];
    this.waterFlowLines = [];
    (this.config.waterRoutes || []).forEach((route, index) => {
      const ribbon = this.createRibbon(route.points, route.width, this.riverMaterial, route.height);
      this.waterMeshes.push(ribbon);
      this.world.add(ribbon);

      const curve = new THREE.CatmullRomCurve3(
        route.points.map(([x, z]) => new THREE.Vector3(x, route.height + 0.018, z)),
        false,
        "catmullrom",
        0.35,
      );
      const flowMaterial = new THREE.LineDashedMaterial({
        color: index % 2 ? this.accentColor : this.secondaryColor,
        transparent: true,
        opacity: route.width > 2 ? 0.42 : 0.56,
        dashSize: route.width > 2 ? 0.7 : 0.34,
        gapSize: route.width > 2 ? 0.48 : 0.22,
      });
      const flow = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(Math.max(80, route.points.length * 18))),
        flowMaterial,
      );
      flow.computeLineDistances();
      this.flowMaterials.push({ material: flowMaterial, speed: 0.32 + index * 0.13 });
      this.waterFlowLines.push(flow);
      this.world.add(flow);
    });
  }

  createRibbon(rawPoints, width, material, height) {
    const curve = new THREE.CatmullRomCurve3(
      rawPoints.map(([x, z]) => new THREE.Vector3(x, height, z)),
      false,
      "catmullrom",
      0.35,
    );
    const segments = Math.max(64, rawPoints.length * 16);
    const vertices = [];
    const indices = [];

    for (let index = 0; index <= segments; index += 1) {
      const t = index / segments;
      const point = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).normalize();
      const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize().multiplyScalar(width * 0.5);
      vertices.push(
        point.x + side.x,
        point.y,
        point.z + side.z,
        point.x - side.x,
        point.y,
        point.z - side.z,
      );
      if (index < segments) {
        const base = index * 2;
        indices.push(base, base + 2, base + 1, base + 2, base + 3, base + 1);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return new THREE.Mesh(geometry, material);
  }

  createRoads() {
    this.roadMaterial = new THREE.LineDashedMaterial({
      color: this.palettes.dark.road,
      transparent: true,
      opacity: 0.3,
      dashSize: 0.24,
      gapSize: 0.18,
    });
    this.roadLines = [];

    const districtPositions = this.districts.map((district) => this.toWorld(district.coordinates));
    const center = new THREE.Vector3(0.2, 0.09, 0.4);
    districtPositions.forEach((position, index) => {
      const curve = new THREE.CatmullRomCurve3([
        position.clone().setY(0.09),
        position.clone().lerp(center, 0.5).add(new THREE.Vector3(0, 0, (index % 2 ? 1 : -1) * 0.75)),
        center.clone(),
      ]);
      this.addRoadCurve(curve);
    });

    const ring = districtPositions
      .slice()
      .sort((a, b) => Math.atan2(a.z, a.x) - Math.atan2(b.z, b.x));
    ring.forEach((position, index) => {
      const next = ring[(index + 1) % ring.length];
      const mid = position.clone().lerp(next, 0.5);
      mid.x *= 0.92;
      mid.z *= 0.92;
      const curve = new THREE.CatmullRomCurve3([
        position.clone().setY(0.088),
        mid.setY(0.088),
        next.clone().setY(0.088),
      ]);
      this.addRoadCurve(curve);
    });
  }

  addRoadCurve(curve) {
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(34));
    const line = new THREE.Line(geometry, this.roadMaterial);
    line.computeLineDistances();
    this.roadLines.push(line);
    this.world.add(line);
  }

  createDistricts() {
    this.districts.forEach((district, index) => {
      const position = this.toWorld(district.coordinates);
      const entry = {
        data: district,
        revealIndex: index,
        position,
        group: new THREE.Group(),
        materials: [],
        roofMaterials: [],
        landmarks: [],
      };
      entry.group.position.copy(position);
      this.world.add(entry.group);

      this.createDistrictPad(entry);
      this.createBuildingField(entry);
      this.createDistrictMarker(entry);
      district.landmarks.forEach((landmark) => this.createLandmark(entry, landmark));
      this.districtEntries.set(district.id, entry);
    });
  }

  createDistrictPad(entry) {
    const [radiusX, radiusZ] = entry.data.footprint;
    const geometry = new THREE.CircleGeometry(1, 64);
    geometry.rotateX(-Math.PI / 2);
    const material = new THREE.MeshStandardMaterial({
      color: entry.data.color || this.config.accent,
      transparent: true,
      opacity: 0.18,
      roughness: 1,
      depthWrite: false,
    });
    const pad = new THREE.Mesh(geometry, material);
    pad.scale.set(radiusX, 1, radiusZ);
    pad.position.y = 0.045;
    pad.userData = { interactionType: "district", id: entry.data.id };
    entry.group.add(pad);
    entry.pad = pad;
    entry.padMaterial = material;
    this.raycastTargets.push(pad);

    const boundaryPoints = [];
    for (let index = 0; index < 64; index += 1) {
      const angle = (index / 64) * Math.PI * 2;
      const wobble = 1 + Math.sin(angle * 3 + entry.data.id.length) * 0.05;
      boundaryPoints.push(
        new THREE.Vector3(Math.cos(angle) * radiusX * wobble, 0.072, Math.sin(angle) * radiusZ * wobble),
      );
    }
    const boundaryMaterial = new THREE.LineBasicMaterial({
      color: entry.data.color || this.config.accent,
      transparent: true,
      opacity: 0.22,
    });
    const boundary = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(boundaryPoints),
      boundaryMaterial,
    );
    entry.group.add(boundary);
    entry.boundary = boundary;
    entry.boundaryMaterial = boundaryMaterial;
  }

  createBuildingField(entry) {
    const random = randomFrom(entry.data.id);
    const style = STYLE_METRICS[entry.data.buildingStyle] || STYLE_METRICS.old;
    const [radiusX, radiusZ] = entry.data.footprint;
    const buildingGeometry = new THREE.BoxGeometry(1, 1, 1);
    const buildingMaterial = new THREE.MeshStandardMaterial({
      color: this.getDistrictColors(entry.data, "dark").building,
      roughness: 0.86,
      metalness: entry.data.buildingStyle === "contrast" ? 0.16 : 0.03,
      transparent: true,
      opacity: 0.9,
    });
    const buildings = new THREE.InstancedMesh(buildingGeometry, buildingMaterial, entry.data.count);
    buildings.castShadow = this.renderer.shadowMap.enabled;
    buildings.receiveShadow = true;
    buildings.userData = { interactionType: "district", id: entry.data.id };

    const roofTransforms = [];
    const dummy = new THREE.Object3D();
    for (let index = 0; index < entry.data.count; index += 1) {
      const angle = random() * Math.PI * 2;
      const radius = Math.sqrt(random()) * 0.82;
      const x = Math.cos(angle) * radiusX * radius;
      const z = Math.sin(angle) * radiusZ * radius;
      const width = THREE.MathUtils.lerp(style.width[0], style.width[1], random());
      const depth = THREE.MathUtils.lerp(style.depth[0], style.depth[1], random());
      let height = THREE.MathUtils.lerp(style.min, style.max, Math.pow(random(), 1.7));

      if (entry.data.buildingStyle === "contrast" && index < 6) {
        height = 1.7 + random() * 2.2;
      }
      if (entry.data.buildingStyle === "soviet") {
        height = 0.75 + Math.round(random() * 4) * 0.2;
      }

      dummy.position.set(x, height * 0.5 + 0.08, z);
      dummy.rotation.y = random() > 0.5 ? random() * 0.35 : Math.PI * 0.5 + random() * 0.2;
      dummy.scale.set(width, height, depth);
      dummy.updateMatrix();
      buildings.setMatrixAt(index, dummy.matrix);

      if (random() < style.roofChance) {
        roofTransforms.push({ x, z, width, depth, height, rotation: dummy.rotation.y });
      }
    }
    buildings.instanceMatrix.needsUpdate = true;
    buildings.scale.y = this.reducedMotion ? 1 : 0.001;
    entry.group.add(buildings);
    entry.buildings = buildings;
    entry.buildingMaterial = buildingMaterial;
    this.raycastTargets.push(buildings);

    if (roofTransforms.length) {
      const roofGeometry = new THREE.ConeGeometry(0.5, 0.28, 4);
      roofGeometry.rotateY(Math.PI / 4);
      const roofMaterial = new THREE.MeshStandardMaterial({
        color: this.getDistrictColors(entry.data, "dark").roof,
        roughness: 0.94,
        transparent: true,
        opacity: 0.9,
      });
      const roofs = new THREE.InstancedMesh(roofGeometry, roofMaterial, roofTransforms.length);
      roofs.castShadow = this.renderer.shadowMap.enabled;
      roofs.userData = { interactionType: "district", id: entry.data.id };
      roofTransforms.forEach((roof, index) => {
        dummy.position.set(roof.x, roof.height + 0.16, roof.z);
        dummy.rotation.set(0, roof.rotation, 0);
        dummy.scale.set(roof.width * 1.15, 1, roof.depth * 1.15);
        dummy.updateMatrix();
        roofs.setMatrixAt(index, dummy.matrix);
      });
      roofs.instanceMatrix.needsUpdate = true;
      roofs.scale.y = this.reducedMotion ? 1 : 0.001;
      entry.group.add(roofs);
      entry.roofs = roofs;
      entry.roofMaterial = roofMaterial;
      this.raycastTargets.push(roofs);
    }
  }

  createDistrictMarker(entry) {
    const marker = new THREE.Group();
    marker.position.y = 0.1;
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: entry.data.color || this.config.accent,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.17, 0.23, 36), ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    marker.add(ring);

    const stemMaterial = new THREE.LineBasicMaterial({
      color: entry.data.color || this.config.accent,
      transparent: true,
      opacity: 0.36,
    });
    const stem = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0.02, 0),
        new THREE.Vector3(0, 1.35, 0),
      ]),
      stemMaterial,
    );
    marker.add(stem);
    entry.group.add(marker);
    entry.marker = marker;
    entry.markerRing = ring;
    entry.markerMaterial = ringMaterial;
    entry.markerStemMaterial = stemMaterial;
    entry.anchor = new THREE.Object3D();
    entry.anchor.position.set(0, this.getDistrictAnchorHeight(entry.data.buildingStyle), 0);
    entry.group.add(entry.anchor);
  }

  getDistrictAnchorHeight(style) {
    if (style === "contrast") return 3.5;
    if (style === "soviet") return 2.1;
    return 1.7;
  }

  getDistrictColors(data, theme = this.theme) {
    const palette = this.palettes[theme];
    const raw = new THREE.Color(data.color || this.config.accent);
    const building = raw.clone().lerp(new THREE.Color(palette.building), theme === "dark" ? 0.46 : 0.58);
    const selected = raw.clone().lerp(new THREE.Color(palette.light), theme === "dark" ? 0.18 : 0.08);
    const roof = raw.clone().lerp(new THREE.Color(palette.roof), 0.6);
    return { raw, building, selected, roof };
  }

  createLandmark(districtEntry, data) {
    const worldPosition = this.toWorld(data.coordinates);
    const localPosition = worldPosition.clone().sub(districtEntry.position);
    const group = new THREE.Group();
    group.position.copy(localPosition);
    group.position.y = 0.08;
    districtEntry.group.add(group);

    const districtColors = this.getDistrictColors(districtEntry.data, "dark");
    const material = new THREE.MeshStandardMaterial({
      color: districtColors.selected,
      roughness: 0.72,
      metalness: 0.08,
      transparent: true,
      opacity: 0.98,
    });
    const darkMaterial = new THREE.MeshStandardMaterial({
      color: districtColors.roof,
      roughness: 0.8,
      transparent: true,
      opacity: 0.96,
    });
    this.buildLandmarkModel(group, data.type, material, darkMaterial, data.id);

    group.traverse((object) => {
      if (object.isMesh && object.userData.isLandmarkModel) {
        object.castShadow = this.renderer.shadowMap.enabled;
        object.receiveShadow = true;
      }
    });

    const hitMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.58, 2.2, 12), hitMaterial);
    hit.position.y = 1;
    hit.userData = { interactionType: "landmark", id: data.id, districtId: districtEntry.data.id };
    group.add(hit);
    this.raycastTargets.push(hit);

    const marker = new THREE.Group();
    marker.position.y = 0.05;
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: districtColors.raw,
      transparent: true,
      opacity: 0.84,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.12, 0.18, 32), ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    marker.add(ring);
    const beaconMaterial = new THREE.MeshBasicMaterial({ color: districtColors.raw });
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), beaconMaterial);
    beacon.position.y = 1.3;
    marker.add(beacon);
    const lineMaterial = new THREE.LineBasicMaterial({ color: districtColors.raw, transparent: true, opacity: 0.45 });
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0.08, 0),
        new THREE.Vector3(0, 1.3, 0),
      ]),
      lineMaterial,
    );
    marker.add(line);
    group.add(marker);

    const anchor = new THREE.Object3D();
    anchor.position.y = 1.56;
    group.add(anchor);

    const entry = {
      data,
      districtId: districtEntry.data.id,
      group,
      material,
      darkMaterial,
      hit,
      marker,
      ring,
      ringMaterial,
      beacon,
      lineMaterial,
      anchor,
      baseScale: group.scale.clone(),
    };
    marker.visible = false;
    districtEntry.landmarks.push(entry);
    this.landmarkEntries.set(data.id, entry);
  }

  buildLandmarkModel(group, type, material, darkMaterial, id) {
    const addBox = (width, height, depth, x = 0, y = height * 0.5, z = 0, rotationY = 0, useDark = false) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), useDark ? darkMaterial : material);
      mesh.position.set(x, y, z);
      mesh.rotation.y = rotationY;
      mesh.userData.isLandmarkModel = true;
      group.add(mesh);
      return mesh;
    };
    const addCylinder = (radiusTop, radiusBottom, height, segments, x = 0, y = height * 0.5, z = 0, useDark = false) => {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments),
        useDark ? darkMaterial : material,
      );
      mesh.position.set(x, y, z);
      mesh.userData.isLandmarkModel = true;
      group.add(mesh);
      return mesh;
    };
    const addCone = (radius, height, segments, x = 0, y = height * 0.5, z = 0, useDark = true) => {
      const mesh = new THREE.Mesh(new THREE.ConeGeometry(radius, height, segments), useDark ? darkMaterial : material);
      mesh.position.set(x, y, z);
      mesh.userData.isLandmarkModel = true;
      group.add(mesh);
      return mesh;
    };

    switch (type) {
      case "cathedral": {
        addBox(1.35, 0.58, 0.82, 0, 0.29, 0);
        addBox(1.52, 0.1, 0.92, 0, 0.06, 0);
        [-0.48, -0.24, 0, 0.24, 0.48].forEach((x) => addCylinder(0.035, 0.045, 0.54, 10, x, 0.3, 0.45));
        addCylinder(0.18, 0.23, 1.26, 16, -0.95, 0.63, 0);
        addCone(0.19, 0.28, 16, -0.95, 1.4, 0);
        break;
      }
      case "tower": {
        const isTv = id === "tv-tower";
        addCylinder(isTv ? 0.09 : 0.28, isTv ? 0.22 : 0.34, isTv ? 2.8 : 1.2, isTv ? 18 : 10);
        if (isTv) {
          addCylinder(0.38, 0.34, 0.22, 24, 0, 1.85, 0);
          addCylinder(0.035, 0.065, 1.85, 12, 0, 3.0, 0, true);
        } else {
          addBox(0.46, 0.38, 0.46, 0, 1.12, 0);
          addCone(0.31, 0.4, 4, 0, 1.52, 0);
        }
        break;
      }
      case "church": {
        addBox(0.95, 0.56, 0.66, 0, 0.28, 0);
        addBox(0.42, 0.84, 0.46, 0, 0.48, -0.14);
        [-0.34, 0.34].forEach((x) => {
          addCylinder(0.12, 0.15, 0.86, 12, x, 0.48, 0.22);
          addCone(0.15, 0.36, 12, x, 1.08, 0.22);
        });
        addCone(0.36, 0.3, 4, 0, 0.82, 0, true);
        break;
      }
      case "gate": {
        addBox(1.12, 0.72, 0.42, 0, 0.36, 0);
        addBox(0.42, 0.62, 0.18, 0, 0.9, 0.06);
        addCone(0.34, 0.25, 4, 0, 1.3, 0.06);
        break;
      }
      case "memory": {
        addBox(0.1, 0.9, 0.1, -0.23, 0.45, 0);
        addBox(0.1, 1.18, 0.1, 0, 0.59, 0);
        addBox(0.1, 0.74, 0.1, 0.23, 0.37, 0);
        break;
      }
      case "street": {
        addBox(1.2, 0.18, 0.14, 0, 0.09, 0);
        for (let index = 0; index < 7; index += 1) {
          addBox(0.08, 0.18 + (index % 3) * 0.06, 0.04, -0.42 + index * 0.14, 0.26, 0.05);
        }
        break;
      }
      case "wall": {
        addBox(1.4, 0.46, 0.12, 0, 0.23, 0);
        for (let index = 0; index < 8; index += 1) {
          addBox(0.12, 0.28, 0.025, -0.53 + index * 0.15, 0.26, 0.075, 0, true);
        }
        break;
      }
      case "monument": {
        addCylinder(0.13, 0.18, 1.18, 12);
        addCone(0.24, 0.44, 4, 0, 1.42, 0);
        break;
      }
      case "sculpture": {
        addCylinder(0.11, 0.16, 0.34, 12, 0, 0.17, 0);
        const sculpture = new THREE.Mesh(new THREE.TorusKnotGeometry(0.17, 0.055, 48, 8), material);
        sculpture.scale.set(0.65, 0.65, 0.65);
        sculpture.position.y = 0.58;
        sculpture.userData.isLandmarkModel = true;
        group.add(sculpture);
        break;
      }
      case "cemetery": {
        const random = randomFrom(id);
        for (let index = 0; index < 12; index += 1) {
          const x = (random() - 0.5) * 1.15;
          const z = (random() - 0.5) * 0.9;
          const height = 0.16 + random() * 0.35;
          addBox(0.06 + random() * 0.08, height, 0.035, x, height * 0.5, z, random() * 0.35);
        }
        break;
      }
      case "prison": {
        addBox(1.2, 0.7, 0.26, 0, 0.35, -0.48);
        addBox(1.2, 0.7, 0.26, 0, 0.35, 0.48);
        addBox(0.26, 0.7, 0.72, -0.48, 0.35, 0);
        addBox(0.26, 0.7, 0.72, 0.48, 0.35, 0);
        addCylinder(0.18, 0.22, 0.82, 16, 0, 0.41, 0);
        addCone(0.19, 0.28, 12, 0, 0.96, 0);
        break;
      }
      case "museum": {
        const first = addBox(0.98, 0.52, 0.9, -0.15, 0.26, 0, -0.18);
        const second = addBox(0.78, 0.7, 0.72, 0.22, 0.35, 0.04, 0.22);
        first.geometry.translate(0.02, 0, 0);
        second.geometry.translate(-0.02, 0, 0);
        break;
      }
      case "market": {
        addBox(1.28, 0.5, 0.86, 0, 0.25, 0);
        const roof = addCone(0.7, 0.34, 4, 0, 0.67, 0);
        roof.scale.z = 0.68;
        break;
      }
      case "neighborhood": {
        [-0.43, 0, 0.43].forEach((x, index) => {
          addBox(0.34, 0.32 + index * 0.06, 0.4, x, 0.17 + index * 0.03, (index % 2) * 0.12);
          addCone(0.27, 0.22, 4, x, 0.5 + index * 0.06, (index % 2) * 0.12);
        });
        break;
      }
      case "skyscraper": {
        addBox(0.44, 2.4, 0.52, 0, 1.2, 0);
        addBox(0.08, 0.45, 0.08, 0, 2.62, 0, 0, true);
        break;
      }
      case "industrial": {
        addBox(1.15, 0.52, 0.76, 0, 0.26, 0);
        [-0.36, 0.36].forEach((x) => addCylinder(0.08, 0.11, 1.05, 12, x, 0.53, -0.15, true));
        break;
      }
      case "bridge": {
        addBox(1.8, 0.1, 0.34, 0, 0.3, 0);
        [-0.6, 0, 0.6].forEach((x) => addBox(0.07, 0.52, 0.42, x, 0.16, 0));
        break;
      }
      case "synagogue": {
        addBox(0.9, 0.62, 0.66, 0, 0.31, 0);
        addCylinder(0.26, 0.3, 0.24, 18, 0, 0.75, 0);
        addCone(0.24, 0.28, 18, 0, 1.02, 0);
        break;
      }
      case "park": {
        const random = randomFrom(id);
        for (let index = 0; index < 11; index += 1) {
          const x = (random() - 0.5) * 1.35;
          const z = (random() - 0.5) * 0.9;
          addCylinder(0.025, 0.035, 0.26, 8, x, 0.13, z, true);
          addCone(0.14 + random() * 0.08, 0.34 + random() * 0.18, 10, x, 0.46, z);
        }
        break;
      }
      case "palace": {
        addBox(1.3, 0.58, 0.68, 0, 0.29, 0);
        addBox(0.28, 0.82, 0.72, -0.52, 0.41, 0);
        addBox(0.28, 0.82, 0.72, 0.52, 0.41, 0);
        [-0.28, -0.1, 0.1, 0.28].forEach((x) => addCylinder(0.035, 0.045, 0.48, 10, x, 0.34, 0.37));
        break;
      }
      case "modernist": {
        addBox(0.52, 1.85, 0.68, 0, 0.925, 0);
        addBox(1.05, 0.28, 0.74, 0.15, 0.14, 0);
        break;
      }
      case "fort": {
        for (let index = 0; index < 5; index += 1) {
          const angle = (index / 5) * Math.PI * 2;
          addBox(0.62, 0.3, 0.22, Math.cos(angle) * 0.42, 0.15, Math.sin(angle) * 0.42, -angle);
        }
        addCylinder(0.24, 0.3, 0.42, 12, 0, 0.21, 0, true);
        break;
      }
      case "ship": {
        const hull = addBox(1.35, 0.24, 0.38, 0, 0.22, 0);
        hull.rotation.z = -0.04;
        [-0.34, 0.18].forEach((x) => {
          addCylinder(0.025, 0.035, 1.35, 8, x, 0.84, 0, true);
          addBox(0.52, 0.025, 0.025, x + 0.18, 1.14, 0, 0.18, true);
        });
        break;
      }
      case "lighthouse": {
        addCylinder(0.11, 0.22, 1.55, 18);
        addCylinder(0.2, 0.2, 0.14, 18, 0, 1.45, 0, true);
        addCone(0.2, 0.24, 18, 0, 1.66, 0);
        break;
      }
      case "square": {
        addBox(1.35, 0.08, 1.05, 0, 0.04, 0);
        addCylinder(0.09, 0.14, 0.72, 12, 0, 0.38, 0);
        addCone(0.2, 0.3, 5, 0, 0.85, 0);
        break;
      }
      case "station": {
        addBox(1.3, 0.55, 0.55, 0, 0.275, 0);
        addBox(0.46, 0.84, 0.58, -0.28, 0.42, 0);
        const roof = addCone(0.76, 0.34, 4, 0, 0.72, 0);
        roof.scale.z = 0.5;
        break;
      }
      default: {
        addBox(0.78, 0.72, 0.68, 0, 0.36, 0);
        addCone(0.48, 0.3, 4, 0, 0.86, 0);
      }
    }
  }

  createMovers() {
    (this.config.moverPaths || []).forEach((route, index) => {
      const curve = new THREE.CatmullRomCurve3(
        route.points.map(([x, z]) => new THREE.Vector3(x, 0.2, z)),
        false,
        "catmullrom",
        0.35,
      );
      const group = new THREE.Group();
      const color = new THREE.Color(route.color || this.config.accent);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: this.theme === "dark" ? 0.55 : 0.12,
        roughness: 0.44,
        metalness: 0.22,
      });
      const darkMaterial = new THREE.MeshStandardMaterial({
        color: this.palettes.dark.roof,
        roughness: 0.68,
        metalness: 0.18,
      });

      if (route.kind === "ship") {
        const hull = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.14, 0.25), bodyMaterial);
        hull.position.y = 0.08;
        group.add(hull);
        const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.15, 0.2), darkMaterial);
        cabin.position.set(0.12, 0.2, 0);
        group.add(cabin);
      } else if (route.kind === "ferry") {
        const deck = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.11, 0.32), bodyMaterial);
        group.add(deck);
        const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.25), darkMaterial);
        cabin.position.y = 0.14;
        group.add(cabin);
      } else {
        const body = new THREE.Mesh(
          new THREE.CapsuleGeometry(route.kind === "tram" ? 0.1 : 0.07, route.kind === "tram" ? 0.48 : 0.3, 4, 8),
          bodyMaterial,
        );
        body.rotation.z = Math.PI / 2;
        group.add(body);
      }

      const wakeMaterial = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.36,
        depthWrite: false,
      });
      const wake = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.035), wakeMaterial);
      wake.rotation.x = -Math.PI / 2;
      wake.position.set(-0.48, -0.08, 0);
      group.add(wake);
      group.scale.setScalar(route.kind === "ship" ? 1.3 : 1);
      this.world.add(group);
      this.movers.push({
        group,
        curve,
        speed: route.speed || 0.025,
        offset: index / Math.max(1, (this.config.moverPaths || []).length),
        wakeMaterial,
      });
    });
  }

  createAtmosphere() {
    const count = window.innerWidth < 720 ? 72 : 140;
    const random = randomFrom(`${this.city.id}-atmosphere`);
    const positions = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    for (let index = 0; index < count; index += 1) {
      const x = (random() - 0.5) * 29;
      const y = 0.35 + random() * (this.city.id === "klaipeda" ? 2.8 : 4.2);
      const z = (random() - 0.5) * 16;
      positions.set([x, y, z], index * 3);
      base.set([x, y, z], index * 3);
      phases[index] = random() * Math.PI * 2;
    }
    this.ambientGeometry = new THREE.BufferGeometry();
    this.ambientGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.ambientBase = base;
    this.ambientPhases = phases;
    this.ambientMaterial = new THREE.PointsMaterial({
      color: this.city.id === "klaipeda" ? this.secondaryColor : this.accentColor,
      size: this.city.id === "klaipeda" ? 0.045 : 0.035,
      transparent: true,
      opacity: this.city.id === "klaipeda" ? 0.38 : 0.5,
      depthWrite: false,
      sizeAttenuation: true,
    });
    this.ambientPoints = new THREE.Points(this.ambientGeometry, this.ambientMaterial);
    this.world.add(this.ambientPoints);
  }

  initControls() {
    this.controls = new MapControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.065;
    this.controls.enablePan = false;
    this.controls.enableRotate = true;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 3.2;
    this.controls.maxDistance = 42;
    this.controls.minPolarAngle = 0.28;
    this.controls.maxPolarAngle = Math.PI * 0.465;
    this.controls.target.set(-1.2, 0, 0);
    this.controls.addEventListener("start", () => {
      this.cameraTween = null;
    });
  }

  bindEvents() {
    this.handleResize = () => this.resize();
    this.handlePointerMove = (event) => this.onPointerMove(event);
    this.handlePointerDown = (event) => {
      this.pointerDown = { x: event.clientX, y: event.clientY, time: performance.now() };
    };
    this.handlePointerUp = (event) => this.onPointerUp(event);
    this.handlePointerLeave = () => this.setHover(null);
    this.handleDoubleClick = () => this.callbacks.onBack?.();
    window.addEventListener("resize", this.handleResize, { passive: true });
    this.canvas.addEventListener("pointermove", this.handlePointerMove, { passive: true });
    this.canvas.addEventListener("pointerdown", this.handlePointerDown, { passive: true });
    this.canvas.addEventListener("pointerup", this.handlePointerUp, { passive: true });
    this.canvas.addEventListener("pointerleave", this.handlePointerLeave, { passive: true });
    this.canvas.addEventListener("dblclick", this.handleDoubleClick);
  }

  toWorld([lat, lon]) {
    return new THREE.Vector3(
      (lon - this.center.lon) * this.scaleX,
      0,
      -(lat - this.center.lat) * this.scaleZ,
    );
  }

  resize() {
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    this.camera.aspect = width / Math.max(1, height);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 720 ? 1.35 : 1.8));
  }

  setContentData(city) {
    this.city = city;
    this.districts = city.districts;
    city.districts.forEach((district) => {
      const districtEntry = this.districtEntries.get(district.id);
      if (!districtEntry) return;
      districtEntry.data = district;
      district.landmarks.forEach((landmark) => {
        const landmarkEntry = this.landmarkEntries.get(landmark.id);
        if (landmarkEntry) landmarkEntry.data = landmark;
      });
    });
  }

  setTheme(theme, immediate = false) {
    this.theme = theme;
    const palette = this.palettes[theme];
    this.renderer.setClearColor(palette.background, 1);
    this.scene.fog.color.setHex(palette.fog);
    this.landMaterial.color.setHex(palette.land);
    this.landLineMaterial.color.setHex(palette.landEdge);
    this.riverMaterial.color.setHex(palette.river);
    this.roadMaterial.color.setHex(palette.road);
    this.hemiLight.color.setHex(palette.light);
    this.hemiLight.groundColor.setHex(
      this.city.id === "klaipeda"
        ? theme === "dark" ? 0x071a21 : 0x8ba9a5
        : theme === "dark" ? 0x161914 : 0x939c8d,
    );
    this.keyLight.color.setHex(palette.light);
    this.rimLight.color.copy(this.secondaryColor);
    this.contourLines.forEach(({ material }) => material.color.setHex(palette.landEdge));

    this.districtEntries.forEach((entry) => {
      const colors = this.getDistrictColors(entry.data, theme);
      entry.padMaterial.color.copy(colors.raw);
      entry.boundaryMaterial.color.copy(colors.raw);
      entry.buildingMaterial.color.copy(colors.building);
      entry.markerMaterial.color.copy(colors.raw);
      entry.markerStemMaterial.color.copy(colors.raw);
      if (entry.roofMaterial) entry.roofMaterial.color.copy(colors.roof);
      entry.landmarks.forEach((landmark) => {
        landmark.ringMaterial.color.copy(colors.raw);
        landmark.beacon.material.color.copy(colors.raw);
        landmark.lineMaterial.color.copy(colors.raw);
      });
    });
    this.landmarkEntries.forEach((entry) => {
      const district = this.districtEntries.get(entry.districtId)?.data;
      const colors = this.getDistrictColors(district || {}, theme);
      entry.material.color.copy(colors.selected);
      entry.darkMaterial.color.copy(colors.roof);
    });
    this.movers.forEach(({ group }) => {
      group.traverse((object) => {
        if (object.material?.emissive) object.material.emissiveIntensity = theme === "dark" ? 0.55 : 0.08;
      });
    });
    this.updateVisualState(immediate);
  }

  setSelection(selection, immediate = false) {
    this.selection = { ...selection };
    this.updateVisualState(immediate);

    if (selection.level === "city") this.focusCity(immediate);
    else if (selection.level === "district") this.focusDistrict(selection.districtId, immediate);
    else if (selection.level === "landmark") this.focusLandmark(selection.landmarkId, immediate);
  }

  updateVisualState(immediate = false) {
    const palette = this.palettes[this.theme];
    const selectedDistrict = this.selection.districtId;
    const selectedLandmark = this.selection.landmarkId;

    this.districtEntries.forEach((entry, id) => {
      const colors = this.getDistrictColors(entry.data);
      const isSelected = id === selectedDistrict;
      const cityLevel = this.selection.level === "city";
      const targetBuildingOpacity = cityLevel ? 0.9 : isSelected ? (selectedLandmark ? 0.58 : 0.96) : 0.18;
      const targetPadOpacity = cityLevel ? 0.16 : isSelected ? 0.34 : 0.045;
      const targetBoundaryOpacity = cityLevel ? 0.22 : isSelected ? 0.72 : 0.06;
      const targetColor = isSelected ? colors.selected : colors.building;
      entry.buildingMaterial.opacity = targetBuildingOpacity;
      entry.buildingMaterial.color.copy(targetColor);
      if (entry.roofMaterial) {
        entry.roofMaterial.opacity = targetBuildingOpacity;
        entry.roofMaterial.color.copy(isSelected ? colors.building : colors.roof);
      }
      entry.padMaterial.opacity = targetPadOpacity;
      entry.boundaryMaterial.opacity = targetBoundaryOpacity;
      entry.marker.visible = cityLevel;
      entry.markerMaterial.opacity = cityLevel ? 0.7 : 0;
      entry.markerStemMaterial.opacity = cityLevel ? 0.32 : 0;

      entry.landmarks.forEach((landmark) => {
        const active = landmark.data.id === selectedLandmark;
        const districtActive = id === selectedDistrict;
        landmark.marker.visible = districtActive;
        landmark.material.color.copy(
          active
            ? colors.raw.clone().lerp(new THREE.Color(palette.light), 0.22)
            : districtActive
              ? colors.selected
              : new THREE.Color(palette.landmarkDim),
        );
        landmark.darkMaterial.color.copy(active ? colors.raw : colors.roof);
        landmark.material.opacity = districtActive ? (active ? 1 : 0.92) : 0.3;
        landmark.darkMaterial.opacity = districtActive ? (active ? 1 : 0.92) : 0.3;
        landmark.ringMaterial.opacity = active ? 1 : 0.7;
        landmark.group.scale.setScalar(active ? 1.18 : 1);
      });
    });

    if (immediate) this.renderer.render(this.scene, this.camera);
  }

  focusCity(immediate = false) {
    const mobile = window.innerWidth < 720;
    const coastal = this.city.id === "klaipeda";
    const endPosition = coastal
      ? mobile
        ? new THREE.Vector3(-1.8, 24, 25.5)
        : new THREE.Vector3(-5.8, 19.5, 25)
      : mobile
        ? new THREE.Vector3(-1.4, 22.5, 23.5)
        : new THREE.Vector3(-2.8, 20.5, 23.5);
    const endTarget = coastal
      ? new THREE.Vector3(1.1, 0, 0)
      : mobile ? new THREE.Vector3(-0.8, 0, 0.2) : new THREE.Vector3(-1.4, 0, 0);
    this.flyCamera(endPosition, endTarget, immediate ? 0 : 1550);
  }

  focusDistrict(id, immediate = false) {
    const entry = this.districtEntries.get(id);
    if (!entry) return;
    const mobile = window.innerWidth < 720;
    const position = entry.position.clone();
    const offset = mobile
      ? new THREE.Vector3(0.4, 9.2, 9.6)
      : new THREE.Vector3(-2.2, 8.2, 9.8);
    const target = position.clone().add(new THREE.Vector3(mobile ? 0 : -0.5, 0.1, 0));
    this.flyCamera(position.clone().add(offset), target, immediate ? 0 : 1250);
  }

  focusLandmark(id, immediate = false) {
    const entry = this.landmarkEntries.get(id);
    if (!entry) return;
    const worldPosition = new THREE.Vector3();
    entry.group.getWorldPosition(worldPosition);
    const mobile = window.innerWidth < 720;
    const seed = randomFrom(id);
    const side = seed() > 0.5 ? 1 : -1;
    const offset = mobile
      ? new THREE.Vector3(1.8 * side, 4.8, 5.2)
      : new THREE.Vector3(-2.8 * side, 3.8, 5.6);
    const target = worldPosition.clone().add(new THREE.Vector3(0, 0.55, 0));
    this.flyCamera(worldPosition.clone().add(offset), target, immediate ? 0 : 1100);
  }

  flyCamera(endPosition, endTarget, duration = 1200) {
    if (this.reducedMotion || duration === 0) {
      this.camera.position.copy(endPosition);
      this.controls.target.copy(endTarget);
      this.controls.update();
      this.cameraTween = null;
      return;
    }
    this.cameraTween = {
      start: performance.now(),
      duration,
      startPosition: this.camera.position.clone(),
      endPosition,
      startTarget: this.controls.target.clone(),
      endTarget,
    };
  }

  updateCameraTween(now) {
    if (!this.cameraTween) return;
    const elapsed = (now - this.cameraTween.start) / this.cameraTween.duration;
    const progress = clamp(elapsed, 0, 1);
    const eased = easeInOut(progress);
    this.camera.position.lerpVectors(
      this.cameraTween.startPosition,
      this.cameraTween.endPosition,
      eased,
    );
    this.controls.target.lerpVectors(this.cameraTween.startTarget, this.cameraTween.endTarget, eased);
    if (progress >= 1) this.cameraTween = null;
  }

  onPointerMove(event) {
    const interaction = this.pick(event);
    this.setHover(interaction);
  }

  onPointerUp(event) {
    if (!this.pointerDown) return;
    const distance = Math.hypot(event.clientX - this.pointerDown.x, event.clientY - this.pointerDown.y);
    const elapsed = performance.now() - this.pointerDown.time;
    this.pointerDown = null;
    if (distance > 7 || elapsed > 650) return;
    const interaction = this.pick(event);
    if (!interaction) return;
    if (interaction.type === "district") this.callbacks.onSelectDistrict?.(interaction.id);
    if (interaction.type === "landmark") this.callbacks.onSelectLandmark?.(interaction.id);
  }

  pick(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersections = this.raycaster.intersectObjects(this.raycastTargets, false);
    for (const intersection of intersections) {
      const userData = intersection.object.userData;
      if (!userData?.interactionType) continue;
      if (userData.interactionType === "landmark") {
        if (this.selection.districtId !== userData.districtId) continue;
        return { type: "landmark", id: userData.id };
      }
      if (userData.interactionType === "district") {
        if (this.selection.level === "landmark" && userData.id !== this.selection.districtId) continue;
        return { type: "district", id: userData.id };
      }
    }
    return null;
  }

  setHover(interaction) {
    const nextKey = interaction ? `${interaction.type}:${interaction.id}` : null;
    if (nextKey === this.hovered) return;
    this.hovered = nextKey;
    this.canvas.style.cursor = interaction ? "pointer" : "grab";
    this.callbacks.onHover?.(interaction);
  }

  projectLabels() {
    if (!this.callbacks.onProject) return;
    const rect = this.canvas.getBoundingClientRect();
    const labels = [];

    if (this.selection.level === "city") {
      this.districtEntries.forEach((entry) => {
        labels.push(this.projectAnchor(entry.anchor, "district", entry.data.id, rect));
      });
    } else if (this.selection.districtId) {
      const district = this.districtEntries.get(this.selection.districtId);
      district?.landmarks.forEach((entry) => {
        labels.push(this.projectAnchor(entry.anchor, "landmark", entry.data.id, rect));
      });
    }

    this.callbacks.onProject(labels.filter(Boolean));
  }

  projectAnchor(anchor, type, id, rect) {
    const world = new THREE.Vector3();
    anchor.getWorldPosition(world);
    const projected = world.clone().project(this.camera);
    const visible = projected.z > -1 && projected.z < 1 && Math.abs(projected.x) < 1.08 && Math.abs(projected.y) < 1.08;
    return {
      type,
      id,
      x: (projected.x * 0.5 + 0.5) * rect.width,
      y: (-projected.y * 0.5 + 0.5) * rect.height,
      visible,
      depth: projected.z,
    };
  }

  animate = (now = performance.now()) => {
    if (this.destroyed) return;
    this.animationFrame = requestAnimationFrame(this.animate);
    const elapsed = this.clock.getElapsedTime();
    this.updateCameraTween(now);
    this.controls.update();

    if (!this.reducedMotion) {
      if (this.waterShader) this.waterShader.uniforms.uCityTime.value = elapsed;
      this.roadMaterial.dashOffset = -elapsed * 0.16;
      this.flowMaterials.forEach(({ material, speed }) => {
        material.dashOffset = -elapsed * speed;
      });
      this.keyLight.position.x = -10 + Math.sin(elapsed * 0.12) * 2.4;
      this.rimLight.position.z = -10 + Math.cos(elapsed * 0.15) * 2;

      this.districtEntries.forEach((entry, index) => {
        const reveal = clamp((now - this.revealStartedAt - index * 90) / 900, 0, 1);
        const revealEase = 1 - Math.pow(1 - reveal, 4);
        entry.buildings.scale.y = Math.max(0.001, revealEase);
        if (entry.roofs) entry.roofs.scale.y = Math.max(0.001, revealEase);
        const districtHovered = this.hovered === `district:${entry.data.id}`;
        const targetScale = districtHovered ? 1.035 : 1;
        entry.group.scale.x = THREE.MathUtils.lerp(entry.group.scale.x, targetScale, 0.1);
        entry.group.scale.z = THREE.MathUtils.lerp(entry.group.scale.z, targetScale, 0.1);
        entry.group.position.y = THREE.MathUtils.lerp(entry.group.position.y, districtHovered ? 0.1 : 0, 0.1);

        if (!entry.marker.visible) return;
        const pulse = 1 + Math.sin(elapsed * 1.6 + index) * 0.12;
        entry.markerRing.scale.setScalar(pulse);
      });
      this.landmarkEntries.forEach((entry, index) => {
        const active = entry.data.id === this.selection.landmarkId;
        const hovered = this.hovered === `landmark:${entry.data.id}`;
        const targetScale = active ? 1.2 : hovered ? 1.09 : 1;
        const currentScale = THREE.MathUtils.lerp(entry.group.scale.x, targetScale, 0.13);
        entry.group.scale.setScalar(currentScale);
        if (!entry.marker.visible) return;
        const pulse = 1 + Math.sin(elapsed * 2.15 + index * 0.65) * (active ? 0.16 : 0.08);
        entry.ring.scale.setScalar(pulse);
        entry.beacon.position.y = 1.3 + Math.sin(elapsed * 1.7 + index) * 0.05;
      });

      this.movers.forEach((mover, index) => {
        const t = (elapsed * mover.speed + mover.offset) % 1;
        const position = mover.curve.getPointAt(t);
        const tangent = mover.curve.getTangentAt(t).normalize();
        mover.group.position.copy(position);
        mover.group.position.y += Math.sin(elapsed * 2.2 + index) * 0.018;
        mover.group.rotation.y = -Math.atan2(tangent.z, tangent.x);
        mover.wakeMaterial.opacity = 0.22 + Math.sin(elapsed * 2.6 + index) * 0.1;
      });

      if (this.ambientGeometry) {
        const positions = this.ambientGeometry.attributes.position.array;
        for (let index = 0; index < this.ambientPhases.length; index += 1) {
          const offset = index * 3;
          const phase = this.ambientPhases[index];
          positions[offset] = this.ambientBase[offset]
            + Math.sin(elapsed * (this.city.id === "klaipeda" ? 0.62 : 0.28) + phase)
              * (this.city.id === "klaipeda" ? 1.2 : 0.28);
          positions[offset + 1] = this.ambientBase[offset + 1] + Math.sin(elapsed * 0.7 + phase) * 0.12;
          positions[offset + 2] = this.ambientBase[offset + 2] + Math.cos(elapsed * 0.2 + phase) * 0.18;
        }
        this.ambientGeometry.attributes.position.needsUpdate = true;
      }
    }

    this.renderer.render(this.scene, this.camera);
    this.projectLabels();
  };

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener("resize", this.handleResize);
    this.canvas.removeEventListener("pointermove", this.handlePointerMove);
    this.canvas.removeEventListener("pointerdown", this.handlePointerDown);
    this.canvas.removeEventListener("pointerup", this.handlePointerUp);
    this.canvas.removeEventListener("pointerleave", this.handlePointerLeave);
    this.canvas.removeEventListener("dblclick", this.handleDoubleClick);
    this.controls.dispose();
    this.renderer.dispose();
    this.scene.traverse((object) => {
      object.geometry?.dispose?.();
      if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose?.());
      else object.material?.dispose?.();
    });
  }
}
