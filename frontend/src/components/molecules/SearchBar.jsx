import React from 'react';
import Input from '../atoms/Input';

const SearchBar = ({ value, onChange, placeholder = 'Cari data...', onKeyDown }) => (
  <Input
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    placeholder={placeholder}
    icon="🔍"
    style={{ minWidth: '260px' }}
  />
);

export default SearchBar;
