// options.js - Handles options page for Jarvis extension with enhanced feedback and animations

// Animation timing constants (Apple-style)
const TIMING = {
  quick: 200,
  standard: 300,
  slow: 500,
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
};

// Helper function to show status with smooth animation
function showStatus(statusDiv, type, message, duration = 4000) {
  // Clear previous status
  statusDiv.style.opacity = '0';
  statusDiv.style.transform = 'translateY(10px)';
  
  setTimeout(() => {
    statusDiv.className = `status ${type}`;
    statusDiv.textContent = message;
    statusDiv.style.transition = `all ${TIMING.standard}ms ${TIMING.bounce}`;
    statusDiv.style.opacity = '1';
    statusDiv.style.transform = 'translateY(0)';
    
    // Auto-hide after duration
    if (duration > 0) {
      setTimeout(() => {
        statusDiv.style.transition = `all ${TIMING.standard}ms ${TIMING.ease}`;
        statusDiv.style.opacity = '0';
        statusDiv.style.transform = 'translateY(-10px)';
      }, duration);
    }
  }, 50);
}

// Helper function to animate button click
function animateButton(button) {
  button.style.transform = 'scale(0.95)';
  button.disabled = true;
  
  setTimeout(() => {
    button.style.transition = `transform ${TIMING.standard}ms ${TIMING.bounce}`;
    button.style.transform = 'scale(1)';
    button.disabled = false;
  }, TIMING.quick);
}

// Helper function to animate input clear
function animateInputClear(input) {
  input.style.transition = `opacity ${TIMING.quick}ms ${TIMING.ease}`;
  input.style.opacity = '0.5';
  
  setTimeout(() => {
    input.value = '';
    input.style.opacity = '1';
  }, TIMING.quick);
}

// Save Gemini API key with enhanced feedback
document.getElementById('save-gemini').addEventListener('click', async (e) => {
  const button = e.target;
  const apiKey = document.getElementById('gemini-api-key').value;
  const statusDiv = document.getElementById('gemini-status');
  const input = document.getElementById('gemini-api-key');
  
  if (!apiKey) {
    showStatus(statusDiv, 'error', '⚠️ Please enter a Gemini API key', 3000);
    return;
  }
  
  animateButton(button);
  
  // Show loading state
  showStatus(statusDiv, 'info', '⏳ Saving Gemini API key...', 0);
  
  try {
    await chrome.storage.sync.set({ geminiApiKey: apiKey });
    
    setTimeout(() => {
      showStatus(statusDiv, 'success', '✓ Gemini API key saved successfully!', 4000);
      animateInputClear(input);
      updateAuthStatus();
    }, TIMING.standard);
  } catch (error) {
    setTimeout(() => {
      showStatus(statusDiv, 'error', `✗ Error saving API key: ${error.message}`, 5000);
    }, TIMING.standard);
  }
});

// Save Gmail OAuth credentials with enhanced feedback
document.getElementById('save-gmail').addEventListener('click', async (e) => {
  const button = e.target;
  const clientId = document.getElementById('gmail-client-id').value;
  const clientSecret = document.getElementById('gmail-client-secret').value;
  const statusDiv = document.getElementById('gmail-status');
  
  if (!clientId || !clientSecret) {
    showStatus(statusDiv, 'error', '⚠️ Please enter both Client ID and Client Secret', 3000);
    return;
  }
  
  animateButton(button);
  
  // Show loading state
  showStatus(statusDiv, 'info', '⏳ Saving Gmail credentials...', 0);
  
  try {
    await chrome.storage.sync.set({ 
      gmailClientId: clientId,
      gmailClientSecret: clientSecret 
    });
    
    setTimeout(() => {
      showStatus(statusDiv, 'success', '✓ Gmail credentials saved successfully!', 4000);
      
      // Animate secret input clear only
      const secretInput = document.getElementById('gmail-client-secret');
      animateInputClear(secretInput);
      
      updateAuthStatus();
    }, TIMING.standard);
  } catch (error) {
    setTimeout(() => {
      showStatus(statusDiv, 'error', `✗ Error saving credentials: ${error.message}`, 5000);
    }, TIMING.standard);
  }
});

// Authenticate with Gmail with enhanced feedback
document.getElementById('auth-gmail').addEventListener('click', async (e) => {
  const button = e.target;
  const statusDiv = document.getElementById('gmail-status');
  
  animateButton(button);
  
  // Show loading state
  showStatus(statusDiv, 'info', '⏳ Opening authentication window...', 0);
  
  try {
    const response = await chrome.runtime.sendMessage({ action: 'authenticateGmail' });
    
    setTimeout(() => {
      if (response && response.success) {
        // Store token if provided
        if (response.token) {
          chrome.storage.sync.set({ gmailAuthToken: response.token });
        }
        
        showStatus(statusDiv, 'success', '✓ Gmail authenticated successfully!', 4000);
        updateAuthStatus();
      } else {
        showStatus(statusDiv, 'error', `✗ Authentication failed: ${response?.message || 'Unknown error'}`, 5000);
      }
    }, TIMING.standard);
  } catch (error) {
    setTimeout(() => {
      showStatus(statusDiv, 'error', `✗ Error during authentication: ${error.message}`, 5000);
    }, TIMING.standard);
  }
});

// Update authentication status with smooth animation
async function updateAuthStatus() {
  const authInfo = document.getElementById('auth-info');
  
  // Fade out current status
  authInfo.style.transition = `opacity ${TIMING.quick}ms ${TIMING.ease}`;
  authInfo.style.opacity = '0';
  
  setTimeout(async () => {
    try {
      const data = await chrome.storage.sync.get(['geminiApiKey', 'gmailAuthToken']);
      
      let statusText = '🔐 Configuration Status:\n';
      
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
      
      // Fade in new status
      setTimeout(() => {
        authInfo.style.transition = `opacity ${TIMING.standard}ms ${TIMING.ease}`;
        authInfo.style.opacity = '1';
      }, 50);
    } catch (error) {
      authInfo.textContent = `⚠️ Error checking status: ${error.message}`;
      
      setTimeout(() => {
        authInfo.style.transition = `opacity ${TIMING.standard}ms ${TIMING.ease}`;
        authInfo.style.opacity = '1';
      }, 50);
    }
  }, TIMING.quick);
}

// Add smooth focus animations for inputs
function addInputAnimations() {
  const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
  
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.style.transition = `all ${TIMING.standard}ms ${TIMING.ease}`;
    });
    
    input.addEventListener('blur', () => {
      input.style.transition = `all ${TIMING.standard}ms ${TIMING.ease}`;
    });
  });
}

// Add button hover effects
function addButtonAnimations() {
  const buttons = document.querySelectorAll('button');
  
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      if (!button.disabled) {
        button.style.transition = `all ${TIMING.quick}ms ${TIMING.ease}`;
      }
    });
    
    button.addEventListener('mouseleave', () => {
      if (!button.disabled) {
        button.style.transition = `all ${TIMING.quick}ms ${TIMING.ease}`;
      }
    });
  });
}

// Load existing configuration on page load with smooth animations
window.addEventListener('DOMContentLoaded', async () => {
  // Add input and button animations
  addInputAnimations();
  addButtonAnimations();
  
  // Show initial loading state
  const authInfo = document.getElementById('auth-info');
  authInfo.textContent = '⏳ Checking authentication status...';
  authInfo.style.opacity = '0';
  
  setTimeout(() => {
    authInfo.style.transition = `opacity ${TIMING.standard}ms ${TIMING.ease}`;
    authInfo.style.opacity = '1';
  }, TIMING.quick);
  
  try {
    const data = await chrome.storage.sync.get(['gmailClientId']);
    
    if (data.gmailClientId) {
      const clientIdInput = document.getElementById('gmail-client-id');
      clientIdInput.value = data.gmailClientId;
      
      // Animate input population
      clientIdInput.style.opacity = '0';
      setTimeout(() => {
        clientIdInput.style.transition = `opacity ${TIMING.standard}ms ${TIMING.ease}`;
        clientIdInput.style.opacity = '1';
      }, TIMING.quick);
    }
    
    // Update authentication status with delay for smooth loading
    setTimeout(() => {
      updateAuthStatus();
    }, TIMING.standard);
  } catch (error) {
    console.error('Error loading configuration:', error);
    authInfo.textContent = `⚠️ Error loading configuration: ${error.message}`;
  }
});
