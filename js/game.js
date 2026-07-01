const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const clueFooter = document.getElementById('clueFooter');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const levelNameOverlay = document.getElementById('levelNameOverlay');
const messageBox = document.getElementById('messageBox');
const messageText = document.getElementById('messageText');
const messageButton = document.getElementById('messageButton');
const feiskLogo = document.getElementById('feiskLogo');

const VIRTUAL_W = 1920;
const VIRTUAL_H = 1080;
const LEVEL_SECONDS = 30;
const DUST_COUNT = 95;

let levelIndex = 0;
let level = null;
let bgImage = null;
let score = 0;
let timeLeft = LEVEL_SECONDS;
let timerId = null;
let running = false;
let dustParticles = [];
let lastFrameTime = performance.now();

feiskLogo.addEventListener('error', () => {
  feiskLogo.style.display = 'none';
});

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load image: ${src}`));
    img.src = src;
  });
}

async function loadLevel(index) {
  levelIndex = index;
  level = structuredClone(LEVELS[index]);
  level.items.forEach(item => item.found = false);
  bgImage = await loadImage(level.background);

  await Promise.all(
    level.items.map(async item => {
      item.img = await loadImage(item.file);
    })
  );

  score = 0;
  timeLeft = LEVEL_SECONDS;
  running = false;
  resetDustParticles();
  renderClueFooter();
  updateHud();
  draw();
  showMessage(level.startMessage, 'START', startLevel);
}

function startLevel() {
  hideMessage();
  running = true;
  clearInterval(timerId);

  timerId = setInterval(() => {
    timeLeft--;
    updateHud();

    if (timeLeft <= 0) {
      endLevel(false);
    }
  }, 1000);
}

function endLevel(completed) {
  running = false;
  clearInterval(timerId);

  const total = level.items.length;
  const found = level.items.filter(item => item.found).length;
  const missed = total - found;
  const cluePoints = score;
  const timeBonus = completed ? timeLeft * 2 : 0;
  const missedPenalty = missed * 2;
  const finalScore = cluePoints + timeBonus - missedPenalty;

  const reportLines = [
    `${level.title} REPORT`,
    '',
    `Found clues: ${found}/${total}`,
    `Clue points: ${cluePoints}`,
    `Time bonus: ${timeBonus}`,
    `Missed penalty: -${missedPenalty}`,
    `Final score: ${finalScore}`
  ];

  const isLastLevel = levelIndex >= LEVELS.length - 1;
  const buttonText = completed && !isLastLevel ? 'NEXT LEVEL' : 'RESTART';

  showMessage(reportLines.join('\n'), buttonText, () => {
    if (completed && !isLastLevel) {
      loadLevel(levelIndex + 1);
    } else {
      loadLevel(levelIndex);
    }
  });
}

function showMessage(text, buttonText, onClick) {
  messageText.textContent = text;
  messageButton.textContent = buttonText;
  messageButton.onclick = onClick;
  messageBox.classList.remove('hidden');
}

function hideMessage() {
  messageBox.classList.add('hidden');
}

function updateHud() {
  scoreEl.textContent = `SCORE ${score}`;
  timerEl.textContent = `TIME ${timeLeft}`;
  levelNameOverlay.textContent = level ? level.title : '';
}

function renderClueFooter() {
  clueFooter.innerHTML = '';
  clueFooter.classList.toggle('empty', level.items.length === 0);

  level.items.forEach(item => {
    const el = document.createElement('span');
    el.className = 'clue' + (item.found ? ' found' : '');
    el.dataset.itemId = item.id;
    el.textContent = item.name;
    clueFooter.appendChild(el);
  });
}

function resetDustParticles() {
  dustParticles = Array.from({ length: DUST_COUNT }, () => ({
    x: Math.random() * VIRTUAL_W,
    y: Math.random() * VIRTUAL_H,
    r: 0.6 + Math.random() * 1.8,
    speedX: -0.08 + Math.random() * 0.16,
    speedY: 0.05 + Math.random() * 0.28,
    alpha: 0.05 + Math.random() * 0.16,
    phase: Math.random() * Math.PI * 2
  }));
}

function updateDust(delta) {
  const step = Math.min(delta / 16.67, 2);

  dustParticles.forEach(particle => {
    particle.x += particle.speedX * step;
    particle.y += particle.speedY * step;
    particle.phase += 0.018 * step;

    if (particle.y > VIRTUAL_H + 20) {
      particle.y = -20;
      particle.x = Math.random() * VIRTUAL_W;
    }

    if (particle.x < -20) particle.x = VIRTUAL_W + 20;
    if (particle.x > VIRTUAL_W + 20) particle.x = -20;
  });
}

function drawDust() {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  dustParticles.forEach(particle => {
    const shimmer = 0.55 + Math.sin(particle.phase) * 0.45;
    ctx.globalAlpha = particle.alpha * shimmer;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.fillStyle = '#f7e8bf';
    ctx.fill();
  });

  ctx.restore();
}

function drawFlickeringLight(now) {
  const flicker = 0.045 + Math.sin(now / 120) * 0.018 + Math.sin(now / 43) * 0.012;
  const pulse = Math.max(0.015, flicker);

  const gradient = ctx.createRadialGradient(
    VIRTUAL_W * 0.5,
    VIRTUAL_H * 0.2,
    60,
    VIRTUAL_W * 0.5,
    VIRTUAL_H * 0.22,
    VIRTUAL_W * 0.95
  );

  gradient.addColorStop(0, `rgba(255, 219, 143, ${pulse})`);
  gradient.addColorStop(0.42, `rgba(255, 196, 104, ${pulse * 0.58})`);
  gradient.addColorStop(1, 'rgba(255, 196, 104, 0)');

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, VIRTUAL_W, VIRTUAL_H);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.08 + pulse * 0.5;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.fillRect(0, 0, VIRTUAL_W, VIRTUAL_H);
  ctx.restore();
}

function draw() {
  ctx.clearRect(0, 0, VIRTUAL_W, VIRTUAL_H);

  if (!bgImage) return;

  ctx.drawImage(bgImage, 0, 0, VIRTUAL_W, VIRTUAL_H);

  const now = performance.now();
  drawFlickeringLight(now);
  drawDust();

  level.items.forEach(item => {
    if (item.found) return;

    ctx.save();
    if (running && timeLeft <= 10) {
      const wiggle = Math.sin(Date.now() / 90 + item.x) * 2;
      ctx.translate(wiggle, 0);
    }
    ctx.drawImage(item.img, item.x, item.y, item.w, item.h);
    ctx.restore();
  });
}

function renderLoop(now) {
  const delta = now - lastFrameTime;
  lastFrameTime = now;

  updateDust(delta);
  draw();
  requestAnimationFrame(renderLoop);
}

function canvasToVirtual(evt) {
  const rect = canvas.getBoundingClientRect();
  const scale = Math.min(rect.width / VIRTUAL_W, rect.height / VIRTUAL_H);
  const drawnW = VIRTUAL_W * scale;
  const drawnH = VIRTUAL_H * scale;
  const offsetX = (rect.width - drawnW) / 2;
  const offsetY = (rect.height - drawnH) / 2;

  return {
    x: (evt.clientX - rect.left - offsetX) / scale,
    y: (evt.clientY - rect.top - offsetY) / scale
  };
}

canvas.addEventListener('pointerdown', evt => {
  if (!running || level.items.length === 0) return;

  const p = canvasToVirtual(evt);

  for (let i = level.items.length - 1; i >= 0; i--) {
    const item = level.items[i];
    if (item.found) continue;

    const hit =
      p.x >= item.x &&
      p.x <= item.x + item.w &&
      p.y >= item.y &&
      p.y <= item.y + item.h;

    if (!hit) continue;

    item.found = true;
    score += 10;
    updateHud();
    renderClueFooter();
    drawFoundPulse(item);

    if (level.items.every(candidate => candidate.found)) {
      endLevel(true);
    }

    return;
  }
});

function drawFoundPulse(item) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 230, 150, 0.9)';
  ctx.lineWidth = 5;
  ctx.strokeRect(item.x - 8, item.y - 8, item.w + 16, item.h + 16);
  ctx.restore();
}

requestAnimationFrame(renderLoop);
loadLevel(0);
