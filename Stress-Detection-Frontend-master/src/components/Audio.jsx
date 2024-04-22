import React, { useState, useRef } from 'react';
import axios from 'axios';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const startRecording = () => {
    const stream = navigator.mediaDevices.getUserMedia({ audio: true });
    stream.then(mediaStream => {
      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];
      mediaRecorder.ondataavailable = event => {
        chunks.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setRecordedBlob(blob);
        sendAudioToAPI(blob);
      };
      mediaRecorder.start();
      setIsRecording(true);
    }).catch(error => {
      console.error('Error accessing media devices:', error);
    });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = () => {
    if (audioRef.current && recordedBlob) {
      const audioURL = URL.createObjectURL(recordedBlob);
      audioRef.current.src = audioURL;
      audioRef.current.play();
    }
  };

  const sendAudioToAPI = (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    axios.post('http://127.0.0.1:3000/upload-audio', formData)
      .then(response => {
        console.log('Audio uploaded successfully:', response.data);
        // Handle response if needed
      })
      .catch(error => {
        console.error('Error uploading audio:', error);
        // Handle error if needed
      });
  };

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      <button onClick={playAudio} disabled={!recordedBlob}>
        Play Audio
      </button>
      <audio ref={audioRef} controls />
    </div>
  );
};

export default AudioRecorder;
