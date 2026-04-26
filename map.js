(function () {
  const COLORS = {
    grass: "#5FAE65",
    path: "#D5C9B6",
    hotelWhite: "#F4F4EE",
    hotelTrim: "#58A7B8",
    glass: "#9FE8FF",
    shadow: "#2B3A45",
    water: "#1BA9E8",
    deepWater: "#0876B6",
    river: "#42C7EF",
    slideBlue: "#239BE6",
    slideYellow: "#F5C84B",
    slideOrange: "#F28749",
    slidePink: "#E35D6A",
    lounge: "#7D5C9E",
    locker: "#A8DADC",
    bar: "#7B4F32",
    palm: "#26965C",
    trunk: "#8A5B33",
    fence: "#A97952",
    secret: "#273044",
    roof: "#314A5A",
    vent: "#7F8C96"
  };

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

  function initialize() {
    const root = document.getElementById("water-park-map");

    if (!root) {
      return;
    }

    buildResort(root);
  }

  function buildResort(root) {
    ground(root);
    hotel(root);
    indoorAreas(root);
    outdoorWaterPark(root);
    slides(root);
    lazyRiver(root);
    rooftopRoutes(root);
    resortDetails(root);
    secretsAndShortcuts(root);
    labels(root);
  }

  function ground(root) {
    el(root, "a-plane", {
      position: "0 0 0",
      rotation: "-90 0 0",
      width: "96",
      height: "96",
      color: COLORS.grass,
      "locomotion-collider": "type: floor; size: 96 0 96"
    });

    box(root, "front plaza", [0, 0.03, 16], [28, 0.08, 12], COLORS.path);
    box(root, "pool deck", [15, 0.04, -10], [45, 0.08, 42], "#E8DCC9");
    box(root, "hotel apron", [-18, 0.04, 2], [34, 0.08, 34], "#CED8D6");

    for (let z = -28; z <= 27; z += 8) {
      box(root, "resort path tile", [0, 0.08, z], [3.2, 0.05, 3.2], z % 16 === 0 ? "#E9DEC9" : "#CBBBA3", false);
    }

    box(root, "perimeter wall north", [0, 1, -43], [86, 2, 0.7], COLORS.fence);
    box(root, "perimeter wall south", [0, 1, 43], [86, 2, 0.7], COLORS.fence);
    box(root, "perimeter wall west", [-43, 1, 0], [0.7, 2, 86], COLORS.fence);
    box(root, "perimeter wall east", [43, 1, 0], [0.7, 2, 86], COLORS.fence);
  }

  function hotel(root) {
    const hotel = group(root, "hotel");

    // Main hotel mass and traversable floor slabs.
    box(hotel, "hotel lobby floor", [-20, 0.06, 11], [24, 0.12, 18], "#DAD5C9");
    box(hotel, "hotel second floor", [-20, 2.45, 11], [24, 0.16, 18], "#CCC8BC");
    box(hotel, "hotel third floor", [-20, 4.85, 11], [24, 0.16, 18], "#C4C1B6");
    box(hotel, "hotel roof", [-20, 7.25, 11], [25, 0.18, 19], COLORS.roof);

    // Exterior walls with openings for lobby, corridors, and secret paths.
    box(hotel, "hotel rear wall", [-20, 3.7, 2], [24, 7.4, 0.55], COLORS.hotelWhite);
    box(hotel, "hotel left wall", [-32, 3.7, 11], [0.55, 7.4, 18], COLORS.hotelWhite);
    box(hotel, "hotel right wall", [-8, 3.7, 11], [0.55, 7.4, 18], COLORS.hotelWhite);
    box(hotel, "hotel front wall left", [-27.5, 3.7, 20], [9, 7.4, 0.55], COLORS.hotelWhite);
    box(hotel, "hotel front wall right", [-12.5, 3.7, 20], [9, 7.4, 0.55], COLORS.hotelWhite);
    box(hotel, "front lintel above lobby doors", [-20, 5.7, 20], [6, 3.4, 0.55], COLORS.hotelWhite);

    // Distinct tiled facade bands.
    for (let y = 1.2; y <= 6.2; y += 1.2) {
      box(hotel, "hotel aqua trim front", [-20, y, 20.33], [24.5, 0.12, 0.16], COLORS.hotelTrim, false);
      box(hotel, "hotel aqua trim rear", [-20, y, 1.67], [24.5, 0.12, 0.16], COLORS.hotelTrim, false);
    }

    // Lobby counter, hall loops, and room partitions.
    box(hotel, "front counter", [-20, 0.65, 16.1], [7, 1.3, 0.8], COLORS.bar);
    box(hotel, "lobby back counter wall", [-20, 1.4, 14.8], [8, 2.8, 0.4], "#E6E1D5");
    box(hotel, "lobby left column", [-28.5, 1.7, 17.2], [1.2, 3.4, 1.2], COLORS.hotelTrim);
    box(hotel, "lobby right column", [-11.5, 1.7, 17.2], [1.2, 3.4, 1.2], COLORS.hotelTrim);

    for (let floor = 0; floor < 3; floor += 1) {
      const y = floor * 2.4 + 1.2;
      box(hotel, "central hallway west rail", [-25.9, y, 11], [0.35, 1.6, 13], "#E7E2D9");
      box(hotel, "central hallway east rail", [-14.1, y, 11], [0.35, 1.6, 13], "#E7E2D9");

      for (let z = 4.8; z <= 17.2; z += 4.2) {
        box(hotel, "hotel room west wall", [-30.1, y, z], [3.5, 1.8, 0.28], "#BFD7EA");
        box(hotel, "hotel room east wall", [-9.9, y, z], [3.5, 1.8, 0.28], "#F2C6AC");
        box(hotel, "hotel room bed west", [-29.6, floor * 2.4 + 0.42, z + 1.35], [2, 0.55, 1.25], "#7698B3");
        box(hotel, "hotel room bed east", [-10.4, floor * 2.4 + 0.42, z + 1.35], [2, 0.55, 1.25], "#D28D78");
      }
    }

    // Balconies, ledges, and climbable trim.
    for (let floor = 1; floor <= 3; floor += 1) {
      const y = floor * 2.4 + 0.05;
      box(hotel, "front balcony deck", [-20, y, 22.3], [21, 0.18, 3], "#DFD6C7");
      box(hotel, "front balcony rail", [-20, y + 0.55, 23.7], [21, 1.1, 0.25], COLORS.hotelTrim);
      box(hotel, "front balcony left rail", [-30.4, y + 0.55, 22.3], [0.25, 1.1, 3], COLORS.hotelTrim);
      box(hotel, "front balcony right rail", [-9.6, y + 0.55, 22.3], [0.25, 1.1, 3], COLORS.hotelTrim);

      for (let x = -29; x <= -11; x += 4) {
        box(hotel, "balcony climb post", [x, y + 0.9, 23.7], [0.35, 1.8, 0.35], COLORS.hotelTrim);
      }
    }

    // Vertical exterior route up the building.
    for (let y = 0.8; y <= 6.4; y += 1.05) {
      box(hotel, "hotel ladder nub", [-7.65, y, 7.5], [0.45, 0.25, 2.4], COLORS.slideOrange);
    }
  }

  function indoorAreas(root) {
    const indoor = group(root, "indoor resort areas");

    // Indoor bar/lounge with purple carpet texture and alternate exits.
    box(indoor, "indoor lounge floor", [-19, 0.07, -6], [18, 0.14, 12], "#6A5D7B");
    box(indoor, "lounge north wall", [-19, 1.55, -12], [18, 3.1, 0.45], COLORS.lounge);
    box(indoor, "lounge west wall", [-28, 1.55, -6], [0.45, 3.1, 12], COLORS.lounge);
    box(indoor, "lounge east half wall", [-10, 1.0, -8.5], [0.45, 2, 7], COLORS.lounge);
    box(indoor, "indoor bar counter", [-22.5, 0.68, -9.8], [7.5, 1.35, 0.8], COLORS.bar);
    box(indoor, "bar shelf climb wall", [-25.9, 1.6, -11.5], [3.6, 3.2, 0.35], "#4B2F23");
    box(indoor, "lounge stage ledge", [-13.6, 0.45, -10.6], [5.6, 0.9, 2.1], "#8A6DAD");

    for (let x = -26; x <= -12; x += 3.5) {
      box(indoor, "lounge carpet stripe", [x, 0.17, -6], [1.4, 0.05, 11.2], "#7A6A91", false);
    }

    // Locker and changing rooms with tile patterns and loop-through exits.
    box(indoor, "locker room floor", [-35, 0.07, -6], [12, 0.14, 13], "#BCE7E8");
    box(indoor, "locker room rear wall", [-35, 1.55, -12.5], [12, 3.1, 0.45], COLORS.locker);
    box(indoor, "locker room left wall", [-41, 1.55, -6], [0.45, 3.1, 13], COLORS.locker);
    box(indoor, "locker room divider", [-35, 1.2, -5.2], [10, 2.4, 0.3], "#8CCFD1");
    box(indoor, "changing stall bank", [-38.6, 1, -9.2], [0.7, 2, 5.6], "#6FB7BF");
    box(indoor, "locker bank climb wall", [-31.5, 1.35, -8.4], [0.8, 2.7, 6.5], "#4FA7B0");

    for (let x = -39.5; x <= -30.5; x += 2) {
      for (let z = -11; z <= -1; z += 2) {
        box(indoor, "locker tile", [x, 0.17, z], [0.9, 0.04, 0.9], (x + z) % 4 === 0 ? "#D7F7F8" : "#A4D9DA", false);
      }
    }

    // Fast connecting corridors around the interior loop.
    box(indoor, "hotel lounge connector", [-27.5, 0.55, 1], [1.7, 1.1, 7.4], "#D8D0C4");
    box(indoor, "locker service connector", [-33.2, 0.55, 1], [1.7, 1.1, 7.4], "#A7D6D8");
    box(indoor, "tight back corridor floor", [-29, 0.07, -15.5], [18, 0.14, 2.5], "#4A5362");
    box(indoor, "tight corridor rear wall", [-29, 1.4, -16.8], [18, 2.8, 0.4], COLORS.secret);
    box(indoor, "tight corridor front wall", [-29, 1.4, -14.2], [18, 2.8, 0.4], COLORS.secret);
  }

  function outdoorWaterPark(root) {
    const park = group(root, "outdoor water park");

    // Pools: different water colors show depth while surrounding ledges stay push-friendly.
    pool(park, "shallow splash pool", [8, -3], [12, 9], COLORS.water, "#7EDAF7");
    pool(park, "deep launch pool", [22, -4], [14, 12], COLORS.deepWater, "#0A5F99");
    pool(park, "hotel quiet pool", [-1, 1], [10, 8], "#35BFEA", "#9AE6FF");

    box(park, "pool divider ledge", [15, 0.28, -4], [1.1, 0.56, 12], "#EFE2CE");
    box(park, "poolside launch block", [27.5, 1.1, -11.5], [4, 2.2, 2.3], COLORS.slidePink);
    box(park, "shallow pool island", [8, 0.55, -3], [2.5, 1.1, 2.5], "#F7E6B8");
    box(park, "deep pool island", [22, 0.95, -4], [3.5, 1.9, 3.5], COLORS.hotelTrim);

    // Poolside bar.
    box(park, "pool bar deck", [31, 0.08, 6], [12, 0.16, 8], "#D0AA78");
    box(park, "pool bar counter", [31, 0.72, 3.1], [8.5, 1.45, 0.85], COLORS.bar);
    box(park, "pool bar roof", [31, 2.65, 6], [10, 0.35, 7], "#D48A4D");
    box(park, "pool bar left post", [26.4, 1.45, 3], [0.45, 2.9, 0.45], COLORS.trunk);
    box(park, "pool bar right post", [35.6, 1.45, 3], [0.45, 2.9, 0.45], COLORS.trunk);
    box(park, "pool bar rear climb wall", [31, 1.3, 9.6], [9.8, 2.6, 0.4], "#A66B3F");

    // Seating areas and launch benches.
    for (let x = 2; x <= 35; x += 8) {
      box(park, "pool chair base", [x, 0.23, 12.5], [3.4, 0.45, 1], "#F7F1E3");
      box(park, "pool chair back", [x, 0.72, 13.1], [3.4, 1.15, 0.28], "#D8E2DC");
      box(park, "umbrella pole", [x + 2.3, 1.45, 12.2], [0.25, 2.9, 0.25], COLORS.hotelTrim);
      box(park, "umbrella canopy", [x + 2.3, 2.95, 12.2], [3.8, 0.24, 3.8], x % 16 === 2 ? COLORS.slideYellow : COLORS.slidePink, false);
    }
  }

  function slides(root) {
    const slidesRoot = group(root, "water slides");

    // Slide tower with stacked platforms and climbable side supports.
    box(slidesRoot, "slide tower base", [29, 0.65, -23], [8, 1.3, 8], "#B5C7D3");
    for (let y = 2.4; y <= 7.2; y += 2.4) {
      box(slidesRoot, "slide tower platform", [29, y, -23], [8, 0.28, 8], "#C4D6DD");
      box(slidesRoot, "slide tower rail north", [29, y + 0.65, -27], [8, 1.3, 0.28], COLORS.hotelTrim);
      box(slidesRoot, "slide tower rail east", [33, y + 0.65, -23], [0.28, 1.3, 8], COLORS.hotelTrim);
      box(slidesRoot, "slide tower rail west", [25, y + 0.65, -23], [0.28, 1.3, 8], COLORS.hotelTrim);
    }

    for (let y = 0.8; y <= 7.4; y += 1.1) {
      box(slidesRoot, "tower ladder rung", [24.6, y, -20.3], [0.28, 0.22, 3.4], COLORS.slideOrange);
      box(slidesRoot, "tower ladder rung back", [33.4, y, -25.7], [0.28, 0.22, 3.4], COLORS.slideBlue);
    }

    // Straight slide as a chain of pushable segments from tower to deep pool.
    for (let i = 0; i < 9; i += 1) {
      box(slidesRoot, "straight slide bed", [28 - i * 1.7, 6.8 - i * 0.55, -18.4 + i * 1.55], [2.1, 0.32, 2.4], COLORS.slideBlue);
      box(slidesRoot, "straight slide left wall", [26.9 - i * 1.7, 7.05 - i * 0.55, -18.4 + i * 1.55], [0.25, 0.75, 2.4], "#1378C8");
      box(slidesRoot, "straight slide right wall", [29.1 - i * 1.7, 7.05 - i * 0.55, -18.4 + i * 1.55], [0.25, 0.75, 2.4], "#1378C8");
    }

    // Enclosed tube route approximated with chunky segments and colored rings.
    for (let i = 0; i < 8; i += 1) {
      box(slidesRoot, "tube slide floor", [31.5 - i * 0.9, 5.2 - i * 0.35, -26.5 + i * 2.1], [2.8, 0.28, 2.4], COLORS.slideYellow);
      box(slidesRoot, "tube slide side a", [30.2 - i * 0.9, 5.55 - i * 0.35, -26.5 + i * 2.1], [0.3, 1.1, 2.4], "#DFAE1B");
      box(slidesRoot, "tube slide side b", [32.8 - i * 0.9, 5.55 - i * 0.35, -26.5 + i * 2.1], [0.3, 1.1, 2.4], "#DFAE1B");
      box(slidesRoot, "tube ring top", [31.5 - i * 0.9, 6.05 - i * 0.35, -26.5 + i * 2.1], [2.8, 0.24, 2.4], "#FFE17B", false);
    }

    // Spiral slide: platforms around a central support create an advanced route.
    pole(slidesRoot, "spiral center pole", [15, 4, -27], 8, COLORS.slidePink);
    const spiral = [
      [18, 6.8, -27], [18, 6.25, -24.5], [15.8, 5.7, -22.5], [13.2, 5.15, -23.2],
      [12.2, 4.6, -25.8], [13.4, 4.05, -28.2], [16.2, 3.5, -29], [18.4, 2.95, -27.4],
      [18, 2.4, -24.8], [15.2, 1.85, -23.5], [12.8, 1.3, -24.8], [12.8, 0.75, -27.8]
    ];
    spiral.forEach(function (p, index) {
      box(slidesRoot, "spiral slide pad", p, [3.2, 0.3, 2.2], index % 2 ? COLORS.slidePink : COLORS.slideOrange);
      box(slidesRoot, "spiral slide rail", [p[0], p[1] + 0.45, p[2]], [3.5, 0.28, 0.28], "#C44C5B");
    });
  }

  function lazyRiver(root) {
    const riverRoot = group(root, "lazy river");
    const segments = [
      [3, -22, 18, 4], [18, -22, 4, 18], [26, -14, 12, 4], [32, -4, 4, 18],
      [25, 5, 14, 4], [9, 8, 20, 4], [-2, 0, 4, 18], [-2, -14, 4, 18]
    ];

    segments.forEach(function (s, i) {
      box(riverRoot, "lazy river water", [s[0], 0.06, s[1]], [s[2], 0.07, s[3]], i % 2 ? COLORS.river : "#57D8F4", false);
      box(riverRoot, "lazy river inner ledge", [s[0], 0.22, s[1]], [Math.max(0.6, s[2] - 1.1), 0.44, Math.max(0.6, s[3] - 1.1)], "transparent", false, true);
    });

    // Pushable edging around the loop.
    box(riverRoot, "river north rail", [13, 0.42, -24.4], [25, 0.85, 0.65], "#E9D4B7");
    box(riverRoot, "river east rail", [34.5, 0.42, -4], [0.65, 0.85, 28], "#E9D4B7");
    box(riverRoot, "river south rail", [14, 0.42, 10.4], [29, 0.85, 0.65], "#E9D4B7");
    box(riverRoot, "river west rail", [-4.5, 0.42, -7], [0.65, 0.85, 29], "#E9D4B7");
    box(riverRoot, "river center shortcut island", [14, 0.9, -7], [5, 1.8, 5], "#F0E1B8");
    box(riverRoot, "river bridge shortcut", [14, 1.55, -14.2], [5.2, 0.35, 12], "#C99A63");
    box(riverRoot, "bridge rail west", [11.3, 2.1, -14.2], [0.25, 1.1, 12], COLORS.fence);
    box(riverRoot, "bridge rail east", [16.7, 2.1, -14.2], [0.25, 1.1, 12], COLORS.fence);
  }

  function rooftopRoutes(root) {
    const roof = group(root, "rooftop routes");

    box(roof, "roof pool", [-25, 7.38, 7], [5.5, 0.12, 4], "#2EBCEB", false);
    box(roof, "roof pool rim north", [-25, 7.65, 4.9], [6, 0.55, 0.3], "#B8C9CE");
    box(roof, "roof pool rim south", [-25, 7.65, 9.1], [6, 0.55, 0.3], "#B8C9CE");
    box(roof, "roof pool rim west", [-28.1, 7.65, 7], [0.3, 0.55, 4], "#B8C9CE");
    box(roof, "roof pool rim east", [-21.9, 7.65, 7], [0.3, 0.55, 4], "#B8C9CE");

    // Vent parkour route from hotel roof to slide tower.
    const vents = [
      [-14, 7.75, 5], [-10, 7.95, 1], [-5, 6.9, -3], [0, 6.2, -7],
      [5, 5.55, -12], [11, 5.1, -16], [18, 4.9, -20], [24, 5.0, -22]
    ];
    vents.forEach(function (p, i) {
      box(roof, "rooftop vent pad", p, [3.4, 0.45, 2.1], i % 2 ? "#95A0A8" : COLORS.vent);
      box(roof, "vent lip", [p[0], p[1] + 0.38, p[2]], [3.6, 0.22, 0.22], "#65717A");
    });

    box(roof, "hotel to slide shortcut beam", [6, 5.8, -13.5], [18, 0.45, 0.55], COLORS.slideYellow);
    box(roof, "balcony sky bridge", [-4, 4.95, 22.4], [12, 0.4, 2.2], COLORS.hotelTrim);
    box(roof, "sky bridge far rail", [-4, 5.55, 23.5], [12, 1.2, 0.28], "#317483");
    box(roof, "sky bridge near rail", [-4, 5.55, 21.3], [12, 1.2, 0.28], "#317483");
  }

  function resortDetails(root) {
    const details = group(root, "resort detail routes");

    const palmPositions = [
      [-38, 13], [-35, 27], [-12, 33], [8, 28], [25, 24], [38, 14],
      [38, -27], [4, -36], [-35, -31], [-41, 2]
    ];

    palmPositions.forEach(function (p) {
      palm(details, p[0], p[1]);
    });

    // Hilly launch mounds made from stepped pushable blocks.
    for (let i = 0; i < 5; i += 1) {
      box(details, "grass launch mound", [36 - i * 1.8, 0.25 + i * 0.25, -33 + i * 1.2], [5 - i * 0.5, 0.5 + i * 0.2, 4 - i * 0.3], i % 2 ? "#68B96F" : "#4C9D58");
    }

    // Climbable fences and beam routes near resort edge.
    for (let z = -28; z <= 25; z += 5) {
      box(details, "climb fence west slat", [-39.2, 1.35, z], [0.38, 2.7, 0.38], COLORS.fence);
      box(details, "climb fence east slat", [39.2, 1.35, z], [0.38, 2.7, 0.38], COLORS.fence);
    }

    box(details, "west fence top beam", [-39.2, 2.8, -2], [0.4, 0.35, 56], "#8B5D3D");
    box(details, "east fence top beam", [39.2, 2.8, -2], [0.4, 0.35, 56], "#8B5D3D");
  }

  function secretsAndShortcuts(root) {
    const secrets = group(root, "secret paths and shortcuts");

    // Secret 1: waterfall tunnel behind deep pool.
    box(secrets, "waterfall sheet", [30.5, 1.7, -4], [0.25, 3.4, 5.5], "#7DE4FF", false);
    box(secrets, "hidden waterfall tunnel floor", [35.5, 0.15, -4], [9, 0.3, 3], COLORS.secret);
    box(secrets, "hidden waterfall tunnel wall north", [35.5, 1.35, -5.6], [9, 2.7, 0.32], "#1E2635");
    box(secrets, "hidden waterfall tunnel wall south", [35.5, 1.35, -2.4], [9, 2.7, 0.32], "#1E2635");
    box(secrets, "hidden launch block", [39, 1.05, -4], [2.2, 2.1, 2.4], COLORS.slideBlue);

    // Secret 2: service corridor from locker room to slide tower.
    box(secrets, "service tunnel floor", [-18, 0.12, -22], [26, 0.24, 2.4], "#3D4757");
    box(secrets, "service tunnel north wall", [-18, 1.2, -23.4], [26, 2.4, 0.3], COLORS.secret);
    box(secrets, "service tunnel south wall", [-18, 1.2, -20.6], [21, 2.4, 0.3], COLORS.secret);
    box(secrets, "service tunnel exit step", [-5, 0.8, -22], [2.5, 1.6, 2.4], "#516070");

    // Secret 3: hidden maintenance room behind the indoor bar.
    box(secrets, "hidden bar room floor", [-26, 0.13, -18.5], [7, 0.26, 4], "#4B5365");
    box(secrets, "hidden bar room back wall", [-26, 1.35, -20.6], [7, 2.7, 0.3], COLORS.secret);
    box(secrets, "hidden bar room side wall", [-29.6, 1.35, -18.5], [0.3, 2.7, 4], COLORS.secret);
    box(secrets, "secret room climb shelf", [-24, 1.05, -19.4], [3.2, 2.1, 0.8], COLORS.slidePink);

    // Skilled shortcut 1: narrow beam across the lazy river.
    box(secrets, "advanced lazy river beam", [25, 2.2, -14], [15, 0.34, 0.42], COLORS.slideOrange);
    box(secrets, "advanced beam start post", [18, 1.3, -14], [0.6, 2.6, 0.6], COLORS.slideOrange);
    box(secrets, "advanced beam end post", [32, 1.3, -14], [0.6, 2.6, 0.6], COLORS.slideOrange);

    // Skilled shortcut 2: compact ledges up the hotel corner.
    for (let i = 0; i < 7; i += 1) {
      box(secrets, "hotel corner shortcut ledge", [-32.8, 0.6 + i * 0.9, 19.4 - i * 1.6], [1.4, 0.3, 1.4], i % 2 ? COLORS.hotelTrim : COLORS.slideYellow);
    }
  }

  function labels(root) {
    text(root, "WATER PARK RESORT", [0, 3.6, 24], 9, "#102331");
    text(root, "HOTEL", [-20, 8.5, 20.4], 6, "#102331");
    text(root, "SLIDES", [29, 8.7, -23], 5, "#102331");
    text(root, "LOUNGE", [-19, 2.7, -12.8], 3.5, "#FFFFFF");
    text(root, "LOCKERS", [-35, 2.7, -12.8], 3.5, "#102331");
  }

  function pool(root, name, center, size, waterColor, stripeColor) {
    const x = center[0];
    const z = center[1];
    const w = size[0];
    const d = size[1];

    box(root, name + " water", [x, 0.06, z], [w, 0.08, d], waterColor, false);
    box(root, name + " north rim", [x, 0.38, z - d / 2 - 0.45], [w + 1, 0.76, 0.9], "#F0E2CF");
    box(root, name + " south rim", [x, 0.38, z + d / 2 + 0.45], [w + 1, 0.76, 0.9], "#F0E2CF");
    box(root, name + " west rim", [x - w / 2 - 0.45, 0.38, z], [0.9, 0.76, d + 1], "#F0E2CF");
    box(root, name + " east rim", [x + w / 2 + 0.45, 0.38, z], [0.9, 0.76, d + 1], "#F0E2CF");

    for (let i = -Math.floor(w / 2) + 1; i < Math.floor(w / 2); i += 3) {
      box(root, name + " water stripe", [x + i, 0.12, z], [0.5, 0.04, d - 1], stripeColor, false);
    }
  }

  function palm(root, x, z) {
    pole(root, "palm trunk", [x, 2.1, z], 4.2, COLORS.trunk);
    box(root, "palm leaf north", [x, 4.4, z - 1.3], [1.2, 0.25, 3.2], COLORS.palm, false);
    box(root, "palm leaf south", [x, 4.4, z + 1.3], [1.2, 0.25, 3.2], COLORS.palm, false);
    box(root, "palm leaf east", [x + 1.3, 4.35, z], [3.2, 0.25, 1.2], COLORS.palm, false);
    box(root, "palm leaf west", [x - 1.3, 4.35, z], [3.2, 0.25, 1.2], COLORS.palm, false);
  }

  function pole(root, name, pos, height, color) {
    el(root, "a-cylinder", {
      position: pos.join(" "),
      radius: "0.28",
      height: String(height),
      color: color
    });
    box(root, name + " collider", pos, [0.55, height, 0.55], color);
  }

  function group(root, id) {
    return el(root, "a-entity", { id: slug(id) });
  }

  function text(root, value, pos, width, color) {
    el(root, "a-text", {
      value: value,
      position: pos.join(" "),
      width: String(width),
      align: "center",
      color: color,
      side: "double"
    });
  }

  function box(root, name, pos, size, color, collider, transparent) {
    const attrs = {
      position: pos.join(" "),
      width: String(size[0]),
      height: String(size[1]),
      depth: String(size[2])
    };

    if (transparent || color === "transparent") {
      attrs.material = "color: #FFFFFF; opacity: 0; transparent: true";
    } else {
      attrs.color = color;
    }

    if (collider !== false) {
      attrs["locomotion-collider"] = "type: box; size: " + size.join(" ");
    }

    const entity = el(root, "a-box", attrs);
    entity.dataset.mapPart = name;
    return entity;
  }

  function el(root, tagName, attrs) {
    const entity = document.createElement(tagName);

    Object.keys(attrs).forEach(function (key) {
      entity.setAttribute(key, attrs[key]);
    });

    root.appendChild(entity);
    return entity;
  }

  function slug(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
}());
