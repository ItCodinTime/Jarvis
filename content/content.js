// Content script for Jarvis Chrome Extension
// This script runs in the context of web pages

console.log('Jarvis content script loaded');

// Listen for messages from background script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Content script received message:', request);
    
    if (request.action === 'scroll') {
        handleScroll(request.direction);
        sendResponse({success: true});
    }
    
    if (request.action === 'click') {
        handleClick(request.selector);
        sendResponse({success: true});
    }
    
    if (request.action === 'type') {
        handleType(request.selector, request.text);
        sendResponse({success: true});
    }
    
    if (request.action === 'getPageInfo') {
        const pageInfo = {
            title: document.title,
            url: window.location.href,
            domain: window.location.hostname
        };
        sendResponse(pageInfo);
    }
    
    return true; // Keep message channel open for async response
});

// Handle scroll actions
function handleScroll(direction) {
    const scrollAmount = direction === 'down' ? 500 : -500;
    window.scrollBy({
        top: scrollAmount,
        behavior: 'smooth'
    });
}

// Handle click actions
function handleClick(selector) {
    try {
        const element = document.querySelector(selector);
        if (element) {
            element.click();
            console.log('Clicked element:', selector);
        } else {
            console.warn('Element not found:', selector);
        }
    } catch (error) {
        console.error('Error clicking element:', error);
    }
}

// Handle typing actions
function handleType(selector, text) {
    try {
        const element = document.querySelector(selector);
        if (element) {
            element.value = text;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('Typed into element:', selector);
        } else {
            console.warn('Element not found:', selector);
        }
    } catch (error) {
        console.error('Error typing into element:', error);
    }
}

// Visual feedback for voice commands
function showCommandFeedback(command) {
    const feedback = document.createElement('div');
    feedback.id = 'jarvis-feedback';
    feedback.textContent = `Jarvis: ${command}`;
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-family: 'Segoe UI', sans-serif;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => feedback.remove(), 300);
    }, 2000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize
console.log('Jarvis content script ready');
