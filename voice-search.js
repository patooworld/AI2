import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface VoiceSearchProps {
  onVoiceSearch: (text: string) => void;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onVoiceSearch }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isError, setIsError] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null); 

  const startRecording = useCallback(async () => {
    setIsError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });  
      streamRef.current = stream;

       // SpeechRecognition setup
       const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
       if (!SpeechRecognition) {
         console.error('Speech recognition API not supported in this browser.');
         setIsError(true);
         setIsRecording(false);
         return;
       }
       const recognition = new SpeechRecognition();
       recognitionRef.current = recognition;

       recognition.lang = 'en-US';
       recognition.continuous = false;
       recognition.interimResults = false;
      
       recognition.onresult = (event: SpeechRecognitionEvent) => {
         const transcript = event.results[0][0].transcript;
         onVoiceSearch(transcript);
         setIsRecording(false);
       };
      
       recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
         console.error('Speech recognition error:', event.error);
         setIsError(true);
         setIsRecording(false);
       };
       recognition.onend=()=>{
        setIsRecording(false);
       }
       recognition.start();
      setIsRecording(true);
     
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsError(true);
      setIsRecording(false);
    }
  }, [onVoiceSearch]);
  
  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  //Cleanup function
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if(recognitionRef.current){
        recognitionRef.current.abort();
      }
    };
  }, []);

  const buttonClass = useMemo(() => {
    return `p-2 rounded-full focus:outline-none ${isRecording ? 'animate-pulse bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`;
  }, [isRecording]);

  return (
    <div>
      <button
        className={`p-2 rounded-full focus:outline-none ${
          isRecording ? 'animate-pulse bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
        }`}
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        disabled={isRecording}
      >
        {isRecording ? 'Listening...' : 'Start Voice Search'}
      </button>
      {isError && <p className="text-red-500">Error in voice search.</p>}
    </div>
  );
};

export default VoiceSearch;
