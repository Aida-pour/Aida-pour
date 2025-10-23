# OpenAI Voice Chat Companion - Setup Guide

Complete setup guide for the Farsi Voice Chat Companion.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Testing](#testing)
5. [Troubleshooting](#troubleshooting)

## Prerequisites

### 1. OpenAI API Key

You need an OpenAI API key with access to:
- GPT-4 (or GPT-3.5-turbo)
- Whisper API (for transcription)
- TTS API (for text-to-speech)

**Get your API key:**
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new secret key
5. Copy and save it securely

### 2. System Requirements

**For Python:**
- Python 3.8 or higher
- pip package manager
- Audio input/output capabilities (microphone and speakers)

**For Node.js:**
- Node.js 18.0 or higher
- npm package manager

## Installation

### Python Installation

#### Step 1: Clone or Download the Repository

```bash
cd /path/to/your/projects
git clone <repository-url>
cd Aida-pour
```

#### Step 2: Create a Virtual Environment (Recommended)

```bash
# Create virtual environment
python3 -m venv venv

# Activate it
# On Linux/macOS:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

#### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

**If you encounter PyAudio issues:**

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install portaudio19-dev python3-pyaudio
pip install pyaudio
```

**macOS:**
```bash
brew install portaudio
pip install pyaudio
```

**Windows:**
```bash
pip install pipwin
pipwin install pyaudio
```

#### Step 4: Install Audio Players (Optional, for playing audio)

**Ubuntu/Debian:**
```bash
sudo apt-get install mpg123
```

**macOS:**
```bash
# afplay is pre-installed
```

**Windows:**
```bash
# Windows Media Player is built-in
```

### Node.js Installation

#### Step 1: Install Dependencies

```bash
npm install
```

#### Step 2: Install Audio Players

**macOS:**
```bash
# afplay is pre-installed
```

**Linux:**
```bash
sudo apt-get install mpg123
```

**Windows:**
```bash
# PowerShell audio player is built-in
```

## Configuration

### 1. Set Up Environment Variables

**Option A: Export in Terminal (Temporary)**

```bash
export OPENAI_API_KEY='your-api-key-here'
```

**Option B: Add to .bashrc or .zshrc (Permanent)**

```bash
# Add to ~/.bashrc or ~/.zshrc
echo "export OPENAI_API_KEY='your-api-key-here'" >> ~/.bashrc
source ~/.bashrc
```

**Option C: Use .env File**

```bash
# Copy the example file
cp .env.example .env

# Edit the file and add your API key
nano .env  # or use your preferred editor
```

**For Python with .env file:**
```bash
pip install python-dotenv
```

Then in your code:
```python
from dotenv import load_dotenv
load_dotenv()
```

**For Node.js with .env file:**
```bash
npm install dotenv
```

Then in your code:
```javascript
require('dotenv').config();
```

### 2. Verify API Key

**Python:**
```bash
python -c "import os; print('API Key set!' if os.getenv('OPENAI_API_KEY') else 'API Key NOT set')"
```

**Node.js:**
```bash
node -e "console.log(process.env.OPENAI_API_KEY ? 'API Key set!' : 'API Key NOT set')"
```

## Testing

### Python Testing

#### Test 1: Import the Module
```bash
python -c "from openai_voice_companion import FarsiVoiceChatCompanion; print('Import successful!')"
```

#### Test 2: Run Simple Text Chat
```python
# Create a file test_simple.py
from openai_voice_companion import FarsiVoiceChatCompanion

companion = FarsiVoiceChatCompanion(model="gpt-3.5-turbo", language="fa")
response = companion.chat("سلام")
print(response)
```

```bash
python test_simple.py
```

#### Test 3: Run Examples
```bash
python example_usage.py
```

### Node.js Testing

#### Test 1: Run Simple Text Chat
```javascript
// Create a file test_simple.js
const FarsiVoiceChatCompanion = require('./openai_voice_companion.js');

async function test() {
  const companion = new FarsiVoiceChatCompanion({
    model: 'gpt-3.5-turbo',
    language: 'fa'
  });

  const response = await companion.chat('سلام');
  console.log(response);
}

test();
```

```bash
node test_simple.js
```

#### Test 2: Run Examples
```bash
node example_usage.js
```

### Interactive Testing

**Python:**
```bash
python openai_voice_companion.py
```

**Node.js:**
```bash
node openai_voice_companion.js
```

## Troubleshooting

### Common Issues

#### 1. "openai module not found"

**Solution:**
```bash
pip install openai --upgrade
# or
npm install openai
```

#### 2. "OPENAI_API_KEY not set"

**Solution:**
```bash
# Check if it's set
echo $OPENAI_API_KEY

# If not, set it
export OPENAI_API_KEY='your-api-key-here'
```

#### 3. PyAudio Import Error

**Error:** `ImportError: No module named 'pyaudio'`

**Solution:**
```bash
# Install system dependencies first
# Ubuntu/Debian:
sudo apt-get install portaudio19-dev

# macOS:
brew install portaudio

# Then install PyAudio
pip install pyaudio
```

#### 4. Audio Recording Issues

**Error:** "No default input device available"

**Solution:**
- Check if your microphone is connected
- Grant microphone permissions to your terminal/Python
- Test your microphone with system tools first

**Ubuntu/Debian:**
```bash
arecord -l  # List recording devices
```

**macOS:**
```bash
# Go to System Preferences > Security & Privacy > Microphone
# Grant permission to Terminal/iTerm
```

#### 5. Audio Playback Issues

**Error:** Audio files are created but not playing

**Solution:**
- The audio files are saved successfully
- Play them manually with your preferred audio player
- Or install the suggested audio players (mpg123, ffplay, etc.)

#### 6. API Rate Limits

**Error:** "Rate limit exceeded"

**Solution:**
- Wait a few moments and try again
- Check your OpenAI account usage limits
- Consider upgrading your OpenAI plan if needed

#### 7. Network/Connection Issues

**Error:** "Connection timeout" or "API request failed"

**Solution:**
- Check your internet connection
- Verify your API key is correct
- Check OpenAI status page: https://status.openai.com/

### Getting Help

If you encounter issues not covered here:

1. Check the OpenAI documentation: https://platform.openai.com/docs
2. Review the example files for correct usage
3. Check your API key permissions and quotas
4. Ensure all dependencies are installed correctly

## Next Steps

After successful setup:

1. **Explore Examples**: Run through all examples in `example_usage.py` or `example_usage.js`
2. **Customize**: Modify the system prompts and parameters
3. **Integrate**: Use the companion in your own projects
4. **Experiment**: Try different voices, models, and languages

## API Costs

Be aware of OpenAI API costs:
- **Whisper (transcription)**: $0.006 per minute
- **TTS**: $15.00 per 1M characters
- **GPT-4**: ~$0.03 per 1K tokens (input) + ~$0.06 per 1K tokens (output)
- **GPT-3.5-turbo**: Much cheaper alternative

Monitor your usage at: https://platform.openai.com/usage

## Security Best Practices

1. **Never commit your API key** to version control
2. **Use environment variables** for sensitive data
3. **Rotate your API keys** regularly
4. **Set spending limits** in your OpenAI account
5. **Keep dependencies updated** for security patches

```bash
# Add .env to .gitignore
echo ".env" >> .gitignore
echo "venv/" >> .gitignore
echo "node_modules/" >> .gitignore
```

Happy coding!
