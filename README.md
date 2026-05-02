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

- `index.html` sets up the A-Frame scene, Quest tracked controllers, storm lighting, the map root, and grippier scene-level locomotion settings.
- `gorilla-locomotion.js` contains the reusable Gorilla Tag-style locomotion component.
- `map.js` builds the generated storm plain map, terrain colliders, rain, lightning, clouds, and dense reactive grass.
- `main.js` updates the small browser note when entering or exiting VR.
- `.nojekyll` keeps GitHub Pages from applying Jekyll processing.

## Map

The current map is a generated stormy grass plain built from lightweight A-Frame primitives and small runtime Three.js meshes inside A-Frame components. It does not use imported models, GLB files, external engines, or large textures.

Map features:

- Randomly generated rolling grassy terrain with hills instead of a flat floor.
- Heavy rain that follows the player so the storm stays dense across the whole map.
- Occasional lightning flashes with visible strikes and a dark gray storm sky.
- Low clouds spread across the map.
- Dense grass blades and clumps of varied height spread across the whole map, bending away from the player rig and tracked hands.
- Wet green paths, mossy climbable ridges, grassy launch mounds, and a lookout mound for Gorilla Tag-style movement.
- No brown mud patches, puddles, imported models, or visible boundary walls.
- Solid `locomotion-collider` boxes for terrain tiles, rocks, ridges, boundaries, paths, and other major traversal surfaces.

## Hosting

This is a static website. No npm install, framework, bundler, or build step is required.

To test on Meta Quest:

1. Host the files over HTTPS.
2. Open the hosted URL in Meta Quest Browser.
3. Press `Enter VR`.
4. Push your tracked hands against the ground, hills, rocks, ridges, and ledges to move.

WebXR requires HTTPS on real devices, so use GitHub Pages or another HTTPS static host for Quest testing.
