/**
 * Matrix rain background effect component
 */
import { CONFIG } from '../utils/constants.js';

export class MatrixBackground {
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private drops: number[] = [];
    private columns: number = 0;

    init() {
        this.createCanvas();
        this.setupCanvas();
        this.startAnimation();
        this.setupEventListeners();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'matrix-bg';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.05;
        `;
        document.body.appendChild(this.canvas);
    }

    setupCanvas() {
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        this.initializeDrops();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = this.canvas.width / 14;
        this.initializeDrops();
    }

    initializeDrops() {
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = 1;
        }
    }

    draw() {
        this.ctx.fillStyle = 'rgba(13, 17, 23, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#58a6ff';
        this.ctx.font = '14px monospace';

        for (let i = 0; i < this.drops.length; i++) {
            const text = CONFIG.CHARS.MATRIX[Math.floor(Math.random() * CONFIG.CHARS.MATRIX.length)];
            this.ctx.fillText(text, i * 14, this.drops[i] * 14);

            if (this.drops[i] * 14 > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
    }

    startAnimation() {
        const fps = window.innerWidth <= CONFIG.BREAKPOINTS.MOBILE ? CONFIG.TERMINAL.FPS_MOBILE : CONFIG.TERMINAL.FPS_DESKTOP;
        setInterval(() => this.draw(), fps);
    }

    setupEventListeners() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.resizeCanvas();
            }, 100);
        });

        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }
}
