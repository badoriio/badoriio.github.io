/**
 * Snake Game component
 */
import { CONFIG } from '../utils/constants.js';
import { DragHandler } from './DragHandler.js';

export class SnakeGame {
    constructor() {
        this.gameContainer = null;
        this.canvas = null;
        this.ctx = null;
        this.scoreElement = null;
        this.dragHandler = null;

        // Game state
        this.snake = [{ x: 10, y: 10 }];
        this.food = { x: 15, y: 15 };
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameInterval = null;
        this.gameHasFocus = false;

        // Game config
        this.gridSize = CONFIG.TERMINAL.GRID_SIZE;
        this.tileCount = 0;
    }

    create() {
        this.createGameContainer();
        this.setupCanvas();
        this.setupDragging();
        this.setupEventListeners();
        this.setupFocusHandling();
        this.initializeGame();
        this.startGame();

        return this.gameContainer;
    }

    createGameContainer() {
        this.gameContainer = document.createElement('div');
        this.gameContainer.id = 'gameContainer';
        this.gameContainer.style.cssText = `
            background: #0d1117;
            border: 2px solid #30363d;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            color: #c9d1d9;
            font-family: 'Courier New', monospace;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
            pointer-events: auto;
        `;

        this.gameContainer.innerHTML = this.getGameHTML();
        document.body.appendChild(this.gameContainer);
    }

    getGameHTML() {
        return `
            <div id="gameHeader" style="
                background: #21262d;
                padding: 10px 15px;
                border-bottom: 1px solid #30363d;
                display: flex;
                align-items: center;
                cursor: move;
                user-select: none;
                margin: -20px -20px 15px -20px;
            ">
                <div style="display: flex; gap: 8px; margin-right: 15px;">
                    <div id="closeGame" style="
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: #ff5f57;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 8px;
                        color: #000;
                        font-weight: bold;
                    "></div>
                    <div style="
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: #ffbd2e;
                        cursor: pointer;
                    "></div>
                    <div style="
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: #28ca42;
                        cursor: pointer;
                    "></div>
                </div>
                <div style="color: #c9d1d9; font-size: 14px; font-weight: normal;">🐍 Snake Game</div>
            </div>
            <div style="font-size: 18px; margin: 10px 0; color: #58a6ff;">
                Score: <span id="gameScore">0</span>
            </div>
            <canvas id="gameCanvas" width="400" height="300" style="
                border: 2px solid #30363d;
                background: #161b22;
                display: block;
                margin: 0 auto;
            "></canvas>
            <div style="margin-top: 10px; font-size: 14px; color: #7c3aed;">
                Click game area to focus, then use WASD or Arrow Keys to move<br>
                Press SPACE to restart • ESC to close
            </div>
        `;
    }

    setupCanvas() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('gameScore');
        this.tileCount = this.canvas.width / this.gridSize;
    }

    setupDragging() {
        const gameHeader = document.getElementById('gameHeader');
        this.dragHandler = new DragHandler(this.gameContainer, gameHeader);
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.getElementById('closeGame').addEventListener('click', () => this.close());
    }

    setupFocusHandling() {
        this.gameContainer.setAttribute('tabindex', '0');
        this.gameContainer.style.outline = 'none';

        this.gameContainer.addEventListener('focus', () => {
            this.gameHasFocus = true;
            this.gameContainer.style.boxShadow = '0 0 10px #58a6ff';

            const terminal = document.querySelector('.terminal');
            if (terminal) {
                terminal.style.boxShadow = 'none';
            }

            // Update terminal focus state
            window.dispatchEvent(new CustomEvent('gameGotFocus'));
        });

        this.gameContainer.addEventListener('blur', () => {
            this.gameHasFocus = false;
            this.gameContainer.style.boxShadow = 'none';
        });
    }

    handleKeyDown(e) {
        if (!this.gameHasFocus && e.code !== 'Escape') {return;}

        switch (e.code) {
            case 'ArrowUp':
            case 'KeyW':
                if (this.gameHasFocus && this.dy === 0) {
                    this.dx = 0; this.dy = -1;
                    e.preventDefault();
                }
                break;
            case 'ArrowDown':
            case 'KeyS':
                if (this.gameHasFocus && this.dy === 0) {
                    this.dx = 0; this.dy = 1;
                    e.preventDefault();
                }
                break;
            case 'ArrowLeft':
            case 'KeyA':
                if (this.gameHasFocus && this.dx === 0) {
                    this.dx = -1; this.dy = 0;
                    e.preventDefault();
                }
                break;
            case 'ArrowRight':
            case 'KeyD':
                if (this.gameHasFocus && this.dx === 0) {
                    this.dx = 1; this.dy = 0;
                    e.preventDefault();
                }
                break;
            case 'Space':
                if (this.gameHasFocus) {
                    e.preventDefault();
                    this.resetGame();
                }
                break;
            case 'Escape':
                this.close();
                e.preventDefault();
                break;
        }
    }

    initializeGame() {
        this.generateFood();
        this.drawGame();
    }

    startGame() {
        this.gameInterval = setInterval(() => this.gameLoop(), CONFIG.TERMINAL.GAME_SPEED);
    }

    gameLoop() {
        this.moveSnake();
        this.drawGame();
    }

    drawGame() {
        // Clear canvas
        this.ctx.fillStyle = '#161b22';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.ctx.fillStyle = '#58a6ff';
        for (const segment of this.snake) {
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 2,
                this.gridSize - 2,
            );
        }

        // Draw food
        this.ctx.fillStyle = '#f85149';
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 2,
            this.gridSize - 2,
        );
    }

    moveSnake() {
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };

        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.resetGame();
            return;
        }

        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.resetGame();
            return;
        }

        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score++;
            this.scoreElement.textContent = this.score;
            this.generateFood();
        } else {
            this.snake.pop();
        }
    }

    generateFood() {
        do {
            this.food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount),
            };
        } while (this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y));
    }

    resetGame() {
        this.snake = [{ x: 10, y: 10 }];
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.scoreElement.textContent = this.score;
        this.generateFood();
    }

    close() {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
        }

        if (this.dragHandler) {
            this.dragHandler.destroy();
        }

        document.removeEventListener('keydown', this.handleKeyDown);

        if (this.gameContainer && this.gameContainer.parentNode) {
            document.body.removeChild(this.gameContainer);
        }
    }
}
