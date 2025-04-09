// 게임 설정
const GRID_SIZE = 20; // 그리드 크기
const GAME_SPEED = {
    easy: 150,
    medium: 100,
    hard: 50
};

// 게임 상태
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameInterval;
let isPaused = false;
let isGameOver = false;

// DOM 요소
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-btn');
const pauseButton = document.getElementById('pause-btn');
const difficultySelect = document.getElementById('difficulty');

// 캔버스 크기 설정
canvas.width = 400;
canvas.height = 400;

// 게임 초기화
function initGame() {
    // 지렁이 초기 위치 설정
    snake = [
        { x: 6, y: 10 },
        { x: 5, y: 10 },
        { x: 4, y: 10 }
    ];
    
    // 방향 초기화
    direction = 'right';
    nextDirection = 'right';
    
    // 점수 초기화
    score = 0;
    scoreElement.textContent = score;
    
    // 게임 상태 초기화
    isGameOver = false;
    isPaused = false;
    
    // 먹이 생성
    generateFood();
    
    // 게임 시작
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, GAME_SPEED[difficultySelect.value]);
}

// 먹이 생성
function generateFood() {
    const maxX = canvas.width / GRID_SIZE - 1;
    const maxY = canvas.height / GRID_SIZE - 1;
    
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * maxX),
            y: Math.floor(Math.random() * maxY)
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    food = newFood;
}

// 게임 루프
function gameLoop() {
    if (isPaused || isGameOver) return;
    
    // 방향 업데이트
    direction = nextDirection;
    
    // 지렁이 이동
    const head = { ...snake[0] };
    
    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // 충돌 검사
    if (isCollision(head)) {
        gameOver();
        return;
    }
    
    // 지렁이 이동
    snake.unshift(head);
    
    // 먹이 먹기
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
    
    // 화면 그리기
    draw();
}

// 충돌 검사
function isCollision(head) {
    // 벽 충돌
    if (head.x < 0 || head.x >= canvas.width / GRID_SIZE ||
        head.y < 0 || head.y >= canvas.height / GRID_SIZE) {
        return true;
    }
    
    // 자기 몸 충돌
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

// 게임 오버
function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    alert(`게임 오버! 점수: ${score}`);
}

// 화면 그리기
function draw() {
    // 배경 지우기
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 지렁이 그리기
    ctx.fillStyle = '#4CAF50';
    snake.forEach(segment => {
        ctx.fillRect(
            segment.x * GRID_SIZE,
            segment.y * GRID_SIZE,
            GRID_SIZE - 1,
            GRID_SIZE - 1
        );
    });
    
    // 먹이 그리기
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(
        food.x * GRID_SIZE,
        food.y * GRID_SIZE,
        GRID_SIZE - 1,
        GRID_SIZE - 1
    );
}

// 키보드 이벤트 처리
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (direction !== 'left') nextDirection = 'right';
            break;
    }
});

// 버튼 이벤트 처리
startButton.addEventListener('click', initGame);

pauseButton.addEventListener('click', () => {
    if (isGameOver) return;
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? '계속하기' : '일시정지';
});

difficultySelect.addEventListener('change', () => {
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, GAME_SPEED[difficultySelect.value]);
    }
}); 