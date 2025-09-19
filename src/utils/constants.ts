/**
 * Application constants and configuration
 */
import type { Config, Commands } from '../types/index.js';
import { createQRCodeHTML } from './qrcode.js';

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
    help: 'help\nabout\ncontact\nnostr\nlightning\nclear\nexit\ngame',
    about: '🗿',
    contact:
        'Email: <a href="mailto:me@badori.io" style="color: #58a6ff; text-decoration: underline;">me@badori.io</a>\nX: <a href="https://x.com/Badoriie" target="_blank" style="color: #58a6ff; text-decoration: underline;">https://x.com/Badoriie</a>\nGitHub: <a href="https://github.com/badoriio" target="_blank" style="color: #58a6ff; text-decoration: underline;">https://github.com/badoriio</a>',
    nostr: async(): Promise<string> => {
        const nostrKey = 'npub1q5vqemfc4qkscj97wael7clkqstjkj335ykjvydlcep0g888v42qqmy4un';
        const qrCode = await createQRCodeHTML(nostrKey);
        return nostrKey + qrCode;
    },
    lightning: async(): Promise<string> => {
        const lightningAddress =
            'lno1zrxq8pjw7qjlm68mtp7e3yvxee4y5xrgjhhyf2fxhlphpckrvevh50u0q27\nnxwl85kattagefxh02neyp07qw4zp7c8ckmtqgwxpks2y6h7nkqsrvjqlez8kvs\njvrdd64ycd8tn0x8vwtn9zyx95vr5jv3rq5m4cjqcqqva5f3rlrp56vcs58nmp0\nfr32c25pdrrlmckwrv6xsplrs4xq75we4ftcxjn65z8nqqj29r0hdn6v903dc7a\nq0um4kr6xxp7w7tt6mt2d79xwv74cwuwpwhmpchm6dayv0ahkrukzqqs6n92etf\namtdqqzq8zd5p9u2aru';
        const qrCode = await createQRCodeHTML(lightningAddress);
        return lightningAddress + qrCode;
    },
    clear: 'CLEAR_SCREEN',
    pwd: '', // Will be set dynamically
    exit: 'EXIT_COMMAND',
    game: 'GAME_COMMAND',
};
