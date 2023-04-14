const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up')
const btnLeft = document.querySelector('#left')
const btnRight = document.querySelector('#right')
const btnDown = document.querySelector('#down')
const spanLives = document.querySelector('#lives')
const spanTime = document.querySelector('#time')
const spanRecord = document.querySelector('#record')
const pResult = document.querySelector('#result')

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;



const playerPosition = {
  x: undefined,
  y: undefined,
}

const giftPosition = {
  x: undefined,
  y: undefined,
}

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.7;
  } else {
    canvasSize = window.innerHeight * 0.7;
  }

  canvasSize = Number(canvasSize.toFixed(3))

  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);

  elementsSize = canvasSize / 10;
  playerPosition.x = undefined
  playerPosition.y = undefined
  startGame();
}

function startGame() {
  // console.log({ canvasSize, elementsSize });

  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'end';

  const map = maps[level];

  if (!map) {
    gameWin();
    return;
  }

  if(!timeStart){
    timeStart = Date.now()
    timeInterval = setInterval(showTime,100)
    showRecord()
  }
  const mapRows = map.trim().split('\n');
  const mapRowCols = mapRows.map(row => row.trim().split(''));
  // console.log({ map, mapRows, mapRowCols });

  showLives();

  game.clearRect(0, 0, canvasSize, canvasSize);

  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const bombColisionX = false;
      const bombColisionY = false;
      const emoji = emojis[col];
      const posX = elementsSize * (colI + 1) + 15
      const posY = elementsSize * (rowI + 1) - 10

      if (col == 'O') {
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX
          playerPosition.y = posY
        }
      } else if (col == 'I') {
        giftPosition.x = posX
        giftPosition.y = posY
      } else if (col == 'X') {
        if (playerPosition.x && playerPosition.y) {
          const bombColisionX = playerPosition.x.toFixed(3) == posX.toFixed(3)
          const bombColisionY = playerPosition.y.toFixed(3) == posY.toFixed(3)
          // console.log(bombColisionX, bombColisionY)
          if (bombColisionX && bombColisionY) {
            levelBomb();
          }
        }
      }

      game.fillText(emoji, posX, posY)

    })
  });

  movePlayer()
}

function movePlayer() {
  const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
  const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
  const giftCollision = giftCollisionX && giftCollisionY;

  if (giftCollision) {
    levelWin();
  }

  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelBomb() {
  lives--
  if (lives <= 0) {
    level = 0
    lives = 3
    timeStart=undefined
  }
  console.log("bombaa")
  playerPosition.x = undefined
  playerPosition.y = undefined
  startGame();
}

function levelWin() {
  console.log('Subiste de nivel');
  level++;
  startGame();
}

function gameWin() {
  console.log('¡Terminaste el juego!');
  clearInterval(timeInterval)

  const recordTime = localStorage.getItem('record_time');
  const playerTime = Date.now()-timeStart;
  if(recordTime){
    
    if(recordTime >= playerTime){
      localStorage.setItem('record_time',playerTime)
      pResult.innerHTML = 'superaste el record'
    }else{
      pResult.innerHTML = 'no superaste el record'
    }
  }else{
    localStorage.setItem('record_time',playerTime)
    pResult.innerHTML = 'primera vez'
  }
}
function showRecord(){
  spanRecord.innerHTML = localStorage.getItem('record_time')
}
function showTime(){
  spanTime.innerHTML = Date.now()- timeStart
}
function showLives(){
  const heatsArrays =  Array(lives).fill(emojis['HEART'])
  spanLives.innerHTML=""
  heatsArrays.forEach(heart => spanLives.append(heart))
}


window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {
  if (event.key == 'ArrowUp') moveUp();
  else if (event.key == 'ArrowLeft') moveLeft();
  else if (event.key == 'ArrowRight') moveRight();
  else if (event.key == 'ArrowDown') moveDown();
}
function moveUp() {
  // console.log('Me quiero mover hacia arriba');

  if ((playerPosition.y - elementsSize) < (elementsSize - 11)) {
    console.log('OUT');
  } else {
    playerPosition.y -= elementsSize;
    startGame();
  }
}
function moveLeft() {
  // console.log('Me quiero mover hacia izquierda');

  if ((playerPosition.x - elementsSize) < elementsSize) {
    console.log('OUT');
  } else {
    playerPosition.x -= elementsSize;
    startGame();
  }
}
function moveRight() {
  // console.log('Me quiero mover hacia derecha');

  if ((playerPosition.x + elementsSize) > (canvasSize + 16)) {
    console.log('OUT');
  } else {
    playerPosition.x += elementsSize;
    startGame();
  }
}
function moveDown() {
  // console.log('Me quiero mover hacia abajo');

  if ((playerPosition.y + elementsSize) > canvasSize) {
    console.log('OUT');
  } else {
    playerPosition.y += elementsSize;
    startGame();
  }
}