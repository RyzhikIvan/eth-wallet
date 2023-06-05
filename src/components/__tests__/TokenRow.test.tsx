import { render, fireEvent } from '@testing-library/react';
import TokenRow, { Token, TokenRowProps } from '../TokenRow';

const mockTokenBalances: Token[] = [
  {
    tokenAddress: '0x123abc',
    balance: '10',
    symbol: 'ABC',
    name: 'Token ABC',
  },
];

describe('TokenRow renderind', () => {
  const mockHandleModalOpen = jest.fn();
  const mockRemoveToken = jest.fn();

  const renderComponent = (props: Partial<TokenRowProps> = {}) => {
    const defaultProps: TokenRowProps = {
      tokenBalances: mockTokenBalances,
      handleModalOpen: mockHandleModalOpen,
      removeToken: mockRemoveToken,
    };
    return render(<TokenRow {...defaultProps} {...props} />);
  };

  test('renders tokens correctly', () => {
    const { getByText } = renderComponent();
    const tokenABC = getByText('Token ABC');
    expect(tokenABC).toBeTruthy();
  });

  test('calls handleModalOpen with correct token when "Send" button is clicked', () => {
    const { getByText } = renderComponent();
    const sendButtonABC = getByText('Send', { selector: '.submit-button' });

    fireEvent.click(sendButtonABC);
    expect(mockHandleModalOpen).toHaveBeenCalledWith(mockTokenBalances[0]);
  });

  test('calls removeToken with correct token address and flag when "Remove" button is clicked', () => {
    const { getByText } = renderComponent();
    const removeButtonABC = getByText('Remove', { selector: '.submit-button.delete' });

    fireEvent.click(removeButtonABC);
    expect(mockRemoveToken).toHaveBeenCalledWith(mockTokenBalances[0].tokenAddress, true);
  });
});
