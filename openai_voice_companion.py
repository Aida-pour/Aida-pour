"""
OpenAI Voice Chat Companion with Farsi Transcription Support
This module provides a voice-enabled chat companion using OpenAI's APIs
with support for Farsi language transcription and text-to-speech.
"""

import os
import json
from pathlib import Path
from typing import Optional, List, Dict
import asyncio
from datetime import datetime

try:
    from openai import OpenAI, AsyncOpenAI
    import pyaudio
    import wave
except ImportError:
    print("Please install required packages: pip install openai pyaudio")
    raise


class FarsiVoiceChatCompanion:
    """
    A voice-enabled chat companion with Farsi support using OpenAI's API.
    Supports both speech-to-text (transcription) and text-to-speech.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        model: str = "gpt-4",
        voice: str = "nova",
        language: str = "fa",  # Farsi language code
        sample_rate: int = 16000,
        chunk_size: int = 1024
    ):
        """
        Initialize the voice chat companion.

        Args:
            api_key: OpenAI API key (or set OPENAI_API_KEY env variable)
            model: GPT model to use for chat
            voice: Voice for TTS (alloy, echo, fable, onyx, nova, shimmer)
            language: Language code (fa for Farsi)
            sample_rate: Audio sample rate in Hz
            chunk_size: Audio chunk size for processing
        """
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OpenAI API key is required")

        self.client = OpenAI(api_key=self.api_key)
        self.async_client = AsyncOpenAI(api_key=self.api_key)

        self.model = model
        self.voice = voice
        self.language = language
        self.sample_rate = sample_rate
        self.chunk_size = chunk_size

        # Conversation history
        self.conversation_history: List[Dict[str, str]] = []

        # Audio settings
        self.audio_format = pyaudio.paInt16
        self.channels = 1

    def record_audio(self, duration: int = 5, output_file: str = "input.wav") -> str:
        """
        Record audio from microphone.

        Args:
            duration: Recording duration in seconds
            output_file: Path to save the recording

        Returns:
            Path to the recorded audio file
        """
        print(f"Recording for {duration} seconds...")

        p = pyaudio.PyAudio()

        stream = p.open(
            format=self.audio_format,
            channels=self.channels,
            rate=self.sample_rate,
            input=True,
            frames_per_buffer=self.chunk_size
        )

        frames = []
        for i in range(0, int(self.sample_rate / self.chunk_size * duration)):
            data = stream.read(self.chunk_size)
            frames.append(data)

        print("Recording finished.")

        stream.stop_stream()
        stream.close()
        p.terminate()

        # Save the recording
        wf = wave.open(output_file, 'wb')
        wf.setnchannels(self.channels)
        wf.setsampwidth(p.get_sample_size(self.audio_format))
        wf.setframerate(self.sample_rate)
        wf.writeframes(b''.join(frames))
        wf.close()

        return output_file

    def transcribe_audio(self, audio_file: str) -> str:
        """
        Transcribe audio to text using OpenAI's Whisper API with Farsi support.

        Args:
            audio_file: Path to the audio file

        Returns:
            Transcribed text in Farsi
        """
        print(f"Transcribing audio from {audio_file}...")

        with open(audio_file, "rb") as audio:
            transcript = self.client.audio.transcriptions.create(
                model="whisper-1",
                file=audio,
                language=self.language,  # Farsi language
                response_format="text"
            )

        print(f"Transcription: {transcript}")
        return transcript

    def chat(self, user_message: str, system_prompt: Optional[str] = None) -> str:
        """
        Send a message to the chat model and get a response.

        Args:
            user_message: The user's message
            system_prompt: Optional system prompt for context

        Returns:
            The assistant's response
        """
        messages = []

        # Add system prompt if provided
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        elif not self.conversation_history:
            # Default system prompt for Farsi support
            messages.append({
                "role": "system",
                "content": "You are a helpful AI assistant that can communicate in Farsi (Persian). Respond naturally and helpfully to the user's questions."
            })

        # Add conversation history
        messages.extend(self.conversation_history)

        # Add current user message
        messages.append({"role": "user", "content": user_message})

        print(f"Sending message to {self.model}...")

        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages
        )

        assistant_message = response.choices[0].message.content

        # Update conversation history
        self.conversation_history.append({"role": "user", "content": user_message})
        self.conversation_history.append({"role": "assistant", "content": assistant_message})

        print(f"Assistant: {assistant_message}")
        return assistant_message

    def text_to_speech(self, text: str, output_file: str = "output.mp3") -> str:
        """
        Convert text to speech using OpenAI's TTS API.

        Args:
            text: Text to convert to speech
            output_file: Path to save the audio file

        Returns:
            Path to the generated audio file
        """
        print(f"Converting text to speech...")

        response = self.client.audio.speech.create(
            model="tts-1",
            voice=self.voice,
            input=text
        )

        response.stream_to_file(output_file)
        print(f"Audio saved to {output_file}")

        return output_file

    def play_audio(self, audio_file: str):
        """
        Play an audio file.

        Args:
            audio_file: Path to the audio file (WAV or MP3)
        """
        try:
            import subprocess

            # Try to use system audio player
            if os.path.exists("/usr/bin/mpg123"):
                subprocess.run(["mpg123", audio_file])
            elif os.path.exists("/usr/bin/ffplay"):
                subprocess.run(["ffplay", "-nodisp", "-autoexit", audio_file])
            else:
                print(f"Audio saved to {audio_file}. Please play it with your preferred audio player.")
        except Exception as e:
            print(f"Could not play audio automatically: {e}")
            print(f"Audio saved to {audio_file}. Please play it with your preferred audio player.")

    def voice_conversation_turn(
        self,
        record_duration: int = 5,
        play_response: bool = True
    ) -> Dict[str, str]:
        """
        Execute one turn of voice conversation: record -> transcribe -> chat -> speak.

        Args:
            record_duration: Duration to record user's voice in seconds
            play_response: Whether to play the assistant's response as audio

        Returns:
            Dictionary with transcription and response
        """
        # Record user audio
        audio_file = self.record_audio(duration=record_duration)

        # Transcribe to Farsi text
        user_text = self.transcribe_audio(audio_file)

        # Get chat response
        response_text = self.chat(user_text)

        # Convert response to speech
        if play_response:
            audio_response = self.text_to_speech(response_text)
            self.play_audio(audio_response)

        return {
            "user_text": user_text,
            "assistant_text": response_text
        }

    async def async_voice_conversation_turn(
        self,
        record_duration: int = 5,
        play_response: bool = True
    ) -> Dict[str, str]:
        """
        Async version of voice conversation turn.
        """
        # Record user audio (sync operation)
        audio_file = self.record_audio(duration=record_duration)

        # Transcribe to Farsi text
        with open(audio_file, "rb") as audio:
            transcript = await self.async_client.audio.transcriptions.create(
                model="whisper-1",
                file=audio,
                language=self.language,
                response_format="text"
            )

        user_text = transcript

        # Get chat response
        messages = self.conversation_history + [{"role": "user", "content": user_text}]
        response = await self.async_client.chat.completions.create(
            model=self.model,
            messages=messages
        )

        response_text = response.choices[0].message.content

        # Update conversation history
        self.conversation_history.append({"role": "user", "content": user_text})
        self.conversation_history.append({"role": "assistant", "content": response_text})

        # Convert response to speech
        if play_response:
            audio_response = await self.async_client.audio.speech.create(
                model="tts-1",
                voice=self.voice,
                input=response_text
            )

            output_file = "output.mp3"
            audio_response.stream_to_file(output_file)
            self.play_audio(output_file)

        return {
            "user_text": user_text,
            "assistant_text": response_text
        }

    def save_conversation(self, filename: str = "conversation.json"):
        """
        Save the conversation history to a JSON file.

        Args:
            filename: Path to save the conversation
        """
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump({
                "timestamp": datetime.now().isoformat(),
                "language": self.language,
                "conversation": self.conversation_history
            }, f, ensure_ascii=False, indent=2)

        print(f"Conversation saved to {filename}")

    def load_conversation(self, filename: str):
        """
        Load a conversation history from a JSON file.

        Args:
            filename: Path to the conversation file
        """
        with open(filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
            self.conversation_history = data.get("conversation", [])

        print(f"Conversation loaded from {filename}")

    def clear_conversation(self):
        """Clear the conversation history."""
        self.conversation_history = []
        print("Conversation history cleared.")


def main():
    """
    Example usage of the Farsi Voice Chat Companion.
    """
    print("=" * 60)
    print("OpenAI Farsi Voice Chat Companion")
    print("=" * 60)

    # Initialize the companion
    companion = FarsiVoiceChatCompanion(
        model="gpt-4",
        voice="nova",
        language="fa"
    )

    print("\nAvailable commands:")
    print("1. Voice conversation (record and chat)")
    print("2. Text conversation (type and chat)")
    print("3. Transcribe audio file")
    print("4. Save conversation")
    print("5. Exit")

    while True:
        print("\n" + "-" * 60)
        choice = input("\nEnter your choice (1-5): ").strip()

        if choice == "1":
            duration = input("Recording duration in seconds (default 5): ").strip()
            duration = int(duration) if duration else 5

            try:
                result = companion.voice_conversation_turn(
                    record_duration=duration,
                    play_response=True
                )
                print(f"\nYou said (Farsi): {result['user_text']}")
                print(f"Assistant: {result['assistant_text']}")
            except Exception as e:
                print(f"Error: {e}")

        elif choice == "2":
            user_input = input("\nYour message (Farsi or English): ").strip()
            if user_input:
                try:
                    response = companion.chat(user_input)

                    # Optionally convert to speech
                    speak = input("Convert response to speech? (y/n): ").strip().lower()
                    if speak == 'y':
                        audio_file = companion.text_to_speech(response)
                        companion.play_audio(audio_file)
                except Exception as e:
                    print(f"Error: {e}")

        elif choice == "3":
            audio_file = input("Enter audio file path: ").strip()
            if os.path.exists(audio_file):
                try:
                    transcript = companion.transcribe_audio(audio_file)
                    print(f"\nTranscription: {transcript}")
                except Exception as e:
                    print(f"Error: {e}")
            else:
                print("File not found!")

        elif choice == "4":
            filename = input("Save conversation to (default: conversation.json): ").strip()
            filename = filename if filename else "conversation.json"
            companion.save_conversation(filename)

        elif choice == "5":
            print("\nGoodbye!")
            break

        else:
            print("Invalid choice. Please try again.")


if __name__ == "__main__":
    main()
