import React from 'react';

const SearchBar = ({ onSearch }) => {
  return (
    <div className='ui icon input fluid'>
      <input
        autoFocus
        type='text'
        placeholder='Search ...'
        onChange={onSearch}
      />
      <i className='search icon'></i>
    </div>
  );
};

export default SearchBar;
