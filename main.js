// Small scene helper adapted from the pinned A-Frame/WebXR templates.
// The movement system lives in gorilla-locomotion.js.

window.addEventListener("DOMContentLoaded", function () {
  const scene = document.querySelector("a-scene");
  const note = document.getElementById("note");

  if (!scene || !note) {
    return;
  }

  const defaultNote = note.textContent.trim();

  scene.addEventListener("enter-vr", function () {
    note.textContent = "Explore the rainforest with hand pushing, tree climbs, canopy routes, caves, and hidden shortcuts.";
  });

  scene.addEventListener("exit-vr", function () {
    note.textContent = defaultNote;
  });
});
