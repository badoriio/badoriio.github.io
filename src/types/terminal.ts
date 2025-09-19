/**
 * Terminal-specific type definitions
 */

export interface Terminal {
    currentInput: string;
    cursorPosition: number;
    terminalHasFocus: boolean;
    updateDisplay(): void;
    executeCommand(): void;
    handleBackspace(): void;
    handleTabCompletion(): void;
    setTerminalFocus(hasFocus: boolean): void;
    destroy(): void;
}

export interface DragHandler {
    destroy(): void;
}

export type CommandFunction = () => string | Promise<string>;
