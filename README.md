# GTag 1st Fan Game

A basic WebXR VR scene for Meta Quest Browser using A-Frame and Gorilla Tag-style hand locomotion.

## Source Templates

This project is adapted from the pinned template repo requested for the game:

- repo: `2ndsebastiantablet-hash/feeble`
- commit: `28a426aa6ade789320e2202cfa8d2fe61b46b539`
- scene template: `templates/simple-vr-scene`
- movement template: `templates/gorilla-tag-locomotion`
- multiplayer template repo: `2ndsebastiantablet-hash/fly-game`
- multiplayer template commit: `389610aa69a18eb56eadb228520a5f4dfd33109d`
- multiplayer template folder: `multiplayer-template`

The scene keeps the simple A-Frame/WebXR structure from `simple-vr-scene`, including the normal A-Frame `Enter VR` button. The movement system is based on `gorilla-tag-locomotion` and preserves hand pushing, bounce/launch behavior, gravity, drag, and Quest controller tracking.
The multiplayer backend and browser client are adapted from the pinned `multiplayer-template`, using private lobby codes, WebSockets, Durable Objects, and compact VR player state.

## Files

- `index.html` sets up the A-Frame scene, Quest tracked controllers, storm lighting, the white/gray VR menu room, multiplayer remotes root, terrain-relative spawn, faster movement tuning, and lighter gravity.
- `gorilla-locomotion.js` contains the reusable Gorilla Tag-style locomotion component with terrain-height support for the rig and hands.
- `map.js` builds the generated storm plain map, smooth terrain visual mesh, raycast terrain collision surface, rain, lightning, sky trees, denser forest trees, and heavier reactive grass.
- `main.js` builds the VR-first `quiet` menu, joins public multiplayer, creates and joins private multiplayer codes, transitions players out of the menu room into the always-loaded storm map, sends local VR state, and renders remote players.
- `frontend/multiplayer-client.js` is the template browser client used by the VR menu.
- `backend/` contains the template Cloudflare Worker, lobby directory, Durable Object room, and server authority adapted for VR rig/head/hand state.
- `.nojekyll` keeps GitHub Pages from applying Jekyll processing.

## Map

The current map is a generated stormy grass plain built from lightweight A-Frame primitives and small runtime Three.js meshes inside A-Frame components. It does not use imported models, GLB files, external engines, or large textures.

Map features:

- Randomly generated rolling grassy terrain with hills instead of a flat floor, using a smooth grass mesh that is also registered as the terrain raycast collision surface.
- Heavy rain that follows the player so the storm stays dense across the whole map.
- Occasional lightning flashes with visible strikes and a dark gray storm sky.
- Denser triangular grass blades of varied height spread across the whole map, bending away from the player rig and tracked hands.
- A much fuller forest of climbable trees, plus tall sky trees with trunks, branches, and hand nubs.
- Open grassy hills and tree routes for Gorilla Tag-style movement.
- No cloud geometry, brown mud patches, puddles, imported models, visible boundary walls, rectangular grass clump blocks, visible terrain tile blocks, or leftover structure blocks.
- Terrain height is sampled with downward raycasts against the actual ground mesh, while solid `locomotion-collider` boxes remain for tree trunks, tree branches, boundaries, and other non-terrain traversal surfaces.
- Spawn waits until terrain height is available, then places the rig at terrain height minus the standing hand-reach offset plus a small `0.28` meter drop height so gravity settles the player naturally.
- The storm map stays loaded as the fail-safe world so the player cannot be left in an empty menu void if menu timing is slow.
- Player-screen terrain debug statistics are hidden during normal play.

## Hosting

The frontend is static A-Frame. Multiplayer hosting uses the adapted Cloudflare Worker template in `backend/` and `wrangler.toml`; no frontend framework, bundler, imported models, or GLB files are required.

To test on Meta Quest:

1. Host the files over HTTPS, or deploy with `npm run deploy` for the Worker/API plus static assets.
2. Open the hosted URL in Meta Quest Browser.
3. Press `Enter VR`.
4. Use the `quiet` VR menu to join public multiplayer, create a private code, or join a private code.
5. Push your tracked hands against the ground, hills, tree trunks, branches, and climb nubs to move.

WebXR requires HTTPS on real devices, so use GitHub Pages or another HTTPS static host for Quest testing.
