/**
 * Tests for DragHandler component
 */
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { DragHandler } from '../DragHandler';
import {
    createMockElement,
    createMockMouseEvent,
    waitForNextTick,
} from '../../__tests__/test-utils';

describe('DragHandler', () => {
    let element: HTMLElement;
    let dragHandle: HTMLElement;
    let dragHandler: DragHandler;

    beforeEach(() => {
        element = createMockElement('div');
        dragHandle = createMockElement('div');

        // Mock initial positioning
        element.getBoundingClientRect = jest.fn(() => ({
            left: 100,
            top: 50,
            right: 200,
            bottom: 150,
            width: 100,
            height: 100,
            x: 100,
            y: 50,
            toJSON: jest.fn(),
        }));

        // Mock viewport size
        Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
        Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });
    });

    afterEach(() => {
        if (dragHandler) {
            dragHandler.destroy();
        }
        document.removeEventListener = jest.fn();
    });

    it('should initialize position correctly', () => {
        dragHandler = new DragHandler(element, dragHandle);

        expect(element.style.position).toBe('absolute');
        expect(element.style.left).toBe('100px');
        expect(element.style.top).toBe('50px');
        expect(element.style.transform).toBe('none');
    });

    it('should setup mouse event listeners', () => {
        const addEventListenerSpy = jest.spyOn(dragHandle, 'addEventListener');
        dragHandler = new DragHandler(element, dragHandle);

        expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    });

    it('should handle mouse down event', () => {
        dragHandler = new DragHandler(element, dragHandle);
        const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

        const mouseEvent = createMockMouseEvent('mousedown', {
            clientX: 150,
            clientY: 100,
        });

        dragHandle.dispatchEvent(mouseEvent);

        expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
        expect(addEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    });

    it('should not start dragging when clicking close button', () => {
        const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
        dragHandler = new DragHandler(element, dragHandle);

        const closeButton = createMockElement('div');
        closeButton.id = 'closeGame';

        const mouseEvent = createMockMouseEvent('mousedown', {
            clientX: 150,
            clientY: 100,
        });

        // Manually set the target since MouseEvent constructor doesn't accept target
        Object.defineProperty(mouseEvent, 'target', {
            value: closeButton,
            writable: false,
        });

        // Clear any calls from initialization
        addEventListenerSpy.mockClear();

        dragHandle.dispatchEvent(mouseEvent);

        expect(addEventListenerSpy).not.toHaveBeenCalledWith('mousemove', expect.any(Function));
    });

    it('should update element position on mouse move', async() => {
        dragHandler = new DragHandler(element, dragHandle);

        // Start dragging
        const mouseDownEvent = createMockMouseEvent('mousedown', {
            clientX: 150,
            clientY: 100,
        });
        dragHandle.dispatchEvent(mouseDownEvent);

        // Simulate mouse move
        const mouseMoveEvent = createMockMouseEvent('mousemove', {
            clientX: 200,
            clientY: 150,
        });

        // Trigger the mouse move handler
        document.dispatchEvent(mouseMoveEvent);

        await waitForNextTick();

        // Position should be updated (clientX - offsetX, clientY - offsetY)
        expect(element.style.left).toBe('150px'); // 200 - 50 (offsetX)
        expect(element.style.top).toBe('100px'); // 150 - 50 (offsetY)
    });

    it('should constrain element within viewport bounds', async() => {
        dragHandler = new DragHandler(element, dragHandle);

        // Mock element dimensions
        Object.defineProperty(element, 'offsetWidth', { value: 100 });
        Object.defineProperty(element, 'offsetHeight', { value: 100 });

        // Start dragging
        const mouseDownEvent = createMockMouseEvent('mousedown', {
            clientX: 150,
            clientY: 100,
        });
        dragHandle.dispatchEvent(mouseDownEvent);

        // Try to move beyond viewport bounds
        const mouseMoveEvent = createMockMouseEvent('mousemove', {
            clientX: 2000, // Way beyond viewport
            clientY: 1000,
        });

        document.dispatchEvent(mouseMoveEvent);
        await waitForNextTick();

        // Should be constrained to viewport bounds
        const maxX = window.innerWidth - element.offsetWidth; // 1024 - 100 = 924
        const maxY = window.innerHeight - element.offsetHeight; // 768 - 100 = 668

        expect(parseInt(element.style.left)).toBeLessThanOrEqual(maxX);
        expect(parseInt(element.style.top)).toBeLessThanOrEqual(maxY);
    });

    it('should prevent negative positions', async() => {
        dragHandler = new DragHandler(element, dragHandle);

        // Start dragging
        const mouseDownEvent = createMockMouseEvent('mousedown', {
            clientX: 150,
            clientY: 100,
        });
        dragHandle.dispatchEvent(mouseDownEvent);

        // Try to move to negative position
        const mouseMoveEvent = createMockMouseEvent('mousemove', {
            clientX: -100,
            clientY: -100,
        });

        document.dispatchEvent(mouseMoveEvent);
        await waitForNextTick();

        // Should be constrained to minimum 0
        expect(parseInt(element.style.left)).toBeGreaterThanOrEqual(0);
        expect(parseInt(element.style.top)).toBeGreaterThanOrEqual(0);
    });

    it('should stop dragging on mouse up', async() => {
        dragHandler = new DragHandler(element, dragHandle);
        const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

        // Start dragging
        const mouseDownEvent = createMockMouseEvent('mousedown', {
            clientX: 150,
            clientY: 100,
        });
        dragHandle.dispatchEvent(mouseDownEvent);

        // Stop dragging
        const mouseUpEvent = createMockMouseEvent('mouseup');
        document.dispatchEvent(mouseUpEvent);

        expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
        expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    });

    it('should clean up event listeners on destroy', () => {
        dragHandler = new DragHandler(element, dragHandle);
        const removeEventListenerSpy = jest.spyOn(dragHandle, 'removeEventListener');
        const documentRemoveEventListenerSpy = jest.spyOn(document, 'removeEventListener');

        dragHandler.destroy();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
        expect(documentRemoveEventListenerSpy).toHaveBeenCalledWith(
            'mousemove',
            expect.any(Function),
        );
        expect(documentRemoveEventListenerSpy).toHaveBeenCalledWith(
            'mouseup',
            expect.any(Function),
        );
    });

    it('should handle multiple drag operations correctly', () => {
        dragHandler = new DragHandler(element, dragHandle);

        // First drag operation
        let mouseDownEvent = createMockMouseEvent('mousedown', {
            clientX: 150,
            clientY: 100,
        });
        dragHandle.dispatchEvent(mouseDownEvent);

        const mouseUpEvent = createMockMouseEvent('mouseup');
        document.dispatchEvent(mouseUpEvent);

        // Second drag operation
        mouseDownEvent = createMockMouseEvent('mousedown', {
            clientX: 200,
            clientY: 150,
        });
        dragHandle.dispatchEvent(mouseDownEvent);

        // Should work without issues
        expect(() => {
            const mouseMoveEvent = createMockMouseEvent('mousemove', {
                clientX: 250,
                clientY: 200,
            });
            document.dispatchEvent(mouseMoveEvent);
        }).not.toThrow();
    });
});
