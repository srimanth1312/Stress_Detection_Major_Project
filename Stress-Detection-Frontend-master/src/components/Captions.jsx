import React, { useState } from 'react';
import "../styles/captions.css"
const Captions = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const handleToggleListening = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;

    recognition.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Transcript:', transcript);
      setTranscript(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
    //   setIsListening(false);
    recognition.start()
      
    };

    recognition.start();
    setRecognition(recognition);
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  return (
    <div className='captions'>
      <div>

      <input
        type="checkbox"
        id="listeningCheckbox"
        checked={isListening}
        onChange={handleToggleListening}
        />
      <label htmlFor="listeningCheckbox">Live Captions &nbsp;</label>
        </div>
      <div>
        {/* <p>Captions:</p> */}
        <p>{transcript}</p>
      </div>
    </div>
  );
};

export default Captions;
