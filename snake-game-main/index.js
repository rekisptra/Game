const canvas = document.querySelector('#canvas');
const scoreBoard = document.querySelector('.score');
const start = document.querySelector('.start');

start.addEventListener('click', () => {
  document.body.requestFullscreen();
});

const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 500;

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const snakeParts = [];
let tailLength = 2;
let score = 0;
let speed = 6;
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;

let xVelocity = 0;
let yVelocity = 0;

let appleX = 5;
let appleY = 5;

function drawApple() {
  ctx.fillStyle = 'red';
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function drawGame() {
  clearScreen();
  changeSnakePosition();
  checkAppleCollision();
  drawApple();
  scoreBoard.innerHTML = score;
  drawSnake();
  setTimeout(drawGame, 1000 / speed);
}

function checkAppleCollision() {
  if (appleX == headX && appleY == headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
  }
}

function clearScreen() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function changeSnakePosition() {
  headX += xVelocity;
  headY += yVelocity;
  if (headX > 20) {
    headX = 0;
  }
  if (headX < 0) {
    headX = 20;
  }
  if (headY > 25) {
    headY = 0;
  }
  if (headY < 0) {
    headY = 25;
  }
}

function drawSnake() {
  ctx.fillStyle = 'green';
  console.log(snakeParts.length);
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeParts.push(new SnakePart(headX, headY));

  if (snakeParts.length > tailLength) {
    snakeParts.shift();
  }
  ctx.fillStyle = 'orange';
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

document.body.addEventListener('keydown', keyDown);

function keyDown(e) {
  //up
  if (e.keyCode == 38) {
    if (yVelocity == 1) {
      return;
    }
    yVelocity = -1;
    xVelocity = 0;
  }

  //down
  if (e.keyCode == 40) {
    if (yVelocity == -1) {
      return;
    }
    yVelocity = 1;
    xVelocity = 0;
  }
  //left
  if (e.keyCode == 37) {
    if (xVelocity == 1) {
      return;
    }
    yVelocity = 0;
    xVelocity = -1;
  }

  //right
  if (e.keyCode == 39) {
    if (xVelocity == -1) {
      return;
    }
    yVelocity = 0;
    xVelocity = 1;
  }
}
drawGame();

// detect touch

var container = document.querySelector('#canvas');

container.addEventListener('touchstart', startTouch, false);
container.addEventListener('touchmove', moveTouch, false);

// Swipe Up / Down / Left / Right
var initialX = null;
var initialY = null;

function startTouch(e) {
  initialX = e.touches[0].clientX;
  initialY = e.touches[0].clientY;
}

function moveTouch(e) {
  if (initialX === null) {
    return;
  }

  if (initialY === null) {
    return;
  }

  var currentX = e.touches[0].clientX;
  var currentY = e.touches[0].clientY;

  var diffX = initialX - currentX;
  var diffY = initialY - currentY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    // sliding horizontally
    if (diffX > 0) {
      if (xVelocity == 1) {
        return;
      }
      yVelocity = 0;
      xVelocity = -1;
    } else {
      if (xVelocity == -1) {
        return;
      }
      yVelocity = 0;
      xVelocity = 1;
    }
  } else {
    // sliding vertically
    if (diffY > 0) {
      // swiped up
      if (yVelocity == 1) {
        return;
      }
      yVelocity = -1;
      xVelocity = 0;
    } else {
      if (yVelocity == -1) {
        return;
      }
      yVelocity = 1;
      xVelocity = 0;
    }
  }

  initialX = null;
  initialY = null;

  e.preventDefault();
}
