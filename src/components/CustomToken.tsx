import React, { useState, FormEvent } from 'react';

interface CustomTokenProps {
  addCustomToken: (tokenAddress: string) => void;
  customTokens: string[];
}

const CustomToken: React.FC<CustomTokenProps> = ({ addCustomToken, customTokens }) => {
  const [tokenAddressInput, setTokenAddressInput] = useState('');

  const handleTokenAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenAddressInput(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addCustomToken(tokenAddressInput);
    setTokenAddressInput('');
  };

  const transferValidation = () => {
    if (tokenAddressInput.length < 42 || customTokens.includes(tokenAddressInput)) return true;
    return false;
  };

  return (
    <form className="custom-tokens add-token" onSubmit={handleSubmit}>
      <input
        className="key-input"
        type="text"
        placeholder="Add Custom Token"
        value={tokenAddressInput}
        onChange={handleTokenAddressChange}
      />
      <button className={`submit-button ${transferValidation() ? 'disabled' : ''}`} type="submit">
        Add
      </button>
    </form>
  );
};

export default CustomToken;
