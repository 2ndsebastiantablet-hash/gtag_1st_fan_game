(function () {
  const SEED = 88421;
  const CITY = chooseCity();
  const C = {
    concreteDark: "#4D5254",
    concrete: "#777C7E",
    concreteLight: "#A4A8A8",
    asphalt: "#23272A",
    window: "#11171A",
    rust: "#8B4B2B",
    vine: "#1E6B2D",
    vineLight: "#4FA646",
    leaf: "#286B2E",
    bark: "#4B321F"
  };

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", waitForTerrain);
  } else {
    waitForTerrain();
  }

  function waitForTerrain(attempt) {
    if (window.getTerrainHeightAt || attempt > 80) {
      buildCity();
      return;
    }

    window.setTimeout(function () {
      waitForTerrain((attempt || 0) + 1);
    }, 100);
  }

  function buildCity() {
    const mapRoot = document.getElementById("storm-plain-map");

    if (!mapRoot || document.getElementById("abandoned-city-biome")) {
      return;
    }

    clearCityFootprint(mapRoot);

    const root = entity(mapRoot, "a-entity", {
      id: "abandoned-city-biome",
      "data-name": "abandoned city biome"
    });

    buildForestRing(root);
    buildRoadMaze(root);
    buildTowers(root);
    buildRubble(root);
    buildCars(root);
    buildVineRoutes(root);
    refreshLocomotionColliders();
  }

  function buildRoadMaze(root) {
    for (let i = -3; i <= 3; i += 1) {
      for (let j = -3; j <= 3; j += 1) {
        const x = CITY.x + i * 6.2;
        const z = CITY.z + j * 6.2;
        const y = ground(x, z) + 0.045;

        if (Math.abs(i) <= 2) {
          box(root, "city cracked street slab", [x, y, z], [3.2, 0.08, 6.8], C.asphalt, false);
        }

        if (Math.abs(j) <= 2) {
          box(root, "city cracked cross street slab", [x, y + 0.01, z], [6.8, 0.08, 3.2], C.asphalt, false);
        }
      }
    }

    for (let i = 0; i < 38; i += 1) {
      const rnd = seeded(SEED + i * 19);
      const x = CITY.x + (rnd() - 0.5) * 42;
      const z = CITY.z + (rnd() - 0.5) * 42;
      const slab = box(root, "city broken sidewalk chunk", [x, ground(x, z) + 0.1, z], [1.2 + rnd() * 2.8, 0.12, 0.8 + rnd() * 1.8], rnd() > 0.5 ? C.concrete : C.concreteLight, false);
      slab.setAttribute("rotation", "0 " + (rnd() * 180).toFixed(1) + " 0");
    }
  }

  function buildTowers(root) {
    const towers = [
      [-18, -17, 5.8, 6.8, 36, true], [-8, -18, 5.1, 7.4, 28, false], [4, -18, 7.7, 6.2, 46, true], [17, -16, 6.2, 7.6, 34, true],
      [-20, -6, 7.3, 5.9, 30, false], [-8, -6, 5.8, 6.4, 42, true], [5, -7, 5.3, 7.8, 32, false], [18, -5, 8.0, 6.1, 50, true],
      [-18, 8, 6.2, 7.5, 40, true], [-6, 8, 7.0, 5.9, 28, false], [7, 7, 5.8, 7.1, 37, true], [19, 8, 5.4, 6.4, 31, false],
      [-12, 19, 8.1, 6.1, 35, true], [3, 19, 7.2, 7.2, 47, true], [17, 20, 6.0, 7.0, 39, true]
    ];

    towers.forEach(function (t, i) {
      tower(root, CITY.x + t[0], CITY.z + t[1], t[2], t[3], t[4], i, t[5]);
    });

    const bridgeA = box(root, "city elevated concrete shortcut", [CITY.x - 1, ground(CITY.x - 1, CITY.z - 4) + 12.3, CITY.z - 4], [20, 1.05, 2.1], C.concrete, true);
    bridgeA.setAttribute("rotation", "0 5 6");
    const bridgeB = box(root, "city collapsed skybridge shortcut", [CITY.x + 8, ground(CITY.x + 8, CITY.z + 12) + 8.3, CITY.z + 12], [16, 1.0, 2.0], C.concreteDark, true);
    bridgeB.setAttribute("rotation", "0 -31 -15");
  }

  function tower(root, x, z, width, depth, height, index, broken) {
    const y = ground(x, z);
    const towerColor = [C.concrete, C.concreteDark, C.concreteLight][index % 3];
    box(root, "city huge abandoned climbable building", [x, y + height / 2, z], [width, height, depth], towerColor, true);

    if (broken) {
      const cap = box(root, "city jagged broken building top", [x + width * 0.16, y + height + 0.9, z - depth * 0.14], [width * 0.74, 2.1, depth * 0.58], C.concreteDark, true);
      cap.setAttribute("rotation", "0 " + (index % 2 ? -11 : 13) + " " + (index % 2 ? 6 : -7));
      box(root, "city dark blown out wall", [x - width / 2 - 0.035, y + height * 0.68, z], [0.07, height * 0.25, depth * 0.68], C.window, false);
    }

    for (let row = 1; row < Math.min(13, Math.floor(height / 3)); row += 1) {
      for (let col = 0; col < Math.max(2, Math.floor(width / 1.5)); col += 1) {
        if ((row + col + index) % 4 !== 0) {
          box(root, "city dark window", [x - width * 0.36 + col * 1.15, y + 2.4 + row * 2.55, z - depth / 2 - 0.035], [0.55, 1.05, 0.05], C.window, false);
        }
      }
    }

    for (let i = 0; i < 5; i += 1) {
      const side = i % 2 ? -1 : 1;
      const vineHeight = height * (0.38 + ((index + i) % 5) * 0.11);
      const vx = x + side * (width / 2 + 0.14);
      const vz = z - depth * 0.42 + i * depth * 0.2;
      const vine = box(root, "city thick climbable building vine", [vx, y + vineHeight / 2 + 0.65, vz], [0.34, vineHeight, 0.32], i % 2 ? C.vineLight : C.vine, true);
      vine.setAttribute("rotation", "0 " + (side > 0 ? 0 : 180) + " " + (i % 2 ? 7 : -5));
    }

    box(root, "city roof plant takeover", [x, y + height + 0.18, z], [width * 0.88, 0.3, depth * 0.82], index % 2 ? C.leaf : C.vine, false);
  }

  function buildRubble(root) {
    for (let i = 0; i < 64; i += 1) {
      const rnd = seeded(SEED + 601 + i * 47);
      const x = CITY.x + (rnd() - 0.5) * 42;
      const z = CITY.z + (rnd() - 0.5) * 42;
      const block = box(root, "city solid rubble pile", [x, ground(x, z) + 0.25, z], [0.8 + rnd() * 2.6, 0.35 + rnd() * 1.35, 0.7 + rnd() * 2.3], rnd() > 0.5 ? C.concrete : C.concreteDark, true);
      block.setAttribute("rotation", [rnd() * 16 - 8, rnd() * 180, rnd() * 16 - 8].map(fixed).join(" "));
    }

    const fallen = box(root, "city fallen tower chunk", [CITY.x + 11, ground(CITY.x + 11, CITY.z + 14) + 2.25, CITY.z + 14], [15, 4.2, 5.4], C.concreteDark, true);
    fallen.setAttribute("rotation", "8 -32 11");
  }

  function buildCars(root) {
    const cars = [
      [-13, -9, 0, true], [-2, -13, 90, false], [11, -8, -28, true], [-16, 5, 18, false],
      [1, 3, 0, true], [13, 13, 74, false], [-7, 18, -84, true], [18, -1, 35, true]
    ];

    cars.forEach(function (c, i) {
      const x = CITY.x + c[0];
      const z = CITY.z + c[1];
      const y = ground(x, z);
      const color = [C.rust, "#315C37", "#4D5356"][i % 3];
      const body = box(root, "city abandoned solid car body", [x, y + 0.45, z], [2.7, 0.8, 4.2], color, true);
      const cabin = box(root, "city abandoned car cabin", [x, y + 1.05, z - 0.18], [1.75, 0.85, 1.7], C.window, true);
      const cover = box(root, "city car vine cover", [x, y + 1.42, z], [2.5, 0.22, 3.8], i % 2 ? C.vine : C.leaf, false);
      [body, cabin, cover].forEach(function (part) {
        part.setAttribute("rotation", "0 " + c[2] + " " + (c[3] ? i % 2 ? -8 : 7 : 0));
      });
    });
  }

  function buildVineRoutes(root) {
    const spans = [
      [-19, -3, -6, -3, 6.0], [-4, -15, -4, 5, 7.2], [7, -13, 18, -13, 9.4],
      [-17, 9, -1, 9, 6.8], [6, 6, 6, 20, 8.3], [-14, 18, 13, 18, 5.5],
      [-18, -17, 18, 8, 11.2], [18, -5, -12, 19, 10.4]
    ];

    spans.forEach(function (s, i) {
      const x1 = CITY.x + s[0];
      const z1 = CITY.z + s[1];
      const x2 = CITY.x + s[2];
      const z2 = CITY.z + s[3];
      const midX = (x1 + x2) / 2;
      const midZ = (z1 + z2) / 2;
      const length = Math.hypot(x2 - x1, z2 - z1);
      const angle = Math.atan2(z2 - z1, x2 - x1) * 180 / Math.PI;
      const vine = box(root, "city overhead climbable vine shortcut", [midX, ground(midX, midZ) + s[4], midZ], [length, 0.32, 0.32], i % 2 ? C.vineLight : C.vine, true);
      vine.setAttribute("rotation", "0 " + (-angle).toFixed(1) + " 0");
    });
  }

  function buildForestRing(root) {
    for (let i = 0; i < 72; i += 1) {
      const rnd = seeded(SEED + 1100 + i * 31);
      const angle = (i / 72) * Math.PI * 2 + (rnd() - 0.5) * 0.24;
      const radius = CITY.radius + 1.5 + rnd() * 8;
      const x = CITY.x + Math.cos(angle) * radius;
      const z = CITY.z + Math.sin(angle) * radius;
      const h = 13 + rnd() * 18;
      const r = 0.55 + rnd() * 0.55;
      const y = ground(x, z);
      cylinder(root, "city surrounding rainforest trunk", [x, y + h / 2, z], r, h, i % 2 ? C.bark : "#3A2518");
      box(root, "city surrounding rainforest canopy", [x, y + h + 1.5, z], [r * 6.6, 3.4, r * 6.6], i % 2 ? C.leaf : C.vine, false);
    }
  }

  function clearCityFootprint(mapRoot) {
    Array.from(mapRoot.querySelectorAll("[data-name]")).forEach(function (node) {
      const name = String(node.getAttribute("data-name") || "");

      if (!/forest|tree|branch|trunk|canopy|nub/.test(name)) {
        return;
      }

      const p = node.object3D.position;

      if (Math.hypot(p.x - CITY.x, p.z - CITY.z) < CITY.radius * 0.92) {
        node.remove();
      }
    });
  }

  function chooseCity() {
    const options = [[-24, -17], [23, -18], [-26, 6], [24, 7]];
    const rnd = seeded(SEED + 13);
    const pick = options[Math.floor(rnd() * options.length)];
    return { x: pick[0], z: pick[1], radius: 24 };
  }

  function ground(x, z) {
    if (window.getTerrainHeightAt) {
      return window.getTerrainHeightAt(x, z);
    }

    return 0;
  }

  function box(root, name, pos, size, color, solid) {
    const attrs = {
      "data-name": name,
      position: vector(pos),
      width: String(size[0]),
      height: String(size[1]),
      depth: String(size[2]),
      color: color,
      roughness: "1"
    };

    if (solid !== false) {
      attrs["locomotion-collider"] = "type: box; size: " + size.join(" ");
    }

    return entity(root, "a-box", attrs);
  }

  function cylinder(root, name, pos, radius, depth, color) {
    return entity(root, "a-cylinder", {
      "data-name": name,
      position: vector(pos),
      radius: String(radius),
      height: String(depth),
      segments: "12",
      color: color,
      roughness: "1",
      "locomotion-collider": "type: box; size: " + [radius * 2, depth, radius * 2].join(" ")
    });
  }

  function entity(root, tagName, attrs) {
    const node = document.createElement(tagName);
    Object.keys(attrs).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    root.appendChild(node);
    return node;
  }

  function refreshLocomotionColliders() {
    const rig = document.getElementById("player-rig");
    const component = rig && rig.components && rig.components["gorilla-locomotion"];

    if (component && component.el && component.el.sceneEl) {
      component.colliders = Array.from(component.el.sceneEl.querySelectorAll("[locomotion-collider]"));
    }
  }

  function seeded(seed) {
    let value = seed >>> 0;
    return function () {
      value = (value * 1664525 + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function vector(values) {
    return values.map(function (value) {
      return Number(value.toFixed ? value.toFixed(3) : value);
    }).join(" ");
  }

  function fixed(value) {
    return value.toFixed(1);
  }
})();
