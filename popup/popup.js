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
    chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
        const tabId = tabs[0].id;
        const tabUrl = tabs[0].url;
        
        // AI-powered email command
        if (command.includes('send email to')) {
            await handleSendEmail(command);
        }
        // Page summarization command
        else if (command.includes('summarize this page')) {
            await handlePageSummarization(tabId);
        }
        // AI reply to email (Gmail only)
        else if (command.includes('reply to this email') && tabUrl.includes('mail.google.com')) {
            await handleEmailReply(tabId);
        }
        // Existing commands
        else if (command.includes('scroll down')) {
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

// Handle send email command
async function handleSendEmail(command) {
    try {
        statusText.textContent = 'Processing email command...';
        
        // Parse email command
        const emailMatch = command.match(/send email to ([\w\s@.]+?)(?:with subject (.+?))?(?:and message (.+))?$/);
        if (!emailMatch) {
            statusText.textContent = 'Could not parse email command. Try: "send email to [address] with subject [subject] and message [prompt]"';
            return;
        }
        
        const recipient = emailMatch[1].trim();
        const subject = emailMatch[2] ? emailMatch[2].trim() : 'Email from Jarvis';
        const messagePrompt = emailMatch[3] ? emailMatch[3].trim() : 'Write a brief email';
        
        // Get API keys from storage
        const data = await chrome.storage.sync.get(['geminiApiKey', 'gmailAuthToken']);
        
        if (!data.geminiApiKey) {
            statusText.textContent = 'Please configure Gemini API key in options';
            return;
        }
        
        if (!data.gmailAuthToken) {
            statusText.textContent = 'Please authenticate Gmail in options';
            return;
        }
        
        // Generate email content using Gemini
        const emailBody = await generateWithGemini(data.geminiApiKey, `Write a professional email with the following prompt: ${messagePrompt}`);
        
        // Send email using Gmail API
        await sendGmailEmail(data.gmailAuthToken, recipient, subject, emailBody);
        
        statusText.textContent = `Email sent to ${recipient}!`;
        setTimeout(() => {
            if (isListening) statusText.textContent = 'Listening...';
        }, 3000);
    } catch (error) {
        console.error('Email error:', error);
        statusText.textContent = 'Error sending email: ' + error.message;
    }
}

// Handle page summarization
async function handlePageSummarization(tabId) {
    try {
        statusText.textContent = 'Summarizing page...';
        
        // Get API key from storage
        const data = await chrome.storage.sync.get(['geminiApiKey']);
        
        if (!data.geminiApiKey) {
            statusText.textContent = 'Please configure Gemini API key in options';
            return;
        }
        
        // Get page content
        const results = await chrome.scripting.executeScript({
            target: {tabId: tabId},
            func: () => {
                return document.body.innerText.substring(0, 5000); // Limit to 5000 chars
            }
        });
        
        const pageContent = results[0].result;
        
        // Generate summary using Gemini
        const summary = await generateWithGemini(data.geminiApiKey, `Summarize the following content in 3-5 concise sentences:\n\n${pageContent}`);
        
        // Display summary
        alert(`Page Summary:\n\n${summary}`);
        
        statusText.textContent = 'Summary generated!';
        setTimeout(() => {
            if (isListening) statusText.textContent = 'Listening...';
        }, 2000);
    } catch (error) {
        console.error('Summarization error:', error);
        statusText.textContent = 'Error generating summary: ' + error.message;
    }
}

// Handle email reply with AI
async function handleEmailReply(tabId) {
    try {
        statusText.textContent = 'Generating AI reply...';
        
        // Get API key from storage
        const data = await chrome.storage.sync.get(['geminiApiKey']);
        
        if (!data.geminiApiKey) {
            statusText.textContent = 'Please configure Gemini API key in options';
            return;
        }
        
        // Get email content from Gmail
        const results = await chrome.scripting.executeScript({
            target: {tabId: tabId},
            func: () => {
                const emailBody = document.querySelector('.a3s.aiL');
                return emailBody ? emailBody.innerText : '';
            }
        });
        
        const emailContent = results[0].result;
        
        if (!emailContent) {
            statusText.textContent = 'Could not find email content';
            return;
        }
        
        // Generate reply using Gemini
        const reply = await generateWithGemini(data.geminiApiKey, `Write a professional reply to the following email:\n\n${emailContent}`);
        
        // Insert reply into compose box
        await chrome.scripting.executeScript({
            target: {tabId: tabId},
            func: (replyText) => {
                // Click reply button
                const replyBtn = document.querySelector('[aria-label*="Reply"]');
                if (replyBtn) replyBtn.click();
                
                // Wait for compose box and insert text
                setTimeout(() => {
                    const composeBox = document.querySelector('[aria-label="Message Body"]');
                    if (composeBox) {
                        composeBox.innerHTML = replyText.replace(/\n/g, '<br>');
                    }
                }, 1000);
            },
            args: [reply]
        });
        
        statusText.textContent = 'AI reply generated!';
        setTimeout(() => {
            if (isListening) statusText.textContent = 'Listening...';
        }, 2000);
    } catch (error) {
        console.error('Reply error:', error);
        statusText.textContent = 'Error generating reply: ' + error.message;
    }
}

// Generate text using Gemini API
async function generateWithGemini(apiKey, prompt) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        })
    });
    
    if (!response.ok) {
        throw new Error('Gemini API error: ' + response.statusText);
    }
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// Send email using Gmail API
async function sendGmailEmail(authToken, to, subject, body) {
    const email = [
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `To: ${to}`,
        `Subject: ${subject}`,
        '',
        body
    ].join('\r\n');
    
    const encodedEmail = btoa(unescape(encodeURIComponent(email)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    
    const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            raw: encodedEmail
        })
    });
    
    if (!response.ok) {
        throw new Error('Gmail API error: ' + response.statusText);
    }
    
    return await response.json();
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
