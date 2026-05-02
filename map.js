(function () {
  const C = {
    ground: "#3F7D3D",
    moss: "#5D9B45",
    mud: "#6D4F2F",
    path: "#8A6A3F",
    bark: "#684127",
    bark2: "#875733",
    barkDark: "#3D271A",
    leaf: "#1F6B36",
    leaf2: "#2E8B45",
    leaf3: "#55B65F",
    vine: "#2E6F3E",
    rope: "#7B5B35",
    plank: "#A07945",
    rock: "#5E6865",
    rock2: "#7E8983",
    cave: "#2D332F",
    water: "#2AA7B8",
    water2: "#86E0EA",
    flower1: "#E85050",
    flower2: "#F38BB9",
    flower3: "#F6D35D",
    flower4: "#75A9FF"
  };

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    const root = document.getElementById("rainforest-map");
    if (!root) return;
    terrain(root);
    trees(root);
    canopy(root);
    caves(root);
    water(root);
    routes(root);
    secrets(root);
    details(root);
    labels(root);
  }

  function terrain(root) {
    plane(root, "rainforest floor", [0, 0, 0], 100, 100, C.ground);
    b(root, "north muddy loop", [0, 0.07, -24], [44, 0.14, 4.2], C.path);
    b(root, "center muddy trail", [0, 0.08, 0], [7, 0.16, 54], C.path);
    b(root, "south muddy loop", [0, 0.07, 24], [48, 0.14, 4.2], C.path);
    b(root, "west root trail", [-24, 0.08, 0], [4.5, 0.16, 44], C.mud);
    b(root, "east ridge trail", [24, 0.08, 0], [4.5, 0.16, 44], C.mud);
    b(root, "main clearing", [0, 0.12, 3], [20, 0.24, 17], "#4D9149");
    b(root, "fern clearing", [-26, 0.12, -24], [18, 0.24, 15], "#477C3A");
    b(root, "waterfall clearing", [29, 0.12, 28], [22, 0.24, 18], "#3C7B42");
    b(root, "north cliff", [0, 2.2, -48], [96, 4.4, 2.2], C.rock);
    b(root, "south cliff", [0, 2.2, 48], [96, 4.4, 2.2], C.rock);
    b(root, "west cliff", [-48, 2.2, 0], [2.2, 4.4, 96], C.rock);
    b(root, "east cliff", [48, 2.2, 0], [2.2, 4.4, 96], C.rock);
    for (let x = -36; x <= 36; x += 12) {
      b(root, "border moss shelf", [x, 4.2, -46], [6, 0.5, 2], C.moss);
      b(root, "border moss shelf", [x + 4, 3.7, 46], [6, 0.5, 2], C.moss);
    }
  }

  function trees(root) {
    const spots = [
      [-34,-34,1.8,13,1],[-18,-35,1.2,9,0],[-5,-36,1.5,11,1],[13,-34,1.1,8,0],[31,-32,1.7,12,1],
      [-40,-17,1.4,10,1],[-22,-15,1.1,8,0],[-8,-18,1.8,13,1],[8,-19,1.25,9,0],[22,-17,1.55,11,1],[38,-16,1.2,9,0],
      [-35,2,1.3,9,0],[-18,4,2.0,14,1],[16,2,1.9,13,1],[34,4,1.25,9,0],
      [-38,19,1.45,10,1],[-23,22,1.15,8,0],[-6,21,1.55,11,1],[11,22,1.2,9,0],[27,20,1.85,13,1],
      [-31,36,1.6,11,1],[-11,35,1.1,8,0],[9,36,1.45,10,1],[30,35,1.35,10,0]
    ];
    spots.forEach((t, i) => tree(root, "tree " + i, t[0], t[1], t[2], t[3], t[4]));
    for (let i = 0; i < 24; i++) {
      const x = Math.round(Math.sin(i * 2.13) * 38);
      const z = Math.round(Math.cos(i * 1.67) * 38);
      cyl(root, "thin climbable sapling", [x, 2.4, z], 0.28, 4.8, i % 2 ? C.bark2 : C.bark);
      leaves(root, [x, 5.4, z], 2.4, i);
    }
  }

  function tree(root, name, x, z, r, h, platformed) {
    const trunk = r > 1.5 ? C.barkDark : C.bark;
    cyl(root, name + " trunk", [x, h / 2, z], r, h, trunk);
    for (let i = 0; i < 4; i++) {
      const dx = Math.cos(i * Math.PI / 2) * (r + 1);
      const dz = Math.sin(i * Math.PI / 2) * (r + 1);
      b(root, name + " buttress root", [x + dx * 0.55, 0.45, z + dz * 0.55], [r * 2.2, 0.9, 0.85], trunk);
    }
    for (let i = 0; i < 6; i++) {
      b(root, name + " climb knot", [x + (i % 2 ? -r : r) * 0.75, 1 + i * 1.05, z + r], [r * 1.3, 0.34, 0.6], C.bark2);
    }
    leaves(root, [x, h + 0.8, z], r * 3.3, h);
    leaves(root, [x - r * 1.4, h - 0.8, z + r], r * 2.1, h + 1);
    leaves(root, [x + r * 1.3, h - 1.1, z - r], r * 2.0, h + 2);
    if (platformed) {
      const y = Math.max(4.4, h * 0.58);
      platform(root, name + " tree platform", [x, y, z], [r * 4.8, 0.42, r * 4.8]);
      b(root, name + " north rope rail", [x, y + 0.75, z - r * 2.55], [r * 4.8, 1.5, 0.28], C.rope);
      b(root, name + " south rope rail", [x, y + 0.75, z + r * 2.55], [r * 4.8, 1.5, 0.28], C.rope);
      b(root, name + " west rope rail", [x - r * 2.55, y + 0.75, z], [0.28, 1.5, r * 4.8], C.rope);
      b(root, name + " east rope rail", [x + r * 2.55, y + 0.75, z], [0.28, 1.5, r * 4.8], C.rope);
    }
  }

  function canopy(root) {
    platform(root, "central great tree platform", [-18, 8.2, 4], [9, 0.45, 7]);
    platform(root, "east lookout platform", [16, 7.4, 2], [8, 0.45, 6]);
    platform(root, "north canopy nest", [-8, 8.8, -18], [7, 0.45, 6]);
    platform(root, "waterfall canopy perch", [27, 9.0, 20], [8, 0.45, 6]);
    platform(root, "south canopy perch", [-6, 6.7, 22], [7, 0.45, 6]);
    bridge(root, "central east rope bridge", [-1, 8.0, 3], [26, 0.32, 2.1], "x");
    bridge(root, "central north rope bridge", [-13, 8.8, -7], [2.1, 0.32, 24], "z");
    bridge(root, "east waterfall rope bridge", [22, 8.4, 11], [2.1, 0.32, 19], "z");
    bridge(root, "south center rope bridge", [-12, 7.4, 13], [2.1, 0.32, 19], "z");
    b(root, "skilled narrow canopy beam", [5, 10.8, 11.5], [26, 0.3, 0.55], C.plank);
    b(root, "cliff top speed beam", [35.5, 8.8, -8], [0.6, 0.35, 23], C.plank);
    [[-28,4.2,-12],[-24,5.1,-7],[-20,6.2,-2],[-14,7.1,2],[7,3.3,-10],[11,4.6,-6],[15,5.9,-2],[18,6.8,2],[3,3.2,18],[-1,4.5,20],[-5,5.7,22]].forEach((p, i) => {
      b(root, "canopy parkour pad", p, [3.2, 0.42, 2.6], i % 2 ? C.bark2 : C.moss);
    });
  }

  function caves(root) {
    b(root, "east cliff lower face", [39, 2.3, 5], [9, 4.6, 39], C.rock);
    b(root, "east cliff upper face", [42, 5.9, 10], [5, 4.2, 29], C.rock2);
    b(root, "east cliff top path", [38, 8.1, 8], [13, 0.5, 32], C.moss);
    room(root, "east cave", [34, 7], [12, 9], 2.9);
    for (let i = 0; i < 8; i++) b(root, "east cliff climb shelf", [33.8, 1 + i * 0.85, -8 + i * 3], [2.8, 0.34, 1.7], i % 2 ? C.moss : C.rock2);
    room(root, "west hidden cave", [-34, -21], [13, 11], 3.2);
    b(root, "west cave upper ledge", [-31, 3.65, -16.8], [7, 0.45, 2.2], C.rock2);
    for (let i = 0; i < 5; i++) b(root, "cave climb rib", [-38 + i * 2.4, 1 + i * 0.65, -16.2], [1.8, 0.35, 2.2], C.rock2);
    rocks(root, -12, -30, 5);
    rocks(root, 23, -30, 4);
    rocks(root, -32, 19, 5);
  }

  function water(root) {
    pond(root, "north pond", [18, -27], [14, 8]);
    b(root, "central stream water", [8, 0.06, -9], [4.4, 0.07, 24], C.water2, false);
    b(root, "central stream west bank", [5.4, 0.35, -9], [1, 0.7, 24], C.moss);
    b(root, "central stream east bank", [10.6, 0.35, -9], [1, 0.7, 24], C.moss);
    [[8,-17],[7.3,-10],[8.6,-3]].forEach((p, i) => b(root, "stream stepping stone", [p[0], 0.45 + i * 0.18, p[1]], [2.4, 0.45, 1.4], i % 2 ? C.rock : C.rock2));
    b(root, "waterfall basin water", [29, 0.08, 31], [16, 0.08, 10], C.water, false);
    b(root, "waterfall rock back", [29, 4.2, 38.5], [18, 8.4, 2], C.rock);
    b(root, "waterfall sheet", [29, 3.4, 37.3], [10, 6.4, 0.18], C.water2, false);
    b(root, "waterfall left climb wall", [20, 2.5, 34], [1.4, 5, 8], C.rock2);
    b(root, "waterfall right climb wall", [38, 2.5, 34], [1.4, 5, 8], C.rock2);
    b(root, "waterfall ledge shortcut", [29, 5.9, 35.8], [13, 0.5, 2], C.moss);
    for (let i = 0; i < 5; i++) b(root, "waterfall side hand ledge", [22 + i * 3.3, 1 + i * 0.85, 33.7], [2.2, 0.34, 1.5], C.rock2);
  }

  function routes(root) {
    b(root, "fallen log west shortcut", [-21, 0.85, -5], [13, 1.25, 1.25], C.bark2);
    b(root, "fallen log stream crossing", [7.8, 1, -22], [1.3, 1.3, 11], C.bark);
    b(root, "fallen log south launch", [12, 1, 19], [14, 1.3, 1.3], C.bark2);
    b(root, "fallen log cave exit", [-34, 1, -12], [12, 1.2, 1.2], C.bark);
    for (let i = 0; i < 8; i++) {
      b(root, "great root climb west", [-24 + i * 1.25, 0.35 + i * 0.38, 5 + i * 0.4], [2.1, 0.32, 1.4], C.bark);
      b(root, "great root climb east", [12 + i * 1.15, 0.35 + i * 0.42, 2 - i * 0.35], [2, 0.32, 1.4], C.bark2);
    }
    b(root, "vine corridor floor", [-20, 0.15, -13], [15, 0.3, 3], C.mud);
    b(root, "vine corridor left wall", [-20, 1.8, -15], [15, 3.6, 0.55], C.vine);
    b(root, "vine corridor right wall", [-20, 1.8, -11], [15, 3.6, 0.55], C.vine);
    for (let i = 0; i < 9; i++) {
      const a = i * Math.PI * 2 / 9;
      b(root, "clearing launch stump", [Math.cos(a) * 7, 0.75, 3 + Math.sin(a) * 6], [2, 1.5, 2], i % 2 ? C.bark : C.rock2);
    }
  }

  function secrets(root) {
    room(root, "secret waterfall tunnel", [29, 40.5], [10, 5], 3.8);
    b(root, "secret waterfall upper exit", [34.5, 4.4, 38.8], [3, 0.5, 3], C.moss);
    room(root, "hollow tree room", [-18, 4], [6, 5], 3.8);
    b(root, "hollow tree escape ledge", [-15, 3.9, 6.8], [3.2, 0.4, 2], C.bark2);
    room(root, "root tunnel", [-26, -6], [4.5, 15], 3.1);
    for (let i = 0; i < 6; i++) b(root, "secret tree ladder nub", [-20.8, 1.2 + i, 6.7], [1.4, 0.3, 0.55], C.bark2);
  }

  function details(root) {
    for (let i = 0; i < 60; i++) {
      const x = Math.sin(i * 2.31) * 43 + Math.cos(i) * 2;
      const z = Math.cos(i * 1.83) * 43 + Math.sin(i * 0.7) * 2;
      b(root, "tall grass", [x, 0.55, z], [0.18, 1.1 + (i % 4) * 0.15, 0.18], i % 2 ? C.leaf2 : C.leaf3, false);
    }
    for (let i = 0; i < 28; i++) {
      const x = Math.sin(i * 1.77) * 38;
      const z = Math.cos(i * 2.19) * 38;
      b(root, "bush", [x, 0.7, z], [2.2, 1.4, 2], [C.leaf, C.leaf2, C.moss][i % 3], false);
    }
    for (let i = 0; i < 36; i++) {
      const x = Math.sin(i * 2.7) * 41;
      const z = Math.cos(i * 1.9) * 41;
      b(root, "flower stem", [x, 0.35, z], [0.08, 0.7, 0.08], C.vine, false);
      b(root, "flower head", [x, 0.78, z], [0.38, 0.2, 0.38], [C.flower1, C.flower2, C.flower3, C.flower4][i % 4], false);
    }
  }

  function labels(root) {
    text(root, "RAINFOREST", [0, 4.1, 27], 8);
    text(root, "CANOPY ROUTES", [-4, 10.2, 3], 4.5);
    text(root, "CAVES", [-34, 4.4, -21], 4.2);
    text(root, "WATERFALL", [29, 7.9, 34], 4.2);
  }

  function platform(root, name, pos, size) {
    b(root, name, pos, size, C.plank);
    b(root, name + " underside root", [pos[0], pos[1] - 0.35, pos[2]], [size[0] * 0.75, 0.25, size[2] * 0.28], C.barkDark);
    b(root, name + " cross root", [pos[0], pos[1] - 0.32, pos[2]], [size[0] * 0.28, 0.25, size[2] * 0.75], C.barkDark);
  }

  function bridge(root, name, pos, size, axis) {
    b(root, name + " deck", pos, size, C.plank);
    const n = axis === "x" ? Math.floor(size[0] / 2.4) : Math.floor(size[2] / 2.4);
    for (let i = 0; i <= n; i++) {
      const o = -n * 1.2 + i * 2.4;
      axis === "x"
        ? b(root, name + " plank", [pos[0] + o, pos[1] + 0.12, pos[2]], [1.1, 0.18, size[2] + 0.35], i % 2 ? C.plank : C.bark2)
        : b(root, name + " plank", [pos[0], pos[1] + 0.12, pos[2] + o], [size[0] + 0.35, 0.18, 1.1], i % 2 ? C.plank : C.bark2);
    }
    axis === "x"
      ? (b(root, name + " vine rail left", [pos[0], pos[1] + 1.2, pos[2] - 1.35], [size[0], 0.28, 0.28], C.vine), b(root, name + " vine rail right", [pos[0], pos[1] + 1.2, pos[2] + 1.35], [size[0], 0.28, 0.28], C.vine))
      : (b(root, name + " vine rail left", [pos[0] - 1.35, pos[1] + 1.2, pos[2]], [0.28, 0.28, size[2]], C.vine), b(root, name + " vine rail right", [pos[0] + 1.35, pos[1] + 1.2, pos[2]], [0.28, 0.28, size[2]], C.vine));
  }

  function room(root, name, center, size, high) {
    const x = center[0], z = center[1], w = size[0], d = size[1];
    b(root, name + " floor", [x, 0.28, z], [w, 0.55, d], C.cave);
    b(root, name + " ceiling", [x, high, z], [w, 0.55, d], "#3C4540");
    b(root, name + " north wall", [x, high / 2, z - d / 2], [w, high, 0.55], "#3C4540");
    b(root, name + " south wall", [x, high / 2, z + d / 2], [w, high, 0.55], "#3C4540");
    b(root, name + " west wall", [x - w / 2, high / 2, z], [0.55, high, d], "#3C4540");
  }

  function pond(root, name, center, size) {
    const x = center[0], z = center[1], w = size[0], d = size[1];
    b(root, name + " water", [x, 0.08, z], [w, 0.08, d], C.water, false);
    b(root, name + " north rim", [x, 0.45, z - d / 2 - 0.45], [w + 1, 0.9, 0.7], C.rock2);
    b(root, name + " south rim", [x, 0.45, z + d / 2 + 0.45], [w + 1, 0.9, 0.7], C.rock2);
    b(root, name + " west rim", [x - w / 2 - 0.45, 0.45, z], [0.7, 0.9, d + 1], C.rock2);
    b(root, name + " east rim", [x + w / 2 + 0.45, 0.45, z], [0.7, 0.9, d + 1], C.rock2);
  }

  function rocks(root, x, z, count) {
    for (let i = 0; i < count; i++) b(root, "climbable boulder", [x + i * 1.9, 0.65 + i * 0.35, z + (i % 2) * 1.4], [2.7, 1.3 + i * 0.35, 2.4], i % 2 ? C.rock2 : C.rock);
  }

  function leaves(root, pos, size, seed) {
    const color = [C.leaf, C.leaf2, C.leaf3][seed % 3];
    b(root, "leaf cluster", pos, [size, size * 0.75, size], color, false);
    b(root, "leaf cluster spread", [pos[0] + size * 0.35, pos[1] - size * 0.1, pos[2] - size * 0.25], [size * 0.85, size * 0.55, size * 0.85], color, false);
    b(root, "leaf cluster spread", [pos[0] - size * 0.3, pos[1] - size * 0.2, pos[2] + size * 0.3], [size * 0.75, size * 0.5, size * 0.75], color, false);
  }

  function cyl(root, name, pos, radius, depth, color) {
    el(root, "a-cylinder", {
      "data-name": name,
      position: arr(pos),
      radius: String(radius),
      depth: String(depth),
      segments: "10",
      color,
      roughness: "1",
      "locomotion-collider": "type: box; size: " + [radius * 2, depth, radius * 2].join(" ")
    });
  }

  function plane(root, name, pos, width, height, color) {
    el(root, "a-plane", {
      "data-name": name,
      position: arr(pos),
      rotation: "-90 0 0",
      width: String(width),
      height: String(height),
      color,
      roughness: "1",
      "locomotion-collider": "type: box; size: " + [width, 0.08, height].join(" ")
    });
  }

  function b(root, name, pos, size, color, solid) {
    const attrs = {
      "data-name": name,
      position: arr(pos),
      width: String(size[0]),
      height: String(size[1]),
      depth: String(size[2]),
      color,
      roughness: "1"
    };
    if (solid !== false) attrs["locomotion-collider"] = "type: box; size: " + size.join(" ");
    return el(root, "a-box", attrs);
  }

  function text(root, value, pos, width) {
    el(root, "a-text", { value, position: arr(pos), align: "center", width: String(width), color: "#E8FFD9" });
  }

  function el(root, tag, attrs) {
    const node = document.createElement(tag);
    Object.keys(attrs).forEach((key) => node.setAttribute(key, attrs[key]));
    root.appendChild(node);
    return node;
  }

  function arr(values) {
    return values.map((v) => Number(v.toFixed ? v.toFixed(3) : v)).join(" ");
  }
})();
