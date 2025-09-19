/* eslint-env browser */
/* global HTMLInputElement, navigator, requestAnimationFrame */

/**
 * Mobile-specific optimizations and touch handling
 * Provides seamless mobile keyboard input and custom scroll indicators
 * @version 1.0.0
 */
import type { Terminal } from '../types/terminal.js';

export class MobileOptimizations {
    private hiddenInput: HTMLInputElement | null = null;
    private terminal: Terminal | null = null;
    private readonly isMobile: boolean;

    constructor() {
        this.isMobile =
            typeof navigator !== 'undefined' &&
            /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    init(terminal?: Terminal | null): void {
        if (!this.isMobile) {
            return;
        }

        this.terminal = terminal || null;
        this.setupMobileKeyboard();
        this.setupMobileHint();
        this.setupMobileScrollIndicator();
        this.setupTouchHandling();
        this.setupOrientationHandling();
        this.setupScrollOptimizations();
    }

    private setupMobileKeyboard(): void {
        // Create hidden input for mobile keyboard
        this.hiddenInput = document.createElement('input');
        this.hiddenInput.type = 'text';
        this.hiddenInput.style.position = 'fixed';
        this.hiddenInput.style.left = '-9999px';
        this.hiddenInput.style.top = '50%';
        this.hiddenInput.style.width = '1px';
        this.hiddenInput.style.height = '1px';
        this.hiddenInput.style.opacity = '0';
        this.hiddenInput.style.zIndex = '-1';
        this.hiddenInput.style.border = 'none';
        this.hiddenInput.style.outline = 'none';
        this.hiddenInput.setAttribute('autocomplete', 'off');
        this.hiddenInput.setAttribute('autocorrect', 'off');
        this.hiddenInput.setAttribute('autocapitalize', 'none');
        this.hiddenInput.setAttribute('spellcheck', 'false');
        document.body.appendChild(this.hiddenInput);

        // Add touch listener to terminal to focus hidden input
        const terminal = document.querySelector('.terminal');
        if (terminal) {
            terminal.addEventListener('touchstart', this.handleTerminalTouch.bind(this), {
                passive: false,
            });
        }

        // Handle input changes directly
        this.hiddenInput.addEventListener('input', this.handleInput.bind(this));

        // Handle enter key
        this.hiddenInput.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    private handleTerminalTouch(e: Event): void {
        // Only trigger on the terminal content area, not header
        if (
            (e.target as Element).closest('.terminal-content') ||
            (e.target as Element).closest('.interactive-line')
        ) {
            e.preventDefault();
            this.focusKeyboard();
        }
    }

    private handleInput(): void {
        if (!this.hiddenInput || !this.terminal) {
            return;
        }

        const value = this.hiddenInput.value;
        // Set terminal input to the new value (handles both typing and backspace)
        this.terminal.currentInput = value;
        this.terminal.cursorPosition = value.length;
        this.terminal.terminalHasFocus = true;
        this.terminal.updateDisplay();
    }

    private handleKeydown(e: KeyboardEvent): void {
        if (e.key === 'Enter' && this.terminal && this.hiddenInput) {
            e.preventDefault();
            // Execute the command
            this.terminal.executeCommand();
            this.hiddenInput.value = '';
        }
    }

    private focusKeyboard(): void {
        if (this.hiddenInput) {
            this.hiddenInput.focus();
        }
    }

    private setupMobileScrollIndicator(): void {
        // Create a wider custom scroll indicator for better visibility
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'mobile-scroll-indicator';
        scrollIndicator.style.cssText = `
            position: fixed;
            right: 2px;
            top: 8%;
            width: 8px;
            height: 84%;
            background: rgba(88, 166, 255, 0.25);
            border-radius: 4px;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const scrollThumb = document.createElement('div');
        scrollThumb.className = 'mobile-scroll-thumb';
        scrollThumb.style.cssText = `
            width: 100%;
            background: linear-gradient(180deg, rgba(88, 166, 255, 0.95) 0%, rgba(124, 58, 237, 0.95) 100%);
            border-radius: 4px;
            position: absolute;
            top: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
        `;

        scrollIndicator.appendChild(scrollThumb);
        document.body.appendChild(scrollIndicator);

        // Update scroll indicator position with smooth animations
        let scrollTimeout: number | null = null;

        const updateScrollIndicator = (): void => {
            const scrollTop = window.pageYOffset;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;

            if (documentHeight <= 0) {
                scrollIndicator.style.opacity = '0';
                return;
            }

            const scrollPercent = scrollTop / documentHeight;
            const thumbHeight = Math.max(
                (window.innerHeight / document.documentElement.scrollHeight) * 100,
                8,
            );

            scrollThumb.style.height = thumbHeight + '%';
            scrollThumb.style.top = scrollPercent * (100 - thumbHeight) + '%';
            scrollIndicator.style.opacity = '1';

            // Auto-hide after scroll stops
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(() => {
                scrollIndicator.style.opacity = '0.3';
            }, 1500);
        };

        // Update on scroll and resize with optimized event listeners
        window.addEventListener('scroll', updateScrollIndicator, { passive: true });
        window.addEventListener('resize', updateScrollIndicator, { passive: true });

        // Initial update after DOM is ready
        if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(updateScrollIndicator);
        } else {
            setTimeout(updateScrollIndicator, 0);
        }
    }

    private setupMobileHint(): void {
        const terminalContent = document.querySelector('.terminal-content');
        if (terminalContent) {
            const hintElement = document.createElement('div');
            hintElement.className = 'mobile-hint';
            hintElement.innerHTML =
                '<span style="color: #7c3aed; font-size: 11px; opacity: 0.8;">💡 Tap here to type</span>';
            hintElement.style.position = 'absolute';
            hintElement.style.right = '10px';
            hintElement.style.bottom = '10px';
            hintElement.style.zIndex = '5';
            hintElement.style.pointerEvents = 'none';

            terminalContent.style.position = 'relative';
            terminalContent.appendChild(hintElement);

            // Hide hint after first interaction
            const hideHint = () => {
                hintElement.style.display = 'none';
                document.removeEventListener('keydown', hideHint);
                terminalContent.removeEventListener('touchstart', hideHint);
            };

            // Hide after keyboard input or touch
            document.addEventListener('keydown', hideHint, { once: true });
            terminalContent.addEventListener('touchstart', hideHint, { once: true });
        }
    }

    private setupTouchHandling(): void {
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

    private setupOrientationHandling(): void {
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

    private setupScrollOptimizations(): void {
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

    /**
     * Clean up event listeners and DOM elements
     */
    destroy(): void {
        if (this.hiddenInput && this.hiddenInput.parentNode) {
            this.hiddenInput.parentNode.removeChild(this.hiddenInput);
            this.hiddenInput = null;
        }

        // Remove scroll indicator
        const scrollIndicator = document.querySelector('.mobile-scroll-indicator');
        if (scrollIndicator && scrollIndicator.parentNode) {
            scrollIndicator.parentNode.removeChild(scrollIndicator);
        }

        // Remove mobile hint
        const mobileHint = document.querySelector('.mobile-hint');
        if (mobileHint && mobileHint.parentNode) {
            mobileHint.parentNode.removeChild(mobileHint);
        }

        this.terminal = null;
    }
}
