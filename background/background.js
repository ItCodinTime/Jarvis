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

    // Handle Gemini API chat requests
    if (request.action === 'chat') {
        handleGeminiChat(request.message, sendResponse);
        return true; // Keep message channel open for async response
    }

    // Handle Gemini API summarization requests
    if (request.action === 'summarize') {
        handleGeminiSummarization(request.text, sendResponse);
        return true;
    }

    // Handle email generation requests
    if (request.action === 'generateEmail') {
        handleGeminiEmailGeneration(request.prompt, sendResponse);
        return true;
    }
});

// Handle voice commands
function handleCommand(command, tab) {
    console.log('Executing command:', command);
    
    // Save to command history
    chrome.storage.local.get(['commandHistory'], (result) => {
        const history = result.commandHistory || [];
        history.push({
            command: command,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 50 commands
        if (history.length > 50) {
            history.shift();
        }
        
        chrome.storage.local.set({commandHistory: history});
    });
    
    // Execute the command on the active tab
    if (tab && tab.id) {
        chrome.tabs.sendMessage(tab.id, {
            action: 'processCommand',
            command: command
        });
    }
}

// Gemini API Integration Functions
async function handleGeminiChat(message, sendResponse) {
    try {
        // Get API key from storage
        chrome.storage.local.get(['geminiApiKey'], async (result) => {
            const apiKey = result.geminiApiKey;
            
            if (!apiKey) {
                sendResponse({
                    success: false,
                    error: 'Gemini API key not configured. Please set it in the options page.'
                });
                return;
            }

            // Make request to Gemini API
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
            
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: message
                            }]
                        }]
                    })
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error?.message || 'API request failed');
                }

                const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
                
                sendResponse({
                    success: true,
                    response: aiResponse
                });
            } catch (error) {
                sendResponse({
                    success: false,
                    error: `Gemini API error: ${error.message}`
                });
            }
        });
    } catch (error) {
        sendResponse({
            success: false,
            error: `Error: ${error.message}`
        });
    }
}

async function handleGeminiSummarization(text, sendResponse) {
    try {
        chrome.storage.local.get(['geminiApiKey'], async (result) => {
            const apiKey = result.geminiApiKey;
            
            if (!apiKey) {
                sendResponse({
                    success: false,
                    error: 'Gemini API key not configured'
                });
                return;
            }

            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
            const prompt = `Please provide a concise summary of the following text:\n\n${text}`;
            
            try {
                const response = await fetch(endpoint, {
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

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error?.message || 'API request failed');
                }

                const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary generated';
                
                sendResponse({
                    success: true,
                    summary: summary
                });
            } catch (error) {
                sendResponse({
                    success: false,
                    error: `Gemini API error: ${error.message}`
                });
            }
        });
    } catch (error) {
        sendResponse({
            success: false,
            error: `Error: ${error.message}`
        });
    }
}

async function handleGeminiEmailGeneration(prompt, sendResponse) {
    try {
        chrome.storage.local.get(['geminiApiKey'], async (result) => {
            const apiKey = result.geminiApiKey;
            
            if (!apiKey) {
                sendResponse({
                    success: false,
                    error: 'Gemini API key not configured'
                });
                return;
            }

            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
            const emailPrompt = `Generate a professional email based on this prompt: ${prompt}`;
            
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: emailPrompt
                            }]
                        }]
                    })
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error?.message || 'API request failed');
                }

                const emailContent = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No email generated';
                
                sendResponse({
                    success: true,
                    email: emailContent
                });
            } catch (error) {
                sendResponse({
                    success: false,
                    error: `Gemini API error: ${error.message}`
                });
            }
        });
    } catch (error) {
        sendResponse({
            success: false,
            error: `Error: ${error.message}`
        });
    }
}
