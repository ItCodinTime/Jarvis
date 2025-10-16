// DOM elements
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusText = document.getElementById('statusText');
const indicator = document.getElementById('indicator');
const transcriptText = document.getElementById('transcriptText');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatMessages = document.getElementById('chatMessages');

// Web Speech API recognition object
let recognition;
let isListening = false;

// Initialize Web Speech API
function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
            console.log('Voice recognition started');
            isListening = true;
            updateUI('listening');
        };
        
        recognition.onresult = (event) => {
            const last = event.results.length - 1;
            const command = event.results[last][0].transcript.trim().toLowerCase();
            
            console.log('Command:', command);
            transcriptText.textContent = command;
            
            processCommand(command);
        };
        
        recognition.onerror = (event) => {
            console.error('Recognition error:', event.error);
            updateUI('ready');
        };
        
        recognition.onend = () => {
            isListening = false;
            updateUI('ready');
        };
    } else {
        console.error('Speech recognition not supported');
        statusText.textContent = 'Speech recognition not supported';
    }
}

// Process command (voice or text)
function processCommand(command) {
    command = command.toLowerCase().trim();
    
    chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
        if (tabs.length === 0) return;
        const tabId = tabs[0].id;
        
        // Navigation commands
        if (command.includes('open') || command.includes('go to') || command.includes('navigate')) {
            const url = extractUrl(command);
            if (url) {
                chrome.tabs.update(tabId, {url: url});
                addChatMessage('Assistant', `Opening ${url}`);
            }
        }
        // Scroll commands
        else if (command.includes('scroll down')) {
            executeScroll(tabId, 'down');
            addChatMessage('Assistant', 'Scrolling down');
        }
        else if (command.includes('scroll up')) {
            executeScroll(tabId, 'up');
            addChatMessage('Assistant', 'Scrolling up');
        }
        // Tab management
        else if (command.includes('new tab')) {
            chrome.tabs.create({});
            addChatMessage('Assistant', 'Opening new tab');
        }
        else if (command.includes('close tab')) {
            chrome.tabs.remove(tabId);
            addChatMessage('Assistant', 'Closing tab');
        }
        // AI-powered queries
        else if (command.includes('summarize') || command.includes('what is') || command.includes('explain')) {
            addChatMessage('Assistant', 'Processing your request...');
            try {
                const response = await queryGemini(command);
                addChatMessage('Assistant', response);
            } catch (error) {
                addChatMessage('Assistant', 'Sorry, I encountered an error processing your request.');
            }
        }
        else {
            addChatMessage('Assistant', `Command received: ${command}`);
        }
    });
}

// Extract URL from command
function extractUrl(command) {
    const urlMatch = command.match(/(?:open|go to|navigate)\s+(?:to\s+)?([\w.-]+\.\w+|\w+)/i);
    if (urlMatch) {
        let url = urlMatch[1];
        if (!url.startsWith('http')) {
            url = 'https://' + url;
        }
        return url;
    }
    return null;
}

// Query Gemini API
async function queryGemini(query) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            {action: 'queryGemini', query: query},
            (response) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else if (response && response.result) {
                    resolve(response.result);
                } else {
                    reject(new Error('No response from Gemini'));
                }
            }
        );
    });
}

// Execute scroll command
function executeScroll(tabId, direction) {
    const scrollAmount = direction === 'down' ? 500 : -500;
    chrome.scripting.executeScript({
        target: {tabId: tabId},
        func: (amount) => {
            window.scrollBy(0, amount);
        },
        args: [scrollAmount]
    });
}

// Add message to chat display
function addChatMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender.toLowerCase()}-message`;
    
    const senderSpan = document.createElement('span');
    senderSpan.className = 'message-sender';
    senderSpan.textContent = sender + ': ';
    
    const contentSpan = document.createElement('span');
    contentSpan.className = 'message-content';
    contentSpan.textContent = message;
    
    messageDiv.appendChild(senderSpan);
    messageDiv.appendChild(contentSpan);
    chatMessages.appendChild(messageDiv);
    
    // Auto-scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle text chat submission
function handleChatSubmit() {
    const message = chatInput.value.trim();
    if (message) {
        addChatMessage('You', message);
        processCommand(message);
        chatInput.value = '';
    }
}

// Update UI state
function updateUI(state) {
    if (state === 'listening') {
        statusText.textContent = 'Listening...';
        indicator.classList.add('listening');
        startBtn.disabled = true;
        stopBtn.disabled = false;
    } else if (state === 'ready') {
        statusText.textContent = 'Ready';
        indicator.classList.remove('listening');
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }
}

// Event listeners
startBtn.addEventListener('click', () => {
    if (recognition && !isListening) {
        recognition.start();
    }
});

stopBtn.addEventListener('click', () => {
    if (recognition && isListening) {
        isListening = false;
        recognition.stop();
        updateUI('ready');
        transcriptText.textContent = 'No commands yet...';
    }
});

// Chat input event listeners
chatSendBtn.addEventListener('click', handleChatSubmit);

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleChatSubmit();
    }
});

// Initialize on load
initSpeechRecognition();
addChatMessage('Assistant', 'Hello! I\'m Jarvis. You can type commands or use voice control. Try "open google.com" or "summarize this page".');
