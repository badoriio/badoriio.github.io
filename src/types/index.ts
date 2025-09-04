/**
 * Type definitions for the application
 */

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  food: Position;
  dx: number;
  dy: number;
  score: number;
  gameInterval: number | null;
  gameHasFocus: boolean;
}

export interface TerminalState {
  currentInput: string;
  cursorPosition: number;
  commandHistory: string[];
  historyIndex: number;
  terminalHasFocus: boolean;
}

export interface CommandFunction {
  (): string;
}

export interface Commands {
  [key: string]: string | CommandFunction;
}

export interface Config {
  TERMINAL: {
    FPS_DESKTOP: number;
    FPS_MOBILE: number;
    GAME_SPEED: number;
    GRID_SIZE: number;
  };
  BREAKPOINTS: {
    MOBILE: number;
    SMALL_MOBILE: number;
  };
  CHARS: {
    MATRIX: string;
  };
}

export interface KeyboardEvent extends Event {
  key: string;
  code: string;
  ctrlKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  preventDefault(): void;
}

export interface MouseEvent extends Event {
  clientX: number;
  clientY: number;
  target: EventTarget | null;
  preventDefault(): void;
}
