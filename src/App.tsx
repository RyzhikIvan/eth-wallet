import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { createWeb3Instance, balanceEth } from './web3/utils';

import PrivateKey from './components/PrivateKey';
import TokenBalance from './components/TokenBalance';
import TransactionHistory from './components/TransactionHistory';
import TopPanel from './components/TopPanel';

const App: React.FC = () => {
  // You can paste your private key here for more easiest testing
  const [privateKey, setPrivateKey] = useState('');
  const [customTokens, setCustomTokens] = useState<string[]>([]);
  const [web3Data, setWeb3Data] = useState<any>({});
  const [balance, setBalance] = useState<string>('0');
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    const tokens = JSON.parse(localStorage.getItem('customTokens') || '[]');
    if (tokens) setCustomTokens(tokens);
  }, []);

  const addCustomToken = (tokenAddress: string) => {
    setCustomTokens([...customTokens, tokenAddress]);
    localStorage.setItem('customTokens', JSON.stringify([...customTokens, tokenAddress]));
  };

  const removeCustomToken = (tokenAddress: string, flag: boolean) => {
    const filteredArray = customTokens.filter((item) => item !== tokenAddress);
    setCustomTokens(filteredArray);
    localStorage.setItem('customTokens', JSON.stringify(filteredArray));

    // For errors showing
    if (flag) toast.success('Token was removed');
    else toast.error('Provided address is invalid');
  };

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const [web3, address] = createWeb3Instance(privateKey);

        const balanceWei = await web3.eth.getBalance(address);
        const balance = balanceEth(balanceWei);

        setWeb3Data(web3);
        setBalance(balance);
        setAddress(address);
      } catch (error) {
        console.log('error', error);
        console.error('Error fetching wallet balance:', error);
      }
    };

    if (privateKey) {
      fetchWalletBalance();
    }
  }, [privateKey]);

  return (
    <div className="container">
      <PrivateKey setPrivateKey={setPrivateKey} privateKey={privateKey} />
      <ToastContainer position="bottom-right" />
      {privateKey && (
        <>
          <TopPanel balance={balance} customTokens={customTokens} addCustomToken={addCustomToken} />
          <TokenBalance
            address={address}
            web3Data={web3Data}
            privateKey={privateKey}
            customTokens={customTokens}
            removeToken={removeCustomToken}
          />
          <TransactionHistory privateKey={privateKey} web3Data={web3Data} address={address} />
        </>
      )}
    </div>
  );
};

export default App;
