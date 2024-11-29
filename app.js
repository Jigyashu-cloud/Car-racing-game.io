const canvas = document.getElementById('racingGameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.7;

// Constants
const carWidth = 50;
const carHeight = 100;
const roadWidth = 300;
const roadX = (canvas.width - roadWidth) / 2;
const carSpeed = 5;
let carX = canvas.width / 2 - carWidth / 2;
let carY = canvas.height - carHeight - 10;
let carVelocity = 0;
let leftPressed = false;
let rightPressed = false;
let obstacles = [];
let score = 0;
let isGameOver = false;

// Key event listeners
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') leftPressed = true;
  if (e.key === 'ArrowRight') rightPressed = true;
  if (e.key === ' ' && isGameOver) resetGame();
});
document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') leftPressed = false;
  if (e.key === 'ArrowRight') rightPressed = false;
});

// Car object
const car = {
  x: carX,
  y: carY,
  width: carWidth,
  height: carHeight,
  color: '#ff5733',
};

// Draw the car
function drawCar() {
  ctx.fillStyle = car.color;
  ctx.fillRect(car.x, car.y, car.width, car.height);
}

// Draw the road
function drawRoad() {
  ctx.fillStyle = '#999';
  ctx.fillRect(roadX, 0, roadWidth, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.fillRect(roadX + roadWidth / 2 - 5, 0, 10, canvas.height);
}

// Draw obstacles
function drawObstacles() {
  ctx.fillStyle = '#3498db';
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    obstacle.y += 4;

    // Remove obstacles that are off-screen
    if (obstacle.y > canvas.height) {
      obstacles.shift();
      score++;
    }

    // Collision detection
    if (obstacle.x < car.x + car.width &&
      obstacle.x + obstacle.width > car.x &&
      obstacle.y < car.y + car.height &&
      obstacle.y + obstacle.height > car.y) {
        gameOver();
    }
  });
}

// Create new obstacles
function createObstacles() {
  if (Math.random() < 0.01) {
    let obstacleX = Math.random() * (roadWidth - 50) + roadX;
    let obstacleWidth = 50 + Math.random() * 50;
    let obstacleHeight = 40 + Math.random() * 60;
    obstacles.push({ x: obstacleX, y: -obstacleHeight, width: obstacleWidth, height: obstacleHeight });
  }
}

// Draw the score
function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText('Score: ' + score, 20, 30);
}

// Handle game over
function gameOver() {
  isGameOver = true;
  document.getElementById('gameOverText').style.display = 'block';
}

// Reset the game
function resetGame() {
  car.x = canvas.width / 2 - carWidth / 2;
  car.y = canvas.height - carHeight - 10;
  carVelocity = 0;
  obstacles = [];
  score = 0;
  isGameOver = false;
  document.getElementById('gameOverText').style.display = 'none';
}

// Update car position based on key presses
function updateCarPosition() {
  if (leftPressed && car.x > roadX) {
    car.x -= carSpeed;
  }
  if (rightPressed && car.x + car.width < roadX + roadWidth) {
    car.x += carSpeed;
  }
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRoad();
  drawCar();
  updateCarPosition();
  createObstacles();
  drawObstacles();
  drawScore();

  if (!isGameOver) {
    requestAnimationFrame(gameLoop);
  }
}

// Start the game
gameLoop();
