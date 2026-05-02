import { MultiplayerClient } from "./frontend/multiplayer-client.js";

const GAME_NAME = "quiet";
const PLAYER_COLORS = {
  headColor: "#F2F5FF",
  bodyColor: "#6F86FF",
  leftHandColor: "#FF7AA2",
  rightHandColor: "#6FC3FF"
};

window.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");
  const note = document.getElementById("note");
  const menuRoot = document.getElementById("vr-menu-root");
  const remoteRoot = document.getElementById("remote-players");
  const rig = document.getElementById("player-rig");
  const camera = document.getElementById("player-camera");
  const leftHand = document.getElementById("left-hand");
  const rightHand = document.getElementById("right-hand");

  if (!scene || !note || !menuRoot || !remoteRoot || !rig || !camera || !leftHand || !rightHand) {
    return;
  }

  const defaultNote = note.textContent.trim();
  const remotePlayers = new Map();
  const apiBase = resolveApiBase();
  const playerName = getPlayerName();

  const state = {
    screen: "home",
    code: "",
    status: "Choose Play in VR.",
    joined: false,
    playing: false,
    snapshot: null
  };

  const multiplayer = new MultiplayerClient(apiBase, {
    storageKey: "quiet_multiplayer_session",
    pingMs: 5000,
    onSnapshot(snapshot) {
      state.snapshot = snapshot;
      updateRemotePlayers(snapshot);
      updateLobbyStatus(snapshot);
      renderMenu();
    },
    onOpen() {
      state.status = "Connected.";
      renderMenu();
    },
    onClose() {
      state.status = state.joined ? "Disconnected. Rejoin or create a new private lobby." : "Offline.";
      renderMenu();
    },
    onError(error) {
      state.status = error.message || "Multiplayer error.";
      renderMenu();
    }
  });

  scene.addEventListener("enter-vr", () => {
    note.textContent = "Use the VR menu, then push with your hands through the faster storm plain.";
  });

  scene.addEventListener("exit-vr", () => {
    note.textContent = defaultNote;
  });

  scene.addEventListener("loaded", () => {
    renderMenu();
  });

  setInterval(() => {
    if (!state.joined || !state.playing) return;
    multiplayer.pushState(getLocalPlayerState(), PLAYER_COLORS);
  }, 90);

  renderMenu();

  function resolveApiBase() {
    if (window.QUIET_MULTIPLAYER_API) {
      return window.QUIET_MULTIPLAYER_API;
    }
    if (window.location.protocol === "file:") {
      return "http://127.0.0.1:8787";
    }
    return window.location.origin;
  }

  function getPlayerName() {
    const stored = sessionStorage.getItem("quiet_player_name");
    if (stored) return stored;
    const generated = "Player " + Math.floor(100 + Math.random() * 900);
    sessionStorage.setItem("quiet_player_name", generated);
    return generated;
  }

  function renderMenu() {
    clear(menuRoot);
    menuRoot.setAttribute("visible", state.playing ? "false" : "true");
    if (state.playing) return;

    panel(menuRoot, 3.7, 2.7, "#10191D", 0.92);
    text(menuRoot, GAME_NAME, [0, 0.98, 0.04], 5.6, "#F4F8F2");

    if (state.screen === "home") {
      text(menuRoot, "storm grass vr", [0, 0.56, 0.04], 1.4, "#AFC9B8");
      button(menuRoot, "PLAY", [0, -0.08, 0.08], [1.72, 0.42, 0.08], () => {
        state.screen = "mode";
        state.status = "Pick solo or private multiplayer.";
        renderMenu();
      });
      text(menuRoot, state.status, [0, -0.62, 0.04], 1.3, "#DDE8EF");
      return;
    }

    if (state.screen === "mode") {
      text(menuRoot, "mode", [0, 0.58, 0.04], 1.5, "#DDE8EF");
      button(menuRoot, "SINGLE PLAYER", [0, 0.12, 0.08], [2.28, 0.34, 0.08], () => {
        state.playing = true;
        state.status = "Single player.";
        note.textContent = "Single player: fast hand launches, lighter gravity, and denser storm grass.";
        renderMenu();
      });
      button(menuRoot, "MULTIPLAYER", [0, -0.34, 0.08], [2.28, 0.34, 0.08], () => {
        state.screen = "multiplayer";
        state.status = "Create a private code or enter one to join.";
        renderMenu();
      });
      smallButton(menuRoot, "BACK", [-1.26, -0.96, 0.08], () => {
        state.screen = "home";
        renderMenu();
      });
      return;
    }

    if (state.screen === "multiplayer") {
      text(menuRoot, "private multiplayer", [0, 0.78, 0.04], 1.6, "#DDE8EF");
      button(menuRoot, "CREATE PRIVATE", [0, 0.38, 0.08], [2.38, 0.3, 0.08], createPrivateLobby);
      button(menuRoot, "JOIN CODE", [0, 0.0, 0.08], [2.38, 0.3, 0.08], joinPrivateLobby);
      text(menuRoot, "CODE: " + (state.code || "______"), [0, -0.34, 0.05], 1.45, "#F4F8F2");
      buildCodePad(menuRoot);
      smallButton(menuRoot, "BACK", [-1.32, -1.12, 0.08], () => {
        state.screen = "mode";
        renderMenu();
      });
      text(menuRoot, state.status, [0, -1.08, 0.05], 1.1, "#AFC9B8");
      return;
    }

    if (state.screen === "lobby") {
      const snapshot = state.snapshot;
      const code = snapshot?.code || "------";
      const count = snapshot ? snapshot.playerCount + " / " + snapshot.maxPlayers : "connecting";
      text(menuRoot, "private code", [0, 0.68, 0.04], 1.4, "#AFC9B8");
      text(menuRoot, code, [0, 0.24, 0.05], 2.8, "#F4F8F2");
      text(menuRoot, "players: " + count, [0, -0.18, 0.04], 1.2, "#DDE8EF");
      button(menuRoot, "START", [0, -0.58, 0.08], [1.64, 0.34, 0.08], () => {
        state.playing = true;
        note.textContent = "Multiplayer active. Private code " + code + ".";
        renderMenu();
      });
      smallButton(menuRoot, "LEAVE", [-1.22, -1.05, 0.08], leaveLobby);
      text(menuRoot, state.status, [0, -1.02, 0.05], 1.05, "#AFC9B8");
    }
  }

  function panel(parent, width, height, color, opacity) {
    const el = entity(parent, "a-plane", {
      width,
      height,
      color,
      opacity,
      material: "side: double; shader: flat"
    });
    return el;
  }

  function button(parent, label, position, size, onClick) {
    const el = entity(parent, "a-box", {
      class: "vr-clickable",
      width: size[0],
      height: size[1],
      depth: size[2],
      position: vec(position),
      color: "#234A42",
      material: "shader: flat; roughness: 1"
    });
    el.addEventListener("mouseenter", () => el.setAttribute("color", "#347464"));
    el.addEventListener("mouseleave", () => el.setAttribute("color", "#234A42"));
    el.addEventListener("click", onClick);
    text(el, label, [0, 0, size[2] / 2 + 0.012], Math.min(1.45, size[0] * 0.78), "#F4F8F2");
    return el;
  }

  function smallButton(parent, label, position, onClick) {
    return button(parent, label, position, [0.78, 0.25, 0.08], onClick);
  }

  function buildCodePad(parent) {
    const keys = ["ABCDEFGH", "IJKLMNOP", "QRSTUVWX", "YZ012345", "6789"];
    keys.forEach((row, rowIndex) => {
      const chars = row.split("");
      const startX = -(chars.length - 1) * 0.17;
      chars.forEach((char, colIndex) => {
        button(parent, char, [startX + colIndex * 0.34, -0.58 - rowIndex * 0.22, 0.08], [0.25, 0.16, 0.06], () => {
          if (state.code.length < 6) {
            state.code += char;
            renderMenu();
          }
        });
      });
    });
    button(parent, "DEL", [0.72, -1.46, 0.08], [0.55, 0.18, 0.06], () => {
      state.code = state.code.slice(0, -1);
      renderMenu();
    });
    button(parent, "CLR", [1.34, -1.46, 0.08], [0.55, 0.18, 0.06], () => {
      state.code = "";
      renderMenu();
    });
  }

  async function createPrivateLobby() {
    try {
      state.status = "Creating private lobby...";
      renderMenu();
      const snapshot = await multiplayer.createLobby({
        lobbyName: GAME_NAME,
        privateLobby: true,
        maxPlayers: 12,
        playerName,
        playerState: getLocalPlayerState(),
        playerMeta: PLAYER_COLORS
      });
      state.joined = true;
      state.snapshot = snapshot;
      state.screen = "lobby";
      updateLobbyStatus(snapshot);
      renderMenu();
    } catch (error) {
      state.status = error.message || "Could not create lobby.";
      renderMenu();
    }
  }

  async function joinPrivateLobby() {
    if (state.code.length < 4) {
      state.status = "Enter the private code first.";
      renderMenu();
      return;
    }

    try {
      state.status = "Joining private lobby...";
      renderMenu();
      const snapshot = await multiplayer.joinLobbyByCode({
        code: state.code,
        playerName,
        playerState: getLocalPlayerState(),
        playerMeta: PLAYER_COLORS
      });
      state.joined = true;
      state.snapshot = snapshot;
      state.screen = "lobby";
      updateLobbyStatus(snapshot);
      renderMenu();
    } catch (error) {
      state.status = error.message || "Could not join lobby.";
      renderMenu();
    }
  }

  async function leaveLobby() {
    try {
      await multiplayer.leave();
    } catch {}
    state.joined = false;
    state.playing = false;
    state.snapshot = null;
    state.status = "Left multiplayer.";
    clear(remoteRoot);
    remotePlayers.clear();
    state.screen = "multiplayer";
    renderMenu();
  }

  function updateLobbyStatus(snapshot) {
    if (!snapshot) return;
    state.status = snapshot.private && snapshot.code
      ? "Share code " + snapshot.code + " with friends."
      : "Lobby connected.";
  }

  function getLocalPlayerState() {
    const rigPos = rig.object3D.position;
    return {
      rig: vectorFromObject(rig.object3D),
      head: worldVector(camera.object3D),
      leftHand: worldVector(leftHand.object3D),
      rightHand: worldVector(rightHand.object3D),
      facing: { x: 0, y: camera.object3D.rotation.y, z: 0 },
      terrainY: window.getTerrainHeightAt ? window.getTerrainHeightAt(rigPos.x, rigPos.z) : 0
    };
  }

  function updateRemotePlayers(snapshot) {
    if (!snapshot || !Array.isArray(snapshot.players)) return;

    const seen = new Set();
    const localPlayerId = snapshot.youPlayerId;

    snapshot.players.forEach((player) => {
      if (player.playerId === localPlayerId) return;
      seen.add(player.playerId);
      const avatar = getRemoteAvatar(player);
      updateAvatar(avatar, player);
    });

    for (const [playerId, avatar] of remotePlayers.entries()) {
      if (!seen.has(playerId)) {
        avatar.root.parentNode?.removeChild(avatar.root);
        remotePlayers.delete(playerId);
      }
    }
  }

  function getRemoteAvatar(player) {
    const existing = remotePlayers.get(player.playerId);
    if (existing) return existing;

    const root = entity(remoteRoot, "a-entity", { id: "remote-" + player.playerId });
    const body = entity(root, "a-cylinder", {
      radius: "0.22",
      height: "0.78",
      color: player.meta?.bodyColor || PLAYER_COLORS.bodyColor,
      opacity: "0.88"
    });
    const head = entity(root, "a-sphere", {
      radius: "0.18",
      color: player.meta?.headColor || PLAYER_COLORS.headColor,
      opacity: "0.96"
    });
    const left = entity(root, "a-sphere", {
      radius: "0.12",
      color: player.meta?.leftHandColor || PLAYER_COLORS.leftHandColor,
      opacity: "0.95"
    });
    const right = entity(root, "a-sphere", {
      radius: "0.12",
      color: player.meta?.rightHandColor || PLAYER_COLORS.rightHandColor,
      opacity: "0.95"
    });
    const name = text(root, player.name || "player", [0, 1.72, 0], 1.3, "#F4F8F2");
    const avatar = { root, body, head, left, right, name };
    remotePlayers.set(player.playerId, avatar);
    return avatar;
  }

  function updateAvatar(avatar, player) {
    const stateData = player.state || {};
    const rigPos = safeVector(stateData.rig, { x: 0, y: 0, z: 0 });
    const headPos = safeVector(stateData.head, { x: rigPos.x, y: rigPos.y + 1.45, z: rigPos.z });
    const leftPos = safeVector(stateData.leftHand, { x: rigPos.x - 0.35, y: rigPos.y + 1, z: rigPos.z - 0.4 });
    const rightPos = safeVector(stateData.rightHand, { x: rigPos.x + 0.35, y: rigPos.y + 1, z: rigPos.z - 0.4 });

    avatar.body.setAttribute("position", vec([rigPos.x, rigPos.y + 0.72, rigPos.z]));
    avatar.head.setAttribute("position", vec([headPos.x, headPos.y, headPos.z]));
    avatar.left.setAttribute("position", vec([leftPos.x, leftPos.y, leftPos.z]));
    avatar.right.setAttribute("position", vec([rightPos.x, rightPos.y, rightPos.z]));
    avatar.name.setAttribute("position", vec([headPos.x, headPos.y + 0.34, headPos.z]));
    avatar.name.setAttribute("value", player.name || "player");
  }

  function entity(parent, tagName, attrs = {}) {
    const el = document.createElement(tagName);
    Object.entries(attrs).forEach(([name, value]) => el.setAttribute(name, value));
    parent.appendChild(el);
    return el;
  }

  function text(parent, value, position, width, color) {
    return entity(parent, "a-text", {
      value,
      position: vec(position),
      align: "center",
      width,
      color,
      "wrap-count": "26",
      material: "shader: flat"
    });
  }

  function clear(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  function vec(values) {
    return values.map((value) => Number(value).toFixed(3)).join(" ");
  }

  function worldVector(object3D) {
    const pos = new THREE.Vector3();
    object3D.getWorldPosition(pos);
    return vectorFromObject(pos);
  }

  function vectorFromObject(value) {
    return {
      x: round(value.x),
      y: round(value.y),
      z: round(value.z)
    };
  }

  function safeVector(value, fallback) {
    return {
      x: Number.isFinite(value?.x) ? value.x : fallback.x,
      y: Number.isFinite(value?.y) ? value.y : fallback.y,
      z: Number.isFinite(value?.z) ? value.z : fallback.z
    };
  }

  function round(value) {
    return Math.round(Number(value || 0) * 1000) / 1000;
  }
});
