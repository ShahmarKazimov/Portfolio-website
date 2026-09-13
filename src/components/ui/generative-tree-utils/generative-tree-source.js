export const generativeTreeSource = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
</head>
<body>
<canvas id="c"></canvas>
<script>
(function() {
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);

  let GROWTH_SPEED_BASE = 0.006;
  const HOLD_DURATION = 400;
  const PARTICLE_COUNT = 50;
  const _pad = parseFloat(new URLSearchParams(location.search).get('p')) || 1;

  let branches = [];
  let particles = [];
  let holdTimer = 0;
  let fadeTimer = 0;
  let waitTimer = 0;
  let state = 'growing';

  function createBranch(x, y, angle, length, depth, maxDepth) {
    return {
      x: x, y: y, angle: angle, length: length, depth: depth, maxDepth: maxDepth,
      growthProgress: 0,
      growthSpeed: GROWTH_SPEED_BASE * (0.85 + Math.random() * 0.3),
      children: [],
      generatedChildren: false
    };
  }

  function createTree() {
    branches = [];
    particles = [];
    holdTimer = 0;
    fadeTimer = 0;
    waitTimer = 0;
    state = 'growing';

    const baseLen = Math.min(W, H) * 0.32 / _pad;
    const trunk = createBranch(W / 2, H, -Math.PI / 2, baseLen, 0, 7);
    branches.push(trunk);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.5 - 0.2,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  }

  function updateBranch(b) {
    if (b.growthProgress < 1) {
      b.growthProgress = Math.min(1, b.growthProgress + b.growthSpeed);
    } else if (!b.generatedChildren && b.depth < b.maxDepth) {
      b.generatedChildren = true;
      const endX = b.x + Math.cos(b.angle) * b.length;
      const endY = b.y + Math.sin(b.angle) * b.length;

      let numChildren = 2;
      let angles = [];

      if (b.depth === 0) {
        numChildren = 3;
        angles = [b.angle - 0.28, b.angle, b.angle + 0.28];
      } else if (b.depth === 1) {
        numChildren = 3;
        angles = [b.angle - 0.32, b.angle, b.angle + 0.32];
      } else {
        numChildren = Math.random() > 0.3 ? 2 : 3;
        const spread = 0.38 + Math.random() * 0.15;
        for (let i = 0; i < numChildren; i++) {
          angles.push((b.angle) + (i - (numChildren - 1) / 2) * spread + (Math.random() - 0.5) * 0.1);
        }
      }

      for (let i = 0; i < numChildren; i++) {
        const childLength = b.length * (0.68 + Math.random() * 0.08);
        b.children.push(createBranch(endX, endY, angles[i], childLength, b.depth + 1, b.maxDepth));
      }
    }
    b.children.forEach(updateBranch);
  }

  function drawBranch(b, fadeAlpha) {
    const currentLen = b.length * b.growthProgress;
    const endX = b.x + Math.cos(b.angle) * currentLen;
    const endY = b.y + Math.sin(b.angle) * currentLen;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(endX, endY);

    const thickness = Math.max(0.6, 4.5 * Math.pow(0.72, b.depth));
    ctx.lineWidth = thickness;

    let strokeStyle, shadowColor, shadowBlur = 0;
    if (b.depth < 2) {
      strokeStyle = "rgba(160, 105, 45, " + (fadeAlpha * 0) + ")";
      shadowColor = "rgba(180, 120, 55, " + (fadeAlpha * 0.4) + ")";
      shadowBlur = 2;
    } else if (b.depth < 5) {
      strokeStyle = "rgba(185, 135, 50, " + (fadeAlpha * 0.9) + ")";
      shadowColor = "rgba(200, 150, 60, " + (fadeAlpha * 0.4) + ")";
      shadowBlur = 4;
    } else {
      strokeStyle = "rgba(225, 195, 100, " + (fadeAlpha * 0.85) + ")";
      shadowColor = "rgba(240, 215, 120, " + (fadeAlpha * 0.6) + ")";
      shadowBlur = 6;
    }

    ctx.strokeStyle = strokeStyle;
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = shadowBlur;
    ctx.lineCap = 'round';
    ctx.stroke();

    if (b.depth >= 4 && b.growthProgress >= 0.7) {
      const leafCount = Math.floor(4 + Math.random() * 4);
      for (let l = 0; l < leafCount; l++) {
        const lx = endX + (Math.random() - 0.5) * 14;
        const ly = endY + (Math.random() - 0.5) * 14;
        const lSize = Math.random() * 1.5 + 0.5;
        ctx.beginPath();
        ctx.arc(lx, ly, lSize, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(235, 215, 130, " + (fadeAlpha * (0.3 + Math.random() * 0.4)) + ")";
        ctx.fill();
      }
    }

    ctx.restore();

    b.children.forEach(function(c) { drawBranch(c, fadeAlpha); });
  }

  function isTreeFullyGrown(b) {
    if (b.growthProgress < 1) return false;
    if (b.children.length === 0) return true;
    return b.children.every(isTreeFullyGrown);
  }

  function frame(time) {
    // Decay shake
    ctx.clearRect(0, 0, W, H);

    let fadeAlpha = 1;
    if (state === 'growing') {
      branches.forEach(updateBranch);
      if (branches.every(isTreeFullyGrown)) {
        state = 'holding';
      }
    } else if (state === 'holding') {
      holdTimer++;
      if (holdTimer >= HOLD_DURATION) {
        state = 'fading';
      }
    } else if (state === 'fading') {
      fadeTimer++;
      fadeAlpha = Math.max(0, 1 - fadeTimer / 100);
      if (fadeTimer >= 100) {
        state = 'waiting';
      }
    } else if (state === 'waiting') {
      waitTimer++;
      fadeAlpha = 0;
      if (waitTimer >= 60) {
        createTree();
      }
    }

    particles.forEach(function(p) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < 0) { p.y = H; p.x = Math.random() * W; }
      ctx.fillStyle = "rgba(235, 210, 120, " + (p.alpha * fadeAlpha) + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    branches.forEach(function(b) { drawBranch(b, fadeAlpha); });

    requestAnimationFrame(frame);
  }

  createTree();
  requestAnimationFrame(frame);
})();
</script>
</body>
</html>`;
