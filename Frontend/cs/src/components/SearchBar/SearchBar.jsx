import React from 'react';
import './SearchBar.css';

const SearchBar = ({ placeholder, onChange }) => {
  return (
    <div className="search-bar">
      <svg className='search-icon' xmlns="http://www.w3.org/2000/svg" width="40px" fill="none" viewBox="0 0 24 24" stroke="#aacbe2" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      <input type="text" placeholder={placeholder} onChange={onChange} />
    </div>
  );
};

export default SearchBar;
