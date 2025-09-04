/**
 * Mobile-specific optimizations and touch handling
 */
export class MobileOptimizations {
    init() {
        this.setupTouchHandling();
        this.setupOrientationHandling();
        this.setupScrollOptimizations();
    }

    setupTouchHandling() {
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            const element = link as HTMLElement;
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(1.05)';
                element.style.backgroundColor = 'rgba(88, 166, 255, 0.2)';
            });

            element.addEventListener('touchend', () => {
                element.style.transform = 'scale(1)';
                element.style.backgroundColor = 'rgba(88, 166, 255, 0.1)';
            });
        });
    }

    setupOrientationHandling() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                const canvas = document.getElementById('matrix-bg') as HTMLCanvasElement;
                if (canvas) {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                }
            }, 100);
        });
    }

    setupScrollOptimizations() {
        document.addEventListener(
            'touchmove',
            e => {
                if (e.target && (e.target as Element).closest('.terminal-content')) {
                    e.stopPropagation();
                }
            },
            { passive: true },
        );
    }
}
