/**
 * Jest test setup and configuration
 */
import '@testing-library/jest-dom';

// Mock DOM APIs that aren't available in Jest's JSDOM environment
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock Canvas API
HTMLCanvasElement.prototype.getContext = jest.fn().mockImplementation(contextType => {
    if (contextType === '2d') {
        return {
            fillStyle: '',
            font: '',
            fillRect: jest.fn(),
            fillText: jest.fn(),
            clearRect: jest.fn(),
            measureText: jest.fn(() => ({ width: 0 })),
            save: jest.fn(),
            restore: jest.fn(),
            translate: jest.fn(),
            rotate: jest.fn(),
            scale: jest.fn(),
        };
    }
    return null;
});

// Mock window.requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 0));
global.cancelAnimationFrame = jest.fn();

// Note: window.location mocking removed as it was causing test setup issues
// Individual tests can mock location methods if needed using jest.spyOn

// Suppress console errors for cleaner test output (optional)
const originalError = console.error;
beforeAll(() => {
    console.error = (...args: any[]) => {
        if (
            typeof args[0] === 'string' &&
            args[0].includes('Warning: ReactDOM.render is deprecated')
        ) {
            return;
        }
        originalError.call(console, ...args);
    };
});

afterAll(() => {
    console.error = originalError;
});
