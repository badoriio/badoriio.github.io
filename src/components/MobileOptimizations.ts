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
            link.addEventListener('touchstart', () => {
                link.style.transform = 'scale(1.05)';
                link.style.backgroundColor = 'rgba(88, 166, 255, 0.2)';
            });

            link.addEventListener('touchend', () => {
                link.style.transform = 'scale(1)';
                link.style.backgroundColor = 'rgba(88, 166, 255, 0.1)';
            });
        });
    }

    setupOrientationHandling() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                const canvas = document.getElementById('matrix-bg');
                if (canvas) {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                }
            }, 100);
        });
    }

    setupScrollOptimizations() {
        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('.terminal-content')) {
                e.stopPropagation();
            }
        }, { passive: true });
    }
}
