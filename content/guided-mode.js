// Guided Mode Module for Jarvis - Step-by-step overlays and instructions
// Inspired by ChromePilot's guided UI features

class GuidedMode {
    constructor() {
        this.isActive = false;
        this.currentStep = 0;
        this.steps = [];
        this.overlayElement = null;
        this.arrowElement = null;
        this.popoverElement = null;
    }

    // Initialize guided mode with a sequence of steps
    start(steps) {
        this.steps = steps;
        this.currentStep = 0;
        this.isActive = true;
        this.createOverlay();
        this.showStep(0);
    }

    // Create the overlay elements
    createOverlay() {
        // Create dark overlay
        this.overlayElement = document.createElement('div');
        this.overlayElement.id = 'jarvis-guided-overlay';
        this.overlayElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 999998;
            pointer-events: none;
        `;
        document.body.appendChild(this.overlayElement);

        // Create arrow indicator
        this.arrowElement = document.createElement('div');
        this.arrowElement.id = 'jarvis-guided-arrow';
        this.arrowElement.innerHTML = '↓';
        this.arrowElement.style.cssText = `
            position: fixed;
            font-size: 48px;
            color: #00d4ff;
            z-index: 1000000;
            pointer-events: none;
            text-shadow: 0 0 10px rgba(0, 212, 255, 0.8);
            animation: jarvis-bounce 1s infinite;
        `;
        document.body.appendChild(this.arrowElement);

        // Create popover for instructions
        this.popoverElement = document.createElement('div');
        this.popoverElement.id = 'jarvis-guided-popover';
        this.popoverElement.style.cssText = `
            position: fixed;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 1000001;
            max-width: 350px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        document.body.appendChild(this.popoverElement);

        // Add animation CSS
        if (!document.getElementById('jarvis-guided-styles')) {
            const style = document.createElement('style');
            style.id = 'jarvis-guided-styles';
            style.textContent = `
                @keyframes jarvis-bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes jarvis-pulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(0, 212, 255, 0.7); }
                    50% { box-shadow: 0 0 0 10px rgba(0, 212, 255, 0); }
                }
                .jarvis-highlight {
                    position: relative;
                    z-index: 999999 !important;
                    box-shadow: 0 0 0 4px #00d4ff !important;
                    animation: jarvis-pulse 2s infinite;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Show a specific step
    showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.steps.length) {
            this.end();
            return;
        }

        this.currentStep = stepIndex;
        const step = this.steps[stepIndex];

        // Remove previous highlights
        document.querySelectorAll('.jarvis-highlight').forEach(el => {
            el.classList.remove('jarvis-highlight');
        });

        // Find target element
        let targetElement = null;
        if (step.selector) {
            targetElement = document.querySelector(step.selector);
        }

        if (targetElement) {
            // Highlight target element
            targetElement.classList.add('jarvis-highlight');
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Position arrow
            const rect = targetElement.getBoundingClientRect();
            this.arrowElement.style.left = `${rect.left + rect.width / 2 - 24}px`;
            this.arrowElement.style.top = `${rect.top - 60}px`;
            this.arrowElement.style.display = 'block';

            // Position popover
            const popoverTop = rect.top > 300 ? rect.top - 200 : rect.bottom + 20;
            this.popoverElement.style.left = `${Math.max(20, rect.left)}px`;
            this.popoverElement.style.top = `${popoverTop}px`;
        } else {
            this.arrowElement.style.display = 'none';
            this.popoverElement.style.left = '50%';
            this.popoverElement.style.top = '50%';
            this.popoverElement.style.transform = 'translate(-50%, -50%)';
        }

        // Update popover content
        this.popoverElement.innerHTML = `
            <div style="font-size: 18px; font-weight: 600; margin-bottom: 10px;">
                Step ${stepIndex + 1} of ${this.steps.length}
            </div>
            <div style="font-size: 14px; line-height: 1.5; margin-bottom: 15px;">
                ${step.instruction}
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                ${stepIndex > 0 ? '<button id="jarvis-prev-btn" style="padding: 8px 16px; border: none; border-radius: 6px; background: rgba(255,255,255,0.2); color: white; cursor: pointer; font-size: 14px;">Previous</button>' : ''}
                ${stepIndex < this.steps.length - 1 ? '<button id="jarvis-next-btn" style="padding: 8px 16px; border: none; border-radius: 6px; background: #00d4ff; color: #1a1a2e; cursor: pointer; font-weight: 600; font-size: 14px;">Next</button>' : '<button id="jarvis-finish-btn" style="padding: 8px 16px; border: none; border-radius: 6px; background: #00ff88; color: #1a1a2e; cursor: pointer; font-weight: 600; font-size: 14px;">Finish</button>'}
                <button id="jarvis-skip-btn" style="padding: 8px 16px; border: none; border-radius: 6px; background: rgba(255,255,255,0.1); color: white; cursor: pointer; font-size: 14px;">Skip</button>
            </div>
        `;

        // Attach button listeners
        setTimeout(() => {
            const nextBtn = document.getElementById('jarvis-next-btn');
            const prevBtn = document.getElementById('jarvis-prev-btn');
            const skipBtn = document.getElementById('jarvis-skip-btn');
            const finishBtn = document.getElementById('jarvis-finish-btn');

            if (nextBtn) nextBtn.addEventListener('click', () => this.showStep(stepIndex + 1));
            if (prevBtn) prevBtn.addEventListener('click', () => this.showStep(stepIndex - 1));
            if (skipBtn) skipBtn.addEventListener('click', () => this.end());
            if (finishBtn) finishBtn.addEventListener('click', () => this.end());
        }, 100);
    }

    // End guided mode
    end() {
        this.isActive = false;
        this.currentStep = 0;
        this.steps = [];

        // Remove overlay elements
        if (this.overlayElement) this.overlayElement.remove();
        if (this.arrowElement) this.arrowElement.remove();
        if (this.popoverElement) this.popoverElement.remove();

        // Remove highlights
        document.querySelectorAll('.jarvis-highlight').forEach(el => {
            el.classList.remove('jarvis-highlight');
        });
    }
}

// Export guided mode instance
window.jarvisGuidedMode = new GuidedMode();

// Example usage templates
window.jarvisGuidedTemplates = {
    fillForm: [
        { selector: 'input[name="name"]', instruction: 'Enter your name in this field' },
        { selector: 'input[name="email"]', instruction: 'Enter your email address here' },
        { selector: 'button[type="submit"]', instruction: 'Click this button to submit the form' }
    ],
    searchGoogle: [
        { selector: 'input[name="q"]', instruction: 'Type your search query here' },
        { selector: 'input[type="submit"]', instruction: 'Click the search button or press Enter' }
    ]
};

console.log('Jarvis Guided Mode initialized');
