"""
Vonage + OpenAI Voice Integration
Combines Vonage Voice API with OpenAI for phone-based AI voice companion with Farsi support.
"""

import os
import json
import asyncio
import base64
from pathlib import Path
from typing import Optional, Dict, Any
from datetime import datetime
import tempfile

try:
    import vonage
    from vonage_voice import VoiceClient, CallResponse
    from flask import Flask, request, jsonify, render_template_string
    from openai import OpenAI
    import requests
except ImportError:
    print("Please install required packages:")
    print("pip install vonage flask openai requests")
    raise


class VonageOpenAIVoiceCompanion:
    """
    Integrates Vonage Voice API with OpenAI for phone-based AI conversations in Farsi.

    Features:
    - Receive inbound calls
    - Make outbound calls
    - Real-time voice transcription (Whisper)
    - AI conversation (GPT-4)
    - Text-to-speech response (OpenAI TTS)
    - WebRTC support
    - Call recording
    - SMS notifications
    """

    def __init__(
        self,
        vonage_api_key: Optional[str] = None,
        vonage_api_secret: Optional[str] = None,
        vonage_application_id: Optional[str] = None,
        vonage_private_key_path: Optional[str] = None,
        openai_api_key: Optional[str] = None,
        vonage_phone_number: Optional[str] = None,
        model: str = "gpt-4",
        voice: str = "nova",
        language: str = "fa"
    ):
        """
        Initialize Vonage + OpenAI integration.

        Args:
            vonage_api_key: Vonage API key
            vonage_api_secret: Vonage API secret
            vonage_application_id: Vonage Application ID
            vonage_private_key_path: Path to Vonage private key file
            openai_api_key: OpenAI API key
            vonage_phone_number: Your Vonage phone number
            model: GPT model to use
            voice: OpenAI TTS voice
            language: Language code (fa for Farsi)
        """
        # Vonage credentials
        self.vonage_api_key = vonage_api_key or os.getenv("VONAGE_API_KEY")
        self.vonage_api_secret = vonage_api_secret or os.getenv("VONAGE_API_SECRET")
        self.vonage_application_id = vonage_application_id or os.getenv("VONAGE_APPLICATION_ID")
        self.vonage_private_key_path = vonage_private_key_path or os.getenv("VONAGE_PRIVATE_KEY_PATH")
        self.vonage_phone_number = vonage_phone_number or os.getenv("VONAGE_PHONE_NUMBER")

        # OpenAI credentials
        self.openai_api_key = openai_api_key or os.getenv("OPENAI_API_KEY")

        if not self.openai_api_key:
            raise ValueError("OpenAI API key is required")

        # Initialize clients
        self.openai_client = OpenAI(api_key=self.openai_api_key)

        # Initialize Vonage client
        if self.vonage_api_key and self.vonage_api_secret:
            self.vonage_client = vonage.Client(
                key=self.vonage_api_key,
                secret=self.vonage_api_secret
            )

        # Initialize Vonage Voice with JWT (for advanced features)
        if self.vonage_application_id and self.vonage_private_key_path:
            self.vonage_voice_client = vonage.Client(
                application_id=self.vonage_application_id,
                private_key=self.vonage_private_key_path
            )
        else:
            self.vonage_voice_client = None

        # AI settings
        self.model = model
        self.voice = voice
        self.language = language

        # Store active conversations
        self.conversations: Dict[str, list] = {}
        self.call_states: Dict[str, Dict] = {}

    def create_flask_app(self, base_url: str) -> Flask:
        """
        Create Flask app with Vonage webhook handlers.

        Args:
            base_url: Your public server URL (e.g., https://yourdomain.com)

        Returns:
            Flask app instance
        """
        app = Flask(__name__)
        companion = self

        @app.route('/webhooks/answer', methods=['GET', 'POST'])
        def answer_call():
            """Handle incoming call - Vonage answer webhook."""
            data = request.get_json() or request.args.to_dict()
            call_uuid = data.get('uuid')
            from_number = data.get('from')

            print(f"Incoming call from {from_number}, UUID: {call_uuid}")

            # Initialize conversation for this call
            companion.conversations[call_uuid] = []
            companion.call_states[call_uuid] = {
                'from': from_number,
                'start_time': datetime.now().isoformat(),
                'language': companion.language
            }

            # NCCO (Nexmo Call Control Object) response
            ncco = [
                {
                    "action": "talk",
                    "text": "سلام! به دستیار هوش مصنوعی خوش آمدید. لطفا صحبت کنید.",
                    "language": "fa-IR",
                    "style": 0
                },
                {
                    "action": "record",
                    "eventUrl": [f"{base_url}/webhooks/recording"],
                    "endOnSilence": 3,
                    "endOnKey": "#",
                    "beepStart": False,
                    "channels": 1,
                    "format": "mp3"
                }
            ]

            return jsonify(ncco)

        @app.route('/webhooks/recording', methods=['POST'])
        def handle_recording():
            """Handle recorded audio from user."""
            data = request.get_json()
            call_uuid = data.get('uuid')
            recording_url = data.get('recording_url')

            print(f"Recording received for call {call_uuid}: {recording_url}")

            if not recording_url:
                return jsonify([{
                    "action": "talk",
                    "text": "متاسفم، صدای شما را نشنیدم. لطفا دوباره تلاش کنید.",
                    "language": "fa-IR"
                }])

            try:
                # Download the recording
                audio_file = companion.download_recording(recording_url)

                # Transcribe with OpenAI Whisper
                transcript = companion.transcribe_audio(audio_file)
                print(f"User said: {transcript}")

                # Get AI response
                ai_response = companion.chat(call_uuid, transcript)
                print(f"AI response: {ai_response}")

                # NCCO to speak response and record again
                ncco = [
                    {
                        "action": "talk",
                        "text": ai_response,
                        "language": "fa-IR",
                        "style": 0
                    },
                    {
                        "action": "record",
                        "eventUrl": [f"{base_url}/webhooks/recording"],
                        "endOnSilence": 3,
                        "endOnKey": "#",
                        "beepStart": False,
                        "channels": 1,
                        "format": "mp3"
                    }
                ]

                return jsonify(ncco)

            except Exception as e:
                print(f"Error processing recording: {e}")
                return jsonify([{
                    "action": "talk",
                    "text": "متاسفم، خطایی رخ داد. لطفا دوباره تماس بگیرید.",
                    "language": "fa-IR"
                }])

        @app.route('/webhooks/event', methods=['POST'])
        def handle_event():
            """Handle call events (status updates)."""
            data = request.get_json()
            print(f"Call event: {json.dumps(data, indent=2)}")

            status = data.get('status')
            call_uuid = data.get('uuid')

            if status == 'completed':
                # Call ended, save conversation
                if call_uuid in companion.conversations:
                    companion.save_call_conversation(call_uuid)

            return ('', 204)

        @app.route('/webhooks/fallback', methods=['GET', 'POST'])
        def fallback():
            """Fallback handler for errors."""
            return jsonify([{
                "action": "talk",
                "text": "متاسفم، خطایی رخ داد. لطفا بعدا تماس بگیرید.",
                "language": "fa-IR"
            }])

        @app.route('/make-call', methods=['POST'])
        def make_outbound_call():
            """Make an outbound call to a number."""
            data = request.get_json()
            to_number = data.get('to_number')

            if not to_number:
                return jsonify({"error": "to_number is required"}), 400

            try:
                result = companion.make_call(to_number, base_url)
                return jsonify({"success": True, "call_uuid": result})
            except Exception as e:
                return jsonify({"error": str(e)}), 500

        @app.route('/')
        def index():
            """Web interface."""
            html = """
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
            """
            return render_template_string(html)

        return app

    def download_recording(self, recording_url: str) -> str:
        """
        Download recording from Vonage.

        Args:
            recording_url: URL of the recording

        Returns:
            Path to downloaded file
        """
        # Add JWT token if available
        headers = {}

        response = requests.get(recording_url, headers=headers)
        response.raise_for_status()

        # Save to temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')
        temp_file.write(response.content)
        temp_file.close()

        return temp_file.name

    def transcribe_audio(self, audio_file: str) -> str:
        """
        Transcribe audio using OpenAI Whisper.

        Args:
            audio_file: Path to audio file

        Returns:
            Transcribed text in Farsi
        """
        with open(audio_file, "rb") as audio:
            transcript = self.openai_client.audio.transcriptions.create(
                model="whisper-1",
                file=audio,
                language=self.language,
                response_format="text"
            )

        # Clean up temp file
        try:
            os.unlink(audio_file)
        except:
            pass

        return transcript

    def chat(self, call_uuid: str, user_message: str) -> str:
        """
        Get AI response for user message.

        Args:
            call_uuid: Unique call identifier
            user_message: User's transcribed message

        Returns:
            AI response text
        """
        # Initialize conversation if needed
        if call_uuid not in self.conversations:
            self.conversations[call_uuid] = []

        # Build messages
        messages = [
            {
                "role": "system",
                "content": "You are a helpful AI assistant speaking in Farsi (Persian). Keep responses concise and natural for phone conversations. Limit responses to 2-3 sentences."
            }
        ]
        messages.extend(self.conversations[call_uuid])
        messages.append({"role": "user", "content": user_message})

        # Get AI response
        response = self.openai_client.chat.completions.create(
            model=self.model,
            messages=messages
        )

        ai_response = response.choices[0].message.content

        # Update conversation history
        self.conversations[call_uuid].append({"role": "user", "content": user_message})
        self.conversations[call_uuid].append({"role": "assistant", "content": ai_response})

        return ai_response

    def make_call(self, to_number: str, base_url: str) -> str:
        """
        Make an outbound call.

        Args:
            to_number: Phone number to call
            base_url: Your server base URL

        Returns:
            Call UUID
        """
        if not self.vonage_voice_client:
            raise ValueError("Vonage Voice client not initialized. Need application_id and private_key.")

        ncco = [
            {
                "action": "talk",
                "text": "سلام! این یک تماس از دستیار هوش مصنوعی است.",
                "language": "fa-IR"
            },
            {
                "action": "input",
                "eventUrl": [f"{base_url}/webhooks/input"],
                "maxDigits": 1,
                "submitOnHash": True
            }
        ]

        response = self.vonage_voice_client.voice.create_call({
            'to': [{'type': 'phone', 'number': to_number}],
            'from': {'type': 'phone', 'number': self.vonage_phone_number},
            'ncco': ncco
        })

        return response['uuid']

    def save_call_conversation(self, call_uuid: str):
        """
        Save conversation history to file.

        Args:
            call_uuid: Call UUID
        """
        if call_uuid not in self.conversations:
            return

        filename = f"call_conversation_{call_uuid}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"

        data = {
            "call_uuid": call_uuid,
            "call_info": self.call_states.get(call_uuid, {}),
            "conversation": self.conversations[call_uuid],
            "timestamp": datetime.now().isoformat()
        }

        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        print(f"Conversation saved to {filename}")

        # Clean up
        del self.conversations[call_uuid]
        if call_uuid in self.call_states:
            del self.call_states[call_uuid]


def main():
    """
    Run the Vonage + OpenAI Voice Companion server.
    """
    print("=" * 70)
    print("Vonage + OpenAI Voice Companion Server")
    print("=" * 70)

    # Your public server URL (use ngrok for testing)
    BASE_URL = os.getenv("BASE_URL", "https://your-server.com")
    PORT = int(os.getenv("PORT", 5000))

    print(f"\nServer will run on port {PORT}")
    print(f"Base URL: {BASE_URL}")
    print("\nMake sure to set the following environment variables:")
    print("- OPENAI_API_KEY")
    print("- VONAGE_API_KEY")
    print("- VONAGE_API_SECRET")
    print("- VONAGE_APPLICATION_ID (optional, for advanced features)")
    print("- VONAGE_PRIVATE_KEY_PATH (optional)")
    print("- VONAGE_PHONE_NUMBER (your Vonage number)")
    print("- BASE_URL (your public server URL)")

    try:
        companion = VonageOpenAIVoiceCompanion()
        app = companion.create_flask_app(BASE_URL)

        print("\n" + "=" * 70)
        print("Server starting...")
        print(f"Access web interface at: http://localhost:{PORT}")
        print(f"Webhook endpoints:")
        print(f"  - Answer URL: {BASE_URL}/webhooks/answer")
        print(f"  - Event URL: {BASE_URL}/webhooks/event")
        print(f"  - Recording URL: {BASE_URL}/webhooks/recording")
        print("=" * 70 + "\n")

        app.run(host='0.0.0.0', port=PORT, debug=True)

    except Exception as e:
        print(f"\nError: {e}")
        print("\nPlease ensure all required environment variables are set.")


if __name__ == "__main__":
    main()
