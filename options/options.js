// options.js - Handles options page for Jarvis extension

// Save Gemini API key
document.getElementById('save-gemini').addEventListener('click', async () => {
  const apiKey = document.getElementById('gemini-api-key').value;
  const statusDiv = document.getElementById('gemini-status');
  
  if (!apiKey) {
    statusDiv.className = 'status error';
    statusDiv.textContent = 'Please enter a Gemini API key';
    return;
  }
  
  try {
    await chrome.storage.sync.set({ geminiApiKey: apiKey });
    statusDiv.className = 'status success';
    statusDiv.textContent = 'Gemini API key saved successfully!';
    document.getElementById('gemini-api-key').value = '';
  } catch (error) {
    statusDiv.className = 'status error';
    statusDiv.textContent = 'Error saving API key: ' + error.message;
  }
});

// Save Gmail OAuth credentials
document.getElementById('save-gmail').addEventListener('click', async () => {
  const clientId = document.getElementById('gmail-client-id').value;
  const clientSecret = document.getElementById('gmail-client-secret').value;
  const statusDiv = document.getElementById('gmail-status');
  
  if (!clientId || !clientSecret) {
    statusDiv.className = 'status error';
    statusDiv.textContent = 'Please enter both Client ID and Client Secret';
    return;
  }
  
  try {
    await chrome.storage.sync.set({ 
      gmailClientId: clientId,
      gmailClientSecret: clientSecret 
    });
    statusDiv.className = 'status success';
    statusDiv.textContent = 'Gmail credentials saved successfully!';
  } catch (error) {
    statusDiv.className = 'status error';
    statusDiv.textContent = 'Error saving credentials: ' + error.message;
  }
});

// Authenticate with Gmail
document.getElementById('auth-gmail').addEventListener('click', async () => {
  const statusDiv = document.getElementById('gmail-status');
  
  try {
    // Get stored credentials
    const data = await chrome.storage.sync.get(['gmailClientId']);
    
    if (!data.gmailClientId) {
      statusDiv.className = 'status error';
      statusDiv.textContent = 'Please save Gmail credentials first';
      return;
    }
    
    // Initiate OAuth flow
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        statusDiv.className = 'status error';
        statusDiv.textContent = 'Authentication failed: ' + chrome.runtime.lastError.message;
        return;
      }
      
      if (token) {
        chrome.storage.sync.set({ gmailAuthToken: token });
        statusDiv.className = 'status success';
        statusDiv.textContent = 'Gmail authenticated successfully!';
        updateAuthStatus();
      }
    });
  } catch (error) {
    statusDiv.className = 'status error';
    statusDiv.textContent = 'Error during authentication: ' + error.message;
  }
});

// Update authentication status
async function updateAuthStatus() {
  const authInfo = document.getElementById('auth-info');
  
  try {
    const data = await chrome.storage.sync.get(['geminiApiKey', 'gmailAuthToken']);
    
    let statusText = 'Configuration Status:\n';
    
    if (data.geminiApiKey) {
      statusText += '✓ Gemini API key is configured\n';
    } else {
      statusText += '✗ Gemini API key is not configured\n';
    }
    
    if (data.gmailAuthToken) {
      statusText += '✓ Gmail is authenticated\n';
    } else {
      statusText += '✗ Gmail is not authenticated\n';
    }
    
    authInfo.textContent = statusText;
    authInfo.style.whiteSpace = 'pre-line';
  } catch (error) {
    authInfo.textContent = 'Error checking status: ' + error.message;
  }
}

// Load existing configuration on page load
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const data = await chrome.storage.sync.get(['gmailClientId']);
    
    if (data.gmailClientId) {
      document.getElementById('gmail-client-id').value = data.gmailClientId;
    }
    
    updateAuthStatus();
  } catch (error) {
    console.error('Error loading configuration:', error);
  }
});
