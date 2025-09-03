// Terminal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Typing animation for commands
    function typeCommand(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = '';
        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    // Simulate random loading percentage updates
    function updateLoadingPercentage() {
        const percentageElement = document.querySelector('.loading .info');
        if (percentageElement) {
            const percentages = ['78%', '82%', '89%', '94%', '97%'];
            let currentIndex = 0;
            
            setInterval(() => {
                percentageElement.textContent = percentages[currentIndex];
                currentIndex = (currentIndex + 1) % percentages.length;
            }, 4000);
        }
    }


    // Terminal buttons (no functionality, just visual)
    function setupTerminalButtons() {
        // Buttons are now purely visual elements
        // No click handlers attached
    }

    // Mobile-specific optimizations
    function setupMobileOptimizations() {
        // Prevent zoom on double-tap for links
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('touchstart', (e) => {
                link.style.transform = 'scale(1.05)';
                link.style.backgroundColor = 'rgba(88, 166, 255, 0.2)';
            });
            
            link.addEventListener('touchend', (e) => {
                link.style.transform = 'scale(1)';
                link.style.backgroundColor = 'rgba(88, 166, 255, 0.1)';
            });
        });

        // Optimize matrix rain for mobile
        if (window.innerWidth <= 768) {
            const canvas = document.getElementById('matrix-bg');
            if (canvas) {
                canvas.style.opacity = '0.02'; // Reduce opacity for better performance
            }
        }

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

        setInterval(draw, 100);
    }

    // Interactive terminal input
    function setupInteractiveTerminal() {
        const userInput = document.getElementById('userInput');
        const terminalContent = document.querySelector('.terminal-content');
        const interactiveLine = document.querySelector('.interactive-line');
        
        let currentInput = '';
        
        // Available commands and responses
        const commands = {
            'help': 'Available commands: help, about, contact, clear, whoami, date, uptime',
            'about': 'BADORIIO - Digital forge where ideas become reality',
            'contact': 'Email: amir@badori.io\nX: https://x.com/Badoriie\nGitHub: https://github.com/badoriio',
            'whoami': 'me@badoriio',
            'date': () => new Date().toString(),
            'uptime': 'System uptime: Currently under development',
            'clear': 'CLEAR_SCREEN',
            'ls': 'contacts/',
            'pwd': '/home/me',
            'uname': 'Linux badoriio 5.15.0-badoriio #1 SMP',
            'ps': 'PID TTY          TIME CMD\n 1234 pts/0    00:00:01 badoriio-dev'
        };
        
        // Handle keyboard input
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                executeCommand(currentInput.trim());
                currentInput = '';
                updateDisplay();
            } else if (e.key === 'Backspace') {
                currentInput = currentInput.slice(0, -1);
                updateDisplay();
            } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
                currentInput += e.key;
                updateDisplay();
            }
        });
        
        function updateDisplay() {
            userInput.textContent = currentInput;
        }
        
        function executeCommand(command) {
            // Create new command line showing what user typed
            const newCommandLine = document.createElement('div');
            newCommandLine.className = 'command-line';
            newCommandLine.innerHTML = `
                <span class="prompt">me@badoriio:~$</span>
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
        
        // Focus the terminal for keyboard input
        document.addEventListener('click', (e) => {
            if (e.target.closest('.terminal')) {
                document.body.focus();
            }
        });
        
        // Initial focus
        document.body.focus();
        document.body.setAttribute('tabindex', '0');
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
    updateLoadingPercentage();
    setupTerminalButtons();
    setupMobileOptimizations();
    setupInteractiveTerminal();
    makeDraggable();
    createMatrixRain();

    // Remove transitions for immediate dragging response
    document.querySelector('.terminal').style.transition = 'none';
    
    console.log('🚀 Badori.io terminal initialized');
    console.log('💻 Welcome to the digital forge');
});