/*
  TIKUS: Hidden Evidence
  game.js

  Development build with Editor Mode:
  - E toggles editor mode. When leaving editor mode, an export panel opens.
  - 1 = clue edit mode, 2 = zone edit mode.
  - Clues can be moved, resized, rotated, randomize toggled, and exported.
  - Placement zones can be created, moved, resized, type-cycled, deleted, and exported.
  - Browser JavaScript cannot silently overwrite local data.js, so this editor exports a new data.js file.
*/

"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const clueListElement = document.getElementById("clueList");
const scoreValueElement = document.getElementById("scoreValue");
const wrongClickValueElement = document.getElementById("wrongClickValue");
const levelNameElement = document.getElementById("levelName");

const loadingOverlay = document.getElementById("loadingOverlay");
const levelCompleteOverlay = document.getElementById("levelCompleteOverlay");
const restartButton = document.getElementById("restartButton");
const nextLevelButton = document.getElementById("nextLevelButton");
const editorHelpOverlay = document.getElementById("editorHelpOverlay");
const editorModeLabel = document.getElementById("editorModeLabel");

const exportModal = document.getElementById("exportModal");
const exportText = document.getElementById("exportText");
const exportStatus = document.getElementById("exportStatus");
const copyExportButton = document.getElementById("copyExportButton");
const downloadDataButton = document.getElementById("downloadDataButton");
const downloadLevelButton = document.getElementById("downloadLevelButton");
const closeExportButton = document.getElementById("closeExportButton");

const BASE_WIDTH = GAME_DATA.settings.baseWidth;
const BASE_HEIGHT = GAME_DATA.settings.baseHeight;
const CLUE_SCALE = GAME_DATA.settings.clueScale || 1;
const STORAGE_KEY = "TIKUS_HIDDEN_EVIDENCE_EDITOR_DRAFT_V1";
const ZONE_TYPES = ["floor", "table", "counter", "chair", "sofa", "wall"];

canvas.width = BASE_WIDTH;
canvas.height = BASE_HEIGHT;

const editorData = {
  settings: deepClone(GAME_DATA.settings),
  levels: deepClone(GAME_DATA.levels)
};

const gameState = {
  currentLevelIndex: 0,
  mode: "loading",
  images: {},
  foundClues: new Set(),
  runtimeClues: [],
  score: 0,
  wrongClicks: 0,
  debugHitboxes: false,
  debugZones: false,

  editorMode: false,
  editorTool: "clue", // clue or zone
  selectedClueId: null,
  selectedZoneId: null,
  isDragging: false,
  dragOffsetX: 0,
  dragOffsetY: 0,
  lastPointer: { x: 0, y: 0 }
};

window.addEventListener("load", initGame);

function initGame() {
  bindEvents();
  loadAllImages();
}

function bindEvents() {
  canvas.addEventListener("pointerdown", handleCanvasPointerDown);
  canvas.addEventListener("pointermove", handleCanvasPointerMove);
  canvas.addEventListener("pointerup", handleCanvasPointerUp);
  canvas.addEventListener("pointercancel", handleCanvasPointerUp);

  if (restartButton) restartButton.addEventListener("click", restartLevel);
  if (nextLevelButton) nextLevelButton.addEventListener("click", goToNextLevel);
  if (copyExportButton) copyExportButton.addEventListener("click", copyExportToClipboard);
  if (downloadDataButton) downloadDataButton.addEventListener("click", () => downloadTextFile("data.js", buildFullDataJsExport()));
  if (downloadLevelButton) downloadLevelButton.addEventListener("click", () => downloadTextFile(`${getCurrentLevel().id}_level_export.js`, buildCurrentLevelExport()));
  if (closeExportButton) closeExportButton.addEventListener("click", closeExportPanel);

  window.addEventListener("keydown", handleKeyDown);

  document.querySelectorAll("[data-editor-action]").forEach((button) => {
    button.addEventListener("click", () => handleEditorButtonAction(button.dataset.editorAction));
  });
}

function handleEditorButtonAction(action) {
  switch (action) {
    case "toggleEditor": toggleEditorMode(); break;
    case "clueMode": setEditorTool("clue"); break;
    case "zoneMode": setEditorTool("zone"); break;
    case "newZone": createNewZoneAtCenter(); break;
    case "smaller": resizeSelectedItem(0.95); break;
    case "larger": resizeSelectedItem(1.05); break;
    case "rotateLeft": rotateSelectedClue(-5); break;
    case "rotateRight": rotateSelectedClue(5); break;
    case "export": openExportPanel("full"); break;
    default: break;
  }
  updateEditorOverlay();
  render();
}

function handleKeyDown(event) {
  const key = event.key;
  const lowerKey = key.toLowerCase();

  if (lowerKey === "e") {
    event.preventDefault();
    toggleEditorMode();
    return;
  }

  if (lowerKey === "h") {
    event.preventDefault();
    gameState.debugHitboxes = !gameState.debugHitboxes;
    render();
    return;
  }

  if (lowerKey === "z") {
    event.preventDefault();
    gameState.debugZones = !gameState.debugZones;
    render();
    return;
  }

  if (!gameState.editorMode) return;

  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
    event.preventDefault();
    const amount = event.shiftKey ? 10 : 1;
    nudgeSelectedItem(key, amount);
    return;
  }

  switch (lowerKey) {
    case "1":
      event.preventDefault();
      setEditorTool("clue");
      break;
    case "2":
      event.preventDefault();
      setEditorTool("zone");
      break;
    case "escape":
      event.preventDefault();
      deselectAll();
      break;
    case "-":
    case "_":
      event.preventDefault();
      resizeSelectedItem(0.95);
      break;
    case "=":
    case "+":
      event.preventDefault();
      resizeSelectedItem(1.05);
      break;
    case "[":
      event.preventDefault();
      rotateSelectedClue(-5);
      break;
    case "]":
      event.preventDefault();
      rotateSelectedClue(5);
      break;
    case "c":
      event.preventDefault();
      copySelectedItemToExportPanel();
      break;
    case "x":
      event.preventDefault();
      openExportPanel("full");
      break;
    case "s":
      event.preventDefault();
      saveEditorDraftToLocalStorage();
      break;
    case "l":
      event.preventDefault();
      loadEditorDraftFromLocalStorage();
      break;
    case "n":
      event.preventDefault();
      createNewZoneAtPointer();
      break;
    case "t":
      event.preventDefault();
      cycleSelectedZoneType();
      break;
    case "r":
      event.preventDefault();
      toggleSelectedClueRandomize();
      break;
    case "delete":
    case "backspace":
      event.preventDefault();
      deleteSelectedZone();
      break;
    default:
      break;
  }

  updateEditorOverlay();
  render();
}

function getCurrentLevel() {
  return editorData.levels[gameState.currentLevelIndex];
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadAllImages() {
  const imagePaths = collectImagePaths();
  let loadedCount = 0;
  const totalImages = imagePaths.length;

  if (totalImages === 0) {
    startLevel(0);
    return;
  }

  imagePaths.forEach((path) => {
    const image = new Image();
    image.onload = () => {
      loadedCount += 1;
      if (loadedCount === totalImages) startLevel(0);
    };
    image.onerror = () => {
      console.error("Failed to load image:", path);
      loadedCount += 1;
      if (loadedCount === totalImages) startLevel(0);
    };
    image.src = path;
    gameState.images[path] = image;
  });
}

function collectImagePaths() {
  const paths = new Set();
  editorData.levels.forEach((level) => {
    paths.add(level.roomImage);
    level.clues.forEach((clue) => paths.add(clue.image));
  });
  return Array.from(paths);
}

function startLevel(levelIndex) {
  syncRuntimeCluesIntoEditorLevel();
  gameState.currentLevelIndex = levelIndex;
  gameState.mode = "playing";
  gameState.foundClues = new Set();
  gameState.score = 0;
  gameState.wrongClicks = 0;
  gameState.selectedClueId = null;
  gameState.selectedZoneId = null;
  gameState.isDragging = false;

  buildRuntimeCluesForCurrentLevel();
  hideLoadingOverlay();
  hideLevelCompleteOverlay();
  updateUI();
  updateEditorOverlay();
  render();
}

function buildRuntimeCluesForCurrentLevel() {
  const level = getCurrentLevel();
  gameState.runtimeClues = level.clues.map((clue) => {
    const scaledWidth = Math.max(4, Math.round(clue.width * CLUE_SCALE));
    const scaledHeight = Math.max(4, Math.round(clue.height * CLUE_SCALE));
    const shouldRandomize = editorData.settings.randomizeClueLocations === true && clue.randomize === true;
    const position = shouldRandomize
      ? getRandomValidPositionForClue(level, clue, scaledWidth, scaledHeight)
      : { x: clue.x, y: clue.y, zoneId: null };

    return {
      id: clue.id,
      source: clue,
      x: Math.round(position.x),
      y: Math.round(position.y),
      width: scaledWidth,
      height: scaledHeight,
      rotation: Number(clue.rotation || 0),
      randomize: clue.randomize === true,
      placementZoneId: position.zoneId || null,
      hitbox: { x: Math.round(position.x), y: Math.round(position.y), width: scaledWidth, height: scaledHeight }
    };
  });
}

function syncRuntimeCluesIntoEditorLevel() {
  if (!Array.isArray(gameState.runtimeClues) || gameState.runtimeClues.length === 0) return;
  const level = getCurrentLevel();
  if (!level || !Array.isArray(level.clues)) return;

  gameState.runtimeClues.forEach((runtimeClue) => {
    const clue = level.clues.find((item) => item.id === runtimeClue.id);
    if (!clue) return;
    clue.x = Math.round(runtimeClue.x);
    clue.y = Math.round(runtimeClue.y);
    clue.width = Math.max(1, Math.round(runtimeClue.width / CLUE_SCALE));
    clue.height = Math.max(1, Math.round(runtimeClue.height / CLUE_SCALE));
    clue.rotation = Math.round(runtimeClue.rotation || 0);
    clue.randomize = runtimeClue.randomize === true;
  });
}

function getRandomValidPositionForClue(level, clue, clueWidth, clueHeight) {
  const matchingZones = getMatchingZonesForClue(level, clue, clueWidth, clueHeight);
  if (matchingZones.length === 0) {
    console.warn(`No valid placement zone found for clue "${clue.id}". Falling back to authored position.`);
    return { x: clue.x, y: clue.y, zoneId: null };
  }
  const selectedZone = pickRandomItem(matchingZones);
  return {
    x: randomInteger(selectedZone.x, selectedZone.x + selectedZone.width - clueWidth),
    y: randomInteger(selectedZone.y, selectedZone.y + selectedZone.height - clueHeight),
    zoneId: selectedZone.id
  };
}

function getMatchingZonesForClue(level, clue, clueWidth, clueHeight) {
  if (!Array.isArray(level.placementZones) || !Array.isArray(clue.placementTypes)) return [];
  return level.placementZones.filter((zone) => {
    return clue.placementTypes.includes(zone.type) && clueWidth <= zone.width && clueHeight <= zone.height;
  });
}

function pickRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInteger(min, max) {
  const safeMin = Math.ceil(min);
  const safeMax = Math.floor(max);
  if (safeMax <= safeMin) return safeMin;
  return Math.floor(Math.random() * (safeMax - safeMin + 1)) + safeMin;
}

function restartLevel() {
  startLevel(gameState.currentLevelIndex);
}

function goToNextLevel() {
  syncRuntimeCluesIntoEditorLevel();
  const nextIndex = gameState.currentLevelIndex + 1;
  if (nextIndex >= editorData.levels.length) {
    gameState.mode = "game_complete";
    showGameCompleteOverlay();
    render();
    return;
  }
  startLevel(nextIndex);
}

function handleCanvasPointerDown(event) {
  event.preventDefault();
  canvas.setPointerCapture(event.pointerId);
  const point = getCanvasGameCoordinates(event);
  gameState.lastPointer = point;

  if (gameState.editorMode) {
    handleEditorPointerDown(point);
    return;
  }

  if (gameState.mode !== "playing") return;

  const clickedClue = findClickedRuntimeClue(point.x, point.y);
  if (clickedClue) collectClue(clickedClue);
  else handleWrongClick();
  updateUI();
  render();
}

function handleCanvasPointerMove(event) {
  const point = getCanvasGameCoordinates(event);
  gameState.lastPointer = point;

  if (!gameState.editorMode || !gameState.isDragging) return;

  if (gameState.editorTool === "clue") {
    const clue = getSelectedRuntimeClue();
    if (!clue) return;
    clue.x = clamp(Math.round(point.x - gameState.dragOffsetX), 0, BASE_WIDTH - clue.width);
    clue.y = clamp(Math.round(point.y - gameState.dragOffsetY), 0, BASE_HEIGHT - clue.height);
    updateRuntimeHitbox(clue);
  } else {
    const zone = getSelectedZone();
    if (!zone) return;
    zone.x = clamp(Math.round(point.x - gameState.dragOffsetX), 0, BASE_WIDTH - zone.width);
    zone.y = clamp(Math.round(point.y - gameState.dragOffsetY), 0, BASE_HEIGHT - zone.height);
  }

  updateEditorOverlay();
  render();
}

function handleCanvasPointerUp(event) {
  if (canvas.hasPointerCapture && canvas.hasPointerCapture(event.pointerId)) {
    canvas.releasePointerCapture(event.pointerId);
  }
  gameState.isDragging = false;
}

function handleEditorPointerDown(point) {
  if (gameState.editorTool === "zone") {
    const zone = findClickedZone(point.x, point.y);
    if (zone) {
      gameState.selectedZoneId = zone.id;
      gameState.selectedClueId = null;
      gameState.dragOffsetX = point.x - zone.x;
      gameState.dragOffsetY = point.y - zone.y;
      gameState.isDragging = true;
    } else {
      deselectAll();
    }
  } else {
    const clue = findClickedRuntimeClue(point.x, point.y);
    if (clue) {
      gameState.selectedClueId = clue.id;
      gameState.selectedZoneId = null;
      gameState.dragOffsetX = point.x - clue.x;
      gameState.dragOffsetY = point.y - clue.y;
      gameState.isDragging = true;
    } else {
      deselectAll();
    }
  }
  updateEditorOverlay();
  render();
}

function getCanvasGameCoordinates(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (BASE_WIDTH / rect.width),
    y: (event.clientY - rect.top) * (BASE_HEIGHT / rect.height)
  };
}

function findClickedRuntimeClue(gameX, gameY) {
  for (let i = gameState.runtimeClues.length - 1; i >= 0; i -= 1) {
    const runtimeClue = gameState.runtimeClues[i];
    if (!gameState.editorMode && gameState.foundClues.has(runtimeClue.id)) continue;
    if (isPointInsideRect(gameX, gameY, runtimeClue.hitbox)) return runtimeClue;
  }
  return null;
}

function findClickedZone(gameX, gameY) {
  const zones = getCurrentLevel().placementZones || [];
  for (let i = zones.length - 1; i >= 0; i -= 1) {
    if (isPointInsideRect(gameX, gameY, zones[i])) return zones[i];
  }
  return null;
}

function isPointInsideRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function collectClue(runtimeClue) {
  gameState.foundClues.add(runtimeClue.id);
  gameState.score += 100;
  if (isLevelComplete()) {
    gameState.mode = "level_complete";
    showLevelCompleteOverlay();
  }
}

function handleWrongClick() {
  gameState.wrongClicks += 1;
  if (gameState.score > 0) gameState.score = Math.max(0, gameState.score - 10);
}

function isLevelComplete() {
  return gameState.foundClues.size >= getCurrentLevel().clues.length;
}

function updateUI() {
  const level = getCurrentLevel();
  if (levelNameElement) levelNameElement.textContent = level.name;
  if (scoreValueElement) scoreValueElement.textContent = String(gameState.score);
  if (wrongClickValueElement) wrongClickValueElement.textContent = String(gameState.wrongClicks);
  updateClueList();
}

function updateClueList() {
  if (!clueListElement) return;
  clueListElement.innerHTML = "";
  getCurrentLevel().clues.forEach((clue) => {
    const li = document.createElement("li");
    li.textContent = clue.name;
    if (gameState.foundClues.has(clue.id)) {
      li.classList.add("found");
      li.textContent = `✓ ${clue.name}`;
    }
    clueListElement.appendChild(li);
  });
}

function toggleEditorMode() {
  gameState.editorMode = !gameState.editorMode;
  if (gameState.editorMode) {
    gameState.debugZones = true;
    hideLevelCompleteOverlay();
    gameState.mode = "playing";
  } else {
    syncRuntimeCluesIntoEditorLevel();
    deselectAll();
    openExportPanel("full");
  }
  updateEditorOverlay();
  render();
}

function setEditorTool(tool) {
  gameState.editorTool = tool;
  deselectAll();
  if (tool === "zone") gameState.debugZones = true;
  updateEditorOverlay();
  render();
}

function deselectAll() {
  gameState.selectedClueId = null;
  gameState.selectedZoneId = null;
  gameState.isDragging = false;
}

function getSelectedRuntimeClue() {
  if (!gameState.selectedClueId) return null;
  return gameState.runtimeClues.find((clue) => clue.id === gameState.selectedClueId) || null;
}

function getSelectedZone() {
  if (!gameState.selectedZoneId) return null;
  const zones = getCurrentLevel().placementZones || [];
  return zones.find((zone) => zone.id === gameState.selectedZoneId) || null;
}

function updateRuntimeHitbox(runtimeClue) {
  runtimeClue.hitbox.x = runtimeClue.x;
  runtimeClue.hitbox.y = runtimeClue.y;
  runtimeClue.hitbox.width = runtimeClue.width;
  runtimeClue.hitbox.height = runtimeClue.height;
}

function nudgeSelectedItem(key, amount) {
  const delta = { x: 0, y: 0 };
  if (key === "ArrowLeft") delta.x = -amount;
  if (key === "ArrowRight") delta.x = amount;
  if (key === "ArrowUp") delta.y = -amount;
  if (key === "ArrowDown") delta.y = amount;

  if (gameState.editorTool === "clue") {
    const clue = getSelectedRuntimeClue();
    if (!clue) return;
    clue.x = clamp(clue.x + delta.x, 0, BASE_WIDTH - clue.width);
    clue.y = clamp(clue.y + delta.y, 0, BASE_HEIGHT - clue.height);
    updateRuntimeHitbox(clue);
  } else {
    const zone = getSelectedZone();
    if (!zone) return;
    zone.x = clamp(zone.x + delta.x, 0, BASE_WIDTH - zone.width);
    zone.y = clamp(zone.y + delta.y, 0, BASE_HEIGHT - zone.height);
  }
  updateEditorOverlay();
  render();
}

function resizeSelectedItem(factor) {
  if (!gameState.editorMode) return;

  if (gameState.editorTool === "clue") {
    const clue = getSelectedRuntimeClue();
    if (!clue) return;
    const centerX = clue.x + clue.width / 2;
    const centerY = clue.y + clue.height / 2;
    clue.width = clamp(Math.round(clue.width * factor), 8, 500);
    clue.height = clamp(Math.round(clue.height * factor), 8, 500);
    clue.x = clamp(Math.round(centerX - clue.width / 2), 0, BASE_WIDTH - clue.width);
    clue.y = clamp(Math.round(centerY - clue.height / 2), 0, BASE_HEIGHT - clue.height);
    updateRuntimeHitbox(clue);
  } else {
    const zone = getSelectedZone();
    if (!zone) return;
    const centerX = zone.x + zone.width / 2;
    const centerY = zone.y + zone.height / 2;
    zone.width = clamp(Math.round(zone.width * factor), 20, BASE_WIDTH);
    zone.height = clamp(Math.round(zone.height * factor), 20, BASE_HEIGHT);
    zone.x = clamp(Math.round(centerX - zone.width / 2), 0, BASE_WIDTH - zone.width);
    zone.y = clamp(Math.round(centerY - zone.height / 2), 0, BASE_HEIGHT - zone.height);
  }
  updateEditorOverlay();
  render();
}

function rotateSelectedClue(deltaDegrees) {
  const clue = getSelectedRuntimeClue();
  if (!clue) return;
  clue.rotation = Math.round((clue.rotation || 0) + deltaDegrees);
  updateEditorOverlay();
  render();
}

function toggleSelectedClueRandomize() {
  const clue = getSelectedRuntimeClue();
  if (!clue) return;
  clue.randomize = !clue.randomize;
  updateEditorOverlay();
  render();
}

function createNewZoneAtPointer() {
  const point = gameState.lastPointer || { x: BASE_WIDTH / 2, y: BASE_HEIGHT / 2 };
  createNewZone(Math.round(point.x - 80), Math.round(point.y - 35));
}

function createNewZoneAtCenter() {
  createNewZone(Math.round(BASE_WIDTH / 2 - 80), Math.round(BASE_HEIGHT / 2 - 35));
}

function createNewZone(x, y) {
  if (!gameState.editorMode) gameState.editorMode = true;
  setEditorTool("zone");
  const level = getCurrentLevel();
  if (!Array.isArray(level.placementZones)) level.placementZones = [];
  const type = "floor";
  const idBase = `${level.id}_${type}_zone`;
  const id = makeUniqueZoneId(idBase, level.placementZones);
  const zone = {
    id,
    label: "New floor zone",
    type,
    x: clamp(x, 0, BASE_WIDTH - 160),
    y: clamp(y, 0, BASE_HEIGHT - 70),
    width: 160,
    height: 70
  };
  level.placementZones.push(zone);
  gameState.selectedZoneId = zone.id;
  gameState.selectedClueId = null;
  updateEditorOverlay();
  render();
}

function makeUniqueZoneId(base, zones) {
  let index = 1;
  let id = `${base}_${index}`;
  while (zones.some((zone) => zone.id === id)) {
    index += 1;
    id = `${base}_${index}`;
  }
  return id;
}

function cycleSelectedZoneType() {
  const zone = getSelectedZone();
  if (!zone) return;
  const currentIndex = ZONE_TYPES.indexOf(zone.type);
  const nextType = ZONE_TYPES[(currentIndex + 1) % ZONE_TYPES.length];
  zone.type = nextType;
  zone.label = zone.label.replace(/New \w+ zone/, `New ${nextType} zone`);
  updateEditorOverlay();
  render();
}

function deleteSelectedZone() {
  const zone = getSelectedZone();
  if (!zone) return;
  const confirmed = window.confirm(`Delete placement zone "${zone.id}"?`);
  if (!confirmed) return;
  const level = getCurrentLevel();
  level.placementZones = level.placementZones.filter((item) => item.id !== zone.id);
  gameState.selectedZoneId = null;
  updateEditorOverlay();
  render();
}

function render() {
  clearCanvas();
  drawRoomBackground();
  drawClues();
  if (gameState.debugZones || gameState.editorTool === "zone") drawDebugPlacementZones();
  if (gameState.debugHitboxes || gameState.editorMode) drawDebugHitboxes();
  if (gameState.editorMode) drawEditorSelection();
  drawStatusText();
}

function clearCanvas() {
  ctx.clearRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
}

function drawRoomBackground() {
  const level = getCurrentLevel();
  const image = gameState.images[level.roomImage];
  if (!image || !image.complete || image.naturalWidth === 0) {
    drawFallbackBackground();
    return;
  }
  ctx.drawImage(image, 0, 0, BASE_WIDTH, BASE_HEIGHT);
}

function drawFallbackBackground() {
  ctx.fillStyle = "#1e1a17";
  ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
  ctx.fillStyle = "#f4e6c1";
  ctx.font = "32px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("Room background missing", BASE_WIDTH / 2, BASE_HEIGHT / 2 - 20);
  ctx.font = "18px Arial, sans-serif";
  ctx.fillText("Place the room image in assets/rooms/ with the filename used in data.js", BASE_WIDTH / 2, BASE_HEIGHT / 2 + 20);
}

function drawClues() {
  gameState.runtimeClues.forEach((runtimeClue) => {
    if (!gameState.editorMode && gameState.foundClues.has(runtimeClue.id)) return;
    const image = gameState.images[runtimeClue.source.image];
    if (!image || !image.complete || image.naturalWidth === 0) {
      drawMissingClueBox(runtimeClue);
      return;
    }
    drawRotatedImage(image, runtimeClue.x, runtimeClue.y, runtimeClue.width, runtimeClue.height, runtimeClue.rotation || 0);
  });
}

function drawRotatedImage(image, x, y, width, height, rotationDegrees) {
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((rotationDegrees * Math.PI) / 180);
  ctx.drawImage(image, -width / 2, -height / 2, width, height);
  ctx.restore();
}

function drawMissingClueBox(runtimeClue) {
  ctx.save();
  ctx.fillStyle = "rgba(120, 30, 30, 0.65)";
  ctx.fillRect(runtimeClue.x, runtimeClue.y, runtimeClue.width, runtimeClue.height);
  ctx.strokeStyle = "#f5d28c";
  ctx.lineWidth = 2;
  ctx.strokeRect(runtimeClue.x, runtimeClue.y, runtimeClue.width, runtimeClue.height);
  ctx.fillStyle = "#ffffff";
  ctx.font = "13px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(runtimeClue.id, runtimeClue.x + runtimeClue.width / 2, runtimeClue.y + runtimeClue.height / 2);
  ctx.restore();
}

function drawDebugHitboxes() {
  ctx.save();
  gameState.runtimeClues.forEach((runtimeClue) => {
    if (!gameState.editorMode && gameState.foundClues.has(runtimeClue.id)) return;
    ctx.strokeStyle = runtimeClue.id === gameState.selectedClueId ? "rgba(255, 230, 80, 1)" : "rgba(255, 40, 40, 0.95)";
    ctx.fillStyle = runtimeClue.id === gameState.selectedClueId ? "rgba(255, 230, 80, 0.16)" : "rgba(255, 40, 40, 0.12)";
    ctx.lineWidth = runtimeClue.id === gameState.selectedClueId ? 4 : 2;
    ctx.fillRect(runtimeClue.hitbox.x, runtimeClue.hitbox.y, runtimeClue.hitbox.width, runtimeClue.hitbox.height);
    ctx.strokeRect(runtimeClue.hitbox.x, runtimeClue.hitbox.y, runtimeClue.hitbox.width, runtimeClue.hitbox.height);
  });
  ctx.restore();
}

function drawDebugPlacementZones() {
  const zones = getCurrentLevel().placementZones || [];
  ctx.save();
  zones.forEach((zone) => {
    const selected = zone.id === gameState.selectedZoneId;
    ctx.fillStyle = getZoneFillColour(zone.type, selected);
    ctx.strokeStyle = getZoneStrokeColour(zone.type, selected);
    ctx.lineWidth = selected ? 4 : 2;
    ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
    ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = selected ? "bold 16px Arial, sans-serif" : "14px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`${zone.type}: ${zone.label}`, zone.x + 6, zone.y + 6);
  });
  ctx.restore();
}

function drawEditorSelection() {
  ctx.save();
  ctx.font = "14px Arial, sans-serif";
  ctx.textBaseline = "top";

  const clue = getSelectedRuntimeClue();
  if (clue) {
    ctx.fillStyle = "rgba(0,0,0,.72)";
    ctx.fillRect(clue.x, Math.max(0, clue.y - 42), 360, 38);
    ctx.fillStyle = "#ffe650";
    ctx.fillText(`${clue.id}  x:${Math.round(clue.x)} y:${Math.round(clue.y)} w:${Math.round(clue.width)} h:${Math.round(clue.height)} r:${Math.round(clue.rotation || 0)} rand:${clue.randomize}`, clue.x + 8, Math.max(0, clue.y - 34));
  }

  const zone = getSelectedZone();
  if (zone) {
    ctx.fillStyle = "rgba(0,0,0,.72)";
    ctx.fillRect(zone.x, Math.max(0, zone.y - 42), 420, 38);
    ctx.fillStyle = "#ffe650";
    ctx.fillText(`${zone.id}  type:${zone.type} x:${zone.x} y:${zone.y} w:${zone.width} h:${zone.height}`, zone.x + 8, Math.max(0, zone.y - 34));
  }

  ctx.restore();
}

function getZoneFillColour(type, selected) {
  const alpha = selected ? 0.32 : 0.18;
  switch (type) {
    case "floor": return `rgba(60, 160, 255, ${alpha})`;
    case "table": return `rgba(255, 190, 60, ${alpha})`;
    case "counter": return `rgba(180, 90, 255, ${alpha})`;
    case "chair":
    case "sofa": return `rgba(80, 220, 120, ${alpha})`;
    case "wall": return `rgba(255, 80, 170, ${alpha})`;
    default: return `rgba(255,255,255,${alpha})`;
  }
}

function getZoneStrokeColour(type, selected) {
  if (selected) return "rgba(255, 230, 80, 1)";
  switch (type) {
    case "floor": return "rgba(60, 160, 255, 0.95)";
    case "table": return "rgba(255, 190, 60, 0.95)";
    case "counter": return "rgba(180, 90, 255, 0.95)";
    case "chair":
    case "sofa": return "rgba(80, 220, 120, 0.95)";
    case "wall": return "rgba(255, 80, 170, 0.95)";
    default: return "rgba(255,255,255,.95)";
  }
}

function drawStatusText() {
  if (gameState.mode !== "loading") return;
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
  ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
  ctx.fillStyle = "#f5d28c";
  ctx.font = "36px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("Loading Evidence...", BASE_WIDTH / 2, BASE_HEIGHT / 2);
  ctx.restore();
}

function updateEditorOverlay() {
  if (!editorHelpOverlay) return;
  editorHelpOverlay.classList.toggle("hidden", !gameState.editorMode);
  if (!editorModeLabel) return;
  const selected = gameState.editorTool === "clue" ? gameState.selectedClueId : gameState.selectedZoneId;
  editorModeLabel.textContent = `EDITOR: ${gameState.editorTool.toUpperCase()}${selected ? ` · ${selected}` : ""}`;
}

function hideLoadingOverlay() {
  if (loadingOverlay) loadingOverlay.classList.add("hidden");
}

function showLevelCompleteOverlay() {
  if (!levelCompleteOverlay) return;
  const level = getCurrentLevel();
  const finalLevel = gameState.currentLevelIndex >= editorData.levels.length - 1;
  levelCompleteOverlay.classList.remove("hidden");
  const heading = levelCompleteOverlay.querySelector("h2");
  if (heading) heading.textContent = `${level.name} Complete`;
  if (nextLevelButton) nextLevelButton.textContent = finalLevel ? "Finish Game" : "Next Room";
}

function showGameCompleteOverlay() {
  if (!levelCompleteOverlay) return;
  levelCompleteOverlay.classList.remove("hidden");
  const heading = levelCompleteOverlay.querySelector("h2");
  if (heading) heading.textContent = "Investigation Complete";
  if (nextLevelButton) nextLevelButton.style.display = "none";
}

function hideLevelCompleteOverlay() {
  if (!levelCompleteOverlay) return;
  levelCompleteOverlay.classList.add("hidden");
  if (nextLevelButton) nextLevelButton.style.display = "";
}

function saveEditorDraftToLocalStorage() {
  syncRuntimeCluesIntoEditorLevel();
  const payload = { settings: editorData.settings, levels: editorData.levels, savedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  openExportPanel("message", "Editor draft saved in this browser. This does not replace data.js until you export/download it.");
}

function loadEditorDraftFromLocalStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    openExportPanel("message", "No browser draft found yet. Press S after editing to save one.");
    return;
  }
  try {
    const payload = JSON.parse(raw);
    editorData.settings = payload.settings || editorData.settings;
    editorData.levels = payload.levels || editorData.levels;
    startLevel(gameState.currentLevelIndex);
    openExportPanel("message", "Browser draft loaded into the editor.");
  } catch (error) {
    console.error(error);
    openExportPanel("message", "Could not load browser draft. See console for details.");
  }
}

function exportCurrentLevelToObject() {
  syncRuntimeCluesIntoEditorLevel();
  return deepClone(getCurrentLevel());
}

function buildDataObjectForExport() {
  syncRuntimeCluesIntoEditorLevel();
  return {
    settings: editorData.settings,
    levels: editorData.levels
  };
}

function buildFullDataJsExport() {
  const dataObject = buildDataObjectForExport();
  return `/*\n  TIKUS: Hidden Evidence\n  data.js\n\n  Exported from the in-game editor on ${new Date().toLocaleString()}.\n*/\n\nconst GAME_DATA = ${stringifyForDataJs(dataObject)};\n`;
}

function buildCurrentLevelExport() {
  const level = exportCurrentLevelToObject();
  return `/* Current level export: ${level.id} */\n${stringifyForDataJs(level)};\n`;
}

function buildSelectedItemExport() {
  if (gameState.editorTool === "clue") {
    const clue = getSelectedRuntimeClue();
    if (!clue) return "No selected clue.";
    const dataClue = runtimeClueToDataClue(clue);
    return stringifyForDataJs(dataClue);
  }
  const zone = getSelectedZone();
  if (!zone) return "No selected zone.";
  return stringifyForDataJs(zone);
}

function runtimeClueToDataClue(runtimeClue) {
  const source = runtimeClue.source;
  return {
    id: source.id,
    name: source.name,
    image: source.image,
    randomize: runtimeClue.randomize === true,
    placementTypes: source.placementTypes || [],
    x: Math.round(runtimeClue.x),
    y: Math.round(runtimeClue.y),
    width: Math.max(1, Math.round(runtimeClue.width / CLUE_SCALE)),
    height: Math.max(1, Math.round(runtimeClue.height / CLUE_SCALE)),
    rotation: Math.round(runtimeClue.rotation || 0),
    description: source.description || ""
  };
}

function stringifyForDataJs(value) {
  return JSON.stringify(value, null, 2)
    .replace(/"([a-zA-Z_$][a-zA-Z0-9_$]*)":/g, "$1:");
}

function openExportPanel(mode = "full", message = "") {
  if (!exportModal || !exportText) return;
  let text = "";
  if (mode === "selected") text = buildSelectedItemExport();
  else if (mode === "level") text = buildCurrentLevelExport();
  else if (mode === "message") text = message;
  else text = buildFullDataJsExport();
  exportText.value = text;
  exportModal.classList.remove("hidden");
  if (exportStatus) exportStatus.textContent = mode === "message" ? message : "Export generated. Copy it or download data.js.";
  setTimeout(() => exportText.focus(), 0);
}

function closeExportPanel() {
  if (exportModal) exportModal.classList.add("hidden");
}

async function copyExportToClipboard() {
  if (!exportText) return;
  try {
    await navigator.clipboard.writeText(exportText.value);
    if (exportStatus) exportStatus.textContent = "Copied to clipboard.";
  } catch (error) {
    exportText.select();
    document.execCommand("copy");
    if (exportStatus) exportStatus.textContent = "Copied. If it did not work, select the text manually and press Ctrl+C.";
  }
}

function copySelectedItemToExportPanel() {
  openExportPanel("selected");
}

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/javascript;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  if (exportStatus) exportStatus.textContent = `${filename} downloaded.`;
}
