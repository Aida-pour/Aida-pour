#!/usr/bin/env python3
"""
Example usage of the OpenAI Farsi Voice Chat Companion.
This file demonstrates various use cases and features.
"""

import os
from openai_voice_companion import FarsiVoiceChatCompanion


def example_text_conversation():
    """Example: Simple text conversation in Farsi."""
    print("\n" + "=" * 60)
    print("Example 1: Text Conversation")
    print("=" * 60)

    companion = FarsiVoiceChatCompanion(
        model="gpt-4",
        language="fa"
    )

    # Send a Farsi message
    response = companion.chat("سلام! چطوری؟ می‌تونی کمکم کنی؟")
    print(f"\nAssistant Response: {response}")

    # Continue the conversation
    response = companion.chat("درباره هوش مصنوعی بگو")
    print(f"\nAssistant Response: {response}")


def example_transcription():
    """Example: Transcribe an audio file to Farsi text."""
    print("\n" + "=" * 60)
    print("Example 2: Audio Transcription")
    print("=" * 60)

    companion = FarsiVoiceChatCompanion(language="fa")

    # Note: You need to provide an actual audio file
    audio_file = "sample_farsi_audio.mp3"

    if os.path.exists(audio_file):
        transcript = companion.transcribe_audio(audio_file)
        print(f"\nTranscription: {transcript}")
    else:
        print(f"\nAudio file '{audio_file}' not found. Skipping this example.")
        print("To test transcription, record or download a Farsi audio file.")


def example_text_to_speech():
    """Example: Convert Farsi text to speech."""
    print("\n" + "=" * 60)
    print("Example 3: Text-to-Speech")
    print("=" * 60)

    companion = FarsiVoiceChatCompanion(
        voice="nova",  # or try: alloy, echo, fable, onyx, shimmer
        language="fa"
    )

    farsi_text = "سلام! من یک دستیار هوش مصنوعی هستم که می‌توانم به زبان فارسی صحبت کنم."

    audio_file = companion.text_to_speech(farsi_text, "farsi_greeting.mp3")
    print(f"\nGenerated audio file: {audio_file}")

    # Optionally play the audio
    play = input("Do you want to play the audio? (y/n): ").strip().lower()
    if play == 'y':
        companion.play_audio(audio_file)


def example_voice_conversation():
    """Example: Full voice conversation turn."""
    print("\n" + "=" * 60)
    print("Example 4: Voice Conversation Turn")
    print("=" * 60)

    companion = FarsiVoiceChatCompanion(
        model="gpt-4",
        voice="nova",
        language="fa"
    )

    print("\nThis will record your voice for 5 seconds.")
    print("Make sure you have a microphone connected.")

    proceed = input("Do you want to proceed? (y/n): ").strip().lower()

    if proceed == 'y':
        try:
            result = companion.voice_conversation_turn(
                record_duration=5,
                play_response=True
            )

            print(f"\nYou said: {result['user_text']}")
            print(f"Assistant: {result['assistant_text']}")
        except Exception as e:
            print(f"\nError during voice conversation: {e}")
            print("Make sure you have a microphone connected and PyAudio installed.")
    else:
        print("Skipping voice conversation example.")


def example_conversation_management():
    """Example: Save and load conversation history."""
    print("\n" + "=" * 60)
    print("Example 5: Conversation Management")
    print("=" * 60)

    companion = FarsiVoiceChatCompanion(language="fa")

    # Have a conversation
    companion.chat("سلام")
    companion.chat("هوا چطوره؟")
    companion.chat("ممنون")

    # Save the conversation
    companion.save_conversation("test_conversation.json")

    # Clear and load
    companion.clear_conversation()
    print(f"\nConversation history cleared. Length: {len(companion.conversation_history)}")

    companion.load_conversation("test_conversation.json")
    print(f"Conversation loaded. Length: {len(companion.conversation_history)}")


def example_multilingual():
    """Example: Mixed Farsi and English conversation."""
    print("\n" + "=" * 60)
    print("Example 6: Multilingual Conversation")
    print("=" * 60)

    companion = FarsiVoiceChatCompanion(
        model="gpt-4",
        language="fa"
    )

    # Mix Farsi and English
    response = companion.chat("Can you explain artificial intelligence in Farsi?")
    print(f"\nAssistant Response: {response}")

    response = companion.chat("حالا به انگلیسی توضیح بده")
    print(f"\nAssistant Response: {response}")


def example_custom_system_prompt():
    """Example: Using a custom system prompt."""
    print("\n" + "=" * 60)
    print("Example 7: Custom System Prompt")
    print("=" * 60)

    companion = FarsiVoiceChatCompanion(language="fa")

    system_prompt = """You are a Farsi language tutor. Help users learn Farsi by:
    1. Explaining grammar and vocabulary
    2. Providing examples
    3. Correcting mistakes
    Always respond in Farsi unless asked otherwise."""

    response = companion.chat(
        "Hello, I want to learn basic Farsi greetings",
        system_prompt=system_prompt
    )
    print(f"\nAssistant Response: {response}")


def main():
    """Run all examples."""
    print("\n" + "=" * 70)
    print(" OpenAI Farsi Voice Chat Companion - Examples")
    print("=" * 70)

    # Check for API key
    if not os.getenv("OPENAI_API_KEY"):
        print("\nWARNING: OPENAI_API_KEY environment variable not set!")
        print("Please set it with: export OPENAI_API_KEY='your-api-key-here'")
        return

    examples = [
        ("Text Conversation", example_text_conversation),
        ("Audio Transcription", example_transcription),
        ("Text-to-Speech", example_text_to_speech),
        ("Voice Conversation", example_voice_conversation),
        ("Conversation Management", example_conversation_management),
        ("Multilingual", example_multilingual),
        ("Custom System Prompt", example_custom_system_prompt)
    ]

    print("\nAvailable examples:")
    for i, (name, _) in enumerate(examples, 1):
        print(f"{i}. {name}")
    print("0. Run all examples")

    choice = input("\nSelect an example (0-7): ").strip()

    try:
        if choice == "0":
            for name, func in examples:
                try:
                    func()
                except Exception as e:
                    print(f"\nError in {name}: {e}")
        else:
            idx = int(choice) - 1
            if 0 <= idx < len(examples):
                examples[idx][1]()
            else:
                print("Invalid choice!")
    except ValueError:
        print("Invalid input!")
    except KeyboardInterrupt:
        print("\n\nExamples interrupted by user.")
    except Exception as e:
        print(f"\nError: {e}")


if __name__ == "__main__":
    main()
