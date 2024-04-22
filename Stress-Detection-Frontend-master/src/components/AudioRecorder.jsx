
import React, { useState, useRef,useEffect } from 'react';
import axios from 'axios';
import "../styles/AudioRecorder.css"
import LiveCaptions from './Captions';
const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [emotion,setEmotion] = useState("...")
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
      sendAudioToAPI(recordedBlob)
    }
  };

  const playAudio = () => {
    if (audioRef.current && recordedBlob) {
      const audioURL = URL.createObjectURL(recordedBlob);
      audioRef.current.src = audioURL;
      audioRef.current.play();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isRecording) {
        stopRecording();
        console.log("audio sent after 5s");
        startRecording();
      }
    }, 5000); // Send audio every 5 seconds
    return () => clearInterval(interval); // Cleanup function to clear interval
  }, [isRecording]);

  const sendAudioToAPI = (audioBlob) => {
    setEmotion("...")
    const formData = new FormData();
    formData.append('audio', audioBlob);

    axios.post('http://127.0.0.1:5000/upload-audio', formData)
      .then(response => {
        console.log('Audio uploaded successfully:', response.data);
        // Handle response if needed
        setEmotion(response.data)
      })
      .catch(error => {
        console.error('Error uploading audio:', error);
        // Handle error if needed
      });
  };

  return (
    <div className="audio">
      <p className="audio-heading">Audio Input</p>
      <div className="audio-container">

    <div className='audio-buttons'>
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      {/* <button onClick={playAudio} disabled={!recordedBlob}>
        Play Audio
      </button> */}
    </div>
    {/* {recordedBlob &&
      <audio ref={audioRef} controls />} */}
      <p className="audio-output">
        Audio Emotion : {emotion}
      </p>
      </div>
      <LiveCaptions/>
    </div>
  );
};

export default AudioRecorder;
