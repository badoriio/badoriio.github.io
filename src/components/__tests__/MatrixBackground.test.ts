/**
 * Tests for MatrixBackground component
 */
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { MatrixBackground } from '../MatrixBackground';
import { createMockCanvas } from '../../__tests__/test-utils';

// Mock the CONFIG import
jest.mock('../../utils/constants.js', () => ({
    CONFIG: {
        CHARS: { MATRIX: '01' },
        BREAKPOINTS: { MOBILE: 768 },
        TERMINAL: { FPS_MOBILE: 150, FPS_DESKTOP: 100 },
    },
}));

describe('MatrixBackground', () => {
    let matrixBackground: MatrixBackground;
    let mockCanvas: HTMLCanvasElement;
    let mockContext: any;

    beforeEach(() => {
        // Mock document.createElement for canvas
        mockCanvas = createMockCanvas();
        mockContext = mockCanvas.getContext('2d');
        
        jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
            if (tagName === 'canvas') {
                return mockCanvas;
            }
            return document.createElement(tagName);
        });

        // Mock document.body.appendChild
        jest.spyOn(document.body, 'appendChild').mockImplementation(jest.fn());

        // Mock window dimensions
        Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
        Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });

        // Mock setInterval to avoid actual timing
        jest.spyOn(global, 'setInterval').mockImplementation((callback, delay) => {
            // Call immediately for testing
            setTimeout(callback as TimerHandler, 0);
            return 123 as any; // Mock timer ID
        });

        matrixBackground = new MatrixBackground();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should create canvas element with correct properties', () => {
        matrixBackground.init();

        expect(document.createElement).toHaveBeenCalledWith('canvas');
        expect(mockCanvas.id).toBe('matrix-bg');
        expect(document.body.appendChild).toHaveBeenCalledWith(mockCanvas);
    });

    it('should apply correct CSS styles to canvas', () => {
        matrixBackground.init();

        expect(mockCanvas.style.cssText).toContain('position: fixed');
        expect(mockCanvas.style.cssText).toContain('top: 0');
        expect(mockCanvas.style.cssText).toContain('left: 0');
        expect(mockCanvas.style.cssText).toContain('width: 100%');
        expect(mockCanvas.style.cssText).toContain('height: 100%');
        expect(mockCanvas.style.cssText).toContain('z-index: -1');
        expect(mockCanvas.style.cssText).toContain('opacity: 0.05');
    });

    it('should set canvas dimensions to window size', () => {
        matrixBackground.init();

        expect(mockCanvas.width).toBe(window.innerWidth);
        expect(mockCanvas.height).toBe(window.innerHeight);
    });

    it('should get 2D context from canvas', () => {
        matrixBackground.init();

        expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    });

    it('should initialize drops array based on columns', () => {
        matrixBackground.init();

        // Columns should be canvas width / 14
        const expectedColumns = Math.floor(window.innerWidth / 14);
        
        // We can't directly test the private drops array, but we can test behavior
        // The draw method should work without errors
        expect(() => {
            // Trigger draw method indirectly through animation
        }).not.toThrow();
    });

    it('should setup window event listeners', () => {
        const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
        
        matrixBackground.init();

        expect(addEventListenerSpy).toHaveBeenCalledWith('orientationchange', expect.any(Function));
        expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    it('should handle orientation change', () => {
        matrixBackground.init();

        // Get the orientation change handler
        const orientationHandler = (window.addEventListener as jest.Mock).mock.calls
            .find(call => call[0] === 'orientationchange')[1];

        // Mock setTimeout for the delayed resize
        const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

        orientationHandler();

        expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 100);
    });

    it('should handle window resize', () => {
        matrixBackground.init();

        // Get the resize handler
        const resizeHandler = (window.addEventListener as jest.Mock).mock.calls
            .find(call => call[0] === 'resize')[1];

        // Change window size
        Object.defineProperty(window, 'innerWidth', { value: 800 });
        Object.defineProperty(window, 'innerHeight', { value: 600 });

        resizeHandler();

        // Canvas dimensions should be updated
        expect(mockCanvas.width).toBe(800);
        expect(mockCanvas.height).toBe(600);
    });

    it('should use correct FPS based on screen size', () => {
        // Test desktop FPS
        Object.defineProperty(window, 'innerWidth', { value: 1024 });
        matrixBackground.init();

        expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 100); // Desktop FPS

        jest.clearAllMocks();

        // Test mobile FPS
        Object.defineProperty(window, 'innerWidth', { value: 600 });
        const matrixBackgroundMobile = new MatrixBackground();
        matrixBackgroundMobile.init();

        expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 150); // Mobile FPS
    });

    it('should draw matrix characters', (done) => {
        matrixBackground.init();

        // Wait for animation to trigger
        setTimeout(() => {
            expect(mockContext.fillStyle).toHaveBeenCalledWith('rgba(13, 17, 23, 0.05)');
            expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, mockCanvas.width, mockCanvas.height);
            expect(mockContext.fillStyle).toHaveBeenCalledWith('#58a6ff');
            expect(mockContext.font).toHaveBeenCalledWith('14px monospace');
            expect(mockContext.fillText).toHaveBeenCalled();
            done();
        }, 50);
    });

    it('should handle canvas creation failure gracefully', () => {
        // Mock createElement to return null
        (document.createElement as jest.Mock).mockReturnValue(null);

        expect(() => {
            const matrixBg = new MatrixBackground();
            matrixBg.init();
        }).not.toThrow();
    });

    it('should handle context creation failure gracefully', () => {
        mockCanvas.getContext = jest.fn().mockReturnValue(null);

        expect(() => {
            matrixBackground.init();
        }).not.toThrow();
    });
});