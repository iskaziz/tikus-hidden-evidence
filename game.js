(() => {
  'use strict';

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const fxCanvas = document.getElementById('effectsCanvas');
  const fx = fxCanvas.getContext('2d');

  const levelNameEl = document.getElementById('levelName');
  const scoreEl = document.getElementById('scoreText');
  const timerEl = document.getElementById('timerText');
  const clueListEl = document.getElementById('clueList');
  const overlay = document.getElementById('messageOverlay');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayText = document.getElementById('overlayText');
  const overlayButtons = document.getElementById('overlayButtons');
  const rotatePrompt = document.getElementById('mobileRotatePrompt');
  const rotateBtn = document.getElementById('rotateBtn');
  const messageCharacterEl = document.getElementById('messageCharacter');

  const state = {
    levelIndex: 0,
    found: new Set(),
    score: 0,
    timeLeft: GAME_DATA.timerSeconds,
    running: false,
    completedAll: false,
    lastTimestamp: 0,
    levelEnded: false,
    initialStartShown: false,
    wiggleActive: false,
    foundBursts: [],
    levelCharacters: new Map()
  };

  const images = new Map();
  const dust = createDust(125);
  let audioCtx = null;
  let timerId = null;

  preload().then(() => {
    bindEvents();
    renderStaticFrame();
    handleMobileStartGate();
    requestAnimationFrame(loop);
  });

  function preload() {
    const paths = new Set();
    GAME_DATA.levels.forEach(level => paths.add(level.background));
    Object.values(GAME_DATA.clues).forEach(clue => paths.add(clue.asset));

    return Promise.all([...paths].map(path => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => { images.set(path, img); resolve(); };
      img.onerror = () => reject(new Error(`Unable to load ${path}`));
      img.src = path;
    })));
  }

  function bindEvents() {
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('resize', handleMobileStartGate);
    window.addEventListener('orientationchange', handleMobileStartGate);

    if (messageCharacterEl) {
      messageCharacterEl.addEventListener('error', () => messageCharacterEl.classList.add('missing'));
    }

    rotateBtn.addEventListener('click', async () => {
      ensureAudio();
      try {
        if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
        if (screen.orientation && screen.orientation.lock) await screen.orientation.lock('landscape');
      } catch (err) {
        // Browser may block orientation lock. Fullscreen landscape prompt remains useful.
      }
      handleMobileStartGate();
    });
  }

  function currentLevel() {
    return GAME_DATA.levels[state.levelIndex];
  }

  function assignCharacterForLevel() {
    const level = currentLevel();
    if (!GAME_DATA.characters || GAME_DATA.characters.length === 0 || !messageCharacterEl) return;

    if (!state.levelCharacters.has(level.id)) {
      const previousLevel = GAME_DATA.levels[state.levelIndex - 1];
      const previousCharacterId = previousLevel ? state.levelCharacters.get(previousLevel.id) : null;
      let pool = GAME_DATA.characters;

      if (pool.length > 1 && previousCharacterId) {
        pool = pool.filter(character => character.id !== previousCharacterId);
      }

      const selected = pool[Math.floor(Math.random() * pool.length)];
      state.levelCharacters.set(level.id, selected.id);
    }

    const selectedId = state.levelCharacters.get(level.id);
    const character = GAME_DATA.characters.find(item => item.id === selectedId) || GAME_DATA.characters[0];
    messageCharacterEl.src = character.asset;
    messageCharacterEl.alt = character.alt || '';
    messageCharacterEl.classList.remove('missing');
  }

  function showStartScreen() {
    clearReportBreakdowns();
    const level = currentLevel();
    state.running = false;
    state.levelEnded = false;
    assignCharacterForLevel();
    levelNameEl.textContent = level.name;
    overlayTitle.textContent = state.levelIndex === 0 ? 'Welcome to TIKUS: Hidden Evidence' : level.startTitle;
    overlayText.textContent = state.levelIndex === 0
      ? 'Search Samasihat Wellness Retreat for evidence. Each clue is worth 10 points. Finish fast for a time bonus.'
      : level.startMessage;
    setButtons([
      { label: state.levelIndex === 0 ? 'Start Game' : 'Start Level', className: 'primary-btn', action: startLevel },
      { label: 'Restart Game', className: 'secondary-btn', action: restartGame }
    ]);
    overlay.classList.remove('hidden');
    renderStaticFrame();
  }

  function startLevel() {
    ensureAudio();
    const level = currentLevel();
    state.found = new Set();
    state.timeLeft = GAME_DATA.timerSeconds;
    state.running = true;
    state.levelEnded = false;
    state.wiggleActive = false;
    overlay.classList.add('hidden');
    levelNameEl.textContent = level.name;
    updateHud();
    renderClueList();
    clearInterval(timerId);
    timerId = setInterval(tickTimer, 1000);
  }

  function tickTimer() {
    if (!state.running) return;
    state.timeLeft -= 1;
    if (state.timeLeft <= 10) state.wiggleActive = true;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      updateHud();
      endLevel(false);
      return;
    }
    updateHud();
  }

  function onPointerDown(event) {
    if (!state.running) return;
    ensureAudio();
    const pt = getCanvasPoint(event);
    const level = currentLevel();

    for (let i = level.clues.length - 1; i >= 0; i--) {
      const clue = level.clues[i];
      if (state.found.has(clue.id)) continue;
      if (pointInBox(pt, clue.bbox)) {
        findClue(clue);
        return;
      }
    }
  }

  function getCanvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const scale = Math.max(rect.width / canvas.width, rect.height / canvas.height);
    const drawnW = canvas.width * scale;
    const drawnH = canvas.height * scale;
    const offsetX = (rect.width - drawnW) / 2;
    const offsetY = (rect.height - drawnH) / 2;
    return {
      x: (event.clientX - rect.left - offsetX) / scale,
      y: (event.clientY - rect.top - offsetY) / scale
    };
  }

  function pointInBox(pt, box) {
    return pt.x >= box.x && pt.x <= box.x + box.w && pt.y >= box.y && pt.y <= box.y + box.h;
  }

  function findClue(clue) {
    state.found.add(clue.id);
    state.score += GAME_DATA.scoring.clue;
    state.foundBursts.push({ x: clue.center.x, y: clue.center.y, age: 0, id: clue.id });
    renderClueList();
    updateHud();

    const level = currentLevel();
    const isFinalClue = state.found.size === level.clues.length;
    if (isFinalClue) {
      playLevelVictorySound();
      setTimeout(() => endLevel(true), 450);
    } else {
      playClueSound();
    }
  }

  function endLevel(success) {
    if (state.levelEnded) return;
    clearReportBreakdowns();
    state.running = false;
    state.levelEnded = true;
    clearInterval(timerId);

    const level = currentLevel();
    const foundCount = state.found.size;
    const missing = level.clues.length - foundCount;
    const cluePoints = foundCount * GAME_DATA.scoring.clue;
    const timeBonus = success ? state.timeLeft * GAME_DATA.scoring.timeBonus : 0;
    const penalty = missing * GAME_DATA.scoring.missingPenalty;
    const levelScore = cluePoints + timeBonus - penalty;
    state.score += timeBonus - penalty;
    updateHud();

    if (!success) playBuzzerSound();

    const allLevelsDone = success && state.levelIndex === GAME_DATA.levels.length - 1;
    if (allLevelsDone) {
      state.completedAll = true;
      setTimeout(playCheerSound, 650);
    }

    const foundNames = level.clues
      .filter(clue => state.found.has(clue.id))
      .map(clue => GAME_DATA.clues[clue.id].label)
      .join(', ') || 'None';

    overlayTitle.textContent = allLevelsDone ? 'CASE CLOSED' : 'LEVEL REPORT';
    overlayText.innerHTML = success
      ? `<strong>Evidence secured.</strong> ${foundNames}`
      : `<strong>Time expired.</strong> Evidence found: ${foundNames}`;

    const report = document.createElement('div');
    report.className = 'report-breakdown';
    report.innerHTML = `
      <div class="report-row"><span>Found</span><strong>${foundCount} / ${level.clues.length}</strong></div>
      <div class="report-row"><span>Evidence</span><strong>${cluePoints}</strong></div>
      <div class="report-row"><span>Time</span><strong>+${timeBonus}</strong></div>
      <div class="report-row"><span>Penalty</span><strong>-${penalty}</strong></div>
      <div class="report-row total"><span>Level</span><strong>${levelScore}</strong></div>
      <div class="report-row total"><span>Case score</span><strong>${state.score}</strong></div>
    `;

    overlayButtons.innerHTML = '';
    overlayText.after(report);
    const buttons = [];
    buttons.push({ label: 'Restart Level', className: 'secondary-btn', action: () => { report.remove(); startLevel(); } });
    if (success && state.levelIndex < GAME_DATA.levels.length - 1) {
      buttons.push({ label: 'Next Level', className: 'primary-btn', action: () => { report.remove(); state.levelIndex += 1; showStartScreen(); } });
    }
    if (allLevelsDone) {
      buttons.push({ label: 'Restart Game', className: 'primary-btn', action: () => { report.remove(); restartGame(); } });
    } else {
      buttons.push({ label: 'Restart Game', className: 'secondary-btn', action: () => { report.remove(); restartGame(); } });
    }
    setButtons(buttons);
    overlay.classList.remove('hidden');
  }

  function clearReportBreakdowns() {
    document.querySelectorAll('.report-breakdown').forEach(el => el.remove());
  }

  function setButtons(buttons) {
    overlayButtons.innerHTML = '';
    buttons.forEach(btn => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = btn.className;
      el.textContent = btn.label;
      el.addEventListener('click', btn.action);
      overlayButtons.appendChild(el);
    });
  }

  function restartGame() {
    clearInterval(timerId);
    state.levelIndex = 0;
    state.score = 0;
    state.completedAll = false;
    state.levelCharacters = new Map();
    state.found = new Set();
    state.timeLeft = GAME_DATA.timerSeconds;
    updateHud();
    renderClueList();
    showStartScreen();
  }

  function updateHud() {
    scoreEl.textContent = String(state.score);
    timerEl.textContent = String(state.timeLeft);
    timerEl.classList.toggle('danger', state.timeLeft <= 10 && state.running);
  }

  function renderClueList() {
    const level = currentLevel();
    clueListEl.innerHTML = '';
    level.clues.forEach(clue => {
      const li = document.createElement('li');
      li.textContent = GAME_DATA.clues[clue.id].label;
      li.dataset.clue = clue.id;
      if (state.found.has(clue.id)) li.classList.add('found');
      clueListEl.appendChild(li);
    });
  }

  function loop(timestamp) {
    const dt = Math.min(0.05, (timestamp - state.lastTimestamp) / 1000 || 0.016);
    state.lastTimestamp = timestamp;
    drawGame(timestamp);
    drawEffects(dt, timestamp);
    requestAnimationFrame(loop);
  }

  function renderStaticFrame() {
    drawGame(performance.now());
  }

  function drawGame(timestamp) {
    const level = currentLevel();
    const bg = images.get(level.background);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    // Stronger flickering room wash: visible, atmospheric, but still playable.
    const flicker = 0.075 + Math.sin(timestamp * 0.0075) * 0.03 + Math.sin(timestamp * 0.021) * 0.018;
    ctx.save();
    ctx.fillStyle = `rgba(255, 207, 118, ${Math.max(0.035, flicker)})`;
    ctx.globalCompositeOperation = 'soft-light';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Occasional dim pulses make the flicker feel like old bungalow lighting.
    const dim = 0.035 + Math.max(0, Math.sin(timestamp * 0.011 + 1.7)) * 0.035;
    ctx.save();
    ctx.fillStyle = `rgba(20, 10, 4, ${dim})`;
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    level.clues.forEach(clue => {
      if (state.found.has(clue.id)) return;
      drawClue(clue, timestamp);
    });
  }

  function drawClue(clue, timestamp) {
    const clueData = GAME_DATA.clues[clue.id];
    const img = images.get(clueData.asset);
    const longSide = Math.max(img.width, img.height);
    const scale = clue.size / longSide;
    const w = img.width * scale;
    const h = img.height * scale;
    const wiggle = state.wiggleActive ? Math.sin(timestamp * 0.026 + clue.center.x) * 4 : 0;

    ctx.save();
    ctx.translate(clue.center.x + wiggle, clue.center.y);
    ctx.rotate((clue.rotation * Math.PI) / 180);
    ctx.globalAlpha = 1;
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
  }

  function drawEffects(dt, timestamp) {
    fx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

    drawFlickeringLight(timestamp);

    dust.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life += dt;
      if (p.x < -30 || p.x > fxCanvas.width + 30 || p.y < -30 || p.y > fxCanvas.height + 30) resetDust(p, true);
      const pulse = 0.5 + Math.sin(p.life * 1.8) * 0.5;
      const alpha = p.alpha * (0.55 + pulse * 0.45);
      fx.beginPath();
      fx.fillStyle = `rgba(255, 232, 178, ${alpha})`;
      fx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      fx.fill();
    });

    for (let i = state.foundBursts.length - 1; i >= 0; i--) {
      const b = state.foundBursts[i];
      b.age += dt;
      const t = b.age / 0.65;
      if (t >= 1) {
        state.foundBursts.splice(i, 1);
        continue;
      }
      fx.save();
      fx.globalAlpha = 1 - t;
      fx.strokeStyle = 'rgba(255, 224, 138, .9)';
      fx.lineWidth = 4;
      fx.beginPath();
      fx.arc(b.x, b.y, 22 + t * 55, 0, Math.PI * 2);
      fx.stroke();
      fx.fillStyle = 'rgba(255, 248, 210, .9)';
      fx.font = 'bold 28px Georgia, serif';
      fx.textAlign = 'center';
      fx.fillText('+10', b.x, b.y - 34 - t * 18);
      fx.restore();
    }
  }


  function drawFlickeringLight(timestamp) {
    const level = currentLevel();
    const pulse = 0.115 + Math.sin(timestamp * 0.0062) * 0.055 + Math.sin(timestamp * 0.018) * 0.025;
    const snap = Math.max(0, Math.sin(timestamp * 0.039)) * 0.025;
    const warm = Math.max(0.04, pulse + snap);

    fx.save();
    fx.globalCompositeOperation = 'screen';

    // Level-specific light sources: kitchen cabinet lamps / sink reflection, sitting-room chandelier and lamps.
    const sources = level.id === 'kitchen'
      ? [
          { x: 610, y: 250, r: 620, a: warm },
          { x: 1500, y: 420, r: 520, a: warm * 0.68 }
        ]
      : [
          { x: 1220, y: 120, r: 680, a: warm * 0.92 },
          { x: 460, y: 420, r: 520, a: warm * 0.72 }
        ];

    sources.forEach(src => {
      const g = fx.createRadialGradient(src.x, src.y, 0, src.x, src.y, src.r);
      g.addColorStop(0, `rgba(255, 210, 126, ${src.a})`);
      g.addColorStop(0.38, `rgba(255, 183, 90, ${src.a * 0.42})`);
      g.addColorStop(1, 'rgba(255, 183, 90, 0)');
      fx.fillStyle = g;
      fx.fillRect(0, 0, fxCanvas.width, fxCanvas.height);
    });

    fx.restore();
  }

  function createDust(count) {
    return Array.from({ length: count }, () => {
      const p = {};
      resetDust(p, false);
      return p;
    });
  }

  function resetDust(p, fromEdge) {
    p.x = fromEdge ? -20 : Math.random() * fxCanvas.width;
    p.y = Math.random() * fxCanvas.height;
    p.vx = 8 + Math.random() * 24;
    p.vy = -5 + Math.random() * 10;
    p.r = 0.7 + Math.random() * 2.6;
    p.alpha = 0.045 + Math.random() * 0.075;
    p.life = Math.random() * 10;
  }

  function shouldShowRotatePrompt() {
    const isMobile = matchMedia('(pointer: coarse)').matches;
    const portrait = window.innerHeight > window.innerWidth;
    return isMobile && portrait;
  }

  function updateMobilePrompt() {
    const showPrompt = shouldShowRotatePrompt();
    rotatePrompt.classList.toggle('hidden', !showPrompt);
    return showPrompt;
  }

  function handleMobileStartGate() {
    const showPrompt = updateMobilePrompt();

    if (showPrompt) {
      overlay.classList.add('hidden');
      return;
    }

    if (!state.initialStartShown && !state.running) {
      state.initialStartShown = true;
      showStartScreen();
    }
  }

  function ensureAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  }

  function tone(freq, duration, type = 'sine', gainValue = 0.08, delay = 0) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(gainValue, audioCtx.currentTime + delay + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + duration);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + delay);
    osc.stop(audioCtx.currentTime + delay + duration + 0.02);
  }

  function playClueSound() {
    tone(540, 0.08, 'triangle', 0.06);
    tone(840, 0.09, 'triangle', 0.04, 0.06);
  }

  function playLevelVictorySound() {
    tone(523.25, 0.12, 'triangle', 0.08, 0);
    tone(659.25, 0.12, 'triangle', 0.08, 0.12);
    tone(783.99, 0.18, 'triangle', 0.08, 0.24);
  }

  function playBuzzerSound() {
    tone(140, 0.55, 'sawtooth', 0.11, 0);
    tone(95, 0.55, 'square', 0.05, 0.05);
  }

  function playCheerSound() {
    // A simple synthesized crowd cheer: layered fast bright tones and soft noise-like pulses.
    [392, 523, 659, 784, 988, 1175].forEach((f, i) => tone(f, 0.35, 'triangle', 0.035, i * 0.045));
    [880, 1046, 1318, 1568].forEach((f, i) => tone(f, 0.18, 'sine', 0.04, 0.28 + i * 0.05));
    for (let i = 0; i < 12; i++) tone(220 + Math.random() * 680, 0.08, 'square', 0.012, 0.08 + i * 0.06);
  }
})();
