/**
 * Terminal component with interactive functionality
 */
import { COMMANDS } from '../utils/constants.js';
import { DragHandler } from './DragHandler.js';

export class Terminal {
    prompt: string;
    currentInput: string;
    cursorPosition: number;
    commandHistory: string[];
    historyIndex: number;
    terminalHasFocus: boolean;
    dragHandler: any;
    commands: any;
    userInput: HTMLElement | null = null;
    terminalContent: HTMLElement | null = null;
    interactiveLine: HTMLElement | null = null;
    terminal: HTMLElement | null = null;

    constructor(prompt: string) {
        this.prompt = prompt;
        this.currentInput = '';
        this.cursorPosition = 0;
        this.commandHistory = [];
        this.historyIndex = -1;
        this.terminalHasFocus = true;
        this.dragHandler = null;

        this.commands = { ...COMMANDS };
        this.commands.pwd = `/home/${prompt.split('@')[0]}`;
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.setupDragging();
        this.setupFocusManagement();
        this.removeCSSTransitions();
    }

    setupElements() {
        this.userInput = document.getElementById('userInput');
        this.terminalContent = document.querySelector('.terminal-content');
        this.interactiveLine = document.querySelector('.interactive-line');
        this.terminal = document.querySelector('.terminal');
    }

    setupDragging() {
        const header = document.querySelector('.terminal-header');
        if (this.terminal && header) {
            this.dragHandler = new DragHandler(this.terminal, header as HTMLElement);
        }
    }

    removeCSSTransitions() {
        if (this.terminal) {
            this.terminal.style.transition = 'none';
        }
    }

    setupEventListeners() {
        document.addEventListener('keydown', e => this.handleKeyDown(e));
    }

    setupFocusManagement() {
        document.addEventListener(
            'click',
            e => {
                if (e.target && (e.target as Element).closest('.terminal')) {
                    this.setFocus('terminal');
                    return;
                }

                const gameContainer = document.getElementById('gameContainer');
                if (gameContainer && e.target && (e.target as Element).closest('#gameContainer')) {
                    if (e.target && !(e.target as Element).closest('#closeGame')) {
                        this.setFocus('game');
                    }
                }
            },
            true,
        );

        document.body.focus();
        document.body.setAttribute('tabindex', '0');

        document.addEventListener('keydown', e => {
            if (e.key === 'Tab') {
                e.preventDefault();
            }
        });
    }

    setTerminalFocus(hasFocus: boolean) {
        this.terminalHasFocus = hasFocus;
    }

    setFocus(target: string) {
        const gameContainer = document.getElementById('gameContainer');

        if (target === 'terminal') {
            this.terminalHasFocus = true;
            document.body.focus();
            if (this.terminal) {
                this.terminal.style.boxShadow = '0 0 10px #58a6ff';
            }
            if (gameContainer) {
                gameContainer.blur();
                gameContainer.style.boxShadow = 'none';
            }
        } else if (target === 'game' && gameContainer) {
            this.terminalHasFocus = false;
            gameContainer.focus();
            gameContainer.style.boxShadow = '0 0 10px #58a6ff';
            if (this.terminal) {
                this.terminal.style.boxShadow = 'none';
            }
        }
    }

    handleKeyDown(e: KeyboardEvent) {
        if (!this.terminalHasFocus) {
            return;
        }

        switch (e.key) {
            case 'Enter':
                this.executeCommand();
                break;
            case 'ArrowUp':
                this.navigateHistory(-1);
                e.preventDefault();
                break;
            case 'ArrowDown':
                this.navigateHistory(1);
                e.preventDefault();
                break;
            case 'Backspace':
                this.handleBackspace();
                break;
            case 'Delete':
                this.handleDelete();
                break;
            case 'ArrowLeft':
                this.moveCursor(-1);
                e.preventDefault();
                break;
            case 'ArrowRight':
                this.moveCursor(1);
                e.preventDefault();
                break;
            case 'Home':
                this.cursorPosition = 0;
                this.updateDisplay();
                e.preventDefault();
                break;
            case 'End':
                this.cursorPosition = this.currentInput.length;
                this.updateDisplay();
                e.preventDefault();
                break;
            case 'Tab':
                this.handleTabCompletion();
                e.preventDefault();
                break;
            default:
                if (e.ctrlKey) {
                    this.handleControlKey(e);
                } else if (e.key.length === 1 && !e.altKey && !e.metaKey) {
                    this.insertCharacter(e.key);
                }
                break;
        }
    }

    executeCommand() {
        const command = this.currentInput.trim();
        if (command && command !== this.commandHistory[this.commandHistory.length - 1]) {
            this.commandHistory.push(command);
        }

        this.addCommandLine(command);
        this.processCommand(command);

        this.resetInput();
        this.scrollToBottom();
    }

    addCommandLine(command: string) {
        const newCommandLine = document.createElement('div');
        newCommandLine.className = 'command-line';
        newCommandLine.innerHTML = `
            <span class="prompt">${this.prompt}</span>
            <span class="command">${command}</span>
        `;
        if (this.terminalContent && this.interactiveLine) {
            this.terminalContent.insertBefore(newCommandLine, this.interactiveLine);
        }
    }

    processCommand(command: string) {
        if (command === '') {
            return;
        }

        if (this.commands[command]) {
            this.handleBuiltInCommand(command);
        } else {
            this.showCommandNotFound(command);
        }
    }

    handleBuiltInCommand(command: string) {
        if (command === 'clear') {
            this.clearScreen();
            return;
        }

        if (command === 'exit') {
            window.close();
            return;
        }

        if (command === 'game') {
            // Game creation will be handled by GameManager
            window.dispatchEvent(new CustomEvent('createGame'));
            return;
        }

        const output = document.createElement('div');
        output.className = 'output success';
        const response =
            typeof this.commands[command] === 'function'
                ? this.commands[command]()
                : this.commands[command];
        output.innerHTML = response.replace(/\n/g, '<br>');
        if (this.terminalContent && this.interactiveLine) {
            this.terminalContent.insertBefore(output, this.interactiveLine);
        }
    }

    showCommandNotFound(command: string) {
        const output = document.createElement('div');
        output.className = 'output';
        output.style.color = '#f85149';
        output.textContent = `bash: ${command}: command not found`;
        if (this.terminalContent && this.interactiveLine) {
            this.terminalContent.insertBefore(output, this.interactiveLine);
        }
    }

    clearScreen() {
        if (this.terminalContent && this.interactiveLine) {
            this.terminalContent.innerHTML = '';
            this.terminalContent.appendChild(this.interactiveLine);
        }
    }

    navigateHistory(direction: number) {
        if (this.commandHistory.length === 0) {
            return;
        }

        if (direction === -1) {
            // Up arrow
            if (this.historyIndex === -1) {
                this.historyIndex = this.commandHistory.length - 1;
            } else if (this.historyIndex > 0) {
                this.historyIndex--;
            }
        } else {
            // Down arrow
            if (this.historyIndex !== -1) {
                if (this.historyIndex < this.commandHistory.length - 1) {
                    this.historyIndex++;
                } else {
                    this.historyIndex = -1;
                    this.currentInput = '';
                    this.cursorPosition = 0;
                    this.updateDisplay();
                    return;
                }
            }
        }

        if (this.historyIndex !== -1) {
            this.currentInput = this.commandHistory[this.historyIndex];
            this.cursorPosition = this.currentInput.length;
            this.updateDisplay();
        }
    }

    handleBackspace() {
        if (this.cursorPosition > 0) {
            this.currentInput =
                this.currentInput.slice(0, this.cursorPosition - 1) +
                this.currentInput.slice(this.cursorPosition);
            this.cursorPosition--;
            this.updateDisplay();
        }
    }

    handleDelete() {
        if (this.cursorPosition < this.currentInput.length) {
            this.currentInput =
                this.currentInput.slice(0, this.cursorPosition) +
                this.currentInput.slice(this.cursorPosition + 1);
            this.updateDisplay();
        }
    }

    moveCursor(direction: number) {
        const newPosition = this.cursorPosition + direction;
        if (newPosition >= 0 && newPosition <= this.currentInput.length) {
            this.cursorPosition = newPosition;
            this.updateDisplay();
        }
    }

    insertCharacter(char: string) {
        this.currentInput =
            this.currentInput.slice(0, this.cursorPosition) +
            char +
            this.currentInput.slice(this.cursorPosition);
        this.cursorPosition++;
        this.historyIndex = -1;
        this.updateDisplay();
    }

    handleControlKey(e: KeyboardEvent) {
        if (e.key === 'c') {
            this.handleCtrlC();
            e.preventDefault();
        } else if (e.key === 'l') {
            this.clearScreen();
            e.preventDefault();
        }
    }

    handleCtrlC() {
        const cancelLine = document.createElement('div');
        cancelLine.className = 'command-line';
        cancelLine.innerHTML = `
            <span class="prompt">${this.prompt}</span>
            <span class="command">${this.currentInput}^C</span>
        `;
        if (this.terminalContent && this.interactiveLine) {
            this.terminalContent.insertBefore(cancelLine, this.interactiveLine);
        }

        this.resetInput();
        this.scrollToBottom();
    }

    handleTabCompletion() {
        const availableCommands = Object.keys(this.commands);
        const matches = availableCommands.filter(cmd => cmd.startsWith(this.currentInput));

        if (matches.length === 1) {
            this.currentInput = matches[0];
            this.cursorPosition = this.currentInput.length;
            this.updateDisplay();
        } else if (matches.length > 1) {
            const output = document.createElement('div');
            output.className = 'output';
            output.style.color = '#7c3aed';
            output.textContent = matches.join('  ');
            if (this.terminalContent && this.interactiveLine) {
                this.terminalContent.insertBefore(output, this.interactiveLine);
            }
            this.scrollToBottom();
        }
    }

    updateDisplay() {
        const beforeCursor = this.currentInput.slice(0, this.cursorPosition);
        const afterCursor = this.currentInput.slice(this.cursorPosition);

        if (this.userInput) {
            this.userInput.innerHTML = beforeCursor + '<span class="cursor"></span>' + afterCursor;
        }
    }

    resetInput() {
        this.currentInput = '';
        this.cursorPosition = 0;
        this.historyIndex = -1;
        this.updateDisplay();
    }

    scrollToBottom() {
        if (this.interactiveLine) {
            this.interactiveLine.scrollIntoView({ behavior: 'smooth' });
        }
    }

    destroy() {
        if (this.dragHandler) {
            this.dragHandler.destroy();
        }
    }
}
