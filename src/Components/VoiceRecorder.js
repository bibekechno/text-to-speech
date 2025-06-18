import React, { useState, useRef, useEffect } from 'react';
import { saveAs } from 'file-saver';
import useAudioUploader from '../hooks/useAudioUploader';
import { TailSpin } from 'react-loader-spinner';

const VoiceRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const { uploadAudio, uploading, uploadedUrl, error, transcription, setTranscription } = useAudioUploader();

  useEffect(() => {
    if (transcription) {
      const utterance = new SpeechSynthesisUtterance(transcription);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  }, [transcription]);

  const startRecording = async () => {
    setTranscription(null)
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
    //   saveAs(audioBlob, 'recorded_audio.webm');
      audioChunksRef.current = [];

      uploadAudio(audioBlob);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>Voice Recorder</h2>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "🛑 Stop Recording" : "🎤 Start Recording"}
      </button>
      {/* {audioURL && (
        <div style={{ marginTop: 20 }}>
          <h4>Playback</h4>
          <audio controls src={audioURL}></audio>
        </div>
      )} */}

      {uploading && !transcription && (
        <div
          style={{
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TailSpin
            visible={true}
            height="40"
            width="40"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
          />
          <p>Processing audio...</p>
        </div>
      )}

      {transcription && (
        <div style={{ marginTop: 10 }}>
          <h4>Transcription</h4>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
