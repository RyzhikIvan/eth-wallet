/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Loader from './Loader';

import { balanceEth } from '../web3/utils';

import { transactionColumns } from '../constants';

interface Transaction {
  value: string;
  tokenName?: string;
  tokenSymbol?: string;
  to: string;
  from: string;
  hash: string;
  timeStamp: number;
}

interface TransactionHistoryProps {
  privateKey: string | undefined;
  web3Data: any;
  address: string | undefined;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ privateKey, web3Data, address }) => {
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([]);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    // STEP-1 get all transactions from the etherscan by wallet address
    const fetchTransactions = async () => {
      try {
        const apiEndpoint = `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`; // Replace with your Etherscan API key
        const response = await fetch(apiEndpoint);
        const result = await response.json();

        if (result.status === '1') {
          setTransactionHistory(result.result);
          findEmptyValues(result.result);
        }
        if (result.result.length === 0) setNoData(true);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    if (privateKey && address) {
      fetchTransactions();
    }
  }, [web3Data, address]);

  // STEP-2 from empty values collect to array all contract addresses of custom tokens
  const findEmptyValues = (history: Transaction[]) => {
    const contractAddresses: string[] = [];
    history.forEach((transaction) => {
      if (transaction.value === '0' && !contractAddresses.includes(transaction.to)) {
        contractAddresses.push(transaction.to);
      }
    });
    getAllValues(contractAddresses, history);
  };

  // STEP-3 Mapping through addresses array to get data
  const getAllValues = async (contractAddress: string[], history: Transaction[]) => {
    try {
      let transactionsFromContracts: Transaction[] = [];
      await Promise.all(
        contractAddress.map(async (item) => {
          const res = await getValue(item);
          transactionsFromContracts = [...transactionsFromContracts, ...res.result];
          return transactionsFromContracts;
        }),
      );
      updateTransactions(transactionsFromContracts, history);
    } catch (error) {
      console.log('error', error);
    }
  };

  // STEP-4 Get transactions from each custom token address
  const getValue = async (contractAddress: string) => {
    try {
      const apiEndpoint = `https://api-goerli.etherscan.io/api?module=account&action=tokentx&contractaddress=${contractAddress}&address=${address}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`; // Replace with your Etherscan API key
      const response = await fetch(apiEndpoint);
      const transactions = await response.json();
      return transactions;
    } catch (error) {
      console.log('error', error);
    }
  };

  // STEP-5
  const updateTransactions = (transactionsFromContracts: Transaction[], history: Transaction[]) => {
    let newTransactionsArray: Transaction[] = [...history];

    // add aditional information to transactions - values, names and symbols
    newTransactionsArray.map((transaction) => {
      const currentTransaction = transactionsFromContracts.find((item) => item.hash === transaction.hash);
      if (currentTransaction) {
        transaction.value = currentTransaction.value;
        transaction.tokenName = currentTransaction.tokenName;
        transaction.tokenSymbol = currentTransaction.tokenSymbol;
      }
      return transaction;
    });

    // Add to transactions list token ERC20 transfers
    transactionsFromContracts.forEach((item) => {
      if (!newTransactionsArray.find((transaction) => transaction.hash === item.hash)) {
        newTransactionsArray.push(item);
      }
    });

    // Sort arrays by date
    const sortedArray = newTransactionsArray.sort((a, b) => b.timeStamp - a.timeStamp);
    setTransactionHistory(sortedArray);
  };

  if (!address) return <></>;

  return (
    <div className="wrapper transactions">
      <h2>Wallet transactions history</h2>
      {transactionHistory.length > 0 ? (
        <div>
          <div className="table-header">
            {transactionColumns.map((column) => (
              <div key={column} className="item">
                {column}
              </div>
            ))}
          </div>
          <div className="table-body">
            {transactionHistory.map((transaction) => (
              <div className="token-row" key={transaction.hash}>
                <div
                  className={`item ${transaction.to.toLowerCase() === address.toLowerCase() ? 'green' : ''}`}
                >
                  {`${balanceEth(transaction.value)} ${
                    transaction.tokenSymbol ? transaction.tokenSymbol : 'Eth'
                  }`}
                </div>
                <div className="item">
                  <a
                    target="_blank"
                    href={`https://goerli.etherscan.io/address/${transaction.from}`}
                    rel="noreferrer"
                  >
                    {transaction.from}
                  </a>
                </div>
                <div className="item">
                  <a
                    target="_blank"
                    href={`https://goerli.etherscan.io/address/${transaction.to}`}
                    rel="noreferrer"
                  >
                    {transaction.to}
                  </a>
                </div>
                <div className="item">
                  <a
                    target="_blank"
                    href={`https://goerli.etherscan.io/tx/${transaction.hash}`}
                    rel="noreferrer"
                  >
                    {transaction.hash}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : noData ? (
        <p>No transactions</p>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default TransactionHistory;
