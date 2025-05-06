import React from 'react';
import Fuse from 'fuse.js';

function SearchInput({ value, onChange, placeholder, data, searchKeys = ['name'] }) {
  const handleChange = (e) => {
    const searchTerm = e.target.value;
    
    if (!searchTerm) {
      onChange({ target: { value: '' } });
      return;
    }

    // Configure Fuse.js for fuzzy search
    const fuse = new Fuse(data || [], {
      keys: searchKeys,
      threshold: 0.3, // Adjust this value to control search sensitivity
      includeScore: true
    });

    const results = fuse.search(searchTerm);
    
    // Pass both the search term and the fuzzy search results
    onChange({
      target: {
        value: searchTerm,
        results: results.map(result => result.item)
      }
    });
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        dir="rtl"
      />
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
        <i className="fas fa-search text-gray-400"></i>
      </div>
    </div>
  );
}

export default SearchInput;
