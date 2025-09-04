/**
 * Testing utilities and helpers
 */

// Mock DOM element factory
export function createMockElement(tag: string = 'div'): HTMLElement {
    const element = document.createElement(tag);
    
    // Add common properties
    Object.defineProperties(element, {
        offsetWidth: { value: 100, writable: true },
        offsetHeight: { value: 100, writable: true },
        offsetTop: { value: 0, writable: true },
        offsetLeft: { value: 0, writable: true },
    });

    // Mock getBoundingClientRect
    element.getBoundingClientRect = jest.fn(() => ({
        top: 0,
        left: 0,
        bottom: 100,
        right: 100,
        width: 100,
        height: 100,
        x: 0,
        y: 0,
        toJSON: jest.fn(),
    }));

    return element;
}

// Mock canvas element
export function createMockCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    
    Object.defineProperties(canvas, {
        width: { value: 400, writable: true },
        height: { value: 300, writable: true },
    });

    canvas.getContext = jest.fn().mockReturnValue({
        fillStyle: '',
        font: '',
        fillRect: jest.fn(),
        fillText: jest.fn(),
        clearRect: jest.fn(),
        measureText: jest.fn(() => ({ width: 10 })),
    });

    return canvas;
}

// Mock event factory
export function createMockEvent(type: string, properties: Record<string, any> = {}): Event {
    const event = new Event(type);
    Object.assign(event, properties);
    return event;
}

// Mock mouse event
export function createMockMouseEvent(type: string, properties: Record<string, any> = {}): MouseEvent {
    const event = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        ...properties,
    });
    return event;
}

// Mock keyboard event
export function createMockKeyboardEvent(type: string, properties: Record<string, any> = {}): KeyboardEvent {
    const event = new KeyboardEvent(type, {
        bubbles: true,
        cancelable: true,
        ...properties,
    });
    return event;
}

// Wait for next tick
export function waitForNextTick(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 0));
}

// Wait for condition
export function waitFor(
    condition: () => boolean,
    timeout: number = 1000,
    interval: number = 10,
): Promise<void> {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        
        const check = () => {
            if (condition()) {
                resolve();
            } else if (Date.now() - startTime > timeout) {
                reject(new Error('Condition not met within timeout'));
            } else {
                setTimeout(check, interval);
            }
        };
        
        check();
    });
}

// Mock local storage
export function mockLocalStorage(): void {
    const storage: Record<string, string> = {};
    
    Object.defineProperty(window, 'localStorage', {
        value: {
            getItem: jest.fn((key: string) => storage[key] || null),
            setItem: jest.fn((key: string, value: string) => {
                storage[key] = value;
            }),
            removeItem: jest.fn((key: string) => {
                delete storage[key];
            }),
            clear: jest.fn(() => {
                Object.keys(storage).forEach(key => delete storage[key]);
            }),
        },
    });
}