import React from 'react';
import Modal from 'react-modal';

interface ModalComponentProps {
  isOpen: boolean;
  onRequestClose: () => void;
  currentToken: {
    name: string;
    balance: string;
    symbol: string;
  };
  children: React.ReactNode;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  isOpen,
  onRequestClose,
  currentToken,
  children,
}) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Modal"
    ariaHideApp={false}
    className={{
      base: 'modal-base',
      afterOpen: 'modal-base_after-open',
      beforeClose: 'modal-base_before-close',
    }}
    overlayClassName={{
      base: 'overlay-base',
      afterOpen: 'overlay-base_after-open',
      beforeClose: 'overlay-base_before-close',
    }}
    shouldCloseOnOverlayClick={true}
    closeTimeoutMS={2000}
  >
    <p className="modal-title">
      Transferring {currentToken.name}. Your balance: {currentToken.balance} {currentToken.symbol}
    </p>
    {children}
  </Modal>
);

export default ModalComponent;
