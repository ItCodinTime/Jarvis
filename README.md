# 🎤 Jarvis - AI-Powered Voice-Controlled Browser Automation

An open-source Chrome extension inspired by ChromePilot that brings AI-powered voice-controlled browser automation to your fingertips using the Web Speech API, Google Gemini, and Gmail API.

## ✨ Features

- 🗣️ **Voice Commands**: Control your browser using natural voice commands
- 💬 **Text Chat Interface**: NEW! Type commands directly in the popup for quick interactions
- 🤖 **AI-Powered Email**: Send emails using voice with AI-generated content powered by Gemini
- 📄 **Page Summarization**: Get AI-generated summaries of any webpage
- 💬 **Smart Email Replies**: Generate AI-powered email replies on Gmail
- 🎯 **Smart Navigation**: Navigate pages, scroll, and interact with web elements hands-free
- 🚀 **Easy to Use**: Simple popup interface with visual feedback
- 🔒 **Privacy First**: Voice processing happens locally using Web Speech API
- ⚡ **Fast & Responsive**: Lightweight extension with minimal performance impact
- 🎨 **Beautiful UI**: Modern, gradient-styled interface with smooth animations
- ⚙️ **Configurable**: Easy-to-use options page for API key management

## 💬 Text Chat Interface (NEW!)

In addition to voice control, Jarvis now includes a text chat interface in the popup for quick, typed interactions. This feature is perfect when you're in a quiet environment or prefer typing over speaking.

### How to Use Text Chat:

1. Click the Jarvis extension icon to open the popup
2. Scroll down to the "💬 Chat with Jarvis" section
3. Type your command or question in the text input area
4. Press Enter or click the "Send" button
5. View responses and results in the chat message area above

### Text Chat Capabilities:

- **All voice commands work via text**: Simply type the same commands you would speak
- **AI-powered queries**: Ask questions, request summaries, or have conversations
- **Navigation commands**: "open google.com", "scroll down", "new tab", etc.
- **AI content generation**: "summarize this page", "explain [topic]", etc.
- **Persistent chat history**: See your conversation history within the session
- **Real-time responses**: Get immediate feedback for navigation commands

### Example Text Chat Commands:

```
open youtube.com
scroll down
summarize this page
what is machine learning?
new tab
go back
refresh
```

### Benefits of Text Chat:

✅ Use Jarvis in quiet environments (libraries, offices, etc.)
✅ Faster input for complex commands or URLs
✅ Visual chat history to review previous commands
✅ More precise command entry (no speech recognition errors)
✅ Works alongside voice commands - use whichever you prefer!

## 📋 Available Commands

All commands work with both voice input and text chat!

### Basic Navigation Commands

| Command | Action |
|---------|--------|
| "scroll down" | Scroll the page down |
| "scroll up" | Scroll the page up |
| "go back" | Navigate to the previous page |
| "go forward" | Navigate to the next page |
| "refresh" or "reload" | Reload the current page |
| "new tab" | Open a new tab |
| "close tab" | Close the current tab |
| "search for [query]" | Search on Google for the query |
| "open [website]" or "go to [website]" | Navigate to a specific website |

### 🆕 AI-Powered Commands

| Command | Action | Requirements |
|---------|--------|-------------|
| "send email to [address] with subject [subject] and message [prompt]" | Send an AI-generated email | Gemini API key, Gmail authentication |
| "summarize this page" | Generate AI summary of current page | Gemini API key |
| "reply to this email using AI" | Generate AI reply in Gmail compose box | Gemini API key, Gmail tab |
| "what is [topic]" or "explain [topic]" | Get AI explanation of any topic | Gemini API key |

#### Example Commands:

```
"send email to john@example.com with subject project update and message write about our recent progress"
"summarize this page"
"reply to this email using AI"
"what is quantum computing?"
"explain machine learning in simple terms"
"open github.com"
"scroll down"
"new tab"
```

## 🚀 Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/ItCodinTime/Jarvis.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the Jarvis directory

5. The Jarvis icon should appear in your browser toolbar

## ⚙️ Configuration

### Setting up Gemini API (Required for AI features)

1. Get your free Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. Click the Jarvis extension icon

3. Click the settings/options button or right-click the extension icon → Options

4. Enter your Gemini API key in the "API Keys" section

5. Click "Save Settings"

### Setting up Gmail API (Optional - for email features)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)

2. Create a new project or select an existing one

3. Enable the Gmail API

4. Create OAuth 2.0 credentials:
   - Application type: Chrome Extension
   - Add your extension ID

5. Update `manifest.json` with your OAuth credentials

6. First time using email features, you'll be prompted to authorize

## 🎯 Usage Tips

### Voice Control:

- Speak clearly and at a moderate pace
- Wait for the "Listening..." indicator before speaking
- Use natural language - Jarvis understands context
- You can chain multiple commands: "Open Gmail and summarize the first email"

### Text Chat:

- Type commands just as you would speak them
- Use Shift+Enter for multi-line input (if needed for complex queries)
- Press Enter to send (or click the Send button)
- View chat history to reference previous commands and responses
- Combine with voice control for maximum flexibility

### AI Features:

- For best results, be specific in your requests
- The AI can understand context from the current page
- Email generation works best with detailed prompts
- Page summarization works on any webpage with readable content

## 🛠️ Technical Stack

- **Web Speech API**: For voice recognition (works offline)
- **Google Gemini API**: For AI-powered content generation
- **Gmail API**: For email integration
- **Chrome Extensions API**: For browser automation
- **Modern JavaScript**: ES6+ features
- **CSS3**: Gradient styling and animations

## 📁 Project Structure

```
Jarvis/
├── background/
│   └── background.js       # Background service worker for API calls
├── content/
│   └── content.js          # Content script for page interaction
├── options/
│   ├── options.html        # Options page UI
│   ├── options.css         # Options page styling
│   └── options.js          # Options page logic
├── popup/
│   ├── popup.html          # Popup interface with voice & chat
│   ├── popup.css           # Popup styling with chat interface
│   └── popup.js            # Popup logic with chat functionality
├── manifest.json           # Extension configuration
└── README.md              # This file
```

## 🔧 Permissions Used

- `activeTab`: To interact with the current page
- `tabs`: For tab management and navigation
- `storage`: To save user preferences and API keys
- `scripting`: To execute scripts on web pages
- `identity`: For OAuth authentication (Gmail)
- `https://generativelanguage.googleapis.com/*`: For Gemini API access
- `https://www.googleapis.com/*`: For Gmail API access

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [ChromePilot](https://github.com/topics/chromepilot) and similar voice automation projects
- Built with the amazing [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- Powered by [Google Gemini](https://ai.google.dev/) for AI content generation
- Icons and design inspired by modern UI/UX trends

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/ItCodinTime/Jarvis/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ItCodinTime/Jarvis/discussions)

## ⚠️ Troubleshooting

### Voice recognition not working

1. Ensure your browser supports Web Speech API (Chrome/Edge/Brave)
2. Check that microphone permissions are granted
3. Try refreshing the extension
4. Check browser console for errors

### Text chat not working

1. Ensure the extension popup is fully loaded
2. Try typing simple commands first ("new tab", "scroll down")
3. Check browser console for JavaScript errors
4. Reload the extension from `chrome://extensions/`

### Commands not executing

1. Ensure you're speaking or typing clearly
2. Check that the command syntax matches the available commands
3. Verify the extension has necessary permissions
4. Try reloading the extension

### AI features not working

1. Verify Gemini API key is configured in options
2. Check API key is valid and has not expired
3. Ensure you have internet connection
4. Check browser console for API errors
5. Verify host permissions are granted for API domains

### Gmail authentication failing

1. Ensure OAuth credentials are correctly configured
2. Check that Gmail API is enabled in Google Cloud Console
3. Verify extension ID is added to OAuth credentials
4. Try removing and re-authenticating
5. Check that you have necessary Gmail permissions

### Extension icon not showing

1. Make sure you've added the icon files (icon16.png, icon48.png, icon128.png) to the `icons/` directory
2. Reload the extension from `chrome://extensions/`

---

**Made with ❤️ by the Jarvis team**

*Empower your browsing experience with AI-powered voice control and text chat!*
