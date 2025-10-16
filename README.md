# 🎤 Jarvis - AI-Powered Voice-Controlled Browser Automation

An open-source Chrome extension inspired by ChromePilot that brings AI-powered voice-controlled browser automation to your fingertips using the Web Speech API, Google Gemini, and Gmail API.

## ✨ Features

- 🗣️ **Voice Commands**: Control your browser using natural voice commands
- 🤖 **AI-Powered Email**: Send emails using voice with AI-generated content powered by Gemini
- 📄 **Page Summarization**: Get AI-generated summaries of any webpage
- 💬 **Smart Email Replies**: Generate AI-powered email replies on Gmail
- 🎯 **Smart Navigation**: Navigate pages, scroll, and interact with web elements hands-free
- 🚀 **Easy to Use**: Simple popup interface with visual feedback
- 🔒 **Privacy First**: Voice processing happens locally using Web Speech API
- ⚡ **Fast & Responsive**: Lightweight extension with minimal performance impact
- 🎨 **Beautiful UI**: Modern, gradient-styled interface with smooth animations
- ⚙️ **Configurable**: Easy-to-use options page for API key management

## 📋 Available Commands

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

### 🆕 AI-Powered Commands

| Command | Action | Requirements |
|---------|--------|-------------|
| "send email to [address] with subject [subject] and message [prompt]" | Send an AI-generated email | Gemini API key, Gmail authentication |
| "summarize this page" | Generate AI summary of current page | Gemini API key |
| "reply to this email using AI" | Generate AI reply in Gmail compose box | Gemini API key, Gmail tab |

#### Example Commands:

```
"send email to john@example.com with subject project update and message write about our recent progress"
"summarize this page"
"reply to this email using AI"
```

## 🚀 Installation

### From Source

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ItCodinTime/Jarvis.git
   cd Jarvis
   ```

2. **Add Icon Files** (required before loading):
   
   The extension requires icon files in the `icons/` directory. Create an `icons` folder in the root directory and add three PNG images:
   
   - `icon16.png` (16x16 pixels)
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)
   
   You can create simple icons using any image editor or use free icon resources. Example using ImageMagick:
   
   ```bash
   mkdir icons
   # Create a simple gradient icon (requires ImageMagick)
   convert -size 128x128 gradient:#667eea-#764ba2 icons/icon128.png
   convert -size 48x48 gradient:#667eea-#764ba2 icons/icon48.png
   convert -size 16x16 gradient:#667eea-#764ba2 icons/icon16.png
   ```

3. **Load the extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the cloned Jarvis directory

4. **Configure API Keys** (required for AI features):
   - Click the Jarvis extension icon
   - Click the settings/options button or right-click the extension and select "Options"
   - Configure your API keys (see Configuration section below)

## ⚙️ Configuration

### Setting up Gemini API

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Open Jarvis extension options (right-click extension icon → Options)
3. Enter your Gemini API key in the "Gemini API Configuration" section
4. Click "Save Gemini Key"

### Setting up Gmail API

#### Option 1: Using Chrome Identity API (Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gmail API for your project
4. Create OAuth 2.0 credentials:
   - Go to "Credentials" → "Create Credentials" → "OAuth client ID"
   - Application type: "Chrome Extension"
   - Add your extension ID (found in `chrome://extensions/`)
5. Copy the Client ID and Client Secret
6. Open Jarvis extension options
7. Enter your Gmail OAuth Client ID and Client Secret
8. Click "Save Gmail Credentials"
9. Click "Authenticate Gmail" to complete OAuth flow

#### Option 2: Using Gmail API with Service Account

For automated workflows, you can use a service account. See [Google's documentation](https://developers.google.com/gmail/api/auth/web-server) for details.

## 🎯 Usage

### Basic Usage

1. Click the Jarvis extension icon in your Chrome toolbar
2. Click the "Start Listening" button
3. The indicator will turn purple when listening
4. Speak your command clearly
5. Watch as Jarvis executes your command
6. Click "Stop Listening" to pause voice recognition

### Using AI-Powered Email

1. Ensure Gemini API key and Gmail are configured
2. Start voice listening
3. Say: "send email to recipient@example.com with subject meeting notes and message summarize our discussion"
4. Jarvis will:
   - Parse your command
   - Use Gemini to generate email content based on your prompt
   - Send the email via Gmail API
   - Confirm when sent

### Using Page Summarization

1. Ensure Gemini API key is configured
2. Navigate to any webpage
3. Start voice listening
4. Say: "summarize this page"
5. Jarvis will:
   - Extract page content
   - Generate a concise summary using Gemini
   - Display the summary in an alert

### Using AI Email Reply

1. Ensure Gemini API key is configured
2. Open an email in Gmail
3. Start voice listening
4. Say: "reply to this email using AI"
5. Jarvis will:
   - Extract the email content
   - Generate an appropriate reply using Gemini
   - Insert the reply into the Gmail compose box
   - You can review and edit before sending

## 🛠️ Technical Details

### Technologies Used

- **Web Speech API**: For voice recognition
- **Google Gemini API**: For AI-powered content generation
- **Gmail API**: For sending emails programmatically
- **Chrome Extensions Manifest V3**: Modern extension architecture
- **Chrome Identity API**: For secure OAuth authentication

### Architecture

```
Jarvis/
├── background/
│   └── background.js      # Background service worker
├── content/
│   └── content.js         # Content scripts for page interaction
├── options/
│   ├── options.html       # Options page UI
│   └── options.js         # Options page logic
├── popup/
│   ├── popup.html         # Extension popup UI
│   ├── popup.css          # Popup styling
│   └── popup.js           # Voice recognition & command processing
├── icons/                 # Extension icons (16, 48, 128 px)
└── manifest.json          # Extension manifest
```

### Permissions

The extension requires the following permissions:
- `activeTab`: To interact with the current tab
- `scripting`: To execute scripts in tabs
- `storage`: To save API keys and settings
- `tabs`: To manage tabs
- `identity`: For Gmail OAuth authentication
- `host_permissions`: To access Gmail and Gemini APIs

## 🤝 Contributing

We welcome contributions! Here's how you can help:

- 🐛 Report bugs and issues
- 💡 Suggest new voice commands or features
- 📝 Improve documentation
- 🔧 Submit pull requests with improvements

### Development Roadmap

- [x] Add AI-powered email generation
- [x] Add page summarization
- [x] Add AI email reply
- [x] Settings page for API configuration
- [ ] Add more voice commands (form filling, clicking specific elements)
- [ ] Support for custom voice commands
- [ ] Multi-language support
- [ ] Command history and favorites
- [ ] Integration with other AI services (OpenAI, Claude, etc.)
- [ ] Keyboard shortcuts for quick access
- [ ] Advanced Gmail features (drafts, labels, etc.)

## 📄 License

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

### Commands not executing

1. Ensure you're speaking clearly
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

*Empower your browsing experience with AI-powered voice control!*
