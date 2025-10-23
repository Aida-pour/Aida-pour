#!/usr/bin/env python3
"""
Example usage of Vonage + OpenAI Voice Integration.
This demonstrates various integration patterns.
"""

import os
from vonage_openai_voice_companion import VonageOpenAIVoiceCompanion


def example_start_server():
    """
    Example 1: Start the voice companion server.
    """
    print("\n" + "=" * 70)
    print("Example 1: Starting Vonage + OpenAI Voice Companion Server")
    print("=" * 70)

    # Make sure environment variables are set
    required_vars = [
        "OPENAI_API_KEY",
        "VONAGE_API_KEY",
        "VONAGE_API_SECRET",
        "VONAGE_PHONE_NUMBER",
        "BASE_URL"
    ]

    missing_vars = [var for var in required_vars if not os.getenv(var)]

    if missing_vars:
        print("\nMissing environment variables:")
        for var in missing_vars:
            print(f"  - {var}")
        print("\nPlease set these variables and try again.")
        return

    # Initialize companion
    companion = VonageOpenAIVoiceCompanion(
        model="gpt-4",
        voice="nova",
        language="fa"
    )

    # Create Flask app
    base_url = os.getenv("BASE_URL")
    app = companion.create_flask_app(base_url)

    print("\n📞 Voice companion server is ready!")
    print(f"   Call {os.getenv('VONAGE_PHONE_NUMBER')} to talk with the AI")
    print(f"   Web interface: http://localhost:5000")

    # Start server
    app.run(host='0.0.0.0', port=5000, debug=True)


def example_make_call():
    """
    Example 2: Make an outbound call programmatically.
    """
    print("\n" + "=" * 70)
    print("Example 2: Making Outbound Call")
    print("=" * 70)

    companion = VonageOpenAIVoiceCompanion()
    base_url = os.getenv("BASE_URL", "https://your-server.com")

    # Make a call
    to_number = input("Enter phone number to call (E.164 format, e.g., +12345678900): ")

    try:
        call_uuid = companion.make_call(to_number, base_url)
        print(f"\n✅ Call initiated successfully!")
        print(f"   Call UUID: {call_uuid}")
    except Exception as e:
        print(f"\n❌ Error making call: {e}")


def example_custom_greeting():
    """
    Example 3: Customize the greeting and AI behavior.
    """
    print("\n" + "=" * 70)
    print("Example 3: Custom Greeting and Behavior")
    print("=" * 70)

    companion = VonageOpenAIVoiceCompanion(
        model="gpt-4",
        language="fa"
    )

    # You can modify the greeting in the answer webhook
    # Or create a custom NCCO

    custom_ncco = [
        {
            "action": "talk",
            "text": "سلام! به سیستم پشتیبانی مشتری خوش آمدید. من یک دستیار هوش مصنوعی هستم.",
            "language": "fa-IR",
            "style": 0
        },
        {
            "action": "talk",
            "text": "لطفا سوال خود را بپرسید و من سعی می‌کنم کمکتان کنم.",
            "language": "fa-IR",
            "style": 0
        },
        {
            "action": "record",
            "eventUrl": [f"{os.getenv('BASE_URL')}/webhooks/recording"],
            "endOnSilence": 3,
            "beepStart": False
        }
    ]

    print("\nCustom NCCO created:")
    print(custom_ncco)
    print("\nYou can return this from your answer webhook for custom behavior.")


def example_test_transcription():
    """
    Example 4: Test audio transcription separately.
    """
    print("\n" + "=" * 70)
    print("Example 4: Test Audio Transcription")
    print("=" * 70)

    audio_file = input("Enter path to Farsi audio file (MP3, WAV, etc.): ")

    if not os.path.exists(audio_file):
        print(f"File not found: {audio_file}")
        return

    companion = VonageOpenAIVoiceCompanion()

    try:
        transcript = companion.transcribe_audio(audio_file)
        print(f"\n📝 Transcription: {transcript}")
    except Exception as e:
        print(f"\n❌ Error: {e}")


def example_conversation_flow():
    """
    Example 5: Simulate a conversation flow.
    """
    print("\n" + "=" * 70)
    print("Example 5: Simulated Conversation Flow")
    print("=" * 70)

    companion = VonageOpenAIVoiceCompanion(
        model="gpt-4",
        language="fa"
    )

    # Simulate a call
    call_uuid = "test-call-123"

    print("\nSimulating a phone conversation...")
    print("-" * 70)

    # Conversation turns
    user_messages = [
        "سلام، چطوری؟",
        "می‌تونی درباره هوش مصنوعی بگی؟",
        "ممنون، خیلی مفید بود"
    ]

    for i, message in enumerate(user_messages, 1):
        print(f"\n👤 User (turn {i}): {message}")

        try:
            response = companion.chat(call_uuid, message)
            print(f"🤖 AI: {response}")
        except Exception as e:
            print(f"❌ Error: {e}")

    print("\n" + "-" * 70)
    print("Conversation ended.")

    # Save conversation
    companion.save_call_conversation(call_uuid)


def example_multi_language():
    """
    Example 6: Handle both Farsi and English.
    """
    print("\n" + "=" * 70)
    print("Example 6: Multi-language Support")
    print("=" * 70)

    # Start with Farsi
    companion_fa = VonageOpenAIVoiceCompanion(language="fa")
    call_uuid = "multi-lang-test"

    print("\n🇮🇷 Farsi conversation:")
    response = companion_fa.chat(call_uuid, "سلام")
    print(f"   {response}")

    print("\n🇺🇸 English conversation:")
    response = companion_fa.chat(call_uuid, "Can you explain in English?")
    print(f"   {response}")


def example_webhook_testing():
    """
    Example 7: Test webhook locally with sample data.
    """
    print("\n" + "=" * 70)
    print("Example 7: Webhook Testing")
    print("=" * 70)

    print("\nTo test webhooks locally:")
    print("1. Start ngrok: ngrok http 5000")
    print("2. Copy the HTTPS URL (e.g., https://abc123.ngrok.io)")
    print("3. Set BASE_URL environment variable")
    print("4. Update Vonage application webhooks")
    print("5. Make a test call to your Vonage number")

    print("\nWebhook endpoints:")
    base_url = os.getenv("BASE_URL", "https://your-server.com")
    print(f"  - Answer: {base_url}/webhooks/answer")
    print(f"  - Event: {base_url}/webhooks/event")
    print(f"  - Recording: {base_url}/webhooks/recording")

    print("\nTest with curl:")
    print(f"""
curl -X POST {base_url}/webhooks/answer \\
  -H "Content-Type: application/json" \\
  -d '{{"uuid": "test-123", "from": "+12345678900"}}'
    """)


def main():
    """
    Main function - run examples.
    """
    print("\n" + "=" * 70)
    print("Vonage + OpenAI Voice Companion - Examples")
    print("=" * 70)

    examples = [
        ("Start Voice Companion Server", example_start_server),
        ("Make Outbound Call", example_make_call),
        ("Custom Greeting", example_custom_greeting),
        ("Test Audio Transcription", example_test_transcription),
        ("Simulate Conversation", example_conversation_flow),
        ("Multi-language Support", example_multi_language),
        ("Webhook Testing Guide", example_webhook_testing)
    ]

    print("\nAvailable examples:")
    for i, (name, _) in enumerate(examples, 1):
        print(f"{i}. {name}")

    choice = input("\nSelect an example (1-7, or 'q' to quit): ").strip()

    if choice.lower() == 'q':
        print("Goodbye!")
        return

    try:
        idx = int(choice) - 1
        if 0 <= idx < len(examples):
            examples[idx][1]()
        else:
            print("Invalid choice!")
    except ValueError:
        print("Invalid input!")
    except KeyboardInterrupt:
        print("\n\nInterrupted by user.")
    except Exception as e:
        print(f"\nError: {e}")


if __name__ == "__main__":
    main()
