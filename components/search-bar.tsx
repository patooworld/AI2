import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Mic } from 'lucide-react';


interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleVoiceSearch = (voiceQuery: string) => {
    setQuery(voiceQuery)
    onSearch(voiceQuery)
    setIsListening(false);
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="w-full"
      />
      <Button onClick={handleSearch} variant="outline" className="p-2">
        <Search className="h-4 w-4" />
      </Button>
      <Button onClick={() => setIsListening(!isListening)} variant="outline" className="p-2">
        <Mic className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SearchBar;
