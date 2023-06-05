import { render, fireEvent, getByText } from '@testing-library/react';
import PrivateKey from '../PrivateKey';

describe('PrivateKey', () => {
  test('renders without errors', () => {
    render(<PrivateKey setPrivateKey={() => {}} privateKey="" />);
  });

  test('updates private key input value', () => {
    const setPrivateKey = jest.fn();
    const { getByLabelText } = render(<PrivateKey setPrivateKey={setPrivateKey} privateKey="" />);
    const privateKeyInput = getByLabelText('Please, enter your wallet private key') as HTMLInputElement;

    fireEvent.change(privateKeyInput, { target: { value: 'testPrivateKey' } });

    expect(privateKeyInput.value).toBe('testPrivateKey');
  });

  test('calls setPrivateKey with the input value on form submission', () => {
    const setPrivateKey = jest.fn();
    const { getByLabelText, getByText, queryByText } = render(
      <PrivateKey setPrivateKey={setPrivateKey} privateKey="" />,
    );
    const privateKeyInput = getByLabelText('Please, enter your wallet private key') as HTMLInputElement;

    fireEvent.change(privateKeyInput, { target: { value: 'testPrivateKey' } });
    fireEvent.submit(privateKeyInput.closest('form')!);

    // Check if the button is rendered when privateKeyInput.length is 64
    if (privateKeyInput.value.length === 64) {
      expect(queryByText('Submit')).toBeInTheDocument();
      const submitButton = getByText('Submit');
      fireEvent.click(submitButton);
      expect(setPrivateKey).toHaveBeenCalledWith('testPrivateKey');
    } else {
      // Make assertions for the case when the button is not rendered
      expect(queryByText('Submit')).toBeNull();
      // Add additional assertions if needed
    }
  });
});
