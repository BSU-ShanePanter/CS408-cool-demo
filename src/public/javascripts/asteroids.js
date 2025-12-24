document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  // Game variables
  let score = 0;
  let level = 1;
  let lives = 3;
  let isPaused = false;
  let gameOverFlag = false;

  // Player
  const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 15,
    height: 15,
    angle: 0,
    velocityX: 0,
    velocityY: 0,
    speed: 1.0,
    maxAccel: 0.2,
    maxSpeed: 8,
    rotation: 0
  };

  let bullets = [];
  let asteroids = [];
  const keys = {};

  // Asteroid class
  class Asteroid {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.velocityX = (Math.random() - 0.5) * 3;
      this.velocityY = (Math.random() - 0.5) * 3;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.1;
    }

    update() {
      this.x += this.velocityX;
      this.y += this.velocityY;
      this.rotation += this.rotationSpeed;

      // Wrap around
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.strokeStyle = '#0f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * this.size;
        const y = Math.sin(angle) * this.size;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  }

  // Initialize game
  function initGame() {
    asteroids = [];
    const asteroidCount = 3 + level;
    for (let i = 0; i < asteroidCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      if (Math.hypot(x - player.x, y - player.y) > 100) {
        asteroids.push(new Asteroid(x, y, 30));
      }
    }
  }

  // Keyboard events
  window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ') {
      e.preventDefault();
      if (!gameOverFlag && !isPaused) shoot();
    }
    if (e.key === 'p' || e.key === 'P') {
      isPaused = !isPaused;
    }
  });

  window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });

  function shoot() {
    const bullet = {
      x: player.x + Math.cos(player.angle) * 15,
      y: player.y + Math.sin(player.angle) * 15,
      velocityX: Math.cos(player.angle) * 7 + player.velocityX,
      velocityY: Math.sin(player.angle) * 7 + player.velocityY,
      life: 60
    };
    bullets.push(bullet);
  }

  function updatePlayer() {
    if (keys['ArrowLeft']) player.angle -= 0.1;
    if (keys['ArrowRight']) player.angle += 0.1;

    if (keys['ArrowUp']) {
      // Apply thrust with a cap on instantaneous acceleration
      let ax = Math.cos(player.angle) * player.speed;
      let ay = Math.sin(player.angle) * player.speed;
      const aMag = Math.hypot(ax, ay);
      if (aMag > player.maxAccel) {
        const scale = player.maxAccel / aMag;
        ax *= scale;
        ay *= scale;
      }
      player.velocityX += ax;
      player.velocityY += ay;
    }

    // Apply friction
    player.velocityX *= 0.99;
    player.velocityY *= 0.99;

    // Clamp maximum speed to avoid runaway acceleration
    const currentSpeed = Math.hypot(player.velocityX, player.velocityY);
    if (currentSpeed > player.maxSpeed) {
      const scale = player.maxSpeed / currentSpeed;
      player.velocityX *= scale;
      player.velocityY *= scale;
    }

    player.x += player.velocityX;
    player.y += player.velocityY;

    // Wrap around
    if (player.x < 0) player.x = canvas.width;
    if (player.x > canvas.width) player.x = 0;
    if (player.y < 0) player.y = canvas.height;
    if (player.y > canvas.height) player.y = 0;
  }

  function drawPlayer() {
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle);
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(-10, -10);
    ctx.lineTo(-5, 0);
    ctx.lineTo(-10, 10);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].x += bullets[i].velocityX;
      bullets[i].y += bullets[i].velocityY;
      bullets[i].life--;

      if (bullets[i].life <= 0) {
        bullets.splice(i, 1);
      }
    }
  }

  function drawBullets() {
    ctx.fillStyle = '#0f0';
    bullets.forEach((bullet) => {
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function checkCollisions() {
    for (let i = bullets.length - 1; i >= 0; i--) {
      for (let j = asteroids.length - 1; j >= 0; j--) {
        const dx = bullets[i].x - asteroids[j].x;
        const dy = bullets[i].y - asteroids[j].y;
        const distance = Math.hypot(dx, dy);

        if (distance < asteroids[j].size) {
          score += 10 * asteroids[j].size;
          bullets.splice(i, 1);

          if (asteroids[j].size > 10) {
            asteroids.push(new Asteroid(asteroids[j].x, asteroids[j].y, asteroids[j].size / 2));
            asteroids.push(new Asteroid(asteroids[j].x, asteroids[j].y, asteroids[j].size / 2));
          }
          asteroids.splice(j, 1);
          break;
        }
      }
    }

    // Check player-asteroid collision
    for (let i = 0; i < asteroids.length; i++) {
      const dx = player.x - asteroids[i].x;
      const dy = player.y - asteroids[i].y;
      const distance = Math.hypot(dx, dy);

      if (distance < asteroids[i].size + 10) {
        lives--;
        if (lives <= 0) {
          gameOverFlag = true;
          document.getElementById('gameOver').style.display = 'block';
          document.getElementById('finalScore').textContent = `Final Score: ${score}`;
          return;
        }
        player.x = canvas.width / 2;
        player.y = canvas.height / 2;
        player.velocityX = 0;
        player.velocityY = 0;
        break;
      }
    }
  }

  function update() {
    if (!isPaused && !gameOverFlag) {
      updatePlayer();
      updateBullets();
      asteroids.forEach((ast) => ast.update());
      checkCollisions();

      if (asteroids.length === 0) {
        level++;
        initGame();
      }
    }
  }

  function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawBullets();
    asteroids.forEach((ast) => ast.draw());

    if (isPaused) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f0';
      ctx.font = '40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    }
  }

  function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('lives').textContent = lives;
  }

  function gameLoop() {
    update();
    draw();
    updateUI();
    requestAnimationFrame(gameLoop);
  }

  initGame();
  gameLoop();
});
