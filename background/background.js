// Background service worker for Jarvis Chrome Extension

// Initialize extension on install
chrome.runtime.onInstalled.addListener(() => {
    console.log('Jarvis extension installed');
    
    // Set default settings
    chrome.storage.local.set({
        enabled: true,
        language: 'en-US',
        commandHistory: []
    });
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'executeCommand') {
        handleCommand(request.command, sender.tab);
        sendResponse({success: true});
    }
    
    if (request.action === 'getSettings') {
        chrome.storage.local.get(['enabled', 'language'], (result) => {
            sendResponse(result);
        });
        return true; // Keep message channel open for async response
    }
    
    if (request.action === 'updateSettings') {
        chrome.storage.local.set(request.settings, () => {
            sendResponse({success: true});
        });
        return true;
    }
});

// Handle voice commands
function handleCommand(command, tab) {
    console.log('Handling command:', command);
    
    // Log command to history
    chrome.storage.local.get(['commandHistory'], (result) => {
        const history = result.commandHistory || [];
        history.push({
            command: command,
            timestamp: new Date().toISOString(),
            tabUrl: tab.url
        });
        
        // Keep only last 50 commands
        if (history.length > 50) {
            history.shift();
        }
        
        chrome.storage.local.set({commandHistory: history});
    });
}

// Context menu integration (optional)
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'jarvis-activate',
        title: 'Activate Jarvis Voice Control',
        contexts: ['page']
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'jarvis-activate') {
        chrome.action.openPopup();
    }
});

// Keep service worker alive
let keepAliveInterval;

function keepAlive() {
    if (keepAliveInterval) clearInterval(keepAliveInterval);
    keepAliveInterval = setInterval(() => {
        chrome.runtime.getPlatformInfo(() => {
            // Just keeping the service worker alive
        });
    }, 20000);
}

keepalive();

// Listen for extension icon click
chrome.action.onClicked.addListener((tab) => {
    console.log('Extension icon clicked');
});
