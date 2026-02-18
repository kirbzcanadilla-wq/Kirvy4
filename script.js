const game = document.getElementById('game');
const width = 10;
const height = 20;
let score = 0;
const scoreDisplay = document.getElementById('score');

// Create grid
let cells = [];
for(let i=0;i<width*height;i++){
    const div = document.createElement('div');
    div.classList.add('cell');
    game.appendChild(div);
    cells.push(div);
}

// Tetromino shapes
const tetrominoes = [
  [1, width+1, width*2+1, 2], // L
  [0, 1, width, width+1],     // O
  [1, width, width+1, width+2], // T
  [0, width, width*2, width*2+1], // J
  [1, width+1, width*2+1, width*2] // Z
];

let currentPosition = 4;
let currentRotation = 0;

let random = Math.floor(Math.random()*tetrominoes.length);
let current = tetrominoes[random];

// Draw Tetromino
function draw() {
    current.forEach(index => cells[currentPosition+index].classList.add('block'));
}
function undraw() {
    current.forEach(index => cells[currentPosition+index].classList.remove('block'));
}

// Move down
function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
}

// Freeze when hits bottom or another block
function freeze() {
    if(current.some(index => cells[currentPosition+index+width]?.classList.contains('block'))){
        current.forEach(index => cells[currentPosition+index].classList.add('block'));
        // Start new tetromino
        random = Math.floor(Math.random()*tetrominoes.length);
        current = tetrominoes[random];
        currentPosition = 4;
        draw();
        addScore();
        gameOver();
    }
}

// Control
function control(e){
    if(e.key==='ArrowLeft'){ moveLeft(); }
    else if(e.key==='ArrowRight'){ moveRight(); }
    else if(e.key==='ArrowDown'){ moveDown(); }
}
document.addEventListener('keydown', control);

function moveLeft(){
    undraw();
    const isAtLeft = current.some(index => (currentPosition+index)%width===0);
    if(!isAtLeft) currentPosition -=1;
    if(current.some(index => cells[currentPosition+index].classList.contains('block'))) currentPosition +=1;
    draw();
}

function moveRight(){
    undraw();
    const isAtRight = current.some(index => (currentPosition+index)%width===width-1);
    if(!isAtRight) currentPosition +=1;
    if(current.some(index => cells[currentPosition+index].classList.contains('block'))) currentPosition -=1;
    draw();
}

// Score
function addScore(){
    for(let i=0;i<height;i++){
        const row = [];
        for(let j=0;j<width;j++){
            row.push(i*width+j);
        }
        if(row.every(index => cells[index].classList.contains('block'))){
            row.forEach(index => {
                cells[index].classList.remove('block');
            });
            const removed = cells.splice(i*width, width);
            cells = removed.concat(cells);
            cells.forEach(cell => game.appendChild(cell));
            score +=10;
            scoreDisplay.textContent = score;
        }
    }
}

// Game Over
function gameOver(){
    if(current.some(index => cells[currentPosition+index].classList.contains('block'))){
        alert("Game Over! Score: "+score);
        clearInterval(timerId);
    }
}

// Start game
draw();
let timerId = setInterval(moveDown, 1000);
