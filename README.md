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

- `index.html` sets up the A-Frame scene, Quest tracked controllers, colliders, lighting, and debug panel.
- `gorilla-locomotion.js` contains the reusable Gorilla Tag-style locomotion component.
- `main.js` updates the small browser note when entering or exiting VR.
- `.nojekyll` keeps GitHub Pages from applying Jekyll processing.

## Hosting

This is a static website. No npm install, framework, bundler, or build step is required.

To test on Meta Quest:

1. Host the files over HTTPS.
2. Open the hosted URL in Meta Quest Browser.
3. Press `Enter VR`.
4. Push your tracked hands against the floor or blocks to move.

WebXR requires HTTPS on real devices, so use GitHub Pages or another HTTPS static host for Quest testing.
