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
let isProcessing = false;

// Animation timing constants (Apple-style)
const TIMING = {
  quick: 200,
  standard: 300,
  slow: 500,
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: 'cubic-bezier(0.4, 0, 0.6, 1)',
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
};

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
      animateIndicator('pulse');
    };
    
    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.trim().toLowerCase();
      
      console.log('Command:', command);
      
      // Animate transcript update
      transcriptText.style.transition = `opacity ${TIMING.quick}ms ${TIMING.ease}`;
      transcriptText.style.opacity = '0';
      
      setTimeout(() => {
        transcriptText.textContent = command;
        transcriptText.style.opacity = '1';
      }, TIMING.quick);
      
      processCommand(command);
    };
    
    recognition.onerror = (event) => {
      console.error('Recognition error:', event.error);
      showToast('error', `Voice recognition error: ${event.error}`);
      updateUI('ready');
    };
    
    recognition.onend = () => {
      isListening = false;
      updateUI('ready');
      animateIndicator('fade');
    };
  } else {
    console.error('Speech recognition not supported');
    statusText.textContent = 'Speech recognition not supported';
    showToast('error', 'Your browser does not support speech recognition');
  }
}

// Process command (voice or text) with enhanced feedback
function processCommand(command) {
  if (isProcessing) return;
  
  isProcessing = true;
  showLoader(true);
  
  // Add user message with smooth animation
  addChatMessage('You', command);
  
  // Simulate processing delay
  setTimeout(() => {
    chrome.runtime.sendMessage(
      { action: 'processCommand', command: command },
      (response) => {
        showLoader(false);
        isProcessing = false;
        
        if (response && response.success) {
          addChatMessage('Assistant', response.message || 'Command executed successfully!');
          showToast('success', '✓ Command completed');
        } else {
          const errorMsg = response?.message || 'Failed to execute command';
          addChatMessage('Assistant', errorMsg);
          showToast('error', `✗ ${errorMsg}`);
        }
      }
    );
  }, TIMING.quick);
}

// Add chat message with enhanced animation
function addChatMessage(sender, text) {
  const bubble = document.createElement('div');
  bubble.className = `bubble ${sender === 'You' ? 'user' : 'ai'}`;
  bubble.textContent = text;
  
  // Set initial state for animation
  bubble.style.opacity = '0';
  bubble.style.transform = 'translateY(20px) scale(0.95)';
  
  chatMessages.appendChild(bubble);
  
  // Smooth scroll to bottom
  requestAnimationFrame(() => {
    chatMessages.scrollTo({
      top: chatMessages.scrollHeight,
      behavior: 'smooth'
    });
  });
  
  // Trigger entrance animation
  setTimeout(() => {
    bubble.style.transition = `all ${TIMING.standard}ms ${TIMING.bounce}`;
    bubble.style.opacity = '1';
    bubble.style.transform = 'translateY(0) scale(1)';
  }, 50);
}

// Show/hide loader with smooth transitions
function showLoader(show) {
  let loader = document.querySelector('.loader-container');
  
  if (show) {
    if (!loader) {
      loader = document.createElement('div');
      loader.className = 'loader-container';
      loader.innerHTML = `
        <div class="loader"></div>
        <span class="small" style="margin-left: 8px;">Thinking...</span>
      `;
      loader.style.opacity = '0';
      chatMessages.appendChild(loader);
      
      // Smooth fade-in
      setTimeout(() => {
        loader.style.transition = `opacity ${TIMING.standard}ms ${TIMING.smooth}`;
        loader.style.opacity = '1';
      }, 50);
    }
  } else {
    if (loader) {
      loader.style.transition = `opacity ${TIMING.quick}ms ${TIMING.ease}`;
      loader.style.opacity = '0';
      
      setTimeout(() => {
        if (loader && loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, TIMING.quick);
    }
  }
  
  // Smooth scroll to show loader
  if (show) {
    setTimeout(() => {
      chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  }
}

// Show toast notification with smooth animation
function showToast(type, message, duration = 2000) {
  const existingToast = document.querySelector('.feedback-toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = `feedback-toast feedback-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 18px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    color: white;
    background: ${type === 'success' ? 'linear-gradient(135deg, #34c759, #30b350)' : 'linear-gradient(135deg, #ff453a, #ff3b30)'};
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(20px);
    z-index: 10000;
    opacity: 0;
    transform: translateY(-20px);
    transition: all ${TIMING.standard}ms ${TIMING.bounce};
  `;
  
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 50);
  
  // Animate out and remove
  setTimeout(() => {
    toast.style.transition = `all ${TIMING.standard}ms ${TIMING.ease}`;
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => toast.remove(), TIMING.standard);
  }, duration);
}

// Animate indicator element
function animateIndicator(type) {
  if (!indicator) return;
  
  if (type === 'pulse') {
    indicator.style.animation = 'pulse 1.5s ease-in-out infinite';
  } else if (type === 'fade') {
    indicator.style.transition = `opacity ${TIMING.standard}ms ${TIMING.ease}`;
    indicator.style.animation = '';
  }
}

// Handle text chat submission with smooth animations
function handleChatSubmit() {
  const message = chatInput.value.trim();
  if (message && !isProcessing) {
    // Smooth input clear animation
    chatInput.style.transition = `opacity ${TIMING.quick}ms ${TIMING.ease}`;
    chatInput.style.opacity = '0.5';
    
    setTimeout(() => {
      processCommand(message);
      chatInput.value = '';
      chatInput.style.opacity = '1';
      chatInput.focus();
    }, TIMING.quick);
  }
}

// Update UI state with smooth transitions
function updateUI(state) {
  const transition = `all ${TIMING.standard}ms ${TIMING.smooth}`;
  
  if (state === 'listening') {
    statusText.textContent = 'Listening...';
    statusText.style.color = 'var(--accent)';
    statusText.style.transition = transition;
    
    indicator.classList.add('listening');
    indicator.style.transition = transition;
    
    startBtn.disabled = true;
    stopBtn.disabled = false;
    
    // Button animation
    startBtn.style.transition = transition;
    startBtn.style.opacity = '0.6';
    startBtn.style.transform = 'scale(0.98)';
  } else if (state === 'ready') {
    statusText.textContent = 'Ready';
    statusText.style.color = 'var(--text)';
    statusText.style.transition = transition;
    
    indicator.classList.remove('listening');
    indicator.style.transition = transition;
    
    startBtn.disabled = false;
    stopBtn.disabled = true;
    
    // Button animation
    startBtn.style.transition = transition;
    startBtn.style.opacity = '1';
    startBtn.style.transform = 'scale(1)';
  }
}

// Event listeners with enhanced animations
startBtn.addEventListener('click', () => {
  if (recognition && !isListening) {
    // Button feedback animation
    startBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      startBtn.style.transition = `transform ${TIMING.standard}ms ${TIMING.bounce}`;
      startBtn.style.transform = 'scale(1)';
      recognition.start();
    }, 100);
  }
});

stopBtn.addEventListener('click', () => {
  if (recognition && isListening) {
    // Button feedback animation
    stopBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      stopBtn.style.transition = `transform ${TIMING.standard}ms ${TIMING.bounce}`;
      stopBtn.style.transform = 'scale(1)';
      
      isListening = false;
      recognition.stop();
      updateUI('ready');
      
      // Animate transcript clear
      transcriptText.style.transition = `opacity ${TIMING.quick}ms ${TIMING.ease}`;
      transcriptText.style.opacity = '0';
      setTimeout(() => {
        transcriptText.textContent = 'No commands yet...';
        transcriptText.style.opacity = '1';
      }, TIMING.quick);
    }, 100);
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

// Add focus animations for input
chatInput.addEventListener('focus', () => {
  chatInput.style.transition = `all ${TIMING.standard}ms ${TIMING.smooth}`;
  chatInput.style.transform = 'scale(1.01)';
});

chatInput.addEventListener('blur', () => {
  chatInput.style.transition = `all ${TIMING.standard}ms ${TIMING.smooth}`;
  chatInput.style.transform = 'scale(1)';
});

// Initialize on load
initSpeechRecognition();

// Show welcome message with staggered animation
setTimeout(() => {
  addChatMessage('Assistant', 'Hello! I\'m Jarvis. You can type commands or use voice control. Try "open google.com" or "summarize this page".');
}, TIMING.standard);

// Add smooth entrance animation for UI elements
window.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.container > *');
  elements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      el.style.transition = `all ${TIMING.standard}ms ${TIMING.smooth}`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, index * 50 + 100);
  });
});
