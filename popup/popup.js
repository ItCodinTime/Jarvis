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
      
      // Send command with animation
      isProcessing = true;
      updateUI('processing');
      animateIndicator('spin');
      
      addChatMessage('You', command);
      
      setTimeout(() => {
        chrome.runtime.sendMessage(
          { action: 'executeCommand', command: command },
          (response) => {
            isProcessing = false;
            updateUI('listening');
            animateIndicator('pulse');
            
            if (response && response.success) {
              addChatMessage('Assistant', `Command "${command}" executed successfully!`);
            } else {
              addChatMessage('Assistant', `Sorry, I couldn't execute "${command}"`);
            }
          }
        );
      }, TIMING.standard);
    };
    
    recognition.onend = () => {
      console.log('Voice recognition ended');
      isListening = false;
      updateUI('ready');
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      isListening = false;
      updateUI('error');
      animateIndicator('error');
      
      let errorMsg = 'An error occurred.';
      if (event.error === 'no-speech') {
        errorMsg = 'No speech detected. Please try again.';
      } else if (event.error === 'not-allowed') {
        errorMsg = 'Microphone access denied. Please allow microphone access.';
      }
      
      // Error animation
      statusText.style.transition = `color ${TIMING.standard}ms ${TIMING.ease}`;
      statusText.style.color = '#ef4444';
      setTimeout(() => {
        statusText.style.color = '';
      }, TIMING.slow * 2);
      
      addChatMessage('Assistant', errorMsg);
    };
  } else {
    console.error('Speech recognition not supported');
    statusText.textContent = 'Speech recognition not supported in this browser';
    startBtn.disabled = true;
  }
}

// Animate indicator with different patterns
function animateIndicator(type) {
  indicator.className = ''; // Reset
  setTimeout(() => {
    indicator.className = type;
  }, 10);
}

// Update UI based on state with smooth animations
function updateUI(state) {
  const transitions = `all ${TIMING.standard}ms ${TIMING.smooth}`;
  startBtn.style.transition = transitions;
  stopBtn.style.transition = transitions;
  statusText.style.transition = transitions;
  indicator.style.transition = transitions;
  
  switch(state) {
    case 'ready':
      startBtn.disabled = false;
      stopBtn.disabled = true;
      statusText.textContent = 'Ready to listen';
      statusText.style.color = '#10b981';
      indicator.style.opacity = '0.5';
      animateIndicator('idle');
      break;
    case 'listening':
      startBtn.disabled = true;
      stopBtn.disabled = false;
      statusText.textContent = 'Listening...';
      statusText.style.color = '#3b82f6';
      indicator.style.opacity = '1';
      break;
    case 'processing':
      startBtn.disabled = true;
      stopBtn.disabled = true;
      statusText.textContent = 'Processing...';
      statusText.style.color = '#f59e0b';
      indicator.style.opacity = '1';
      break;
    case 'error':
      startBtn.disabled = false;
      stopBtn.disabled = true;
      statusText.textContent = 'Error occurred';
      statusText.style.color = '#ef4444';
      indicator.style.opacity = '0.5';
      break;
  }
}

// Add message to chat with smooth entrance animation
function addChatMessage(sender, text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender.toLowerCase()}`;
  
  const senderSpan = document.createElement('strong');
  senderSpan.textContent = sender + ':';
  
  const textSpan = document.createElement('span');
  textSpan.textContent = ' ' + text;
  
  messageDiv.appendChild(senderSpan);
  messageDiv.appendChild(textSpan);
  
  // Entrance animation
  messageDiv.style.opacity = '0';
  messageDiv.style.transform = 'translateY(10px)';
  chatMessages.appendChild(messageDiv);
  
  setTimeout(() => {
    messageDiv.style.transition = `all ${TIMING.standard}ms ${TIMING.smooth}`;
    messageDiv.style.opacity = '1';
    messageDiv.style.transform = 'translateY(0)';
    
    // Smooth scroll
    chatMessages.scrollTo({
      top: chatMessages.scrollHeight,
      behavior: 'smooth'
    });
  }, 10);
}

// Handle chat input submit
function handleChatSubmit() {
  const text = chatInput.value.trim();
  if (text) {
    // Input animation
    chatInput.style.transition = `transform ${TIMING.quick}ms ${TIMING.ease}`;
    chatInput.style.transform = 'scale(0.98)';
    setTimeout(() => {
      chatInput.style.transform = 'scale(1)';
    }, TIMING.quick);
    
    addChatMessage('You', text);
    
    chrome.runtime.sendMessage(
      { action: 'executeCommand', command: text },
      (response) => {
        if (response && response.success) {
          addChatMessage('Assistant', `Command "${text}" executed successfully!`);
        } else {
          addChatMessage('Assistant', `Sorry, I couldn't execute "${text}"`);
        }
      }
    );
    
    // Clear with fade animation
    chatInput.style.transition = `opacity ${TIMING.quick}ms ${TIMING.ease}`;
    chatInput.style.opacity = '0';
    setTimeout(() => {
      chatInput.value = '';
      chatInput.style.opacity = '1';
    }, TIMING.quick);
  }
}

// Start button handler
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

// Stop button handler
stopBtn.addEventListener('click', () => {
  if (recognition && isListening) {
    // Button feedback animation
    stopBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      stopBtn.style.transition = `transform ${TIMING.standard}ms ${TIMING.bounce}`;
      stopBtn.style.transform = 'scale(1)';
      
      recognition.stop();
      
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
