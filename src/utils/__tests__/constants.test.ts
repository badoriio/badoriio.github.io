/**
 * Tests for constants and configuration
 */
import { describe, it, expect } from '@jest/globals';
import { CONFIG, COMMANDS } from '../constants';

describe('Constants', () => {
    describe('CONFIG', () => {
        it('should have correct terminal configuration', () => {
            expect(CONFIG.TERMINAL).toEqual({
                FPS_DESKTOP: 100,
                FPS_MOBILE: 150,
                GAME_SPEED: 150,
                GRID_SIZE: 20,
            });
        });

        it('should have correct breakpoint values', () => {
            expect(CONFIG.BREAKPOINTS).toEqual({
                MOBILE: 768,
                SMALL_MOBILE: 480,
            });
        });

        it('should have matrix characters defined', () => {
            expect(CONFIG.CHARS.MATRIX).toBe('01');
            expect(typeof CONFIG.CHARS.MATRIX).toBe('string');
        });

        it('should have positive numeric values', () => {
            expect(CONFIG.TERMINAL.FPS_DESKTOP).toBeGreaterThan(0);
            expect(CONFIG.TERMINAL.FPS_MOBILE).toBeGreaterThan(0);
            expect(CONFIG.TERMINAL.GAME_SPEED).toBeGreaterThan(0);
            expect(CONFIG.TERMINAL.GRID_SIZE).toBeGreaterThan(0);
            expect(CONFIG.BREAKPOINTS.MOBILE).toBeGreaterThan(0);
            expect(CONFIG.BREAKPOINTS.SMALL_MOBILE).toBeGreaterThan(0);
        });

        it('should have mobile breakpoint larger than small mobile', () => {
            expect(CONFIG.BREAKPOINTS.MOBILE).toBeGreaterThan(CONFIG.BREAKPOINTS.SMALL_MOBILE);
        });
    });

    describe('COMMANDS', () => {
        it('should have all required command keys', () => {
            const expectedKeys = ['help', 'about', 'contact', 'date', 'clear', 'pwd', 'exit', 'game'];
            expectedKeys.forEach(key => {
                expect(COMMANDS).toHaveProperty(key);
            });
        });

        it('should have help command with correct format', () => {
            const helpText = COMMANDS.help as string;
            expect(typeof helpText).toBe('string');
            expect(helpText).toContain('help');
            expect(helpText).toContain('about');
            expect(helpText).toContain('contact');
            expect(helpText).toContain('clear');
            expect(helpText).toContain('exit');
            expect(helpText).toContain('game');
        });

        it('should have about command with project description', () => {
            const aboutText = COMMANDS.about as string;
            expect(typeof aboutText).toBe('string');
            expect(aboutText).toContain('BADORIIO');
            expect(aboutText.length).toBeGreaterThan(10);
        });

        it('should have contact command with proper links', () => {
            const contactText = COMMANDS.contact as string;
            expect(typeof contactText).toBe('string');
            expect(contactText).toContain('amir@badori.io');
            expect(contactText).toContain('https://x.com/Badoriie');
            expect(contactText).toContain('https://github.com/badoriio');
            expect(contactText).toContain('<a href=');
        });

        it('should have date command as function', () => {
            expect(typeof COMMANDS.date).toBe('function');
            
            const dateResult = (COMMANDS.date as Function)();
            expect(typeof dateResult).toBe('string');
            expect(dateResult.length).toBeGreaterThan(0);
        });

        it('should have special command values', () => {
            expect(COMMANDS.clear).toBe('CLEAR_SCREEN');
            expect(COMMANDS.exit).toBe('EXIT_COMMAND');
            expect(COMMANDS.game).toBe('GAME_COMMAND');
        });

        it('should have pwd command as string', () => {
            expect(typeof COMMANDS.pwd).toBe('string');
        });

        it('date function should return valid date string', () => {
            const dateFunc = COMMANDS.date as Function;
            const result = dateFunc();
            
            // Should be a valid date string
            expect(result).toMatch(/\d{4}/); // Should contain year
            expect(result).toContain(':'); // Should contain time
        });

        it('should not have any null or undefined values except pwd', () => {
            Object.entries(COMMANDS).forEach(([key, value]) => {
                if (key === 'pwd') {
                    // pwd can be empty string initially
                    expect(typeof value).toBe('string');
                } else {
                    expect(value).not.toBeNull();
                    expect(value).not.toBeUndefined();
                }
            });
        });
    });
});