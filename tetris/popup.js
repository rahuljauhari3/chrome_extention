const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const colors = [
    "#000000",
    "#7825b3",
    "#64b3b3",
    "#502216",
    "#50861a",
    "#b42216",
    "#b4227a"
];

const gameWidth = 10;
const gameHeight = 20;
const tileSize = 20;
let score = 0;

// Create a Tetris board as a 2D array
const board = Array.from({ length: gameHeight }, () => Array(gameWidth).fill(0));

// Define Tetris pieces
const figures = [
    [[1, 5, 9, 13], [4, 5, 6, 7]], 
    [[4, 5, 9, 10], [2, 6, 5, 9]], 
    [[6, 7, 9, 10], [1, 5, 6, 10]],
    // Add remaining pieces
];

let currentPiece = {
    x: 3,
    y: 0,
    shape: figures[Math.floor(Math.random() * figures.length)],
    rotation: 0,
    color: colors[Math.floor(Math.random() * colors.length)]
};

// Draw the game
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value > 0) {
                ctx.fillStyle = colors[value];
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        });
    });
}

// Draw the current Tetris piece
function drawPiece(piece) {
    piece.shape[piece.rotation].forEach(index => {
        const x = (index % 4) + piece.x;
        const y = Math.floor(index / 4) + piece.y;
        ctx.fillStyle = piece.color;
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
    });
}

// Handle piece movement and collision
function movePiece(dir) {
    currentPiece.x += dir;
    if (collides()) currentPiece.x -= dir;
    draw();
}

function rotatePiece() {
    currentPiece.rotation = (currentPiece.rotation + 1) % currentPiece.shape.length;
    if (collides()) currentPiece.rotation = (currentPiece.rotation - 1) % currentPiece.shape.length;
    draw();
}

// Function to clear completed lines
function clearLines() {
    for (let y = gameHeight - 1; y >= 0; y--) {
        if (board[y].every(value => value > 0)) {
            board.splice(y, 1);
            board.unshift(Array(gameWidth).fill(0));
            score += 10; // Increment score for each cleared line
        }
    }
}

function resetGame() {
    board.forEach(row => row.fill(0));
    score = 0;
    spawnNewPiece();
}

// Function to spawn a new Tetris piece
function spawnNewPiece() {
    currentPiece = {
        x: 3,
        y: 0,
        shape: figures[Math.floor(Math.random() * figures.length)],
        rotation: 0,
        color: colors[Math.floor(Math.random() * colors.length)]
    };
    if (collides()) {
        alert("Game Over");
        resetGame();
    }
}

// Function to place the piece on the board and start a new piece
function placePiece() {
    currentPiece.shape[currentPiece.rotation].forEach(index => {
        const x = (index % 4) + currentPiece.x;
        const y = Math.floor(index / 4) + currentPiece.y;
        board[y][x] = colors.indexOf(currentPiece.color); // Add the piece to the board
    });
    clearLines(); // Check for line completion
    spawnNewPiece(); // Create a new piece
}


// Function to drop the piece to the lowest possible position
function dropPiece() {
    while (!collides()) {
        currentPiece.y += 1;
    }
    currentPiece.y -= 1; // Step back to the last valid position
    placePiece();
}

function collides() {
    // Collision detection logic
}

// Update the draw function to include the score display
function draw() {
    drawBoard();
    drawPiece(currentPiece);
    // Display the score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") movePiece(-1);
    else if (e.key === "ArrowRight") movePiece(1);
    else if (e.key === "ArrowUp") rotatePiece();
    else if (e.key === "ArrowDown") dropPiece();
});

draw();
