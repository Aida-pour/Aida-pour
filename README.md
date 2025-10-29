# Hi, I’m Aida 👋  

**Cloud | SRE | AI/ML | Automation | Voice & Video API**  

[![AWS](https://img.shields.io/badge/Cloud-AWS-orange?logo=amazon-aws)](#)
[![GCP](https://img.shields.io/badge/Cloud-GCP-blue?logo=google-cloud)](#)
[![Kubernetes](https://img.shields.io/badge/DevOps-Kubernetes-326ce5?logo=kubernetes)](#)
[![Terraform](https://img.shields.io/badge/IaC-Terraform-7b42bc?logo=terraform)](#)
[![Python](https://img.shields.io/badge/Code-Python-3670A0?logo=python)](#)
[![Vonage](https://img.shields.io/badge/API-Vonage-1F1F1F?logo=vonage)](#)

- Build and run reliable systems in AWS, GCP, and hybrid environments  
- Automate deployments with Terraform, Kubernetes, and CI/CD  
- Develop and integrate **Voice & Video API** solutions  
- Experiment with AI voice projects and ML foundations  
- Focus on observability, scaling, and operational excellence  

📫 [LinkedIn](https://www.linkedin.com/in/aidapourshirazi)

---

## 🎓 NEW: Penglish - Interactive Farsi Learning Platform

> **Learn Farsi the fun way using Penglish (romanized Persian)!**

A beautiful, gamified language learning platform inspired by Duolingo. Master Farsi pronunciation and vocabulary using Penglish before learning the Persian alphabet.

### ✨ Features

- 🎮 **Gamified Learning**: XP, levels, streaks, and achievements
- 📚 **Interactive Lessons**: Multiple exercise types (multiple choice, fill-in-blank, translation)
- 🗣️ **Penglish Focus**: Learn Farsi using Latin characters (romanization)
- 🎨 **Beautiful UI**: Playful, colorful design with smooth animations
- 🤖 **AI Integration**: Voice features powered by OpenAI
- 📱 **Responsive**: Works on desktop, tablet, and mobile
- 🆓 **Open Source**: Free to use and contribute

### 🚀 Quick Start

```bash
cd penglish-platform

# Install and start backend
cd backend
npm install
npm run prisma:generate && npm run prisma:migrate
npm run dev  # Runs on http://localhost:5001

# Install and start frontend (new terminal)
cd frontend
npm install
npm run dev  # Runs on http://localhost:3000
```

Visit http://localhost:3000 and start learning!

### 📖 Learn More

- **[Full Documentation](penglish-platform/README.md)** - Complete guide
- **[Quick Start Guide](penglish-platform/QUICK_START.md)** - Get running in 5 minutes
- **[Architecture](PENGLISH_PLATFORM_ARCHITECTURE.md)** - Technical details

### 🎯 What You'll Learn

**Unit 1: Greetings** - Salam va Moghademaat
- Salam (Hello), Chetori? (How are you?), Khoda hafez (Goodbye)

**Unit 2: Family** - Khanevadeh
- Pedar (Father), Madar (Mother), Baradar (Brother), Khahar (Sister)

**Unit 3: Numbers** - Adad
- Yek (1), Do (2), Se (3), Chahar (4), Panj (5)...

*More units coming soon!*

---

## OpenAI Voice Chat Companion with Farsi Support

A comprehensive voice-enabled chat companion using OpenAI's APIs with full support for Farsi (Persian) language transcription and text-to-speech.

### Features

- **Voice Transcription**: Convert Farsi speech to text using OpenAI's Whisper API
- **Text-to-Speech**: Generate natural-sounding Farsi speech from text
- **Conversational AI**: Chat with GPT-4 in Farsi or English
- **Conversation Management**: Save and load conversation history
- **Multi-language Support**: Seamlessly switch between Farsi and English
- **Async Support**: Python async/await for better performance
- **Cross-platform**: Works on Linux, macOS, and Windows

### Quick Start

#### Python Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Set your OpenAI API key
export OPENAI_API_KEY='your-api-key-here'

# Run the interactive companion
python openai_voice_companion.py

# Or run examples
python example_usage.py
```

#### Node.js Installation

```bash
# Install dependencies
npm install

# Set your OpenAI API key
export OPENAI_API_KEY='your-api-key-here'

# Run the example
node openai_voice_companion.js

# Or run all examples
node example_usage.js
```

### Usage Examples

#### Python

```python
from openai_voice_companion import FarsiVoiceChatCompanion

# Initialize the companion
companion = FarsiVoiceChatCompanion(
    model="gpt-4",
    voice="nova",
    language="fa"  # Farsi
)

# Text conversation in Farsi
response = companion.chat("سلام! چطوری؟")
print(response)

# Transcribe audio file
transcript = companion.transcribe_audio("audio.mp3")
print(transcript)

# Convert text to speech
audio_file = companion.text_to_speech(
    "سلام! من یک دستیار هوش مصنوعی هستم",
    "output.mp3"
)

# Full voice conversation turn
result = companion.voice_conversation_turn(
    record_duration=5,
    play_response=True
)
```

#### JavaScript/Node.js

```javascript
const FarsiVoiceChatCompanion = require('./openai_voice_companion.js');

// Initialize the companion
const companion = new FarsiVoiceChatCompanion({
  model: 'gpt-4',
  voice: 'nova',
  language: 'fa'
});

// Text conversation in Farsi
const response = await companion.chat('سلام! چطوری؟');
console.log(response);

// Transcribe audio file
const transcript = await companion.transcribeAudio('audio.mp3');
console.log(transcript);

// Convert text to speech
const audioFile = await companion.textToSpeech(
  'سلام! من یک دستیار هوش مصنوعی هستم',
  'output.mp3'
);
```

### API Reference

#### FarsiVoiceChatCompanion

**Constructor Parameters:**
- `api_key` (str): OpenAI API key (or set `OPENAI_API_KEY` env variable)
- `model` (str): GPT model to use (default: "gpt-4")
- `voice` (str): TTS voice (alloy, echo, fable, onyx, nova, shimmer)
- `language` (str): Language code (default: "fa" for Farsi)

**Methods:**

- `transcribe_audio(audio_file)`: Transcribe audio to Farsi text
- `chat(user_message, system_prompt)`: Chat with the AI assistant
- `text_to_speech(text, output_file)`: Convert text to speech
- `voice_conversation_turn(record_duration, play_response)`: Complete voice interaction
- `save_conversation(filename)`: Save conversation history
- `load_conversation(filename)`: Load conversation history
- `clear_conversation()`: Clear conversation history

### Features Breakdown

#### 1. Voice Transcription (Speech-to-Text)
Uses OpenAI's Whisper API to accurately transcribe Farsi speech:
- Supports multiple audio formats (MP3, WAV, M4A, etc.)
- High accuracy for Farsi language
- Real-time or batch processing

#### 2. Text-to-Speech
Generates natural-sounding Farsi audio:
- Multiple voice options (nova, alloy, echo, fable, onyx, shimmer)
- High-quality audio output
- Support for long text passages

#### 3. Conversational AI
Powered by GPT-4 with Farsi support:
- Context-aware responses
- Multi-turn conversations
- Customizable system prompts
- Conversation history management

#### 4. Audio Recording
Built-in audio recording capabilities:
- Configurable duration
- Adjustable sample rate
- Support for different audio formats

### Configuration

#### Environment Variables
```bash
# Required
export OPENAI_API_KEY='your-api-key-here'

# Optional
export DEFAULT_MODEL='gpt-4'
export DEFAULT_VOICE='nova'
export DEFAULT_LANGUAGE='fa'
```

#### Audio Settings
```python
companion = FarsiVoiceChatCompanion(
    sample_rate=16000,  # Audio sample rate in Hz
    chunk_size=1024     # Audio chunk size
)
```

### Supported Languages

While optimized for Farsi (Persian), the companion supports:
- Farsi (fa)
- English (en)
- Arabic (ar)
- Urdu (ur)
- And many more languages supported by Whisper

### Requirements

#### Python
- Python 3.8+
- openai >= 1.12.0
- pyaudio >= 0.2.13
- wave (standard library)

#### Node.js
- Node.js 18.0+
- openai >= 4.28.0

### Troubleshooting

**PyAudio Installation Issues:**
```bash
# Ubuntu/Debian
sudo apt-get install portaudio19-dev python3-pyaudio

# macOS
brew install portaudio
pip install pyaudio

# Windows
pip install pipwin
pipwin install pyaudio
```

**Audio Playback Issues:**
- Linux: Install `mpg123` or `ffplay`
- macOS: Uses built-in `afplay`
- Windows: Uses PowerShell audio player

### Examples

See `example_usage.py` or `example_usage.js` for comprehensive examples including:
- Basic text conversation
- Audio transcription
- Text-to-speech generation
- Voice conversation turns
- Conversation management
- Multilingual conversations
- Custom system prompts

---

## Vonage + OpenAI Integration (NEW!)

Take your AI voice companion to the next level with phone call integration!

### What's New?

Combine Vonage Voice API with OpenAI to create a **phone-based AI voice companion**:
- ☎️ **Inbound Calls**: Answer calls automatically with AI
- 📞 **Outbound Calls**: Make AI-powered calls programmatically
- 🎙️ **Real-time Transcription**: Farsi speech-to-text via Whisper
- 🤖 **Intelligent Responses**: GPT-4 powered conversations
- 🌐 **WebRTC Support**: Browser-based calling (no phone needed)
- 💬 **SMS Integration**: Send conversation summaries
- 📊 **Call Analytics**: Track and analyze conversations

### Quick Start with Vonage

```bash
# Install dependencies
pip install -r requirements.txt  # Python
npm install                       # Node.js

# Set up environment
export OPENAI_API_KEY='your-openai-key'
export VONAGE_API_KEY='your-vonage-key'
export VONAGE_API_SECRET='your-vonage-secret'
export VONAGE_PHONE_NUMBER='+12345678900'
export BASE_URL='https://your-server.com'

# Start the server
python vonage_openai_voice_companion.py  # Python
node vonage_openai_voice_companion.js    # Node.js
```

### How It Works

```
📱 User calls your number
    ↓
📞 Vonage receives call
    ↓
🎙️ Records user speech
    ↓
📝 OpenAI Whisper transcribes (Farsi)
    ↓
🤖 GPT-4 generates response
    ↓
🔊 Response spoken back to user
    ↓
🔄 Conversation continues
```

### Use Cases

- **Customer Support**: 24/7 automated phone support in Farsi
- **Information Hotline**: Provide information via phone calls
- **Language Learning**: Practice Farsi conversation by phone
- **Appointment Booking**: Voice-based scheduling system
- **Elder Care**: AI companion accessible via phone
- **Accessibility**: Voice interface for applications

### Documentation

See **[VONAGE_INTEGRATION_GUIDE.md](VONAGE_INTEGRATION_GUIDE.md)** for:
- Complete setup instructions
- Vonage account configuration
- Webhook implementation
- Production deployment guide
- Cost optimization tips
- Security best practices

### Example Code

**Python:**
```python
from vonage_openai_voice_companion import VonageOpenAIVoiceCompanion

# Initialize
companion = VonageOpenAIVoiceCompanion()

# Create server with webhooks
app = companion.create_flask_app(base_url="https://your-server.com")
app.run()

# Make outbound call
companion.make_call(to_number="+12345678900", base_url="https://your-server.com")
```

**Node.js:**
```javascript
const VonageOpenAIVoiceCompanion = require('./vonage_openai_voice_companion');

// Initialize
const companion = new VonageOpenAIVoiceCompanion();

// Create server
const app = companion.createExpressApp('https://your-server.com');
app.listen(3000);

// Make outbound call
await companion.makeCall('+12345678900', 'https://your-server.com');
```

---

### License

MIT License - See LICENSE file for details

### Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

