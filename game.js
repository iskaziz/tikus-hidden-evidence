/*
  TIKUS: Hidden Evidence
  game.js

  Updated hidden-object engine.

  Features:
  - World-logic clue randomisation
  - Placement zones per room
  - Clues only randomise into matching zone types
  - Fixed clues use authored coordinates
  - 20% clue size reduction via clueScale: 0.8
  - Runtime clue positions do not mutate GAME_DATA
  - H toggles hitboxes
  - Z toggles placement zones
  - Pointer events for mouse and mobile touch
*/

"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const clueListElement = document.getElementById("clueList");
const scoreValueElement = document.getElementById("scoreValue");
const wrongClickValueElement = document.getElementById("wrongClickValue");
const levelNameElement = document.getElementById("levelName");

const levelCompleteOverlay = document.getElementById("levelCompleteOverlay");
const restartButton = document.getElementById("restartButton");
const nextLevelButton = document.getElementById("nextLevelButton");

const BASE_WIDTH = GAME_DATA.settings.baseWidth;
const BASE_HEIGHT = GAME_DATA.settings.baseHeight;
const CLUE_SCALE = GAME_DATA.settings.clueScale || 1;

canvas.width = BASE_WIDTH;
canvas.height = BASE_HEIGHT;

const gameState = {
  currentLevelIndex: 0,
  mode: "loading",

  images: {},
  foundClues: new Set(),

  runtimeClues: [],

  score: 0,
  wrongClicks: 0,

  debugHitboxes: false,
  debugZones: false
};

window.addEventListener("load", initGame);

function initGame() {
  bindEvents();
  loadAllImages();
}

function bindEvents() {
  canvas.addEventListener("pointerdown", handleCanvasPointerDown);

  if (restartButton) {
    restartButton.addEventListener("click", restartLevel);
  }

  if (nextLevelButton) {
    nextLevelButton.addEventListener("click", goToNextLevel);
  }

  window.addEventListener("keydown", handleDebugKeys);
}

function handleDebugKeys(event) {
  const key = event.key.toLowerCase();

  if (key === "h") {
    gameState.debugHitboxes = !gameState.debugHitboxes;
    render();
  }

  if (key === "z") {
    gameState.debugZones = !gameState.debugZones;
    render();
  }
}

function getCurrentLevel() {
  return GAME_DATA.levels[gameState.currentLevelIndex];
}

function loadAllImages() {
  const imagePaths = collectImagePaths();

  let loadedCount = 0;
  const totalImages = imagePaths.length;

  if (totalImages === 0) {
    console.warn("No images found to load.");
    startLevel(0);
    return;
  }

  imagePaths.forEach((path) => {
    const image = new Image();

    image.onload = () => {
      loadedCount += 1;

      if (loadedCount === totalImages) {
        startLevel(0);
      }
    };

    image.onerror = () => {
      console.error("Failed to load image:", path);
      loadedCount += 1;

      if (loadedCount === totalImages) {
        startLevel(0);
      }
    };

    image.src = path;
    gameState.images[path] = image;
  });
}

function collectImagePaths() {
  const paths = new Set();

  GAME_DATA.levels.forEach((level) => {
    paths.add(level.roomImage);

    level.clues.forEach((clue) => {
      paths.add(clue.image);
    });
  });

  return Array.from(paths);
}

function startLevel(levelIndex) {
  gameState.currentLevelIndex = levelIndex;
  gameState.mode = "playing";
  gameState.foundClues = new Set();
  gameState.score = 0;
  gameState.wrongClicks = 0;

  buildRuntimeCluesForCurrentLevel();

  hideLevelCompleteOverlay();
  updateUI();
  render();
}

function buildRuntimeCluesForCurrentLevel() {
  const level = getCurrentLevel();

  gameState.runtimeClues = level.clues.map((clue) => {
    const scaledWidth = Math.round(clue.width * CLUE_SCALE);
    const scaledHeight = Math.round(clue.height * CLUE_SCALE);

    let position;

    const shouldRandomize =
      GAME_DATA.settings.randomizeClueLocations === true &&
      clue.randomize === true;

    if (shouldRandomize) {
      position = getRandomValidPositionForClue(level, clue, scaledWidth, scaledHeight);
    } else {
      position = {
        x: clue.x,
        y: clue.y,
        zoneId: null
      };
    }

    return {
      id: clue.id,
      source: clue,

      x: position.x,
      y: position.y,
      width: scaledWidth,
      height: scaledHeight,

      hitbox: {
        x: position.x,
        y: position.y,
        width: scaledWidth,
        height: scaledHeight
      },

      placementZoneId: position.zoneId || null
    };
  });
}

function getRandomValidPositionForClue(level, clue, clueWidth, clueHeight) {
  const matchingZones = getMatchingZonesForClue(level, clue, clueWidth, clueHeight);

  if (matchingZones.length === 0) {
    console.warn(
      `No valid placement zone found for clue "${clue.id}". Falling back to authored position.`
    );

    return {
      x: clue.x,
      y: clue.y,
      zoneId: null
    };
  }

  const selectedZone = pickRandomItem(matchingZones);

  const maxX = selectedZone.x + selectedZone.width - clueWidth;
  const maxY = selectedZone.y + selectedZone.height - clueHeight;

  const randomX = randomInteger(selectedZone.x, maxX);
  const randomY = randomInteger(selectedZone.y, maxY);

  return {
    x: randomX,
    y: randomY,
    zoneId: selectedZone.id
  };
}

function getMatchingZonesForClue(level, clue, clueWidth, clueHeight) {
  if (!Array.isArray(level.placementZones)) {
    return [];
  }

  if (!Array.isArray(clue.placementTypes)) {
    return [];
  }

  return level.placementZones.filter((zone) => {
    const typeMatches = clue.placementTypes.includes(zone.type);
    const clueFitsInsideZone = clueWidth <= zone.width && clueHeight <= zone.height;

    return typeMatches && clueFitsInsideZone;
  });
}

function pickRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInteger(min, max) {
  const safeMin = Math.ceil(min);
  const safeMax = Math.floor(max);

  if (safeMax <= safeMin) {
    return safeMin;
  }

  return Math.floor(Math.random() * (safeMax - safeMin + 1)) + safeMin;
}

function restartLevel() {
  startLevel(gameState.currentLevelIndex);
}

function goToNextLevel() {
  const nextIndex = gameState.currentLevelIndex + 1;

  if (nextIndex >= GAME_DATA.levels.length) {
    gameState.mode = "game_complete";
    showGameCompleteOverlay();
    render();
    return;
  }

  startLevel(nextIndex);
}

function handleCanvasPointerDown(event) {
  event.preventDefault();

  if (gameState.mode !== "playing") {
    return;
  }

  const point = getCanvasGameCoordinates(event);
  const clickedClue = findClickedClue(point.x, point.y);

  if (clickedClue) {
    collectClue(clickedClue);
  } else {
    handleWrongClick();
  }

  updateUI();
  render();
}

function getCanvasGameCoordinates(event) {
  const rect = canvas.getBoundingClientRect();

  const scaleX = BASE_WIDTH / rect.width;
  const scaleY = BASE_HEIGHT / rect.height;

  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;

  return { x, y };
}

function findClickedClue(gameX, gameY) {
  for (let i = gameState.runtimeClues.length - 1; i >= 0; i -= 1) {
    const runtimeClue = gameState.runtimeClues[i];

    if (gameState.foundClues.has(runtimeClue.id)) {
      continue;
    }

    if (isPointInsideRect(gameX, gameY, runtimeClue.hitbox)) {
      return runtimeClue;
    }
  }

  return null;
}

function isPointInsideRect(x, y, rect) {
  return (
    x >= rect.x &&
    x <= rect.x + rect.width &&
    y >= rect.y &&
    y <= rect.y + rect.height
  );
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

  if (gameState.score > 0) {
    gameState.score = Math.max(0, gameState.score - 10);
  }
}

function isLevelComplete() {
  const level = getCurrentLevel();
  return gameState.foundClues.size >= level.clues.length;
}

function updateUI() {
  updateLevelName();
  updateScore();
  updateClueList();
}

function updateLevelName() {
  const level = getCurrentLevel();

  if (levelNameElement) {
    levelNameElement.textContent = level.name;
  }
}

function updateScore() {
  if (scoreValueElement) {
    scoreValueElement.textContent = String(gameState.score);
  }

  if (wrongClickValueElement) {
    wrongClickValueElement.textContent = String(gameState.wrongClicks);
  }
}

function updateClueList() {
  if (!clueListElement) {
    return;
  }

  const level = getCurrentLevel();

  clueListElement.innerHTML = "";

  level.clues.forEach((clue) => {
    const listItem = document.createElement("li");
    listItem.textContent = clue.name;

    if (gameState.foundClues.has(clue.id)) {
      listItem.classList.add("found");
      listItem.textContent = `✓ ${clue.name}`;
    }

    clueListElement.appendChild(listItem);
  });
}

function render() {
  clearCanvas();
  drawRoomBackground();
  drawClues();

  if (gameState.debugZones) {
    drawDebugPlacementZones();
  }

  if (gameState.debugHitboxes) {
    drawDebugHitboxes();
  }

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
  ctx.fillText("Room background missing", BASE_WIDTH / 2, BASE_HEIGHT / 2);
}

function drawClues() {
  gameState.runtimeClues.forEach((runtimeClue) => {
    if (gameState.foundClues.has(runtimeClue.id)) {
      return;
    }

    const clue = runtimeClue.source;
    const image = gameState.images[clue.image];

    if (!image || !image.complete || image.naturalWidth === 0) {
      drawMissingClueBox(runtimeClue);
      return;
    }

    ctx.drawImage(
      image,
      runtimeClue.x,
      runtimeClue.y,
      runtimeClue.width,
      runtimeClue.height
    );
  });
}

function drawMissingClueBox(runtimeClue) {
  ctx.save();

  ctx.fillStyle = "rgba(120, 30, 30, 0.65)";
  ctx.fillRect(runtimeClue.x, runtimeClue.y, runtimeClue.width, runtimeClue.height);

  ctx.strokeStyle = "#f5d28c";
  ctx.lineWidth = 2;
  ctx.strokeRect(runtimeClue.x, runtimeClue.y, runtimeClue.width, runtimeClue.height);

  ctx.fillStyle = "#ffffff";
  ctx.font = "14px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    "Missing",
    runtimeClue.x + runtimeClue.width / 2,
    runtimeClue.y + runtimeClue.height / 2
  );

  ctx.restore();
}

function drawDebugHitboxes() {
  ctx.save();

  gameState.runtimeClues.forEach((runtimeClue) => {
    if (gameState.foundClues.has(runtimeClue.id)) {
      return;
    }

    ctx.strokeStyle = "rgba(255, 40, 40, 0.95)";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      runtimeClue.hitbox.x,
      runtimeClue.hitbox.y,
      runtimeClue.hitbox.width,
      runtimeClue.hitbox.height
    );

    ctx.fillStyle = "rgba(255, 40, 40, 0.18)";
    ctx.fillRect(
      runtimeClue.hitbox.x,
      runtimeClue.hitbox.y,
      runtimeClue.hitbox.width,
      runtimeClue.hitbox.height
    );
  });

  ctx.restore();
}

function drawDebugPlacementZones() {
  const level = getCurrentLevel();

  if (!Array.isArray(level.placementZones)) {
    return;
  }

  ctx.save();

  level.placementZones.forEach((zone) => {
    ctx.fillStyle = getZoneFillColour(zone.type);
    ctx.strokeStyle = getZoneStrokeColour(zone.type);
    ctx.lineWidth = 2;

    ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
    ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);

    ctx.fillStyle = "#ffffff";
    ctx.font = "15px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    const label = `${zone.type}: ${zone.label}`;
    ctx.fillText(label, zone.x + 6, zone.y + 6);
  });

  ctx.restore();
}

function getZoneFillColour(type) {
  switch (type) {
    case "floor":
      return "rgba(60, 160, 255, 0.18)";
    case "table":
      return "rgba(255, 190, 60, 0.20)";
    case "counter":
      return "rgba(180, 90, 255, 0.20)";
    case "chair":
    case "sofa":
      return "rgba(80, 220, 120, 0.20)";
    case "wall":
      return "rgba(255, 80, 170, 0.20)";
    default:
      return "rgba(255, 255, 255, 0.15)";
  }
}

function getZoneStrokeColour(type) {
  switch (type) {
    case "floor":
      return "rgba(60, 160, 255, 0.95)";
    case "table":
      return "rgba(255, 190, 60, 0.95)";
    case "counter":
      return "rgba(180, 90, 255, 0.95)";
    case "chair":
    case "sofa":
      return "rgba(80, 220, 120, 0.95)";
    case "wall":
      return "rgba(255, 80, 170, 0.95)";
    default:
      return "rgba(255, 255, 255, 0.95)";
  }
}

function drawStatusText() {
  if (gameState.mode === "loading") {
    ctx.save();

    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

    ctx.fillStyle = "#f5d28c";
    ctx.font = "36px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("Loading Evidence...", BASE_WIDTH / 2, BASE_HEIGHT / 2);

    ctx.restore();
  }
}

function showLevelCompleteOverlay() {
  if (!levelCompleteOverlay) {
    return;
  }

  const level = getCurrentLevel();
  const finalLevel = gameState.currentLevelIndex >= GAME_DATA.levels.length - 1;

  levelCompleteOverlay.classList.remove("hidden");

  const heading = levelCompleteOverlay.querySelector("h2");

  if (heading) {
    heading.textContent = `${level.name} Complete`;
  }

  if (nextLevelButton) {
    nextLevelButton.textContent = finalLevel ? "Finish Game" : "Next Room";
  }
}

function showGameCompleteOverlay() {
  if (!levelCompleteOverlay) {
    return;
  }

  levelCompleteOverlay.classList.remove("hidden");

  const heading = levelCompleteOverlay.querySelector("h2");

  if (heading) {
    heading.textContent = "Investigation Complete";
  }

  if (nextLevelButton) {
    nextLevelButton.style.display = "none";
  }
}

function hideLevelCompleteOverlay() {
  if (!levelCompleteOverlay) {
    return;
  }

  levelCompleteOverlay.classList.add("hidden");

  if (nextLevelButton) {
    nextLevelButton.style.display = "";
  }
}
