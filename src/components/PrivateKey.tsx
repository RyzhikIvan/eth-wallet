import React, { useState, ChangeEvent, FormEvent } from 'react';

interface PrivateKeyProps {
  setPrivateKey: (privateKey: string) => void;
  privateKey: string;
}

const PrivateKey: React.FC<PrivateKeyProps> = ({ setPrivateKey, privateKey }) => {
  const [privateKeyInput, setPrivateKeyInput] = useState('');

  const handlePrivateKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrivateKeyInput(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPrivateKey(privateKeyInput);
  };

  if (privateKey) return <></>;

  return (
    <div className="absolute-wrapper">
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-wrapper">
          <label htmlFor="password" className="label">
            Please, enter your wallet private key
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="key-input"
            required
            autoFocus
            autoComplete="new-password"
            value={privateKeyInput}
            onChange={handlePrivateKeyChange}
          />
          <p className="additional">This private key will not be saved anywhere! </p>
          {privateKeyInput.length === 64 && (
            <button className="submit-button" type="submit">
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PrivateKey;
