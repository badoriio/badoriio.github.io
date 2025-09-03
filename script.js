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

    // Add random terminal activity
    function addRandomActivity() {
        const activities = [
            '[INFO] Compiling new features...',
            '[INFO] Running security checks...',
            '[INFO] Optimizing database...',
            '[SUCCESS] Tests passed successfully',
            '[INFO] Building production assets...'
        ];

        const terminalContent = document.querySelector('.terminal-content');
        const cursor = document.querySelector('.cursor').parentElement;
        
        setInterval(() => {
            const activity = activities[Math.floor(Math.random() * activities.length)];
            const newLine = document.createElement('div');
            newLine.className = 'output info';
            newLine.textContent = activity;
            
            // Insert before the cursor line
            terminalContent.insertBefore(newLine, cursor);
            
            // Remove old lines to prevent overflow (keep last 10 activity lines)
            const activityLines = terminalContent.querySelectorAll('.output.info');
            if (activityLines.length > 15) {
                activityLines[0].remove();
            }
        }, 8000);
    }

    // Terminal button interactions
    function setupTerminalButtons() {
        const closeBtn = document.querySelector('.terminal-button.close');
        const minimizeBtn = document.querySelector('.terminal-button.minimize');
        const maximizeBtn = document.querySelector('.terminal-button.maximize');
        const terminal = document.querySelector('.terminal');

        closeBtn.addEventListener('click', () => {
            terminal.style.opacity = '0.5';
            terminal.style.transform = 'scale(0.9)';
            setTimeout(() => {
                terminal.style.opacity = '1';
                terminal.style.transform = 'scale(1)';
            }, 500);
        });

        minimizeBtn.addEventListener('click', () => {
            terminal.style.transform = 'translateY(100vh)';
            setTimeout(() => {
                terminal.style.transform = 'translateY(0)';
            }, 1000);
        });

        maximizeBtn.addEventListener('click', () => {
            terminal.classList.toggle('fullscreen');
            if (terminal.classList.contains('fullscreen')) {
                terminal.style.width = '100vw';
                terminal.style.height = '100vh';
                terminal.style.maxWidth = 'none';
                terminal.style.borderRadius = '0';
            } else {
                terminal.style.width = '90%';
                terminal.style.height = 'auto';
                terminal.style.maxWidth = '800px';
                terminal.style.borderRadius = '8px';
            }
        });
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

    // Initialize all functions
    updateLoadingPercentage();
    addRandomActivity();
    setupTerminalButtons();
    createMatrixRain();

    // Add smooth transitions
    document.querySelector('.terminal').style.transition = 'all 0.5s ease';
    
    console.log('🚀 Badori.io terminal initialized');
    console.log('💻 Welcome to the digital forge');
});