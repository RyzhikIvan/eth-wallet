import React, { useState, ChangeEvent, FormEvent } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Loader from './Loader';

import 'react-toastify/dist/ReactToastify.css';

interface TransferTokensProps {
  address: string;
  web3Data: any;
  currentToken: {
    tokenAddress: string;
    balance: string;
    name: string;
    symbol: string;
  };
  onRequestClose: () => void;
}

const TransferTokens: React.FC<TransferTokensProps> = ({
  address,
  web3Data,
  currentToken,
  onRequestClose,
}) => {
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [pendingStatus, setPendingStatus] = useState(false);

  const handleTransferAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTransferAmount(e.target.value);
  };

  const handleRecipientAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRecipientAddress(e.target.value);
  };

  // Transferring tokens through the contract
  const handleTransferTokens = async (e: FormEvent) => {
    e.preventDefault();
    setPendingStatus(true);

    try {
      const contract = new web3Data.eth.Contract(
        require('../web3/abi/erc20.json'),
        currentToken.tokenAddress,
      );
      const amountWei = web3Data.utils.toWei(transferAmount, 'ether');

      // Perform the token transfer
      const gasEstimate = await contract.methods
        .transfer(recipientAddress, amountWei)
        .estimateGas({ from: web3Data.eth.accounts.wallet[0].address });

      await contract.methods
        .transfer(recipientAddress, amountWei)
        .send({ from: web3Data.eth.accounts.wallet[0].address, gas: gasEstimate });

      toast.success('Successful transfer');
      onRequestClose();
    } catch (error) {
      console.error('Error performing token transfer:', error);
      toast.error('Transfer failed!');
    } finally {
      setPendingStatus(false);
    }

    setTransferAmount('');
    setRecipientAddress('');
  };

  const transferValidation = (): boolean => {
    if (
      transferAmount === '' ||
      +transferAmount > +currentToken.balance ||
      recipientAddress.length < 42 ||
      address === recipientAddress ||
      pendingStatus
    ) {
      return true;
    }
    return false;
  };

  const handleErrorMessage = (): string | undefined => {
    if (+transferAmount > +currentToken.balance) return 'Not enough funds';
    if (address === recipientAddress) return 'This is your address';
    if (recipientAddress.length > 0 && recipientAddress.length < 42) return 'This address is not correct';
    return undefined;
  };

  return (
    <div className="wrapper">
      <ToastContainer position="bottom-right" />
      <div className="form custom-tokens">
        <input
          type="text"
          className="key-input"
          placeholder="Recipient Address"
          value={recipientAddress}
          onChange={handleRecipientAddressChange}
        />
        <input
          className="key-input"
          placeholder="Amount"
          type="text"
          value={transferAmount}
          onChange={handleTransferAmountChange}
        />
        <p className="validation-error">{handleErrorMessage()}</p>
        {pendingStatus ? (
          <Loader />
        ) : (
          <button
            onClick={handleTransferTokens}
            className={`submit-button ${transferValidation() ? 'disabled' : ''}`}
            type="submit"
          >
            Transfer
          </button>
        )}
      </div>
    </div>
  );
};

export default TransferTokens;
