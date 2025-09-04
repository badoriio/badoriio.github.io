/**
 * Tests for utility helper functions
 */
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { generateUserId, isMobile, debounce, updatePrompts } from '../helpers';

describe('Helper Functions', () => {
    describe('generateUserId', () => {
        it('should generate a user ID with correct format', () => {
            const userId = generateUserId();
            expect(userId).toMatch(/^user-\d+$/);
        });

        it('should generate different IDs on multiple calls', () => {
            const id1 = generateUserId();
            const id2 = generateUserId();
            expect(id1).not.toBe(id2);
        });

        it('should generate numeric part within expected range', () => {
            const userId = generateUserId();
            const numericPart = parseInt(userId.split('-')[1]);
            expect(numericPart).toBeGreaterThanOrEqual(0);
            expect(numericPart).toBeLessThan(10000);
        });
    });

    describe('isMobile', () => {
        let originalInnerWidth: number;

        beforeEach(() => {
            originalInnerWidth = window.innerWidth;
        });

        afterEach(() => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: originalInnerWidth,
            });
        });

        it('should return true for mobile width (768px or less)', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 768,
            });
            expect(isMobile()).toBe(true);

            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 600,
            });
            expect(isMobile()).toBe(true);
        });

        it('should return false for desktop width (more than 768px)', () => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 1024,
            });
            expect(isMobile()).toBe(false);

            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 1920,
            });
            expect(isMobile()).toBe(false);
        });
    });

    describe('debounce', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should debounce function calls', () => {
            const mockFn = jest.fn();
            const debouncedFn = debounce(mockFn, 100);

            debouncedFn();
            debouncedFn();
            debouncedFn();

            expect(mockFn).not.toHaveBeenCalled();

            jest.advanceTimersByTime(100);
            expect(mockFn).toHaveBeenCalledTimes(1);
        });

        it('should pass arguments correctly', () => {
            const mockFn = jest.fn();
            const debouncedFn = debounce(mockFn, 100);

            debouncedFn('arg1', 'arg2', 123);
            jest.advanceTimersByTime(100);

            expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 123);
        });

        it('should reset timer on subsequent calls', () => {
            const mockFn = jest.fn();
            const debouncedFn = debounce(mockFn, 100);

            debouncedFn();
            jest.advanceTimersByTime(50);
            debouncedFn();
            jest.advanceTimersByTime(50);

            expect(mockFn).not.toHaveBeenCalled();

            jest.advanceTimersByTime(50);
            expect(mockFn).toHaveBeenCalledTimes(1);
        });

        it('should handle multiple independent debounced functions', () => {
            const mockFn1 = jest.fn();
            const mockFn2 = jest.fn();
            const debouncedFn1 = debounce(mockFn1, 100);
            const debouncedFn2 = debounce(mockFn2, 200);

            debouncedFn1();
            debouncedFn2();

            jest.advanceTimersByTime(100);
            expect(mockFn1).toHaveBeenCalledTimes(1);
            expect(mockFn2).not.toHaveBeenCalled();

            jest.advanceTimersByTime(100);
            expect(mockFn2).toHaveBeenCalledTimes(1);
        });
    });

    describe('updatePrompts', () => {
        beforeEach(() => {
            document.body.innerHTML = '';
        });

        it('should update all prompt elements with correct text', () => {
            // Create test elements
            const prompt1 = document.createElement('span');
            prompt1.className = 'prompt';
            const prompt2 = document.createElement('span');
            prompt2.className = 'prompt';
            
            document.body.appendChild(prompt1);
            document.body.appendChild(prompt2);

            const userId = 'test-user-123';
            const result = updatePrompts(userId);

            expect(result).toBe('test-user-123@badori.io:~$');
            expect(prompt1.textContent).toBe('test-user-123@badori.io:~$');
            expect(prompt2.textContent).toBe('test-user-123@badori.io:~$');
        });

        it('should handle empty prompt list gracefully', () => {
            const userId = 'test-user-123';
            const result = updatePrompts(userId);

            expect(result).toBe('test-user-123@badori.io:~$');
            // Should not throw an error
        });

        it('should only update elements with prompt class', () => {
            const promptElement = document.createElement('span');
            promptElement.className = 'prompt';
            const otherElement = document.createElement('span');
            otherElement.className = 'other';
            otherElement.textContent = 'original';

            document.body.appendChild(promptElement);
            document.body.appendChild(otherElement);

            updatePrompts('test-user');

            expect(promptElement.textContent).toBe('test-user@badori.io:~$');
            expect(otherElement.textContent).toBe('original');
        });

        it('should skip non-HTMLElement nodes', () => {
            const promptElement = document.createElement('span');
            promptElement.className = 'prompt';
            document.body.appendChild(promptElement);

            // Mock querySelectorAll to return mixed node types
            const originalQuerySelectorAll = document.querySelectorAll;
            document.querySelectorAll = jest.fn().mockReturnValue([
                promptElement,
                { nodeType: 3 }, // Text node
            ] as any);

            expect(() => updatePrompts('test-user')).not.toThrow();
            expect(promptElement.textContent).toBe('test-user@badori.io:~$');

            // Restore original method
            document.querySelectorAll = originalQuerySelectorAll;
        });
    });
});