// DOM elements
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusText = document.getElementById('statusText');
const indicator = document.getElementById('indicator');
const transcriptText = document.getElementById('transcriptText');

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
            console.error('Speech recognition error:', event.error);
            statusText.textContent = `Error: ${event.error}`;
        };
        
        recognition.onend = () => {
            console.log('Voice recognition ended');
            if (isListening) {
                recognition.start();
            }
        };
    } else {
        alert('Speech recognition not supported in this browser.');
    }
}

// Process voice commands
function processCommand(command) {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const tabId = tabs[0].id;
        
        if (command.includes('scroll down')) {
            executeScroll(tabId, 'down');
        } else if (command.includes('scroll up')) {
            executeScroll(tabId, 'up');
        } else if (command.includes('go back')) {
            chrome.tabs.goBack(tabId);
        } else if (command.includes('go forward')) {
            chrome.tabs.goForward(tabId);
        } else if (command.includes('refresh') || command.includes('reload')) {
            chrome.tabs.reload(tabId);
        } else if (command.includes('new tab')) {
            chrome.tabs.create({});
        } else if (command.includes('close tab')) {
            chrome.tabs.remove(tabId);
        } else if (command.includes('search for')) {
            const query = command.replace('search for', '').trim();
            if (query) {
                chrome.tabs.create({url: `https://www.google.com/search?q=${encodeURIComponent(query)}`});
            }
        } else {
            statusText.textContent = 'Command not recognized';
            setTimeout(() => {
                if (isListening) statusText.textContent = 'Listening...';
            }, 2000);
        }
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

// Initialize on load
initSpeechRecognition();
