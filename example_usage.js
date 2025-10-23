/**
 * Example usage of the OpenAI Farsi Voice Chat Companion (Node.js).
 * This file demonstrates various use cases and features.
 */

const FarsiVoiceChatCompanion = require('./openai_voice_companion.js');
const fs = require('fs');

async function exampleTextConversation() {
  console.log('\n' + '='.repeat(60));
  console.log('Example 1: Text Conversation');
  console.log('='.repeat(60));

  const companion = new FarsiVoiceChatCompanion({
    model: 'gpt-4',
    language: 'fa'
  });

  // Send a Farsi message
  const response1 = await companion.chat('سلام! چطوری؟ می‌تونی کمکم کنی؟');
  console.log(`\nAssistant Response: ${response1}`);

  // Continue the conversation
  const response2 = await companion.chat('درباره هوش مصنوعی بگو');
  console.log(`\nAssistant Response: ${response2}`);
}

async function exampleTranscription() {
  console.log('\n' + '='.repeat(60));
  console.log('Example 2: Audio Transcription');
  console.log('='.repeat(60));

  const companion = new FarsiVoiceChatCompanion({ language: 'fa' });

  // Note: You need to provide an actual audio file
  const audioFile = 'sample_farsi_audio.mp3';

  if (fs.existsSync(audioFile)) {
    const transcript = await companion.transcribeAudio(audioFile);
    console.log(`\nTranscription: ${transcript}`);
  } else {
    console.log(`\nAudio file '${audioFile}' not found. Skipping this example.`);
    console.log('To test transcription, record or download a Farsi audio file.');
  }
}

async function exampleTextToSpeech() {
  console.log('\n' + '='.repeat(60));
  console.log('Example 3: Text-to-Speech');
  console.log('='.repeat(60));

  const companion = new FarsiVoiceChatCompanion({
    voice: 'nova', // or try: alloy, echo, fable, onyx, shimmer
    language: 'fa'
  });

  const farsiText = 'سلام! من یک دستیار هوش مصنوعی هستم که می‌توانم به زبان فارسی صحبت کنم.';

  const audioFile = await companion.textToSpeech(farsiText, 'farsi_greeting.mp3');
  console.log(`\nGenerated audio file: ${audioFile}`);
  console.log('You can play this file with any audio player.');
}

async function exampleVoiceConversation() {
  console.log('\n' + '='.repeat(60));
  console.log('Example 4: Voice Conversation Turn');
  console.log('='.repeat(60));

  const companion = new FarsiVoiceChatCompanion({
    model: 'gpt-4',
    voice: 'nova',
    language: 'fa'
  });

  // Note: You need to provide a pre-recorded audio file
  const inputAudioFile = 'user_input.mp3';

  if (fs.existsSync(inputAudioFile)) {
    try {
      const result = await companion.voiceConversationTurn(inputAudioFile, true);

      console.log(`\nYou said: ${result.user_text}`);
      console.log(`Assistant: ${result.assistant_text}`);
    } catch (error) {
      console.error(`\nError during voice conversation: ${error.message}`);
    }
  } else {
    console.log(`\nInput audio file '${inputAudioFile}' not found.`);
    console.log('To test voice conversation, provide a recorded audio file.');
  }
}

async function exampleConversationManagement() {
  console.log('\n' + '='.repeat(60));
  console.log('Example 5: Conversation Management');
  console.log('='.repeat(60));

  const companion = new FarsiVoiceChatCompanion({ language: 'fa' });

  // Have a conversation
  await companion.chat('سلام');
  await companion.chat('هوا چطوره؟');
  await companion.chat('ممنون');

  // Save the conversation
  await companion.saveConversation('test_conversation.json');

  // Clear and load
  companion.clearConversation();
  console.log(`\nConversation history cleared. Length: ${companion.conversationHistory.length}`);

  await companion.loadConversation('test_conversation.json');
  console.log(`Conversation loaded. Length: ${companion.conversationHistory.length}`);
}

async function exampleMultilingual() {
  console.log('\n' + '='.repeat(60));
  console.log('Example 6: Multilingual Conversation');
  console.log('='.repeat(60));

  const companion = new FarsiVoiceChatCompanion({
    model: 'gpt-4',
    language: 'fa'
  });

  // Mix Farsi and English
  const response1 = await companion.chat('Can you explain artificial intelligence in Farsi?');
  console.log(`\nAssistant Response: ${response1}`);

  const response2 = await companion.chat('حالا به انگلیسی توضیح بده');
  console.log(`\nAssistant Response: ${response2}`);
}

async function exampleCustomSystemPrompt() {
  console.log('\n' + '='.repeat(60));
  console.log('Example 7: Custom System Prompt');
  console.log('='.repeat(60));

  const companion = new FarsiVoiceChatCompanion({ language: 'fa' });

  const systemPrompt = `You are a Farsi language tutor. Help users learn Farsi by:
1. Explaining grammar and vocabulary
2. Providing examples
3. Correcting mistakes
Always respond in Farsi unless asked otherwise.`;

  const response = await companion.chat(
    'Hello, I want to learn basic Farsi greetings',
    systemPrompt
  );
  console.log(`\nAssistant Response: ${response}`);
}

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log(' OpenAI Farsi Voice Chat Companion - Examples (Node.js)');
  console.log('='.repeat(70));

  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    console.log('\nWARNING: OPENAI_API_KEY environment variable not set!');
    console.log('Please set it with: export OPENAI_API_KEY=\'your-api-key-here\'');
    return;
  }

  const examples = [
    exampleTextConversation,
    exampleTranscription,
    exampleTextToSpeech,
    exampleVoiceConversation,
    exampleConversationManagement,
    exampleMultilingual,
    exampleCustomSystemPrompt
  ];

  // Run all examples
  for (const example of examples) {
    try {
      await example();
    } catch (error) {
      console.error(`\nError in example: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('All examples completed!');
  console.log('='.repeat(70));
}

// Run examples if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  exampleTextConversation,
  exampleTranscription,
  exampleTextToSpeech,
  exampleVoiceConversation,
  exampleConversationManagement,
  exampleMultilingual,
  exampleCustomSystemPrompt
};
