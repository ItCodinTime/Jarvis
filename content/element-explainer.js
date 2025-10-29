// Element Explainer for Jarvis - AI-powered contextual explanations
// Uses Gemini AI to explain page elements and sections

class ElementExplainer {
    constructor() {
        this.isSelectionMode = false;
        this.highlightOverlay = null;
        this.selectionBox = null;
        this.tooltip = null;
        this.selectedElement = null;
    }

    // Enable element selection mode
    enableSelectionMode() {
        if (this.isSelectionMode) return;
        
        this.isSelectionMode = true;
        document.body.style.cursor = 'crosshair';
        
        // Create selection overlay
        this.createSelectionUI();
        
        // Add event listeners
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('click', this.handleClick);
        document.addEventListener('keydown', this.handleKeyDown);
        
        // Show instruction tooltip
        this.showInstructionTooltip();
    }

    // Disable element selection mode
    disableSelectionMode() {
        if (!this.isSelectionMode) return;
        
        this.isSelectionMode = false;
        document.body.style.cursor = 'default';
        
        // Remove UI elements
        if (this.highlightOverlay) this.highlightOverlay.remove();
        if (this.selectionBox) this.selectionBox.remove();
        if (this.tooltip) this.tooltip.remove();
        
        // Remove event listeners
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('click', this.handleClick);
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    // Create selection UI elements
    createSelectionUI() {
        // Create highlight overlay
        this.highlightOverlay = document.createElement('div');
        this.highlightOverlay.id = 'jarvis-element-highlight';
        this.highlightOverlay.style.cssText = `
            position: fixed;
            border: 3px solid #00d4ff;
            background: rgba(0, 212, 255, 0.1);
            pointer-events: none;
            z-index: 999999;
            transition: all 0.1s ease;
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
        `;
        document.body.appendChild(this.highlightOverlay);
    }

    // Show instruction tooltip
    showInstructionTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            z-index: 1000000;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            animation: jarvis-fade-in 0.3s ease;
        `;
        this.tooltip.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 5px;">🎯 Element Selection Mode</div>
            <div>Click on any element to get an AI explanation • Press ESC to cancel</div>
        `;
        document.body.appendChild(this.tooltip);
    }

    // Handle mouse move to highlight elements
    handleMouseMove = (e) => {
        if (!this.isSelectionMode) return;
        
        const element = document.elementFromPoint(e.clientX, e.clientY);
        if (!element || element === this.highlightOverlay) return;
        
        const rect = element.getBoundingClientRect();
        this.highlightOverlay.style.left = `${rect.left}px`;
        this.highlightOverlay.style.top = `${rect.top}px`;
        this.highlightOverlay.style.width = `${rect.width}px`;
        this.highlightOverlay.style.height = `${rect.height}px`;
        this.highlightOverlay.style.display = 'block';
        
        this.selectedElement = element;
    }

    // Handle click to select element
    handleClick = async (e) => {
        if (!this.isSelectionMode) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const element = this.selectedElement;
        if (!element) return;
        
        // Disable selection mode
        this.disableSelectionMode();
        
        // Show loading indicator
        this.showLoadingIndicator();
        
        // Extract element information
        const elementInfo = this.extractElementInfo(element);
        
        // Get explanation from Gemini
        try {
            const explanation = await this.getGeminiExplanation(elementInfo);
            this.showExplanation(explanation, element);
        } catch (error) {
            this.showError(error.message);
        }
    }

    // Handle key down (ESC to cancel)
    handleKeyDown = (e) => {
        if (e.key === 'Escape' && this.isSelectionMode) {
            this.disableSelectionMode();
        }
    }

    // Extract element information for AI analysis
    extractElementInfo(element) {
        const info = {
            tagName: element.tagName.toLowerCase(),
            textContent: element.textContent.trim().substring(0, 500),
            attributes: {},
            className: element.className,
            id: element.id,
            role: element.getAttribute('role'),
            ariaLabel: element.getAttribute('aria-label'),
            innerHTML: element.innerHTML.substring(0, 1000),
            computedStyle: {}
        };
        
        // Get relevant attributes
        const relevantAttrs = ['type', 'name', 'placeholder', 'value', 'href', 'src', 'alt', 'title'];
        relevantAttrs.forEach(attr => {
            if (element.hasAttribute(attr)) {
                info.attributes[attr] = element.getAttribute(attr);
            }
        });
        
        // Get computed styles
        const computedStyle = window.getComputedStyle(element);
        const relevantStyles = ['display', 'position', 'width', 'height', 'backgroundColor', 'color'];
        relevantStyles.forEach(style => {
            info.computedStyle[style] = computedStyle[style];
        });
        
        return info;
    }

    // Get explanation from Gemini AI
    async getGeminiExplanation(elementInfo) {
        return new Promise((resolve, reject) => {
            // Send message to background script
            chrome.runtime.sendMessage({
                action: 'explainElement',
                elementInfo: elementInfo,
                pageContext: {
                    url: window.location.href,
                    title: document.title
                }
            }, (response) => {
                if (response.success) {
                    resolve(response.explanation);
                } else {
                    reject(new Error(response.error || 'Failed to get explanation'));
                }
            });
        });
    }

    // Show loading indicator
    showLoadingIndicator() {
        const loader = document.createElement('div');
        loader.id = 'jarvis-explanation-loader';
        loader.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 30px 40px;
            border-radius: 15px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 16px;
            z-index: 1000001;
            text-align: center;
        `;
        loader.innerHTML = `
            <div style="font-size: 40px; margin-bottom: 15px;">🤖</div>
            <div style="font-weight: 600;">Analyzing element...</div>
            <div style="font-size: 14px; margin-top: 8px; color: #aaa;">Powered by Gemini AI</div>
        `;
        document.body.appendChild(loader);
    }

    // Show explanation result
    showExplanation(explanation, element) {
        // Remove loader
        const loader = document.getElementById('jarvis-explanation-loader');
        if (loader) loader.remove();
        
        // Create explanation panel
        const panel = document.createElement('div');
        panel.id = 'jarvis-explanation-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            z-index: 1000002;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        `;
        
        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div style="font-size: 20px; font-weight: 600;">🧠 Element Explanation</div>
                <button id="jarvis-close-explanation" style="background: rgba(255,255,255,0.1); border: none; color: white; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 18px;">×</button>
            </div>
            <div style="background: rgba(0, 212, 255, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 3px solid #00d4ff;">
                <div style="font-size: 12px; color: #00d4ff; font-weight: 600; margin-bottom: 5px;">SELECTED ELEMENT</div>
                <code style="font-size: 13px; color: #aaa;">&lt;${element.tagName.toLowerCase()}&gt; ${element.className ? '.' + element.className.split(' ').join('.') : ''}</code>
            </div>
            <div style="line-height: 1.7; font-size: 15px; color: #ddd;">
                ${explanation.replace(/\n/g, '<br>')}
            </div>
            <div style="margin-top: 25px; text-align: right;">
                <button id="jarvis-select-another" style="padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; color: white; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">Select Another Element</button>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Add event listeners
        document.getElementById('jarvis-close-explanation').addEventListener('click', () => {
            panel.remove();
        });
        
        document.getElementById('jarvis-select-another').addEventListener('click', () => {
            panel.remove();
            this.enableSelectionMode();
        });
    }

    // Show error message
    showError(message) {
        // Remove loader
        const loader = document.getElementById('jarvis-explanation-loader');
        if (loader) loader.remove();
        
        const errorPanel = document.createElement('div');
        errorPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff4444;
            color: white;
            padding: 25px 35px;
            border-radius: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 15px;
            z-index: 1000002;
            box-shadow: 0 10px 40px rgba(255, 68, 68, 0.3);
        `;
        errorPanel.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 10px;">⚠️ Error</div>
            <div>${message}</div>
        `;
        document.body.appendChild(errorPanel);
        
        setTimeout(() => errorPanel.remove(), 4000);
    }
}

// Initialize element explainer
window.jarvisElementExplainer = new ElementExplainer();

// Add CSS animations
if (!document.getElementById('jarvis-explainer-styles')) {
    const style = document.createElement('style');
    style.id = 'jarvis-explainer-styles';
    style.textContent = `
        @keyframes jarvis-fade-in {
            from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
    `;
    document.head.appendChild(style);
}

console.log('Jarvis Element Explainer loaded');
