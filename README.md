# 🎤 Jarvis - Voice-Controlled Browser Automation

An open-source Chrome extension inspired by ChromePilot that brings voice-controlled, AI-powered browser automation to your fingertips using the Web Speech API.

## ✨ Features

- 🗣️ **Voice Commands**: Control your browser using natural voice commands
- 🎯 **Smart Navigation**: Navigate pages, scroll, and interact with web elements hands-free
- 🚀 **Easy to Use**: Simple popup interface with visual feedback
- 🔒 **Privacy First**: All voice processing happens locally using Web Speech API
- ⚡ **Fast & Responsive**: Lightweight extension with minimal performance impact
- 🎨 **Beautiful UI**: Modern, gradient-styled interface with smooth animations

## 📋 Available Commands

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
   
   Or download free icons from resources like:
   - [Flaticon](https://www.flaticon.com/)
   - [Icons8](https://icons8.com/)
   - [Iconfinder](https://www.iconfinder.com/)

3. **Load the extension in Chrome**:
   
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top right)
   - Click "Load unpacked"
   - Select the `Jarvis` directory
   - The extension icon should appear in your toolbar

## 📖 Usage

1. **Activate Jarvis**:
   - Click the Jarvis extension icon in your Chrome toolbar
   - The popup will open showing the control panel

2. **Start Voice Recognition**:
   - Click the "Start Listening" button (green button with 🎤 icon)
   - Your browser will ask for microphone permission (first time only)
   - Grant microphone access to enable voice commands

3. **Give Commands**:
   - Speak clearly into your microphone
   - Use any of the available commands listed above
   - The extension will display your command in the popup
   - Commands are executed immediately

4. **Stop Listening**:
   - Click the "Stop" button (red button with ⏹ icon)
   - Voice recognition will stop until you restart it

## 📁 Project Structure

```
Jarvis/
├── manifest.json          # Extension configuration and permissions
├── popup/                 # Popup UI and voice recognition logic
│   ├── popup.html        # Popup interface structure
│   ├── popup.css         # Popup styling
│   └── popup.js          # Voice recognition and command processing
├── background/            # Background service worker
│   └── background.js     # Extension lifecycle and message handling
├── content/               # Content scripts
│   └── content.js        # Page interaction and visual feedback
├── icons/                 # Extension icons (you need to add these)
│   ├── icon16.png        # 16x16 toolbar icon
│   ├── icon48.png        # 48x48 extension page icon
│   └── icon128.png       # 128x128 store icon
├── .gitignore            # Git ignore rules
├── LICENSE               # MIT License
└── README.md             # This file
```

## 🛠️ Technical Details

### Technologies Used

- **Manifest V3**: Latest Chrome extension platform
- **Web Speech API**: For voice recognition (specifically `webkitSpeechRecognition`)
- **Chrome Extension APIs**:
  - `chrome.tabs`: For tab management
  - `chrome.scripting`: For executing scripts in pages
  - `chrome.storage`: For settings persistence
  - `chrome.runtime`: For message passing

### Browser Compatibility

- Chrome/Chromium 88+
- Microsoft Edge 88+
- Brave Browser
- Opera 74+

**Note**: The Web Speech API (voice recognition) is currently only supported in Chromium-based browsers.

### Permissions Explained

- `activeTab`: Access the currently active tab
- `scripting`: Execute scripts to control page elements
- `storage`: Save user preferences and command history
- `tabs`: Manage browser tabs
- `<all_urls>`: Content scripts can run on any webpage

## 🔧 Development

### Prerequisites

- Google Chrome or any Chromium-based browser
- Basic knowledge of JavaScript, HTML, and CSS
- Text editor or IDE

### Making Changes

1. Make your changes to the code
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Jarvis extension card
4. Test your changes

### Debugging

- **Popup**: Right-click the extension icon → Inspect popup
- **Background**: Go to `chrome://extensions/` → Click "service worker" under Jarvis
- **Content Script**: Open DevTools (F12) on any webpage, check the Console

## 🤝 Contributing

Contributions are welcome! Here are some ways you can contribute:

- 🐛 Report bugs and issues
- 💡 Suggest new voice commands or features
- 📝 Improve documentation
- 🔧 Submit pull requests with improvements

### Development Roadmap

- [ ] Add more voice commands (form filling, clicking specific elements)
- [ ] Support for custom voice commands
- [ ] Multi-language support
- [ ] Command history and favorites
- [ ] Integration with AI services for natural language understanding
- [ ] Keyboard shortcuts for quick access
- [ ] Settings page for customization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [ChromePilot](https://github.com/topics/chromepilot) and similar voice automation projects
- Built with the amazing [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
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

### Extension icon not showing

1. Make sure you've added the icon files (icon16.png, icon48.png, icon128.png) to the `icons/` directory
2. Reload the extension from `chrome://extensions/`

---

**Made with ❤️ by the Jarvis team**

*Empower your browsing experience with voice control!*
