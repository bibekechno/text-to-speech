// import { useState } from 'react';

// const useAudioUploader = (uploadUrl = 'http://localhost:5000/upload-audio') => {
//   const [uploading, setUploading] = useState(false);
//   const [uploadedUrl, setUploadedUrl] = useState(null);
//   const [error, setError] = useState(null);

//   const uploadAudio = async (audioBlob) => {
//     setUploading(true);
//     setError(null);
//     setUploadedUrl(null);

//     try {
//       const formData = new FormData();
//       formData.append('audio', audioBlob, 'recording.webm');

//       const response = await fetch(uploadUrl, {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();

//       if (response.ok && data.success) {
//         setUploadedUrl(data.filePath);
//       } else {
//         throw new Error(data.message || 'Upload failed');
//       }
//     } catch (err) {
//       console.error(err);
//       setError(err.message);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return { uploadAudio, uploading, uploadedUrl, error };
// };

// export default useAudioUploader;




import { useState } from 'react';

const useAudioUploader = (uploadUrl = 'http://localhost:8000/transcribe') => {
  const [uploading, setUploading] = useState(false);
  const [transcription, setTranscription] = useState(null);
  const [error, setError] = useState(null);

  const uploadAudio = async (audioBlob) => {
    setUploading(true);
    setError(null);
    setTranscription(null);

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setTranscription(data.text);
        console.log(data, "transcription", data.text)
      } else {
        throw new Error(data.error || 'Transcription failed');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return { uploadAudio, uploading, transcription, error, transcription, setTranscription };
};

export default useAudioUploader;

