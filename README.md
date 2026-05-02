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

- `index.html` sets up the A-Frame scene, Quest tracked controllers, lighting, and the map root.
- `gorilla-locomotion.js` contains the reusable Gorilla Tag-style locomotion component.
- `map.js` builds the rainforest map with lightweight A-Frame primitives.
- `main.js` updates the small browser note when entering or exiting VR.
- `.nojekyll` keeps GitHub Pages from applying Jekyll processing.

## Map Areas

- Dense rainforest floor with muddy loop paths, open clearings, tall grass, bushes, flowers, and climbable border cliffs.
- Huge trees in different sizes with climbable trunks, buttress roots, hand knots, wraparound tree platforms, and canopy leaf clusters.
- Canopy routes with rope bridges, narrow skilled beams, high platforms, vines, and parkour pads above the ground.
- Cave routes on the west and east sides with climb shelves, tunnel exits, and hidden traversal options.
- Water features built from simple primitives: small ponds, a stream crossing, stepping stones, and a waterfall basin.
- Ground traversal loops with fallen logs, root climbs, a fast vine corridor, launch stumps, rocks, and boulders.
- Secret paths include a waterfall tunnel, hollow tree room, root tunnel, cliff-top shortcut, and high canopy shortcut.
- Built only from A-Frame primitives and simple colored materials; no GLB, glTF, external model, or asset map is used.

## Hosting

This is a static website. No npm install, framework, bundler, or build step is required.

To test on Meta Quest:

1. Host the files over HTTPS.
2. Open the hosted URL in Meta Quest Browser.
3. Press `Enter VR`.
4. Push your tracked hands against the floor, trees, rocks, platforms, bridges, logs, or tunnel walls to move.

WebXR requires HTTPS on real devices, so use GitHub Pages or another HTTPS static host for Quest testing.
