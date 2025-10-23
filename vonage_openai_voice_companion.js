/**
 * Vonage + OpenAI Voice Integration (Node.js)
 * Combines Vonage Voice API with OpenAI for phone-based AI voice companion with Farsi support.
 */

const { Vonage } = require('@vonage/server-sdk');
const { Auth } = require('@vonage/auth');
const { Voice } = require('@vonage/voice');
const OpenAI = require('openai');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

class VonageOpenAIVoiceCompanion {
  /**
   * Integrates Vonage Voice API with OpenAI for phone-based AI conversations in Farsi.
   */
  constructor(options = {}) {
    // Vonage credentials
    this.vonageApiKey = options.vonageApiKey || process.env.VONAGE_API_KEY;
    this.vonageApiSecret = options.vonageApiSecret || process.env.VONAGE_API_SECRET;
    this.vonageApplicationId = options.vonageApplicationId || process.env.VONAGE_APPLICATION_ID;
    this.vonagePrivateKeyPath = options.vonagePrivateKeyPath || process.env.VONAGE_PRIVATE_KEY_PATH;
    this.vonagePhoneNumber = options.vonagePhoneNumber || process.env.VONAGE_PHONE_NUMBER;

    // OpenAI credentials
    this.openaiApiKey = options.openaiApiKey || process.env.OPENAI_API_KEY;

    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key is required');
    }

    // Initialize OpenAI client
    this.openaiClient = new OpenAI({ apiKey: this.openaiApiKey });

    // Initialize Vonage client
    if (this.vonageApiKey && this.vonageApiSecret) {
      this.vonageClient = new Vonage({
        apiKey: this.vonageApiKey,
        apiSecret: this.vonageApiSecret
      });
    }

    // Initialize Vonage Voice with JWT (for advanced features)
    if (this.vonageApplicationId && this.vonagePrivateKeyPath) {
      this.vonageVoiceClient = new Vonage({
        applicationId: this.vonageApplicationId,
        privateKey: this.vonagePrivateKeyPath
      });
    }

    // AI settings
    this.model = options.model || 'gpt-4';
    this.voice = options.voice || 'nova';
    this.language = options.language || 'fa';

    // Store active conversations
    this.conversations = new Map();
    this.callStates = new Map();
  }

  /**
   * Create Express app with Vonage webhook handlers.
   */
  createExpressApp(baseUrl) {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    const companion = this;

    // Answer webhook - handles incoming calls
    app.all('/webhooks/answer', async (req, res) => {
      const data = req.method === 'POST' ? req.body : req.query;
      const callUuid = data.uuid;
      const fromNumber = data.from;

      console.log(`Incoming call from ${fromNumber}, UUID: ${callUuid}`);

      // Initialize conversation for this call
      companion.conversations.set(callUuid, []);
      companion.callStates.set(callUuid, {
        from: fromNumber,
        startTime: new Date().toISOString(),
        language: companion.language
      });

      // NCCO (Nexmo Call Control Object) response
      const ncco = [
        {
          action: 'talk',
          text: 'سلام! به دستیار هوش مصنوعی خوش آمدید. لطفا صحبت کنید.',
          language: 'fa-IR',
          style: 0
        },
        {
          action: 'record',
          eventUrl: [`${baseUrl}/webhooks/recording`],
          endOnSilence: 3,
          endOnKey: '#',
          beepStart: false,
          channels: 1,
          format: 'mp3'
        }
      ];

      res.json(ncco);
    });

    // Recording webhook - handles recorded audio
    app.post('/webhooks/recording', async (req, res) => {
      const data = req.body;
      const callUuid = data.uuid;
      const recordingUrl = data.recording_url;

      console.log(`Recording received for call ${callUuid}: ${recordingUrl}`);

      if (!recordingUrl) {
        return res.json([{
          action: 'talk',
          text: 'متاسفم، صدای شما را نشنیدم. لطفا دوباره تلاش کنید.',
          language: 'fa-IR'
        }]);
      }

      try {
        // Download the recording
        const audioFile = await companion.downloadRecording(recordingUrl);

        // Transcribe with OpenAI Whisper
        const transcript = await companion.transcribeAudio(audioFile);
        console.log(`User said: ${transcript}`);

        // Get AI response
        const aiResponse = await companion.chat(callUuid, transcript);
        console.log(`AI response: ${aiResponse}`);

        // NCCO to speak response and record again
        const ncco = [
          {
            action: 'talk',
            text: aiResponse,
            language: 'fa-IR',
            style: 0
          },
          {
            action: 'record',
            eventUrl: [`${baseUrl}/webhooks/recording`],
            endOnSilence: 3,
            endOnKey: '#',
            beepStart: false,
            channels: 1,
            format: 'mp3'
          }
        ];

        res.json(ncco);
      } catch (error) {
        console.error(`Error processing recording: ${error.message}`);
        res.json([{
          action: 'talk',
          text: 'متاسفم، خطایی رخ داد. لطفا دوباره تماس بگیرید.',
          language: 'fa-IR'
        }]);
      }
    });

    // Event webhook - handles call events
    app.post('/webhooks/event', async (req, res) => {
      const data = req.body;
      console.log('Call event:', JSON.stringify(data, null, 2));

      const status = data.status;
      const callUuid = data.uuid;

      if (status === 'completed') {
        // Call ended, save conversation
        if (companion.conversations.has(callUuid)) {
          await companion.saveCallConversation(callUuid);
        }
      }

      res.status(204).send();
    });

    // Fallback webhook
    app.all('/webhooks/fallback', (req, res) => {
      res.json([{
        action: 'talk',
        text: 'متاسفم، خطایی رخ داد. لطفا بعدا تماس بگیرید.',
        language: 'fa-IR'
      }]);
    });

    // Make outbound call endpoint
    app.post('/make-call', async (req, res) => {
      const { to_number } = req.body;

      if (!to_number) {
        return res.status(400).json({ error: 'to_number is required' });
      }

      try {
        const callUuid = await companion.makeCall(to_number, baseUrl);
        res.json({ success: true, call_uuid: callUuid });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Web interface
    app.get('/', (req, res) => {
      const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Vonage + OpenAI Voice Companion</title>
    <style>
        body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; }
        h1 { color: #333; }
        .info { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; }
        button { background: #4CAF50; color: white; padding: 10px 20px; border: none;
                border-radius: 5px; cursor: pointer; font-size: 16px; }
        button:hover { background: #45a049; }
        input { padding: 10px; font-size: 16px; width: 300px; }
    </style>
</head>
<body>
    <h1>🎤 Vonage + OpenAI Voice Companion</h1>
    <div class="info">
        <h2>Farsi AI Voice Assistant</h2>
        <p>This service combines Vonage Voice API with OpenAI to create a phone-based AI companion.</p>
        <ul>
            <li>✅ Call the number to talk with AI in Farsi</li>
            <li>✅ Powered by OpenAI GPT-4 and Whisper</li>
            <li>✅ Real-time voice transcription</li>
            <li>✅ Natural conversation flow</li>
        </ul>
    </div>

    <h3>Make Test Call</h3>
    <input type="text" id="phoneNumber" placeholder="Enter phone number (+12345678900)" />
    <button onclick="makeCall()">📞 Make Call</button>
    <div id="result"></div>

    <script>
        async function makeCall() {
            const phoneNumber = document.getElementById('phoneNumber').value;
            const resultDiv = document.getElementById('result');

            if (!phoneNumber) {
                resultDiv.innerHTML = '<p style="color: red;">Please enter a phone number</p>';
                return;
            }

            resultDiv.innerHTML = '<p>Making call...</p>';

            try {
                const response = await fetch('/make-call', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ to_number: phoneNumber })
                });

                const data = await response.json();

                if (data.success) {
                    resultDiv.innerHTML = '<p style="color: green;">Call initiated! UUID: ' + data.call_uuid + '</p>';
                } else {
                    resultDiv.innerHTML = '<p style="color: red;">Error: ' + data.error + '</p>';
                }
            } catch (error) {
                resultDiv.innerHTML = '<p style="color: red;">Error: ' + error.message + '</p>';
            }
        }
    </script>
</body>
</html>
      `;
      res.send(html);
    });

    return app;
  }

  /**
   * Download recording from Vonage.
   */
  async downloadRecording(recordingUrl) {
    const response = await axios.get(recordingUrl, {
      responseType: 'arraybuffer'
    });

    // Save to temporary file
    const tempDir = os.tmpdir();
    const tempFile = path.join(tempDir, `recording_${Date.now()}.mp3`);

    await fs.writeFile(tempFile, response.data);

    return tempFile;
  }

  /**
   * Transcribe audio using OpenAI Whisper.
   */
  async transcribeAudio(audioFile) {
    const audioStream = require('fs').createReadStream(audioFile);

    const transcript = await this.openaiClient.audio.transcriptions.create({
      file: audioStream,
      model: 'whisper-1',
      language: this.language,
      response_format: 'text'
    });

    // Clean up temp file
    try {
      await fs.unlink(audioFile);
    } catch (error) {
      // Ignore cleanup errors
    }

    return transcript;
  }

  /**
   * Get AI response for user message.
   */
  async chat(callUuid, userMessage) {
    // Initialize conversation if needed
    if (!this.conversations.has(callUuid)) {
      this.conversations.set(callUuid, []);
    }

    const conversationHistory = this.conversations.get(callUuid);

    // Build messages
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful AI assistant speaking in Farsi (Persian). Keep responses concise and natural for phone conversations. Limit responses to 2-3 sentences.'
      },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    // Get AI response
    const response = await this.openaiClient.chat.completions.create({
      model: this.model,
      messages: messages
    });

    const aiResponse = response.choices[0].message.content;

    // Update conversation history
    conversationHistory.push({ role: 'user', content: userMessage });
    conversationHistory.push({ role: 'assistant', content: aiResponse });

    return aiResponse;
  }

  /**
   * Make an outbound call.
   */
  async makeCall(toNumber, baseUrl) {
    if (!this.vonageVoiceClient) {
      throw new Error('Vonage Voice client not initialized. Need application_id and private_key.');
    }

    const ncco = [
      {
        action: 'talk',
        text: 'سلام! این یک تماس از دستیار هوش مصنوعی است.',
        language: 'fa-IR'
      },
      {
        action: 'input',
        eventUrl: [`${baseUrl}/webhooks/input`],
        maxDigits: 1,
        submitOnHash: true
      }
    ];

    const response = await this.vonageVoiceClient.voice.createCall({
      to: [{ type: 'phone', number: toNumber }],
      from: { type: 'phone', number: this.vonagePhoneNumber },
      ncco: ncco
    });

    return response.uuid;
  }

  /**
   * Save conversation history to file.
   */
  async saveCallConversation(callUuid) {
    if (!this.conversations.has(callUuid)) {
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `call_conversation_${callUuid}_${timestamp}.json`;

    const data = {
      call_uuid: callUuid,
      call_info: this.callStates.get(callUuid) || {},
      conversation: this.conversations.get(callUuid),
      timestamp: new Date().toISOString()
    };

    await fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf-8');

    console.log(`Conversation saved to ${filename}`);

    // Clean up
    this.conversations.delete(callUuid);
    this.callStates.delete(callUuid);
  }
}

// Main function to run the server
async function main() {
  console.log('='.repeat(70));
  console.log('Vonage + OpenAI Voice Companion Server (Node.js)');
  console.log('='.repeat(70));

  // Your public server URL (use ngrok for testing)
  const BASE_URL = process.env.BASE_URL || 'https://your-server.com';
  const PORT = parseInt(process.env.PORT || '3000', 10);

  console.log(`\nServer will run on port ${PORT}`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log('\nMake sure to set the following environment variables:');
  console.log('- OPENAI_API_KEY');
  console.log('- VONAGE_API_KEY');
  console.log('- VONAGE_API_SECRET');
  console.log('- VONAGE_APPLICATION_ID (optional, for advanced features)');
  console.log('- VONAGE_PRIVATE_KEY_PATH (optional)');
  console.log('- VONAGE_PHONE_NUMBER (your Vonage number)');
  console.log('- BASE_URL (your public server URL)');

  try {
    const companion = new VonageOpenAIVoiceCompanion();
    const app = companion.createExpressApp(BASE_URL);

    console.log('\n' + '='.repeat(70));
    console.log('Server starting...');
    console.log(`Access web interface at: http://localhost:${PORT}`);
    console.log('Webhook endpoints:');
    console.log(`  - Answer URL: ${BASE_URL}/webhooks/answer`);
    console.log(`  - Event URL: ${BASE_URL}/webhooks/event`);
    console.log(`  - Recording URL: ${BASE_URL}/webhooks/recording`);
    console.log('='.repeat(70) + '\n');

    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`\nError: ${error.message}`);
    console.error('\nPlease ensure all required environment variables are set.');
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = VonageOpenAIVoiceCompanion;
