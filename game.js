/*
  TIKUS: Hidden Evidence
  game.js

  Clean eye-level hidden-object build.
  Kept features only:
  - 25 second timer
  - top-right score
  - footer clue list
  - bottom-right room name badge
  - top-left logo
  - start game message
  - level complete message
  - sounds
  - clue-only editor mode
  - ambient light and dust
  - final level report
  - random side character per level iteration
*/

"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const clueListElement = document.getElementById("clueList");
const scoreValueElement = document.getElementById("scoreValue");
const timerValueElement = document.getElementById("timerValue");
const roomNameBadge = document.getElementById("roomNameBadge");
const mainMenuOverlay = document.getElementById("mainMenuOverlay");
const levelCompleteOverlay = document.getElementById("levelCompleteOverlay");
const completeTitle = document.getElementById("completeTitle");
const completeMessage = document.getElementById("completeMessage");
const levelReport = document.getElementById("levelReport");
const startGameButton = document.getElementById("startGameButton");
const restartButton = document.getElementById("restartButton");
const nextLevelButton = document.getElementById("nextLevelButton");
const feiskLogoButton = document.getElementById("feiskLogoButton");
const characterPanel = document.getElementById("characterPanel");
const characterImage = document.getElementById("characterImage");
const characterName = document.getElementById("characterName");
const characterLine = document.getElementById("characterLine");
const levelIntroOverlay = document.getElementById("levelIntroOverlay");
const levelIntroStartButton = document.getElementById("levelIntroStartButton");
const rotateLandscapeButton = document.getElementById("rotateLandscapeButton");
const editorHelpOverlay = document.getElementById("editorHelpOverlay");
const editorModeLabel = document.getElementById("editorModeLabel");
const editorKeypadModal = document.getElementById("editorKeypadModal");
const editorCodeDisplay = document.getElementById("editorCodeDisplay");
const editorKeypadStatus = document.getElementById("editorKeypadStatus");
const closeEditorKeypadButton = document.getElementById("closeEditorKeypadButton");
const clearEditorCodeButton = document.getElementById("clearEditorCodeButton");
const submitEditorCodeButton = document.getElementById("submitEditorCodeButton");
const exportModal = document.getElementById("exportModal");
const exportText = document.getElementById("exportText");
const exportStatus = document.getElementById("exportStatus");
const copyExportButton = document.getElementById("copyExportButton");
const downloadDataButton = document.getElementById("downloadDataButton");
const closeExportButton = document.getElementById("closeExportButton");
const addZoneButton = document.getElementById("addZoneButton");
const deleteZoneButton = document.getElementById("deleteZoneButton");
const resizeZoneButton = document.getElementById("resizeZoneButton");
const characterShrinkButton = document.getElementById("characterShrinkButton");
const characterGrowButton = document.getElementById("characterGrowButton");

const BASE_WIDTH = GAME_DATA.settings.baseWidth;
const BASE_HEIGHT = GAME_DATA.settings.baseHeight;
const TIMER_DURATION_SECONDS = Number(GAME_DATA.settings.timerDurationSeconds || 25);
const SCORE_PER_CLUE = Number(GAME_DATA.settings.scorePerClue || 100);
const EDITOR_ACCESS_CODE = String(GAME_DATA.settings.editorAccessCode || "0707");
const SOUND_PATHS = {
  clueFound: "assets/audio/clue_twang.wav",
  levelComplete: "assets/audio/level_complete_chime.wav",
  timeUp: "assets/audio/time_up_buzzer.wav"
};

canvas.width = BASE_WIDTH;
canvas.height = BASE_HEIGHT;

const editorData = deepClone(GAME_DATA);

const state = {
  mode: "menu",
  levelIndex: 0,
  images: {},
  sounds: {},
  audioUnlocked: false,
  foundClues: new Set(),
  runtimeClues: [],
  score: 0,
  runScore: 0,
  timerRemaining: TIMER_DURATION_SECONDS,
  timerId: null,
  lastTimerTick: 0,
  completedReports: [],
  selectedClueId: null,
  dragging: false,
  dragOffsetX: 0,
  dragOffsetY: 0,
  resizeDragging: false,
  resizeStart: null,
  lastPointer: { x: 0, y: 0 },
  editorUnlocked: false,
  editorMode: false,
  logoTapCount: 0,
  lastLogoTapAt: 0,
  editorCode: "",
  ambientParticles: [],
  ambientTime: 0,
  animationId: null,
  lastAnimationTime: 0,
  character: null
};

window.addEventListener("load", init);

function init() {
  loadSounds();
  bindEvents();
  loadImages();
  startAnimationLoop();
}

function bindEvents() {
  startGameButton.addEventListener("click", startGame);
  levelIntroStartButton.addEventListener("click", beginLevelSearch);
  rotateLandscapeButton.addEventListener("click", forceLandscapeMode);
  window.addEventListener("resize", updateRotateButton);
  window.addEventListener("orientationchange", updateRotateButton);
  restartButton.addEventListener("click", () => startLevel(state.levelIndex));
  nextLevelButton.addEventListener("click", nextLevel);
  canvas.addEventListener("pointerdown", handlePointerDown);
  canvas.addEventListener("pointermove", handlePointerMove);
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("pointerdown", unlockAudio, { once: true });
  window.addEventListener("keydown", unlockAudio, { once: true });

  feiskLogoButton.addEventListener("click", handleLogoTap);
  feiskLogoButton.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleLogoTap();
    }
  });

  document.querySelectorAll("[data-keypad-number]").forEach((button) => {
    button.addEventListener("click", () => addEditorDigit(button.dataset.keypadNumber));
  });
  closeEditorKeypadButton.addEventListener("click", closeEditorKeypad);
  clearEditorCodeButton.addEventListener("click", clearEditorCode);
  submitEditorCodeButton.addEventListener("click", submitEditorCode);
  closeExportButton.addEventListener("click", closeExportPanel);
  copyExportButton.addEventListener("click", copyExport);
  downloadDataButton.addEventListener("click", () => downloadTextFile("data.js", buildDataJsExport()));
  addZoneButton.addEventListener("click", addEditorZone);
  deleteZoneButton.addEventListener("click", deleteSelectedZone);
  resizeZoneButton.addEventListener("click", () => resizeSelectedClue(1.15));
  characterShrinkButton.addEventListener("click", () => resizeCurrentCharacter(0.92));
  characterGrowButton.addEventListener("click", () => resizeCurrentCharacter(1.08));
  updateRotateButton();
}

function loadSounds() {
  Object.entries(SOUND_PATHS).forEach(([name, path]) => {
    const audio = new Audio(path);
    audio.preload = "auto";
    audio.volume = 0.85;
    state.sounds[name] = audio;
  });
}

function unlockAudio() {
  if (state.audioUnlocked) return;
  state.audioUnlocked = true;
  Object.values(state.sounds).forEach((audio) => {
    const originalVolume = audio.volume;
    audio.volume = 0;
    const attempt = audio.play();
    if (attempt && typeof attempt.then === "function") {
      attempt.then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = originalVolume;
      }).catch(() => { audio.volume = originalVolume; });
    }
  });
}

function playSound(name) {
  const audio = state.sounds[name];
  if (!audio) return;
  try {
    const clone = audio.cloneNode(true);
    clone.volume = audio.volume;
    clone.play().catch(() => {});
  } catch (_) {}
}

function loadImages() {
  const paths = new Set();
  editorData.levels.forEach((level) => {
    if (level.roomImage) paths.add(level.roomImage);
    level.clues.forEach((clue) => { if (clue.image) paths.add(clue.image); });
  });
  editorData.characters.forEach((character) => { if (character.image) paths.add(character.image); });

  let loaded = 0;
  const list = Array.from(paths);
  if (!list.length) return;

  list.forEach((path) => {
    const image = new Image();
    image.onload = image.onerror = () => {
      loaded += 1;
      if (loaded === list.length) render();
    };
    image.src = path;
    state.images[path] = image;
  });
}

function startGame() {
  state.runScore = 0;
  state.completedReports = [];
  mainMenuOverlay.classList.add("hidden");
  startLevel(0);
}

function startLevel(index) {
  stopTimer();
  state.levelIndex = index;
  state.mode = "level_intro";
  state.score = 0;
  state.foundClues = new Set();
  state.selectedClueId = null;
  state.dragging = false;
  state.resizeDragging = false;
  state.resizeStart = null;
  state.timerRemaining = TIMER_DURATION_SECONDS;
  state.lastTimerTick = 0;
  state.runtimeClues = getLevel().clues.map((clue) => ({ ...deepClone(clue), hitbox: { x: clue.x, y: clue.y, width: clue.width, height: clue.height } }));
  chooseRandomCharacter();
  resetAmbient();
  hideLevelComplete();
  showLevelIntro();
  updateUI();
  render();
}

function getLevel() {
  return editorData.levels[state.levelIndex];
}

function chooseRandomCharacter() {
  const characters = editorData.characters || [];
  state.character = characters.length ? characters[Math.floor(Math.random() * characters.length)] : null;
  if (!state.character) {
    characterPanel.classList.add("hidden");
    return;
  }
  const lines = state.character.lines || [];
  characterImage.src = state.character.image;
  characterImage.alt = state.character.name;
  characterName.textContent = state.character.name;
  characterLine.textContent = getLevel().introText || lines[Math.floor(Math.random() * lines.length)] || "Search carefully.";
  applyCharacterScale();
  characterPanel.classList.remove("hidden");
}

function showLevelIntro() {
  levelIntroOverlay.classList.remove("hidden");
  levelIntroOverlay.setAttribute("aria-hidden", "false");
  levelIntroStartButton.classList.remove("hidden");
  characterPanel.classList.add("is-interactive");
  characterPanel.classList.toggle("hidden", !state.character);
}

function beginLevelSearch() {
  if (state.mode !== "level_intro") return;
  levelIntroOverlay.classList.add("hidden");
  levelIntroOverlay.setAttribute("aria-hidden", "true");
  levelIntroStartButton.classList.add("hidden");
  characterPanel.classList.remove("is-interactive");
  characterPanel.classList.add("hidden");
  state.mode = "playing";
  startTimer();
  render();
}

function startTimer() {
  stopTimer();
  state.lastTimerTick = Date.now();
  state.timerId = window.setInterval(tickTimer, 100);
}

function stopTimer() {
  if (state.timerId) window.clearInterval(state.timerId);
  state.timerId = null;
}

function tickTimer() {
  if (state.mode !== "playing" || state.editorMode) return;
  const now = Date.now();
  const elapsed = (now - state.lastTimerTick) / 1000;
  state.lastTimerTick = now;
  state.timerRemaining = Math.max(0, state.timerRemaining - elapsed);
  updateTimerUI();
  if (state.timerRemaining <= 0) timeUp();
}

function timeUp() {
  stopTimer();
  playSound("timeUp");
  showLevelComplete(false);
}

function collectClue(clue) {
  if (state.foundClues.has(clue.id)) return;
  state.foundClues.add(clue.id);
  state.score += SCORE_PER_CLUE;
  playSound("clueFound");
  updateUI();
  if (state.foundClues.size >= state.runtimeClues.length) showLevelComplete(true);
}

function showLevelComplete(success) {
  stopTimer();
  state.mode = success ? "complete" : "time_up";
  const level = getLevel();
  if (success) playSound("levelComplete");
  state.runScore += state.score;

  const found = state.runtimeClues.filter((clue) => state.foundClues.has(clue.id)).map((clue) => clue.name);
  const missing = state.runtimeClues.filter((clue) => !state.foundClues.has(clue.id)).map((clue) => clue.name);
  const report = { room: level.name, score: state.score, found, missing, success };
  state.completedReports[state.levelIndex] = report;

  completeTitle.textContent = success ? `${level.name} Complete` : "Time's Up";
  completeMessage.textContent = success ? "The evidence in this room has been collected." : "The evidence went cold. Restart the room and try again.";
  levelReport.innerHTML = buildReportHtml(state.levelIndex >= editorData.levels.length - 1 && success);
  nextLevelButton.textContent = state.levelIndex >= editorData.levels.length - 1 ? "Final Report" : "Next Room";
  if (!success) nextLevelButton.textContent = "Try Next Room";
  levelCompleteOverlay.classList.remove("hidden");
  render();
}

function buildReportHtml(finalReport = false) {
  if (finalReport) {
    const rows = state.completedReports.filter(Boolean).map((report) => `<li><strong>${escapeHtml(report.room)}</strong> — Score ${report.score}; Found: ${report.found.map(escapeHtml).join(", ") || "None"}</li>`).join("");
    return `<div class="result-summary"><div class="result-pill"><span>Total Score</span><strong>${state.runScore}</strong></div><div class="result-pill"><span>Rooms</span><strong>${state.completedReports.filter(Boolean).length}/${editorData.levels.length}</strong></div></div><strong>Final level report:</strong><ul>${rows}</ul>`;
  }

  const report = state.completedReports[state.levelIndex];
  const foundList = report.found.map((item) => `<li>✓ ${escapeHtml(item)}</li>`).join("");
  const missingList = report.missing.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  return `<div class="result-summary"><div class="result-pill"><span>Score</span><strong>${report.score}</strong></div><div class="result-pill"><span>Found</span><strong>${report.found.length}/${state.runtimeClues.length}</strong></div></div><strong>Found clues:</strong><ul>${foundList || "<li>None</li>"}</ul><strong>Missing:</strong><ul>${missingList || "<li>None</li>"}</ul>`;
}

function hideLevelComplete() {
  levelCompleteOverlay.classList.add("hidden");
}

function nextLevel() {
  if (state.mode === "final_report") {
    startGame();
    return;
  }

  if (state.levelIndex >= editorData.levels.length - 1) {
    state.mode = "final_report";
    completeTitle.textContent = "Investigation Report";
    completeMessage.textContent = "The two-room prototype report is ready.";
    levelReport.innerHTML = buildReportHtml(true);
    nextLevelButton.textContent = "Restart Game";
    return;
  }

  startLevel(state.levelIndex + 1);
}

function updateUI() {
  const level = getLevel();
  scoreValueElement.textContent = String(state.score);
  roomNameBadge.textContent = level.name.toUpperCase();
  updateTimerUI();
  clueListElement.innerHTML = "";
  state.runtimeClues.forEach((clue) => {
    const item = document.createElement("li");
    item.textContent = state.foundClues.has(clue.id) ? `✓ ${clue.name}` : clue.name;
    if (state.foundClues.has(clue.id)) item.classList.add("found");
    clueListElement.appendChild(item);
  });
}

function updateTimerUI() {
  const seconds = Math.ceil(state.timerRemaining);
  timerValueElement.textContent = String(seconds);
  timerValueElement.closest(".timer-pill").classList.toggle("is-danger", seconds <= 5);
}

function handlePointerDown(event) {
  event.preventDefault();
  const point = getCanvasPoint(event);
  state.lastPointer = point;
  if (state.editorMode) {
    const selected = getSelectedClue();
    if (selected && isOnResizeHandle(selected, point.x, point.y)) {
      state.resizeDragging = true;
      state.dragging = false;
      state.resizeStart = { x: selected.x, y: selected.y, width: selected.width, height: selected.height, pointerX: point.x, pointerY: point.y };
      updateEditorOverlay();
      render();
      return;
    }

    const clue = findClueAt(point.x, point.y, true);
    state.selectedClueId = clue ? clue.id : null;
    if (clue) {
      state.dragging = true;
      state.resizeDragging = false;
      state.dragOffsetX = point.x - clue.x;
      state.dragOffsetY = point.y - clue.y;
    }
    updateEditorOverlay();
    render();
    return;
  }
  if (state.mode !== "playing") return;
  const clue = findClueAt(point.x, point.y, false);
  if (clue) collectClue(clue);
  render();
}

function handlePointerMove(event) {
  const point = getCanvasPoint(event);
  state.lastPointer = point;
  if (!state.editorMode) return;
  const clue = getSelectedClue();
  if (!clue) return;

  if (state.resizeDragging && state.resizeStart) {
    const nextWidth = clamp(Math.round(state.resizeStart.width + (point.x - state.resizeStart.pointerX)), 12, BASE_WIDTH - clue.x);
    const nextHeight = clamp(Math.round(state.resizeStart.height + (point.y - state.resizeStart.pointerY)), 12, BASE_HEIGHT - clue.y);
    clue.width = nextWidth;
    clue.height = nextHeight;
    updateHitbox(clue);
    updateEditorOverlay();
    render();
    return;
  }

  if (!state.dragging) return;
  clue.x = clamp(Math.round(point.x - state.dragOffsetX), 0, BASE_WIDTH - clue.width);
  clue.y = clamp(Math.round(point.y - state.dragOffsetY), 0, BASE_HEIGHT - clue.height);
  updateHitbox(clue);
  updateEditorOverlay();
  render();
}

function endDrag() {
  state.dragging = false;
  state.resizeDragging = false;
  state.resizeStart = null;
}

function handleKeyDown(event) {
  const key = event.key;
  const lower = key.toLowerCase();

  if (lower === "e") {
    if (state.editorMode) exitEditor();
    return;
  }
  if (!state.editorMode) return;

  const clue = getSelectedClue();
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
    event.preventDefault();
    if (!clue) return;
    const amount = event.shiftKey ? 10 : 1;
    if (key === "ArrowLeft") clue.x -= amount;
    if (key === "ArrowRight") clue.x += amount;
    if (key === "ArrowUp") clue.y -= amount;
    if (key === "ArrowDown") clue.y += amount;
    clue.x = clamp(Math.round(clue.x), 0, BASE_WIDTH - clue.width);
    clue.y = clamp(Math.round(clue.y), 0, BASE_HEIGHT - clue.height);
    updateHitbox(clue);
  } else if (key === "-" || key === "_") {
    event.preventDefault(); resizeSelectedClue(0.95);
  } else if (key === "=" || key === "+") {
    event.preventDefault(); resizeSelectedClue(1.05);
  } else if (key === "[") {
    event.preventDefault(); rotateSelectedClue(-5);
  } else if (key === "]") {
    event.preventDefault(); rotateSelectedClue(5);
  } else if (key === "Delete" || key === "Backspace") {
    event.preventDefault(); deleteSelectedZone();
  } else if (lower === "z") {
    event.preventDefault(); addEditorZone();
  } else if (lower === "c") {
    event.preventDefault(); openExportPanel(buildSelectedClueExport());
  } else if (lower === "x") {
    event.preventDefault(); openExportPanel(buildDataJsExport());
  } else if (lower === "escape") {
    event.preventDefault(); state.selectedClueId = null;
  }
  updateEditorOverlay();
  render();
}

function resizeSelectedClue(factor) {
  const clue = getSelectedClue();
  if (!clue) return;
  const cx = clue.x + clue.width / 2;
  const cy = clue.y + clue.height / 2;
  clue.width = clamp(Math.round(clue.width * factor), 8, 500);
  clue.height = clamp(Math.round(clue.height * factor), 8, 500);
  clue.x = clamp(Math.round(cx - clue.width / 2), 0, BASE_WIDTH - clue.width);
  clue.y = clamp(Math.round(cy - clue.height / 2), 0, BASE_HEIGHT - clue.height);
  updateHitbox(clue);
}

function rotateSelectedClue(delta) {
  const clue = getSelectedClue();
  if (!clue) return;
  clue.rotation = Math.round((clue.rotation || 0) + delta);
}

function addEditorZone() {
  const level = getLevel();
  const index = level.clues.length + 1;
  const id = makeUniqueClueId(`zone_${index}`);
  const zone = {
    id,
    name: `New Zone ${index}`,
    image: "",
    x: clamp(Math.round(state.lastPointer.x - 60), 0, BASE_WIDTH - 120),
    y: clamp(Math.round(state.lastPointer.y - 35), 0, BASE_HEIGHT - 70),
    width: 120,
    height: 70,
    rotation: 0,
    hitbox: null
  };
  updateHitbox(zone);
  state.runtimeClues.push(zone);
  level.clues.push(clueToData(zone));
  state.selectedClueId = zone.id;
  updateUI();
  updateEditorOverlay();
  render();
}

function deleteSelectedZone() {
  const clue = getSelectedClue();
  if (!clue) return;
  state.runtimeClues = state.runtimeClues.filter((item) => item.id !== clue.id);
  const level = getLevel();
  level.clues = level.clues.filter((item) => item.id !== clue.id);
  state.foundClues.delete(clue.id);
  state.selectedClueId = null;
  updateUI();
  updateEditorOverlay();
  render();
}

function makeUniqueClueId(base) {
  const taken = new Set(getLevel().clues.map((clue) => clue.id));
  let id = base.toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "") || "zone";
  let suffix = 1;
  while (taken.has(id)) {
    suffix += 1;
    id = `${base}_${suffix}`;
  }
  return id;
}

function resizeCurrentCharacter(factor) {
  if (!state.character) return;
  const nextScale = clamp(Number(state.character.scale || 1) * factor, 0.55, 1.55);
  state.character.scale = Math.round(nextScale * 100) / 100;
  const stored = editorData.characters.find((character) => character.id === state.character.id);
  if (stored) stored.scale = state.character.scale;
  applyCharacterScale();
  updateEditorOverlay();
}

function applyCharacterScale() {
  const scale = state.character ? Number(state.character.scale || 1) : 1;
  characterPanel.style.setProperty("--character-scale", String(scale));
}

function isOnResizeHandle(clue, x, y) {
  const size = 28;
  return x >= clue.x + clue.width - size && x <= clue.x + clue.width + size && y >= clue.y + clue.height - size && y <= clue.y + clue.height + size;
}

function getSelectedClue() {
  return state.runtimeClues.find((clue) => clue.id === state.selectedClueId) || null;
}

function updateHitbox(clue) {
  clue.hitbox = { x: clue.x, y: clue.y, width: clue.width, height: clue.height };
}

function findClueAt(x, y, includeFound) {
  for (let i = state.runtimeClues.length - 1; i >= 0; i -= 1) {
    const clue = state.runtimeClues[i];
    if (!includeFound && state.foundClues.has(clue.id)) continue;
    if (x >= clue.x && x <= clue.x + clue.width && y >= clue.y && y <= clue.y + clue.height) return clue;
  }
  return null;
}

function getCanvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (BASE_WIDTH / rect.width),
    y: (event.clientY - rect.top) * (BASE_HEIGHT / rect.height)
  };
}

function handleLogoTap() {
  const now = Date.now();
  if (now - state.lastLogoTapAt > 1400) state.logoTapCount = 0;
  state.logoTapCount += 1;
  state.lastLogoTapAt = now;
  if (state.logoTapCount >= 3) {
    state.logoTapCount = 0;
    openEditorKeypad();
  }
}

function openEditorKeypad() {
  state.editorCode = "";
  updateEditorCodeDisplay();
  editorKeypadStatus.textContent = "";
  editorKeypadModal.classList.remove("hidden");
}

function closeEditorKeypad() {
  editorKeypadModal.classList.add("hidden");
}

function addEditorDigit(digit) {
  if (state.editorCode.length >= 4) return;
  state.editorCode += String(digit);
  updateEditorCodeDisplay();
  if (state.editorCode.length === 4) submitEditorCode();
}

function clearEditorCode() {
  state.editorCode = "";
  updateEditorCodeDisplay();
}

function updateEditorCodeDisplay() {
  editorCodeDisplay.textContent = "●".repeat(state.editorCode.length) + "○".repeat(4 - state.editorCode.length);
}

function submitEditorCode() {
  if (state.editorCode === EDITOR_ACCESS_CODE) {
    state.editorUnlocked = true;
    closeEditorKeypad();
    enterEditor();
  } else {
    editorKeypadStatus.textContent = "Incorrect code.";
    clearEditorCode();
  }
}

function enterEditor() {
  if (!state.runtimeClues.length) {
    state.runtimeClues = getLevel().clues.map((clue) => ({ ...deepClone(clue), hitbox: { x: clue.x, y: clue.y, width: clue.width, height: clue.height } }));
  }
  state.editorMode = true;
  levelIntroStartButton.classList.add("hidden");
  stopTimer();
  document.body.classList.add("editor-active");
  updateEditorOverlay();
  render();
}

function exitEditor() {
  syncRuntimeToData();
  state.editorMode = false;
  document.body.classList.remove("editor-active");
  editorHelpOverlay.classList.add("hidden");
  if (state.mode === "level_intro") {
    levelIntroStartButton.classList.remove("hidden");
    characterPanel.classList.add("is-interactive");
  }
  openExportPanel(buildDataJsExport());
}

function updateEditorOverlay() {
  editorHelpOverlay.classList.toggle("hidden", !state.editorMode);
  const clue = getSelectedClue();
  const characterScale = state.character ? ` · character ${Number(state.character.scale || 1).toFixed(2)}x` : "";
  editorModeLabel.textContent = clue ? `EDITOR: ${clue.id} x:${clue.x} y:${clue.y} w:${clue.width} h:${clue.height} r:${clue.rotation || 0}${characterScale}` : `EDITOR: CLUES${characterScale}`;
}

function syncRuntimeToData() {
  const level = getLevel();
  level.clues = state.runtimeClues.map((runtime) => ({
    ...clueToData(runtime),
    x: Math.round(runtime.x),
    y: Math.round(runtime.y),
    width: Math.round(runtime.width),
    height: Math.round(runtime.height),
    rotation: Math.round(runtime.rotation || 0)
  }));
}

function startAnimationLoop() {
  state.lastAnimationTime = performance.now();
  const loop = (timestamp) => {
    const elapsed = Math.min(0.08, (timestamp - state.lastAnimationTime) / 1000);
    state.lastAnimationTime = timestamp;
    updateAmbient(elapsed);
    render();
    state.animationId = window.requestAnimationFrame(loop);
  };
  state.animationId = window.requestAnimationFrame(loop);
}

function resetAmbient() {
  const dust = getLevel().ambient?.dust || { enabled: true, count: 60, speed: 12, opacity: 0.25, drift: 14 };
  state.ambientParticles = [];
  state.ambientTime = Math.random() * 100;
  if (dust.enabled === false) return;
  const mobile = window.matchMedia("(pointer: coarse)").matches;
  const count = Math.round(Number(dust.count || 60) * (mobile ? 0.7 : 1));
  for (let i = 0; i < count; i += 1) state.ambientParticles.push(createDustParticle(true));
}

function createDustParticle(randomY = false) {
  const dust = getLevel().ambient?.dust || {};
  return {
    x: Math.random() * BASE_WIDTH,
    y: randomY ? Math.random() * BASE_HEIGHT : -40 - Math.random() * 80,
    radius: 1 + Math.random() * 2.4,
    speed: Number(dust.speed || 12) * (0.45 + Math.random() * 0.9),
    drift: Number(dust.drift || 14) * (Math.random() > 0.5 ? 1 : -1) * (0.2 + Math.random()),
    opacity: Number(dust.opacity || 0.25) * (0.65 + Math.random() * 0.8),
    phase: Math.random() * Math.PI * 2
  };
}

function updateAmbient(elapsed) {
  if (state.mode === "menu") return;
  state.ambientTime += elapsed;
  state.ambientParticles.forEach((p, index) => {
    p.phase += elapsed * 0.9;
    p.x += Math.sin(p.phase) * p.drift * elapsed;
    p.y += p.speed * elapsed;
    if (p.y > BASE_HEIGHT + 30 || p.x < -50 || p.x > BASE_WIDTH + 50) state.ambientParticles[index] = createDustParticle(false);
  });
}

function render() {
  clearCanvas();
  drawRoom();
  drawAmbientLights();
  drawDust(false);
  drawClues();
  drawDust(true);
  if (state.editorMode) drawEditorHitboxes();
}

function clearCanvas() {
  ctx.clearRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
}

function drawRoom() {
  const level = getLevel();
  const image = state.images[level.roomImage];
  if (image && image.complete && image.naturalWidth) {
    ctx.drawImage(image, 0, 0, BASE_WIDTH, BASE_HEIGHT);
    return;
  }
  ctx.fillStyle = "#1e1a17";
  ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
  ctx.fillStyle = "#f4e6c1";
  ctx.font = "32px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(`${level.name} background missing`, BASE_WIDTH / 2, BASE_HEIGHT / 2);
}

function drawAmbientLights() {
  const lights = getLevel().ambient?.lights || [];
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  lights.forEach((light, index) => {
    const baseAlpha = getRgbaAlpha(light.color, 0.24);
    const flicker = Math.sin(state.ambientTime * Number(light.speed || 1) + index * 2.1);
    const twitch = Math.sin(state.ambientTime * Number(light.speed || 1) * 4.4 + index);
    const amount = Number(light.flickerAmount || 0.06);
    const alpha = clamp(baseAlpha + flicker * amount + twitch * amount * 0.3, 0.03, 0.42);
    const gradient = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, light.radius || 280);
    gradient.addColorStop(0, setRgbaAlpha(light.color, alpha));
    gradient.addColorStop(0.5, setRgbaAlpha(light.color, alpha * 0.35));
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(light.x, light.y, light.radius || 280, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawDust(foreground) {
  if (!state.ambientParticles.length) return;
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const step = foreground ? 3 : 1;
  for (let i = 0; i < state.ambientParticles.length; i += step) {
    const p = state.ambientParticles[i];
    const shimmer = 0.55 + Math.sin(state.ambientTime * 1.3 + p.phase) * 0.25;
    ctx.globalAlpha = clamp(p.opacity * shimmer * (foreground ? 0.7 : 1), 0.035, foreground ? 0.22 : 0.42);
    ctx.fillStyle = "rgba(255,245,210,1)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, foreground ? p.radius * 0.7 : p.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawClues() {
  state.runtimeClues.forEach((clue) => {
    if (!state.editorMode && state.foundClues.has(clue.id)) return;
    const image = state.images[clue.image];
    if (image && image.complete && image.naturalWidth) {
      drawRotatedImage(image, clue.x, clue.y, clue.width, clue.height, clue.rotation || 0);
    } else {
      drawMissingClue(clue);
    }
  });
}

function drawRotatedImage(image, x, y, width, height, rotation) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(image, -width / 2, -height / 2, width, height);
  ctx.restore();
}

function drawMissingClue(clue) {
  ctx.save();
  ctx.translate(clue.x + clue.width / 2, clue.y + clue.height / 2);
  ctx.rotate(((clue.rotation || 0) * Math.PI) / 180);
  ctx.fillStyle = "rgba(120,30,30,.65)";
  ctx.fillRect(-clue.width / 2, -clue.height / 2, clue.width, clue.height);
  ctx.strokeStyle = "#f5d28c";
  ctx.lineWidth = 2;
  ctx.strokeRect(-clue.width / 2, -clue.height / 2, clue.width, clue.height);
  ctx.fillStyle = "#fff";
  ctx.font = "13px Arial";
  ctx.textAlign = "center";
  ctx.fillText(clue.name, 0, 4);
  ctx.restore();
}

function drawEditorHitboxes() {
  ctx.save();
  state.runtimeClues.forEach((clue) => {
    const selected = clue.id === state.selectedClueId;
    ctx.strokeStyle = selected ? "rgba(255,230,80,1)" : "rgba(255,40,40,.95)";
    ctx.fillStyle = selected ? "rgba(255,230,80,.16)" : "rgba(255,40,40,.12)";
    ctx.lineWidth = selected ? 4 : 2;
    ctx.fillRect(clue.x, clue.y, clue.width, clue.height);
    ctx.strokeRect(clue.x, clue.y, clue.width, clue.height);
    if (selected) {
      ctx.fillStyle = "rgba(255,230,80,.95)";
      ctx.fillRect(clue.x + clue.width - 12, clue.y + clue.height - 12, 12, 12);
      ctx.strokeStyle = "rgba(20,14,10,.9)";
      ctx.lineWidth = 2;
      ctx.strokeRect(clue.x + clue.width - 12, clue.y + clue.height - 12, 12, 12);
    }
  });
  ctx.restore();
}

function buildSelectedClueExport() {
  const clue = getSelectedClue();
  return clue ? JSON.stringify(clueToData(clue), null, 2) : "No selected clue.";
}

function buildDataJsExport() {
  syncRuntimeToData();
  return `/*\n  TIKUS: Hidden Evidence\n  data.js\n\n  Exported from the in-game clue editor on ${new Date().toLocaleString()}.\n*/\n\nconst GAME_DATA = ${JSON.stringify(editorData, null, 2)};\n`;
}

function clueToData(clue) {
  const { hitbox, ...data } = clue;
  return data;
}

function openExportPanel(text) {
  exportText.value = text;
  exportStatus.textContent = "Export ready.";
  exportModal.classList.remove("hidden");
}

function closeExportPanel() {
  exportModal.classList.add("hidden");
  if (state.mode === "playing" && !state.editorMode) startTimer();
}

async function copyExport() {
  await navigator.clipboard.writeText(exportText.value);
  exportStatus.textContent = "Copied.";
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
}

function updateRotateButton() {
  const isMobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 760;
  const isPortrait = window.innerHeight > window.innerWidth;
  rotateLandscapeButton.classList.toggle("hidden", !(isMobile && isPortrait));
}

async function forceLandscapeMode() {
  try {
    if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
    if (screen.orientation && screen.orientation.lock) {
      await screen.orientation.lock("landscape");
    }
    rotateLandscapeButton.textContent = "Horizontal Mode On";
  } catch (_) {
    rotateLandscapeButton.textContent = "Rotate Phone Horizontally";
  } finally {
    updateRotateButton();
  }
}

function deepClone(value) { return JSON.parse(JSON.stringify(value)); }
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
function getRgbaAlpha(value, fallback) { const match = String(value || "").match(/rgba?\(([^)]+)\)/i); if (!match) return fallback; const parts = match[1].split(",").map((part) => part.trim()); return Number.isFinite(Number(parts[3])) ? Number(parts[3]) : fallback; }
function setRgbaAlpha(value, alpha) { const match = String(value || "").match(/rgba?\(([^)]+)\)/i); if (!match) return `rgba(255,205,120,${alpha})`; const parts = match[1].split(",").map((part) => part.trim()); return `rgba(${parts[0] || 255}, ${parts[1] || 205}, ${parts[2] || 120}, ${alpha})`; }
