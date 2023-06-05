import React from 'react';

export interface Token {
  tokenAddress: string;
  balance: string;
  symbol: string;
  name: string;
}

export interface TokenRowProps {
  tokenBalances: Token[];
  handleModalOpen: (token: Token) => void;
  removeToken: (tokenAddress: string, flag: boolean) => void;
}

const TokenRow: React.FC<TokenRowProps> = ({ tokenBalances, handleModalOpen, removeToken }) => {
  return (
    <>
      {tokenBalances.map((token) => (
        <div className="token-row" key={token.tokenAddress}>
          <div className="item">{token.balance}</div>
          <div className="item">{token.symbol}</div>
          <div className="item">{token.name}</div>
          <div className="item">
            <button onClick={() => handleModalOpen(token)} className="submit-button">
              Send
            </button>
            <button onClick={() => removeToken(token.tokenAddress, true)} className="submit-button delete">
              Remove
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default TokenRow;
