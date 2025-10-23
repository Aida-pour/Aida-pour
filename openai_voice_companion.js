/**
 * OpenAI Voice Chat Companion with Farsi Transcription Support (Node.js)
 * This module provides a voice-enabled chat companion using OpenAI's APIs
 * with support for Farsi language transcription and text-to-speech.
 */

const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class FarsiVoiceChatCompanion {
  /**
   * Initialize the voice chat companion.
   *
   * @param {Object} options - Configuration options
   * @param {string} options.apiKey - OpenAI API key (or set OPENAI_API_KEY env variable)
   * @param {string} options.model - GPT model to use for chat (default: "gpt-4")
   * @param {string} options.voice - Voice for TTS (alloy, echo, fable, onyx, nova, shimmer)
   * @param {string} options.language - Language code (fa for Farsi)
   */
  constructor(options = {}) {
    this.apiKey = options.apiKey || process.env.OPENAI_API_KEY;

    if (!this.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    this.client = new OpenAI({ apiKey: this.apiKey });

    this.model = options.model || 'gpt-4';
    this.voice = options.voice || 'nova';
    this.language = options.language || 'fa'; // Farsi language code

    // Conversation history
    this.conversationHistory = [];
  }

  /**
   * Transcribe audio to text using OpenAI's Whisper API with Farsi support.
   *
   * @param {string} audioFilePath - Path to the audio file
   * @returns {Promise<string>} Transcribed text in Farsi
   */
  async transcribeAudio(audioFilePath) {
    console.log(`Transcribing audio from ${audioFilePath}...`);

    const audioFile = fs.createReadStream(audioFilePath);

    const transcript = await this.client.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: this.language, // Farsi language
      response_format: 'text'
    });

    console.log(`Transcription: ${transcript}`);
    return transcript;
  }

  /**
   * Send a message to the chat model and get a response.
   *
   * @param {string} userMessage - The user's message
   * @param {string} systemPrompt - Optional system prompt for context
   * @returns {Promise<string>} The assistant's response
   */
  async chat(userMessage, systemPrompt = null) {
    const messages = [];

    // Add system prompt if provided
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    } else if (this.conversationHistory.length === 0) {
      // Default system prompt for Farsi support
      messages.push({
        role: 'system',
        content: 'You are a helpful AI assistant that can communicate in Farsi (Persian). Respond naturally and helpfully to the user\'s questions.'
      });
    }

    // Add conversation history
    messages.push(...this.conversationHistory);

    // Add current user message
    messages.push({ role: 'user', content: userMessage });

    console.log(`Sending message to ${this.model}...`);

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: messages
    });

    const assistantMessage = response.choices[0].message.content;

    // Update conversation history
    this.conversationHistory.push({ role: 'user', content: userMessage });
    this.conversationHistory.push({ role: 'assistant', content: assistantMessage });

    console.log(`Assistant: ${assistantMessage}`);
    return assistantMessage;
  }

  /**
   * Convert text to speech using OpenAI's TTS API.
   *
   * @param {string} text - Text to convert to speech
   * @param {string} outputFile - Path to save the audio file
   * @returns {Promise<string>} Path to the generated audio file
   */
  async textToSpeech(text, outputFile = 'output.mp3') {
    console.log('Converting text to speech...');

    const mp3 = await this.client.audio.speech.create({
      model: 'tts-1',
      voice: this.voice,
      input: text
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(outputFile, buffer);

    console.log(`Audio saved to ${outputFile}`);
    return outputFile;
  }

  /**
   * Play an audio file using system audio player.
   *
   * @param {string} audioFile - Path to the audio file
   */
  async playAudio(audioFile) {
    return new Promise((resolve, reject) => {
      let player;

      // Try different audio players based on platform
      if (process.platform === 'darwin') {
        // macOS
        player = spawn('afplay', [audioFile]);
      } else if (process.platform === 'linux') {
        // Linux
        player = spawn('mpg123', [audioFile]);
      } else if (process.platform === 'win32') {
        // Windows
        player = spawn('powershell', ['-c', `(New-Object Media.SoundPlayer '${audioFile}').PlaySync()`]);
      }

      if (player) {
        player.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            console.log(`Audio saved to ${audioFile}. Please play it with your preferred audio player.`);
            resolve();
          }
        });

        player.on('error', (err) => {
          console.log(`Could not play audio automatically: ${err.message}`);
          console.log(`Audio saved to ${audioFile}. Please play it with your preferred audio player.`);
          resolve();
        });
      } else {
        console.log(`Audio saved to ${audioFile}. Please play it with your preferred audio player.`);
        resolve();
      }
    });
  }

  /**
   * Execute one turn of voice conversation: transcribe -> chat -> speak.
   *
   * @param {string} audioInputFile - Path to the recorded audio file
   * @param {boolean} playResponse - Whether to play the assistant's response as audio
   * @returns {Promise<Object>} Object with user_text and assistant_text
   */
  async voiceConversationTurn(audioInputFile, playResponse = true) {
    // Transcribe to Farsi text
    const userText = await this.transcribeAudio(audioInputFile);

    // Get chat response
    const responseText = await this.chat(userText);

    // Convert response to speech
    if (playResponse) {
      const audioResponse = await this.textToSpeech(responseText);
      await this.playAudio(audioResponse);
    }

    return {
      user_text: userText,
      assistant_text: responseText
    };
  }

  /**
   * Save the conversation history to a JSON file.
   *
   * @param {string} filename - Path to save the conversation
   */
  async saveConversation(filename = 'conversation.json') {
    const data = {
      timestamp: new Date().toISOString(),
      language: this.language,
      conversation: this.conversationHistory
    };

    await fs.promises.writeFile(
      filename,
      JSON.stringify(data, null, 2),
      'utf-8'
    );

    console.log(`Conversation saved to ${filename}`);
  }

  /**
   * Load a conversation history from a JSON file.
   *
   * @param {string} filename - Path to the conversation file
   */
  async loadConversation(filename) {
    const data = JSON.parse(
      await fs.promises.readFile(filename, 'utf-8')
    );

    this.conversationHistory = data.conversation || [];
    console.log(`Conversation loaded from ${filename}`);
  }

  /**
   * Clear the conversation history.
   */
  clearConversation() {
    this.conversationHistory = [];
    console.log('Conversation history cleared.');
  }
}

// Example usage
async function main() {
  console.log('='.repeat(60));
  console.log('OpenAI Farsi Voice Chat Companion (Node.js)');
  console.log('='.repeat(60));

  try {
    // Initialize the companion
    const companion = new FarsiVoiceChatCompanion({
      model: 'gpt-4',
      voice: 'nova',
      language: 'fa'
    });

    // Example 1: Text conversation
    console.log('\n--- Example 1: Text Conversation ---');
    const response1 = await companion.chat('سلام! چطوری؟');
    console.log(`Response: ${response1}`);

    // Example 2: Transcribe an audio file (you need to provide an audio file)
    // console.log('\n--- Example 2: Transcribe Audio ---');
    // const transcript = await companion.transcribeAudio('path/to/audio.mp3');
    // console.log(`Transcript: ${transcript}`);

    // Example 3: Text-to-Speech
    console.log('\n--- Example 3: Text to Speech ---');
    await companion.textToSpeech('سلام! من یک دستیار هوش مصنوعی هستم.', 'farsi_greeting.mp3');

    // Example 4: Full voice conversation (requires audio file)
    // console.log('\n--- Example 4: Voice Conversation Turn ---');
    // const result = await companion.voiceConversationTurn('input_audio.mp3', true);
    // console.log(`You said: ${result.user_text}`);
    // console.log(`Assistant: ${result.assistant_text}`);

    // Example 5: Save conversation
    console.log('\n--- Example 5: Save Conversation ---');
    await companion.saveConversation('my_conversation.json');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = FarsiVoiceChatCompanion;
