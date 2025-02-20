// components/chat-panel.tsx
import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FormEvent,
} from 'react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { Message, Role } from '@/types/chat';
import { EmptyScreen } from '@/components/empty-screen';
import { ChatMessage } from './chat-message';

interface ChatPanelProps {
  id: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ id }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmptyScreen, setShowEmptyScreen] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const debouncedInputMessage = useDebounce(inputMessage, 500);

  // Placeholder for image generation API call
  const generateImage = async (prompt: string) => {
    // Replace this with your actual API call
    console.log(`Generating image for prompt: ${prompt}`);
    return `https://via.placeholder.com/400x300?text=${encodeURIComponent(
      prompt
    )}`;
    //This is the url of the image, will be display on chat-message.tsx component.
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setInputMessage(value);
  };
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!debouncedInputMessage.trim() || isLoading) return;

    // Check if the user is requesting an image
    if (debouncedInputMessage.toLowerCase().startsWith('/image')) {
        setIsLoading(true);
        const imagePrompt = debouncedInputMessage.substring('/image'.length).trim();
        const enhancedPrompt = await enhancePrompt(imagePrompt); // Enhance the prompt.
        const imageUrl = await generateImage(enhancedPrompt);

        // Display the generated image in the chat
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: String(Date.now()), role: 'user', content: debouncedInputMessage },
          { id: String(Date.now() + 1), role: 'assistant', content: `<img src="${imageUrl}" alt="${enhancedPrompt}" style="max-width: 100%; height: auto;" />` },
        ]);
        setIsLoading(false);
    } else {
        // Standard Chat Interaction
        setIsLoading(true);
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: String(Date.now()), role: 'user', content: debouncedInputMessage },
        ]);
        setInputMessage('');
        // simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: String(Date.now() + 1), role: 'assistant
', content: `You say : ${debouncedInputMessage}` },
        ]);
        setIsLoading(false);
    }
    setInputMessage('');
  };

  // Helper function to enhance the prompt
    const enhancePrompt = async (prompt: string) => {
    // Placeholder: add some descriptive keywords
    const enhancedPrompt = `generate image of : ${prompt} with high resolution, realistic details`;
    return enhancedPrompt;
  };

  // Step 2: Voice Search (Microphone Input)
  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Web Speech API is not supported in your browser.');
      return;
    }
    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.start();
  };

  useEffect(() => {
    if (debouncedInputMessage.trim()) {
      setShowEmptyScreen(false);
    } else if (messages.length === 0) {
      setShowEmptyScreen(true);
    }
  }, [debouncedInputMessage, messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <div className="flex h-full flex-col overflow-y-auto">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            role={message.role}
            message={message.content}
          />
        ))}
        <div ref={chatEndRef} />
      </div>

      {isLoading && (
        <div className="text-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex w-full items-center border-t p-4"
      >
        <button
          type="button"
          onClick={handleVoiceSearch}
          className="mr-2 rounded-full bg-gray-100 p-2 hover:bg-gray-200"
        >
          <svg
            className={`h-5 w-5 ${isRecording ? 'text-red-500' : 'text-gray-500'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H9m0 0a8 8 0 1116 0A8 8 0 019 18m7-13c-3 0-5 1-5 4s2 4 5 4 5-1 5-4-2-4-5-4z"
            />
          </svg>
        </button>
        <textarea
          placeholder="Send a message..."
          value={inputMessage}
          onChange={handleInputChange}
          rows={1}
          className="flex-grow resize-none border-none bg-transparent p-2 focus:outline-none"
        />
        {messages.length === 0 && (
          <EmptyScreen
            submitMessage={message => {
              handleInputChange({
                target: { value: message }
              } as React.ChangeEvent<HTMLTextAreaElement>)
            }}
            className={cn(showEmptyScreen ? 'visible' : 'invisible')}
          />
        )}
      </form>
    </div>
  );
};

export default ChatPanel;
