import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const location = useLocation();
  const isHindi = location.pathname.startsWith('/hi');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-zinc-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={isHindi ? "कैलकुलेटर खोजें (जैसे: EMI, ROI...)" : "Search for a calculator (e.g. BMI, Mortgage...)"}
        className="block w-full pl-12 pr-12 py-4 bg-white border border-zinc-200 rounded-2xl focus:ring-4 focus:ring-zinc-100 focus:border-zinc-400 outline-none transition-all text-lg text-zinc-900 shadow-sm"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-zinc-600"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
