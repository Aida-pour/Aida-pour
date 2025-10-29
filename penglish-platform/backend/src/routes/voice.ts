import express from 'express';
import OpenAI from 'openai';
import { z } from 'zod';

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Text-to-Speech endpoint
const ttsSchema = z.object({
  text: z.string(),
  voice: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']).optional(),
});

router.post('/tts', async (req, res) => {
  try {
    const body = ttsSchema.parse(req.body);

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: body.voice || 'nova',
      input: body.text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('TTS error:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

// Speech-to-Text endpoint (transcription)
router.post('/transcribe', async (req, res) => {
  try {
    // This would handle audio file upload
    // For now, return a placeholder
    res.status(501).json({
      error: 'Not implemented',
      message: 'Audio transcription will be implemented with file upload support',
    });
  } catch (error) {
    console.error('Transcribe error:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// Check pronunciation endpoint
const pronunciationSchema = z.object({
  text: z.string(),
  userAudio: z.string(), // Base64 encoded audio
});

router.post('/check-pronunciation', async (req, res) => {
  try {
    const body = pronunciationSchema.parse(req.body);

    // This would use Whisper API to transcribe user audio
    // Then compare with expected text
    // For now, return a placeholder
    res.status(501).json({
      error: 'Not implemented',
      message: 'Pronunciation checking will be implemented with Whisper API',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Check pronunciation error:', error);
    res.status(500).json({ error: 'Failed to check pronunciation' });
  }
});

export default router;
