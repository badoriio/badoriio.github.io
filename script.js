// Terminal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Generate random user ID
    const userId = `user-${Math.floor(Math.random() * 10000)}`;
    const prompt = `${userId}@badori.io:~$`;
    
    // Update all prompts with the random user ID
    document.querySelectorAll('.prompt').forEach(el => {
        el.textContent = prompt;
    });




    // Mobile-specific optimizations
    function setupMobileOptimizations() {
        // Prevent zoom on double-tap for links
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('touchstart', () => {
                link.style.transform = 'scale(1.05)';
                link.style.backgroundColor = 'rgba(88, 166, 255, 0.2)';
            });
            
            link.addEventListener('touchend', () => {
                link.style.transform = 'scale(1)';
                link.style.backgroundColor = 'rgba(88, 166, 255, 0.1)';
            });
        });


        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                const canvas = document.getElementById('matrix-bg');
                if (canvas) {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                }
            }, 100);
        });

        // Improve scrolling performance
        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('.terminal-content')) {
                e.stopPropagation();
            }
        }, { passive: true });
    }

    // Matrix rain effect (subtle background)
    function createMatrixRain() {
        const canvas = document.createElement('canvas');
        canvas.id = 'matrix-bg';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        canvas.style.opacity = '0.05';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = '01';
        const charSize = 14;
        const columns = canvas.width / charSize;
        const drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        function draw() {
            ctx.fillStyle = 'rgba(13, 17, 23, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#58a6ff';
            ctx.font = charSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * charSize, drops[i] * charSize);

                if (drops[i] * charSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        // Optimize for mobile performance
        const fps = window.innerWidth <= 768 ? 150 : 100;
        setInterval(draw, fps);
    }

    // Game overlay function
    function createGameOverlay() {
        // Create game container directly (no background overlay)
        const gameContainer = document.createElement('div');
        gameContainer.id = 'gameContainer';
        gameContainer.style.cssText = `
            background: #0d1117;
            border: 2px solid #30363d;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            color: #c9d1d9;
            font-family: 'Courier New', monospace;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
            pointer-events: auto;
        `;

        gameContainer.innerHTML = `
            <div id="gameHeader" style="
                background: #21262d;
                padding: 10px 15px;
                border-bottom: 1px solid #30363d;
                display: flex;
                align-items: center;
                cursor: move;
                user-select: none;
                margin: -20px -20px 15px -20px;
            ">
                <div style="display: flex; gap: 8px; margin-right: 15px;">
                    <div id="closeGame" style="
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: #ff5f57;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 8px;
                        color: #000;
                        font-weight: bold;
                    "></div>
                    <div style="
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: #ffbd2e;
                        cursor: pointer;
                    "></div>
                    <div style="
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: #28ca42;
                        cursor: pointer;
                    "></div>
                </div>
                <div style="color: #c9d1d9; font-size: 14px; font-weight: normal;">🐍 Snake Game</div>
            </div>
            <div style="font-size: 18px; margin: 10px 0; color: #58a6ff;">
                Score: <span id="gameScore">0</span>
            </div>
            <canvas id="gameCanvas" width="400" height="300" style="
                border: 2px solid #30363d;
                background: #161b22;
                display: block;
                margin: 0 auto;
            "></canvas>
            <div style="margin-top: 10px; font-size: 14px; color: #7c3aed;">
                Click game area to focus, then use WASD or Arrow Keys to move<br>
                Press SPACE to restart • ESC to close
            </div>
        `;

        document.body.appendChild(gameContainer);

        // Make game window draggable
        const gameHeader = document.getElementById('gameHeader');
        let isDragging = false;
        let offsetX, offsetY;
        
        gameHeader.addEventListener('mousedown', (e) => {
            // Don't drag if clicking the close button
            if (e.target.id === 'closeGame') return;
            
            e.preventDefault();
            isDragging = true;
            
            const rect = gameContainer.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            // Position game container absolutely when dragging starts
            gameContainer.style.transform = 'none';
            gameContainer.style.left = rect.left + 'px';
            gameContainer.style.top = rect.top + 'px';
            
            document.addEventListener('mousemove', dragGame);
            document.addEventListener('mouseup', stopDragGame);
        });
        
        function dragGame(e) {
            if (!isDragging) return;
            e.preventDefault();
            
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            
            gameContainer.style.left = x + 'px';
            gameContainer.style.top = y + 'px';
        }
        
        function stopDragGame() {
            isDragging = false;
            document.removeEventListener('mousemove', dragGame);
            document.removeEventListener('mouseup', stopDragGame);
        }

        // Game logic
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('gameScore');
        
        const gridSize = 20;
        const tileCount = canvas.width / gridSize;
        
        let snake = [{x: 10, y: 10}];
        let food = {x: 15, y: 15};
        let dx = 0;
        let dy = 0;
        let score = 0;
        let gameInterval;
        
        function drawGame() {
            // Clear canvas
            ctx.fillStyle = '#161b22';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw snake segments
            ctx.fillStyle = '#58a6ff';
            for (const segment of snake) {
                ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
            }
            
            // Draw food
            ctx.fillStyle = '#f85149';
            ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
        }
        
        function moveSnake() {
            const head = {x: snake[0].x + dx, y: snake[0].y + dy};
            
            if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
                resetGame();
                return;
            }
            
            if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                resetGame();
                return;
            }
            
            snake.unshift(head);
            
            if (head.x === food.x && head.y === food.y) {
                score++;
                scoreElement.textContent = score;
                generateFood();
            } else {
                snake.pop();
            }
        }
        
        function generateFood() {
            // Ensure food doesn't spawn on snake
            do {
                food = {
                    x: Math.floor(Math.random() * tileCount),
                    y: Math.floor(Math.random() * tileCount)
                };
            } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
        }
        
        function resetGame() {
            snake = [{x: 10, y: 10}];
            dx = 0;
            dy = 0;
            score = 0;
            scoreElement.textContent = score;
            generateFood();
        }
        
        function gameLoop() {
            moveSnake();
            drawGame();
        }

        // Game controls - only capture when game area is focused
        let gameHasFocus = false;
        
        // Add focus/blur events to game container
        gameContainer.setAttribute('tabindex', '0');
        gameContainer.style.outline = 'none'; // Remove default focus outline
        
        gameContainer.addEventListener('focus', () => { 
            gameHasFocus = true;
            gameContainer.style.boxShadow = '0 0 10px #58a6ff';
            // Remove focus from terminal
            const terminal = document.querySelector('.terminal');
            if (terminal) {
                terminal.style.boxShadow = 'none';
            }
            // Update global terminal focus state
            terminalHasFocus = false;
        });
        
        gameContainer.addEventListener('blur', () => { 
            gameHasFocus = false;
            gameContainer.style.boxShadow = 'none';
        });
        
        // Focus is now handled by the global click handler
        
        function handleGameKeydown(e) {
            // Only handle game controls if game has focus or specific game keys are pressed
            if (!gameHasFocus && e.code !== 'Escape') return;
            
            if (e.code === 'ArrowUp' || e.code === 'KeyW') {
                if (gameHasFocus && dy === 0) { 
                    dx = 0; dy = -1; 
                    e.preventDefault();
                }
            } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
                if (gameHasFocus && dy === 0) { 
                    dx = 0; dy = 1; 
                    e.preventDefault();
                }
            } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
                if (gameHasFocus && dx === 0) { 
                    dx = -1; dy = 0; 
                    e.preventDefault();
                }
            } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
                if (gameHasFocus && dx === 0) { 
                    dx = 1; dy = 0; 
                    e.preventDefault();
                }
            } else if (e.code === 'Space') {
                if (gameHasFocus) {
                    e.preventDefault();
                    resetGame();
                }
            } else if (e.code === 'Escape') {
                closeGame();
                e.preventDefault();
            }
        }

        function closeGame() {
            clearInterval(gameInterval);
            document.removeEventListener('keydown', handleGameKeydown);
            document.body.removeChild(gameContainer);
        }

        // Event listeners
        document.addEventListener('keydown', handleGameKeydown);
        document.getElementById('closeGame').addEventListener('click', closeGame);

        // Start game
        generateFood();
        drawGame();
        gameInterval = setInterval(gameLoop, 150);
    }

    // Global terminal focus state
    let terminalHasFocus = true;

    // Interactive terminal input
    function setupInteractiveTerminal() {
        const userInput = document.getElementById('userInput');
        const terminalContent = document.querySelector('.terminal-content');
        const interactiveLine = document.querySelector('.interactive-line');
        
        let currentInput = '';
        let cursorPosition = 0;
        let commandHistory = [];
        let historyIndex = -1;
        
        // Available commands and responses
        const commands = {
            'help': 'help\nabout\ncontact\nclear\ndate\nexit\ngame',
            'about': 'BADORIIO - Digital forge where ideas become reality',
            'contact': 'Email: <a href="mailto:amir@badori.io" style="color: #58a6ff; text-decoration: underline;">amir@badori.io</a>\nX: <a href="https://x.com/Badoriie" target="_blank" style="color: #58a6ff; text-decoration: underline;">https://x.com/Badoriie</a>\nGitHub: <a href="https://github.com/badoriio" target="_blank" style="color: #58a6ff; text-decoration: underline;">https://github.com/badoriio</a>',
            'date': () => new Date().toString(),
            'clear': 'CLEAR_SCREEN',
            'pwd': `/home/${userId.split('@')[0]}`,
            'exit': 'EXIT_COMMAND',
            'game': 'GAME_COMMAND',
        };
        
        
        // Handle keyboard input
        document.addEventListener('keydown', (e) => {
            // Only handle terminal input if terminal has focus
            if (!terminalHasFocus) return;
            if (e.key === 'Enter') {
                const command = currentInput.trim();
                if (command && command !== commandHistory[commandHistory.length - 1]) {
                    commandHistory.push(command);
                }
                executeCommand(command);
                currentInput = '';
                cursorPosition = 0;
                historyIndex = -1;
                updateDisplay();
            } else if (e.key === 'ArrowUp') {
                if (commandHistory.length > 0) {
                    if (historyIndex === -1) {
                        historyIndex = commandHistory.length - 1;
                    } else if (historyIndex > 0) {
                        historyIndex--;
                    }
                    currentInput = commandHistory[historyIndex];
                    cursorPosition = currentInput.length;
                    updateDisplay();
                }
                e.preventDefault();
            } else if (e.key === 'ArrowDown') {
                if (historyIndex !== -1) {
                    if (historyIndex < commandHistory.length - 1) {
                        historyIndex++;
                        currentInput = commandHistory[historyIndex];
                    } else {
                        historyIndex = -1;
                        currentInput = '';
                    }
                    cursorPosition = currentInput.length;
                    updateDisplay();
                }
                e.preventDefault();
            } else if (e.key === 'Backspace') {
                if (cursorPosition > 0) {
                    currentInput = currentInput.slice(0, cursorPosition - 1) + currentInput.slice(cursorPosition);
                    cursorPosition--;
                    updateDisplay();
                }
            } else if (e.key === 'Delete') {
                if (cursorPosition < currentInput.length) {
                    currentInput = currentInput.slice(0, cursorPosition) + currentInput.slice(cursorPosition + 1);
                    updateDisplay();
                }
            } else if (e.key === 'ArrowLeft') {
                if (cursorPosition > 0) {
                    cursorPosition--;
                    updateDisplay();
                }
                e.preventDefault();
            } else if (e.key === 'ArrowRight') {
                if (cursorPosition < currentInput.length) {
                    cursorPosition++;
                    updateDisplay();
                }
                e.preventDefault();
            } else if (e.key === 'Home') {
                cursorPosition = 0;
                updateDisplay();
                e.preventDefault();
            } else if (e.key === 'End') {
                cursorPosition = currentInput.length;
                updateDisplay();
                e.preventDefault();
            } else if (e.ctrlKey && e.key === 'c') {
                // Ctrl+C to cancel current command
                currentInput = '';
                cursorPosition = 0;
                historyIndex = -1;
                
                // Show ^C and new prompt
                const cancelLine = document.createElement('div');
                cancelLine.className = 'command-line';
                cancelLine.innerHTML = `
                    <span class="prompt">${prompt}</span>
                    <span class="command">${currentInput}^C</span>
                `;
                terminalContent.insertBefore(cancelLine, interactiveLine);
                
                updateDisplay();
                interactiveLine.scrollIntoView({ behavior: 'smooth' });
                e.preventDefault();
            } else if (e.ctrlKey && e.key === 'l') {
                // Ctrl+L to clear screen
                terminalContent.innerHTML = '';
                terminalContent.appendChild(interactiveLine);
                e.preventDefault();
            } else if (e.key === 'Tab') {
                // Tab completion
                const availableCommands = Object.keys(commands);
                const matches = availableCommands.filter(cmd => cmd.startsWith(currentInput));
                
                if (matches.length === 1) {
                    currentInput = matches[0];
                    cursorPosition = currentInput.length;
                    updateDisplay();
                } else if (matches.length > 1) {
                    // Show available completions
                    const output = document.createElement('div');
                    output.className = 'output';
                    output.style.color = '#7c3aed';
                    output.textContent = matches.join('  ');
                    terminalContent.insertBefore(output, interactiveLine);
                    interactiveLine.scrollIntoView({ behavior: 'smooth' });
                }
                e.preventDefault();
            } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
                currentInput = currentInput.slice(0, cursorPosition) + e.key + currentInput.slice(cursorPosition);
                cursorPosition++;
                historyIndex = -1; // Reset history navigation when typing
                updateDisplay();
            }
        });
        
        function updateDisplay() {
            // Split text at cursor position and add cursor
            const beforeCursor = currentInput.slice(0, cursorPosition);
            const afterCursor = currentInput.slice(cursorPosition);
            
            userInput.innerHTML = beforeCursor + '<span class="cursor"></span>' + afterCursor;
        }
        
        function executeCommand(command) {
            // Create new command line showing what user typed
            const newCommandLine = document.createElement('div');
            newCommandLine.className = 'command-line';
            newCommandLine.innerHTML = `
                <span class="prompt">${prompt}</span>
                <span class="command">${command}</span>
            `;
            
            // Insert before the interactive line
            terminalContent.insertBefore(newCommandLine, interactiveLine);
            
            // Handle command
            if (command === '') {
                // Empty command, just show new prompt
                return;
            }
            
            if (commands[command]) {
                if (command === 'clear') {
                    // Clear all previous output
                    terminalContent.innerHTML = '';
                    
                    // Re-add only the interactive line
                    terminalContent.appendChild(interactiveLine);
                    return;
                }
                
                if (command === 'exit') {
                    // Close the browser tab
                    window.close();
                    return;
                }
                
                if (command === 'game') {
                    // Create game overlay
                    createGameOverlay();
                    return;
                }
                
                const output = document.createElement('div');
                output.className = 'output success';
                const response = typeof commands[command] === 'function' ? commands[command]() : commands[command];
                output.innerHTML = response.replace(/\n/g, '<br>');
                terminalContent.insertBefore(output, interactiveLine);
            } else {
                // Command not found
                const output = document.createElement('div');
                output.className = 'output';
                output.style.color = '#f85149';
                output.textContent = `bash: ${command}: command not found`;
                terminalContent.insertBefore(output, interactiveLine);
            }
            
            // Auto-scroll to bottom
            interactiveLine.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Unified focus management - use event capture to ensure proper priority
        document.addEventListener('click', (e) => {
            // Priority 1: Terminal clicks
            if (e.target.closest('.terminal')) {
                setFocus('terminal');
                return;
            }
            
            // Priority 2: Game clicks (only when game exists)
            const gameContainer = document.getElementById('gameContainer');
            
            if (gameContainer && e.target.closest('#gameContainer')) {
                if (!e.target.closest('#closeGame')) {
                    setFocus('game');
                }
            }
        }, true); // Use capture phase for priority

        function setFocus(target) {
            const terminal = document.querySelector('.terminal');
            const gameContainer = document.getElementById('gameContainer');
            
            if (target === 'terminal') {
                terminalHasFocus = true;
                document.body.focus();
                terminal.style.boxShadow = '0 0 10px #58a6ff';
                if (gameContainer) {
                    gameContainer.blur();
                    gameContainer.style.boxShadow = 'none';
                }
            } else if (target === 'game' && gameContainer) {
                terminalHasFocus = false;
                gameContainer.focus();
                gameContainer.style.boxShadow = '0 0 10px #58a6ff';
                terminal.style.boxShadow = 'none';
            }
        }
        
        // Initial focus
        document.body.focus();
        document.body.setAttribute('tabindex', '0');
        
        // Prevent default tab behavior
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
            }
        });
    }

    // Make terminal draggable with no delay
    function makeDraggable() {
        const terminal = document.querySelector('.terminal');
        const header = document.querySelector('.terminal-header');
        
        let isDragging = false;
        let offsetX, offsetY;
        
        header.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;
            
            const rect = terminal.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            terminal.style.transform = 'none';
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
        });
        
        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            
            terminal.style.left = x + 'px';
            terminal.style.top = y + 'px';
        }
        
        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
        }
    }

    // Initialize all functions
    setupMobileOptimizations();
    setupInteractiveTerminal();
    makeDraggable();
    createMatrixRain();

    // Remove transitions for immediate dragging response
    document.querySelector('.terminal').style.transition = 'none';
    
});