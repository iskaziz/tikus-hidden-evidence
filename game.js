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
const timerValueElement = document.getElementById("timerValue");
const levelNameElement = document.getElementById("levelName");

const loadingOverlay = document.getElementById("loadingOverlay");
const levelCompleteOverlay = document.getElementById("levelCompleteOverlay");
const restartButton = document.getElementById("restartButton");
const nextLevelButton = document.getElementById("nextLevelButton");
const editorHelpOverlay = document.getElementById("editorHelpOverlay");
const editorModeLabel = document.getElementById("editorModeLabel");

const roomIntroOverlay = document.getElementById("roomIntroOverlay");
const introRoomName = document.getElementById("introRoomName");
const introRoomText = document.getElementById("introRoomText");
const introCharacterPanel = document.getElementById("introCharacterPanel");
const introCharacterImage = document.getElementById("introCharacterImage");
const introCharacterName = document.getElementById("introCharacterName");
const introCharacterLine = document.getElementById("introCharacterLine");
const startRoomButton = document.getElementById("startRoomButton");
const feedbackToast = document.getElementById("feedbackToast");
const foundEvidencePopup = document.getElementById("foundEvidencePopup");
const foundEvidenceName = document.getElementById("foundEvidenceName");
const foundEvidenceDetail = document.getElementById("foundEvidenceDetail");
const levelReport = document.getElementById("levelReport");

const exportModal = document.getElementById("exportModal");
const exportText = document.getElementById("exportText");
const exportStatus = document.getElementById("exportStatus");
const copyExportButton = document.getElementById("copyExportButton");
const downloadDataButton = document.getElementById("downloadDataButton");
const downloadLevelButton = document.getElementById("downloadLevelButton");
const closeExportButton = document.getElementById("closeExportButton");

const appShell = document.getElementById("appShell");
const canvasFrame = document.getElementById("canvasFrame");
const mobileOrientationOverlay = document.getElementById("mobileOrientationOverlay");
const rotateScreenButton = document.getElementById("rotateScreenButton");

const mainMenuOverlay = document.getElementById("mainMenuOverlay");
const startGameButton = document.getElementById("startGameButton");
const menuHighScore = document.getElementById("menuHighScore");
const highScoreValue = document.getElementById("highScoreValue");
const endChooseLevelButton = document.getElementById("endChooseLevelButton");
const endLevelSelectPanel = document.getElementById("endLevelSelectPanel");
const endLevelSelectGrid = document.getElementById("endLevelSelectGrid");

const feiskLogoButton = document.getElementById("feiskLogoButton");
const editorKeypadModal = document.getElementById("editorKeypadModal");
const editorCodeDisplay = document.getElementById("editorCodeDisplay");
const editorKeypadStatus = document.getElementById("editorKeypadStatus");
const closeEditorKeypadButton = document.getElementById("closeEditorKeypadButton");
const clearEditorCodeButton = document.getElementById("clearEditorCodeButton");
const submitEditorCodeButton = document.getElementById("submitEditorCodeButton");

const BASE_WIDTH = GAME_DATA.settings.baseWidth;
const BASE_HEIGHT = GAME_DATA.settings.baseHeight;
const CLUE_SCALE = GAME_DATA.settings.clueScale || 1;
const TIMER_DURATION_SECONDS = Number(GAME_DATA.settings.timerDurationSeconds || 20);
const CLUE_TIME_BONUS_SECONDS = Number(GAME_DATA.settings.clueTimeBonusSeconds || 0);
const WRONG_CLICK_PENALTY = Number(GAME_DATA.settings.wrongClickPenalty || 10);
const COMBO_BONUS_STEP = Number(GAME_DATA.settings.comboBonusStep || 25);
const COMBO_WINDOW_SECONDS = Number(GAME_DATA.settings.comboWindowSeconds || 4);
const MOUSE_BONUS = Number(GAME_DATA.settings.mouseBonus || 25);
const SOUND_PATHS = {
  clueFound: "assets/audio/clue_twang.wav",
  levelComplete: "assets/audio/level_complete_chime.wav",
  timeUp: "assets/audio/time_up_buzzer.wav"
};
const STORAGE_KEY = "TIKUS_HIDDEN_EVIDENCE_EDITOR_DRAFT_V1";
const PROGRESS_KEY = "TIKUS_HIDDEN_EVIDENCE_PROGRESS_V1";
const ZONE_TYPES = ["floor", "table", "counter", "chair", "sofa", "wall"];
const EDITOR_ACCESS_CODE = "0707";
const LOGO_TAP_WINDOW_MS = 1400;

canvas.width = BASE_WIDTH;
canvas.height = BASE_HEIGHT;

const editorData = {
  settings: deepClone(GAME_DATA.settings),
  levels: deepClone(GAME_DATA.levels)
};

const audioState = {
  sounds: {},
  unlocked: false
};

const gameState = {
  currentLevelIndex: 0,
  mode: "loading",
  totalRunScore: 0,
  currentLevelScoreBanked: false,
  progress: loadPlayerProgress(),
  images: {},
  foundClues: new Set(),
  runtimeClues: [],
  score: 0,
  wrongClicks: 0,
  comboStreak: 0,
  lastFoundAt: 0,
  currentLevelTimeBonus: 0,
  currentLevelStars: 0,
  currentLevelCompletedClues: [],
  foundLevelIds: new Set(),
  wrongFlashUntil: 0,
  toastUntil: 0,
  toastText: "",
  toastKind: "",
  foundEvidencePopupTimeout: null,
  editorUnlocked: false,
  logoTapCount: 0,
  lastLogoTapAt: 0,
  editorCodeInput: "",
  mouse: {
    active: false,
    x: -80,
    y: 620,
    width: 42,
    height: 18,
    speed: 90,
    direction: 1,
    bonusAvailable: true
  },
  timerRemaining: TIMER_DURATION_SECONDS,
  timerIntervalId: null,
  timerLastTick: 0,
  debugHitboxes: false,
  debugZones: false,

  editorMode: false,
  editorTool: "clue", // clue or zone
  selectedClueId: null,
  selectedZoneId: null,
  hoveredClueId: null,
  isDragging: false,
  dragOffsetX: 0,
  dragOffsetY: 0,
  lastPointer: { x: 0, y: 0 }
};

window.addEventListener("load", initGame);

function initGame() {
  loadGameAudio();
  bindEvents();
  updateMobileLayout();
  loadAllImages();
}

function bindEvents() {
  canvas.addEventListener("pointerdown", handleCanvasPointerDown);
  canvas.addEventListener("pointermove", handleCanvasPointerMove);
  canvas.addEventListener("pointerup", handleCanvasPointerUp);
  canvas.addEventListener("pointercancel", handleCanvasPointerUp);
  canvas.addEventListener("pointerleave", clearClueHover);

  if (restartButton) restartButton.addEventListener("click", restartLevel);
  if (nextLevelButton) nextLevelButton.addEventListener("click", goToNextLevel);
  if (endChooseLevelButton) endChooseLevelButton.addEventListener("click", toggleEndLevelSelectPanel);
  if (startGameButton) startGameButton.addEventListener("click", startNewGameFromMenu);
  if (copyExportButton) copyExportButton.addEventListener("click", copyExportToClipboard);
  if (downloadDataButton) downloadDataButton.addEventListener("click", () => downloadTextFile("data.js", buildFullDataJsExport()));
  if (downloadLevelButton) downloadLevelButton.addEventListener("click", () => downloadTextFile(`${getCurrentLevel().id}_level_export.js`, buildCurrentLevelExport()));
  if (closeExportButton) closeExportButton.addEventListener("click", closeExportPanel);
  if (rotateScreenButton) rotateScreenButton.addEventListener("click", handleRotateScreenButton);
  if (feiskLogoButton) {
    feiskLogoButton.addEventListener("click", handleLogoSecretTap);
    feiskLogoButton.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleLogoSecretTap();
      }
    });
  }
  if (closeEditorKeypadButton) closeEditorKeypadButton.addEventListener("click", closeEditorKeypad);
  if (clearEditorCodeButton) clearEditorCodeButton.addEventListener("click", clearEditorCode);
  if (submitEditorCodeButton) submitEditorCodeButton.addEventListener("click", submitEditorCode);
  document.querySelectorAll("[data-keypad-number]").forEach((button) => {
    button.addEventListener("click", () => addEditorCodeDigit(button.dataset.keypadNumber));
  });
  if (startRoomButton) startRoomButton.addEventListener("click", beginCurrentRoomSearch);

  window.addEventListener("pointerdown", unlockGameAudio, { once: true });
  window.addEventListener("keydown", unlockGameAudio, { once: true });

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("resize", updateMobileLayout);
  window.addEventListener("orientationchange", () => setTimeout(updateMobileLayout, 150));
  document.addEventListener("fullscreenchange", updateMobileLayout);

  document.querySelectorAll("[data-editor-action]").forEach((button) => {
    button.addEventListener("click", () => handleEditorButtonAction(button.dataset.editorAction));
  });
}

function clearClueHover() {
  if (gameState.hoveredClueId) {
    gameState.hoveredClueId = null;
    canvas.style.cursor = "default";
    render();
  }
}

function handleEditorButtonAction(action) {
  if (!gameState.editorUnlocked && action !== "toggleEditor") return;
  if (action === "toggleEditor" && !gameState.editorUnlocked) {
    openEditorKeypad();
    return;
  }
  switch (action) {
    case "toggleEditor": toggleEditorMode(); break;
    case "clueMode": setEditorTool("clue"); break;
    case "zoneMode": setEditorTool("zone"); break;
    case "newZone": createNewZoneAtCenter(); break;
    case "smaller": resizeSelectedItem(0.95); break;
    case "larger": resizeSelectedItem(1.05); break;
    case "rotateLeft": rotateSelectedClue(-5); break;
    case "rotateRight": rotateSelectedClue(5); break;
    case "opacityDown": adjustSelectedClueVisual("opacity", -0.05); break;
    case "opacityUp": adjustSelectedClueVisual("opacity", 0.05); break;
    case "saturationDown": adjustSelectedClueVisual("saturation", -0.1); break;
    case "saturationUp": adjustSelectedClueVisual("saturation", 0.1); break;
    case "brightnessDown": adjustSelectedClueVisual("brightness", -0.1); break;
    case "brightnessUp": adjustSelectedClueVisual("brightness", 0.1); break;
    case "zoneWidthDown": resizeSelectedZoneDimension(-10, 0); break;
    case "zoneWidthUp": resizeSelectedZoneDimension(10, 0); break;
    case "zoneHeightDown": resizeSelectedZoneDimension(0, -10); break;
    case "zoneHeightUp": resizeSelectedZoneDimension(0, 10); break;
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
    if (gameState.editorMode) {
      event.preventDefault();
      toggleEditorMode();
    }
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
    if (event.altKey && gameState.editorTool === "zone") {
      resizeSelectedZoneWithArrow(key, amount * 2);
    } else {
      nudgeSelectedItem(key, amount);
    }
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
    case "o":
      event.preventDefault();
      adjustSelectedClueVisual("opacity", -0.05);
      break;
    case "p":
      event.preventDefault();
      adjustSelectedClueVisual("opacity", 0.05);
      break;
    case "k":
      event.preventDefault();
      adjustSelectedClueVisual("saturation", -0.1);
      break;
    case "l":
      event.preventDefault();
      adjustSelectedClueVisual("saturation", 0.1);
      break;
    case "b":
      event.preventDefault();
      adjustSelectedClueVisual("brightness", -0.1);
      break;
    case "v":
      event.preventDefault();
      adjustSelectedClueVisual("brightness", 0.1);
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


function loadGameAudio() {
  Object.entries(SOUND_PATHS).forEach(([name, path]) => {
    const audio = new Audio(path);
    audio.preload = "auto";
    audio.volume = 0.85;
    audioState.sounds[name] = audio;
  });
}

function unlockGameAudio() {
  if (audioState.unlocked) return;
  audioState.unlocked = true;

  Object.values(audioState.sounds).forEach((audio) => {
    const originalVolume = audio.volume;
    audio.volume = 0;

    const playAttempt = audio.play();
    if (playAttempt && typeof playAttempt.then === "function") {
      playAttempt
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.volume = originalVolume;
        })
        .catch(() => {
          audio.volume = originalVolume;
        });
    } else {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = originalVolume;
    }
  });
}

function playGameSound(soundName) {
  const audio = audioState.sounds[soundName];
  if (!audio) return;

  try {
    const sound = audio.cloneNode(true);
    sound.volume = audio.volume;
    sound.currentTime = 0;

    const playAttempt = sound.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch((error) => {
        console.warn(`Sound could not play: ${soundName}`, error);
      });
    }
  } catch (error) {
    console.warn(`Sound could not play: ${soundName}`, error);
  }
}

function loadAllImages() {
  const imagePaths = collectImagePaths();
  let loadedCount = 0;
  const totalImages = imagePaths.length;

  if (totalImages === 0) {
    showMainMenu();
    return;
  }

  imagePaths.forEach((path) => {
    const image = new Image();
    image.onload = () => {
      loadedCount += 1;
      if (loadedCount === totalImages) showMainMenu();
    };
    image.onerror = () => {
      console.error("Failed to load image:", path);
      loadedCount += 1;
      if (loadedCount === totalImages) showMainMenu();
    };
    image.src = path;
    gameState.images[path] = image;
  });
}

function collectImagePaths() {
  const paths = new Set();
  editorData.levels.forEach((level) => {
    paths.add(level.roomImage);
    if (level.introCharacterImage) paths.add(level.introCharacterImage);
    level.clues.forEach((clue) => paths.add(clue.image));
  });
  return Array.from(paths);
}


function loadPlayerProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
    return {
      allLevelsCompleted: saved.allLevelsCompleted === true,
      highScore: Number(saved.highScore || 0)
    };
  } catch (error) {
    return { allLevelsCompleted: false, highScore: 0 };
  }
}

function savePlayerProgress() {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(gameState.progress));
}

function showMainMenu() {
  stopLevelTimer();
  gameState.mode = "menu";
  hideLoadingOverlay();
  hideLevelCompleteOverlay();
  if (roomIntroOverlay) roomIntroOverlay.classList.add("hidden");
  if (mainMenuOverlay) mainMenuOverlay.classList.remove("hidden");
  updateMainMenuUI();
  render();
}

function hideMainMenu() {
  if (mainMenuOverlay) mainMenuOverlay.classList.add("hidden");
}

function updateMainMenuUI() {
  const unlocked = gameState.progress.allLevelsCompleted === true;
  if (menuHighScore) menuHighScore.classList.toggle("hidden", !unlocked);
  if (highScoreValue) highScoreValue.textContent = String(gameState.progress.highScore || 0);
}

function buildLevelSelectGrid() {
  if (!endLevelSelectGrid) return;
  endLevelSelectGrid.innerHTML = "";
  editorData.levels.forEach((level, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = level.name;
    button.addEventListener("click", () => startSelectedLevel(index));
    endLevelSelectGrid.appendChild(button);
  });
}

function toggleEndLevelSelectPanel() {
  if (!gameState.progress.allLevelsCompleted || !endLevelSelectPanel) return;
  buildLevelSelectGrid();
  endLevelSelectPanel.classList.toggle("hidden");
}

function startNewGameFromMenu() {
  gameState.totalRunScore = 0;
  gameState.foundLevelIds = new Set();
  hideMainMenu();
  startLevel(0);
}

function startSelectedLevel(levelIndex) {
  if (!gameState.progress.allLevelsCompleted) return;
  gameState.totalRunScore = 0;
  gameState.foundLevelIds = new Set();
  hideMainMenu();
  hideLevelCompleteOverlay();
  if (endLevelSelectPanel) endLevelSelectPanel.classList.add("hidden");
  startLevel(levelIndex);
}

function updateHighScoreAfterGameComplete() {
  gameState.progress.allLevelsCompleted = true;
  gameState.progress.highScore = Math.max(Number(gameState.progress.highScore || 0), Number(gameState.totalRunScore || 0));
  savePlayerProgress();
}

function startLevel(levelIndex) {
  syncRuntimeCluesIntoEditorLevel();
  hideMainMenu();
  gameState.currentLevelIndex = levelIndex;
  gameState.mode = "intro";
  gameState.foundClues = new Set();
  gameState.score = 0;
  gameState.wrongClicks = 0;
  gameState.comboStreak = 0;
  gameState.lastFoundAt = 0;
  gameState.currentLevelTimeBonus = 0;
  gameState.currentLevelStars = 0;
  gameState.currentLevelScoreBanked = false;
  gameState.currentLevelCompletedClues = [];
  gameState.wrongFlashUntil = 0;
  gameState.toastUntil = 0;
  gameState.toastText = "";
  gameState.toastKind = "";
  hideFoundEvidencePopup();
  resetMouseDistraction();
  resetLevelTimer();
  gameState.selectedClueId = null;
  gameState.selectedZoneId = null;
  gameState.hoveredClueId = null;
  gameState.isDragging = false;

  buildRuntimeCluesForCurrentLevel();
  hideLoadingOverlay();
  hideLevelCompleteOverlay();
  showRoomIntroOverlay();
  updateUI();
  updateEditorOverlay();
  render();
}

function beginCurrentRoomSearch() {
  if (roomIntroOverlay) roomIntroOverlay.classList.add("hidden");
  gameState.mode = "playing";
  resetLevelTimer();
  updateUI();
  startLevelTimer();
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
      opacity: Number(clue.opacity ?? 1),
      saturation: Number(clue.saturation ?? 1),
      brightness: Number(clue.brightness ?? 1),
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
    clue.opacity = roundToTwo(runtimeClue.opacity ?? 1);
    clue.saturation = roundToTwo(runtimeClue.saturation ?? 1);
    clue.brightness = roundToTwo(runtimeClue.brightness ?? 1);
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

function restartGameFromBeginning() {
  stopLevelTimer();
  hideLevelCompleteOverlay();
  if (roomIntroOverlay) roomIntroOverlay.classList.add("hidden");
  if (exportModal) exportModal.classList.add("hidden");
  gameState.foundLevelIds = new Set();
  gameState.totalRunScore = 0;
  gameState.score = 0;
  gameState.wrongClicks = 0;
  gameState.comboStreak = 0;
  gameState.lastFoundAt = 0;
  startLevel(0);
}

function goToNextLevel() {
  syncRuntimeCluesIntoEditorLevel();

  if (gameState.mode === "game_complete") {
    restartGameFromBeginning();
    return;
  }

  const nextIndex = gameState.currentLevelIndex + 1;
  if (nextIndex >= editorData.levels.length) {
    gameState.mode = "game_complete";
    stopLevelTimer();
    updateHighScoreAfterGameComplete();
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

  if (checkMouseClick(point.x, point.y)) {
    updateUI();
    render();
    return;
  }

  const clickedClue = findClickedRuntimeClue(point.x, point.y);
  if (clickedClue) collectClue(clickedClue);
  else handleWrongClick();
  updateUI();
  render();
}

function handleCanvasPointerMove(event) {
  const point = getCanvasGameCoordinates(event);
  gameState.lastPointer = point;

  if (!gameState.editorMode && gameState.mode === "playing") {
    const hovered = findClickedRuntimeClue(point.x, point.y);
    const nextHoverId = hovered ? hovered.id : null;
    if (gameState.hoveredClueId !== nextHoverId) {
      gameState.hoveredClueId = nextHoverId;
      canvas.style.cursor = hovered ? "pointer" : "default";
      render();
    }
  }

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

function roundToTwo(value) {
  return Math.round(Number(value) * 100) / 100;
}

function collectClue(runtimeClue) {
  if (gameState.foundClues.has(runtimeClue.id)) return;

  gameState.foundClues.add(runtimeClue.id);
  if (gameState.hoveredClueId === runtimeClue.id) gameState.hoveredClueId = null;

  const now = Date.now();
  if (gameState.lastFoundAt && (now - gameState.lastFoundAt) <= COMBO_WINDOW_SECONDS * 1000) {
    gameState.comboStreak += 1;
  } else {
    gameState.comboStreak = 1;
  }
  gameState.lastFoundAt = now;

  const comboBonus = gameState.comboStreak > 1 ? (gameState.comboStreak - 1) * COMBO_BONUS_STEP : 0;
  gameState.score += 100 + comboBonus;
  if (CLUE_TIME_BONUS_SECONDS > 0 && gameState.mode === "playing") {
    gameState.timerRemaining += CLUE_TIME_BONUS_SECONDS;
    updateTimerUI();
  }
  gameState.currentLevelCompletedClues.push(runtimeClue.source.name);

  const link = getClueConnectionText(runtimeClue.source);
  const comboText = comboBonus > 0 ? ` · Combo x${gameState.comboStreak} +${comboBonus}` : "";
  const timeText = CLUE_TIME_BONUS_SECONDS > 0 ? `Time +${CLUE_TIME_BONUS_SECONDS}s · ` : "";
  showFoundEvidencePopup(runtimeClue.source.name, `${timeText}${comboBonus > 0 ? `Combo x${gameState.comboStreak} +${comboBonus} · ` : ""}${link || "Case file updated"}`);

  playGameSound("clueFound");

  if (isLevelComplete()) {
    completeCurrentLevelSuccessfully();
  }
}

function completeCurrentLevelSuccessfully() {
  gameState.mode = "level_complete";
  stopLevelTimer();
  gameState.currentLevelTimeBonus = 0;
  gameState.currentLevelStars = calculateStars();
  if (!gameState.currentLevelScoreBanked) {
    gameState.totalRunScore += gameState.score;
    gameState.currentLevelScoreBanked = true;
  }
  gameState.foundLevelIds.add(getCurrentLevel().id);
  showLevelCompleteOverlay();
  updateUI();
  window.setTimeout(() => playGameSound("levelComplete"), 120);
}

function handleWrongClick() {
  gameState.wrongClicks += 1;
  gameState.comboStreak = 0;
  if (gameState.score > 0) gameState.score = Math.max(0, gameState.score - WRONG_CLICK_PENALTY);
  flashWrongClick();
  showFeedback(`Wrong click -${WRONG_CLICK_PENALTY}. Careful...`, "negative");
}




function showFoundEvidencePopup(evidenceName, detailText = "Case file updated") {
  if (!foundEvidencePopup) return;

  if (gameState.foundEvidencePopupTimeout) {
    window.clearTimeout(gameState.foundEvidencePopupTimeout);
    gameState.foundEvidencePopupTimeout = null;
  }

  if (foundEvidenceName) foundEvidenceName.textContent = evidenceName;
  if (foundEvidenceDetail) foundEvidenceDetail.textContent = detailText;

  foundEvidencePopup.classList.remove("hidden", "show");
  void foundEvidencePopup.offsetWidth;
  foundEvidencePopup.classList.add("show");

  gameState.foundEvidencePopupTimeout = window.setTimeout(() => {
    hideFoundEvidencePopup();
  }, 2300);
}

function hideFoundEvidencePopup() {
  if (!foundEvidencePopup) return;
  foundEvidencePopup.classList.remove("show");
  foundEvidencePopup.classList.add("hidden");
  if (gameState.foundEvidencePopupTimeout) {
    window.clearTimeout(gameState.foundEvidencePopupTimeout);
    gameState.foundEvidencePopupTimeout = null;
  }
}

function getClueConnectionText(clue) {
  if (clue.suspectTag) return `Possible link: ${clue.suspectTag}`;
  const id = String(clue.id || "");
  if (id.includes("lipstick")) return "Possible link: social guest";
  if (id.includes("key") || id.includes("locked")) return "Possible link: locked access";
  if (id.includes("medicine") || id.includes("vial") || id.includes("tea")) return "Possible link: wellness treatment";
  if (id.includes("telephone") || id.includes("wire")) return "Possible link: communication sabotage";
  if (id.includes("footprint") || id.includes("muddy")) return "Possible link: outside route";
  if (id.includes("letter") || id.includes("blackmail") || id.includes("diary")) return "Possible link: hidden motive";
  return "Evidence logged";
}

function flashWrongClick() {
  gameState.wrongFlashUntil = Date.now() + 280;
  if (canvasFrame) {
    canvasFrame.classList.remove("wrong-flash");
    void canvasFrame.offsetWidth;
    canvasFrame.classList.add("wrong-flash");
    window.setTimeout(() => canvasFrame.classList.remove("wrong-flash"), 300);
  }
}

function showFeedback(text, kind = "") {
  gameState.toastText = text;
  gameState.toastKind = kind;
  gameState.toastUntil = Date.now() + 1800;
  updateFeedbackToast();
}

function updateFeedbackToast() {
  if (!feedbackToast) return;
  if (!gameState.toastText || Date.now() > gameState.toastUntil) {
    feedbackToast.classList.add("hidden");
    feedbackToast.textContent = "";
    feedbackToast.classList.remove("positive", "negative");
    return;
  }
  feedbackToast.textContent = gameState.toastText;
  feedbackToast.classList.remove("hidden", "positive", "negative");
  if (gameState.toastKind) feedbackToast.classList.add(gameState.toastKind);
}

function updateWrongFlash() {
  if (!canvasFrame) return;
  if (gameState.wrongFlashUntil && Date.now() > gameState.wrongFlashUntil) {
    canvasFrame.classList.remove("wrong-flash");
    gameState.wrongFlashUntil = 0;
  }
}

function calculateStars() {
  const remaining = Math.ceil(gameState.timerRemaining);
  let stars = 1;
  if (gameState.wrongClicks <= 3 && remaining >= Math.ceil(getCurrentLevelTimerDuration() * 0.25)) stars = 2;
  if (gameState.wrongClicks === 0 && remaining >= Math.ceil(getCurrentLevelTimerDuration() * 0.4)) stars = 3;
  return stars;
}

function getStarText(stars) {
  return "★".repeat(Math.max(1, stars)) + "☆".repeat(Math.max(0, 3 - stars));
}

function resetMouseDistraction() {
  const yOptions = [560, 600, 635];
  const direction = Math.random() > 0.5 ? 1 : -1;
  gameState.mouse = {
    active: true,
    x: direction === 1 ? -70 : BASE_WIDTH + 70,
    y: yOptions[Math.floor(Math.random() * yOptions.length)],
    width: 42,
    height: 18,
    speed: 70 + Math.random() * 60,
    direction,
    lastUpdate: Date.now(),
    bonusAvailable: true
  };
}

function updateMouseDistraction() {
  if (!gameState.mouse.active || gameState.mode !== "playing") return;
  const now = Date.now();
  const elapsed = Math.min(0.08, (now - (gameState.mouse.lastUpdate || now)) / 1000);
  gameState.mouse.lastUpdate = now;
  gameState.mouse.x += gameState.mouse.speed * gameState.mouse.direction * elapsed;
  if ((gameState.mouse.direction === 1 && gameState.mouse.x > BASE_WIDTH + 80) ||
      (gameState.mouse.direction === -1 && gameState.mouse.x < -100)) {
    resetMouseDistraction();
  }
}

function drawMouseDistraction() {
  if (!gameState.mouse.active || gameState.mode !== "playing") return;
  const mouse = gameState.mouse;
  ctx.save();
  ctx.translate(mouse.x, mouse.y);
  if (mouse.direction < 0) ctx.scale(-1, 1);
  ctx.fillStyle = "rgba(35, 25, 20, .72)";
  ctx.beginPath();
  ctx.ellipse(0, 0, mouse.width / 2, mouse.height / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(20, 14, 10, .9)";
  ctx.beginPath();
  ctx.arc(mouse.width / 2 - 4, -3, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(35, 25, 20, .7)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-mouse.width / 2, 0);
  ctx.quadraticCurveTo(-mouse.width / 2 - 20, 6, -mouse.width / 2 - 32, -2);
  ctx.stroke();
  ctx.restore();
}

function checkMouseClick(x, y) {
  const mouse = gameState.mouse;
  if (!mouse.active || !mouse.bonusAvailable) return false;
  const rect = {
    x: mouse.x - mouse.width / 2 - 8,
    y: mouse.y - mouse.height / 2 - 8,
    width: mouse.width + 16,
    height: mouse.height + 16
  };
  if (!isPointInsideRect(x, y, rect)) return false;
  mouse.bonusAvailable = false;
  mouse.active = false;
  gameState.score += MOUSE_BONUS;
  showFeedback(`Mouse spotted! Bonus +${MOUSE_BONUS}`, "positive");
  return true;
}

function showRoomIntroOverlay() {
  const level = getCurrentLevel();
  if (!roomIntroOverlay) return;

  if (introRoomName) introRoomName.textContent = level.name;
  if (introRoomText) introRoomText.textContent = level.introText || "Search the room before time runs out.";

  const hasCharacter = Boolean(level.introCharacterImage);
  if (introCharacterPanel) introCharacterPanel.classList.toggle("hidden", !hasCharacter);
  if (introCharacterImage) {
    introCharacterImage.classList.toggle("hidden", !hasCharacter);
    introCharacterImage.src = hasCharacter ? level.introCharacterImage : "";
    introCharacterImage.alt = level.introCharacterName || "Room intro character";
  }
  if (introCharacterName) {
    introCharacterName.classList.toggle("hidden", !level.introCharacterName);
    introCharacterName.textContent = level.introCharacterName || "";
  }
  if (introCharacterLine) {
    introCharacterLine.classList.toggle("hidden", !level.introCharacterLine);
    introCharacterLine.textContent = level.introCharacterLine || "";
  }

  roomIntroOverlay.classList.remove("hidden");
}

function getCurrentLevelTimerDuration() {
  const level = getCurrentLevel();
  return Number(level.timerDurationSeconds || editorData.settings.timerDurationSeconds || TIMER_DURATION_SECONDS);
}

function resetLevelTimer() {
  stopLevelTimer();
  gameState.timerRemaining = getCurrentLevelTimerDuration();
  gameState.timerLastTick = 0;
  updateTimerUI();
}

function startLevelTimer() {
  if (gameState.mode !== "playing" || gameState.editorMode) return;
  if (exportModal && !exportModal.classList.contains("hidden")) return;
  if (gameState.timerRemaining <= 0) return;
  if (gameState.timerIntervalId) return;

  gameState.timerLastTick = Date.now();
  gameState.timerIntervalId = window.setInterval(tickLevelTimer, 100);
}

function stopLevelTimer() {
  if (gameState.timerIntervalId) {
    window.clearInterval(gameState.timerIntervalId);
    gameState.timerIntervalId = null;
  }
  gameState.timerLastTick = 0;
}

function tickLevelTimer() {
  if (gameState.mode !== "playing" || gameState.editorMode) {
    stopLevelTimer();
    return;
  }

  if (exportModal && !exportModal.classList.contains("hidden")) {
    stopLevelTimer();
    return;
  }

  const now = Date.now();
  const elapsedSeconds = (now - gameState.timerLastTick) / 1000;
  gameState.timerLastTick = now;

  gameState.timerRemaining = Math.max(0, gameState.timerRemaining - elapsedSeconds);
  updateTimerUI();

  if (gameState.timerRemaining <= 0) {
    handleTimeUp();
  }
}

function updateTimerUI() {
  if (!timerValueElement) return;
  const seconds = Math.ceil(gameState.timerRemaining);
  timerValueElement.textContent = String(seconds);
  timerValueElement.closest(".stat-pill")?.classList.toggle("is-danger", seconds <= 5);
}

function handleTimeUp() {
  stopLevelTimer();
  gameState.timerRemaining = 0;
  if (!isLevelComplete()) playGameSound("timeUp");
  gameState.mode = "time_up";
  updateTimerUI();
  showTimeUpOverlay();
  render();
}

function isLevelComplete() {
  return gameState.foundClues.size >= getCurrentLevel().clues.length;
}

function updateUI() {
  const level = getCurrentLevel();
  if (levelNameElement) levelNameElement.textContent = level.name;
  if (scoreValueElement) scoreValueElement.textContent = String(gameState.score);
  if (wrongClickValueElement) wrongClickValueElement.textContent = String(gameState.wrongClicks);
  updateTimerUI();
  updateClueList();
}

function updateClueList() {
  if (!clueListElement) return;
  clueListElement.innerHTML = "";
  getCurrentLevel().clues.forEach((clue) => {
    const li = document.createElement("li");
    li.title = clue.name;
    li.textContent = clue.name;
    if (gameState.foundClues.has(clue.id)) {
      li.classList.add("found");
      li.textContent = `✓ ${clue.name}`;
    }
    clueListElement.appendChild(li);
  });
}


function handleLogoSecretTap() {
  const now = Date.now();
  if (now - gameState.lastLogoTapAt > LOGO_TAP_WINDOW_MS) {
    gameState.logoTapCount = 0;
  }

  gameState.logoTapCount += 1;
  gameState.lastLogoTapAt = now;

  if (gameState.logoTapCount >= 3) {
    gameState.logoTapCount = 0;
    openEditorKeypad();
  }
}

async function openEditorKeypad() {
  if (document.fullscreenElement && document.fullscreenElement === canvasFrame) {
    try { await document.exitFullscreen(); } catch (error) { console.warn("Could not exit fullscreen for keypad.", error); }
  }
  gameState.editorCodeInput = "";
  updateEditorCodeDisplay();
  if (editorKeypadStatus) editorKeypadStatus.textContent = "";
  if (editorKeypadModal) editorKeypadModal.classList.remove("hidden");
}

function closeEditorKeypad() {
  gameState.editorCodeInput = "";
  if (editorKeypadModal) editorKeypadModal.classList.add("hidden");
  if (editorKeypadStatus) editorKeypadStatus.textContent = "";
}

function addEditorCodeDigit(digit) {
  if (!/^\d$/.test(String(digit))) return;
  if (gameState.editorCodeInput.length >= 4) return;
  gameState.editorCodeInput += String(digit);
  updateEditorCodeDisplay();

  if (gameState.editorCodeInput.length === 4) {
    submitEditorCode();
  }
}

function clearEditorCode() {
  gameState.editorCodeInput = "";
  updateEditorCodeDisplay();
  if (editorKeypadStatus) editorKeypadStatus.textContent = "";
}

function updateEditorCodeDisplay() {
  if (!editorCodeDisplay) return;
  const entered = gameState.editorCodeInput.length;
  editorCodeDisplay.textContent = "●".repeat(entered) + "○".repeat(Math.max(0, 4 - entered));
}

function submitEditorCode() {
  if (gameState.editorCodeInput === EDITOR_ACCESS_CODE) {
    gameState.editorUnlocked = true;
    closeEditorKeypad();
    if (!gameState.editorMode) toggleEditorMode();
    return;
  }

  if (editorKeypadStatus) editorKeypadStatus.textContent = "Incorrect code.";
  gameState.editorCodeInput = "";
  updateEditorCodeDisplay();
}

function toggleEditorMode() {
  if (!gameState.editorUnlocked && !gameState.editorMode) {
    openEditorKeypad();
    return;
  }
  gameState.editorMode = !gameState.editorMode;
  if (gameState.editorMode) {
    stopLevelTimer();
    gameState.debugZones = false;
    hideLevelCompleteOverlay();
    if (roomIntroOverlay) roomIntroOverlay.classList.add("hidden");
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
  // Zones are visible only in zone mode, or when manually toggled with Z.
  if (tool === "clue") gameState.debugZones = false;
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


function adjustSelectedClueVisual(property, delta) {
  if (!gameState.editorMode || gameState.editorTool !== "clue") return;
  const clue = getSelectedRuntimeClue();
  if (!clue) return;

  const limits = {
    opacity: [0.15, 1],
    saturation: [0, 2],
    brightness: [0.3, 1.8]
  };
  if (!limits[property]) return;

  const [min, max] = limits[property];
  clue[property] = roundToTwo(clamp(Number(clue[property] ?? 1) + delta, min, max));
  updateEditorOverlay();
  render();
}

function resizeSelectedZoneWithArrow(key, amount) {
  if (!gameState.editorMode || gameState.editorTool !== "zone") return;
  if (key === "ArrowLeft") resizeSelectedZoneDimension(-amount, 0);
  if (key === "ArrowRight") resizeSelectedZoneDimension(amount, 0);
  if (key === "ArrowUp") resizeSelectedZoneDimension(0, -amount);
  if (key === "ArrowDown") resizeSelectedZoneDimension(0, amount);
}

function resizeSelectedZoneDimension(deltaWidth, deltaHeight) {
  if (!gameState.editorMode || gameState.editorTool !== "zone") return;
  const zone = getSelectedZone();
  if (!zone) return;

  zone.width = clamp(Math.round(zone.width + deltaWidth), 20, BASE_WIDTH - zone.x);
  zone.height = clamp(Math.round(zone.height + deltaHeight), 20, BASE_HEIGHT - zone.y);
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
  updateMouseDistraction();
  drawMouseDistraction();
  drawClues();
  if (gameState.debugZones || gameState.editorTool === "zone") drawDebugPlacementZones();
  if (gameState.debugHitboxes || gameState.editorMode) drawDebugHitboxes();
  if (gameState.editorMode) drawEditorSelection();
  updateFeedbackToast();
  updateWrongFlash();
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
    drawClueImage(image, runtimeClue);
  });
}


function drawClueImage(image, runtimeClue) {
  const opacity = clamp(Number(runtimeClue.opacity ?? 1), 0.15, 1);
  const saturation = clamp(Number(runtimeClue.saturation ?? 1), 0, 2);
  const brightness = clamp(Number(runtimeClue.brightness ?? 1), 0.3, 1.8);

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.filter = `saturate(${Math.round(saturation * 100)}%) brightness(${Math.round(brightness * 100)}%)`;
  drawRotatedImage(image, runtimeClue.x, runtimeClue.y, runtimeClue.width, runtimeClue.height, runtimeClue.rotation || 0);
  ctx.restore();
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
  document.body.classList.toggle("editor-active", gameState.editorMode);
  if (!editorHelpOverlay) return;
  editorHelpOverlay.classList.toggle("hidden", !gameState.editorMode);
  if (!editorModeLabel) return;
  const selected = gameState.editorTool === "clue" ? gameState.selectedClueId : gameState.selectedZoneId;
  let detail = "";
  if (gameState.editorTool === "clue") {
    const clue = getSelectedRuntimeClue();
    if (clue) {
      detail = ` · opacity ${roundToTwo(clue.opacity ?? 1)} · sat ${roundToTwo(clue.saturation ?? 1)} · bright ${roundToTwo(clue.brightness ?? 1)}`;
    }
  } else {
    const zone = getSelectedZone();
    if (zone) detail = ` · ${zone.width}×${zone.height}`;
  }
  editorModeLabel.textContent = `EDITOR: ${gameState.editorTool.toUpperCase()}${selected ? ` · ${selected}` : ""}${detail}`;
}


function isMobileDevice() {
  return window.matchMedia("(pointer: coarse)").matches || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function updateMobileLayout() {
  const mobile = isMobileDevice();
  const portrait = window.innerHeight > window.innerWidth;
  const landscape = window.innerWidth >= window.innerHeight;

  document.body.classList.toggle("is-mobile", mobile);
  document.body.classList.toggle("is-portrait", mobile && portrait);
  document.body.classList.toggle("is-landscape", mobile && landscape);

  if (!mobileOrientationOverlay) return;

  if (mobile && portrait) {
    mobileOrientationOverlay.classList.remove("hidden");
  } else {
    mobileOrientationOverlay.classList.add("hidden");
  }
}

async function handleRotateScreenButton() {
  unlockGameAudio();
  try {
    const target = appShell || document.documentElement;

    if (!document.fullscreenElement && target && target.requestFullscreen) {
      await target.requestFullscreen({ navigationUI: "hide" });
    }

    if (screen.orientation && screen.orientation.lock) {
      await screen.orientation.lock("landscape");
    }
  } catch (error) {
    console.warn("Could not force landscape orientation. Please rotate the device manually.", error);
  }

  setTimeout(updateMobileLayout, 150);
}

function hideLoadingOverlay() {
  if (loadingOverlay) loadingOverlay.classList.add("hidden");
}


function buildLevelAssessmentText(level) {
  const id = level.id || "";
  if (id.includes("grand_sitting_room")) return "The sitting room points to a performed family scene: private drinks, calculated strategy, and a conversation someone wanted kept off the record.";
  if (id.includes("dining")) return "The dining room points to the main incident: seating order, tea, a broken cup, and a destroyed message.";
  if (id.includes("orchid_room")) return "The orchid room links the inside of the retreat to a quieter garden-side route and access to tools or chemicals.";
  if (id.includes("orchid_ensuite")) return "The en-suite suggests a hurried clean-up involving medicine, oil, mud, and an unknown vial.";
  if (id.includes("kitchen")) return "The kitchen exposes the service route: deliveries, ingredients, paperwork, and the timing of movement behind the scenes.";
  if (id.includes("garden")) return "The garden ties motive to escape: blackmail, concealed records, outdoor footprints, and tools for covering traces.";
  return "The evidence in this room has been collected and added to the case file.";
}

function buildLevelReportHtml(level) {
  const found = level.clues
    .filter((clue) => gameState.foundClues.has(clue.id))
    .map((clue) => `<li>✓ ${escapeHtml(clue.name)} — ${escapeHtml(getClueConnectionText(clue))}</li>`)
    .join("");

  return `
    <div class="result-summary">
      <div class="result-pill"><span>Rating</span><strong>${getStarText(gameState.currentLevelStars)}</strong></div>
      <div class="result-pill"><span>Wrong</span><strong>${gameState.wrongClicks}</strong></div>
      <div class="result-pill"><span>Score</span><strong>${gameState.score}</strong></div>
    </div>
    <strong>Evidence report:</strong>
    <ul>${found}</ul>
  `;
}

function buildFinalEvidenceBoardHtml() {
  const rooms = editorData.levels.map((level) => {
    const completed = gameState.foundLevelIds.has(level.id) ? "✓" : "•";
    return `<li>${completed} <strong>${escapeHtml(level.name)}</strong> — ${escapeHtml(buildLevelAssessmentText(level))}</li>`;
  }).join("");

  return `
    <strong>Final evidence board:</strong>
    <ul>${rooms}</ul>
    <p style="margin-top:.8rem;color:var(--muted)">Next recommended feature: add a suspect accusation screen that checks motive, access, and opportunity.</p>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showTimeUpOverlay() {
  hideFoundEvidencePopup();
  if (!levelCompleteOverlay) return;
  levelCompleteOverlay.classList.remove("hidden");
  const heading = levelCompleteOverlay.querySelector("h2");
  const message = levelCompleteOverlay.querySelector("p");
  if (heading) heading.textContent = "Time's Up";
  if (message) message.textContent = "The evidence went cold. Restart the room and try again.";
  if (levelReport) {
    const missing = getCurrentLevel().clues
      .filter((clue) => !gameState.foundClues.has(clue.id))
      .map((clue) => `<li>${escapeHtml(clue.name)}</li>`)
      .join("");
    levelReport.innerHTML = `
      <div class="result-summary">
        <div class="result-pill"><span>Found</span><strong>${gameState.foundClues.size}/${getCurrentLevel().clues.length}</strong></div>
        <div class="result-pill"><span>Wrong</span><strong>${gameState.wrongClicks}</strong></div>
        <div class="result-pill"><span>Score</span><strong>${gameState.score}</strong></div>
      </div>
      <strong>Missing evidence:</strong>
      <ul>${missing || "<li>None</li>"}</ul>
    `;
  }
  if (endChooseLevelButton) endChooseLevelButton.classList.add("hidden");
  if (endLevelSelectPanel) endLevelSelectPanel.classList.add("hidden");
  if (nextLevelButton) nextLevelButton.textContent = "Next Room";
}

function showLevelCompleteOverlay() {
  hideFoundEvidencePopup();
  if (!levelCompleteOverlay) return;
  const level = getCurrentLevel();
  const finalLevel = gameState.currentLevelIndex >= editorData.levels.length - 1;
  levelCompleteOverlay.classList.remove("hidden");
  const heading = levelCompleteOverlay.querySelector("h2");
  const message = levelCompleteOverlay.querySelector("p");
  if (heading) heading.textContent = `${level.name} Complete`;
  if (message) message.textContent = buildLevelAssessmentText(level);
  if (levelReport) levelReport.innerHTML = buildLevelReportHtml(level);
  if (endChooseLevelButton) endChooseLevelButton.classList.add("hidden");
  if (endLevelSelectPanel) endLevelSelectPanel.classList.add("hidden");
  if (nextLevelButton) nextLevelButton.textContent = finalLevel ? "Finish Game" : "Next Room";
}

function showGameCompleteOverlay() {
  hideFoundEvidencePopup();
  if (!levelCompleteOverlay) return;
  levelCompleteOverlay.classList.remove("hidden");
  const heading = levelCompleteOverlay.querySelector("h2");
  const message = levelCompleteOverlay.querySelector("p");
  if (heading) heading.textContent = "Investigation Complete";
  if (message) message.textContent = `The final evidence board is ready. Run score: ${gameState.totalRunScore}. High score: ${gameState.progress.highScore}.`;
  if (levelReport) levelReport.innerHTML = buildFinalEvidenceBoardHtml();
  if (endChooseLevelButton) {
    endChooseLevelButton.classList.remove("hidden");
    endChooseLevelButton.style.display = "";
  }
  if (endLevelSelectPanel) endLevelSelectPanel.classList.add("hidden");
  buildLevelSelectGrid();
  if (nextLevelButton) {
    nextLevelButton.style.display = "";
    nextLevelButton.textContent = "Start From Beginning";
  }
}

function hideLevelCompleteOverlay() {
  if (!levelCompleteOverlay) return;
  levelCompleteOverlay.classList.add("hidden");
  if (levelReport) levelReport.innerHTML = "";
  if (endLevelSelectPanel) endLevelSelectPanel.classList.add("hidden");
  if (endChooseLevelButton) endChooseLevelButton.classList.add("hidden");
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
    opacity: roundToTwo(runtimeClue.opacity ?? 1),
    saturation: roundToTwo(runtimeClue.saturation ?? 1),
    brightness: roundToTwo(runtimeClue.brightness ?? 1),
    description: source.description || ""
  };
}

function stringifyForDataJs(value) {
  return JSON.stringify(value, null, 2)
    .replace(/"([a-zA-Z_$][a-zA-Z0-9_$]*)":/g, "$1:");
}

function openExportPanel(mode = "full", message = "") {
  stopLevelTimer();
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
  startLevelTimer();
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
