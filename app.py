from flask import Flask, request, jsonify
from flask_cors import CORS
from faster_whisper import WhisperModel
import os
import tempfile

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains

# Load Whisper model once using CPU
model = WhisperModel("base", device="cpu", compute_type="int8")

@app.route("/transcribe", methods=["POST"])
def transcribe_audio():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    # Save the uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        file.save(tmp.name)
        temp_path = tmp.name

    try:
        # Transcribe using faster-whisper
        segments, info = model.transcribe(temp_path, task="translate")
        transcription = " ".join([segment.text for segment in segments])
        return jsonify({
            "language": info.language,
            "text": transcription
        })

    finally:
        os.remove(temp_path)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
