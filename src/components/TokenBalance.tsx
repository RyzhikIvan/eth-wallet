/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import Modal from './Modal';
import Loader from './Loader';
import TransferTokens from './TransferTokens';
import TokenRow from './TokenRow';

import { tokenColumns } from '../constants';
import { isEmpty } from '../web3/utils';

interface CustomToken {
  tokenAddress: string;
  balance: string;
  name: string;
  symbol: string;
}

interface TokenBalanceProps {
  address: string;
  privateKey: string;
  customTokens: string[];
  web3Data: any;
  removeToken: (tokenAddress: string, flag: boolean) => void;
}

const TokenBalance: React.FC<TokenBalanceProps> = ({
  address,
  privateKey,
  customTokens,
  web3Data,
  removeToken,
}) => {
  const [tokenBalances, setTokenBalances] = useState<CustomToken[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentToken, setCurrentToken] = useState<any>({});

  useEffect(() => {
    const fetchTokenBalances = async () => {
      let currentAddress = '';
      try {
        const balances = await Promise.all(
          customTokens.map(async (tokenAddress) => {
            currentAddress = tokenAddress;
            const [balance, name, symbol] = (await fetchTokenBalance(tokenAddress)) ?? ['', '', ''];
            return { tokenAddress, balance, name, symbol };
          }),
        );
        setTokenBalances(balances);
      } catch (error) {
        removeToken(currentAddress, false);
        console.log('error', error);
      }
    };

    if (privateKey && customTokens.length > 0 && !isEmpty(web3Data)) {
      fetchTokenBalances();
    }
  }, [privateKey, customTokens, web3Data]);

  // Get custom tokens balance from the contract
  const fetchTokenBalance = async (tokenAddress: string) => {
    try {
      const contract = new web3Data.eth.Contract(require('../web3/abi/erc20.json'), tokenAddress);
      const address: string = web3Data.eth.accounts.wallet[0].address;
      const balance: string = await contract.methods.balanceOf(address).call();
      const name = await contract.methods.name().call();
      const symbol: string = await contract.methods.symbol().call();
      const balanceEth = web3Data.utils.fromWei(balance, 'ether');
      return [balanceEth, name, symbol];
    } catch (error) {
      console.error('Error fetching token balance:', error);
    }
  };

  const handleModalOpen = (token: CustomToken) => {
    setCurrentToken(token);
    setIsModalOpen(true);
  };

  const onModalClose = () => {
    setIsModalOpen(!isModalOpen);
  };

  if (!customTokens.length) return <></>;

  return (
    <div className="wrapper custom-tokens">
      <h2>ERC20 Custom Tokens</h2>
      {tokenBalances.length > 0 ? (
        <>
          <div className="table-header">
            {tokenColumns.map((column) => (
              <div key={column} className="item">
                {column}
              </div>
            ))}
          </div>
          <TokenRow
            tokenBalances={tokenBalances}
            handleModalOpen={handleModalOpen}
            removeToken={removeToken}
          />
        </>
      ) : (
        <Loader />
      )}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} currentToken={currentToken} onRequestClose={onModalClose}>
          <TransferTokens
            onRequestClose={onModalClose}
            address={address}
            currentToken={currentToken}
            web3Data={web3Data}
          />
        </Modal>
      )}
    </div>
  );
};

export default TokenBalance;
