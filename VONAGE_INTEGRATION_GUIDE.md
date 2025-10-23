# Vonage + OpenAI Voice Integration Guide

Complete guide for integrating Vonage Voice API with OpenAI to create a phone-based AI voice companion with Farsi support.

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Setup Instructions](#setup-instructions)
4. [Configuration](#configuration)
5. [Usage](#usage)
6. [Features](#features)
7. [Troubleshooting](#troubleshooting)

## Overview

This integration combines:
- **Vonage Voice API**: For telephony (phone calls, WebRTC, SIP)
- **OpenAI Whisper**: For speech-to-text transcription in Farsi
- **OpenAI GPT-4**: For intelligent conversation
- **OpenAI TTS**: For text-to-speech (optional enhancement)

### How It Works

```
┌─────────────┐
│ Phone Call  │
│  (Inbound)  │
└──────┬──────┘
       │
       v
┌──────────────────┐
│ Vonage Voice API │  ← Receives call
└──────┬───────────┘
       │
       v
┌──────────────────┐
│ Your Server      │  ← Webhook handlers
│ (Flask/Express)  │
└──────┬───────────┘
       │
       ├─────> Record user audio
       │
       v
┌──────────────────┐
│ OpenAI Whisper   │  ← Transcribe to Farsi text
└──────┬───────────┘
       │
       v
┌──────────────────┐
│ OpenAI GPT-4     │  ← Generate AI response
└──────┬───────────┘
       │
       v
┌──────────────────┐
│ Vonage TTS       │  ← Speak response back
│ (or OpenAI TTS)  │
└──────┬───────────┘
       │
       v
┌──────────────────┐
│ User hears       │
│ AI response      │
└──────────────────┘
```

## Architecture

### Components

1. **Web Server** (Flask for Python, Express for Node.js)
   - Hosts webhook endpoints
   - Handles Vonage callbacks
   - Processes audio recordings

2. **Vonage Voice API**
   - Manages phone calls (inbound/outbound)
   - Records user speech
   - Plays back AI responses
   - Handles call flow with NCCO (Nexmo Call Control Objects)

3. **OpenAI APIs**
   - **Whisper**: Transcribes Farsi speech to text
   - **GPT-4**: Generates intelligent responses
   - **TTS** (optional): Converts responses to speech

4. **Storage**
   - Conversation history saved as JSON
   - Call recordings (optional)

## Setup Instructions

### Step 1: Get Vonage Account

1. Sign up at https://dashboard.nexmo.com/sign-up
2. Verify your account
3. Add credit (minimum $5 for testing)

### Step 2: Create Vonage Application

```bash
# Install Vonage CLI
npm install -g @vonage/cli

# Initialize with your API credentials
vonage config:set --apiKey=YOUR_API_KEY --apiSecret=YOUR_API_SECRET

# Create a Voice application
vonage apps:create "AI Voice Companion" \
  --voice_answer_url=https://your-server.com/webhooks/answer \
  --voice_event_url=https://your-server.com/webhooks/event
```

This will create:
- Application ID
- Private key (saved as `private.key`)

**Save these credentials!**

### Step 3: Get a Vonage Phone Number

```bash
# Search for available numbers (US example)
vonage numbers:search US --features=VOICE

# Buy a number
vonage numbers:buy PHONE_NUMBER --confirm

# Link number to your application
vonage apps:link APP_ID --number=PHONE_NUMBER
```

### Step 4: Set Up ngrok (for local testing)

```bash
# Install ngrok
# Download from https://ngrok.com/download

# Start ngrok tunnel
ngrok http 5000  # For Python (Flask)
# or
ngrok http 3000  # For Node.js (Express)
```

ngrok will give you a public URL like: `https://abc123.ngrok.io`

### Step 5: Update Webhook URLs

Update your Vonage application with the ngrok URL:

```bash
vonage apps:update APP_ID \
  --voice_answer_url=https://abc123.ngrok.io/webhooks/answer \
  --voice_event_url=https://abc123.ngrok.io/webhooks/event
```

### Step 6: Install Dependencies

**Python:**
```bash
pip install -r requirements.txt
```

**Node.js:**
```bash
npm install
```

### Step 7: Configure Environment Variables

Create a `.env` file:

```bash
# OpenAI
OPENAI_API_KEY=sk-your-openai-key-here

# Vonage
VONAGE_API_KEY=your-vonage-api-key
VONAGE_API_SECRET=your-vonage-api-secret
VONAGE_APPLICATION_ID=your-application-id
VONAGE_PRIVATE_KEY_PATH=./private.key
VONAGE_PHONE_NUMBER=+12345678900

# Server
BASE_URL=https://abc123.ngrok.io
PORT=5000  # or 3000 for Node.js
```

## Configuration

### Webhook Endpoints

Your server needs to expose these endpoints:

1. **Answer URL** (`/webhooks/answer`)
   - Called when a call is received
   - Returns NCCO with initial actions

2. **Event URL** (`/webhooks/event`)
   - Receives call status updates
   - Handles call lifecycle events

3. **Recording URL** (`/webhooks/recording`)
   - Receives recorded audio
   - Processes and responds to user

### NCCO (Call Control)

NCCO (Nexmo Call Control Objects) are JSON instructions that control the call flow:

```json
[
  {
    "action": "talk",
    "text": "سلام! به دستیار هوش مصنوعی خوش آمدید.",
    "language": "fa-IR"
  },
  {
    "action": "record",
    "eventUrl": ["https://your-server.com/webhooks/recording"],
    "endOnSilence": 3,
    "format": "mp3"
  }
]
```

## Usage

### Running the Server

**Python:**
```bash
python vonage_openai_voice_companion.py
```

**Node.js:**
```bash
npm run start:vonage
# or
node vonage_openai_voice_companion.js
```

### Making a Test Call

1. **Inbound Call**: Call your Vonage phone number
2. **Outbound Call**: Use the web interface or API

**Using the web interface:**
```
http://localhost:5000  (Python)
http://localhost:3000  (Node.js)
```

**Using curl:**
```bash
curl -X POST http://localhost:5000/make-call \
  -H "Content-Type: application/json" \
  -d '{"to_number": "+12345678900"}'
```

### Call Flow Example

1. User calls the Vonage number
2. System answers: "سلام! به دستیار هوش مصنوعی خوش آمدید. لطفا صحبت کنید."
3. System starts recording
4. User speaks in Farsi
5. Recording sent to webhook
6. Audio transcribed by Whisper
7. Transcript sent to GPT-4
8. GPT-4 generates Farsi response
9. Response spoken back to user via Vonage TTS
10. System continues recording for next turn
11. Conversation continues until user hangs up

## Features

### 1. Inbound Call Handling

Automatically answers incoming calls and starts AI conversation:

```python
# Python example
companion = VonageOpenAIVoiceCompanion()
app = companion.create_flask_app(base_url="https://your-server.com")
app.run()
```

### 2. Outbound Call Making

Programmatically call phone numbers:

```python
# Python
companion.make_call(to_number="+12345678900", base_url="https://your-server.com")
```

```javascript
// Node.js
await companion.makeCall('+12345678900', 'https://your-server.com');
```

### 3. Real-time Transcription

Uses OpenAI Whisper for accurate Farsi transcription:
- Supports multiple audio formats
- High accuracy for Farsi language
- Automatic audio download from Vonage

### 4. Intelligent Conversation

GPT-4 powered responses:
- Context-aware (maintains conversation history)
- Concise responses optimized for phone calls
- Farsi language support

### 5. Conversation Logging

Automatically saves call conversations:
```json
{
  "call_uuid": "abc-123-def",
  "call_info": {
    "from": "+12345678900",
    "start_time": "2025-01-15T10:30:00",
    "language": "fa"
  },
  "conversation": [
    {"role": "user", "content": "سلام چطوری؟"},
    {"role": "assistant", "content": "سلام! من خوبم، ممنون..."}
  ]
}
```

### 6. Multi-turn Conversations

Maintains context across multiple exchanges in a single call.

### 7. WebRTC Support (Advanced)

Can be extended to support browser-based calling:
- No phone required
- Video support possible
- Screen sharing capabilities

## Advanced Features

### SMS Integration

Add SMS capabilities:

```python
# Send conversation summary via SMS
def send_sms_summary(self, to_number: str, conversation: list):
    summary = self.summarize_conversation(conversation)

    response = self.vonage_client.sms.send_message({
        'from': self.vonage_phone_number,
        'to': to_number,
        'text': summary
    })

    return response
```

### Call Recording

Enable full call recording:

```python
ncco = [
    {
        "action": "record",
        "eventUrl": ["https://your-server.com/webhooks/recording"],
        "split": "conversation",  # Record both sides
        "channels": 2,
        "format": "mp3"
    },
    {
        "action": "connect",
        "endpoint": [...]
    }
]
```

### IVR Menu (Interactive Voice Response)

Create a menu system:

```python
ncco = [
    {
        "action": "talk",
        "text": "برای فارسی شماره یک، برای انگلیسی شماره دو را فشار دهید",
        "language": "fa-IR"
    },
    {
        "action": "input",
        "eventUrl": ["https://your-server.com/webhooks/menu"],
        "maxDigits": 1
    }
]
```

### SIP Trunking

Connect to existing phone systems:
- Integrate with PBX
- Enterprise deployment
- Call forwarding

## Troubleshooting

### Issue: "Webhook not receiving calls"

**Solution:**
- Check ngrok is running
- Verify webhook URLs in Vonage dashboard
- Ensure server is running
- Check firewall settings

### Issue: "Audio not transcribing"

**Solution:**
- Verify OpenAI API key is set
- Check recording format (should be MP3)
- Ensure audio file is downloadable
- Check Vonage recording settings

### Issue: "Poor transcription quality"

**Solution:**
- Use `endOnSilence` parameter to avoid cutting off speech
- Increase recording quality
- Test with clear audio
- Consider using noise cancellation

### Issue: "Responses are too slow"

**Solution:**
- Use GPT-3.5-turbo instead of GPT-4
- Reduce max_tokens in OpenAI call
- Implement caching for common responses
- Use async processing

### Issue: "Call disconnects immediately"

**Solution:**
- Check NCCO response format
- Verify webhook returns valid JSON
- Check server logs for errors
- Ensure proper HTTP status codes (200 OK)

### Issue: "Cannot make outbound calls"

**Solution:**
- Verify Application ID and Private Key are set
- Check phone number format (E.164: +12345678900)
- Ensure credit in Vonage account
- Check number is linked to application

## Cost Considerations

### Vonage Costs
- **Inbound calls**: ~$0.0085/min
- **Outbound calls**: Varies by destination (~$0.02/min US)
- **Phone number rental**: ~$1/month

### OpenAI Costs
- **Whisper**: $0.006/minute
- **GPT-4**: ~$0.03/1K tokens (input) + ~$0.06/1K tokens (output)
- **GPT-3.5-turbo**: Much cheaper (~$0.0015-$0.002/1K tokens)

**Example 5-minute call:**
- Vonage: $0.04
- Whisper: $0.03
- GPT-4: ~$0.30-$0.60
- **Total**: ~$0.40-$0.70

**Cost optimization:**
- Use GPT-3.5-turbo: ~$0.10 per call
- Implement caching
- Batch processing where possible

## Security Best Practices

1. **Use HTTPS only** for webhooks
2. **Validate Vonage signatures** (implement JWT verification)
3. **Rate limiting** to prevent abuse
4. **Store credentials securely** (use environment variables)
5. **Implement authentication** for outbound calls
6. **Log and monitor** all calls
7. **GDPR compliance** for EU users (data retention policies)

## Production Deployment

### Recommended Stack

- **Cloud Platform**: AWS, GCP, or Azure
- **Web Server**: Gunicorn (Python) or PM2 (Node.js)
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt
- **Database**: PostgreSQL (for conversation storage)
- **Monitoring**: CloudWatch, Datadog, or Prometheus

### Example Nginx Configuration

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Scaling Considerations

- Use load balancers for multiple instances
- Implement Redis for session storage
- Use message queues (RabbitMQ, SQS) for async processing
- Database connection pooling
- CDN for static assets

## Next Steps

1. **Test the integration** with sample calls
2. **Customize AI responses** for your use case
3. **Add error handling** and logging
4. **Implement analytics** (call duration, success rate)
5. **Add features** like call transfer, conferencing
6. **Deploy to production** with proper monitoring
7. **Gather user feedback** and iterate

## Support and Resources

- **Vonage Docs**: https://developer.vonage.com/
- **OpenAI Docs**: https://platform.openai.com/docs
- **Vonage Community**: https://developer.vonage.com/community
- **Stack Overflow**: Tag questions with `vonage` and `openai`

## Example Use Cases

1. **Customer Support**: Automated phone support in Farsi
2. **Language Learning**: Practice Farsi conversation
3. **Information Hotline**: Automated information service
4. **Appointment Booking**: Voice-based scheduling
5. **Survey System**: Conduct phone surveys
6. **Accessibility**: Voice interface for applications
7. **Elder Care**: AI companion for elderly Farsi speakers

---

Happy building! 🚀
