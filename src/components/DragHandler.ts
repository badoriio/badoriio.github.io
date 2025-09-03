/**
 * Draggable functionality for terminal and game windows
 */
export class DragHandler {
    private element: HTMLElement;
    private dragHandle: HTMLElement;
    private isDragging: boolean = false;
    private offsetX: number = 0;
    private offsetY: number = 0;

    constructor(element: HTMLElement, dragHandle: HTMLElement) {
        this.element = element;
        this.dragHandle = dragHandle;

        this.init();
    }

    private init(): void {
        this.initializePosition();
        this.setupEventListeners();
    }

    private initializePosition(): void {
        // Convert from transform positioning to absolute positioning to prevent jumping
        const rect = this.element.getBoundingClientRect();
        this.element.style.position = 'absolute';
        this.element.style.left = rect.left + 'px';
        this.element.style.top = rect.top + 'px';
        this.element.style.transform = 'none';
    }

    private setupEventListeners(): void {
        this.dragHandle.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    }

    private handleMouseDown(e: MouseEvent): void {
        // Prevent dragging if clicking specific elements (like close buttons)
        const target = e.target as HTMLElement;
        if (target?.classList.contains('close') || target?.id === 'closeGame') {
            return;
        }

        e.preventDefault();
        this.isDragging = true;

        const rect = this.element.getBoundingClientRect();
        this.offsetX = e.clientX - rect.left;
        this.offsetY = e.clientY - rect.top;

        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
    }

    private handleMouseMove = (e: MouseEvent): void => {
        if (!this.isDragging) {return;}

        e.preventDefault();

        const x = e.clientX - this.offsetX;
        const y = e.clientY - this.offsetY;

        // Keep element within viewport bounds
        const maxX = window.innerWidth - this.element.offsetWidth;
        const maxY = window.innerHeight - this.element.offsetHeight;

        const boundedX = Math.max(0, Math.min(x, maxX));
        const boundedY = Math.max(0, Math.min(y, maxY));

        this.element.style.left = boundedX + 'px';
        this.element.style.top = boundedY + 'px';
    };

    private handleMouseUp = (): void => {
        this.isDragging = false;
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    };

    public destroy(): void {
        this.dragHandle.removeEventListener('mousedown', this.handleMouseDown);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    }
}
