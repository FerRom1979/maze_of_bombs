const canvas = document.getElementById("game");
const game = canvas.getContext("2d");
const btnUp = document.getElementById("up");
const btnLeft = document.getElementById("left");
const btnRight = document.getElementById("right");
const btnDown = document.getElementById("down");
const spanLives = document.getElementById("lives");
const spanTime = document.getElementById("time");
const spanRecord = document.getElementById("record");
const pResult = document.getElementById("result");

let canvasSize;
let elementSize;
let level = 0;
let lives = 3;
let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
  x: undefined,
  y: undefined,
};
const giftPosition = {
  x: undefined,
  y: undefined,
};
const enemyPosition = [];
const starPosition = {
  x: undefined,
  y: undefined,
};

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function setCanvasSize() {
  canvasSize = Math.min(window.innerHeight, window.innerWidth) * 0.8;

  canvasSize = Number(canvasSize.toFixed(0));

  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);

  elementSize = canvasSize / 10;
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function startGame() {
  game.font = elementSize + "px Verdana";
  game.textAlign = "end";

  const map = maps[level];

  if (!map) {
    gameWin();
    return;
  }

  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(() => showTime(), 100);
    showRecord();
  }

  const mapRows = map.trim().split("\n");
  const mapRowCol = mapRows.map((row) => row.trim().split(""));
  showLives();
  showTime();
  enemyPosition.splice(0, enemyPosition.length);

  game.clearRect(0, 0, canvasSize, canvasSize);

  mapRowCol.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const posX = elementSize * (colI + 1);
      const posY = elementSize * (rowI + 1);

      if (col === "O") {
        starPosition.x = posX;
        starPosition.y = posY;
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
        }
      } else if (col === "I") {
        giftPosition.x = posX;
        giftPosition.y = posY;
      } else if (col === "X") {
        enemyPosition.push({ x: posX, y: posY });
      }

      game.fillText(emoji, posX, posY);
    });
  });
  showLives();
  movePlayer();
}

function movePlayer() {
  const giftCollisionX =
    playerPosition.x.toFixed(2) == giftPosition.x.toFixed(2);
  const giftCollisionY =
    playerPosition.y.toFixed(2) == giftPosition.y.toFixed(2);
  const giftCollision = giftCollisionX && giftCollisionY;

  if (giftCollision) {
    levelWin();
  }

  const enemyCollision = enemyPosition.find((enemy) => {
    const enemyCollisionX = enemy.x.toFixed(2) === playerPosition.x.toFixed(2);
    const enemyCollisionY = enemy.y.toFixed(2) === playerPosition.y.toFixed(2);
    return enemyCollisionX && enemyCollisionY;
  });
  if (enemyCollision) {
    levelFailed();
  }

  game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
}

function levelWin() {
  level++;
  startGame();
}

function levelFailed() {
  lives--;
  showLives();
  if (lives <= 0) {
    level = 0;
    lives = 3;
    timeStart = undefined;
  }
  playerPosition.x = starPosition.x;
  playerPosition.y = starPosition.y;
  startGame();
}

function showLives() {
  spanLives.innerHTML = emojis["HEART"].repeat(lives);
}

function showTime() {
  spanTime.innerText = Date.now() - timeStart;
}

function gameWin() {
  clearInterval(timeInterval);

  const recordTime = localStorage.getItem("record_time");
  const playerTime = Date.now() - timeStart;
  if (recordTime) {
    if (recordTime >= playerTime) {
      localStorage.setItem("record_time", playerTime);
      pResult.innerHTML = "Congratulations you have broken the record 🥳!!!";
    } else {
      pResult.innerHTML = "Sorry record not exceeded 😭!!!!";
    }
  } else {
    localStorage.setItem("record_time", playerTime);
  }
}

function showRecord() {
  spanRecord.innerHTML = localStorage.getItem("record_time");
}

btnUp.addEventListener("click", moveUp);
btnLeft.addEventListener("click", moveLeft);
btnRight.addEventListener("click", moveRight);
btnDown.addEventListener("click", moveDown);

window.addEventListener("keydown", moveByKeys);

function moveUp() {
  if (playerPosition.y - elementSize < 0.9) {
    console.log("OUT");
  } else {
    playerPosition.y -= elementSize;
    startGame();
  }
}
function moveLeft() {
  if (playerPosition.x - elementSize < 1) {
    console.log("OUT");
  } else {
    playerPosition.x -= elementSize;
    startGame();
  }
}
function moveRight() {
  if (playerPosition.x + elementSize > canvasSize + 1) {
    console.log("OUT");
  } else {
    playerPosition.x += elementSize;
    startGame();
  }
}
function moveDown() {
  if (playerPosition.y + elementSize > canvasSize + 1) {
    console.log("OUT");
  } else {
    playerPosition.y += elementSize;
    startGame();
  }
}
function moveByKeys(e) {
  const key = e.code;
  const KEY_MOVES = {
    ArrowUp: moveUp,
    ArrowLeft: moveLeft,
    ArrowRight: moveRight,
    ArrowDown: moveDown,
  };
  return KEY_MOVES[key]();
}
