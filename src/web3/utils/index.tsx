import Web3 from 'web3';

const provider = new Web3.providers.HttpProvider(
  `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`,
);
const web3 = new Web3(provider);

export const createWeb3Instance = (privateKey: string): [Web3, string] => {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);
  const address = web3.eth.accounts.wallet[0].address;

  return [web3, address];
};

export const balanceEth = (balanceWei: string): string => web3.utils.fromWei(balanceWei, 'ether');

export const isEmpty = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
};
