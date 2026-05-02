(function () {
  const MAP_SIZE = 92;
  const TILE_SIZE = 7;
  const HALF = MAP_SIZE / 2;
  const SEED = 4319;

  const C = {
    grassDark: "#274F28",
    grass: "#3D7A37",
    grassLight: "#5E9D43",
    wetGrass: "#2F6332",
    mud: "#4C3828",
    puddle: "#263F4F",
    rock: "#555A5B",
    rockLight: "#747A78",
    cloud: "#3A3D43",
    cloudLight: "#5E646D",
    rain: "#A8CFE8",
    lightning: "#EAF6FF"
  };

  if (window.AFRAME) {
    registerStormComponents();
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    const root = document.getElementById("storm-plain-map");

    if (!root) {
      return;
    }

    root.setAttribute("id", "storm-plain-map");
    buildMap(root);
  }

  function buildMap(root) {
    entity(root, "a-entity", {
      id: "rain-system",
      "storm-rain": "count: 260; radius: 48; height: 28"
    });

    buildTerrain(root);
    buildTraversal(root);
    buildGrass(root);
    buildStormSky(root);
    entity(root, "a-entity", {
      id: "lightning-system",
      "lightning-storm": ""
    });
    buildWater(root);
    buildBoundary(root);
    refreshLocomotionColliders();
  }

  function buildTerrain(root) {
    for (let x = -HALF + TILE_SIZE / 2; x < HALF; x += TILE_SIZE) {
      for (let z = -HALF + TILE_SIZE / 2; z < HALF; z += TILE_SIZE) {
        const top = terrainHeight(x, z);
        const bottom = -2.2;
        const height = Math.max(0.35, top - bottom);
        const color = top > 2.2 ? C.grassLight : top > 1.1 ? C.grass : C.wetGrass;

        box(root, "rolling storm hill tile", [x, bottom + height / 2, z], [TILE_SIZE + 0.12, height, TILE_SIZE + 0.12], color);
      }
    }

    const paths = [
      [0, 0, 0, 9, 0.12, 58],
      [-24, 0, -12, 7, 0.12, 48],
      [24, 0, 10, 7, 0.12, 48],
      [0, 0, -25, 58, 0.12, 7],
      [0, 0, 26, 60, 0.12, 7]
    ];

    paths.forEach(function (p) {
      const y = terrainHeight(p[0], p[2]) + 0.08;
      box(root, "muddy rain path", [p[0], y, p[2]], [p[3], p[4], p[5]], C.mud);
    });
  }

  function buildTraversal(root) {
    const ridges = [
      [-35, -28, 6, 3.3, 8, 5],
      [-29, -22, 6, 4.2, 8, 5],
      [-23, -16, 6, 5.0, 8, 5],
      [26, -24, 7, 3.4, 8, 5],
      [31, -15, 7, 4.4, 8, 5],
      [34, -6, 7, 5.2, 8, 5],
      [-22, 24, 7, 3.5, 8, 5],
      [-15, 30, 7, 4.7, 8, 5],
      [-8, 35, 7, 5.7, 8, 5]
    ];

    ridges.forEach(function (r, i) {
      const top = terrainHeight(r[0], r[1]) + r[3] * 0.5;
      box(root, "climbable wet rock ridge", [r[0], top, r[1]], [r[2], r[3], r[4]], i % 2 ? C.rockLight : C.rock);
    });

    for (let i = 0; i < 18; i += 1) {
      const x = -38 + i * 4.4;
      const z = 38 - Math.abs(i - 9) * 1.8;
      const y = terrainHeight(x, z) + 0.45 + (i % 3) * 0.18;
      box(root, "wet stone launch pad", [x, y, z], [3.5, 0.9, 3], i % 2 ? C.rock : C.rockLight);
    }

    for (let i = 0; i < 12; i += 1) {
      const x = 35 - i * 5.5;
      const z = -36 + Math.sin(i) * 6;
      const y = terrainHeight(x, z) + 0.55;
      box(root, "low boulder shortcut", [x, y, z], [3.2, 1.1 + (i % 4) * 0.4, 2.8], i % 2 ? C.rockLight : C.rock);
    }

    box(root, "storm lookout slab", [0, terrainHeight(0, -34) + 3.2, -34], [18, 1, 9], C.rock);
    box(root, "storm lookout climb face", [0, terrainHeight(0, -29) + 2.1, -29], [17, 4.2, 1.2], C.rockLight);

    for (let i = 0; i < 7; i += 1) {
      box(root, "lookout hand ledge", [-7.5 + i * 2.5, terrainHeight(0, -29) + 0.9 + i * 0.42, -28.2], [1.7, 0.34, 1.2], C.rock);
    }
  }

  function buildGrass(root) {
    entity(root, "a-entity", {
      id: "reactive-grass",
      "reactive-grass-field": "count: 900; size: " + MAP_SIZE + "; seed: " + SEED
    });

    for (let i = 0; i < 70; i += 1) {
      const p = randomPoint(i * 13 + 8, HALF - 4);
      const y = terrainHeight(p[0], p[1]) + 0.35;
      box(root, "thick grass clump", [p[0], y, p[1]], [0.42, 0.7 + (i % 5) * 0.22, 0.42], i % 2 ? C.grassLight : C.grass, false);
    }
  }

  function buildStormSky(root) {
    for (let i = 0; i < 34; i += 1) {
      const p = randomPoint(i * 19 + 31, HALF + 12);
      const y = 19 + (i % 5) * 1.2;
      const scale = [8 + (i % 4) * 2, 1.6 + (i % 3) * 0.4, 5 + (i % 5)];

      entity(root, "a-sphere", {
        "data-name": "dark storm cloud",
        position: vector([p[0], y, p[1]]),
        scale: vector(scale),
        color: i % 3 ? C.cloud : C.cloudLight,
        opacity: "0.9",
        segmentsWidth: "12",
        segmentsHeight: "6"
      });
    }

    entity(root, "a-light", {
      id: "storm-flash",
      type: "point",
      intensity: "0",
      distance: "90",
      color: C.lightning,
      position: "0 18 0"
    });

    box(root, "visible lightning bolt", [0, 12, 0], [0.28, 18, 0.28], C.lightning, false).setAttribute("id", "lightning-bolt");
    document.getElementById("lightning-bolt").setAttribute("visible", "false");
  }

  function buildWater(root) {
    const puddles = [
      [-18, 12, 10, 5],
      [18, 22, 12, 6],
      [27, -30, 9, 5],
      [-31, -5, 11, 6],
      [4, -11, 12, 4]
    ];

    puddles.forEach(function (p) {
      box(root, "rain puddle", [p[0], terrainHeight(p[0], p[1]) + 0.12, p[1]], [p[2], 0.08, p[3]], C.puddle, false);
      box(root, "puddle stone rim", [p[0], terrainHeight(p[0], p[1]) + 0.32, p[1] - p[3] / 2], [p[2], 0.35, 0.45], C.rock);
      box(root, "puddle stone rim", [p[0], terrainHeight(p[0], p[1]) + 0.32, p[1] + p[3] / 2], [p[2], 0.35, 0.45], C.rock);
    });
  }

  function buildBoundary(root) {
    box(root, "north storm wall", [0, 3.6, -HALF - 1], [MAP_SIZE, 7.2, 2], C.rock);
    box(root, "south storm wall", [0, 3.6, HALF + 1], [MAP_SIZE, 7.2, 2], C.rock);
    box(root, "west storm wall", [-HALF - 1, 3.6, 0], [2, 7.2, MAP_SIZE], C.rock);
    box(root, "east storm wall", [HALF + 1, 3.6, 0], [2, 7.2, MAP_SIZE], C.rock);

    entity(root, "a-text", {
      value: "STORM PLAIN",
      position: "0 5.5 18",
      align: "center",
      width: "8",
      color: "#DDE8EF"
    });
  }

  function registerStormComponents() {
    AFRAME.registerComponent("storm-rain", {
      schema: {
        count: { default: 220 },
        radius: { default: 44 },
        height: { default: 26 }
      },

      init: function () {
        this.rig = document.getElementById("player-rig");
        this.drops = [];
        this.positions = new Float32Array(this.data.count * 6);
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute("position", new THREE.BufferAttribute(this.positions, 3));
        this.material = new THREE.LineBasicMaterial({
          color: C.rain,
          transparent: true,
          opacity: 0.58
        });
        this.lines = new THREE.LineSegments(this.geometry, this.material);
        this.el.object3D.add(this.lines);

        for (let i = 0; i < this.data.count; i += 1) {
          this.drops.push(this.makeDrop(i));
        }
      },

      tick: function (time, deltaMs) {
        const dt = Math.min(deltaMs / 1000, 0.05);
        const center = this.rig ? this.rig.object3D.position : { x: 0, y: 0, z: 0 };

        for (let i = 0; i < this.drops.length; i += 1) {
          const drop = this.drops[i];
          drop.y -= drop.speed * dt;
          drop.x += drop.windX * dt;
          drop.z += drop.windZ * dt;

          if (drop.y < center.y - 1 || Math.abs(drop.x - center.x) > this.data.radius || Math.abs(drop.z - center.z) > this.data.radius) {
            this.resetDrop(drop, i, center);
          }

          const o = i * 6;
          this.positions[o] = drop.x;
          this.positions[o + 1] = drop.y;
          this.positions[o + 2] = drop.z;
          this.positions[o + 3] = drop.x - 0.18;
          this.positions[o + 4] = drop.y + drop.length;
          this.positions[o + 5] = drop.z - 0.08;
        }

        this.geometry.attributes.position.needsUpdate = true;
      },

      makeDrop: function (i) {
        const drop = {};
        this.resetDrop(drop, i, { x: 0, y: 0, z: 0 });
        return drop;
      },

      resetDrop: function (drop, i, center) {
        const rnd = seeded(i * 977 + Math.floor(performance.now() * 0.01));
        drop.x = center.x + (rnd() - 0.5) * this.data.radius * 2;
        drop.z = center.z + (rnd() - 0.5) * this.data.radius * 2;
        drop.y = center.y + 6 + rnd() * this.data.height;
        drop.speed = 18 + rnd() * 12;
        drop.length = 0.7 + rnd() * 0.7;
        drop.windX = -2.1 - rnd() * 1.2;
        drop.windZ = -0.5 + rnd();
      }
    });

    AFRAME.registerComponent("lightning-storm", {
      init: function () {
        this.sky = document.querySelector("a-sky");
        this.flash = document.getElementById("storm-flash");
        this.bolt = document.getElementById("lightning-bolt");
        this.nextStrike = 1800;
        this.strikeEnd = 0;
        this.flashPower = 0;
      },

      tick: function (time) {
        if (time > this.nextStrike) {
          this.strike(time);
        }

        if (time < this.strikeEnd) {
          this.flashPower = 3.8;
        } else {
          this.flashPower *= 0.82;

          if (this.bolt) {
            this.bolt.setAttribute("visible", "false");
          }
        }

        if (this.flash) {
          this.flash.setAttribute("intensity", String(this.flashPower));
        }

        if (this.sky) {
          this.sky.setAttribute("color", this.flashPower > 0.7 ? "#6C7484" : "#171A20");
        }
      },

      strike: function (time) {
        const rnd = seeded(Math.floor(time));
        const x = (rnd() - 0.5) * 68;
        const z = (rnd() - 0.5) * 68;
        this.nextStrike = time + 3500 + rnd() * 6500;
        this.strikeEnd = time + 120 + rnd() * 120;

        if (this.flash) {
          this.flash.setAttribute("position", vector([x, 18, z]));
        }

        if (this.bolt) {
          this.bolt.setAttribute("position", vector([x, 10.5, z]));
          this.bolt.setAttribute("height", String(18 + rnd() * 8));
          this.bolt.setAttribute("visible", "true");
        }
      }
    });

    AFRAME.registerComponent("reactive-grass-field", {
      schema: {
        count: { default: 700 },
        size: { default: 90 },
        seed: { default: 1 }
      },

      init: function () {
        this.rig = document.getElementById("player-rig");
        this.left = document.getElementById("left-hand");
        this.right = document.getElementById("right-hand");
        this.items = [];
        this.matrix = new THREE.Matrix4();
        this.position = new THREE.Vector3();
        this.scale = new THREE.Vector3();
        this.quaternion = new THREE.Quaternion();
        this.euler = new THREE.Euler();
        this.tmp = new THREE.Vector3();

        const geometry = new THREE.PlaneGeometry(0.12, 1);
        geometry.translate(0, 0.5, 0);
        const material = new THREE.MeshStandardMaterial({
          color: C.grassLight,
          roughness: 1,
          metalness: 0,
          side: THREE.DoubleSide
        });

        this.mesh = new THREE.InstancedMesh(geometry, material, this.data.count);
        this.mesh.frustumCulled = false;
        this.el.object3D.add(this.mesh);

        const rnd = seeded(this.data.seed);
        for (let i = 0; i < this.data.count; i += 1) {
          const x = (rnd() - 0.5) * this.data.size;
          const z = (rnd() - 0.5) * this.data.size;
          this.items.push({
            x: x,
            z: z,
            y: terrainHeight(x, z) + 0.04,
            h: 0.45 + rnd() * 1.3,
            w: 0.55 + rnd() * 0.9,
            phase: rnd() * Math.PI * 2
          });
        }
      },

      tick: function (time) {
        const hands = [];

        if (this.rig) {
          hands.push(this.rig.object3D.position);
        }

        if (this.left) {
          this.left.object3D.getWorldPosition(this.tmp);
          hands.push(this.tmp.clone());
        }

        if (this.right) {
          this.right.object3D.getWorldPosition(this.tmp);
          hands.push(this.tmp.clone());
        }

        for (let i = 0; i < this.items.length; i += 1) {
          const blade = this.items[i];
          let bendX = Math.sin(time * 0.0025 + blade.phase) * 0.16;
          let bendZ = Math.cos(time * 0.002 + blade.phase) * 0.12;

          hands.forEach(function (hand) {
            const dx = blade.x - hand.x;
            const dz = blade.z - hand.z;
            const d = Math.hypot(dx, dz);

            if (d < 2.4) {
              const force = (2.4 - d) / 2.4;
              bendX += (dx / Math.max(d, 0.1)) * force * 0.85;
              bendZ += (dz / Math.max(d, 0.1)) * force * 0.85;
            }
          });

          this.position.set(blade.x, blade.y, blade.z);
          this.scale.set(blade.w, blade.h, blade.w);
          this.euler.set(bendZ, blade.phase, -bendX);
          this.quaternion.setFromEuler(this.euler);
          this.matrix.compose(this.position, this.quaternion, this.scale);
          this.mesh.setMatrixAt(i, this.matrix);
        }

        this.mesh.instanceMatrix.needsUpdate = true;
      }
    });
  }

  function terrainHeight(x, z) {
    const spawnFlat = 1 - clamp(Math.hypot(x, z - 18) / 12, 0, 1);
    let h = 0.45 * Math.sin(x * 0.14) + 0.62 * Math.cos(z * 0.12) + 0.38 * Math.sin((x + z) * 0.08);
    h += valueNoise(x * 0.075, z * 0.075) * 0.72;

    h += hill(x, z, -28, -24, 16) * 2.8;
    h += hill(x, z, 24, -20, 18) * 2.5;
    h += hill(x, z, -17, 25, 14) * 3.1;
    h += hill(x, z, 27, 25, 16) * 2.1;
    h += hill(x, z, 0, -34, 12) * 2.4;
    h -= hill(x, z, 2, 10, 18) * 0.65;

    h = Math.max(0, h + 0.2);
    return h * (1 - spawnFlat);
  }

  function hill(x, z, cx, cz, radius) {
    const distSq = Math.pow(x - cx, 2) + Math.pow(z - cz, 2);
    return Math.exp(-distSq / (radius * radius));
  }

  function valueNoise(x, z) {
    const x0 = Math.floor(x);
    const z0 = Math.floor(z);
    const tx = smoothstep(x - x0);
    const tz = smoothstep(z - z0);
    const a = hashNoise(x0, z0);
    const b = hashNoise(x0 + 1, z0);
    const c = hashNoise(x0, z0 + 1);
    const d = hashNoise(x0 + 1, z0 + 1);

    return lerp(lerp(a, b, tx), lerp(c, d, tx), tz) * 2 - 1;
  }

  function hashNoise(x, z) {
    let n = (x * 374761393 + z * 668265263 + SEED * 1442695041) >>> 0;
    n = (n ^ (n >>> 13)) >>> 0;
    n = Math.imul(n, 1274126177) >>> 0;
    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
  }

  function smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
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

  function entity(root, tagName, attrs) {
    const node = document.createElement(tagName);
    Object.keys(attrs).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    root.appendChild(node);
    return node;
  }

  function randomPoint(seed, radius) {
    const rnd = seeded(seed);
    return [(rnd() - 0.5) * radius * 2, (rnd() - 0.5) * radius * 2];
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

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function refreshLocomotionColliders() {
    const rig = document.getElementById("player-rig");
    const component = rig && rig.components && rig.components["gorilla-locomotion"];

    if (component && component.el && component.el.sceneEl) {
      component.colliders = Array.from(component.el.sceneEl.querySelectorAll("[locomotion-collider]"));
    }
  }
})();
