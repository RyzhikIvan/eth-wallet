import React from 'react';
import CustomToken from './CustomToken';

interface TopPanelProps {
  balance: string;
  customTokens: string[];
  addCustomToken: (tokenAddress: string) => void;
}

const TopPanel: React.FC<TopPanelProps> = ({ balance, customTokens, addCustomToken }) => {
  return (
    <div className="top-panel">
      <div>
        <h2>ETH Balance</h2>
        <p>{balance} ETH</p>
      </div>
      <CustomToken customTokens={customTokens} addCustomToken={addCustomToken} />
    </div>
  );
};

export default TopPanel;
