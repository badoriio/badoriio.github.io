/**
 * Utility helper functions
 */

export function generateUserId(): string {
    // Use cryptographically secure random number generation
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return `user-${array[0] % 10000}`;
}

export function isMobile(): boolean {
    return window.innerWidth <= 768;
}

export function debounce<T extends(...args: unknown[]) => unknown>(
    func: T,
    wait: number,
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    return function executedFunction(...args: Parameters<T>): void {
        const later = (): void => {
            if (timeout) {
                clearTimeout(timeout);
            }
            func(...args);
        };
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}

export function updatePrompts(userId: string): string {
    const prompt = `${userId}@badori.io:~$`;
    document.querySelectorAll('.prompt').forEach((el: Element) => {
        if (el instanceof HTMLElement) {
            el.textContent = prompt;
        }
    });
    return prompt;
}
