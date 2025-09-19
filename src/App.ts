/**
 * Main application entry point
 */
import { Terminal } from './components/Terminal.js';
import { SnakeGame } from './components/SnakeGame.js';
import { MatrixBackground } from './components/MatrixBackground.js';
import { MobileOptimizations } from './components/MobileOptimizations.js';
import { generateUserId, updatePrompts } from './utils/helpers.js';

class App {
    private terminal: Terminal | null = null;
    private matrixBackground: MatrixBackground | null = null;
    private mobileOptimizations: MobileOptimizations | null = null;
    private currentGame: SnakeGame | null = null;

    public init(): void {
        document.addEventListener('DOMContentLoaded', () => {
            this.setup();
        });
    }

    private setup(): void {
        // Generate user ID and update prompts
        const userId = generateUserId();
        const prompt = updatePrompts(userId);

        // Initialize components
        this.terminal = new Terminal(prompt);
        this.matrixBackground = new MatrixBackground();
        this.mobileOptimizations = new MobileOptimizations();

        // Initialize all components
        this.terminal.init();
        this.matrixBackground.init();
        this.mobileOptimizations.init(this.terminal);

        // Setup global event listeners
        this.setupGameEventListeners();
    }

    private setupGameEventListeners(): void {
        // Listen for game creation requests
        window.addEventListener('createGame', () => {
            if (this.currentGame) {
                this.currentGame.close();
            }
            this.currentGame = new SnakeGame();
            this.currentGame.create();
        });

        // Listen for game focus events
        window.addEventListener('gameGotFocus', () => {
            if (this.terminal) {
                this.terminal.setTerminalFocus(false);
            }
        });

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    private cleanup(): void {
        if (this.terminal) {
            this.terminal.destroy();
        }
        if (this.mobileOptimizations) {
            this.mobileOptimizations.destroy();
        }
        if (this.currentGame) {
            this.currentGame.close();
        }
    }
}

// Initialize the application
const app = new App();
app.init();

export default App;
