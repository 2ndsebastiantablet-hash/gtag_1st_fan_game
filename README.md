# GTag 1st Fan Game

A basic WebXR VR scene for Meta Quest Browser using A-Frame and Gorilla Tag-style hand locomotion.

## Source Templates

This project is adapted from the pinned template repo requested for the game:

- repo: `2ndsebastiantablet-hash/feeble`
- commit: `28a426aa6ade789320e2202cfa8d2fe61b46b539`
- scene template: `templates/simple-vr-scene`
- movement template: `templates/gorilla-tag-locomotion`

The scene keeps the simple A-Frame/WebXR structure from `simple-vr-scene`, including the normal A-Frame `Enter VR` button. The movement system is based on `gorilla-tag-locomotion` and preserves hand pushing, bounce/launch behavior, gravity, drag, and Quest controller tracking.

## Files

- `index.html` sets up the A-Frame scene, Quest tracked controllers, storm lighting, the map root, terrain-relative spawn, stronger gravity, extra high ground drag, and a temporary terrain debug readout.
- `gorilla-locomotion.js` contains the reusable Gorilla Tag-style locomotion component with terrain-height support for the rig and hands.
- `map.js` builds the generated storm plain map, smooth terrain visual mesh, raycast terrain collision surface, rain, lightning, sky trees, dense forest trees, and heavy reactive grass.
- `main.js` updates the small browser note when entering or exiting VR.
- `.nojekyll` keeps GitHub Pages from applying Jekyll processing.

## Map

The current map is a generated stormy grass plain built from lightweight A-Frame primitives and small runtime Three.js meshes inside A-Frame components. It does not use imported models, GLB files, external engines, or large textures.

Map features:

- Randomly generated rolling grassy terrain with hills instead of a flat floor, using a smooth grass mesh that is also registered as the terrain raycast collision surface.
- Heavy rain that follows the player so the storm stays dense across the whole map.
- Occasional lightning flashes with visible strikes and a dark gray storm sky.
- Dense triangular grass blades of varied height spread across the whole map, bending away from the player rig and tracked hands.
- A fuller forest of climbable trees, plus tall sky trees with trunks, branches, and hand nubs.
- Open grassy hills and tree routes for Gorilla Tag-style movement.
- No cloud geometry, brown mud patches, puddles, imported models, visible boundary walls, rectangular grass clump blocks, visible terrain tile blocks, or leftover structure blocks.
- Terrain height is sampled with downward raycasts against the actual ground mesh, while solid `locomotion-collider` boxes remain for tree trunks, tree branches, boundaries, and other non-terrain traversal surfaces.
- Spawn waits until terrain height is available, then places the rig at terrain height minus the standing hand-reach offset plus a small `0.28` meter drop height so gravity settles the player naturally.
- Temporary terrain debug shows player x/z, terrain height under the player, rig/head y, hand terrain heights, hand touch state, grounded state, and terrain ray hit state.

## Hosting

This is a static website. No npm install, framework, bundler, or build step is required.

To test on Meta Quest:

1. Host the files over HTTPS.
2. Open the hosted URL in Meta Quest Browser.
3. Press `Enter VR`.
4. Push your tracked hands against the ground, hills, tree trunks, branches, and climb nubs to move.

WebXR requires HTTPS on real devices, so use GitHub Pages or another HTTPS static host for Quest testing.
