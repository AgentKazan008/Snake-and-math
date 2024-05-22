const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = canvas.width;
const canvasGridSize = canvasSize / box;

let snake, food, score, direction, game;
let speed = 100;
let currentQuestion, currentAnswer;
let awaitingAnswer = false;

function initializeGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    generateFood();
    score = 0;
    direction = null;
    if (game) clearInterval(game);
    game = setInterval(drawGame, speed);
}

function setSpeed() {
    const difficulty = document.getElementById("difficulty").value;
    if (difficulty === "easy") {
        speed = 550;
    } else if (difficulty === "medium") {
        speed = 100;
    } else if (difficulty === "hard") {
        speed = 150;
    }
    initializeGame();
}

document.addEventListener("keydown", setDirection);
document.getElementById("restartButton").addEventListener("click", initializeGame);
document.getElementById("difficulty").addEventListener("change", setSpeed);
document.getElementById("submitAnswer").addEventListener("click", checkAnswer);
document.getElementById("answerInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        checkAnswer();
    }
});

function setDirection(event) {
    if (event.keyCode === 37 && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (event.keyCode === 38 && direction !== "DOWN") {
        direction = "UP";
    } else if (event.keyCode === 39 && direction !== "LEFT") {
        direction = "RIGHT";
    } else if (event.keyCode === 40 && direction !== "UP") {
        direction = "DOWN";
    }
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * canvasGridSize) * box,
        y: Math.floor(Math.random() * canvasGridSize) * box
    };

    // Ensure food does not appear on the snake
    for (let i = 0; i < snake.length; i++) {
        if (food.x === snake[i].x && food.y === snake[i].y) {
            generateFood();
        }
    }

    generateMathQuestion();
}

function generateMathQuestion() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    currentAnswer = num1 + num2;
    currentQuestion = `${num1} + ${num2}`;
    document.getElementById("questionText").textContent = currentQuestion;
    document.getElementById("answerInput").focus();
}

function checkAnswer() {
    const userAnswer = parseInt(document.getElementById("answerInput").value, 10);
    if (userAnswer === currentAnswer) {
        score++;
        awaitingAnswer = false;
        document.getElementById("answerInput").value = '';
        generateFood();
    } else {
        alert("Wrong answer! Try again.");
    }
}

function drawGame() {
    if (awaitingAnswer) return;

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "#333" : "#666";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "#fff";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw the food as a circle
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, 2 * Math.PI);
    ctx.fill();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        awaitingAnswer = true;
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvasSize || snakeY >= canvasSize || collision(newHead, snake)) {
        clearInterval(game);
    }

    snake.unshift(newHead);

    ctx.fillStyle = "#000";
    ctx.font = "45px Changa one";
    ctx.fillText(score, 2 * box, 1.6 * box);
}

initializeGame();
