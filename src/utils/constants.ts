/**
 * Application constants and configuration
 */
import type { Config, Commands } from '../types/index.js';

export const CONFIG: Config = {
    TERMINAL: {
        FPS_DESKTOP: 100,
        FPS_MOBILE: 150,
        GAME_SPEED: 150,
        GRID_SIZE: 20,
    },
    BREAKPOINTS: {
        MOBILE: 768,
        SMALL_MOBILE: 480,
    },
    CHARS: {
        MATRIX: '01',
    },
};

export const COMMANDS: Commands = {
    'help': 'help\nabout\ncontact\nclear\ndate\nexit\ngame',
    'about': 'BADORIIO - Digital forge where ideas become reality',
    'contact': 'Email: <a href="mailto:amir@badori.io" style="color: #58a6ff; text-decoration: underline;">amir@badori.io</a>\nX: <a href="https://x.com/Badoriie" target="_blank" style="color: #58a6ff; text-decoration: underline;">https://x.com/Badoriie</a>\nGitHub: <a href="https://github.com/badoriio" target="_blank" style="color: #58a6ff; text-decoration: underline;">https://github.com/badoriio</a>',
    'date': (): string => new Date().toString(),
    'clear': 'CLEAR_SCREEN',
    'pwd': '', // Will be set dynamically
    'exit': 'EXIT_COMMAND',
    'game': 'GAME_COMMAND',
};
