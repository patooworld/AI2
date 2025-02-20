import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import
 { Mic, Loader2, X } from 'lucide-react';

interface MicButtonProps {
  onAudioStream?: (audioStream: MediaStream) => void; // Receive the audio stream
  onTranscript?: (transcript: string) => void; // Receive transcript updates
}

const MicButton: React.FC<MicButtonProps> = ({ onAudioStream, onTranscript }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([]);

  useEffect(() => {
    if (mediaRecorder) {
      mediaRecorder.ondataavailable = (event) => {
        setAudioChunks((prevChunks) => [...prevChunks, event.data]);
      };
    }
  }, [mediaRecorder]);

  useEffect(() => {
    if (mediaRecorder && mediaRecorder.state === 'inactive') {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      
// Here you can handle the recorded audio blob, e.g., send to server
      console.log('Recorded audio:', audioBlob);

      setAudioChunks([]); // Clear chunks after processing

      // You can potentially send the blob to a backend for processing or to your `generateAudioStream` function.

    }
  }, [mediaRecorder, audioChunks]);
  const startRecording = async () => {
    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (onAudioStream) {
        onAudioStream(stream);
      }

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsLoading(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="icon"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isRecording ? (
        <X className="h-4 w-4" alt="Stop recording" />
      ) : (
        <Mic className="h-4 w-4" alt="microphone button" />
      )}
    </Button>
  );
};

export default MicButton;
